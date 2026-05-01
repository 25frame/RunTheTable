import { Card } from "@/components/Card";
const rules = ["Games to 11, win by 2.", "Regular matches are best 2 of 3 unless event format says otherwise.", "Serve switches every 2 points; every 1 point at deuce.", "Entry is $15. Default model is $12 prize pool and $3 operations cut.", "Default payout split is 1st 50%, 2nd 30%, 3rd 20%.", "Scores must be reported immediately after the match.", "Organizer has final call on disputes.", "Respect players, tables, and public space."];

export default function RulesPage() {
  return <main className="mx-auto min-h-screen max-w-4xl px-5 py-10 text-white"><p className="text-xs font-black uppercase tracking-[0.3em] text-rtt-red">RTT House Rules</p><h1 className="mt-3 text-6xl font-black italic uppercase">Rules</h1><Card className="mt-8"><ol className="space-y-4">{rules.map((rule, index) => (<li key={rule} className="flex gap-4"><span className="font-black text-rtt-red">{String(index + 1).padStart(2, "0")}</span><span className="text-white/75">{rule}</span></li>))}</ol></Card></main>;
}
