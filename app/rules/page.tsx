export default function RulesPage() {
  const rules = [
    {
      title: "Game to 11",
      text: "First player to 11 wins. Must win by 2.",
    },
    {
      title: "Serve Switch",
      text: "Serve changes every 2 points. At 10–10, serve changes every point.",
    },
    {
      title: "No Volleys",
      text: "The ball must bounce before you return it.",
    },
    {
      title: "Edge Counts",
      text: "Edge balls count. Side balls are out.",
    },
    {
      title: "Respect The Table",
      text: "Call scores clearly. Replay disputed points.",
    },
  ];

  return (
    <main className="rtt-shell text-white">
      <section className="rtt-max">
        <p className="rtt-kicker">Rules</p>

        <h1 className="rtt-title">
          Table
          <br />
          Code
        </h1>

        <p className="rtt-subtitle">
          Fast rules for fast matches.
        </p>

        <div className="mt-8 grid gap-4">
          {rules.map((rule, index) => (
            <div
              key={rule.title}
              className="rounded-[2rem] border border-white/10 bg-white/5 p-6"
            >
              <p className="text-xs font-black uppercase tracking-[0.2em] text-rtt-red">
                {String(index + 1).padStart(2, "0")}
              </p>

              <h2 className="mt-2 text-3xl font-black uppercase">
                {rule.title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-white/55">
                {rule.text}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}