import { getRTTData } from "@/lib/googleData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function LivePage() {
  const data = await getRTTData();
  const matches = data?.matches || [];
  const liveMatch =
    matches.find((m) => (m.status || "").toLowerCase() === "live") ||
    matches[0];

  return (
    <main className="rtt-shell text-white">
      <section className="rtt-max">
        <p className="rtt-kicker">Live Match</p>

        <h1 className="rtt-title">
          Live
          <br />
          Battle
        </h1>

        {liveMatch ? (
          <div className="mt-8 rounded-[2rem] border border-rtt-red/35 bg-rtt-red/10 p-6">
            <p className="rtt-kicker">{liveMatch.status || "Match"}</p>

            <h2 className="mt-4 text-4xl font-black uppercase">
              {liveMatch.playerA} vs {liveMatch.playerB}
            </h2>

            <p className="mt-6 text-7xl font-black text-rtt-red">
              {liveMatch.scoreA} — {liveMatch.scoreB}
            </p>

            <p className="mt-4 text-sm font-bold uppercase tracking-[0.14em] text-white/50">
              {liveMatch.type} / {liveMatch.table}
            </p>
          </div>
        ) : (
          <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-8">
            <p className="text-white/50">No live match yet.</p>
          </div>
        )}

        <section className="mt-10">
          <p className="rtt-kicker">Recent Battles</p>

          <div className="mt-5 grid gap-4">
            {matches.slice(0, 6).map((m) => (
              <div
                key={`${m.matchId}-${m.row}`}
                className="rounded-[2rem] border border-white/10 bg-white/5 p-5"
              >
                <p className="text-xl font-black uppercase">
                  {m.playerA} vs {m.playerB}
                </p>

                <p className="mt-2 text-3xl font-black text-rtt-red">
                  {m.score}
                </p>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}