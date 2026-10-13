CREATE TABLE enquiry_deliveries (
  id TEXT PRIMARY KEY,
  enquiry_id TEXT NOT NULL REFERENCES enquiries(id),
  role TEXT NOT NULL CHECK(role IN ('team', 'sender')),
  site_origin TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'sending', 'sent', 'failed', 'suppressed')),
  attempts INTEGER NOT NULL DEFAULT 0,
  last_attempt_at TEXT,
  sent_at TEXT,
  last_error TEXT
);
CREATE INDEX enquiry_deliveries_pending ON enquiry_deliveries(status, attempts);
