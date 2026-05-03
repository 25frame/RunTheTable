import { getRTTData } from "@/lib/googleData";
import { ViralCTA } from "@/components/ViralCTA";

export default async function JoinPage() {
  const { formUrl, players } = await getRTTData();

  return (
    <main className="rtt-shell text-white">
      <section className="rtt-max">
        <p className="rtt-kicker">New Blood</p>
        <h1 className="rtt-title">GET<br />ON<br />THE<br />BOARD</h1>
        <p className="rtt-subtitle">Sign up. Show up. Play tracked battles. Your rank starts when your first game ends.</p>
        <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.055] p-5">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-rtt-red">How it works</p>
          <div className="mt-4 grid gap-3">
            <Step number="01" title="Sign up" text="Drop your name and handle." />
            <Step number="02" title="Show up" text="Find the table. Check the board." />
            <Step number="03" title="Battle" text="First to 11. Win by 2." />
            <Step number="04" title="Climb" text="Wins, heat, and streaks move your name." />
          </div>
        </div>
        <ViralCTA formUrl={formUrl} />
        <div className="mt-8 rounded-[2rem] border border-rtt-red/25 bg-rtt-red/10 p-5">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-rtt-red">Current Board</p>
          <p className="mt-3 text-4xl font-black italic uppercase tracking-[-0.06em]">{players.length} Competitors</p>
          <p className="mt-2 text-sm font-bold uppercase tracking-[0.12em] text-white/45">Everybody starts unranked.</p>
        </div>
      </section>
    </main>
  );
}

function Step({ number, title, text }: { number: string; title: string; text: string }) {
  return (
    <div className="rounded-2xl bg-black/45 p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rtt-red">{number}</p>
      <h2 className="mt-1 text-xl font-black uppercase">{title}</h2>
      <p className="mt-1 text-sm font-semibold text-white/55">{text}</p>
    </div>
  );
}
