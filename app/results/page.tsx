import { getRTTData } from "@/lib/googleData";
import { Card } from "@/components/Card";

export default async function ResultsPage() {
  const { weeklyResults, matches } = await getRTTData();
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-5 py-10 text-white">
      <p className="text-xs font-black uppercase tracking-[0.3em] text-rtt-red">Outcomes</p><h1 className="mt-3 text-6xl font-black italic uppercase">Results</h1>
      <div className="mt-8 grid gap-5 md:grid-cols-3">{weeklyResults.map((w) => (<Card key={w.week}><p className="text-xs font-black uppercase tracking-[0.24em] text-rtt-red">Week {w.week}</p><h2 className="mt-2 text-2xl font-black uppercase">{w.winner}</h2><p className="mt-2 text-white/60">{w.players} players · ${w.prizePool} prize pool</p><p className="mt-2 text-sm text-white/45">1st ${w.first} · 2nd ${w.second} · 3rd ${w.third}</p></Card>))}</div>
      <h2 className="mt-10 text-3xl font-black italic uppercase">Latest Matches</h2>
      <div className="mt-4 space-y-3">{matches.map((m) => (<Card key={`${m.matchId}-${m.row}`}><div className="flex flex-wrap items-center justify-between gap-4"><p className="font-black uppercase">{m.playerA} vs {m.playerB}</p><p className="text-white/60">{m.score}</p><p className="font-black text-rtt-red">{m.winner || m.status}</p></div></Card>))}</div>
    </main>
  );
}
