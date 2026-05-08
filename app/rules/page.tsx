import { PageHero } from "@/components/PageHero";

const RULES = [
  {
    number: "01",
    title: "Game To 11",
    text: "First player to 11 wins. Must win by 2.",
  },
  {
    number: "02",
    title: "Serve Switch",
    text: "Serve changes every 2 points. At 10–10, serve changes every point.",
  },
  {
    number: "03",
    title: "Call It Clean",
    text: "Players are expected to call edges, lets, and disputes honestly.",
  },
  {
    number: "04",
    title: "Report Results",
    text: "Verified results update the board, rankings, and points.",
  },
];

export const dynamic = "force-static";

export default function RulesPage() {
  return (
    <main className="rtt-page">
      <section className="rtt-page-inner">
        <PageHero
          kicker="Rules"
          title="Table Code"
          subtitle="Fast rules for fast matches."
        />

        <section className="rtt-section rtt-list">
          {RULES.map((rule) => (
            <article key={rule.number} className="rtt-mobile-card">
              <p className="rtt-mini-kicker">{rule.number}</p>

              <h2 className="mt-3 text-2xl font-black uppercase tracking-[-0.05em]">
                {rule.title}
              </h2>

              <p className="mt-3 text-base leading-7 text-white/50">
                {rule.text}
              </p>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}