import { getRTTData } from "@/lib/googleData";

export const dynamic = "force-dynamic";

export default async function ResultsPage() {
  const data = await getRTTData();
  const matches = data?.matches || [];

  return (
    <main className="rtt-shell text-white">
      <section className="rtt-max">
        <p className="rtt-kicker">Battle History</p>

        <h1 className="rtt-title">RESULTS</h1>

        <p className="rtt-subtitle">Receipts stay on the board.</p>

        <div className="mt-8 grid gap-3">
          {matches.length ? (
            matches.map((m) => (
              <div key={`${m.matchId}-${m.row}`} className="rtt-card p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-xl font-black uppercase">
                      {m.playerA} vs {m.playerB}
                    </p>

                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-white/35">
                      {m.type || "Battle"} / {m.status || "Scheduled"}
                    </p>
                  </div>

                  <div className="shrink-0 text-3xl font-black text-rtt-red">
                    {m.score}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-white/50">
              <p>No results loaded yet.</p>

              {data?.error ? (
                <p className="mt-2 text-xs text-red-300">
                  Feed error: {data.error}
                </p>
              ) : null}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}