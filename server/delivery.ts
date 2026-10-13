import { confirmation, notification, send, type Mailer } from "./email";
import type { EnquiryValues, FormKind } from "../src/lib/enquiry-schema";

type Stored = {
  id: string;
  kind: FormKind;
  name: string;
  email: string;
  details: string;
  instagram: string | null;
  consent_at: string | null;
};
type Job = { id: string; role: "team" | "sender"; site_origin: string };

/** Include these in the same D1 batch as the enquiry insert. */
export function deliveryStatements(db: D1Database, id: string, site: string) {
  return ["team", "sender"].map((role) =>
    db
      .prepare(
        `INSERT INTO enquiry_deliveries (id, enquiry_id, role, site_origin)
     SELECT ?, id, ?, ? FROM enquiries WHERE id = ? ON CONFLICT(id) DO NOTHING`,
      )
      .bind(`${id}:${role}`, role, site, id),
  );
}

export async function deliverEnquiry(
  db: D1Database,
  mailer: Mailer & { notify: string },
  id: string,
  sendMessage = send,
) {
  const stored = await db
    .prepare("SELECT * FROM enquiries WHERE id = ?")
    .bind(id)
    .first<Stored>();
  if (!stored) return;
  const jobs = await db
    .prepare(
      "SELECT id, role, site_origin FROM enquiry_deliveries WHERE enquiry_id = ? AND status != 'sent' AND status != 'suppressed'",
    )
    .bind(id)
    .all<Job>();
  const report = stored.kind === "report";
  const values: EnquiryValues = {
    ...JSON.parse(stored.details),
    [report ? "report-name" : "name"]: stored.name,
    [report ? "report-email" : "email"]: stored.email,
    instagram: stored.instagram ?? "",
    consent: Boolean(stored.consent_at),
  };
  await Promise.all(
    jobs.results.map(async (job) => {
      const claimed = await db
        .prepare(
          `UPDATE enquiry_deliveries SET status = 'sending', attempts = attempts + 1, last_attempt_at = datetime('now')
       WHERE id = ? AND attempts < 5 AND
         (status IN ('pending', 'failed') OR (status = 'sending' AND last_attempt_at < datetime('now', '-2 minutes')))
       RETURNING id`,
        )
        .bind(job.id)
        .first();
      if (!claimed) return;
      let status: "sent" | "failed" | "suppressed" = "failed";
      let error: string | null = null;
      try {
        // Fail closed: a failed suppression query must never trigger a send.
        const stopped =
          job.role === "sender" &&
          (await db
            .prepare(
              "SELECT 1 FROM enquiries WHERE email = ? AND unsubscribed_at IS NOT NULL LIMIT 1",
            )
            .bind(stored.email)
            .first());
        if (stopped) status = "suppressed";
        else if (!mailer.apiKey) error = "missing_api_key";
        else {
          const message =
            job.role === "team"
              ? {
                  to: mailer.notify,
                  ...notification(
                    stored.kind,
                    stored.name,
                    stored.email,
                    values,
                    id,
                  ),
                }
              : {
                  to: stored.email,
                  ...confirmation(
                    stored.kind,
                    stored.name,
                    values,
                    job.site_origin,
                    id,
                  ),
                };
          status = (await sendMessage(mailer, message, job.id))
            ? "sent"
            : "failed";
          if (status === "failed") error = "provider_rejected_or_unreachable";
        }
      } catch {
        error = "delivery_or_suppression_check_failed";
      }
      await db
        .prepare(
          `UPDATE enquiry_deliveries SET status = ?, last_error = ?, sent_at = CASE WHEN ? = 'sent' THEN datetime('now') ELSE sent_at END WHERE id = ?`,
        )
        .bind(status, error, status, job.id)
        .run();
    }),
  );
}
