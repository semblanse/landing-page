import { readJson, reserveRateSlot } from "../../server/request-security";
import { posthogPayload, reserveAnalyticsBudget } from "../../server/analytics";
type Env = {
  DB: D1Database;
  POSTHOG_API_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
  ANALYTICS_EVENT_LIMIT?: string;
};
const reply = (status = 204) =>
  new Response(null, { status, headers: { "cache-control": "no-store" } });
export const onRequestPost: PagesFunction<Env> = async ({
  request,
  env,
  waitUntil,
}) => {
  const origin = new URL(request.url).origin;
  if (request.headers.get("origin") !== origin) return reply(403);
  if (
    request.headers.get("sec-gpc") === "1" ||
    request.headers.get("dnt") === "1"
  )
    return reply();
  if (!env.POSTHOG_API_KEY || !env.TURNSTILE_SECRET_KEY) return reply(503);
  let stage = "input";
  try {
    const payload = posthogPayload(await readJson(request), origin);
    if (!payload) return reply(400);
    const ceiling = payload.environment === "production" ? 850_000 : 25_000;
    const configured = Number(env.ANALYTICS_EVENT_LIMIT ?? ceiling);
    const limit = Number.isFinite(configured)
      ? Math.max(0, Math.min(ceiling, Math.floor(configured)))
      : 0;
    stage = "rate-limit";
    if (
      !(await reserveRateSlot(
        env.DB,
        env.TURNSTILE_SECRET_KEY,
        "analytics-ip",
        request.headers.get("cf-connecting-ip") ?? "unknown",
        600,
        120,
      ))
    )
      return reply(429);
    stage = "event-budget";
    if (!(await reserveAnalyticsBudget(env.DB, payload.batch.length, limit)))
      return reply(429);
    waitUntil(
      env.DB.prepare("DELETE FROM request_limits WHERE expires_at < ?")
        .bind(Math.floor(Date.now() / 1000))
        .run()
        .then(() => undefined),
    );
    // Reserve first and never refund: retries and upstream failures cannot exceed the budget.
    stage = "provider";
    const upstream = await fetch("https://us.i.posthog.com/batch/", {
      method: "POST",
      signal: AbortSignal.timeout(8_000),
      redirect: "manual",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        api_key: env.POSTHOG_API_KEY,
        batch: payload.batch,
      }),
    });
    return reply(upstream.ok ? 204 : 502);
  } catch (error) {
    if (!(error instanceof Response))
      console.warn(
        "analytics_unavailable",
        stage,
        error instanceof Error ? `${error.name}: ${error.message}` : "Error",
      );
    return reply(error instanceof Response ? error.status : 503);
  }
};
