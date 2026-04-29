import { weeklyResults, matches } from "@/lib/mockData";
import { Card } from "@/components/Card";

export default function ResultsPage() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-10 text-white">
      <p className="text-xs font-black uppercase tracking-[0.3em] text-rtt-red">Outcomes</p>
      <h1 className="mt-3 text-5xl font-black uppercase">Results</h1>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {weeklyResults.map((w) => (
          <Card key={w.week}>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-rtt-red">Week {w.week}</p>
            <h2 className="mt-2 text-2xl font-black uppercase">{w.winner}</h2>
            <p className="mt-2 text-white/60">{w.players} players · ${w.prizePool} prize pool</p>
          </Card>
        ))}
      </div>
      <h2 className="mt-10 text-3xl font-black uppercase">Latest Matches</h2>
      <div className="mt-4 space-y-3">
        {matches.map((m, i) => (
          <Card key={i}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="font-black uppercase">{m.playerA} vs {m.playerB}</p>
              <p className="text-white/60">{m.score}</p>
              <p className="font-black text-rtt-red">{m.winner}</p>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}
