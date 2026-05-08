import { getRTTData } from "@/lib/googleData";
import { PageHero } from "@/components/PageHero";

export const dynamic = "force-dynamic";

export default async function ResultsPage() {
  const data = await getRTTData();
  const matches = data?.matches || [];

  return (
    <main className="rtt-page">
      <section className="rtt-page-inner">
        <PageHero
          kicker="Battle History"
          title="Results"
          subtitle="Receipts stay on the board."
        />

        <section className="rtt-section rtt-list">
          {matches.length ? (
            matches.map((m) => (
              <article
                key={`${m.matchId}-${m.row}`}
                className="rtt-mobile-card"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-xl font-black uppercase tracking-[-0.04em]">
                      {m.playerA} vs {m.playerB}
                    </p>

                    <p className="mt-1 rtt-muted-line">
                      {m.type || "Battle"} / {m.status || "Scheduled"}
                    </p>
                  </div>

                  <p className="shrink-0 text-3xl font-black text-rtt-red">
                    {m.score}
                  </p>
                </div>
              </article>
            ))
          ) : (
            <EmptyState title="No results loaded yet." error={data?.error} />
          )}
        </section>
      </section>
    </main>
  );
}

function EmptyState({ title, error }: { title: string; error?: string }) {
  return (
    <div className="rtt-mobile-card">
      <p className="font-black uppercase text-white/60">{title}</p>

      {error ? (
        <p className="mt-2 text-xs text-red-300">Feed error: {error}</p>
      ) : null}
    </div>
  );
}