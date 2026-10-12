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

Creator, brand and contact enquiries show local form feedback. They send no data. Connect an approved form service or backend before launch. Privacy and terms remain drafts from Figma. The workspace demo uses example campaign data and the existing Semblanse demo video.

The preview sends `noindex` headers and metadata. Remove those when the site is ready for launch.

## Deploy

The separate Cloudflare Pages project is `semblanse-landing-preview`; the preview branch is `revision-3`.

```sh
npm run deploy:preview
```

Wrangler uses the signed-in Cloudflare account. No credentials belong in this repo. This direct upload does not change the existing `semblanse.com` site. [Cloudflare static Next.js guide](https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/).
