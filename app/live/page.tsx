"use client";

import { useEffect, useState } from "react";
import { getRTTData, RTTMatch } from "@/lib/googleData";

export default function LivePage() {
  const [matches, setMatches] = useState<RTTMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();

    const timer = setInterval(load, 8000);
    return () => clearInterval(timer);
  }, []);

  async function load() {
    try {
      const data = await getRTTData();
      setMatches(data.matches || []);
    } finally {
      setLoading(false);
    }
  }

  const live = matches.find(
    (m) => (m.status || "").toLowerCase() === "live"
  );

  return (
    <main className="p-10 text-white">
      <h1 className="text-5xl font-black">Live Match</h1>

      {loading && (
        <p className="mt-6 text-white/60">Loading...</p>
      )}

      {!loading && !live && (
        <p className="mt-6 text-white/60">
          No live match right now.
        </p>
      )}

      {live && (
        <div className="mt-6 text-3xl font-black">
          {live.playerA} {live.scoreA} — {live.scoreB} {live.playerB}
        </div>
      )}
    </main>
  );
}