"use client";

import { useMemo, useState } from "react";

type RuleCard = {
  kicker: string;
  title: string;
  headline: string;
  body: string;
  bullets: string[];
};

const cards: RuleCard[] = [
  {
    kicker: "01 / Game",
    title: "First to 11",
    headline: "Get to 11. Win by 2.",
    body: "Every battle is simple: first player to 11 wins, unless the score is tied near the end.",
    bullets: ["Game to 11", "Must win by 2", "No long arguments"],
  },
  {
    kicker: "02 / Serve",
    title: "Two Serves",
    headline: "Serve switches every 2 points.",
    body: "Each player serves twice, then the serve changes. At 10–10, serve switches every point.",
    bullets: ["2 serves each", "At 10–10, switch every point", "Serve must bounce on your side first"],
  },
  {
    kicker: "03 / Play",
    title: "No Volleys",
    headline: "Let the ball bounce.",
    body: "You cannot hit the ball out of the air. It has to bounce before you return it.",
    bullets: ["No volleys", "Miss = point lost", "Return must land on opponent side"],
  },
  {
    kicker: "04 / Edge",
    title: "Edge Counts",
    headline: "If it clips the edge, it is live.",
    body: "Edge balls count. Side balls do not. If nobody is sure, replay the point.",
    bullets: ["Edge = live", "Side = out", "Dispute = replay"],
  },
  {
    kicker: "05 / Net",
    title: "Net Serve",
    headline: "Net on serve is a replay.",
    body: "If the serve hits the net and still lands in, replay the serve. If it misses, point lost.",
    bullets: ["Net + in = replay", "Net + out = point lost", "Keep it moving"],
  },
  {
    kicker: "06 / Street Code",
    title: "Respect Table",
    headline: "Winner stays. Score stands.",
    body: "RTT is built to move fast. Respect the table, call scores clearly, and replay disputed points.",
    bullets: ["Winner stays up", "Call score clearly", "Respect the table"],
  },
];

export function RulesSwipeCards() {
  const [index, setIndex] = useState(0);
  const card = cards[index];

  const progress = useMemo(() => {
    return Math.round(((index + 1) / cards.length) * 100);
  }, [index]);

  function next() {
    setIndex((current) => (current + 1) % cards.length);
  }

  function prev() {
    setIndex((current) => (current - 1 + cards.length) % cards.length);
  }

  return (
    <section className="mt-8">
      <div className="mb-4 flex items-center justify-between">
        <p className="rtt-kicker">Swipe Rules</p>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-white/35">
          {index + 1}/{cards.length}
        </p>
      </div>

      <div className="h-1 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full bg-rtt-red transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div
        className="mt-5 touch-pan-y select-none"
        onTouchStart={(e) => {
          const startX = e.touches[0].clientX;

          function endHandler(endEvent: TouchEvent) {
            const endX = endEvent.changedTouches[0].clientX;
            const delta = endX - startX;

            if (Math.abs(delta) > 45) {
              if (delta < 0) next();
              else prev();
            }

            window.removeEventListener("touchend", endHandler);
          }

          window.addEventListener("touchend", endHandler);
        }}
      >
        <article className="relative min-h-[440px] overflow-hidden rounded-[2.5rem] border border-rtt-red/35 bg-rtt-red/10 p-6 shadow-2xl shadow-red-950/30">
          <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-rtt-red/35 blur-3xl" />
          <div className="absolute -bottom-20 -left-16 h-52 w-52 rounded-full bg-white/10 blur-3xl" />

          <div className="relative">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-rtt-red">
              {card.kicker}
            </p>

            <h2 className="mt-4 text-6xl font-black italic uppercase leading-none tracking-[-0.08em]">
              {card.title}
            </h2>

            <p className="mt-5 text-2xl font-black uppercase leading-tight tracking-[-0.04em] text-white">
              {card.headline}
            </p>

            <p className="mt-4 text-sm font-semibold leading-6 text-white/60">
              {card.body}
            </p>

            <div className="mt-7 grid gap-3">
              {card.bullets.map((bullet) => (
                <div
                  key={bullet}
                  className="rounded-2xl border border-white/10 bg-black/45 px-4 py-3 text-sm font-black uppercase tracking-[0.1em]"
                >
                  {bullet}
                </div>
              ))}
            </div>
          </div>
        </article>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <button onClick={prev} className="rtt-secondary">
          Back
        </button>
        <button onClick={next} className="rtt-cta">
          Next
        </button>
      </div>

      <p className="mt-4 text-center text-xs font-bold uppercase tracking-[0.16em] text-white/35">
        Swipe left or right
      </p>
    </section>
  );
}
