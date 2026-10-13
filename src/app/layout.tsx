import type { Metadata, Viewport } from "next";
import "@fontsource/gfs-didot/latin-400.css";
import "@fontsource-variable/albert-sans";
import "./globals.css";
import "./analytics.css";
import { ScrollProvider } from "@/components/landing/motion";
import { Analytics } from "@/lib/analytics";
import {
  jsonLd,
  production,
  shareImage,
  siteDescription,
  siteName,
  siteTitle,
  siteUrl,
} from "@/lib/site";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  applicationName: siteName,
  alternates: { canonical: "/" },
  robots: { index: production, follow: production },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: siteTitle,
    description:
      "Licensed AI ads starring real creators. Pre-launch; recruiting for our first paid pilots.",
    url: "/",
    siteName,
    locale: "en_CA",
    images: [shareImage("home")],
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};
export const viewport: Viewport = { themeColor: "#18231b" };
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* Entrance states apply only once scripts run, so content is never
            hidden without JavaScript. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
        {/* Tells search and answer engines who publishes the site. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd({
            "@graph": [
              {
                "@type": "Organization",
                "@id": `${siteUrl}/#organization`,
                name: siteName,
                url: `${siteUrl}/`,
                logo: `${siteUrl}/icon-512.png`,
                description:
                  "Semblanse is building a licensing service for a real creator’s face, voice and stories in AI-made ads, one campaign at a time, with approval of every final ad.",
                email: "hello@semblanse.com",
                sameAs: ["https://www.instagram.com/semblanse"],
              },
              {
                "@type": "WebSite",
                "@id": `${siteUrl}/#website`,
                name: siteName,
                url: `${siteUrl}/`,
                publisher: { "@id": `${siteUrl}/#organization` },
                inLanguage: "en",
              },
            ],
          })}
        />
        <Analytics />
        <ScrollProvider>{children}</ScrollProvider>
      </body>
    </html>
  );
}
