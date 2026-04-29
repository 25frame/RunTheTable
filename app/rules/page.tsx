import { Card } from "@/components/Card";

export default function RulesPage() {
  const rules = [
    "Games to 11, win by 2.",
    "Regular matches are best 2 of 3.",
    "Serve switches every 2 points; every 1 point at 10-10.",
    "Entry is $15: $12 prize pool / $3 league operations.",
    "Payout split: 1st 50%, 2nd 30%, 3rd 20%.",
    "Report scores immediately after match.",
    "Organizer has final call on disputes.",
    "Respect players, tables, and public space."
  ];
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-10 text-white">
      <p className="text-xs font-black uppercase tracking-[0.3em] text-rtt-red">RTT House Rules</p>
      <h1 className="mt-3 text-5xl font-black uppercase">Rules</h1>
      <Card className="mt-8">
        <ol className="space-y-4">
          {rules.map((rule, i) => (
            <li key={rule} className="flex gap-4"><span className="font-black text-rtt-red">{String(i + 1).padStart(2, "0")}</span><span className="text-white/75">{rule}</span></li>
          ))}
        </ol>
      </Card>
    </main>
  );
}
