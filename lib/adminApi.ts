/**
 * Admin Write API wrapper.
 */
const API_URL = process.env.NEXT_PUBLIC_RTT_API_URL || "https://script.google.com/macros/s/AKfycbycnGdAqxQUpqLAyO9sQ1DfrSzDk94_sf0wBzCVZgDVrqVjZQ3xxIS6AZ39U07Stodd/exec";

export async function adminAction<TPayload extends Record<string, unknown>>(
  action: string,
  key: string,
  payload: TPayload = {} as TPayload
) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ admin: 1, key, action, payload })
  });
  if (!res.ok) throw new Error(`Admin API failed with HTTP ${res.status}`);
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || "Admin API returned an error.");
  return data;
}
