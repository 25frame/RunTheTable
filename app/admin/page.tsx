import Link from "next/link";
import { Card } from "@/components/Card";

export default function AdminPage() {
  const tools = [["/admin/check-in", "Check-In", "Mark players present, paid, no-show, or waitlisted."], ["/admin/matches", "Match Entry", "Enter scores, winners, match type, and verification status."], ["/admin/payouts", "Payouts", "Calculate collected cash, operations cut, prize pool, and winners."]];
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-5 py-10 text-white">
      <div className="rounded-[2.5rem] border border-white/10 bg-black/60 p-8"><p className="text-xs font-black uppercase tracking-[0.35em] text-rtt-red">Organizer Control Center</p><h1 className="mt-4 text-6xl font-black italic uppercase leading-none">Admin</h1><p className="mt-4 max-w-2xl text-white/60">Admin operations currently run in Google Sheets. These pages explain the operating flow and can become live admin tools later.</p></div>
      <div className="mt-8 grid gap-5 md:grid-cols-3">{tools.map(([href, title, desc]) => <Link key={href} href={href}><Card className="h-full transition hover:-translate-y-1 hover:border-rtt-red/70"><p className="text-xs font-black uppercase tracking-[0.24em] text-rtt-red">Admin Tool</p><h2 className="mt-3 text-3xl font-black italic uppercase">{title}</h2><p className="mt-3 text-white/60">{desc}</p></Card></Link>)}</div>
      <Card className="mt-8 border-yellow-500/30 bg-yellow-500/5"><h2 className="text-2xl font-black uppercase">Current Admin Backend</h2><p className="mt-3 text-white/65">Use the RTT Google Ops Sheet for player intake, registrations, matches, standings, and payouts.</p></Card>
    </main>
  );
}
