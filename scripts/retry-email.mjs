import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { deliverEnquiry } from "../server/delivery.ts";

const args = new Set(process.argv.slice(2));
const production = args.has("--production");
const sending = args.has("--send");
if (production && sending && !args.has("--confirm-production"))
  throw new Error("Production sends require --confirm-production.");
if (sending && !process.env.RESEND_API_KEY)
  throw new Error("Set RESEND_API_KEY before sending. It is never printed.");
const require = createRequire(import.meta.url);
const cli = join(
  dirname(require.resolve("wrangler/package.json")),
  "bin",
  "wrangler.js",
);
function literal(value) {
  if (value === null) return "NULL";
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value === "string") return `'${value.replaceAll("'", "''")}'`;
  throw new Error("Unsupported SQL parameter");
}
function query(sql, values = []) {
  let i = 0;
  const bound = sql.replace(/\?/g, () => literal(values[i++]));
  if (i !== values.length) throw new Error("SQL parameter count mismatch");
  const result = spawnSync(
    process.execPath,
    [
      cli,
      "d1",
      "execute",
      "DB",
      "--config",
      production ? "wrangler.production.jsonc" : "wrangler.jsonc",
      production ? "--remote" : "--local",
      "--command",
      bound,
      "--json",
    ],
    { encoding: "utf8", timeout: 30000, windowsHide: true },
  );
  if (result.error || result.status !== 0)
    throw new Error(
      "Database command failed; inspect Wrangler access and configuration.",
    );
  return JSON.parse(result.stdout)[0];
}
const db = {
  prepare: (sql) => ({
    bind: (...values) => ({
      first: async () => query(sql, values).results[0] ?? null,
      all: async () => query(sql, values),
      run: async () => query(sql, values),
    }),
  }),
};
const jobs = query(
  "SELECT DISTINCT enquiry_id FROM enquiry_deliveries WHERE attempts < 5 AND (status IN ('pending','failed') OR (status='sending' AND last_attempt_at < datetime('now','-2 minutes'))) LIMIT 10",
).results;
if (sending)
  for (const job of jobs)
    await deliverEnquiry(
      db,
      {
        apiKey: process.env.RESEND_API_KEY,
        from: process.env.EMAIL_FROM ?? "Semblanse <hello@semblanse.com>",
        notify: process.env.EMAIL_NOTIFY ?? "hello@semblanse.com",
      },
      job.enquiry_id,
    );
console.log(
  JSON.stringify(
    {
      environment: production ? "production" : "local",
      mode: sending ? "send" : "dry run",
      eligibleEnquiries: jobs.length,
      statuses: query(
        "SELECT status, COUNT(*) AS count FROM enquiry_deliveries GROUP BY status",
      ).results,
    },
    null,
    2,
  ),
);
