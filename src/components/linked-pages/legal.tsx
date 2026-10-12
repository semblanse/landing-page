type Section = {
  title: string;
  /** Marked "To confirm" in the draft. */
  open?: boolean;
  body?: string;
  bullets?: string[];
};

const documents: Record<
  "privacy" | "terms",
  { title: string; lead: string; short: string[]; sections: Section[] }
> = {
  privacy: {
    title: "Privacy policy",
    lead: "What we collect, why, who sees it, and what you can ask us to do with it.",
    short: [
      "We collect only what we need to run the waitlist and the pilots.",
      "If you take part in a campaign, your samples are used only to make that campaign’s ads.",
      "No licence ever includes the right to train AI on your likeness.",
      "We don’t sell your information.",
      "You can ask us to delete your information. We keep only what we must, such as signed licences and approval records.",
    ],
    sections: [
      {
        title: "Who we are",
        body: "Semblanse runs this website and our pilot campaigns.",
      },
      {
        title: "What we collect",
        open: true,
        bullets: [
          "Waitlist applications: your name, email, what you make, where you live, the profiles you link, and anything you tell us you won’t promote.",
          "Instagram sign-in: your username and basic profile details, so we can confirm the account is yours. We don’t receive your messages or permission to post.",
          "Pilot requests and messages: your name, work email, company and what you tell us.",
          "Pilot creators: the face, body and voice samples you record, the stories and limits you share, and a record of every approval.",
        ],
      },
      {
        title: "How we use it",
        body: "To run the waitlist and match you with campaigns, confirm identities, prepare and track campaign licences, pay creators, reply to you, and improve the service.",
      },
      {
        title: "Your samples and likeness",
        body: "No brand can use your likeness until you accept its offer. If you take part in a campaign, your samples are used only to make that campaign’s ads. A licence never includes permission to train AI on your samples, and when it ends, the brand must stop running the ads.",
      },
      {
        title: "Who we share it with",
        bullets: [
          "The brand in a licence you’ve accepted, and the production tools its team uses, only to make that campaign’s ads.",
          "Service providers who host, email and process payments for us, under contracts that limit how they use it.",
          "Authorities, if the law requires it.",
        ],
      },
      {
        title: "How we keep it safe",
        open: true,
        body: "Samples and campaign records are stored with access limited to the people who need them for a campaign. The specific safeguards are being finalised.",
      },
      {
        title: "How long we keep it",
        open: true,
        body: "Waitlist details stay until you ask us to remove them. Campaign records stay for the length of the licence, and afterwards for as long as payment and legal records require. How long we keep samples after a licence ends is still being set.",
      },
      {
        title: "What you can ask us to do",
        body: "You can ask to see, correct or delete your information, or leave the waitlist. We keep only what we must, such as signed licences, approval records and payment records. Where we rely on your consent, you can withdraw it.",
      },
      {
        title: "Changes to this policy",
        body: "If we change this policy, we’ll update the date at the top and email waitlist members about anything important.",
      },
      {
        title: "How to reach us",
        body: "Write to us through the contact page and say it’s a privacy request.",
      },
    ],
  },
  terms: {
    title: "Terms of use",
    lead: "The rules for using this site and joining the waitlist. Each campaign also has its own licence, signed by the creator and the brand before any work starts.",
    short: [
      "Joining the waitlist is free and grants no rights to your likeness.",
      "Apply only as yourself. You must be 18 or older.",
      "Each campaign has its own signed licence. For that campaign, the licence takes priority over these terms.",
      "Brands may run only the versions a creator has approved, and only as the licence allows.",
    ],
    sections: [
      {
        title: "Using this site",
        body: "You can browse and use this site for your own information. Please don’t misuse it, try to break it, or scrape it.",
      },
      {
        title: "The waitlist",
        body: "Joining the waitlist doesn’t guarantee a campaign, and it grants no rights to your likeness. We may contact you about campaigns that fit what you make.",
      },
      {
        title: "Applying as yourself",
        body: "You must be 18 or older and apply only as yourself. Don’t submit someone else’s face, voice or account.",
      },
      {
        title: "Campaign licences",
        body: "Each campaign has its own signed licence. It sets the brand, fee, channels, territory, term and creative limits. For that campaign, the licence takes priority over these terms.",
      },
      {
        title: "For brands and agencies",
        body: "Use a creator’s likeness only as their licence allows, and only run versions the creator has approved. Campaign use ends when the licence expires, and the brand must stop running the ads.",
      },
      {
        title: "What you own",
        body: "You keep ownership of what you share with us, and you let us use it to run the waitlist and set up campaigns. The Semblanse name, site and materials belong to us.",
      },
      {
        title: "Limits of our responsibility",
        open: true,
        body: "The site is provided as it is. To the extent the law allows, we aren’t responsible for indirect losses from using it.",
      },
      {
        title: "Governing law",
        open: true,
        body: "The laws that apply to these terms, and where disputes are resolved, are still being set.",
      },
      {
        title: "Changes and questions",
        body: "We may update these terms, and the date at the top shows the latest version. Questions? Write to us through the contact page.",
      },
    ],
  },
};

const anchor = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z]+/g, "-")
    .replace(/^-|-$/g, "");

export function LegalPage({ kind }: { kind: "privacy" | "terms" }) {
  const doc = documents[kind];
  return (
    <>
      <section className="sp-legal-hero sp-ink">
        <p className="sp-tags">
          <span className="sp-tag">Draft</span>
          <span className="sp-tag sp-tag-sage">Last updated October 2026</span>
        </p>
        <h1 className="sp-display">{doc.title}</h1>
        <p className="sp-lead">{doc.lead}</p>
        <div className="sp-short">
          <h2>In short:</h2>
          <ul>
            {doc.short.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
      </section>
      <div className="sp-document">
        <nav aria-label="On this page">
          <h2>On this page</h2>
          {doc.sections.map(({ title }) => (
            <a key={title} href={`#${anchor(title)}`}>
              {title}
            </a>
          ))}
        </nav>
        <div className="sp-document-body">
          {doc.sections.map((section) => (
            <section key={section.title} id={anchor(section.title)}>
              <h2>
                {section.title}
                {section.open && <span className="sp-tag">To confirm</span>}
              </h2>
              {section.body && <p>{section.body}</p>}
              {section.bullets && (
                <ul>
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
