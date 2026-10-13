import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Navigation, Footer } from "@/components/landing/landing-page";
import { EnquiryPage } from "@/components/linked-pages/enquiry";
import {
  AboutPage,
  BrandsPage,
  CareersPage,
  PilotPage,
  TrustPage,
} from "@/components/linked-pages/editorial";
import { LegalPage } from "@/components/linked-pages/legal";
import { Breadcrumbs } from "@/components/linked-pages/shared";
import { UnsubscribePage } from "@/components/linked-pages/unsubscribe";
import "../linked-pages.css";

const titles: Record<string, string> = {
  "creator-pilot": "Apply as a creator",
  "brand-pilot": "Book a pilot call",
  brands: "For brands and agencies",
  trust: "Trust & Safety",
  about: "About",
  careers: "Careers",
  contact: "Contact",
  pilot: "Pilot overview",
  privacy: "Privacy policy",
  terms: "Terms of use",
  unsubscribe: "Unsubscribe",
};

export function generateStaticParams() {
  return Object.keys(titles).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `${titles[slug] ?? "Page"} · Semblanse`,
    // Reached only from an email; keep it out of search results.
    ...(slug === "unsubscribe" && { robots: { index: false, follow: false } }),
  };
}

export default async function LinkedPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!(slug in titles)) notFound();
  const enquiry =
    slug === "creator-pilot" || slug === "brand-pilot" || slug === "contact";
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navigation />
      <main id="main" className="linked-page">
        {/* An enquiry page draws its own trail, which grows once it is sent. */}
        {!enquiry && <Breadcrumbs trail={[["Home", "/"], [titles[slug]]]} />}
        {enquiry ? (
          <EnquiryPage kind={slug} />
        ) : slug === "pilot" ? (
          <PilotPage />
        ) : slug === "about" ? (
          <AboutPage />
        ) : slug === "careers" ? (
          <CareersPage />
        ) : slug === "brands" ? (
          <BrandsPage />
        ) : slug === "trust" ? (
          <TrustPage />
        ) : slug === "unsubscribe" ? (
          <UnsubscribePage />
        ) : (
          <LegalPage kind={slug as "privacy" | "terms"} />
        )}
      </main>
      <Footer ink />
    </>
  );
}
