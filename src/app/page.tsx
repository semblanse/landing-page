import { LandingPage } from "@/components/landing/landing-page";
import { brands, creators } from "@/lib/faq";
import { jsonLd } from "@/lib/site";
export default function Home() {
  return (
    <>
      {/* The questions section, repeated in full for search and answer
          engines. The page itself shows one audience at a time. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          "@type": "FAQPage",
          mainEntity: [...creators, ...brands].map(([question, answer]) => ({
            "@type": "Question",
            name: question,
            acceptedAnswer: { "@type": "Answer", text: answer },
          })),
        })}
      />
      <LandingPage />
    </>
  );
}
