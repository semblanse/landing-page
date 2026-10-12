# Linked pages

The source is the `Website · Linked pages · Revision 3` section (`563:3280`) in Figma file `Y0U7GeXRJxDj0p72fYLe1l`. These frames replace the older linked pages under `495` and `496`.

| Route            | Desktop    | Mobile     |
| ---------------- | ---------- | ---------- |
| `/creator-pilot` | `563:2975` | `563:3129` |
| `/brand-pilot`   | `565:2983` | `565:3118` |
| `/pilot`         | `568:2993` | `568:3152` |
| `/about`         | `568:3309` | `568:3436` |
| `/contact`       | `570:3009` | `570:3130` |
| `/privacy`       | `571:3017` | `571:3177` |
| `/terms`         | `571:3316` | `571:3462` |
| 404              | `572:3021` | `572:3110` |

The forms use the creator (`563:3281`), brand (`565:3251`), and contact (`570:3241`) confirmation layouts. Their text states that no request was sent. Instagram sign-in also stays a local preview. Form fields use shadcn Input, Textarea, Label, and Button. Native radio buttons and checkboxes provide the choice controls. All controls have square corners.

`content.json` holds the copy read from these desktop frames. The legal pages retain Draft and To confirm labels and add a note that the text needs legal review. The forms add a notice that no details leave the browser.

Artwork in `/public/linked-pages` comes from the source nodes in each filename. The profile SVGs, camera glyph, dot, licence logo, and confirmation artwork use local files. The creator and brand confirmation artwork uses the undithered sources in `/public/figma/source`, dithered in the browser by the landing page shader. No Figma asset URL runs in the site.

Desktop uses the source split panels and columns. Mobile stacks them and uses the source 46/50 heading and 17/25 body sizes. Text flows with spaces when desktop line breaks disappear. Tablet widths use the same flexible grid and smaller type; the source section has no separate tablet frames. Shared Navigation and Footer come from the landing page.

The code passed scoped ESLint and TypeScript checks. The parent task owns browser checks at 390, 834, and 1440 pixels, the build, and deployment.
