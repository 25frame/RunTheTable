export async function POST(req: Request) {
  const body = await req.text();

  const res = await fetch(process.env.NEXT_PUBLIC_RTT_API_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
    cache: "no-store",
  });

  const text = await res.text();

  return new Response(JSON.stringify({
    debug: {
      url: process.env.NEXT_PUBLIC_RTT_API_URL,
      status: res.status,
      response: text
    }
  }), {
    headers: { "Content-Type": "application/json" }
  });
}