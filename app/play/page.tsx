import { Card } from "@/components/Card";
import { getRTTData } from "@/lib/googleData";
export default async function PlayPage() {
  const { formUrl } = await getRTTData();
  return <main className="mx-auto min-h-screen max-w-5xl px-5 py-10 text-white"><p className="text-xs font-black uppercase tracking-[0.3em] text-rtt-red">Weekly Event</p><h1 className="mt-3 text-6xl font-black italic uppercase">Play This Week</h1><div className="mt-8 grid gap-5 md:grid-cols-2"><Card><h2 className="text-2xl font-black uppercase">Event Details</h2><div className="mt-5 space-y-3 text-white/70"><p><b className="text-white">Entry:</b> $15</p><p><b className="text-white">Prize Model:</b> $12 prize pool / $3 operations</p></div></Card><Card className="border-rtt-red/40 bg-rtt-red/10"><h2 className="text-2xl font-black uppercase">Signup</h2><a href={formUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block rounded-2xl bg-rtt-red px-6 py-4 text-sm font-black uppercase tracking-[0.2em]">Open Signup Form</a></Card></div></main>;
}
