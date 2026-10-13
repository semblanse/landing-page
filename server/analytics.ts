import { validateBatch } from "../src/lib/analytics-schema";

export async function reserveAnalyticsBudget(
  db: D1Database,
  count: number,
  limit: number,
  now = Date.now(),
) {
  const day = new Date(now).toISOString().slice(0, 10);
  const cutoff = new Date(now - 32 * 86400_000).toISOString().slice(0, 10);
  const row = await db
    .prepare(
      `INSERT INTO analytics_budget (day, events) SELECT ?, ? WHERE
       (SELECT COALESCE(SUM(events), 0) FROM analytics_budget WHERE day >= ?) + ? <= ?
     ON CONFLICT(day) DO UPDATE SET events = events + excluded.events RETURNING events`,
    )
    .bind(day, count, cutoff, count, limit)
    .first();
  return row !== null;
}

export function posthogPayload(raw: unknown, origin: string, now = Date.now()) {
  const input = validateBatch(raw, now);
  if (!input) return null;
  const hostname = new URL(origin).hostname;
  const environment =
    hostname === "semblanse.com" || hostname === "www.semblanse.com"
      ? "production"
      : "preview";
  return {
    input,
    environment,
    batch: input.events.map((e) => ({
      event: e.event,
      distinct_id: input.distinctId,
      timestamp: e.timestamp,
      uuid: e.uuid,
      properties: {
        ...e.properties,
        $session_id: input.sessionId,
        $process_person_profile: false,
        $geoip_disable: true,
        $ip: "0.0.0.0",
        site_environment: environment,
        analytics_version: 2,
        $lib: "semblanse-web",
        $browser: e.properties.browser,
        $os: e.properties.os,
        $device_type: e.properties.device,
        $host: hostname,
        $pathname: e.properties.path ?? "/other/",
        $current_url: `${origin}${e.properties.path ?? "/other/"}`,
      },
    })),
  };
}
