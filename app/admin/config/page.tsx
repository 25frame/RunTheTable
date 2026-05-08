"use client";

import { AdminNotice } from "@/components/admin/AdminNotice";
import { AdminShell } from "@/components/admin/AdminShell";
import { updateSiteConfig } from "@/lib/adminControl";
import { getCurrentUser } from "@/lib/auth";
import type { RTTData } from "@/lib/googleData";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type ConfigField = {
  key: string;
  label: string;
  group: string;
  fallback: string;
  multiline?: boolean;
};

const CONFIG_FIELDS: ConfigField[] = [
  {
    key: "site.name",
    label: "Site Name",
    group: "Brand",
    fallback: "Run The Table",
  },
  {
    key: "site.shortName",
    label: "Short Name",
    group: "Brand",
    fallback: "RTT NYC",
  },
  {
    key: "site.tagline",
    label: "Tagline",
    group: "Brand",
    fallback: "NYC Street Table Tennis",
  },

  {
    key: "home.kicker",
    label: "Home Kicker",
    group: "Home",
    fallback: "RTT NYC",
  },
  {
    key: "home.title",
    label: "Home Title",
    group: "Home",
    fallback: "Run The Table",
  },
  {
    key: "home.subtitle",
    label: "Home Subtitle",
    group: "Home",
    fallback: "Scan in. Join the next battle. Get on the board.",
    multiline: true,
  },
  {
    key: "home.primaryCta",
    label: "Home Primary Button",
    group: "Home",
    fallback: "Scan In / Join",
  },
  {
    key: "home.secondaryCtaBoard",
    label: "Home Board Button",
    group: "Home",
    fallback: "View The Board",
  },
  {
    key: "home.secondaryCtaLive",
    label: "Home Live Button",
    group: "Home",
    fallback: "Watch Live",
  },
  {
    key: "home.livePlayersLabel",
    label: "Home Live Players Label",
    group: "Home",
    fallback: "Live Players",
  },
  {
    key: "home.topBoardTitle",
    label: "Home Top Board Title",
    group: "Home",
    fallback: "Top Board",
  },
  {
    key: "home.fullBoardLink",
    label: "Home Full Board Link",
    group: "Home",
    fallback: "Full Board",
  },
  {
    key: "home.emptyPlayers",
    label: "Home Empty Players Message",
    group: "Home",
    fallback: "No players loaded yet.",
  },
  {
    key: "home.joinReminderKicker",
    label: "Home Join Reminder Kicker",
    group: "Home",
    fallback: "At The Table?",
  },
  {
    key: "home.joinReminderTitle",
    label: "Home Join Reminder Title",
    group: "Home",
    fallback: "Get in the next battle.",
  },
  {
    key: "home.joinReminderText",
    label: "Home Join Reminder Text",
    group: "Home",
    fallback: "Scan the QR code at the table or join directly from here.",
    multiline: true,
  },
  {
    key: "home.joinReminderButton",
    label: "Home Join Reminder Button",
    group: "Home",
    fallback: "Join Next Battle",
  },

  {
    key: "park.kicker",
    label: "QR Page Kicker",
    group: "QR / Park",
    fallback: "Scan In",
  },
  {
    key: "park.title",
    label: "QR Page Title",
    group: "QR / Park",
    fallback: "Table Check",
  },
  {
    key: "park.subtitle",
    label: "QR Page Subtitle",
    group: "QR / Park",
    fallback: "You found the table. Join the next battle and get added to the board.",
    multiline: true,
  },
  {
    key: "park.primaryCta",
    label: "QR Page Primary Button",
    group: "QR / Park",
    fallback: "Join Next Battle",
  },
  {
    key: "park.secondaryCtaBoard",
    label: "QR Page Board Button",
    group: "QR / Park",
    fallback: "View The Board",
  },
  {
    key: "park.secondaryCtaLive",
    label: "QR Page Live Button",
    group: "QR / Park",
    fallback: "Watch Live",
  },
  {
    key: "park.howItWorksKicker",
    label: "QR How It Works Kicker",
    group: "QR / Park",
    fallback: "How It Works",
  },
  {
    key: "park.step1Title",
    label: "QR Step 1 Title",
    group: "QR / Park",
    fallback: "Join",
  },
  {
    key: "park.step1Text",
    label: "QR Step 1 Text",
    group: "QR / Park",
    fallback: "Add your name and contact info.",
    multiline: true,
  },
  {
    key: "park.step2Title",
    label: "QR Step 2 Title",
    group: "QR / Park",
    fallback: "Play",
  },
  {
    key: "park.step2Text",
    label: "QR Step 2 Text",
    group: "QR / Park",
    fallback: "Admin assigns you to a battle.",
    multiline: true,
  },
  {
    key: "park.step3Title",
    label: "QR Step 3 Title",
    group: "QR / Park",
    fallback: "Climb",
  },
  {
    key: "park.step3Text",
    label: "QR Step 3 Text",
    group: "QR / Park",
    fallback: "Verified results update the board.",
    multiline: true,
  },

  {
    key: "join.kicker",
    label: "Join Kicker",
    group: "Join",
    fallback: "Join",
  },
  {
    key: "join.title",
    label: "Join Title",
    group: "Join",
    fallback: "Get On The Board",
  },
  {
    key: "join.subtitle",
    label: "Join Subtitle",
    group: "Join",
    fallback: "Enter your info, upload a player photo, and get ranked.",
    multiline: true,
  },
  {
    key: "join.submitButton",
    label: "Join Submit Button",
    group: "Join",
    fallback: "Join RTT",
  },
  {
    key: "join.successKicker",
    label: "Join Success Kicker",
    group: "Join",
    fallback: "You’re In",
  },
  {
    key: "join.successHeroTitle",
    label: "Join Success Hero Title",
    group: "Join",
    fallback: "Welcome To RTT",
  },
  {
    key: "join.successHeroSubtitle",
    label: "Join Success Hero Subtitle",
    group: "Join",
    fallback: "You are on the board. Admin can now assign you to a battle.",
    multiline: true,
  },
  {
    key: "join.successTitle",
    label: "Join Success Card Title",
    group: "Join",
    fallback: "Added to the board.",
  },
  {
    key: "join.successSubtitle",
    label: "Join Success Card Subtitle",
    group: "Join",
    fallback: "Admin can now assign you to a battle.",
    multiline: true,
  },
  {
    key: "join.watchLiveButton",
    label: "Join Watch Live Button",
    group: "Join",
    fallback: "Watch Live",
  },
  {
    key: "join.viewBoardButton",
    label: "Join View Board Button",
    group: "Join",
    fallback: "View Board",
  },

  {
    key: "nav.home",
    label: "Nav Home",
    group: "Navigation",
    fallback: "HOME",
  },
  {
    key: "nav.join",
    label: "Nav Join",
    group: "Navigation",
    fallback: "JOIN",
  },
  {
    key: "nav.live",
    label: "Nav Live",
    group: "Navigation",
    fallback: "LIVE",
  },
  {
    key: "nav.board",
    label: "Nav Board",
    group: "Navigation",
    fallback: "BOARD",
  },
  {
    key: "nav.login",
    label: "Nav Login",
    group: "Navigation",
    fallback: "LOGIN",
  },
  {
    key: "nav.admin",
    label: "Nav Admin",
    group: "Navigation",
    fallback: "ADMIN",
  },
  {
    key: "nav.joinButton",
    label: "Header Join Button",
    group: "Navigation",
    fallback: "Join",
  },

  {
    key: "standings.kicker",
    label: "Standings Kicker",
    group: "Standings",
    fallback: "Board",
  },
  {
    key: "standings.title",
    label: "Standings Title",
    group: "Standings",
    fallback: "The Board",
  },
  {
    key: "standings.subtitle",
    label: "Standings Subtitle",
    group: "Standings",
    fallback: "Rankings update after verified battles.",
    multiline: true,
  },
  {
    key: "standings.empty",
    label: "Standings Empty State",
    group: "Standings",
    fallback: "No standings loaded.",
  },

  {
    key: "live.kicker",
    label: "Live Kicker",
    group: "Live",
    fallback: "Live",
  },
  {
    key: "live.title",
    label: "Live Title",
    group: "Live",
    fallback: "Watch Live",
  },
  {
    key: "live.subtitle",
    label: "Live Subtitle",
    group: "Live",
    fallback: "Follow the current table and recent battles.",
    multiline: true,
  },

  {
    key: "results.kicker",
    label: "Results Kicker",
    group: "Results",
    fallback: "Battle History",
  },
  {
    key: "results.title",
    label: "Results Title",
    group: "Results",
    fallback: "Results",
  },
  {
    key: "results.subtitle",
    label: "Results Subtitle",
    group: "Results",
    fallback: "Receipts stay on the board.",
    multiline: true,
  },

  {
    key: "play.kicker",
    label: "Play Kicker",
    group: "Play",
    fallback: "Next Battle",
  },
  {
    key: "play.title",
    label: "Play Title",
    group: "Play",
    fallback: "Show Up",
  },
  {
    key: "play.subtitle",
    label: "Play Subtitle",
    group: "Play",
    fallback: "Join the next battle, get added to the board, and play tracked matches.",
    multiline: true,
  },

  {
    key: "scoring.ruleText",
    label: "Scoring Rule Text",
    group: "Scoring",
    fallback: "Game to 11 / Win by 2",
  },
];

