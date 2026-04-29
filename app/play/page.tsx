import { Card } from "@/components/Card";

export default function PlayPage() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-10 text-white">
      <p className="text-xs font-black uppercase tracking-[0.3em] text-rtt-red">Weekly Event</p>
      <h1 className="mt-3 text-5xl font-black uppercase">Play This Week</h1>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <Card>
          <h2 className="text-2xl font-black uppercase">Event Details</h2>
          <div className="mt-5 space-y-3 text-white/70">
            <p><b className="text-white">Location:</b> TBD NYC park tables</p>
            <p><b className="text-white">Entry:</b> $15</p>
            <p><b className="text-white">Prize Model:</b> $12 prize pool / $3 operations</p>
            <p><b className="text-white">Format:</b> pods, ladder, and challenge matches</p>
          </div>
        </Card>
        <Card>
          <h2 className="text-2xl font-black uppercase">Signup</h2>
          <p className="mt-3 text-white/65">Replace this block with your Google Form embed or a Supabase-powered signup form.</p>
          <a href="#" className="mt-6 inline-block rounded-2xl bg-rtt-red px-6 py-3 text-sm font-black uppercase tracking-[0.2em]">Signup Link</a>
        </Card>
      </div>
    </main>
  );
}
