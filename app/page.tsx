"use client";

import { useEffect, useState } from "react";
import { getRTTData } from "@/lib/googleData";

export default function HomePage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getRTTData().then(setData);
  }, []);

  return (
    <main className="p-10 text-white">
      <h1 className="text-5xl font-black">Run The Table</h1>

      {!data && (
        <p className="mt-6 text-white/60">
          Loading board...
        </p>
      )}

      {data && (
        <div className="mt-6 space-y-2">
          {data.players.slice(0, 5).map((p: any) => (
            <div key={p.id}>
              #{p.rank} {p.name} — {p.points}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}