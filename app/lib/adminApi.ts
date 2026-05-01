const API_URL = process.env.NEXT_PUBLIC_RTT_API_URL || "";

export async function adminAction<TPayload extends Record<string, unknown>>(
  action: string,
  key: string,
  payload: TPayload = {} as TPayload
) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify({
      admin: 1,
      key,
      action,
      payload,
    }),
  });

  if (!res.ok) {
    throw new Error(`Admin API failed with HTTP ${res.status}`);
  }

  return res.json();
}