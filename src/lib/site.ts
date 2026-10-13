/** True for the build that goes to semblanse.com. Previews stay out of search. */
export const production = process.env.SITE_ENV === "production";

export const siteUrl = production
  ? "https://semblanse.com"
  : (process.env.PREVIEW_SITE_URL ??
    "https://revision-3.semblanse-landing-preview.pages.dev");

export const siteName = "Semblanse";
export const siteTitle = "Semblanse · Your likeness. Your say.";
export const siteDescription =
  "Get paid for ads you never had to film. We’re building campaign-specific likeness licensing with creator approval. Apply for our first paid pilots.";

/** Share images, designed in Figma (667:2133) at 1200×630. */
const shareImages = {
  home: "A creator in profile beside a ring light, with the line: Get paid for ads you never had to film.",
  brands:
    "A hand holding a framed profile, with the line: A real creator in your AI ads.",
  trust:
    "A hand turning a key in a door, with the line: Nothing runs without a yes.",
  careers:
    "A profile wearing headphones, with the line: Help put permission into AI ads.",
  about:
    "A hand mirror showing a profile, with the line: AI can copy anyone’s face. Permission is what’s scarce.",
};
export type ShareImage = keyof typeof shareImages;

export function shareImage(name: ShareImage) {
  return {
    url: `/og/${name}.png`,
    width: 1200,
    height: 630,
    alt: shareImages[name],
  };
}

type Page = {
  title: string;
  description: string;
  image: ShareImage;
  noIndex?: boolean;
};

/** Every page under the home page: its name, search description and share image. */
export const pages: Record<string, Page> = {
  investors: {
    title: "Investors",
    description:
      "Meet the Semblanse team and the planned creator-identity licensing model: campaign rights, context, final approval, payment and renewal. Service first; platform next.",
    image: "about",
  },
  unsubscribe: {
    title: "Unsubscribe",
    description: "Manage email from Semblanse.",
    image: "home",
    noIndex: true,
  },
  "creator-pilot": {
    title: "Apply as a creator",
    description:
      "Apply to join Semblanse’s first paid campaigns. License your likeness for one campaign at a time and approve every final ad.",
    image: "home",
  },
  "brand-pilot": {
    title: "Book a pilot call",
    description:
      "Book a call about a Semblanse pilot: license a real creator for one campaign, with their stories, limits and sign-off on every final ad.",
    image: "brands",
  },
  brands: {
    title: "For brands and agencies",
    description:
      "Semblanse is building the licensing service between your team and real creators: one licence per campaign, the creator’s stories and limits, and approval of every final AI ad.",
    image: "brands",
  },
  trust: {
    title: "Trust & Safety",
    description:
      "Semblanse’s planned campaign checks, consent records, limits on use and creator approval, plus the current pilot application account check and misuse-report route.",
    image: "trust",
  },
  about: {
    title: "About",
    description:
      "We’re building Semblanse so brands can license a real creator’s face, voice and stories for AI-made ads, one campaign at a time, with approval of every final ad.",
    image: "about",
  },
  careers: {
    title: "Careers",
    description:
      "We’re a small pre-launch team building the licensing service between creators and brands. See the open roles and how to apply.",
    image: "careers",
  },
  contact: {
    title: "Contact",
    description:
      "Questions about the pilots, a partnership or press? Send Semblanse a note and we’ll reply by email.",
    image: "home",
  },
  pilot: {
    title: "Pilot overview",
    description:
      "Our team will run Semblanse’s first paid pilots by hand, handling each licence, approval and payment while we build the platform.",
    image: "brands",
  },
  privacy: {
    title: "Privacy policy",
    description:
      "What personal information Semblanse collects through this website, why, and who it is shared with.",
    image: "home",
  },
  terms: {
    title: "Terms of use",
    description: "The terms that apply when you use the Semblanse website.",
    image: "home",
  },
};

/** A structured-data block for search engines and AI answer engines. */
export function jsonLd(data: object) {
  return {
    __html: JSON.stringify({
      "@context": "https://schema.org",
      ...data,
    }).replace(/</g, "\\u003c"),
  };
}
