"use client";

import { AdminShell } from "@/components/admin/AdminShell";
import { ScoreButton } from "@/components/admin/ScoreButton";
import { authedPost, getCurrentUser } from "@/lib/auth";
import { getRTTData, RTTMatch } from "@/lib/googleData";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function hasWinner(scoreA: number, scoreB: number) {
  return (scoreA >= 11 || scoreB >= 11) && Math.abs(scoreA - scoreB) >= 2;
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
  const [loading, setLoading] = useState(true);

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

    try {
      const data = await getRTTData();
      const nextMatches = data.matches || [];

      setMatches(nextMatches);

      const firstOpen =
        nextMatches.find((m) => !m.verified) || nextMatches[0];

      if (firstOpen) {
        selectMatch(firstOpen);
      }
    } catch (err) {
      alert(String(err));
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
  }

  async function publishLive(nextA: number, nextB: number) {
    if (!selectedRow) return;

    await authedPost("updateLiveScore", {
      row: selectedRow,
      scoreA: nextA,
      scoreB: nextB,
    });
  }

  async function changeScore(side: "A" | "B", amount: 1 | -1) {
    const nextA = side === "A" ? Math.max(0, scoreA + amount) : scoreA;
    const nextB = side === "B" ? Math.max(0, scoreB + amount) : scoreB;

    setScoreA(nextA);
    setScoreB(nextB);

    try {
      await publishLive(nextA, nextB);
    } catch {
      // Do not block scoring UI if live publish fails.
    }
  }

  async function saveFinal() {
    if (!selectedRow) {
      alert("No match selected.");
      return;
    }

    setSaving(true);

    try {
      await authedPost("saveLiveMatch", {
        row: selectedRow,
        scoreA,
        scoreB,
      });

      alert("Final saved.");
      await loadMatches();
    } catch (err) {
      alert(String(err));
    } finally {
      setSaving(false);
    }
  }

  const winner = hasWinner(scoreA, scoreB)
    ? scoreA > scoreB
      ? playerA
      : playerB
    : "";

  return (
    <AdminShell>
      <p className="rtt-kicker">Mobile Scorekeeper</p>

      <h1 className="mt-3 text-5xl font-black italic uppercase">
        Live Scoring
      </h1>

      <section className="mt-6 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-5">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-black uppercase">Select Battle</h2>

            <button
              onClick={loadMatches}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-[0.16em]"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="mt-5 rounded-2xl border border-white/10 bg-black/40 p-6 text-center text-white/50">
              Loading matches...
            </div>
          ) : (
            <div className="mt-5 grid gap-3">
              {matches.map((m) => (
                <button
                  key={`${m.matchId}-${m.row || 0}`}
                  onClick={() => selectMatch(m)}
                  className={
                    selectedRow === (m.row || 0)
                      ? "rounded-2xl border border-rtt-red bg-rtt-red/20 p-4 text-left"
                      : "rounded-2xl border border-white/10 bg-black/40 p-4 text-left"
                  }
                >
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-white/40">
                    Row {m.row || "—"} / {m.status || "Scheduled"}
                  </p>

                  <p className="mt-1 font-black uppercase">
                    {m.playerA} vs {m.playerB}
                  </p>

                  <p className="mt-1 text-sm text-white/50">
                    {m.score || `${m.scoreA || 0}-${m.scoreB || 0}`}
                  </p>
                </button>
              ))}

              {!matches.length && (
                <div className="rounded-2xl border border-white/10 bg-black/40 p-6 text-center text-white/50">
                  No matches found.
                </div>
              )}
            </div>
          )}
        </div>

        <div className="overflow-hidden rounded-[2.5rem] border border-rtt-red/40 bg-rtt-red/10 p-5">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <div className="rounded-[2rem] bg-black p-5 text-center">
              <p className="text-8xl font-black">{scoreA}</p>
              <p className="mt-2 font-black uppercase">{playerA}</p>
            </div>

            <div className="text-4xl font-black text-white/30">—</div>

            <div className="rounded-[2rem] bg-black p-5 text-center">
              <p className="text-8xl font-black">{scoreB}</p>
              <p className="mt-2 font-black uppercase">{playerB}</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <ScoreButton onClick={() => changeScore("A", 1)}>
              +1 {playerA}
            </ScoreButton>

            <ScoreButton onClick={() => changeScore("B", 1)}>
              +1 {playerB}
            </ScoreButton>

            <ScoreButton tone="muted" onClick={() => changeScore("A", -1)}>
              -1 {playerA}
            </ScoreButton>

            <ScoreButton tone="muted" onClick={() => changeScore("B", -1)}>
              -1 {playerB}
            </ScoreButton>
          </div>

          <div className="mt-6 rounded-[2rem] bg-black/60 p-5 text-center">
            {winner ? (
              <p className="text-4xl font-black uppercase text-rtt-red">
                {winner} Wins
              </p>
            ) : (
              <p className="text-sm font-black uppercase tracking-[0.25em] text-white/45">
                Game to 11 / Win by 2
              </p>
            )}

            <button
              disabled={!winner || saving || !selectedRow}
              onClick={saveFinal}
              className="mt-5 w-full rounded-2xl bg-rtt-red px-6 py-5 text-xl font-black uppercase tracking-[0.15em] disabled:opacity-40"
            >
              {saving ? "Saving..." : "Save Final Result"}
            </button>
          </div>
        </div>
      </section>
    </AdminShell>
  );
}