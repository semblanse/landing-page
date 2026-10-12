import { Navigation, Footer } from "@/components/landing/landing-page";
import { Action } from "@/components/landing/brand";
import { ArrowLink, PageTitle } from "@/components/linked-pages/shared";
import "./linked-pages.css";

export default function NotFound() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navigation />
      <main id="main" className="linked-page">
        <section className="lp-not-found lp-ink" data-figma-node="572:3021">
          <div className="lp-not-found-copy">
            <p className="lp-eyebrow">PAGE NOT FOUND</p>
            <PageTitle>{"This page hasn’t\nbeen licensed."}</PageTitle>
            <p className="lp-lead">
              The page you’re looking for doesn’t exist, or it’s moved.
            </p>
            <div className="lp-actions">
              <Action href="/" variant="cream">
                Back to the homepage
              </Action>
              <Action href="/creator-pilot">Apply as a creator</Action>
            </div>
            <nav className="lp-not-found-links" aria-label="Popular pages">
              <p className="lp-eyebrow">OR TRY</p>
              <ArrowLink href="/#how-it-works">How it works</ArrowLink>
              <ArrowLink href="/pilot">Pilot overview</ArrowLink>
              <ArrowLink href="/contact">Contact</ArrowLink>
            </nav>
          </div>
          <div className="lp-missing-profile" aria-hidden="true">
            <img
              src="/linked-pages/572-3021-imgProfileEcho2.svg"
              className="lp-missing-profile-2"
              alt=""
            />
            <img
              src="/linked-pages/572-3021-imgProfileEcho4.png"
              className="lp-missing-profile-4"
              alt=""
            />
            <img
              src="/linked-pages/572-3021-imgProfileEcho6.svg"
              className="lp-missing-profile-6"
              alt=""
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
