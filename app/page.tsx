import Link from "next/link";
import { Card } from "@/components/Card";
import { players, weeklyResults } from "@/lib/mockData";

export default function HomePage() {
  const latest = weeklyResults[0];
  const top = players.slice(0, 3);

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-6xl px-4 py-12 md:py-20">
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.35em] text-rtt-red">Run The Table</p>
            <h1 className="mt-4 text-6xl font-black uppercase leading-[0.9] tracking-tight md:text-8xl">RTT NYC</h1>
            <p className="mt-5 max-w-2xl text-lg text-white/65">
              A community table tennis league with weekly play, standings, player profiles, and prize payouts.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/play" className="rounded-2xl bg-rtt-red px-6 py-3 text-sm font-black uppercase tracking-[0.2em]">Join This Week</Link>
              <Link href="/standings" className="rounded-2xl border border-white/15 px-6 py-3 text-sm font-black uppercase tracking-[0.2em] text-white/80">View Standings</Link>
            </div>
          </div>
          <Card>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-rtt-red">Latest Winner</p>
            <h2 className="mt-3 text-4xl font-black uppercase">{latest.winner}</h2>
            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl bg-white/5 p-4"><p className="text-white/45">Players</p><p className="text-2xl font-black">{latest.players}</p></div>
              <div className="rounded-2xl bg-white/5 p-4"><p className="text-white/45">Prize Pool</p><p className="text-2xl font-black">${latest.prizePool}</p></div>
              <div className="rounded-2xl bg-white/5 p-4"><p className="text-white/45">Organizer Cut</p><p className="text-2xl font-black">${latest.organizerCut}</p></div>
              <div className="rounded-2xl bg-white/5 p-4"><p className="text-white/45">1st Place</p><p className="text-2xl font-black text-rtt-red">${latest.first}</p></div>
            </div>
          </Card>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {top.map((p) => (
            <Card key={p.id}>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-rtt-red">Rank #{p.rank}</p>
              <h3 className="mt-2 text-2xl font-black uppercase">{p.name}</h3>
              <p className="text-white/55">{p.wins}-{p.losses} · {p.points} pts</p>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
