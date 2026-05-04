const RTT_API_URL = process.env.NEXT_PUBLIC_RTT_API_URL!;

let cachedData: string | null = null;
let cachedAt = 0;

const CACHE_MS = 10_000;

export async function GET() {
  const now = Date.now();

  if (cachedData && now - cachedAt < CACHE_MS) {
    return new Response(cachedData, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=10, stale-while-revalidate=30",
      },
    });
  }

  const res = await fetch(RTT_API_URL, {
    method: "GET",
    cache: "no-store",
  });

  const text = await res.text();

  cachedData = text;
  cachedAt = now;

  return new Response(text, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, s-maxage=10, stale-while-revalidate=30",
    },
  });
}

export async function POST(req: Request) {
  const body = await req.text();

  const res = await fetch(RTT_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body,
    cache: "no-store",
  });

  const text = await res.text();

  // Clear cache after admin/player writes.
  cachedData = null;
  cachedAt = 0;

  if (text.trim().startsWith("<")) {
    return Response.json({
      ok: false,
      error: "Apps Script returned HTML instead of JSON.",
      status: res.status,
      preview: text.slice(0, 500),
    });
  }

  return new Response(text, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}