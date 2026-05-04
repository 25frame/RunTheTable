"use client";

import { useEffect, useMemo, useState } from "react";
import { BattleCard } from "@/components/BattleCard";
import { LiveBattleHero } from "@/components/LiveBattleHero";
import { getRTTData, RTTData, RTTMatch } from "@/lib/googleData";

export function LiveScoreboard() {
  const [data, setData] = useState<RTTData | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    const next = await getRTTData();
    setData(next);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
    const timer = window.setInterval(refresh, 8000);
    return () => window.clearInterval(timer);
  }, []);

  const matches = data?.matches || [];

  const live = useMemo(
    () => matches.find((m) => (m.status || "").toLowerCase() === "live"),
    [matches]
  );

  const latest: RTTMatch | undefined = live || matches[0];

  return (
    <section className="rtt-max">
      <p className="rtt-kicker">Live Battle</p>
      <h1 className="rtt-title">LIVE<br />NOW</h1>

      <div className="mt-7">
        {loading ? (
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.055] py-20 text-center text-white/50">
            Loading...
          </div>
        ) : latest ? (
          <LiveBattleHero match={latest} />
        ) : (
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.055] py-20 text-center text-white/50">
            No battles yet.
          </div>
        )}
      </div>

      <section className="mt-8">
        <p className="rtt-kicker">Battle Log</p>
        <div className="mt-4 grid gap-3">
          {matches.slice(0, 8).map((m) => (
            <BattleCard key={`${m.matchId}-${m.row}`} match={m} players={data?.players || []} />
          ))}
        </div>
      </section>
    </section>
  );
}
