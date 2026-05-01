import Link from "next/link";
import { Card } from "@/components/Card";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import { getRTTData } from "@/lib/googleData";

export default async function HomePage() {
  const { players, weeklyResults, formUrl } = await getRTTData();
  const latest = weeklyResults[0];
  const top = players.slice(0, 4);
  const joinHref = formUrl || "/play";

  return (
    <main className="rtt-grid min-h-screen overflow-hidden text-white">
      <section className="mx-auto max-w-7xl px-5 py-12 md:py-20">
        <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-black/55 p-7 shadow-2xl shadow-red-950/30 md:p-10">
            <div className="absolute -right-20 top-12 h-40 w-[520px] -rotate-12 rounded-full bg-rtt-red opacity-30 blur-2xl" />

            <div className="relative">
              <p className="text-xs font-black uppercase tracking-[0.38em] text-rtt-red">
                RTT NYC
              </p>

              <h1 className="mt-5 max-w-4xl text-7xl font-black italic uppercase leading-[0.85] tracking-[-0.06em] md:text-9xl">
                Run
                <br />
                The Table
              </h1>

              <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-white/65">
                Weekly competitive table tennis. Rankings, matches, profiles,
                and payouts.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={joinHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl bg-rtt-red px-6 py-4 text-sm font-black uppercase tracking-[0.2em] shadow-lg shadow-red-950/40 transition hover:scale-[1.02]"
                >
                  Join This Week
                </a>

                <Link
                  href="/standings"
                  className="rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-sm font-black uppercase tracking-[0.2em] text-white/80 transition hover:border-white/30 hover:bg-white/10"
                >
                  View Standings
                </Link>
              </div>
            </div>
          </div>

          <Card className="flex flex-col justify-between border-rtt-red/40 bg-rtt-red/10">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-rtt-red">
                Latest Winner
              </p>

              <h2 className="mt-4 text-5xl font-black uppercase leading-none">
                {latest?.winner || "TBD"}
              </h2>

              <p className="mt-3 text-white/55">Latest completed week</p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3">
              {[
                ["Players", latest?.players || 0],
                ["Collected", `$${latest?.collected || 0}`],
                ["Prize Pool", `$${latest?.prizePool || 0}`],
                ["1st Place", `$${latest?.first || 0}`],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-3xl border border-white/10 bg-black/30 p-4"
                >
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">
                    {label}
                  </p>
                  <p className="mt-2 text-3xl font-black">{value}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="mt-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-rtt-red">
              Live League Board
            </p>
            <h2 className="mt-2 text-4xl font-black italic uppercase">
              Top Players
            </h2>
          </div>

          <Link
            href="/players"
            className="text-sm font-black uppercase tracking-[0.2em] text-white/55 hover:text-white"
          >
            All Players →
          </Link>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-4">
          {top.map((p) => (
            <Link key={p.id} href={`/players/${p.id}`}>
              <Card className="group overflow-hidden p-0 transition hover:-translate-y-1 hover:border-rtt-red/70">
                <div className="relative h-52 bg-black">
                  <PlayerAvatar player={p} />

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                  <div className="absolute left-4 top-4 rounded-full bg-rtt-red px-3 py-1 text-xs font-black uppercase">
                    #{p.rank}
                  </div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-black uppercase leading-none">
                      {p.name}
                    </h3>
                    <p className="mt-1 text-sm text-white/65">
                      {p.wins}-{p.losses} · {p.points} pts ·{" "}
                      {p.streak || "Active"}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}