// Forwards analytics from this site's own /relay path to PostHog (US), so
// events arrive first-party. src/lib/analytics.ts points PostHog here.
const api = "us.i.posthog.com";
const assets = "us-assets.i.posthog.com";

export const onRequest: PagesFunction = async ({ request }) => {
  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/relay/, "");
  const target = `https://${path.startsWith("/static/") ? assets : api}${path}${url.search}`;

  const headers = new Headers(request.headers);
  headers.delete("cookie");
  headers.delete("host");
  // PostHog reads the visitor's address from this header for geolocation.
  const ip = request.headers.get("cf-connecting-ip");
  if (ip) headers.set("x-forwarded-for", ip);

  return fetch(target, {
    method: request.method,
    headers,
    body: request.body,
    redirect: "follow",
  });
};
