/** Pages' _headers file does not cover Function responses. */
export const onRequest: PagesFunction = async ({ next }) => {
  const upstream = await next();
  const response = new Response(upstream.body, upstream);
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  return response;
};
