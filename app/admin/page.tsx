import { Card } from "@/components/Card";

const ADMIN_URL =
  "https://script.google.com/macros/s/AKfycbycnGdAqxQUpqLAyO9sQ1DfrSzDk94_sf0wBzCVZgDVrqVjZQ3xxIS6AZ39U07Stodd/exec?admin=1";

export default function AdminPage() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-5 py-10 text-white">
      <p className="text-xs font-black uppercase tracking-[0.3em] text-rtt-red">
        Organizer Control Center
      </p>
      <h1 className="mt-3 text-6xl font-black italic uppercase">Admin</h1>

      <Card className="mt-8 border-rtt-red/40 bg-rtt-red/10">
        <h2 className="text-2xl font-black uppercase">Google Admin Dashboard</h2>
        <p className="mt-3 text-white/65">
          Use the Apps Script admin dashboard to sync forms, check in players, generate
          matches, enter scores, recalculate standings, and set payouts.
        </p>
        <a
          href={ADMIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block rounded-2xl bg-rtt-red px-6 py-4 text-sm font-black uppercase tracking-[0.2em]"
        >
          Open Admin Dashboard
        </a>
      </Card>
    </main>
  );
}
