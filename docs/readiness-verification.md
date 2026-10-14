# Readiness review, 13 October 2026

Review the site at https://readiness-review.semblanse-landing-preview.pages.dev. The investor page is at `/investors/`; website policies are at `/privacy/` and `/terms/`. The existing Revision 3 preview will receive the same review build. The live site and its database have not received this revision.

## Changes ready for review

The investor page follows the editable desktop and mobile Figma designs, using founder details from the supplied deck and the planned business model from the Master Doc. It makes no funding or traction claim. Privacy and terms cover actual website processing and keep future campaign permissions separate. The copy retains the planned product story while distinguishing it from today's waitlist and account-control check. `copy-changes.md` records each copy change and its reason.

The site now has square native scrollbars, keyboard focus handling for the mobile menu, a mobile form jump link, and an email alternative when JavaScript is off. Analytics choices sit beside the footer's privacy and accessibility links. The notice uses a short sentence and visible Allow / No thanks buttons. It keeps early footer clicks until the notice has loaded, focuses the reopened notice, and returns focus to the footer after a choice.

## Checks

| Check | Result |
| --- | --- |
| Preview production build | 19 generated routes; Next.js type checking passed |
| Lint and Pages Functions TypeScript | Passed |
| Tests | 16 passed: request limits, malformed bodies, Turnstile binding, atomic rate limits, email job claims/retries, sanitised analytics and event budgets |
| Layout and labels | Eight main pages at actual CSS widths 320, 390, 834 and 1440: no horizontal page overflow, one h1, no missing image alt attribute and no unlabelled form control |
| Mobile navigation | Focus wraps within the menu; the background is inert; Escape closes it and restores focus; resizing to desktop closes it |
| Analytics notice | About 69px tall at 1440px and 119px at 390px; buttons are at least 44px high; white on green Allow text has about 6.2:1 contrast |
| Deployed routes | All 13 pages and robots/sitemap/llms routes returned 200; an unknown path returned 404 |
| Deployed assets | All 49 referenced assets returned 200 |
| Static security headers | Every inline script on known pages has a matching SHA-256 CSP entry; frame, MIME, referrer and permissions headers are present |
| Deployed API rejection checks | Empty/malformed input rejected; wrong content type 415; body over 32KB 413; foreign origins 403; privacy signals skip analytics |
| Analytics capture | One synthetic preview event accepted by the deployed API; earlier native PostHog funnel query verified a synthetic four-step journey. These are wiring checks, not user conversions |
| Optional tracking | Automatic Cloudflare beacon absent from served pages. PostHog starts after opt-in; GPC and DNT keep it off |
| Dependencies | Runtime npm audit: zero reported vulnerabilities. Full audit: nine high findings in developer tools, rooted in the unpatched braces nested-pattern advisory |
| Production guard | Legal-copy approval is recorded; retention review and production email verification remain unresolved |

## Performance and limits of this review

Lossless WebP conversion and deduplication reduce the referenced Figma raster set from 13,015,017 to 6,209,065 bytes, a 52% reduction. Every conversion compares decoded pixels and keeps the original dimensions. This is an asset-set comparison, not a measured first-load saving. Originals remain available.

Static pages and assets bypass Pages Functions. The PostHog browser SDK is gone. The dither renderer releases GPU resources when it unmounts and waits for the right image when its source changes. Video uses metadata preload and respects the existing reduced-motion behavior.

This review does not establish field Core Web Vitals or formal WCAG conformance. It includes browser layout and keyboard checks, source review, HTTP checks and asset-size checks. No Lighthouse or real-user performance score is claimed. Test email delivery used local fixtures; this work sent no real form emails. A controlled production inbox test remains an owner launch check.

## Before public launch

The owner confirmed Orbit Strategies Ltd. as website operator, approved the Vaughan mailing address and chose Ontario law. The owner approved the website legal text on 13 October 2026 and confirmed PostHog's Free plan has no linked card or payment method. A court-venue clause is optional and has not been selected. Agree on a retention/deletion practice the team can carry out, and verify production email delivery. Recheck billing if the PostHog plan changes. The code caps its own events below the published free allowance; it cannot control other apps or direct use of the public ingestion key.

Apply the new database migrations to production, assign an operator to failed email jobs and application verification, and review the founder biographies. Keep campaign samples out of this website's application flow until the separate permissions and processing disclosures are ready. See `release-review.md` for the decisions and sources.

The remaining dependency finding is https://github.com/advisories/GHSA-vfj7-8cjw-p6xm. It affects developer tooling's handling of deeply nested brace patterns; it is not in the shipped runtime dependency tree. Do not force a framework downgrade to silence that audit result.
