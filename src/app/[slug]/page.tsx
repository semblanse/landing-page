import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Navigation, Footer } from "@/components/landing/landing-page";
import { EnquiryPage } from "@/components/linked-pages/enquiry";
import {
  AboutPage,
  BrandsPage,
  PilotPage,
  TrustPage,
} from "@/components/linked-pages/editorial";
import { LegalPage } from "@/components/linked-pages/legal";
import { Breadcrumbs } from "@/components/linked-pages/shared";
import "../linked-pages.css";

const titles: Record<string, string> = {
  "creator-pilot": "Apply as a creator",
  "brand-pilot": "Book a pilot call",
  brands: "For brands and agencies",
  trust: "Trust & Safety",
  about: "About",
  contact: "Contact",
  pilot: "Pilot overview",
  privacy: "Privacy policy",
  terms: "Terms of use",
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
  return { title: `${titles[slug] ?? "Page"} · Semblanse` };
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
        ) : slug === "brands" ? (
          <BrandsPage />
        ) : slug === "trust" ? (
          <TrustPage />
        ) : (
          <LegalPage kind={slug as "privacy" | "terms"} />
        )}
      </main>
      <Footer ink />
    </>
  );
}
