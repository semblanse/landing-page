const maxBodyBytes = 32 * 1024;

/** Read at most the allowed bytes, including requests without Content-Length. */
export async function readJson(request: Request): Promise<unknown> {
  if (
    !/^application\/json(?:\s*;|$)/i.test(
      request.headers.get("content-type") ?? "",
    )
  )
    throw new Response(null, { status: 415 });
  const stated = Number(request.headers.get("content-length"));
  if (stated > maxBodyBytes) throw new Response(null, { status: 413 });
  const reader = request.body?.getReader();
  if (!reader) throw new Response(null, { status: 400 });
  let size = 0;
  const chunks: Uint8Array[] = [];
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBodyBytes) {
        await reader.cancel();
        throw new Response(null, { status: 413 });
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }
  try {
    return JSON.parse(
      new TextDecoder("utf-8", { fatal: true, ignoreBOM: false }).decode(bytes),
    );
  } catch {
    throw new Response(null, { status: 400 });
  }
}

export async function fingerprint(secret: string, value: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const bytes = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return Array.from(new Uint8Array(bytes), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
}

export async function verifyChallenge(
  secret: string,
  token: unknown,
  ip: string,
  hostname: string,
) {
  if (typeof token !== "string" || !token || token.length > 2048) return false;
  const local = hostname === "localhost" || hostname === "127.0.0.1";
  const testSecret = /^[123]x000000/.test(secret);
  if (testSecret && !local) return false;
  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      signal: AbortSignal.timeout(10_000),
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    },
  );
  if (!response.ok) throw new Error("Challenge service unavailable");
  const result = (await response.json()) as {
    success: boolean;
    hostname?: string;
    action?: string;
  };
  return (
    result.success &&
    ((local && testSecret) ||
      (result.hostname === hostname && result.action === "enquiry"))
  );
}

/** Each SQL update reserves one slot atomically. Raw addresses are never stored. */
export async function reserveRateSlot(
  db: {
    prepare(sql: string): {
      bind(...values: unknown[]): { first<T>(): Promise<T | null> };
    };
  },
  secret: string,
  scope: string,
  value: string,
  seconds: number,
  limit: number,
  now = Date.now(),
) {
  const window = Math.floor(now / (seconds * 1000));
  const hash = await fingerprint(secret, `${scope}:${value}`);
  const key = `${scope}:${hash}:${window}`;
  const result = await db
    .prepare(
      `INSERT INTO request_limits (key, hits, expires_at) VALUES (?, 1, ?)
     ON CONFLICT(key) DO UPDATE SET hits = hits + 1 WHERE hits < ? RETURNING hits`,
    )
    .bind(key, (window + 1) * seconds + 86400, limit)
    .first<{ hits: number }>();
  return result !== null;
}
