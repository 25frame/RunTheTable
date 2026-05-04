"use client";

import { AdminShell } from "@/components/admin/AdminShell";
import { authedPost, getCurrentUser } from "@/lib/auth";
import { getRTTData, RTTData } from "@/lib/googleData";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<RTTData | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();

    if (!user || user.role !== "admin") {
      router.push("/login");
      return;
    }

    getRTTData().then(setData);
  }, [router]);

  async function syncNow() {
    setBusy(true);

    try {
      await authedPost("syncForm", {});
      await authedPost("recalcStandings", {});
      setData(await getRTTData());
      alert("Synced and recalculated.");
    } catch (err) {
      alert(String(err));
    } finally {
      setBusy(false);
    }
  }

  const liveMatch = data?.matches.find(
    (m) => (m.status || "").toLowerCase() === "live"
  );

  return (
    <AdminShell>
      <p className="rtt-kicker">Control Center</p>
      <h1 className="mt-3 text-5xl font-black italic uppercase">
        Dashboard
      </h1>

      <div className="mt-6 rounded-[2rem] border border-yellow-400/30 bg-yellow-400/10 p-5">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-yellow-200">
          Operator Warning
        </p>
        <p className="mt-2 text-sm leading-6 text-white/70">
          Do not rename sheet tabs or move columns. Use this dashboard for
          scoring, player control, syncing, and public page review.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <DashboardButton
          title="Live Scoring"
          text="Tap score buttons."
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
          title="Training"
          text="Admin onboarding."
          onClick={() => router.push("/admin/onboarding")}
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
          disabled={busy}
          onClick={syncNow}
          className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-left text-2xl font-black uppercase disabled:opacity-50"
        >
          Sync Now
          <span className="mt-2 block text-sm font-bold normal-case text-white/60">
            Pull forms and recalc.
          </span>
        </button>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <Metric label="Competitors" value={data?.players.length || 0} />
        <Metric label="Battles" value={data?.matches.length || 0} />
        <Metric
          label="King"
          value={data?.players[0]?.handle || data?.players[0]?.name || "TBD"}
        />
        <Metric label="Live" value={liveMatch ? "YES" : "NO"} />
      </div>
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
      onClick={onClick}
      className={
        primary
          ? "rounded-[2rem] bg-rtt-red p-8 text-left text-2xl font-black uppercase shadow-2xl"
          : "rounded-[2rem] border border-white/10 bg-white/5 p-8 text-left text-2xl font-black uppercase"
      }
    >
      {title}
      <span className="mt-2 block text-sm font-bold normal-case text-white/60">
        {text}
      </span>
    </button>
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
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-white/40">
        {label}
      </p>
      <p className="mt-2 text-3xl font-black">{value}</p>
    </div>
  );
}
