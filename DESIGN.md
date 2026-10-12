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

The original Figma assets are stored in `public/figma/`. The local asset map records their source sections. No expiring Figma URLs are used at runtime.

Figma's dither effects were exported from the effect nodes, preserving the exact rendered pattern in PNGs. They do not require a WebGPU effect at runtime.

| Export                 | Figma node                              |
| ---------------------- | --------------------------------------- |
| Hero dither            | `549:2783`                              |
| Advertiser dither      | `549:3085`                              |
| Closing dither         | `549:3402`                              |
| Footer dither wordmark | `549:3447`, full export copy `578:3029` |

Tablet uses its revised hero crop with the matching vertical gradient. Mobile uses a new 9:16 portrait adaptation of the source artwork, made with built-in imagegen and a fine ordered dither. A uniform 64% ink overlay matches the desktop artwork's dark treatment. The image fills the hero's full content height, including both notes, and ends at a hard edge above the solid ink stories section. It does not fade into that section. See [the mobile artwork prompt](docs/mobile-hero-artwork.md).

Only artwork is rasterized. Headings, copy, controls, licence and cards are HTML. The workspace demo starts when at least a quarter of the player enters view and pauses outside it. It plays inline, muted and looped, with native controls and a fullscreen action.

The input section keeps the heading within its own column, with a clear gap from the examples. The FAQ shows four common questions first, with one expandable answer open at a time and a control for the full list. Bright green marks the selected audience. The footer uses the full wordmark without a moving reveal; its frame removes only the blank cream below the lettering, placing the intact wordmark at the page bottom.

## Motion

The prototype guide is `504:2870` on motion page `468:2470`. Motion supplies masked headline reveals, profile spread, card focus, waveform movement, licence wipe, preview scale, image wipes and FAQ crossfade. Most reveals run once when they enter view. Shared easing is `[0.16, 1, 0.3, 1]`.

Lenis smooths wheel and anchor scrolling. Touch scroll stays native. Content remains visible without JavaScript. Reduced motion disables movement and smooth scrolling.

## Linked pages

All seven linked pages use the current Revision 3 desktop and mobile frames in section `563:3280`. See `src/components/linked-pages/SOURCE.md` for source IDs and layout details. Their enquiries do not submit data; legal text remains draft. Those routes support the landing preview and do not claim a live product or live creator onboarding.

## Mobile fixes

The mobile and tablet header uses the desktop ink color and an accessible shadcn Collapsible menu. Responsive line breaks retain spaces. Process cards fit their content; fixed minimum heights and large inner gaps were removed. Didot uses its supplied regular weight, and Albert Sans uses real variable weights without font synthesis. The footer shows the full dither wordmark on cream, exported from a separate Figma copy so the source stays intact.
