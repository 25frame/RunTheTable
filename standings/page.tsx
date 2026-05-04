"use client";

import { useEffect, useState } from "react";
import { getRTTData } from "@/lib/googleData";

export default function StandingsPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getRTTData().then(setData);
  }, []);

  if (!data) {
    return (
      <main className="p-10 text-white">
        <h1 className="text-4xl font-bold">Standings</h1>
        <p className="mt-6 text-white/60">Loading board...</p>
      </main>
    );
  }

  return (
    <main className="p-10 text-white">
      <h1 className="text-4xl font-bold">Standings</h1>

      <div className="mt-6 space-y-2">
        {data.players.map((p: any) => (
          <div key={p.id} className="border-b border-white/10 py-2">
            #{p.rank} {p.name} — {p.points} pts
          </div>
        ))}
      </div>
    </main>
  );
}