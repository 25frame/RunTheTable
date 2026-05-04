export async function getRTTData() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);

  try {
    const res = await fetch("/api/rtt", {
      cache: "no-store",
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) throw new Error("RTT API failed");

    return await res.json();
  } catch {
    clearTimeout(timeout);

    return {
      ok: false,
      players: [],
      matches: [],
      weeklyResults: [],
      payout: null,
    };
  }
}