import type { Metadata } from "next";
import { Navigation, Footer } from "@/components/landing/landing-page";
import { Action } from "@/components/landing/brand";
import { Lines } from "@/components/landing/motion";
import { LoadArt, TextLink, delay } from "@/components/linked-pages/shared";
import "./linked-pages.css";

export const metadata: Metadata = {
  title: "Page not found · Semblanse",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navigation />
      <main id="main" className="linked-page">
        <section className="sp-hero sp-missing">
          <Lines
            as="h1"
            className="sp-display"
            lines={["This page hasn’t", "been licensed."]}
            onLoad
          />
          <p className="sp-lead" data-hero style={delay(0.35)}>
            The page you’re looking for doesn’t exist, or it’s moved.
          </p>
          <div className="sp-actions" data-hero style={delay(0.47)}>
            <Action href="/">Back to the homepage</Action>
          </div>
          <nav
            className="sp-or-try"
            aria-label="Popular pages"
            data-hero
            style={delay(0.6)}
          >
            <span>Or try:</span>
            <TextLink href="/creator-pilot">Apply as a creator</TextLink>
            <TextLink href="/#how-it-works">How it works</TextLink>
            <TextLink href="/brands">For brands and agencies</TextLink>
            <TextLink href="/pilot">Pilot overview</TextLink>
            <TextLink href="/contact">Contact</TextLink>
          </nav>
        </section>
        <LoadArt
          name="searching"
          className="sp-missing-art"
          position={[0.5, 0.35]}
        />
      </main>
      <Footer ink />
    </>
  );
}
