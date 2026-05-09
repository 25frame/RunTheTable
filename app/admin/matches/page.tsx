"use client";

import { AdminShell } from "@/components/admin/AdminShell";
import { ScoreButton } from "@/components/admin/ScoreButton";
import { authedPost, getCurrentUser } from "@/lib/auth";
import type { RTTData, RTTMatch } from "@/lib/googleData";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

function hasWinner(scoreA: number, scoreB: number) {
  return (scoreA >= 11 || scoreB >= 11) && Math.abs(scoreA - scoreB) >= 2;
}

async function fetchRTTData(): Promise<RTTData> {
  const response = await fetch("/api/rtt", {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to load RTT data: HTTP ${response.status}`);
  }

  return (await response.json()) as RTTData;
}

export default function AdminMatchesPage() {
  const router = useRouter();

  const [matches, setMatches] = useState<RTTMatch[]>([]);
  const [selectedRow, setSelectedRow] = useState<number>(0);

  const [playerA, setPlayerA] = useState("Player A");
  const [playerB, setPlayerB] = useState("Player B");

  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);

  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const selectedMatch = useMemo(
    () => matches.find((match) => (match.row || 0) === selectedRow),
    [matches, selectedRow]
  );

  const winner = hasWinner(scoreA, scoreB)
    ? scoreA > scoreB
      ? playerA
      : playerB
    : "";

  useEffect(() => {
    const user = getCurrentUser();

    if (!user || user.role !== "admin") {
      router.push("/login");
      return;
    }

    loadMatches();
  }, [router]);

  async function loadMatches() {
    setLoading(true);
    setError("");

    try {
      const data = await fetchRTTData();
      const nextMatches = data.matches || [];

      setMatches(nextMatches);

      const firstOpen =
        nextMatches.find((match) => !match.verified) || nextMatches[0];

      if (firstOpen) {
        selectMatch(firstOpen);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load matches.");
      setMatches([]);
    } finally {
      setLoading(false);
    }
  }

  function selectMatch(match: RTTMatch) {
    setSelectedRow(match.row || 0);
    setPlayerA(match.playerA || "Player A");
    setPlayerB(match.playerB || "Player B");
    setScoreA(Number(match.scoreA) || 0);
    setScoreB(Number(match.scoreB) || 0);
    setError("");
  }

  async function publishLive(nextA: number, nextB: number) {
    if (!selectedRow) return;

    setPublishing(true);

    try {
      await authedPost("updateLiveScore", {
        row: selectedRow,
        scoreA: nextA,
        scoreB: nextB,
      });
    } finally {
      setPublishing(false);
    }
  }

  async function changeScore(side: "A" | "B", amount: 1 | -1) {
    if (!selectedRow) {
      setError("Select a battle before scoring.");
      return;
    }

    const nextA = side === "A" ? Math.max(0, scoreA + amount) : scoreA;
    const nextB = side === "B" ? Math.max(0, scoreB + amount) : scoreB;

    setScoreA(nextA);
    setScoreB(nextB);

    try {
      await publishLive(nextA, nextB);
    } catch {
      setError("Live score did not publish. The local score is still shown.");
    }
  }

  async function saveFinal() {
    if (!selectedRow) {
      setError("No match selected.");
      return;
    }

    if (!winner) {
      setError("Final result requires a game winner: first to 11, win by 2.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await authedPost("saveLiveMatch", {
        row: selectedRow,
        scoreA,
        scoreB,
      });

      await loadMatches();
      alert("Final saved.");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to save final result.";

      setError(message);
      alert(message);
    } finally {
      setSaving(false);
    }
  }

  function resetScore() {
    if (selectedMatch) {
      selectMatch(selectedMatch);
      return;
    }

    setScoreA(0);
    setScoreB(0);
  }

  return (
    <AdminShell>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="rtt-mini-kicker">Mobile Scorekeeper</p>

          <h1 className="mt-2 text-4xl font-black italic uppercase tracking-[-0.06em] md:text-6xl">
            Scoring
          </h1>
        </div>

        <button
          type="button"
          onClick={loadMatches}
          disabled={loading}
          className="shrink-0 rounded-full border border-white/10 bg-white/[0.055] px-4 py-3 text-[10px] font-black uppercase tracking-[0.16em] text-white/70 disabled:opacity-50 md:px-5 md:text-xs"
        >
          {loading ? "Loading" : "Refresh"}
        </button>
      </div>

      {error ? (
        <div className="mt-5 rounded-[1.5rem] border border-red-500/30 bg-red-950/30 p-4 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <section className="mt-5 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        {/* MATCH SELECTOR */}
        <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-4 md:rounded-[2rem] md:p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="rtt-mini-kicker">Select</p>
              <h2 className="mt-1 text-2xl font-black uppercase tracking-[-0.04em]">
                Battle
              </h2>
            </div>

            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/35">
              {matches.length} matches
            </p>
          </div>

          <div className="mt-4 grid max-h-[420px] gap-2 overflow-y-auto pr-1">
            {loading ? (
              <div className="rounded-2xl border border-white/10 bg-black/40 p-5 text-center text-sm text-white/50">
                Loading matches...
              </div>
            ) : matches.length ? (
              matches.map((match) => {
                const active = selectedRow === (match.row || 0);
                const final = match.verified;

                return (
                  <button
                    key={`${match.matchId}-${match.row || 0}`}
                    type="button"
                    onClick={() => selectMatch(match)}
                    className={
                      active
                        ? "rounded-2xl border border-rtt-red bg-rtt-red/20 p-4 text-left"
                        : "rounded-2xl border border-white/10 bg-black/40 p-4 text-left"
                    }
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/40">
                        Row {match.row || "—"} /{" "}
                        {match.status || (final ? "Final" : "Scheduled")}
                      </p>

                      {final ? (
                        <span className="rounded-full bg-white/10 px-2 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-white/45">
                          Final
                        </span>
                      ) : null}
                    </div>

                    <p className="mt-2 truncate text-base font-black uppercase tracking-[-0.03em]">
                      {match.playerA} vs {match.playerB}
                    </p>

                    <p className="mt-1 text-sm font-black text-rtt-red">
                      {match.score || `${match.scoreA || 0}-${match.scoreB || 0}`}
                    </p>
                  </button>
                );
              })
            ) : (
              <div className="rounded-2xl border border-white/10 bg-black/40 p-5 text-center text-sm text-white/50">
                No matches found.
              </div>
            )}
          </div>
        </section>

        {/* SCOREKEEPER */}
        <section className="rounded-[1.75rem] border border-rtt-red/35 bg-rtt-red/10 p-4 md:rounded-[2.25rem] md:p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="rtt-mini-kicker">
                {selectedMatch?.status || "Live Score"}
              </p>

              <h2 className="mt-1 truncate text-2xl font-black uppercase tracking-[-0.04em] md:text-3xl">
                {playerA} vs {playerB}
              </h2>
            </div>

            <button
              type="button"
              onClick={resetScore}
              className="shrink-0 rounded-full border border-white/10 bg-black/40 px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.14em] text-white/60"
            >
              Reset
            </button>
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-2 md:gap-3">
            <ScorePanel name={playerA} score={scoreA} hot={scoreA > scoreB} />

            <div className="grid place-items-center px-1 text-3xl font-black text-white/25">
              —
            </div>

            <ScorePanel name={playerB} score={scoreB} hot={scoreB > scoreA} />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 md:gap-3">
            <ScoreButton onClick={() => changeScore("A", 1)}>
              +1 {shortName(playerA)}
            </ScoreButton>

            <ScoreButton onClick={() => changeScore("B", 1)}>
              +1 {shortName(playerB)}
            </ScoreButton>

            <ScoreButton tone="muted" onClick={() => changeScore("A", -1)}>
              -1 {shortName(playerA)}
            </ScoreButton>

            <ScoreButton tone="muted" onClick={() => changeScore("B", -1)}>
              -1 {shortName(playerB)}
            </ScoreButton>
          </div>

          <div className="mt-4 rounded-[1.5rem] bg-black/60 p-4 text-center md:rounded-[2rem] md:p-5">
            {winner ? (
              <p className="text-3xl font-black uppercase tracking-[-0.04em] text-rtt-red md:text-4xl">
                {winner} Wins
              </p>
            ) : (
              <p className="text-xs font-black uppercase tracking-[0.22em] text-white/45">
                Game to 11 / Win by 2
              </p>
            )}

            <div className="mt-3 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-white/35">
              <span>{publishing ? "Publishing..." : "Live score ready"}</span>
            </div>

            <button
              type="button"
              disabled={!winner || saving || !selectedRow}
              onClick={saveFinal}
              className="mt-4 w-full rounded-2xl bg-rtt-red px-5 py-4 text-base font-black uppercase tracking-[0.14em] disabled:opacity-40 md:py-5 md:text-xl"
            >
              {saving ? "Saving..." : "Save Final Result"}
            </button>
          </div>
        </section>
      </section>
    </AdminShell>
  );
}

function ScorePanel({
  name,
  score,
  hot,
}: {
  name: string;
  score: number;
  hot: boolean;
}) {
  return (
    <div
      className={
        hot
          ? "rounded-[1.5rem] border border-rtt-red/50 bg-black p-4 text-center md:rounded-[2rem] md:p-5"
          : "rounded-[1.5rem] border border-white/10 bg-black p-4 text-center md:rounded-[2rem] md:p-5"
      }
    >
      <p className="text-6xl font-black leading-none md:text-8xl">{score}</p>

      <p className="mt-3 truncate text-xs font-black uppercase tracking-[0.12em] text-white/55 md:text-sm">
        {name}
      </p>
    </div>
  );
}

function shortName(name: string) {
  const clean = name.trim();
  if (!clean) return "Player";

  const first = clean.split(/\s+/)[0];
  return first.length > 10 ? first.slice(0, 10) : first;
}