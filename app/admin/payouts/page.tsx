import { Card } from "@/components/Card";

export default function PayoutsAdminPage() {
  const paidPlayers = 20;
  const entry = 15;
  const ops = 3;
  const collected = paidPlayers * entry;
  const prizePool = paidPlayers * (entry - ops);
  const organizerCut = paidPlayers * ops;
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-10 text-white">
      <p className="text-xs font-black uppercase tracking-[0.3em] text-rtt-red">Admin</p>
      <h1 className="mt-3 text-5xl font-black uppercase">Payouts</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {[["Players", paidPlayers], ["Collected", `$${collected}`], ["Prize Pool", `$${prizePool}`], ["Ops Cut", `$${organizerCut}`]].map(([label, value]) => (
          <Card key={label}><p className="text-white/50">{label}</p><p className="mt-2 text-3xl font-black">{value}</p></Card>
        ))}
      </div>
      <Card className="mt-6">
        <h2 className="text-2xl font-black uppercase">Suggested Split</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl bg-white/5 p-4"><p>1st</p><b className="text-3xl text-rtt-red">${Math.round(prizePool * .5)}</b></div>
          <div className="rounded-2xl bg-white/5 p-4"><p>2nd</p><b className="text-3xl">${Math.round(prizePool * .3)}</b></div>
          <div className="rounded-2xl bg-white/5 p-4"><p>3rd</p><b className="text-3xl">${Math.round(prizePool * .2)}</b></div>
        </div>
      </Card>
    </main>
  );
}
