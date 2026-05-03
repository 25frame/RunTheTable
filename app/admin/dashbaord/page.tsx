"use client";

import { AdminShell } from "@/components/admin/AdminShell";
import { getCurrentUser } from "@/lib/auth";
import { getRTTData, RTTData } from "@/lib/googleData";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<RTTData | null>(null);

  useEffect(() => {
    const user = getCurrentUser();

    if (!user || user.role !== "admin") {
      router.push("/login");
      return;
    }

    load();
  }, [router]);

  async function load() {
    const res = await getRTTData();
    setData(res);
  }

  return (
    <AdminShell>
      <p className="rtt-kicker">System Overview</p>
      <h1 className="mt-3 text-5xl font-black italic uppercase">
        Dashboard
      </h1>

      {/* METRICS */}
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <Metric label="Players" value={data?.players.length || 0} />
        <Metric label="Matches" value={data?.matches.length || 0} />
        <Metric
          label="Top Player"
          value={
            data?.players[0]?.handle ||
            data?.players[0]?.name ||
            "—"
          }
        />
        <Metric
          label="Updated"
          value={
            data?.updatedAt
              ? new Date(data.updatedAt).toLocaleTimeString()
              : "-"
          }
        />
      </div>

      {/* QUICK ACTIONS */}
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <QuickCard
          title="Control Panel"
          text="Run sync, recalc, and backend actions."
          href="/admin/control"
        />

        <QuickCard
          title="Create Player"
          text="Add player without using Google Form."
          href="/admin/create-player"
        />

        <QuickCard
          title="Create Match"
          text="Schedule or create new battles."
          href="/admin/create-match"
        />

        <QuickCard
          title="Live Scoring"
          text="Update scores in real time."
          href="/admin/matches"
        />

        <QuickCard
          title="Users"
          text="Create admin or player logins."
          href="/admin/users"
        />

        <QuickCard
          title="System Health"
          text="Check backend + Sheets integrity."
          href="/admin/health"
        />
      </div>

      {/* RECENT MATCHES */}
      <div className="mt-12">
        <p className="rtt-kicker">Recent Battles</p>

        <div className="mt-4 grid gap-3">
          {data?.matches.slice(0, 5).map((m) => (
            <div
              key={m.matchId + m.row}
              className="rounded-2xl border border-white/10 bg-white/[0.05] p-4"
            >
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-black uppercase">
                    {m.playerA} vs {m.playerB}
                  </p>
                  <p className="text-xs text-white/40">
                    {m.type} • {m.table}
                  </p>
                </div>

                <p className="text-xl font-black text-rtt-red">
                  {m.score}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-5">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-white/40">
        {label}
      </p>
      <p className="mt-2 text-2xl font-black">{value}</p>
    </div>
  );
}

function QuickCard({
  title,
  text,
  href,
}: {
  title: string;
  text: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 transition active:scale-[0.98]"
    >
      <h2 className="text-xl font-black uppercase">{title}</h2>
      <p className="mt-2 text-sm text-white/50">{text}</p>

      <p className="mt-4 text-xs font-black uppercase tracking-[0.18em] text-rtt-red">
        Open
      </p>
    </a>
  );
}