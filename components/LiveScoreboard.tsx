"use client";
import { useEffect, useMemo, useState } from "react";
import { getRTTData, RTTMatch } from "@/lib/googleData";
import { Card } from "@/components/Card";

export function LiveScoreboard() {
  const [matches, setMatches] = useState<RTTMatch[]>([]);
  const [updatedAt, setUpdatedAt] = useState("");
  const [loading, setLoading] = useState(true);
  async function refresh() {
    const data = await getRTTData();
    setMatches(data.matches);
    setUpdatedAt(data.updatedAt);
    setLoading(false);
  }
  useEffect(() => { refresh(); const timer = window.setInterval(refresh, 3000); return () => window.clearInterval(timer); }, []);
  const live = useMemo(() => matches.find((m) => (m.status || "").toLowerCase() === "live"), [matches]);
  const latest = live || matches[0];
  return <section className="mx-auto max-w-6xl"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.32em] text-rtt-red">Player View</p><h1 className="mt-3 text-5xl font-black italic uppercase leading-none md:text-8xl">Live Scores</h1></div><div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white/50">Auto-refresh 3s</div></div><Card className="mt-8 overflow-hidden border-rtt-red/40 bg-rtt-red/10 p-0">{loading ? <div className="p-10 text-center text-white/60">Loading live score...</div> : latest ? <div className="p-5 md:p-10"><div className="mb-6 flex flex-wrap items-center justify-between gap-3"><span className="rounded-full bg-rtt-red px-4 py-2 text-xs font-black uppercase tracking-[0.2em]">{(latest.status || "Latest").toUpperCase()}</span><span className="text-xs font-black uppercase tracking-[0.2em] text-white/45">{latest.type || "Match"} · Row {latest.row}</span></div><div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 md:gap-8"><p className="text-left text-2xl font-black italic uppercase leading-none md:text-6xl">{latest.playerA}</p><p className="text-center text-3xl font-black text-rtt-red md:text-7xl">VS</p><p className="text-right text-2xl font-black italic uppercase leading-none md:text-6xl">{latest.playerB}</p></div><div className="mt-8 grid grid-cols-[1fr_auto_1fr] items-center gap-3"><div className="rounded-[2rem] bg-black/60 p-5 text-center md:p-6"><p className="text-7xl font-black md:text-9xl">{latest.scoreA}</p></div><div className="text-3xl font-black text-white/30">-</div><div className="rounded-[2rem] bg-black/60 p-5 text-center md:p-6"><p className="text-7xl font-black md:text-9xl">{latest.scoreB}</p></div></div><p className="mt-6 text-center text-sm font-bold uppercase tracking-[0.2em] text-white/45">Game to 11 · Win by 2</p>{updatedAt && <p className="mt-3 text-center text-xs text-white/35">Last API update: {new Date(updatedAt).toLocaleTimeString()}</p>}</div> : <div className="p-10 text-center text-white/60">No matches yet.</div>}</Card><h2 className="mt-10 text-3xl font-black italic uppercase">Recent Matches</h2><div className="mt-4 grid gap-3">{matches.slice(0,8).map((m) => <Card key={`${m.matchId}-${m.row}`} className="flex flex-wrap items-center justify-between gap-3"><p className="font-black uppercase">{m.playerA} vs {m.playerB}</p><p className="text-white/60">{m.score}</p><p className="font-black text-rtt-red">{m.winner || m.status || "Scheduled"}</p></Card>)}</div></section>;
}
