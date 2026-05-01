import Link from "next/link";
import { getRTTData } from "@/lib/googleData";
import { Card } from "@/components/Card";

export default async function StandingsPage() {
  const { players } = await getRTTData();
  const sorted = [...players].sort((a, b) => a.rank - b.rank);

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-5 py-8 text-white">
      <p className="text-xs font-black uppercase tracking-[0.3em] text-rtt-red">League Board</p>
      <h1 className="mt-3 text-5xl font-black italic uppercase leading-none md:text-7xl">Standings</h1>
      <div className="mt-8 grid gap-4 md:hidden">
        {sorted.map((p) => (
          <Card key={p.id} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div><p className="text-sm font-black uppercase tracking-[0.2em] text-rtt-red">Rank #{p.rank}</p><h2 className="mt-2 text-3xl font-black italic uppercase">{p.name}</h2><p className="mt-1 text-sm text-white/50">{p.skill}</p></div>
              <Link href={`/players/${p.id}`} className="rounded-full bg-rtt-red px-4 py-2 text-xs font-black uppercase tracking-[0.15em]">View</Link>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl bg-white/5 p-3"><p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/40">Record</p><p className="mt-1 text-xl font-black">{p.wins}-{p.losses}</p></div>
              <div className="rounded-2xl bg-white/5 p-3"><p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/40">Points</p><p className="mt-1 text-xl font-black">{p.points}</p></div>
              <div className="rounded-2xl bg-white/5 p-3"><p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/40">Diff</p><p className="mt-1 text-xl font-black">{p.pointDiff > 0 ? "+" : ""}{p.pointDiff}</p></div>
            </div>
          </Card>
        ))}
      </div>
      <div className="mt-8 hidden overflow-hidden rounded-[2rem] border border-white/10 bg-black/45 md:block">
        <div className="grid grid-cols-6 bg-rtt-red px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-white"><span>Rank</span><span>Player</span><span>Record</span><span>Points</span><span>Diff</span><span>Profile</span></div>
        {sorted.map((p) => (
          <div key={p.id} className="grid grid-cols-6 items-center border-t border-white/10 px-4 py-4 text-sm odd:bg-white/[0.03]"><span className="font-black text-rtt-red">#{p.rank}</span><span className="font-black uppercase">{p.name}</span><span>{p.wins}-{p.losses}</span><span>{p.points}</span><span>{p.pointDiff}</span><Link className="font-bold text-rtt-red underline" href={`/players/${p.id}`}>View</Link></div>
        ))}
      </div>
    </main>
  );
}
