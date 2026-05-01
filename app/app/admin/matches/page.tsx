"use client";
import { AdminShell } from "@/components/admin/AdminShell";
import { ScoreButton } from "@/components/admin/ScoreButton";
import { adminAction } from "@/lib/adminApi";
import { getAdminKey, isAdmin } from "@/lib/adminAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type MatchDraft = { matchRow: number; playerA: string; playerB: string; scoreA: number; scoreB: number; };

function hasWinner(a: number, b: number) {
  return (a >= 11 || b >= 11) && Math.abs(a - b) >= 2;
}

export default function AdminMatchesPage() {
  const router = useRouter();
  const [match, setMatch] = useState<MatchDraft>({ matchRow: 2, playerA: "Player A", playerB: "Player B", scoreA: 0, scoreB: 0 });
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (!isAdmin()) router.push("/admin/login"); }, [router]);

  const winner = hasWinner(match.scoreA, match.scoreB) ? (match.scoreA > match.scoreB ? match.playerA : match.playerB) : "";

  async function saveFinal() {
    setSaving(true);
    try {
      await adminAction("saveLiveMatch", getAdminKey(), { row: match.matchRow, scoreA: match.scoreA, scoreB: match.scoreB });
      alert("Final saved. Standings updated.");
    } catch (err) {
      alert(String(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminShell>
      <p className="text-xs font-black uppercase tracking-[0.3em] text-rtt-red">Mobile Scorekeeper</p>
      <h1 className="mt-3 text-5xl font-black italic uppercase">Live Scoring</h1>

      <div className="mt-6 rounded-[2rem] border border-white/10 bg-white/[0.055] p-5">
        <label className="text-xs font-black uppercase tracking-[0.2em] text-white/40">Match Sheet Row</label>
        <input className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white" type="number" value={match.matchRow} onChange={(e) => setMatch({ ...match, matchRow: Number(e.target.value) })} />
        <p className="mt-2 text-sm text-white/45">Use the row number from the Matches tab. Example: first match is usually row 2.</p>
      </div>

      <section className="mt-6 overflow-hidden rounded-[2.5rem] border border-rtt-red/40 bg-rtt-red/10 p-5">
        <div className="grid grid-cols-2 gap-3">
          <input className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-center text-xl font-black uppercase" value={match.playerA} onChange={(e) => setMatch({ ...match, playerA: e.target.value })} />
          <input className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-center text-xl font-black uppercase" value={match.playerB} onChange={(e) => setMatch({ ...match, playerB: e.target.value })} />
        </div>
        <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="rounded-[2rem] bg-black p-5 text-center"><p className="text-8xl font-black">{match.scoreA}</p></div>
          <div className="text-4xl font-black text-white/30">-</div>
          <div className="rounded-[2rem] bg-black p-5 text-center"><p className="text-8xl font-black">{match.scoreB}</p></div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <ScoreButton onClick={() => setMatch({ ...match, scoreA: match.scoreA + 1 })}>+1 {match.playerA}</ScoreButton>
          <ScoreButton onClick={() => setMatch({ ...match, scoreB: match.scoreB + 1 })}>+1 {match.playerB}</ScoreButton>
          <ScoreButton tone="muted" onClick={() => setMatch({ ...match, scoreA: Math.max(0, match.scoreA - 1) })}>-1 {match.playerA}</ScoreButton>
          <ScoreButton tone="muted" onClick={() => setMatch({ ...match, scoreB: Math.max(0, match.scoreB - 1) })}>-1 {match.playerB}</ScoreButton>
        </div>
        <div className="mt-6 rounded-[2rem] bg-black/60 p-5 text-center">
          {winner ? <p className="text-4xl font-black uppercase text-rtt-red">{winner} Wins</p> : <p className="text-sm font-black uppercase tracking-[0.25em] text-white/45">Game to 11 · Win by 2</p>}
          <button disabled={!winner || saving} onClick={saveFinal} className="mt-5 w-full rounded-2xl bg-rtt-red px-6 py-5 text-xl font-black uppercase tracking-[0.15em] disabled:cursor-not-allowed disabled:opacity-40">{saving ? "Saving..." : "Save Final Result"}</button>
        </div>
      </section>
    </AdminShell>
  );
}
