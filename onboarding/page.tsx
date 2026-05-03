import Link from "next/link";
import { OnboardingCard, OnboardingStep } from "@/components/OnboardingCard";

const steps: OnboardingStep[] = [
  {
    number: "01",
    title: "Scan in",
    body: "At the table, scan the QR code. The park page shows who is playing, who is on top, and how to join.",
    actionLabel: "Open Park Page",
    actionHref: "/park",
  },
  {
    number: "02",
    title: "Join the board",
    body: "Sign up with your name and handle. Once added, your player profile appears on The Board.",
    actionLabel: "Join Next Battle",
    actionHref: "/join",
  },
  {
    number: "03",
    title: "Battle",
    body: "Games go to 11. Win by 2. Admin scores the match live so everyone can follow.",
    actionLabel: "See Rules",
    actionHref: "/rules",
  },
  {
    number: "04",
    title: "Climb",
    body: "Wins, losses, score difference, heat, and status decide how your name shows up.",
    actionLabel: "View The Board",
    actionHref: "/standings",
  },
  {
    number: "05",
    title: "Own your profile",
    body: "Players can log in, update their handle, and upload a photo. Your profile becomes your identity.",
    actionLabel: "Login",
    actionHref: "/login",
  },
];

export default function OnboardingPage() {
  return (
    <main className="rtt-shell text-white">
      <section className="rtt-max">
        <p className="rtt-kicker">Start here</p>
        <h1 className="rtt-title">
          HOW<br />RTT<br />WORKS
        </h1>

        <p className="rtt-subtitle">
          Show up. Get on the board. Battle. Climb. Run the table.
        </p>

        <div className="mt-8 grid gap-4">
          {steps.map((step) => (
            <OnboardingCard key={step.number} step={step} />
          ))}
        </div>

        <div className="mt-8 rounded-[2rem] border border-rtt-red/35 bg-rtt-red/10 p-5">
          <p className="rtt-kicker">Simple code</p>
          <h2 className="mt-3 text-4xl font-black italic uppercase tracking-[-0.06em]">
            No soft games.
          </h2>
          <p className="mt-3 text-sm font-semibold leading-6 text-white/60">
            Respect the table, respect the score, and keep battles moving. If there is a dispute, replay the point.
          </p>

          <Link href="/live" className="rtt-cta mt-5 w-full">
            Watch Live
          </Link>
        </div>
      </section>
    </main>
  );
}
