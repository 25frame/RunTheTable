const RTT_API_URL =
  "https://script.google.com/macros/s/AKfycbycnGdAqxQUpqLAyO9sQ1DfrSzDk94_sf0wBzCVZgDVrqVjZQ3xxIS6AZ39U07Stodd/exec";

export async function GET() {
  const res = await fetch(RTT_API_URL, { cache: "no-store" });
  return new Response(await res.text(), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: Request) {
  const body = await req.text();

  const res = await fetch(RTT_API_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body,
    redirect: "follow",
  });

  const text = await res.text();

  return new Response(text, {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}