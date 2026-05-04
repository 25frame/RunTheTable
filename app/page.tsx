"use client";

import { useEffect, useState } from "react";
import { getRTTData, RTTData } from "@/lib/googleData";

export default function HomePage() {
  const [data, setData] = useState<RTTData | null>(null);

  useEffect(() => {
    getRTTData().then(setData);
  }, []);

  return (
    <main className="p-10 text-white">
      <h1 className="text-5xl font-black">Run The Table</h1>

      {!data && (
        <div className="mt-6 animate-pulse text-white/50">
          Loading park...
        </div>
      )}

      {data && (
        <div className="mt-6 space-y-3">
          <p className="text-lg text-white/70">
            Live Players
          </p>

          {data.players.slice(0, 5).map((p) => (
            <div key={p.id} className="border-b border-white/10 pb-2">
              #{p.rank} {p.name} — {p.points}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}