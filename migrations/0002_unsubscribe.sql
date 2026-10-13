-- When the person behind this enquiry's email address asked us to stop
-- emailing them. Set on every enquiry from that address.
ALTER TABLE enquiries ADD COLUMN unsubscribed_at TEXT;
