import { Card } from "@/components/Card";
import { getRTTData } from "@/lib/googleData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function LiveScoresPage() {
  const { matches } = await getRTTData();
  const liveMatches = matches.filter((m) => (m.status || "").toLowerCase() === "live");
  const latest = liveMatches[0] || matches[0];

  return (
    <main className="rtt-grid min-h-screen px-5 py-8 text-white">
      <section className="mx-auto max-w-6xl">
        <p className="text-xs font-black uppercase tracking-[0.32em] text-rtt-red">Player View</p>
        <h1 className="mt-3 text-6xl font-black italic uppercase leading-none md:text-8xl">Live Scores</h1>
        <Card className="mt-8 overflow-hidden border-rtt-red/40 bg-rtt-red/10 p-0">
          {latest ? (
            <div className="p-6 md:p-10">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <span className="rounded-full bg-rtt-red px-4 py-2 text-xs font-black uppercase tracking-[0.2em]">{(latest.status || "Latest").toUpperCase()}</span>
                <span className="text-sm font-black uppercase tracking-[0.2em] text-white/45">{latest.type || "Match"}</span>
              </div>
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 md:gap-8">
                <p className="text-left text-3xl font-black italic uppercase leading-none md:text-6xl">{latest.playerA}</p>
                <p className="text-center text-4xl font-black text-rtt-red md:text-7xl">VS</p>
                <p className="text-right text-3xl font-black italic uppercase leading-none md:text-6xl">{latest.playerB}</p>
              </div>
              <div className="mt-8 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                <div className="rounded-[2rem] bg-black/60 p-6 text-center"><p className="text-7xl font-black md:text-9xl">{latest.scoreA}</p></div>
                <div className="text-3xl font-black text-white/30">-</div>
                <div className="rounded-[2rem] bg-black/60 p-6 text-center"><p className="text-7xl font-black md:text-9xl">{latest.scoreB}</p></div>
              </div>
              <p className="mt-6 text-center text-sm font-bold uppercase tracking-[0.2em] text-white/45">Game to 11 · Win by 2</p>
            </div>
          ) : <div className="p-10 text-center text-white/60">No matches yet.</div>}
        </Card>
        <h2 className="mt-10 text-3xl font-black italic uppercase">Recent Matches</h2>
        <div className="mt-4 grid gap-3">
          {matches.slice(0, 8).map((m) => (
            <Card key={`${m.matchId}-${m.row}`} className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-black uppercase">{m.playerA} vs {m.playerB}</p>
              <p className="text-white/60">{m.score}</p>
              <p className="font-black text-rtt-red">{m.winner || m.status || "Scheduled"}</p>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
