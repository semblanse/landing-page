-- Short-lived HMAC buckets; no raw IP or email addresses.
CREATE TABLE request_limits (
  key TEXT PRIMARY KEY,
  hits INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE INDEX request_limits_expiry ON request_limits(expires_at);
