/** True for the build that goes to semblanse.com. Previews stay out of search. */
export const production = process.env.SITE_ENV === "production";

export const siteUrl = production
  ? "https://semblanse.com"
  : "https://revision-3.semblanse-landing-preview.pages.dev";

export const siteName = "Semblanse";
export const siteTitle = "Semblanse · Your likeness. Your say.";
export const siteDescription =
  "Get paid for ads you never had to film. License your likeness for one campaign, share your stories, and approve every finished ad.";

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
      "Semblanse is the licensing service between your team and real creators: one licence per campaign, the creator’s stories and limits, and their approval of every final AI ad.",
    image: "brands",
  },
  trust: {
    title: "Trust & Safety",
    description:
      "How Semblanse confirms who creators are, records consent, limits what a brand can do and acts on misuse. No ad runs without the creator’s yes.",
    image: "trust",
  },
  about: {
    title: "About",
    description:
      "Semblanse lets brands license a real creator’s face, voice and stories for AI-made ads, one campaign at a time. The creator approves every final ad.",
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
      "Semblanse’s first campaigns are run by hand. Our team handles every licence, approval and payment for a few creators and brands.",
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
