# Website operations

Orbit Strategies Ltd. operates the website. The team member monitoring hello@semblanse.com also owns the checks below until another person takes over. Do not treat this checklist as proof that a check has happened; record its date and outcome when you do it.

## Enquiries and delivery

Check the inbox and failed delivery jobs each working day while applications are open. Review the Resend logs for bounces and complaints. Stop sending to addresses that bounce permanently or complain. A stored enquiry or a job marked `sent` means the provider accepted the email; neither proves inbox placement.

Run `npm run email:retry -- --production` to inspect the queue without sending. To retry, use a sending credential from a secure environment and add `--send --confirm-production`. The script limits attempts and honours unsubscribe requests. Do not put credentials in commands, Git or notes.

Check @semblanse message requests while creator applications are open. Match the sender's account and application email before recording verification. This check confirms account control, not legal identity or likeness rights.

## Retention and privacy requests

Review open enquiries, applications and the waitlist each month. Keep a record only while the team needs it to reply, manage the waitlist or consider a pilot. Mark closed matters for deletion once those purposes end. Keep only the parts needed for a stated legal duty or dispute, with the reason and a date for the next review. Do not impose a new fixed public retention promise.

Log privacy requests when they arrive at hello@semblanse.com. Confirm the requester controls the relevant address, find the record in the correct environment, assess any reason to retain it, and reply with the outcome. Limit the log to what is needed to handle and document the request.

Deletion must cover the enquiry, its delivery rows and team mailbox copies, subject to any documented duty to retain them. Provider backups and logs may expire on their own schedules. Keep the minimum suppression record needed to honour an unsubscribe; removing it without a plan may allow another confirmation to be sent. Review provider retention and access when the provider or purpose changes.

This release reviews the approved purpose-based privacy policy and supplies this manual routine. It does not claim that historical records have been deleted or that a scheduled deletion service exists. No existing enquiries were purged during launch.

## Release checks

Review changes on the separate preview project and preview database. Publish to `semblanse.com` only with an explicit production deployment. Keep the previous deployment ID for rollback. A code rollback does not undo database changes; take a backup before schema changes and use additive migrations where possible.

Production enquiries live in `semblanse-enquiries-production`. Preview enquiries live in `semblanse-enquiries-preview`. Never copy live enquiries into preview for a visual test.
