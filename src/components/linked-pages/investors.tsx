import { Action } from "@/components/landing/brand";
import { ScrollArtwork } from "@/components/landing/landing-page";
import { Lines, Reveal } from "@/components/landing/motion";
import { TextLink, art, delay } from "./shared";

/** Editable Figma design: desktop 684:2134, mobile 684:2243. */
export function InvestorsPage() {
  return (
    <>
      <section className="sp-hero" id="investor-overview">
        <Lines
          as="h1"
          className="sp-display"
          lines={["The licensing infrastructure", "for creator identity."]}
          onLoad
        />
        <p className="sp-lead" data-hero style={delay(0.35)}>
          We’re building the transaction between creators and AI advertising:
          context, campaign rights, final approval, payment and renewal.
          Starting with paid social.
        </p>
        <div className="sp-actions" data-hero style={delay(0.47)}>
          <Action href="/contact/">Talk to the team</Action>
          <TextLink href="/pilot/">See the pilot overview</TextLink>
        </div>
      </section>
      <section className="sp-statements sp-ink" id="investor-model">
        <div className="sp-statements-copy">
          <Lines className="sp-heading" lines={["The model"]} />
          <ul>
            {[
              [
                "Context and permission.",
                "A creator’s story and limits sit alongside a narrow campaign licence.",
              ],
              [
                "Approval and payment.",
                "Creators approve each final ad. Our intended workflow secures funds before work starts and releases the fee at approval.",
              ],
              [
                "A fee on the licence.",
                "We plan to earn a transaction fee. We will test pricing, delivery costs and repeat demand through the pilots.",
              ],
            ].map(([title, body], i) => (
              <Reveal as="li" key={title} delay={i * 0.1}>
                <h3>{title}</h3>
                <p>{body}</p>
              </Reveal>
            ))}
          </ul>
        </div>
        <ScrollArtwork
          className="sp-statements-art"
          src={art("portrait/hand-mirror")}
          alt=""
          from="right"
        />
      </section>
      <section className="sp-aside-rows" id="team">
        <Lines className="sp-heading" lines={["The team"]} />
        <ul>
          {[
            [
              "Mateo Bivol",
              "University of Toronto. Built a B2B marketplace from the ground up for a previous startup, with experience in software, product and advertising.",
            ],
            [
              "Stefan D’Amato",
              "Ivey Business School. Experience in software M&A, finance, advertising and research.",
            ],
          ].map(([name, body], i) => (
            <Reveal as="li" key={name} delay={i * 0.1}>
              <h3>{name}</h3>
              <p>{body}</p>
            </Reveal>
          ))}
        </ul>
      </section>
      <section className="sp-row sp-row-about" id="investor-roadmap">
        <ScrollArtwork className="sp-row-art" src={art("panels")} alt="" />
        <div className="sp-row-copy">
          <Lines
            className="sp-heading"
            lines={["Service first.", "Platform next."]}
          />
          <Reveal as="p" delay={0.15}>
            We’re recruiting for our first paid pilots and building the product.
            Managed campaigns come first; a self-serve platform and licensing
            API are the planned next steps.
          </Reveal>
          <Reveal delay={0.25}>
            <TextLink href="/contact/">Request the deck</TextLink>
          </Reveal>
        </div>
      </section>
    </>
  );
}
