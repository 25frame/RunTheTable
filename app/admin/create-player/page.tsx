"use client";

import { AdminField, AdminSelect } from "@/components/admin/AdminField";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { AdminShell } from "@/components/admin/AdminShell";
import { createPlayer } from "@/lib/adminControl";
import { getCurrentUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const skillOptions = [
  { label: "Beginner", value: "Beginner" },
  { label: "Intermediate", value: "Intermediate" },
  { label: "Advanced", value: "Advanced" },
  { label: "Killer", value: "Killer" },
  { label: "Unranked", value: "Unranked" },
];

const statusOptions = [
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
];

export default function CreatePlayerPage() {
  const router = useRouter();

  const [displayName, setDisplayName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [instagram, setInstagram] = useState("");
  const [skill, setSkill] = useState("Beginner");
  const [paymentHandle, setPaymentHandle] = useState("");
  const [photo, setPhoto] = useState("");
  const [status, setStatus] = useState("Active");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const cleanDisplayName = displayName.trim();
  const cleanFullName = fullName.trim() || cleanDisplayName;
  const cleanEmail = email.trim().toLowerCase();

  const canCreate = Boolean(cleanDisplayName) && !busy;

  useEffect(() => {
    const user = getCurrentUser();

    if (!user || user.role !== "admin") {
      router.push("/login");
    }
  }, [router]);

  async function submit() {
    if (!cleanDisplayName) {
      setError("Display name is required.");
      return;
    }

    setBusy(true);
    setError("");

    try {
      await createPlayer({
        displayName: cleanDisplayName,
        fullName: cleanFullName,
        email: cleanEmail,
        phone: phone.trim(),
        instagram: instagram.trim(),
        skill,
        paymentHandle: paymentHandle.trim(),
        photo: photo.trim(),
        status,
      });

      alert("Player created.");
      router.push("/admin/players");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to create player.";

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
          <p className="rtt-mini-kicker">Roster Builder</p>

          <h1 className="mt-2 text-4xl font-black italic uppercase tracking-[-0.06em] md:text-6xl">
            Create Player
          </h1>
        </div>

        <button
          type="button"
          onClick={() => router.push("/admin/players")}
          className="shrink-0 rounded-full border border-white/10 bg-white/[0.055] px-4 py-3 text-[10px] font-black uppercase tracking-[0.16em] text-white/70 md:px-5 md:text-xs"
        >
          Roster
        </button>
      </div>

      <div className="mt-5">
        <AdminNotice title="Player Creation">
          Add a player to the board. A player can be linked to a login user
          later from the Users area.
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
              New Player
            </p>

            <h2 className="mt-3 text-4xl font-black uppercase tracking-[-0.06em]">
              {cleanDisplayName || "Player Name"}
            </h2>

            <p className="mt-3 text-sm font-black uppercase tracking-[0.12em] text-white/45">
              {skill} / {status}
            </p>

            {instagram.trim() ? (
              <p className="mt-2 text-sm font-black uppercase tracking-[0.12em] text-rtt-red">
                {instagram.trim()}
              </p>
            ) : null}

            {cleanEmail ? (
              <p className="mt-4 truncate text-[10px] font-black uppercase tracking-[0.16em] text-white/35">
                {cleanEmail}
              </p>
            ) : null}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <SmallStat label="Ready" value={canCreate ? "Yes" : "No"} />
            <SmallStat label="Login" value="Later" />
          </div>
        </aside>

        <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-5 md:rounded-[2rem]">
          <div className="mb-5">
            <p className="rtt-mini-kicker">Player Details</p>

            <h2 className="mt-1 text-2xl font-black uppercase tracking-[-0.04em]">
              Profile
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <AdminField
              label="Display Name"
              value={displayName}
              onChange={setDisplayName}
              placeholder="e.g. Ace"
            />

            <AdminField
              label="Full Name"
              value={fullName}
              onChange={setFullName}
              placeholder="Optional"
            />

            <AdminField
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="Optional"
            />

            <AdminField
              label="Phone"
              value={phone}
              onChange={setPhone}
              placeholder="Optional"
            />

            <AdminField
              label="Instagram"
              value={instagram}
              onChange={setInstagram}
              placeholder="@handle"
            />

            <AdminField
              label="Payment Handle"
              value={paymentHandle}
              onChange={setPaymentHandle}
              placeholder="Venmo / Cash App"
            />

            <AdminSelect
              label="Skill"
              value={skill}
              onChange={setSkill}
              options={skillOptions}
            />

            <AdminSelect
              label="Status"
              value={status}
              onChange={setStatus}
              options={statusOptions}
            />

            <div className="md:col-span-2">
              <AdminField
                label="Photo URL"
                value={photo}
                onChange={setPhoto}
                placeholder="Optional image URL"
              />
            </div>

            <button
              type="button"
              disabled={!canCreate}
              onClick={submit}
              className="rtt-cta md:col-span-2 disabled:opacity-50"
            >
              {busy ? "Creating..." : "Create Player"}
            </button>
          </div>
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