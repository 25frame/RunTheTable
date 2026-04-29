import Link from "next/link";
import { Card } from "@/components/Card";

export default function AdminPage() {
  const links = [
    ["/admin/check-in", "Check-In", "Mark players checked in and paid."],
    ["/admin/matches", "Matches", "Enter scores and verify winners."],
    ["/admin/payouts", "Payouts", "Calculate prize pool and payouts."],
  ];
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-10 text-white">
      <p className="text-xs font-black uppercase tracking-[0.3em] text-rtt-red">Organizer Only</p>
      <h1 className="mt-3 text-5xl font-black uppercase">Admin</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {links.map(([href, title, desc]) => (
          <Link key={href} href={href}><Card className="h-full transition hover:border-rtt-red"><h2 className="text-2xl font-black uppercase">{title}</h2><p className="mt-3 text-white/60">{desc}</p></Card></Link>
        ))}
      </div>
    </main>
  );
}
