-- One row per submitted form. Fields shared by every form are columns; the
-- rest of a form's answers are JSON in `details`.
CREATE TABLE enquiries (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL CHECK (kind IN ('creator-pilot', 'brand-pilot', 'contact', 'report')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  details TEXT NOT NULL,
  -- When the person ticked the consent box, as received by the server. The
  -- misuse report has no consent box.
  consent_at TEXT,
  -- JSON: campaign tags, referrer and first page seen.
  attribution TEXT,
  -- Creator applications only. The creator proves the account is theirs by
  -- sending "Application: <email>" to @semblanse in an Instagram message from
  -- it; the team then sets `verified_at`.
  instagram TEXT,
  -- Unused. An earlier design sent a code in place of the email.
  verify_code TEXT UNIQUE,
  verified_at TEXT,
  status TEXT NOT NULL DEFAULT 'new'
);

CREATE INDEX enquiries_kind_created ON enquiries (kind, created_at);
CREATE INDEX enquiries_email ON enquiries (email);
