# Design reference

Revision 3 in Figma file `Y0U7GeXRJxDj0p72fYLe1l`:

| Layout  | Root frame | Width  |
| ------- | ---------- | ------ |
| Desktop | `549:2779` | 1440px |
| Mobile  | `554:2845` | 390px  |
| Tablet  | `555:2910` | 834px  |

Layouts switch at 600px and 1024px, and flow between the reference widths. Desktop keeps five process cards across. Tablet uses two columns; mobile stacks them. Payment comes before launch in all three layouts.

The landing hero fills the page width and at least the visible viewport height, using `100dvh` with a `100vh` fallback. It grows when the copy needs more room on short or narrow screens. Artwork covers the full section. The header's outer edges, hero text and section text share `--page-gutter`: 24px on phones, 48px on tablets and compact desktops, 64px on larger desktops, and the centered content gutter on wide screens.

Tablet hero buttons keep 54px hit areas; the Figma tablet buttons collapse to the height of their text. This makes the implemented hero slightly taller.

## Brand

| Token         | Value       |
| ------------- | ----------- |
| Ink           | `#18231b`   |
| Cream         | `#f5f2e9`   |
| Sage          | `#b8c9a8`   |
| Green         | `#1f6f22`   |
| Lilac         | `#d9cdea`   |
| Display font  | GFS Didot   |
| UI font       | Albert Sans |
| Corner radius | 0           |

Fonts are served from the build. The UI follows shadcn's editable source model, with brand variants for buttons, tabs, fields and dialogs.

## Artwork

The original Figma image fills are stored in `public/figma/`. `scripts/build-artwork.mjs` re-encodes the three illustrations, undithered, to `public/figma/source/`. No expiring Figma URLs are used at runtime.

| Artwork           | Figma image hash | Source file                     |
| ----------------- | ---------------- | ------------------------------- |
| Hero profile      | `91c6f912`       | `source/hero.webp`              |
| Creator recording | `58ad2b23`       | `source/creator-recording.webp` |
| Cap scene         | `b4a61bb1`       | `source/cap-scene.webp`         |

The dither is applied in the browser by `src/components/landing/dither.tsx`. It ports Figma's first-party Dither shader effect (library id `f5c0a2ff-247f-434e-ada4-ecce79213874`, version `48a63bf8`), using each layer's own settings.

| Layer                          | Figma node | Style       | Size | Levels | Brightness |
| ------------------------------ | ---------- | ----------- | ---- | ------ | ---------- |
| Hero                           | `549:2783` | Bayer 2x2   | 2    | 4      | 111        |
| Advertiser and closing artwork | `549:3085` | Bayer 2x2   | 2    | 4      | 100        |
| Footer wordmark                | `549:3447` | Bayer 16x16 | 2    | 4      | 131        |

Figma runs the effect as WebGPU compute passes. Only its ordered (Bayer) styles are used in this file, and those are a pure function of each block, so the port is a single WebGL fragment pass over a canvas whose pixels are the blocks. Blocks stay 2 CSS pixels at every screen density. Without JavaScript or WebGL the original artwork shows undithered.

The footer wordmark is live GFS Didot text, fitted to the page width and dithered by the same shader. Its frame keeps Figma's 1440:182 proportion (`549:3446`), which crops the lettering through its x-height. The closing artwork is mirrored, as in Figma.

The hero follows the desktop treatment at every width: the dithered layer on white, at 36% over ink. Tablet and phone add a top-to-bottom ink gradient for legibility and centre the crop on the profile.

Only artwork is drawn on canvas. Headings, copy, controls, licence and cards are HTML.

## Product demo

The workspace demo plays inside its frame. It starts, muted and looped, when 40% of the frame is in view and pauses outside it. Browser controls support seeking, playback, sound and fullscreen. A separate fullscreen action stays visible below the frame, with the iPhone video fullscreen API as a fallback. Browsers that block native fullscreen use the full viewport, with an Exit fullscreen button and Escape to return. A visitor's pause is kept when they scroll back. It does not autoplay under reduced motion.

## Motion

The prototype guide is `504:2870` on motion page `468:2470`. Its ten section timelines supply the sequences and the shared easing, `cubic-bezier(0.22, 1, 0.36, 1)`.

Entrances run once as a section enters view: headline lines rise through masks, copy and actions follow, the waveform moves once, licence fields take a brief outline, and the FAQ indicator slides between audiences while answers crossfade. They are CSS transitions switched on by one IntersectionObserver, armed only when scripts run.

These follow scroll progress:

| Section              | Scroll-linked movement                                                                                                                                                                                                                                         |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Header               | Hides on scroll down, returns on scroll up                                                                                                                                                                                                                     |
| Hero                 | Artwork trails the page; copy lifts and fades                                                                                                                                                                                                                  |
| Stories              | Profiles spread outward from the centre                                                                                                                                                                                                                        |
| How it works         | A progress line draws across the stages; cards take focus in order (1024+)                                                                                                                                                                                     |
| How it works (phone) | Cards form a scroll stack under the pinned section heading. Each card pins one tab lower, so earlier labels pile up until all five show; pressing a tab scrolls back to that card (phones whose viewport is at least 620px tall with browser toolbars showing) |
| For brands           | Artwork opens behind a straight edge, settles from a zoom, grain resolves                                                                                                                                                                                      |
| Workspace            | The demo frame grows from 90% to full size                                                                                                                                                                                                                     |
| Closing              | As for brands, from the right                                                                                                                                                                                                                                  |
| Footer               | The wordmark rises into its cropped position                                                                                                                                                                                                                   |

Lenis smooths wheel and anchor scrolling. Touch scroll stays native. Reduced motion shows every section at rest and disables smooth scrolling.

## Linked pages

All seven linked pages use the current Revision 3 desktop and mobile frames in section `563:3280`. See `src/components/linked-pages/SOURCE.md` for source IDs and layout details. Their enquiries do not submit data; legal text remains draft. Those routes support the landing preview and do not claim a live product or live creator onboarding.

## Mobile fixes

The mobile and tablet header uses the desktop ink color and an accessible shadcn Collapsible menu. Responsive line breaks retain spaces. Process cards fit their content; fixed minimum heights and large inner gaps were removed. Didot uses its supplied regular weight, and Albert Sans uses real variable weights without font synthesis.
