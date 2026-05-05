import Link from "next/link";

export default function OnboardingPage() {
  return (
    <main className="rtt-shell text-white">
      <section className="rtt-max">
        <p className="rtt-kicker">Start Here</p>

        <h1 className="rtt-title">
          How RTT
          <br />
          Works
        </h1>

        <p className="rtt-subtitle">
          Simple rules. Fast battles. Real ranking.
        </p>

        <div className="mt-8 grid gap-4">
          <Step
            number="01"
            title="Scan In"
            text="Use the QR code at the table to open the park page."
          />

          <Step
            number="02"
            title="Join"
            text="Submit your player info and get added to the board."
          />

          <Step
            number="03"
            title="Battle"
            text="Play tracked games to 11. Win by 2."
          />

          <Step
            number="04"
            title="Climb"
            text="Wins, points, and score differential move your rank."
          />
        </div>

        <div className="mt-8 grid gap-3">
          <Link href="/park" className="rtt-cta">
            Open Park Flow
          </Link>

          <Link href="/rules" className="rtt-secondary">
            See Rules
          </Link>
        </div>
      </section>
    </main>
  );
}

function Step({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-rtt-red">
        {number}
      </p>

      <h2 className="mt-2 text-3xl font-black uppercase">{title}</h2>

      <p className="mt-2 text-sm leading-6 text-white/55">{text}</p>
    </div>
  );
}