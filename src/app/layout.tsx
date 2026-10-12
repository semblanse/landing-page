import type { Metadata } from "next";
import "@fontsource/gfs-didot/latin-400.css";
import "@fontsource-variable/albert-sans";
import "./globals.css";
import { ScrollProvider } from "@/components/landing/motion";
export const metadata: Metadata = {
  metadataBase: new URL(
    "https://revision-3.semblanse-landing-preview.pages.dev",
  ),
  title: "Semblanse · Your likeness. Your say.",
  description:
    "Get paid for ads you never had to film. License your likeness for one campaign, share your stories, and approve every finished ad.",
  robots: { index: false, follow: false },
  icons: { icon: "/favicon.png" },
  openGraph: {
    title: "Semblanse · Your likeness. Your say.",
    description:
      "Licensed AI ads starring real creators. Now recruiting for our first paid campaigns.",
    images: ["/og-image.png"],
    type: "website",
  },
};
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
        <ScrollProvider>{children}</ScrollProvider>
      </body>
    </html>
  );
}
