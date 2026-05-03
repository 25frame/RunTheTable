"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "rtt_onboarding_seen_v1";

export function OnboardingGate() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const seen = window.localStorage.getItem(STORAGE_KEY);

    if (!seen) {
      const timer = window.setTimeout(() => setShow(true), 900);
      return () => window.clearTimeout(timer);
    }
  }, []);

  function dismiss() {
    window.localStorage.setItem(STORAGE_KEY, "true");
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed inset-x-3 bottom-24 z-[80] mx-auto max-w-lg rounded-[2rem] border border-rtt-red/35 bg-black/90 p-4 text-white shadow-2xl shadow-red-950/40 backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-rtt-red">
            New here?
          </p>
          <h2 className="mt-1 text-2xl font-black italic uppercase tracking-[-0.06em]">
            Learn the table
          </h2>
          <p className="mt-1 text-xs font-semibold leading-5 text-white/55">
            See how to join, battle, climb the board, and use the live screen.
          </p>
        </div>

        <button
          onClick={dismiss}
          className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-black"
        >
          ×
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Link href="/onboarding" onClick={dismiss} className="rtt-cta">
          Start
        </Link>
        <button onClick={dismiss} className="rtt-secondary">
          Later
        </button>
      </div>
    </div>
  );
}
