const RTT_API_URL = process.env.NEXT_PUBLIC_RTT_API_URL!;

let cachedData: string | null = null;
let cachedAt = 0;

const CACHE_MS = 120_000; // 120 seconds

export async function GET() {
  const now = Date.now();

  if (cachedData && now - cachedAt < CACHE_MS) {
    return new Response(cachedData, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
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
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
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

  // 🔥 Clear cache on any write
  cachedData = null;
  cachedAt = 0;

  return new Response(text, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}