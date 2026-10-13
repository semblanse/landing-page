import type { MetadataRoute } from "next";
import { production, siteUrl } from "@/lib/site";

export const dynamic = "force-static";

/** Production welcomes every crawler, AI ones included. Previews turn them away. */
export default function robots(): MetadataRoute.Robots {
  if (!production) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/relay/"] },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
