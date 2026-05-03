const RTT_API_URL =
  process.env.NEXT_PUBLIC_RTT_API_URL ||
  "https://script.google.com/macros/s/AKfycbzfa1L7ujOLoleBFIXZs9LlE6g2eD_UPy_8el7VYGqDdPZA7HmRf5ZFfqHL7mrqCP7o/exec";

export async function GET() {
  const res = await fetch(RTT_API_URL, { cache: "no-store", redirect: "follow" });
  const text = await res.text();

  return new Response(text, {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}

export async function POST(req: Request) {
  const body = await req.text();

  const res = await fetch(RTT_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body,
    redirect: "follow"
  });

  const text = await res.text();

  if (text.trim().startsWith("<")) {
    return Response.json({
      ok: false,
      error:
        "Apps Script returned HTML instead of JSON. Check Apps Script deployment: Execute as Me, Access Anyone, New version.",
      status: res.status,
      contentType: res.headers.get("content-type"),
      preview: text.slice(0, 500)
    });
  }

  return new Response(text, {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}
