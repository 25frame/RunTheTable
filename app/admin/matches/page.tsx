"use client";

import { AdminShell } from "@/components/admin/AdminShell";
import { ScoreButton } from "@/components/admin/ScoreButton";
import { adminAction } from "@/lib/adminApi";
import { getAdminKey, isAdmin } from "@/lib/adminAuth";
import { getRTTData, RTTMatch } from "@/lib/googleData";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

function hasWinner(a: number, b: number) {
  return (a >= 11 || b >= 11) && Math.abs(a - b) >= 2;
}

export default function AdminMatchesPage() {
  const router = useRouter();
  const [matches, setMatches] = useState<RTTMatch[]>([]);
  const [selectedRow, setSelectedRow] = useState<number>(2);
  const [playerA, setPlayerA] = useState("Player A");
  const [playerB, setPlayerB] = useState("Player B");
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAdmin()) router.push("/admin/login");
    getRTTData().then((data) => {
      setMatches(data.matches);
      const first = data.matches.find((m) => !m.verified) || data.matches[0];
      if (first) selectMatch(first);
    });
  }, [router]);

  function selectMatch(match: RTTMatch) {
    setSelectedRow(match.row);
    setPlayerA(match.playerA || "Player A");
    setPlayerB(match.playerB || "Player B");
    setScoreA(match.scoreA || 0);
    setScoreB(match.scoreB || 0);
  }

  const winner = useMemo(() => hasWinner(scoreA, scoreB) ? (scoreA > scoreB ? playerA : playerB) : "", [scoreA, scoreB, playerA, playerB]);

  async function saveFinal() {
    setSaving(true);
    try {
      await adminAction("saveLiveMatch", getAdminKey(), { row: selectedRow, scoreA, scoreB });
      alert("Final saved. Standings updated.");
      setMatches((await getRTTData()).matches);
    } catch (err) { alert(String(err)); }
    finally { setSaving(false); }
  }

  return (
    <AdminShell>
      <p className="text-xs font-black uppercase tracking-[0.3em] text-rtt-red">Mobile Scorekeeper</p>
      <h1 className="mt-3 text-5xl font-black italic uppercase">Live Scoring</h1>
      <section className="mt-6 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-5">
          <h2 className="text-2xl font-black uppercase">Select Match</h2>
          <p className="mt-2 text-sm text-white/50">Pick the match you want to score.</p>
          <div className="mt-5 grid gap-3">
            {matches.map((m) => (
              <button key={`${m.matchId}-${m.row}`} onClick={() => selectMatch(m)} className={`rounded-2xl border p-4 text-left ${selectedRow === m.row ? "border-rtt-red bg-rtt-red/20" : "border-white/10 bg-black/40"}`}>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-white/40">Row {m.row} · {m.status || "Scheduled"}</p>
                <p className="mt-1 font-black uppercase">{m.playerA} vs {m.playerB}</p>
                <p className="mt-1 text-sm text-white/50">{m.score}</p>
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-hidden rounded-[2.5rem] border border-rtt-red/40 bg-rtt-red/10 p-5">
          <div className="grid grid-cols-2 gap-3">
            <input className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-center text-xl font-black uppercase" value={playerA} onChange={(e) => setPlayerA(e.target.value)} />
            <input className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-center text-xl font-black uppercase" value={playerB} onChange={(e) => setPlayerB(e.target.value)} />
          </div>
          <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <div className="rounded-[2rem] bg-black p-5 text-center"><p className="text-8xl font-black">{scoreA}</p></div>
            <div className="text-4xl font-black text-white/30">-</div>
            <div className="rounded-[2rem] bg-black p-5 text-center"><p className="text-8xl font-black">{scoreB}</p></div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <ScoreButton onClick={() => setScoreA(scoreA + 1)}>+1 {playerA}</ScoreButton>
            <ScoreButton onClick={() => setScoreB(scoreB + 1)}>+1 {playerB}</ScoreButton>
            <ScoreButton tone="muted" onClick={() => setScoreA(Math.max(0, scoreA - 1))}>-1 {playerA}</ScoreButton>
            <ScoreButton tone="muted" onClick={() => setScoreB(Math.max(0, scoreB - 1))}>-1 {playerB}</ScoreButton>
          </div>
          <div className="mt-6 rounded-[2rem] bg-black/60 p-5 text-center">
            {winner ? <p className="text-4xl font-black uppercase text-rtt-red">{winner} Wins</p> : <p className="text-sm font-black uppercase tracking-[0.25em] text-white/45">Game to 11 · Win by 2</p>}
            <button disabled={!winner || saving} onClick={saveFinal} className="mt-5 w-full rounded-2xl bg-rtt-red px-6 py-5 text-xl font-black uppercase tracking-[0.15em] disabled:cursor-not-allowed disabled:opacity-40">{saving ? "Saving..." : "Save Final Result"}</button>
          </div>
        </div>
      </section>
    </AdminShell>
  );
}
