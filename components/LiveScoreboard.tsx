"use client";

import { useEffect, useMemo, useState } from "react";
import { getRTTData, RTTMatch } from "@/lib/googleData";

export function LiveScoreboard() {
  const [matches, setMatches] = useState<RTTMatch[]>([]);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    const data = await getRTTData();
    setMatches(data.matches);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
    const timer = window.setInterval(refresh, 3000);
    return () => window.clearInterval(timer);
  }, []);

  const live = useMemo(() => matches.find((m) => (m.status || "").toLowerCase() === "live"), [matches]);
  const latest = live || matches[0];

  return (
    <section className="rtt-max">
      <p className="rtt-kicker">Live Battle</p>
      <h1 className="rtt-title">LIVE<br />NOW</h1>

      <div className="mt-7 rtt-card overflow-hidden p-5">
        {loading ? (
          <div className="py-20 text-center text-white/50">Loading...</div>
        ) : latest ? (
          <>
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full bg-rtt-red px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em]">
                {(latest.status || "Battle").toUpperCase()}
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/35">
                {latest.type || "Street"} / Row {latest.row}
              </span>
            </div>

            <div className="mt-8 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <h2 className="min-w-0 break-words text-left text-4xl font-black italic uppercase leading-none tracking-[-0.07em]">
                {latest.playerA}
              </h2>
              <div className="text-2xl font-black text-rtt-red">VS</div>
              <h2 className="min-w-0 break-words text-right text-4xl font-black italic uppercase leading-none tracking-[-0.07em]">
                {latest.playerB}
              </h2>
            </div>

            <div className="mt-8 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <div className="rounded-[2rem] bg-black/70 p-5 text-center">
                <p className="text-8xl font-black leading-none">{latest.scoreA}</p>
              </div>
              <div className="text-4xl font-black text-white/25">—</div>
              <div className="rounded-[2rem] bg-black/70 p-5 text-center">
                <p className="text-8xl font-black leading-none">{latest.scoreB}</p>
              </div>
            </div>

            <p className="mt-6 text-center text-xs font-black uppercase tracking-[0.22em] text-white/35">
              Game to 11 / win by 2
            </p>
          </>
        ) : (
          <div className="py-20 text-center text-white/50">No battles yet.</div>
        )}
      </div>

      <section className="mt-8">
        <p className="rtt-kicker">Battle Log</p>
        <div className="mt-4 grid gap-3">
          {matches.slice(0, 8).map((m) => (
            <div key={`${m.matchId}-${m.row}`} className="rtt-card p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate text-lg font-black uppercase">{m.playerA} vs {m.playerB}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-white/35">
                    {m.type || "Battle"} / {m.status || "Scheduled"}
                  </p>
                </div>
                <div className="shrink-0 text-2xl font-black text-rtt-red">{m.score}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
