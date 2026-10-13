# Production readiness work

The user requested separate branches in a new worktree, review previews, PostHog funnel analytics within the free tier, an investor page designed first in Figma, design preservation, copy-change explanations, and QA. Production deployment awaits their review.

Worktree: `C:\Users\adibi\Documents\Codex\2026-10-13\fo\work\production-readiness`.

Branches stack so each change has a branch and commit, and the last branch includes the full review build. The original checkout remains untouched.

| Branch | Scope | State |
| --- | --- | --- |
| `codex/readiness-baseline` | Preserve the existing uncommitted landing-page source and assets | Committed as `9fea0da`; generated metadata previews excluded |
| `codex/readiness-security` | API input bounds, challenge validation, abuse limits, retry deduplication, response headers | Build, lint, both TypeScript targets, six unit/SQLite checks, and nine local API integration checks passed |
| `codex/readiness-delivery` | Preserve upstream email/unsubscribe work; transactional outbox, delivery outcomes, safe manual retry | Eleven unit/SQLite/provider checks pass; local runtime and build checks in progress. Deployment preflight remains for the release branch. |
| `codex/readiness-analytics` | Consent-aware bounded events, funnels/dashboards, free-tier safeguards | Build, lint, Functions type check and 16 tests pass. Local provider capture and browser choices checked; eight funnels and four traffic/form charts created. Disable the injected Cloudflare beacon and check the deployed preview before release. |
| `codex/readiness-legal-copy` | Website policies, tracking choices, stage framing, copy log | Implemented; static build, Functions types and tests pass. Production build deliberately refuses unresolved owner decisions; review previews work. |
| Planned investor branch | Figma-first investor/team page from deck and Master Doc | Pending |
| Planned accessibility-release branch | Responsive/accessibility/performance fixes and review previews | Pending |

No founder decisions should be invented. Research unresolved points, record them for review, and continue independent work. Required decisions include legal operator/address, governing law, permitted AI providers and sample lifecycle, campaign terms, and approved public investor/raise facts.

October 13 continuation: the saved goal was marked blocked, but current evidence does not block review builds. The remaining legal/company decisions and production email setup concern launch. Continue the preview work without inventing those details. Local analytics integration accepted 40 synthetic events, rejected invalid requests, and honored GPC/DNT; the real PostHog preview funnel returned the expected sequence. Cloudflare's local runtime rejected `redirect: error`; changed to `manual` and verified provider redirects are not followed. Investor Figma design received targeted link/marker corrections and desktop/mobile visual review. Legal copy, investor implementation, release QA and review deployments remain unfinished.

Source evidence: live Figma deck `d7tFXD0vSUPwjxtuL9vE7a`; team slide `39:23` names Mateo Bivol and Stefan D’Amato. The supplied design node `641:1295` is the Social page, not the secondary-page section. Current linked-page reference section is `633:1865` on Landing Page `358:97235`; About `633:2132`, Trust `633:2322`.

PostHog connection conversation: `01a133dc-988a-7c3b-9b26-7cb691c7917e`. Existing source/README points to project `661655`; verify through the connected service before writes. `learn -s` and `tools` ran. Skills of interest: building-a-dashboard, understanding-billing-usage. Tools include projects-get, project-get, docs-search, project-settings-update, dashboards-get-all, dashboard-create, insight-create. Business-knowledge search and Billing tools were absent from the advertised list; do not guess their schemas.

Production configuration audit found a D1 schema and Turnstile secret, but no Resend key listed as a production secret. Preview lists both. Main domain still serves Coming soon; www is NXDOMAIN. Do not change production DNS/deploy while preparing review previews.

Local security QA: Wrangler runs on `127.0.0.1:8794` with always-pass test keys and no email key. Valid fixtures use `example.invalid`; no mail was sent. First submission plus retry created one row, and repeated new requests stopped at 12 accepted per IP window. Function responses include nosniff/framing headers. Security SQL migrations applied locally only. Test commands: `node --experimental-strip-types --test tests/request-security.test.ts`, `node tests/enquiry-integration.mjs` against the running local server, normal build, lint, and both type checks.

Master Doc located through Drive: `1208YLbUfSFx2MQvLfLjMsvoo2pfPw7I_KiUEP-dH-Ds`, modified October 8. Private readable reference saved outside Git at `work/master-doc-reference.txt` in the parent chat workspace. It states proposed launch defaults: adults, narrow campaigns, no general training rights, separate permission for reusable models, restricted generation access where needed. Reconcile this with broad sample-sharing language before final copy. The live deck is stronger evidence for current founder names and qualifications.

GitHub Actions variable reads returned 403; SSH remote is `git@github.com:semblanse/landing-page.git`. Public widget keys can be read from deployed assets. Do not attempt to recover encrypted secret values. PostHog project 661655 is verified; its starter dashboard is 2203511. API billing controls are not advertised. Use a server-side event budget as a safeguard and record the billing-cap review for the owner.

Upstream advanced to `eb74280` (email confirmations/unsubscribe, PR #2). Delivery branch integrates it, preserving its design and suppression behavior. Resolve metadata conflict by retaining the new metadata system and adding a noindex unsubscribe route; omit that route from the sitemap. Renumber our rate migration to 0003 after upstream's 0002_unsubscribe. Accept both legacy UUID and new 64-hex unsubscribe IDs.
