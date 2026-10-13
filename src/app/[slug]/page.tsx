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
import { jsonLd, pages, shareImage, siteName, siteUrl } from "@/lib/site";
import { UnsubscribePage } from "@/components/linked-pages/unsubscribe";
import "../linked-pages.css";
export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = pages[slug];
  if (!page) return {};
  const title = `${page.title} · ${siteName}`;
  return {
    title,
    ...(page.noIndex && { robots: { index: false, follow: false } }),
    description: page.description,
    alternates: { canonical: `/${slug}/` },
    openGraph: {
      title,
      description: page.description,
      url: `/${slug}/`,
      siteName,
      locale: "en_CA",
      images: [shareImage(page.image)],
      type: "website",
    },
  };
}

export default async function LinkedPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!(slug in pages)) notFound();
  const { title } = pages[slug];
  const enquiry =
    slug === "creator-pilot" || slug === "brand-pilot" || slug === "contact";
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: `${siteUrl}/`,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: title,
              item: `${siteUrl}/${slug}/`,
            },
          ],
        })}
      />
      <Navigation />
      <main id="main" className="linked-page">
        {/* An enquiry page draws its own trail, which grows once it is sent. */}
        {!enquiry && <Breadcrumbs trail={[["Home", "/"], [title]]} />}
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
