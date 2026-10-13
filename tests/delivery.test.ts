import { test } from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";
import { deliverEnquiry, deliveryStatements } from "../server/delivery.ts";
import { send } from "../server/email.ts";

function fixture(unsubscribed = false) {
  const sqlite = new DatabaseSync(":memory:");
  for (const file of [
    "0001_enquiries.sql",
    "0002_unsubscribe.sql",
    "0003_request_limits.sql",
    "0004_email_outbox.sql",
  ])
    sqlite.exec(
      readFileSync(new URL(`../migrations/${file}`, import.meta.url), "utf8"),
    );
  const db = {
    prepare(sql: string) {
      return {
        bind(...values: (string | number | null)[]) {
          return {
            async run() {
              return sqlite.prepare(sql).run(...values);
            },
            async first() {
              return sqlite.prepare(sql).get(...values) ?? null;
            },
            async all() {
              return { results: sqlite.prepare(sql).all(...values) };
            },
          };
        },
      };
    },
  };
  const id = "a".repeat(64);
  sqlite
    .prepare(
      "INSERT INTO enquiries (id, kind, name, email, details, unsubscribed_at) VALUES (?, 'contact', 'QA', 'qa@example.invalid', ?, ?)",
    )
    .run(
      id,
      JSON.stringify({ message: "Local fixture", role: "Something else" }),
      unsubscribed ? "2026-10-13" : null,
    );
  return {
    sqlite,
    db,
    id,
    async enqueue() {
      for (const statement of deliveryStatements(db, id, "https://example.com"))
        await statement.run();
    },
  };
}
const mailer = {
  apiKey: "test-key",
  from: "qa@example.invalid",
  notify: "team@example.invalid",
};

test("failed delivery is recorded; retry sends only the failed job", async () => {
  const f = fixture();
  await f.enqueue();
  const calls: string[] = [];
  try {
    await deliverEnquiry(f.db, mailer, f.id, async (_mailer, _message, key) => {
      calls.push(key!);
      return key!.endsWith(":sender");
    });
    assert.deepEqual(
      f.sqlite
        .prepare("SELECT role, status FROM enquiry_deliveries ORDER BY role")
        .all()
        .map((r) => [r.role, r.status]),
      [
        ["sender", "sent"],
        ["team", "failed"],
      ],
    );
    await deliverEnquiry(f.db, mailer, f.id, async (_mailer, _message, key) => {
      calls.push(key!);
      return true;
    });
    assert.equal(calls.length, 3);
    assert.equal(calls[0], calls[2]);
    assert.equal(
      f.sqlite
        .prepare(
          "SELECT COUNT(*) AS n FROM enquiry_deliveries WHERE status='sent'",
        )
        .get()!.n,
      2,
    );
  } finally {
    f.sqlite.close();
  }
});

test("concurrent retries claim each email only once", async () => {
  const f = fixture();
  await f.enqueue();
  let count = 0;
  try {
    await Promise.all(
      [1, 2, 3].map(() =>
        deliverEnquiry(f.db, mailer, f.id, async () => {
          count++;
          return true;
        }),
      ),
    );
    assert.equal(count, 2);
  } finally {
    f.sqlite.close();
  }
});

test("unsubscribe suppresses the sender receipt while preserving the team notice", async () => {
  const f = fixture(true);
  await f.enqueue();
  const recipients: string[] = [];
  try {
    await deliverEnquiry(f.db, mailer, f.id, async (_mailer, message) => {
      recipients.push(message.to);
      return true;
    });
    assert.deepEqual(recipients, [mailer.notify]);
    assert.equal(
      f.sqlite
        .prepare("SELECT status FROM enquiry_deliveries WHERE role='sender'")
        .get()!.status,
      "suppressed",
    );
  } finally {
    f.sqlite.close();
  }
});

test("a missing key leaves failed jobs visible without sending", async () => {
  const f = fixture();
  await f.enqueue();
  let count = 0;
  try {
    await deliverEnquiry(
      f.db,
      { ...mailer, apiKey: undefined },
      f.id,
      async () => {
        count++;
        return true;
      },
    );
    assert.equal(count, 0);
    assert.equal(
      f.sqlite
        .prepare(
          "SELECT COUNT(*) AS n FROM enquiry_deliveries WHERE last_error='missing_api_key'",
        )
        .get()!.n,
      2,
    );
  } finally {
    f.sqlite.close();
  }
});

test("Resend requests carry a stable idempotency key", async () => {
  const original = globalThis.fetch;
  let captured: RequestInit | undefined;
  globalThis.fetch = async (_url, init) => {
    captured = init;
    return new Response("{}", { status: 200 });
  };
  try {
    assert.equal(
      await send(
        mailer,
        { to: "qa@example.invalid", subject: "QA", text: "QA" },
        "job-key",
      ),
      true,
    );
    assert.equal(
      new Headers(captured?.headers).get("Idempotency-Key"),
      "job-key",
    );
    assert.ok(captured?.signal);
  } finally {
    globalThis.fetch = original;
  }
});
