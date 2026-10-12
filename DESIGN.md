# Design reference

Revision 3 in Figma file `Y0U7GeXRJxDj0p72fYLe1l`:

| Layout | Root frame | Width |
| --- | --- | --- |
| Desktop | `549:2779` | 1440px |
| Mobile | `554:2845` | 390px |
| Tablet | `555:2910` | 834px |

Layouts switch at 600px and 1024px, and flow between the reference widths. Desktop keeps five process cards across. Tablet uses two columns; mobile stacks them. Payment comes before launch in all three layouts.

Tablet hero buttons keep 54px hit areas; the Figma tablet buttons collapse to the height of their text. This makes the implemented hero slightly taller.

## Brand

| Token | Value |
| --- | --- |
| Ink | `#18231b` |
| Cream | `#f5f2e9` |
| Sage | `#b8c9a8` |
| Green | `#1f6f22` |
| Lilac | `#d9cdea` |
| Display font | GFS Didot |
| UI font | Albert Sans |
| Corner radius | 0 |

Fonts are served from the build. The UI follows shadcn's editable source model, with brand variants for buttons, tabs, fields and dialogs.

## Artwork

The original Figma assets are stored in `public/figma/`. The local asset map records their source sections. No expiring Figma URLs are used at runtime.

Figma's dither effects were exported from the effect nodes, preserving the exact rendered pattern in PNGs. They do not require a WebGPU effect at runtime.

| Export | Figma node |
| --- | --- |
| Hero dither | `549:2783` |
| Advertiser dither | `549:3085` |
| Closing dither | `549:3402` |
| Footer dither wordmark | `549:3447` |

Mobile and tablet use their revised hero crop with the matching vertical gradient. Only artwork is rasterized. Headings, copy, controls, licence, cards and the workspace poster are HTML.

## Motion

The prototype guide is `504:2870` on motion page `468:2470`. Motion supplies masked headline reveals, profile spread, card focus, waveform movement, licence wipe, preview scale, image wipes and FAQ crossfade. Most reveals run once when they enter view. Shared easing is `[0.16, 1, 0.3, 1]`.

Lenis smooths wheel and anchor scrolling. Touch scroll stays native. Content remains visible without JavaScript. Reduced motion disables movement and smooth scrolling.

## Linked pages

The landing page links to branded preview routes with copy from the corresponding Figma pages. Their enquiries do not submit data; legal text remains draft. Those routes support the landing preview and do not claim a live product or live creator onboarding.
