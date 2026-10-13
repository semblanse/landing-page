# Email delivery and retries

An enquiry and its two delivery jobs are stored in one D1 transaction. The API acknowledges storage; mail runs afterwards. Each job records pending, sending, sent, failed, or suppressed status, attempt count, and a generic error. It does not copy form answers into logs.

The sender's receipt respects the existing unsubscribe record. A failed suppression lookup prevents sending. The team notification remains available for a new message or misuse report. Concurrent retries claim each job once. Resend receives the same idempotency key for every retry of that job. Its idempotency window is limited, so inspect old jobs rather than treating that key as a permanent delivery guarantee.

Inspect the queue without sending:

```sh
npm run email:retry
npm run email:retry -- --production
```

To send eligible local jobs, set `RESEND_API_KEY` in the shell, then run `npm run email:retry -- --send`. Production sends require `npm run email:retry -- --production --send --confirm-production`. The script handles up to ten enquiries per run. Its output contains counts and statuses, not addresses or form answers.

Jobs stop after five claims. A crash can leave a sending job; it becomes eligible again after two minutes. Never reset a sent job. Review exhausted jobs and their provider history before resetting attempts on a specific failed job.

Before production, assign an inbox/queue owner, set the Resend secret on the production Pages project, verify the sending domain and recipient mailbox, and perform a controlled live receipt check. This work does not add a scheduled sender or assume permission to email old enquiries. The queue needs an operator check until a scheduler is approved and configured.
