import { players } from "@/lib/mockData";
import { Card } from "@/components/Card";

export default function CheckInPage() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-10 text-white">
      <p className="text-xs font-black uppercase tracking-[0.3em] text-rtt-red">Admin</p>
      <h1 className="mt-3 text-5xl font-black uppercase">Check-In</h1>
      <Card className="mt-8">
        <div className="grid grid-cols-5 bg-white/5 px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white/50">
          <span>Player</span><span>Skill</span><span>Checked In</span><span>Paid</span><span>Amount</span>
        </div>
        {players.map((p) => (
          <div key={p.id} className="grid grid-cols-5 border-t border-white/10 px-4 py-4">
            <span className="font-black uppercase">{p.name}</span><span>{p.skill}</span><span>□</span><span>□</span><span>$15</span>
          </div>
        ))}
      </Card>
      <p className="mt-4 text-sm text-white/45">This page is a visual starter. Wire these controls to Supabase updates in the next build step.</p>
    </main>
  );
}
