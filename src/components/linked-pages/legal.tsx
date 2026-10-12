import Link from "next/link";
import { PageTitle } from "./shared";
import content from "./content.json";

function anchor(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export function LegalPage({ kind }: { kind: "privacy" | "terms" }) {
  const page = content[kind];
  const header = page.sections[0].text;
  const body = page.sections[1].text;
  const summaryIndex = body.indexOf("The short version");
  const toc = body.slice(1, summaryIndex);
  const articleIndex = body.indexOf(toc[0], summaryIndex);
  const summary = body
    .slice(summaryIndex + 1, articleIndex)
    .filter((t) => t !== "✓");
  const articles = toc.map((title, i) => {
    const start = body.indexOf(title, articleIndex);
    const end =
      i + 1 < toc.length ? body.indexOf(toc[i + 1], start + 1) : body.length;
    const paragraphs = body.slice(start + 1, end);
    return {
      title,
      confirm: paragraphs.includes("To confirm"),
      paragraphs: paragraphs.filter((t) => t !== "To confirm"),
    };
  });
  return (
    <div data-figma-node={page.id}>
      <header className="lp-legal-header lp-ink">
        <div className="lp-badges">
          <span>{header[0]}</span>
          <span>{header[1]}</span>
        </div>
        <PageTitle>{header[2]}</PageTitle>
        <p className="lp-lead">{header[3]}</p>
        <p className="lp-legal-draft">
          Draft for legal review. These terms and data practices need
          confirmation before the live service launches.
        </p>
      </header>
      <div className="lp-legal-document">
        <aside className="lp-legal-toc">
          <p className="lp-eyebrow">ON THIS PAGE</p>
          <nav aria-label="On this page">
            {toc.map((title) => (
              <Link key={title} href={`#${anchor(title)}`}>
                {title}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="lp-legal-content">
          <div className="lp-summary-stage">
            <section className="lp-summary">
              <h2>The short version</h2>
              <ul>
                {summary.map((t) => (
                  <li key={t}>
                    <span aria-hidden="true">✓</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
          {articles.map(({ title, confirm, paragraphs }) => (
            <section
              key={title}
              id={anchor(title)}
              className="lp-legal-article"
            >
              <h2>
                {title}
                {confirm && (
                  <span className="lp-confirm-badge"> To confirm</span>
                )}
              </h2>
              {paragraphs.length > 1 ? (
                <ul>
                  {paragraphs.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              ) : (
                <p>{paragraphs[0]}</p>
              )}
            </section>
          ))}
          <p className="lp-legal-contact">
            Questions about this draft?{" "}
            <Link href="/contact">Contact Semblanse</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
