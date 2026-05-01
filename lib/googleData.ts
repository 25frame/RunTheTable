const API_URL =
  "https://script.google.com/macros/s/AKfycbycnGdAqxQUpqLAyO9sQ1DfrSzDk94_sf0wBzCVZgDVrqVjZQ3xxIS6AZ39U07Stodd/exec";

export async function getRTTData() {
  try {
    const res = await fetch(API_URL, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("API failed");

    const data = await res.json();

    return {
      players: data.players || [],
      weeklyResults: data.weeklyResults || [],
      formUrl: data.formUrl || "",
    };
  } catch (err) {
    console.error("RTT API ERROR:", err);

    return {
      players: [],
      weeklyResults: [],
      formUrl: "",
    };
  }
}