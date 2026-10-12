import { Reveal } from "@/components/landing/motion";
import { Action } from "@/components/landing/brand";
import {
  EditorialRows,
  ExampleLicence,
  PageActions,
  PageTitle,
  ProfileAccent,
} from "./shared";
import content from "./content.json";

export function PilotPage() {
  const sections = content.pilot.sections;
  const [hero, included, sides, decided] = sections.map((s) => s.text);
  return (
    <div data-figma-node={content.pilot.id}>
      <section className="lp-pilot-hero lp-green lp-section">
        <Reveal className="lp-columns">
          <div className="lp-hero-copy">
            <p className="lp-eyebrow">{hero[0]}</p>
            <PageTitle>{hero[1]}</PageTitle>
            <p className="lp-lead">{hero[2]}</p>
            <PageActions cream />
          </div>
          <ExampleLicence texts={hero} />
        </Reveal>
      </section>
      <section className="lp-section lp-includes">
        <p className="lp-eyebrow">{included[0]}</p>
        <h2 className="lp-heading lp-preserve-lines">{included[1]}</h2>
        <div className="lp-includes-grid">
          <EditorialRows texts={included.slice(2, 6)} />
          <EditorialRows texts={included.slice(6, 10)} />
        </div>
      </section>
      <section className="lp-sides">
        <div className="lp-sage">
          <p className="lp-eyebrow">{sides[0]}</p>
          <h2 className="lp-heading lp-preserve-lines">{sides[1]}</h2>
          <EditorialRows texts={sides.slice(2, 8)} />
          <div className="lp-actions">
            <Action href="/creator-pilot">Apply as a creator</Action>
          </div>
        </div>
        <div className="lp-lilac">
          <p className="lp-eyebrow">{sides[9]}</p>
          <h2 className="lp-heading lp-preserve-lines">{sides[10]}</h2>
          <EditorialRows texts={sides.slice(11, 17)} />
          <div className="lp-actions">
            <Action href="/brand-pilot">Book a pilot call</Action>
          </div>
        </div>
      </section>
      <section className="lp-section lp-ink">
        <div className="lp-editorial-grid">
          <div>
            <p className="lp-eyebrow">{decided[0]}</p>
            <h2 className="lp-heading lp-preserve-lines">{decided[1]}</h2>
            <p className="lp-lead">{decided[2]}</p>
          </div>
          <ul className="lp-open-terms">
            {decided.slice(3).map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

export function AboutPage() {
  const [hero, beliefs, limits, stage, closing] = content.about.sections.map(
    (s) => s.text,
  );
  return (
    <div data-figma-node={content.about.id}>
      <section className="lp-section lp-about-hero">
        <p className="lp-eyebrow">{hero[0]}</p>
        <PageTitle>{hero[1]}</PageTitle>
        <p className="lp-lead">{hero[2]}</p>
      </section>
      <section className="lp-section lp-ink lp-about-beliefs">
        <Reveal kind="scale">
          <ProfileAccent full />
        </Reveal>
        <div className="lp-editorial-grid">
          <div>
            <p className="lp-eyebrow">{beliefs[0]}</p>
            <h2 className="lp-heading lp-preserve-lines">{beliefs[1]}</h2>
          </div>
          <EditorialRows texts={beliefs.slice(2)} />
        </div>
      </section>
      <section className="lp-section lp-lilac">
        <div className="lp-editorial-grid">
          <div>
            <p className="lp-eyebrow">{limits[0]}</p>
            <h2 className="lp-heading lp-preserve-lines">{limits[1]}</h2>
          </div>
          <EditorialRows texts={limits.slice(2)} />
        </div>
      </section>
      <section className="lp-section lp-sage">
        <div className="lp-editorial-grid">
          <div>
            <p className="lp-eyebrow">{stage[0]}</p>
            <h2 className="lp-heading lp-preserve-lines">{stage[1]}</h2>
          </div>
          <div className="lp-stage-copy">
            {stage.slice(2).map((t) => (
              <p className="lp-lead" key={t}>
                {t}
              </p>
            ))}
          </div>
        </div>
      </section>
      <section className="lp-section lp-green lp-about-closing">
        <h2 className="lp-heading lp-preserve-lines">{closing[0]}</h2>
        <PageActions cream />
      </section>
    </div>
  );
}
