import { Navigation, Footer } from "@/components/landing/landing-page";
import { Action } from "@/components/landing/brand";
import {
  PosterPage,
  ProfileRow,
  TextLink,
} from "@/components/linked-pages/shared";
import "./linked-pages.css";

export default function NotFound() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navigation />
      <main id="main" className="linked-page">
        <PosterPage
          tone="sage"
          title={"This page hasn’t\nbeen licensed."}
          actions={<Action href="/">Back to the homepage</Action>}
          after={
            <nav className="sp-or-try" aria-label="Popular pages">
              <span>Or try:</span>
              <TextLink href="/#how-it-works">How it works</TextLink>
              <TextLink href="/#for-advertisers">For advertisers</TextLink>
              <TextLink href="/pilot">Pilot overview</TextLink>
              <TextLink href="/contact">Contact</TextLink>
            </nav>
          }
          profiles={<ProfileRow missing />}
        >
          The page you’re looking for doesn’t exist, or it’s moved.
        </PosterPage>
      </main>
      <Footer />
    </>
  );
}
