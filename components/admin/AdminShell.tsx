"use client";

import Link from "next/link";
import { clearSession } from "@/lib/auth";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

const adminLinks = [
  ["/admin/dashboard", "Dashboard"],
  ["/admin/control", "Control"],
  ["/admin/matches", "Scoring"],
  ["/admin/create-match", "New Battle"],
  ["/admin/create-player", "New Player"],
  ["/admin/users", "Users"],
  ["/admin/setup", "Setup"],
  ["/admin/health", "Health"],
  ["/admin/onboarding", "Training"],
  ["/live", "Public Live"],
];

export function AdminShell({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-black pb-24 text-white">
      <header className="border-b border-white/10 bg-black/90 px-5 py-4">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <div>
            <p className="rtt-kicker">Super Admin</p>
            <h1 className="text-2xl font-black italic uppercase">RTT Control Room</h1>
          </div>

          <nav className="flex flex-wrap gap-2 text-xs font-black uppercase tracking-[0.14em]">
            {adminLinks.map(([href, label]) => (
              <Link key={href} href={href} className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                {label}
              </Link>
            ))}
            <button
              onClick={() => {
                clearSession();
                router.push("/login");
              }}
              className="rounded-full bg-rtt-red px-4 py-2"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-8">{children}</section>
    </main>
  );
}
