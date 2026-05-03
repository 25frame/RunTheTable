import { getRTTData } from "@/lib/googleData";
import { Card } from "@/components/Card";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import { notFound } from "next/navigation";

export default async function PlayerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { players, matches } = await getRTTData();
  const player = players.find((p) => p.id === id);
  if (!player) notFound();
  const winPct = Math.round((player.wins / Math.max(player.wins + player.losses, 1)) * 100);
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-5 py-10 text-white">
      <section className="grid gap-5 md:grid-cols-[1.1fr_0.9fr]">
        <Card className="relative overflow-hidden"><div className="absolute inset-x-0 top-0 h-1.5 bg-rtt-red" /><div className="grid gap-5 pt-3 md:grid-cols-[180px_1fr]"><div className="h-56 overflow-hidden rounded-3xl bg-black md:h-full"><PlayerAvatar player={player} /></div><div><p className="text-xs font-black uppercase tracking-[0.3em] text-rtt-red">Player Profile</p><h1 className="mt-3 text-5xl font-black italic uppercase leading-none md:text-6xl">{player.name}</h1><p className="mt-2 text-lg text-white/55">{player.handle}</p><div className="mt-4 flex flex-wrap gap-2"><span className="rounded-full border border-white/15 px-3 py-1 text-xs font-black uppercase tracking-[0.18em]">{player.skill}</span><span className="rounded-full bg-rtt-red px-3 py-1 text-xs font-black uppercase tracking-[0.18em]">Rank #{player.rank}</span></div></div></div></Card>
        <div className="grid grid-cols-2 gap-4">{[["Wins", player.wins], ["Losses", player.losses], ["Win %", `${winPct}%`], ["Points", player.points]].map(([label, value]) => (<Card key={label}><p className="text-xs font-black uppercase tracking-[0.2em] text-white/45">{label}</p><p className="mt-3 text-4xl font-black">{value}</p></Card>))}</div>
      </section>
      <section className="mt-6 grid gap-6 md:grid-cols-2">
        <Card><p className="text-xs font-black uppercase tracking-[0.3em] text-rtt-red">Metrics</p><h2 className="mt-2 text-3xl font-black italic uppercase">Ranking</h2><div className="mt-5 space-y-3"><div className="flex justify-between rounded-2xl bg-white/5 p-4"><span>Game Diff</span><b>{player.gameDiff > 0 ? "+" : ""}{player.gameDiff}</b></div><div className="flex justify-between rounded-2xl bg-white/5 p-4"><span>Point Diff</span><b>{player.pointDiff > 0 ? "+" : ""}{player.pointDiff}</b></div><div className="flex justify-between rounded-2xl bg-white/5 p-4"><span>Streak</span><b className="text-rtt-red">{player.streak || "Active"}</b></div></div></Card>
        <Card><p className="text-xs font-black uppercase tracking-[0.3em] text-rtt-red">Matches</p><h2 className="mt-2 text-3xl font-black italic uppercase">Recent Log</h2><div className="mt-5 space-y-3">{matches.filter((m) => m.playerA === player.name || m.playerB === player.name).slice(0, 6).map((m) => (<div key={`${m.matchId}-${m.row}`} className="rounded-2xl bg-white/5 p-4"><p className="font-black uppercase">{m.playerA} vs {m.playerB}</p><p className="text-sm text-white/55">{m.score} · Winner: {m.winner || "TBD"}</p></div>))}</div></Card>
      </section>
    </main>
  );
}
