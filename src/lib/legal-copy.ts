import operator from "./release-decisions.json";

type Section = { title: string; body?: string; bullets?: string[] };
type Document = {
  title: string;
  artwork: string;
  position: [number, number];
  lead: string;
  short: string[];
  sections: Section[];
};
const identity = operator.legalOperator
  ? `${operator.legalOperator} operates this website for Semblanse, a pre-launch project that has not yet incorporated. ${operator.legalOperator} is responsible for personal information collected through this website. Mailing address: ${operator.postalAddress}.`
  : "Semblanse is a pre-launch team building a campaign-specific creator licensing service. The legal operator and mailing address must be confirmed before this policy is published for launch.";
export const legalDraft =
  !operator.legalCopyApproved ||
  !operator.legalOperator ||
  !operator.postalAddress;

export const legalDocuments: Record<"privacy" | "terms", Document> = {
  privacy: {
    title: "Privacy policy",
    artwork: "door-and-key",
    position: [0.42, 0.5],
    lead: "How we handle information from this website, pilot applications and messages. Campaign samples have a separate consent step before we ask for them.",
    short: [
      "Applying grants no rights to your face, voice or likeness.",
      "We use your details to review applications, reply and arrange possible pilots.",
      "Optional PostHog analytics start only if you allow them. You can change your choice in the footer.",
      "We don’t sell your personal information.",
      `You can request access, correction or deletion at ${operator.privacyContact}.`,
    ],
    sections: [
      {
        title: "Who we are",
        body: `${identity} Our privacy contact is ${operator.privacyContact}; put “Privacy request” in the subject.`,
      },
      {
        title: "What we collect",
        bullets: [
          "Creator applications: your name, email, Instagram handle, linked profiles, category, country and the limits you choose to share.",
          "Pilot requests, contact messages and misuse reports: the contact details and other information you enter. Reports may contain information about another person or an ad.",
          "Instagram account checks: the message we ask you to send to @semblanse with your application email. Our team matches the sender and application to check control of that account. We don’t ask for your password or permission to post.",
          "Security and service operation: providers process connection details, including IP addresses, to serve the site, prevent abuse and check bots. Our application rate limits store keyed hashes of network and email identifiers rather than raw identifiers in those rate-limit records. Enquiry records still contain the contact details you submit.",
          "Optional website analytics: known page paths, clicks, scroll and section views, demo and FAQ use, form field names and outcomes, coarse device/browser details, referral channel and filtered campaign tags. Analytics do not include form answers, raw referrer URLs, URL query strings, session recordings or visitor IP addresses forwarded by our application.",
        ],
      },
      {
        title: "How we use it",
        body: "We review applications, find possible campaign matches, reply to requests, check control of an Instagram account, handle misuse reports and protect the website. With your permission, we also measure how people use the site. Submitting an enquiry lets us respond to it; it does not grant campaign rights or give blanket consent to unrelated marketing.",
      },
      {
        title: "Your samples and likeness",
        body: "These application forms do not ask you to upload face, body or voice recordings. Before collecting campaign samples, we will explain the purpose, who will have access, the production tools, any model setup, storage, retention and deletion limits, and obtain the permission needed for that processing. Our intended campaign licence grants no AI-training rights to a brand. Any separately proposed model use needs separate, specific permission. Applying does not authorise any of these uses.",
      },
      {
        title: "Who we share it with",
        bullets: [
          `${operator.legalOperator || "The website operator"} and the people working on Semblanse on its behalf who need the information to handle your application, enquiry or report.`,
          "Cloudflare hosts the site, stores enquiries in D1 and provides Turnstile bot checks. Cloudflare processes security and connection information for these services.",
          "Resend processes the details needed to send confirmations and team notifications. A stored enquiry and an email delivery are separate steps.",
          "PostHog processes optional website analytics in its US region. Our website uses random anonymous identifiers, without person profiles, automatic interaction capture or session recordings.",
          "Professional advisers or authorities where needed to meet legal duties, protect rights or handle a dispute. We limit disclosure to the purpose.",
        ],
      },
      {
        title: "Analytics and browser storage",
        bullets: [
          "Choose “Allow” in the analytics notice to enable optional measurement or “No thanks” to leave it off. Global Privacy Control and Do Not Track keep optional analytics off. Reopen “Analytics choices” in the footer to change your choice.",
          "The browser remembers your analytics choice for up to 180 days. After opt-in, an anonymous visitor identifier lasts up to 90 days, and a session identifier and filtered attribution stay in session storage, with a new analytics session after 30 idle minutes. These are browser-storage entries, not analytics cookies.",
          "Turning analytics off clears optional identifiers and queued events in this browser. It does not automatically remove events already sent to PostHog. Contact us about information you want removed; anonymous events may be difficult to link to you.",
          "The first page and campaign tags recorded are those available after you allow analytics. If you then send a form, we may save the filtered attribution with the enquiry. Refusing analytics does not prevent applications or messages.",
        ],
      },
      {
        title: "Processing outside your country",
        body: "Our providers may process information outside your country, where local laws may permit access by courts or authorities. PostHog analytics use its US region; Cloudflare operates a global network and Resend processes email through its service providers. Contact us for information about the providers used for your enquiry. We will disclose campaign-specific tools and storage before asking for campaign samples.",
      },
      {
        title: "How we keep it safe",
        body: "The website uses HTTPS, server-side input checks, bot verification, bounded requests and abuse limits. Access to stored enquiries and email accounts depends on provider and team access controls. No website or email service can guarantee complete security. Our campaign-sample safeguards will be explained before those samples are collected.",
      },
      {
        title: "How long we keep it",
        body: "We keep enquiry and application details while needed to respond, manage the waitlist or consider a pilot, and keep limited records where required for legal duties or a dispute. You can ask us to remove an application or message. We assess what we still need and explain any records we must retain. Browser-storage periods appear above. Campaign-sample retention will be disclosed separately before collection.",
      },
      {
        title: "Your choices and requests",
        body: `Email ${operator.privacyContact} with “Privacy request” to ask for access, correction or deletion, leave the waitlist, withdraw consent, or raise a concern. We may need enough information to check that a request is yours. Withdrawal does not undo lawful earlier processing; legal duties may limit deletion. We will explain any limit and respond within the period required by applicable law. You may also complain to the privacy regulator that applies to you.`,
      },
      {
        title: "Age and sensitive information",
        body: "Pilot applications are for adults aged 18 or over. We do not knowingly seek applications from children. The forms do not require government identity documents, health records or financial account details. Contact our privacy contact if you believe a child’s information was submitted.",
      },
      {
        title: "Changes to this policy",
        body: "We will update the date when this policy changes. For a material new use that needs consent, we will explain it and seek that consent before the new use begins. If a new company takes over this website, we will identify the new operator and explain any proposed transfer of personal information, with the notice or consent required by law. We may also give notice on the site or by email where appropriate.",
      },
    ],
  },
  terms: {
    title: "Terms of use",
    artwork: "scissors",
    position: [0.62, 0.5],
    lead: "The rules for this website and its applications. The product is in development; joining the waitlist is separate from accepting a campaign licence.",
    short: [
      "Joining the waitlist is free and grants no rights to your likeness.",
      "Pilot applicants must be 18 or older and apply as themselves or an authorised business representative.",
      "Product previews and example fees illustrate the intended service. Applying does not guarantee access, a campaign or earnings.",
      "A paid campaign needs its own agreement before work starts.",
    ],
    sections: [
      {
        title: "Who operates this site",
        body: `${identity} Questions about these terms: ${operator.privacyContact}.`,
      },
      {
        title: "Using this site",
        body: "You may browse the site and use its forms to enquire about Semblanse. Use it lawfully. Do not impersonate someone, submit material you lack permission to share, interfere with the site, bypass bot checks or access controls, flood our forms, or harvest personal information. These rules do not restrict rights that applicable law gives you.",
      },
      {
        title: "Product stage and examples",
        body: "Semblanse is pre-launch. Product descriptions explain the service we intend to build; previews and example campaigns, fees and results are illustrative. They are not an offer of a specific campaign, a promise of earnings, proof of ad performance or confirmation that all shown features are available. We agree any pilot’s actual scope, price and terms before you commit. Changes to the proposed product do not override an agreement already signed for a campaign.",
      },
      {
        title: "Applications and enquiries",
        body: "You must be at least 18 to apply for a pilot. Give accurate details and apply only as yourself or for a business you have authority to represent. An Instagram DM checks control of the account for a pilot application; it is not a complete identity or rights check. Applying is free, does not guarantee selection or a campaign, and gives no right to use your likeness. We may reply about your enquiry or possible campaigns, subject to your communication choices and applicable law.",
      },
      {
        title: "Campaign agreements",
        body: "Before paid work starts, the parties must accept a separate campaign agreement. It will set the creator, brand, fee, versions, channels, territory, duration, creative limits, approval process and payment terms, including cancellation, rejection and refunds. For that campaign, the signed agreement governs those matters. These website terms do not grant a likeness licence.",
      },
      {
        title: "The intended campaign rules",
        body: "Our intended model requires creator approval of every final ad, use only within agreed rights, and a new agreement for further use after expiry. A campaign licence grants no AI-training rights to the brand. These are permission rules; they do not guarantee that no person will misuse exported media. The campaign agreement will set the duties and remedies that apply to any breach.",
      },
      {
        title: "Your material and our site",
        body: "You keep any rights you hold in the material you submit. You give us only the permission needed to receive, store and review it, reply, and handle the enquiry or report as described in our privacy policy. That permission does not authorise ads using your face or voice, AI training, or a transfer of ownership. Rights in the Semblanse name and website materials remain with their respective owners.",
      },
      {
        title: "Privacy and other services",
        body: "Our privacy policy explains website information handling and optional analytics choices. Cloudflare provides hosting, enquiry storage and bot checks; Resend provides email delivery; PostHog provides opt-in analytics. Links to other services have their own terms and privacy practices. Those providers’ terms do not replace our responsibilities under applicable law.",
      },
      {
        title: "Availability and responsibility",
        body: "We may update the website, and access may be interrupted. To the extent applicable law permits, we provide website information as available, without a guarantee that it will meet every purpose, and exclude liability for indirect losses caused by use of the website. Nothing here excludes liability or consumer, privacy or other rights that the law does not allow us to exclude. Signed campaign obligations remain separate.",
      },
      {
        title: "Governing law and disputes",
        body:
          operator.governingLaw
            ? `These website terms are governed by ${operator.governingLaw}. Mandatory rights under applicable law remain unaffected.${operator.disputeVenue ? ` Subject to those rights, disputes will be heard in ${operator.disputeVenue}.` : ""}`
            : "This review draft requires confirmation of governing law before publication for launch. Mandatory rights under applicable law remain unaffected.",
      },
      {
        title: "Changes and contact",
        body: `The date above identifies this version. We will give appropriate notice of material changes; a website update does not change a signed campaign agreement. If a term is unenforceable, the rest continues to apply to the extent the law permits. Contact ${operator.privacyContact} with questions or an accessibility concern.`,
      },
    ],
  },
};