async function fetchRTTData(): Promise<RTTData> {
  const response = await fetch("/api/rtt", {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to load site config: HTTP ${response.status}`);
  }

  return (await response.json()) as RTTData;
}

export default function AdminConfigPage() {
  const router = useRouter();

  const [values, setValues] = useState<Record<string, string>>({});
  const [activeGroup, setActiveGroup] = useState("Brand");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const groups = useMemo(() => {
    return Array.from(new Set(CONFIG_FIELDS.map((field) => field.group)));
  }, []);

  const visibleFields = CONFIG_FIELDS.filter(
    (field) => field.group === activeGroup
  );

  useEffect(() => {
    const user = getCurrentUser();

    if (!user || user.role !== "admin") {
      router.push("/login");
      return;
    }

    loadConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  async function loadConfig() {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const data = await fetchRTTData();
      const config = data.config || {};

      const nextValues: Record<string, string> = {};

      CONFIG_FIELDS.forEach((field) => {
        nextValues[field.key] = config[field.key] || field.fallback;
      });

      setValues(nextValues);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load config.");
    } finally {
      setLoading(false);
    }
  }

  function updateValue(key: string, value: string) {
    setValues((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function saveConfig() {
    setBusy(true);
    setError("");
    setMessage("");

    try {
      await updateSiteConfig({
        updates: values,
      });

      setMessage("Configuration saved.");
      await loadConfig();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save configuration."
      );
    } finally {
      setBusy(false);
    }
  }

  function resetGroupToDefaults() {
    setValues((current) => {
      const next = { ...current };

      visibleFields.forEach((field) => {
        next[field.key] = field.fallback;
      });

      return next;
    });
  }

  return (
    <AdminShell>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="rtt-mini-kicker">System Language</p>

          <h1 className="mt-2 text-4xl font-black italic uppercase tracking-[-0.06em] md:text-6xl">
            Config
          </h1>
        </div>

        <button
          type="button"
          onClick={() => router.push("/")}
          className="shrink-0 rounded-full border border-white/10 bg-white/[0.055] px-4 py-3 text-[10px] font-black uppercase tracking-[0.16em] text-white/70 md:px-5 md:text-xs"
        >
          Preview
        </button>
      </div>

      <div className="mt-5">
        <AdminNotice title="Basic Configuration">
          Change public wording, headers, subtitles, navigation labels, and
          basic system language without editing code.
        </AdminNotice>
      </div>

      {error ? (
        <div className="mt-5 rounded-[1.5rem] border border-red-500/30 bg-red-950/30 p-4 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      {message ? (
        <div className="mt-5 rounded-[1.5rem] border border-green-500/30 bg-green-950/30 p-4 text-sm text-green-200">
          {message}
        </div>
      ) : null}

      <section className="mt-6 grid gap-4 lg:grid-cols-[0.75fr_1.25fr]">
        <aside className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-4 md:rounded-[2rem] md:p-5">
          <p className="rtt-mini-kicker">Groups</p>

          <div className="mt-4 grid gap-2">
            {groups.map((group) => {
              const active = activeGroup === group;

              return (
                <button
                  key={group}
                  type="button"
                  onClick={() => setActiveGroup(group)}
                  className={
                    active
                      ? "rounded-2xl bg-rtt-red px-4 py-3 text-left text-sm font-black uppercase tracking-[0.12em]"
                      : "rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-left text-sm font-black uppercase tracking-[0.12em] text-white/55"
                  }
                >
                  {group}
                </button>
              );
            })}
          </div>

          <div className="mt-5 grid gap-3">
            <button
              type="button"
              onClick={saveConfig}
              disabled={busy || loading}
              className="rtt-cta disabled:opacity-50"
            >
              {busy ? "Saving..." : "Save Configuration"}
            </button>

            <button
              type="button"
              onClick={resetGroupToDefaults}
              disabled={busy || loading}
              className="rtt-secondary disabled:opacity-50"
            >
              Reset This Group
            </button>

            <button
              type="button"
              onClick={loadConfig}
              disabled={busy || loading}
              className="rtt-secondary disabled:opacity-50"
            >
              {loading ? "Loading..." : "Reload"}
            </button>
          </div>
        </aside>

        <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-4 md:rounded-[2rem] md:p-5">
          <div className="mb-5">
            <p className="rtt-mini-kicker">{activeGroup}</p>

            <h2 className="mt-1 text-2xl font-black uppercase tracking-[-0.04em]">
              Wording
            </h2>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-black/40 p-5 text-sm text-white/50">
              Loading configuration...
            </div>
          ) : (
            <div className="grid gap-4">
              {visibleFields.map((field) => (
                <ConfigInput
                  key={field.key}
                  field={field}
                  value={values[field.key] || ""}
                  onChange={(value) => updateValue(field.key, value)}
                />
              ))}
            </div>
          )}
        </section>
      </section>
    </AdminShell>
  );
}

function ConfigInput({
  field,
  value,
  onChange,
}: {
  field: ConfigField;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block rounded-2xl border border-white/10 bg-black/40 p-4">
      <span className="block text-[10px] font-black uppercase tracking-[0.18em] text-white/40">
        {field.label}
      </span>

      <span className="mt-1 block break-all text-[10px] font-bold text-rtt-red/80">
        {field.key}
      </span>

      {field.multiline ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="mt-3 min-h-28 w-full rounded-2xl border border-white/10 bg-black px-4 py-4 text-sm font-bold leading-6 text-white outline-none focus:border-rtt-red"
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="mt-3 w-full rounded-2xl border border-white/10 bg-black px-4 py-4 text-sm font-bold text-white outline-none focus:border-rtt-red"
        />
      )}
    </label>
  );
}