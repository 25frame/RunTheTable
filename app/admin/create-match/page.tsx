"use client";

import { AdminField, AdminSelect } from "@/components/admin/AdminField";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { AdminShell } from "@/components/admin/AdminShell";
import { createMatch } from "@/lib/adminControl";
import { getCurrentUser } from "@/lib/auth";
import type { RTTData, RTTPlayer } from "@/lib/googleData";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

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

export default function CreateMatchPage() {
  const router = useRouter();

  const [players, setPlayers] = useState<RTTPlayer[]>([]);
  const [playerAId, setPlayerAId] = useState("");
  const [playerBId, setPlayerBId] = useState("");
  const [type, setType] = useState("Street");
  const [table, setTable] = useState("Table 1");
  const [eventId, setEventId] = useState("EVT-001");

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const playerOptions = useMemo(
    () =>
      players.map((player) => ({
        label: `${player.id} — ${player.handle || player.name}`,
        value: player.id,
      })),
    [players]
  );

  const selectedPlayerA = players.find((player) => player.id === playerAId);
  const selectedPlayerB = players.find((player) => player.id === playerBId);

  const canCreate =
    Boolean(playerAId) &&
    Boolean(playerBId) &&
    playerAId !== playerBId &&
    !busy &&
    !loading;

  useEffect(() => {
    const user = getCurrentUser();

    if (!user || user.role !== "admin") {
      router.push("/login");
      return;
    }

    loadInitialData();
  }, [router]);

  async function loadInitialData() {
    setLoading(true);
    setError("");

    try {
      const data = await fetchRTTData();
      const loadedPlayers = data.players || [];

      setPlayers(loadedPlayers);
      setPlayerAId(loadedPlayers[0]?.id || "");
      setPlayerBId(loadedPlayers[1]?.id || "");
      setEventId(data.payout?.eventId || "EVT-001");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load players.");
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  }

  async function submit() {
    if (!canCreate) {
      if (playerAId === playerBId) {
        setError("Player A and Player B must be different.");
      }
      return;
    }

    setBusy(true);
    setError("");

    try {
      await createMatch({
        eventId,
        type,
        table,
        playerAId,
        playerBId,
      });

      alert("Battle created.");
      router.push("/admin/matches");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to create battle.";

      setError(message);
      alert(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AdminShell>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="rtt-mini-kicker">Battle Builder</p>

          <h1 className="mt-2 text-4xl font-black italic uppercase tracking-[-0.06em] md:text-6xl">
            Create Battle
          </h1>
        </div>

        <button
          type="button"
          onClick={() => router.push("/admin/matches")}
          className="shrink-0 rounded-full border border-white/10 bg-white/[0.055] px-4 py-3 text-[10px] font-black uppercase tracking-[0.16em] text-white/70 md:px-5 md:text-xs"
        >
          Scoring
        </button>
      </div>

      <div className="mt-5">
        <AdminNotice title="Battle Creation">
          Create scheduled matches here instead of adding rows manually in
          Google Sheets.
        </AdminNotice>
      </div>

      {error ? (
        <div className="mt-5 rounded-[1.5rem] border border-red-500/30 bg-red-950/30 p-4 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <section className="mt-6 grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
        <aside className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-5 md:rounded-[2rem]">
          <p className="rtt-mini-kicker">Preview</p>

          <div className="mt-5 rounded-[1.5rem] bg-black/55 p-5">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/35">
              {type} / {table}
            </p>

            <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.06em]">
              {selectedPlayerA?.handle || selectedPlayerA?.name || "Player A"}
            </h2>

            <p className="my-3 text-xl font-black uppercase text-rtt-red">
              vs
            </p>

            <h2 className="text-3xl font-black uppercase tracking-[-0.06em]">
              {selectedPlayerB?.handle || selectedPlayerB?.name || "Player B"}
            </h2>

            <p className="mt-5 text-[10px] font-black uppercase tracking-[0.18em] text-white/35">
              Event {eventId}
            </p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <SmallStat label="Players" value={players.length} />
            <SmallStat label="Ready" value={canCreate ? "Yes" : "No"} />
          </div>
        </aside>

        <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-5 md:rounded-[2rem]">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="rtt-mini-kicker">Match Details</p>

              <h2 className="mt-1 text-2xl font-black uppercase tracking-[-0.04em]">
                Setup
              </h2>
            </div>

            <button
              type="button"
              onClick={loadInitialData}
              disabled={loading || busy}
              className="rounded-full border border-white/10 bg-black/40 px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.14em] text-white/60 disabled:opacity-50"
            >
              {loading ? "Loading" : "Refresh"}
            </button>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-black/40 p-5 text-sm text-white/50">
              Loading players...
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <AdminField
                label="Event ID"
                value={eventId}
                onChange={setEventId}
              />

              <AdminField label="Table" value={table} onChange={setTable} />

              <AdminSelect
                label="Type"
                value={type}
                onChange={setType}
                options={["Street", "Ranked", "Final", "Call Out"].map(
                  (value) => ({
                    label: value,
                    value,
                  })
                )}
              />

              <div className="hidden md:block" />

              <AdminSelect
                label="Player A"
                value={playerAId}
                onChange={setPlayerAId}
                options={playerOptions}
              />

              <AdminSelect
                label="Player B"
                value={playerBId}
                onChange={setPlayerBId}
                options={playerOptions}
              />

              {playerAId && playerBId && playerAId === playerBId ? (
                <div className="rounded-2xl border border-red-500/30 bg-red-950/30 p-4 text-sm text-red-200 md:col-span-2">
                  Player A and Player B must be different.
                </div>
              ) : null}

              <button
                type="button"
                disabled={!canCreate}
                onClick={submit}
                className="rtt-cta md:col-span-2 disabled:opacity-50"
              >
                {busy ? "Creating..." : "Create Battle"}
              </button>
            </div>
          )}
        </section>
      </section>
    </AdminShell>
  );
}

function SmallStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-black/45 p-4">
      <p className="text-[9px] font-black uppercase tracking-[0.16em] text-white/35">
        {label}
      </p>

      <p className="mt-1 truncate text-xl font-black uppercase tracking-[-0.04em] text-white">
        {value}
      </p>
    </div>
  );
}