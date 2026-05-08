"use client";

import { AdminField, AdminSelect } from "@/components/admin/AdminField";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { AdminShell } from "@/components/admin/AdminShell";
import { createUser } from "@/lib/adminControl";
import { getCurrentUser } from "@/lib/auth";
import type { RTTData, RTTPlayer } from "@/lib/googleData";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type UserRole = "admin" | "player";

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

export default function AdminUsersPage() {
  const router = useRouter();

  const [players, setPlayers] = useState<RTTPlayer[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("player");
  const [playerId, setPlayerId] = useState("");

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

  const selectedPlayer = players.find((player) => player.id === playerId);
  const cleanEmail = email.trim().toLowerCase();
  const cleanPassword = password.trim();

  const canCreate =
    Boolean(cleanEmail) &&
    Boolean(cleanPassword) &&
    (role === "admin" || Boolean(playerId)) &&
    !busy &&
    !loading;

  useEffect(() => {
    const user = getCurrentUser();

    if (!user || user.role !== "admin") {
      router.push("/login");
      return;
    }

    loadPlayers();
  }, [router]);

  async function loadPlayers() {
    setLoading(true);
    setError("");

    try {
      const data = await fetchRTTData();
      const loadedPlayers = data.players || [];

      setPlayers(loadedPlayers);
      setPlayerId(loadedPlayers[0]?.id || "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load players.");
      setPlayers([]);
      setPlayerId("");
    } finally {
      setLoading(false);
    }
  }

  async function submit() {
    if (!cleanEmail) {
      setError("Email is required.");
      return;
    }

    if (!cleanPassword) {
      setError("Password is required.");
      return;
    }

    if (role === "player" && !playerId) {
      setError("Player accounts must be linked to a player.");
      return;
    }

    setBusy(true);
    setError("");

    try {
      await createUser({
        email: cleanEmail,
        password: cleanPassword,
        role,
        playerId: role === "player" ? playerId : "",
      });

      alert("User created.");

      setEmail("");
      setPassword("");
      setRole("player");
      setPlayerId(players[0]?.id || "");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to create user.";

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
          <p className="rtt-mini-kicker">Access Control</p>

          <h1 className="mt-2 text-4xl font-black italic uppercase tracking-[-0.06em] md:text-6xl">
            Users
          </h1>
        </div>

        <button
          type="button"
          onClick={loadPlayers}
          disabled={loading || busy}
          className="shrink-0 rounded-full border border-white/10 bg-white/[0.055] px-4 py-3 text-[10px] font-black uppercase tracking-[0.16em] text-white/70 disabled:opacity-50 md:px-5 md:text-xs"
        >
          {loading ? "Loading" : "Refresh"}
        </button>
      </div>

      <div className="mt-5">
        <AdminNotice title="Access Rule" tone="warning">
          Admin accounts control the system. Player accounts should only be
          linked to one player profile.
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
              New {role} account
            </p>

            <h2 className="mt-3 truncate text-3xl font-black uppercase tracking-[-0.06em]">
              {cleanEmail || "email@example.com"}
            </h2>

            <p className="mt-3 text-sm font-black uppercase tracking-[0.12em] text-white/45">
              Role / {role}
            </p>

            {role === "player" ? (
              <p className="mt-2 truncate text-sm font-black uppercase tracking-[0.12em] text-rtt-red">
                {selectedPlayer
                  ? `${selectedPlayer.id} — ${
                      selectedPlayer.handle || selectedPlayer.name
                    }`
                  : "No player selected"}
              </p>
            ) : (
              <p className="mt-2 text-sm font-black uppercase tracking-[0.12em] text-rtt-red">
                Full admin access
              </p>
            )}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <SmallStat label="Players" value={players.length} />
            <SmallStat label="Ready" value={canCreate ? "Yes" : "No"} />
          </div>
        </aside>

        <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-5 md:rounded-[2rem]">
          <div className="mb-5">
            <p className="rtt-mini-kicker">User Details</p>

            <h2 className="mt-1 text-2xl font-black uppercase tracking-[-0.04em]">
              Create Login
            </h2>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-black/40 p-5 text-sm text-white/50">
              Loading players...
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <AdminField
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="user@example.com"
              />

              <AdminField
                label="Password"
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="Temporary password"
              />

              <AdminSelect
                label="Role"
                value={role}
                onChange={(value) => setRole(value as UserRole)}
                options={[
                  { label: "Player", value: "player" },
                  { label: "Admin", value: "admin" },
                ]}
              />

              {role === "player" ? (
                <AdminSelect
                  label="Linked Player"
                  value={playerId}
                  onChange={setPlayerId}
                  options={playerOptions}
                />
              ) : (
                <div className="rounded-2xl border border-rtt-red/25 bg-rtt-red/10 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-rtt-red">
                    Admin Access
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/55">
                    This account can manage players, matches, scoring, users,
                    sync, and backend controls.
                  </p>
                </div>
              )}

              {role === "player" && !playerId ? (
                <div className="rounded-2xl border border-red-500/30 bg-red-950/30 p-4 text-sm text-red-200 md:col-span-2">
                  Player accounts require a linked player profile.
                </div>
              ) : null}

              <button
                type="button"
                disabled={!canCreate}
                onClick={submit}
                className="rtt-cta md:col-span-2 disabled:opacity-50"
              >
                {busy ? "Creating..." : "Create User"}
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