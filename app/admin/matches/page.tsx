import { Card } from "@/components/Card";

export default function MatchesAdminPage() {
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-10 text-white">
      <p className="text-xs font-black uppercase tracking-[0.3em] text-rtt-red">Admin</p>
      <h1 className="mt-3 text-5xl font-black uppercase">Match Entry</h1>
      <Card className="mt-8">
        <div className="grid gap-4">
          {["Player A", "Player B", "Winner", "Score", "Match Type"].map((label) => (
            <label key={label} className="grid gap-2"><span className="text-xs font-bold uppercase tracking-[0.18em] text-white/50">{label}</span><input className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-rtt-red" placeholder={label} /></label>
          ))}
          <button className="rounded-2xl bg-rtt-red px-6 py-3 text-sm font-black uppercase tracking-[0.2em]">Save Match</button>
        </div>
      </Card>
    </main>
  );
}
