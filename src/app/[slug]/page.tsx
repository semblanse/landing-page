import { notFound } from "next/navigation";
import type { Metadata } from "next";
import data from "@/lib/linked-pages.json";
import { Navigation, Footer } from "@/components/landing/landing-page";
import { Action } from "@/components/landing/brand";
import { PilotForm } from "@/components/landing/pilot-form";
const pages = data as Record<
  string,
  {
    id: string;
    name: string;
    sections: { id: string; name: string; text: string[] }[];
  }
>;
export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return { title: `${pages[slug]?.sections[0].text[0] ?? "Page"} · Semblanse` };
}
export default async function LinkedPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = pages[slug];
  if (!page) notFound();
  const legal = slug === "privacy" || slug === "terms";
  const hero = page.sections[0].text;
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navigation />
      <main id="main">
        <section className="subpage-hero">
          <p className="eyebrow">{hero[0]}</p>
          <h1>{hero[1]}</h1>
          <p>{hero[2]}</p>
          {legal ? (
            <p className="form-notice">
              {hero[3]}: {hero[4]}
            </p>
          ) : (
            <Action
              href={
                slug === "creator-pilot" ||
                slug === "brand-pilot" ||
                slug === "contact"
                  ? "#enquiry"
                  : "/creator-pilot"
              }
            >
              {slug === "brand-pilot"
                ? "Ask about a pilot"
                : slug === "contact"
                  ? "Send a message"
                  : "Join the creator pilot"}
            </Action>
          )}
        </section>
        {page.sections.slice(1).map((section) => {
          const t = section.text;
          if (section.name.startsWith("Enquiry"))
            return (
              <section
                key={section.id}
                className="subpage-content"
                id="enquiry"
              >
                <div className="subpage-grid">
                  <div>
                    <h2>{t[0]}</h2>
                    <p>{t[1]}</p>
                    <p>{t[2]}</p>
                  </div>
                  <PilotForm
                    kind={
                      slug === "creator-pilot"
                        ? "creator"
                        : slug === "brand-pilot"
                          ? "brand"
                          : "contact"
                    }
                  />
                </div>
              </section>
            );
          if (section.name === "Policy content")
            return (
              <section key={section.id} className="subpage-content">
                <div className="legal-copy">
                  {t
                    .slice(9)
                    .filter((_, i) => i % 2 === 0)
                    .map((title, i) => (
                      <article key={title}>
                        <h2 className="!text-3xl">{title}</h2>
                        <p>{t[10 + i * 2]}</p>
                      </article>
                    ))}
                </div>
              </section>
            );
          if (section.name === "Policy questions")
            return (
              <section key={section.id} className="subpage-content">
                <h2>{t[0]}</h2>
                <Action href="/contact">Contact Semblanse</Action>
              </section>
            );
          if (section.name.startsWith("Editorial"))
            return (
              <section key={section.id} className="subpage-content">
                <div className="subpage-grid">
                  <h2 className="whitespace-pre-line">{t[0]}</h2>
                  <div>
                    {t
                      .slice(1)
                      .filter((_, i) => i % 2 === 0)
                      .map((title, i) => (
                        <article key={title}>
                          <h3>{title}</h3>
                          <p>{t[2 + i * 2]}</p>
                        </article>
                      ))}
                  </div>
                </div>
              </section>
            );
          if (section.name === "A pilot from offer to payment")
            return (
              <section key={section.id} className="subpage-content">
                <h2>{t[0]}</h2>
                {Array.from({ length: 5 }, (_, i) => (
                  <article key={i}>
                    <h3>{t[2 + i * 3]}</h3>
                    <p>{t[3 + i * 3]}</p>
                  </article>
                ))}
              </section>
            );
          return (
            <section key={section.id} className="subpage-content">
              <div className="legal-copy">
                <h2 className="whitespace-pre-line">{t[0]}</h2>
                {t.slice(1).map((text, i) => (
                  <p key={i}>{text}</p>
                ))}
                <div className="hero-actions mt-7">
                  <Action href="/creator-pilot">For creators</Action>
                  <Action href="/brand-pilot" variant="secondary">
                    For advertisers
                  </Action>
                </div>
              </div>
            </section>
          );
        })}
      </main>
      <Footer />
    </>
  );
}
