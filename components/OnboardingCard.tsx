import Link from "next/link";

export type OnboardingStep = {
  number: string;
  title: string;
  body: string;
  actionLabel?: string;
  actionHref?: string;
};

export function OnboardingCard({ step }: { step: OnboardingStep }) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/30">
      <p className="text-xs font-black uppercase tracking-[0.24em] text-rtt-red">
        {step.number}
      </p>

      <h2 className="mt-3 text-3xl font-black italic uppercase leading-none tracking-[-0.06em]">
        {step.title}
      </h2>

      <p className="mt-3 text-sm font-semibold leading-6 text-white/58">
        {step.body}
      </p>

      {step.actionHref && step.actionLabel && (
        <Link href={step.actionHref} className="rtt-cta mt-5 w-full">
          {step.actionLabel}
        </Link>
      )}
    </section>
  );
}
