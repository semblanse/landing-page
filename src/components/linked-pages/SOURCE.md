# Secondary pages

The source is the `Website · New pages · copy fixes` section (`633:1865`) in Figma file `Y0U7GeXRJxDj0p72fYLe1l`. It supersedes the `Website · Linked pages · Revision 3` section (`582:3029`).

| Route            | Page                    | Desktop frame |
| ---------------- | ----------------------- | ------------- |
| `/trust`         | Trust & Safety          | `633:2322`    |
| `/brands`        | For brands and agencies | `633:2670`    |
| `/pilot`         | Pilot overview          | `633:1867`    |
| `/about`         | About                   | `633:2132`    |
| `/careers`       | Careers                 | `653:2358`    |
| `/creator-pilot` | Apply as a creator      | `633:4427`    |
| `/brand-pilot`   | Book a pilot call       | `633:3876`    |
| `/contact`       | Contact                 | `633:3433`    |
| `/privacy`       | Privacy policy          | `633:5250`    |
| `/terms`         | Terms of use            | `633:4983`    |
| 404              | Not found               | `633:4844`    |

The three forms use the "portrait background" frames. Their confirmations (`633:3081`, `633:3205`, `633:3748`) replace the form in place, and the breadcrumb gains a level. Each phone frame sits beside its desktop frame. Careers comes from the `Website · New pages · Careers and blog` section (`653:2357`); its buttons open an email to careers@semblanse.com.

## Layout

Pages sit on cream and the artwork carries the colour. Each page has one breadcrumb strip under the header and ends on the ink footer (`<Footer ink />`); the landing page keeps the cream footer. GFS Didot is set at -4% letter spacing throughout, as on the landing page.

The forms keep the split layout. The left panel is the 9:16 artwork, dithered, under a gradient of the panel colour that thins towards the foot.

## Artwork

`scripts/build-brand-artwork.mjs` re-encodes the brand artwork from `../brand-artwork-concepts/round-2-cropped` into `public/artwork` (3:2) and `public/artwork/portrait` (9:16). The browser dithers it with the landing page shader. Some Figma layers show the artwork mirrored; the site uses it as drawn.

## Motion

The pages use the landing page's motion parts. Headings rise through line masks (`Lines`), copy and rows enter with `Reveal`, and artwork below the fold opens behind a straight edge as it scrolls in (`ScrollArtwork`). Artwork on screen at load wipes open once while its dither resolves. On `/brands` a line draws down the numbered steps with scroll. Reduced motion shows everything at rest.

## Not connected

The three forms and the misuse report send to `/api/enquiry`; the README covers the backend. These parts of them are not in Figma and need a design pass:

- The message under a field that needs fixing, the line above the submit button that counts them, and the line shown when sending fails.
- The "Sending…" state of the submit button.
- The Instagram username field on the creator form. It sits where the frames show the "Continue with Instagram" button.
- The "One last step" block on the creator confirmation, with the code a creator sends to @semblanse to prove the account is theirs.
  Privacy and terms carry no draft labels, but the text has not had legal review.
