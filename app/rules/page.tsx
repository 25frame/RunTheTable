const rules = [
  "Games to 11. Win by 2.",
  "Tracked battles affect the board.",
  "Report scores immediately after the battle.",
  "No side betting on RTT events.",
  "Respect the table, the crew, and the space.",
  "Organizer has final call on disputes."
];

export default function RulesPage() {
  return (
    <main className="rtt-shell text-white">
      <section className="rtt-max">
        <p className="rtt-kicker">House Code</p>
        <h1 className="rtt-title">RULES</h1>

        <div className="mt-8 rtt-card p-5">
          <ol className="space-y-4">
            {rules.map((rule, index) => (
              <li key={rule} className="flex gap-4">
                <span className="font-black text-rtt-red">{String(index + 1).padStart(2, "0")}</span>
                <span className="text-white/75">{rule}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
