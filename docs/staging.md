# Staging and previews

Stable staging: https://staging.semblanse-landing-preview.pages.dev/

Staging uses the separate `semblanse-landing-preview` Pages project and `semblanse-enquiries-preview` D1 database. It cannot write to the live database through the configured binding. Production uses project `semblanse` and database `semblanse-enquiries-production`.

Preview pages show a small test notice, block search indexing in HTML, HTTP headers and robots.txt, and use their preview URL for canonical links. Analytics keep the `preview` environment tag and a separate 25,000-event cap. Production dashboards filter out previews. The preview is public; `noindex` does not restrict access. Use sample data only.

Form submissions still exercise input checks, Turnstile, database storage and the delivery queue. Both sender and team email jobs are marked `suppressed` with `preview_email_disabled`. No email is sent, even if a preview has a sending key or someone sets the mode to `live`: delivery also requires a production origin. Do not copy live data into staging.

## Publish a review build

Commit the changes, set `NEXT_PUBLIC_TURNSTILE_SITE_KEY` to the existing widget's public key `0x4AAAAAAFVI311hWIdh2XKl`, and run `npm run deploy:staging`. This runs tests, type checks and lint, then builds and uploads to staging. It leaves production alone and refuses the live database configuration or a test Turnstile key.

For a separate feature preview, run `node scripts/deploy-preview.mjs feature-name` after the same checks. The URL becomes `https://feature-name.semblanse-landing-preview.pages.dev/`. Each upload also gets an immutable URL for review. All preview branches share the preview database; use distinct sample data per test.

The GitHub workflow uses the same script. Pushes to `main` update staging; other branches get their own preview alias. It never deploys production. Automatic uploads use the existing repository `CLOUDFLARE_API_TOKEN` secret. The first staging branch push passed GitHub Actions run `38507404633` and created deployment `15253802-6c60-4e68-9dbc-e21fb97f91aa` for commit `955c261`, which verifies the automatic path without reading the secret. Manual staging uploads also work through the Wrangler login.

## Promote a reviewed change

Review desktop and mobile layouts, keyboard controls, analytics choices, navigation, and the affected form. Check the preview database and suppressed delivery jobs when testing a valid submission. Apply any reviewed additive migration to production after a backup. From a clean checkout, set the real Turnstile public key and run `npm run deploy:production` only when production publication is authorised.

The production script rebuilds with the live canonical URL and indexing enabled. It selects the production config for upload and restores preview defaults afterward. Never upload an existing `out` directory by hand: a previous build may target the other environment.
