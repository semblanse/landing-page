import { Lines, Reveal } from "@/components/landing/motion";
import { SplitHero, delay } from "./shared";

import { legalDocuments as documents, legalDraft } from "@/lib/legal-copy";

const anchor = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z]+/g, "-")
    .replace(/^-|-$/g, "");

export function LegalPage({ kind }: { kind: "privacy" | "terms" }) {
  const doc = documents[kind];
  return (
    <>
      <SplitHero
        artwork={doc.artwork}
        position={doc.position}
        className="sp-legal-hero"
      >
        <p className="sp-tags" data-hero>
          <span className="sp-tag sp-tag-sage">
            {legalDraft
              ? "Review draft · October 13, 2026"
              : "Last updated October 13, 2026"}
          </span>
        </p>
        <Lines as="h1" className="sp-display" lines={[doc.title]} onLoad />
        <p className="sp-lead" data-hero style={delay(0.3)}>
          {doc.lead}
        </p>
        <div className="sp-short" data-hero style={delay(0.42)}>
          <h2>In short:</h2>
          <ul>
            {doc.short.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
      </SplitHero>
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
            <Reveal as="section" key={section.title} id={anchor(section.title)}>
              <h2>{section.title}</h2>
              {section.body && (
                <p className={section.operatorDetails ? "sp-operator-details" : undefined}>
                  {section.body}
                </p>
              )}
              {section.bullets && (
                <ul>
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </>
  );
}
