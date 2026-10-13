# Semblanse landing page

Next.js implementation of landing revision 3. [Open the Cloudflare preview](https://revision-3.semblanse-landing-preview.pages.dev).

## Run

Use Node.js 22 or later.

```sh
npm ci
npm run dev
```

For the static build:

```sh
npm run lint
npm run typecheck
npm run build
npm start
```

`next build` exports each route to `out/`. No Next.js server is needed on Cloudflare.

## Design and components

The [Figma source](https://www.figma.com/design/Y0U7GeXRJxDj0p72fYLe1l/Semblanse-Creator-dashboard?node-id=549-2779) contains desktop, mobile and tablet revisions. See [DESIGN.md](DESIGN.md) for source frames, tokens, artwork and motion choices.

Brand tokens live in `src/app/globals.css`. Page layouts live in `src/app/landing.css`. The shadcn source components in `src/components/ui/` use Base UI, Tailwind and CSS variables; edit these files to change the component set. `components.json` keeps the CLI aliases in place:

```sh
npx shadcn@latest add <component>
```

Keep new components square and use the existing brand tokens. Motion handles section reveals and the FAQ transition. Lenis handles wheel and anchor scrolling, with native touch scrolling. Reduced motion disables Lenis and movement.

## Preview scope

Privacy and terms remain drafts for legal review. They name Cloudflare, Resend and PostHog and explain the Instagram message check. The workspace demo uses example campaign data and the existing Semblanse demo video.

The preview sends `noindex` headers and metadata. Remove those when the site is ready for launch.

## Forms

The creator, brand and contact forms, and the misuse report on Trust & Safety, post to `/api/enquiry`, a Cloudflare Pages Function in `functions/`. It checks the answers with the same rules the browser uses (`src/lib/enquiry-schema.ts`), verifies the Turnstile bot check, stores a row in the D1 `enquiries` table, then emails the team and the sender through Resend. A stored enquiry counts as sent even when an email fails.

A creator proves the Instagram account is theirs by sending "Application: " and their email to @semblanse from it. The confirmation screen and email show the exact message, and the team's notification email repeats it. When a message arrives from the handle on the application and its email matches, mark the row:

```sh
npx wrangler d1 execute DB --remote --command "UPDATE enquiries SET verified_at = datetime('now') WHERE kind = 'creator-pilot' AND instagram = 'theirhandle' AND email = 'them@example.com'"
```

`next dev` does not run the function. To try the forms locally, copy `.dev.vars.example` to `.dev.vars`, then:

```sh
npm run preview
```

This builds the site, creates the local database and serves both at `http://localhost:8788`. Local runs use Cloudflare's always-pass Turnstile keys and skip email unless `RESEND_API_KEY` is set.

### One-time setup for a deployed site

1. Create the database, put the printed id in `wrangler.jsonc`, and create the table:

   ```sh
   npx wrangler d1 create semblanse-enquiries-preview
   npx wrangler d1 migrations apply DB --remote
   ```

2. Create a Turnstile widget for the site's hostnames. Set its site key as the GitHub Actions variable `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, and its secret on the Pages project:

   ```sh
   npx wrangler pages secret put TURNSTILE_SECRET_KEY
   ```

3. Verify `semblanse.com` as a sending domain in Resend, then store an API key the same way as `RESEND_API_KEY`. The sender and the team's address are `EMAIL_FROM` and `EMAIL_NOTIFY` in `wrangler.jsonc`.

Until step 2 is done the deployed forms refuse every submission and show the "didn't send" message.

## Emails

`server/email.ts` builds the confirmation each form sends, following the "Emails · Form confirmations" section (`663:2133`) in Figma. The wordmark image and the two font files it loads are in `public/email/`. Apple Mail shows GFS Didot and Albert Sans; other mail apps fall back to Georgia and Helvetica or Arial. The team's notification email is plain text.

Every confirmation carries an unsubscribe link to `/unsubscribe`, and headers that let mail apps show their own unsubscribe button. Either one sets `unsubscribed_at` on every enquiry from that address (`functions/api/unsubscribe.ts`). An address that has unsubscribed gets no further confirmations; its enquiries are still stored and the team is still notified. Check `unsubscribed_at` before emailing anyone from the table:

```sh
npx wrangler d1 execute DB --remote --command "SELECT email, unsubscribed_at FROM enquiries WHERE unsubscribed_at IS NOT NULL"
```

Apply `migrations/0002_unsubscribe.sql` to each database before deploying this code to it:

```sh
npx wrangler d1 migrations apply DB --remote
npx wrangler d1 migrations apply DB --remote --config wrangler.production.jsonc
```

The emails do not yet carry a postal address, which commercial email laws such as CASL and CAN-SPAM expect. Add it to the footer in `server/email.ts` before sending anything promotional.

## Analytics

PostHog (US), project `661655`, receives explicit events through `/api/analytics` after the visitor allows analytics. The footer reopens their choice. GPC and Do Not Track keep optional analytics off. The SDK and open relay have been removed. There are no person profiles, session recordings, autocapture or feature-flag requests. Anonymous browser identifiers and filtered campaign tags use storage only after consent. Form events contain field names and outcomes, never answers. The API reserves events against a rolling usage cap before capture. See `docs/analytics.md` for retention, limits and measurement definitions.

Cloudflare Web Analytics was enabled on the preview Pages project at audit time. Disable its automatic beacon before releasing this opt-in analytics setup, or it will collect independently of this site's choice. Confirm the served HTML after deployment.

## Deploy

The separate Cloudflare Pages project is `semblanse-landing-preview`; the preview branch is `revision-3`.

The workflow in `.github/workflows/cloudflare-preview.yml` builds, checks and deploys each push to `main` to the same preview URL. It also supports a manual run from GitHub Actions. Add the repository Actions secret `CLOUDFLARE_API_TOKEN` before the first automated deployment. Use a Cloudflare token limited to the Semblanse account with the Cloudflare Pages Edit permission. The account ID is public configuration in the workflow; the token must stay in GitHub's encrypted secrets.

For a manual deployment from this checkout:

```sh
npm run deploy:preview
```

Wrangler uses the signed-in Cloudflare account. No credentials belong in this repo. This direct upload does not change the existing `semblanse.com` site. [Cloudflare static Next.js guide](https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/).

## Production preparation

The existing live Pages project is `semblanse`, serving `semblanse.com`. `wrangler.production.jsonc` targets that project and the separate `semblanse-enquiries-production` database. Its migration is applied. The existing Turnstile widget allows `semblanse.com`; its secret is set on both environments of the live project. Preview deployments still use `wrangler.jsonc` and the preview database.

Before launch:

- Have a reviewer approve privacy and terms, including consent, data retention, safeguards and governing law. Those decisions remain open.
- Store `RESEND_API_KEY` on each Pages project that needs email. The sending domain is verified, but the projects have no Resend key yet. Check that `hello@semblanse.com` reaches the team through the existing mail provider before changing email routing.
- Assign someone to check @semblanse message requests and match each sender's handle and application email before marking a row verified. Use the database for the environment that received the form.
- The active Cloudflare rule limits `/api/enquiry` and `/api/enquiry/` on the `semblanse.com` zone to five requests per IP in ten seconds, then blocks for ten seconds. It does not cover `pages.dev` preview hosts. Check each form on the preview before replacing the live site.

Set the real Turnstile public key in the shell environment, then build production:

```sh
npm run build:production
```

This uses `https://semblanse.com` for metadata and removes `noindex` from the built HTML and `out/_headers`. It rejects a missing Turnstile key or a test key. PostHog uses the server binding in Wrangler configuration. A regular `npm run build` keeps preview indexing blocked. Neither command deploys. To deploy the reviewed production build at launch:

```sh
npx wrangler pages deploy out --config wrangler.production.jsonc --project-name semblanse --branch main
```

For a creator application submitted on the live site:

```sh
npx wrangler d1 execute DB --remote --config wrangler.production.jsonc --command "UPDATE enquiries SET verified_at = datetime('now') WHERE kind = 'creator-pilot' AND instagram = 'theirhandle' AND email = 'them@example.com' AND verified_at IS NULL"
```

Replace both example values after checking the sender. Check the matching row before running the update and confirm which rows changed.
