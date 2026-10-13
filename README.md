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

Privacy and terms remain drafts from Figma. They must name Cloudflare, Resend and PostHog before launch. The workspace demo uses example campaign data and the existing Semblanse demo video.

The preview sends `noindex` headers and metadata. Remove those when the site is ready for launch.

## Forms

The creator, brand and contact forms, and the misuse report on Trust & Safety, post to `/api/enquiry`, a Cloudflare Pages Function in `functions/`. It checks the answers with the same rules the browser uses (`src/lib/enquiry-schema.ts`), verifies the Turnstile bot check, stores a row in the D1 `enquiries` table, then emails the team and the sender through Resend. A stored enquiry counts as sent even when an email fails.

Creator applications get a code such as `SEM-U8XF8R`, shown on the confirmation screen and in the email. The creator sends it to @semblanse in an Instagram message from the account they entered. When the message arrives, mark the row:

```sh
npx wrangler d1 execute DB --remote --command "UPDATE enquiries SET verified_at = datetime('now') WHERE verify_code = 'SEM-U8XF8R'"
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

## Analytics

PostHog (US) starts when the build has `NEXT_PUBLIC_POSTHOG_KEY`, set as a GitHub Actions variable. It runs without cookies or browser storage, so the site shows no consent banner; turn on cookieless mode in the PostHog project settings for this to count visitors. Events travel through `/relay` on this site (`functions/relay`). Session replay and autocapture are off. `src/lib/analytics.ts` sends page views plus `cta_clicked`, `form_started`, `form_error`, `form_failed`, `form_submitted`, `verify_code_copied` and `verify_message_opened`, with field names only and never what a person typed.

For visitor counts that need no script changes, enable Cloudflare Web Analytics on the Pages project.

## Deploy

The separate Cloudflare Pages project is `semblanse-landing-preview`; the preview branch is `revision-3`.

The workflow in `.github/workflows/cloudflare-preview.yml` builds, checks and deploys each push to `main` to the same preview URL. It also supports a manual run from GitHub Actions. Add the repository Actions secret `CLOUDFLARE_API_TOKEN` before the first automated deployment. Use a Cloudflare token limited to the Semblanse account with the Cloudflare Pages Edit permission. The account ID is public configuration in the workflow; the token must stay in GitHub's encrypted secrets.

For a manual deployment from this checkout:

```sh
npm run deploy:preview
```

Wrangler uses the signed-in Cloudflare account. No credentials belong in this repo. This direct upload does not change the existing `semblanse.com` site. [Cloudflare static Next.js guide](https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/).
