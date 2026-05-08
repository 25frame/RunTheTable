import Link from "next/link";
import { TopPlayerBanner } from "@/components/TopPlayerBanner";
import { PlayerIdentityCard } from "@/components/PlayerIdentityCard";
import { ViralCTA } from "@/components/ViralCTA";
import type { RTTPlayer, RTTMatch } from "@/lib/googleData";

const RTT_API_URL =
  "https://script.google.com/macros/s/AKfycbzPEtTPBALXh_2eb1PaUeXI8DNeT74YW4g05ldRzH049LPAXKAa60oUrz1-pD7hkgZ3/exec";

const RTT_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScGDbgA5YOItre1EjvQIxlvi3pIByBDq10HFW24MAjOw7tZZA/viewform";

type RawRTTPlayer = Partial<RTTPlayer> & {
  playerId?: string;
  displayName?: string;
  fullName?: string;
  playerName?: string;
  skillLevel?: string;
  instagram?: string;
  handle?: string;
};

type RawRTTMatch = Partial<RTTMatch>;

type RTTApiResponse = {
  ok?: boolean;
  success?: boolean;
  players?: RawRTTPlayer[];
  matches?: RawRTTMatch[];
  formUrl?: string;
  data?: {
    players?: RawRTTPlayer[];
    matches?: RawRTTMatch[];
    formUrl?: string;
  };
  livePlayers?: RawRTTPlayer[];
  error?: string;
  debug?: unknown;
};

async function getRTTDataDirect(): Promise<{
  players: RTTPlayer[];
  matches: RTTMatch[];
  formUrl: string;
  error: string;
  debug: unknown;
}> {
  try {
    const response = await fetch(`${RTT_API_URL}?ts=${Date.now()}`, {
      cache: "no-store",
      next: { revalidate: 0 },
    });

    const text = await response.text();

    let data: RTTApiResponse;

    try {
      data = JSON.parse(text) as RTTApiResponse;
    } catch {
      console.error("RTT API did not return JSON:", text);

      return {
        players: [],
        matches: [],
        formUrl: RTT_FORM_URL,
        error: "RTT API did not return JSON.",
        debug: text,
      };
    }

    if (data.ok === false || data.success === false) {
      console.error("RTT API error:", data.error, data);

      return {
        players: [],
        matches: [],
        formUrl: data.formUrl || data.data?.formUrl || RTT_FORM_URL,
        error: data.error || "RTT API returned an error.",
        debug: data,
      };
    }

    const rawPlayers =
      data.players ||
      data.data?.players ||
      data.livePlayers ||
      [];

    const rawMatches =
      data.matches ||
      data.data?.matches ||
      [];

    return {
      players: normalizePlayers(rawPlayers),
      matches: normalizeMatches(rawMatches),
      formUrl: data.formUrl || data.data?.formUrl || RTT_FORM_URL,
      error: "",
      debug: data.debug || data,
    };
  } catch (error) {
    console.error("RTT fetch failed:", error);

    return {
      players: [],
      matches: [],
      formUrl: RTT_FORM_URL,
      error: error instanceof Error ? error.message : "Unknown RTT fetch error.",
      debug: error instanceof Error ? error.message : error,
    };
  }
}

function normalizePlayers(players: RawRTTPlayer[]): RTTPlayer[] {
  return players
    .map((player, index) => {
      const id =
        player.id ||
        player.playerId ||
        `player-${index + 1}`;

      const name =
        player.name ||
        player.displayName ||
        player.fullName ||
        player.playerName ||
        "Unnamed Player";

      const normalized = {
        ...player,
        id,
        rank: Number(player.rank || index + 1),
        name,
        skill: player.skill || player.skillLevel || "Unranked",
        wins: Number(player.wins || 0),
        losses: Number(player.losses || 0),
        points: Number(player.points || 0),
        pointDiff: Number(player.pointDiff || player.gameDiff || 0),
        gameDiff: Number(player.gameDiff || player.pointDiff || 0),
        handle: player.handle || player.instagram || "",
        photo: player.photo || "",
      } as RTTPlayer;

      return normalized;
    })
    .filter((player) => Boolean(player.id && player.name));
}

function normalizeMatches(matches: RawRTTMatch[]): RTTMatch[] {
  return matches.map((match) => {
    const normalized = {
      ...match,
      status: match.status || (match.verified ? "Final" : "Scheduled"),
      score:
        match.score ||
        `${Number(match.scoreA || 0)}-${Number(match.scoreB || 0)}`,
    } as RTTMatch;

    return normalized;
  });
}

export default async function HomePage() {
  const { players, matches, formUrl, error, debug } = await getRTTDataDirect();

  const top = players.slice(0, 5);
  const topPlayer = players[0];

  return (
    <main className="rtt-shell text-white">
      <section className="rtt-max">
        <p className="rtt-kicker">NYC Underground Table Tennis</p>

        <h1 className="rtt-title">
          RUN
          <br />
          THE
          <br />
          TABLE
        </h1>

        <p className="rtt-subtitle">
          Show up. Battle. Climb the board. No soft games.
        </p>

        <ViralCTA formUrl={formUrl} />

        {error ? (
          <div className="mt-6 rounded-xl border border-red-500/40 bg-red-950/30 p-4 text-sm text-red-200">
            <p className="font-black uppercase tracking-[0.16em]">
              Player feed error
            </p>
            <p className="mt-2">{error}</p>
          </div>
        ) : null}

        <div className="mt-8">
          {topPlayer ? (
            <TopPlayerBanner player={topPlayer} />
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-rtt-red">
                No players loaded yet
              </p>

              <p className="mt-2 text-sm text-white/70">
                Backend connected, but no player records were returned to the
                homepage.
              </p>

              <details className="mt-4">
                <summary className="cursor-pointer text-xs font-black uppercase tracking-[0.2em] text-white/50">
                  Debug feed
                </summary>

                <pre className="mt-3 max-h-96 overflow-auto rounded-xl bg-black/40 p-3 text-xs text-white/60">
                  {JSON.stringify(debug, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </div>

        <section className="mt-10">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="rtt-kicker">The Board</p>

              <h2 className="mt-1 text-3xl font-black italic uppercase tracking-[-0.05em]">
                Top Competitors
              </h2>
            </div>

            <Link
              href="/standings"
              className="text-xs font-black uppercase tracking-[0.2em] text-rtt-red"
            >
              Full Board
            </Link>
          </div>

          <div className="grid gap-3">
            {top.length ? (
              top.map((player) => {
                const liveMatch = matches.find((match) => {
                  const isLive =
                    (match.status || "").toLowerCase() === "live";

                  const isPlayerInMatch =
                    match.playerAId === player.id ||
                    match.playerBId === player.id;

                  return isLive && isPlayerInMatch;
                });

                return (
                  <PlayerIdentityCard
                    key={player.id}
                    player={player}
                    liveMatch={liveMatch}
                  />
                );
              })
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/70">
                No players loaded yet.
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}