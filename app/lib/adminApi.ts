/**
 * Admin write API wrapper.
 *
 * All write actions are POSTed to Apps Script doPost().
 * Apps Script validates the key before changing Google Sheets.
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
    body: JSON.stringify({ admin: 1, key, action, payload }),
  });

  if (!res.ok) throw new Error(`Admin API failed: ${res.status}`);
  return res.json();
}
