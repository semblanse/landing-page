import type { MetadataRoute } from "next";
import { pages, siteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: `${siteUrl}/`, lastModified, priority: 1 },
    ...Object.keys(pages).map((slug) => ({
      url: `${siteUrl}/${slug}/`,
      lastModified,
      priority: slug === "privacy" || slug === "terms" ? 0.3 : 0.7,
    })),
  ];
}
