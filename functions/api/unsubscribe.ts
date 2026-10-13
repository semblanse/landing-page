type Env = { DB: D1Database };

const reply = (ok: boolean, status = 200) =>
  Response.json({ ok }, { status, headers: { "cache-control": "no-store" } });

/**
 * Stops email to the address behind one enquiry. The id in an email's
 * unsubscribe link is that enquiry's random id, which only its recipient has.
 * The unsubscribe page posts here, and so do mail apps' own unsubscribe
 * buttons (RFC 8058).
 */
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const id = new URL(request.url).searchParams.get("id") ?? "";
  if (!/^(?:[0-9a-f-]{36}|[0-9a-f]{64})$/.test(id)) return reply(false, 400);
  try {
    // Every enquiry from that address is marked, keeping the first date.
    await env.DB.prepare(
      `UPDATE enquiries SET unsubscribed_at = COALESCE(unsubscribed_at, ?)
       WHERE email = (SELECT email FROM enquiries WHERE id = ?)`,
    )
      .bind(new Date().toISOString(), id)
      .run();
  } catch (error) {
    console.error("Could not record an unsubscribe:", error);
    return reply(false, 503);
  }
  // The same answer whether or not the id matched an enquiry.
  return reply(true);
};
