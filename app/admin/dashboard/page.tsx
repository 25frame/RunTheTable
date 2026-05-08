"use client";

import { AdminNotice } from "@/components/admin/AdminNotice";
import { AdminShell } from "@/components/admin/AdminShell";
import { authedPost, getCurrentUser } from "@/lib/auth";
import type { RTTData } from "@/lib/googleData";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

async function fetchRTTData(): Promise<RTTData> {
  const response = await fetch("/api/rtt", {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to load RTT data: HTTP ${response.status}`);
  }

  return (await response.json()) as RTTData;
}

export default function AdminDashboardPage() {
  const router = useRouter();

  const [data, setData] = useState<RTTData | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function refreshData() {
    setError("");

    try {
      const nextData = await fetchRTTData();
      setData(nextData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load RTT data.");
    }
  }

  useEffect(() => {
    const user = getCurrentUser();

    if (!user || user.role !== "admin") {
      router.push("/login");
      return;
    }

    refreshData();
  }, [router]);

  async function syncNow() {
    setBusy(true);
    setError("");

    try {
      await authedPost("syncForm", {});
      await authedPost("recalcStandings", {});
      await refreshData();
      alert("Synced and recalculated.");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Sync and recalculation failed.";

      setError(message);
      alert(message);
    } finally {
      setBusy(false);
    }
  }

  const players = data?.players || [];
  const matches = data?.matches || [];

  const liveMatch = matches.find(
    (match) => (match.status || "").toLowerCase() === "live"
  );

  return (
    <AdminShell>
      <p className="rtt-mini-kicker">Control Center</p>

      <h1 className="mt-2 text-4xl font-black italic uppercase tracking-[-0.06em] md:text-6xl">
        Dashboard
      </h1>

      <div className="mt-5">
        <AdminNotice title="Operator Warning" tone="warning">
          Do not rename sheet tabs or move columns. Use this dashboard for
          scoring, player control, syncing, and public page review.
        </AdminNotice>
      </div>

      {error ? (
        <div className="mt-5 rounded-[1.5rem] border border-red-500/30 bg-red-950/30 p-4 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <section className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Metric label="Competitors" value={players.length} />
        <Metric label="Battles" value={matches.length} />
        <Metric
          label="King"
          value={players[0]?.handle || players[0]?.name || "TBD"}
        />
        <Metric label="Live" value={liveMatch ? "YES" : "NO"} />
      </section>

      <section className="mt-6 grid gap-3 md:grid-cols-4">
        <DashboardButton
          title="Live Scoring"
          text="Score active battles."
          primary
          onClick={() => router.push("/admin/matches")}
        />

        <DashboardButton
          title="Players"
          text="Review roster."
          onClick={() => router.push("/admin/players")}
        />

        <DashboardButton
          title="Create Player"
          text="Add player/login."
          onClick={() => router.push("/admin/create-player")}
        />

        <DashboardButton
          title="Create Battle"
          text="Schedule match."
          onClick={() => router.push("/admin/create-match")}
        />

        <DashboardButton
          title="Users"
          text="Manage access."
          onClick={() => router.push("/admin/users")}
        />

        <DashboardButton
          title="Setup"
          text="Event settings."
          onClick={() => router.push("/admin/setup")}
        />

        <DashboardButton
          title="Health"
          text="Check backend."
          onClick={() => router.push("/admin/health")}
        />

        <DashboardButton
          title="Control"
          text="Sync and recalc."
          onClick={() => router.push("/admin/control")}
        />

        <DashboardButton
          title="Public Live"
          text="Open scoreboard."
          onClick={() => router.push("/live")}
        />

        <DashboardButton
          title="Rules"
          text="Open rules page."
          onClick={() => router.push("/rules")}
        />

        <DashboardButton
          title="Park QR"
          text="Open QR landing."
          onClick={() => router.push("/park")}
        />

        <DashboardButton
          title="Join"
          text="Open signup page."
          onClick={() => router.push("/join")}
        />

        <button
          type="button"
          disabled={busy}
          onClick={syncNow}
          className="rounded-[1.5rem] bg-rtt-red p-5 text-left transition active:scale-[0.985] disabled:opacity-50 md:rounded-[2rem] md:p-6"
        >
          <span className="block text-xl font-black uppercase tracking-[-0.04em] md:text-2xl">
            {busy ? "Syncing..." : "Sync Now"}
          </span>

          <span className="mt-2 block text-sm font-bold leading-6 text-white/75">
            Pull forms and recalculate standings.
          </span>
        </button>
      </section>
    </AdminShell>
  );
}

function DashboardButton({
  title,
  text,
  onClick,
  primary = false,
}: {
  title: string;
  text: string;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        primary
          ? "rounded-[1.5rem] bg-rtt-red p-5 text-left transition active:scale-[0.985] md:rounded-[2rem] md:p-6"
          : "rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-5 text-left transition active:scale-[0.985] md:rounded-[2rem] md:p-6"
      }
    >
      <span className="block text-xl font-black uppercase tracking-[-0.04em] md:text-2xl">
        {title}
      </span>

      <span className="mt-2 block text-sm font-bold leading-6 text-white/55">
        {text}
      </span>
    </button>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-4 md:rounded-[2rem] md:p-5">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/40 md:text-xs">
        {label}
      </p>

      <p className="mt-2 truncate text-2xl font-black uppercase tracking-[-0.04em] md:text-3xl">
        {value}
      </p>
    </div>
  );
}