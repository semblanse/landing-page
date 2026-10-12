import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Navigation, Footer } from "@/components/landing/landing-page";
import { EnquiryPage } from "@/components/linked-pages/enquiry";
import { AboutPage, PilotPage } from "@/components/linked-pages/editorial";
import { LegalPage } from "@/components/linked-pages/legal";
import content from "@/components/linked-pages/content.json";
import "../linked-pages.css";

const titles: Record<string, string> = {
  "creator-pilot": "Apply as a creator",
  "brand-pilot": "Book a pilot call",
  about: "About",
  contact: "Contact",
  pilot: "Pilot overview",
  privacy: "Privacy policy · Draft",
  terms: "Terms of use · Draft",
};

export function generateStaticParams() {
  return Object.keys(content).map((slug) => ({ slug }));
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
  if (!(slug in content)) notFound();
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navigation />
      <main id="main" className="linked-page">
        {slug === "creator-pilot" ||
        slug === "brand-pilot" ||
        slug === "contact" ? (
          <EnquiryPage kind={slug} />
        ) : slug === "pilot" ? (
          <PilotPage />
        ) : slug === "about" ? (
          <AboutPage />
        ) : (
          <LegalPage kind={slug as "privacy" | "terms"} />
        )}
      </main>
      <Footer />
    </>
  );
}
