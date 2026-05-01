"use client";

import Link from "next/link";
import { logout } from "@/lib/adminAuth";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

const adminLinks = [
  ["/admin/dashboard", "Dashboard"],
  ["/admin/matches", "Live Scoring"],
  ["/live", "Public Live"],
];

export function AdminShell({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10 bg-black/90 px-5 py-4">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-rtt-red">Private Admin</p>
            <h1 className="text-2xl font-black italic uppercase">RTT Control Room</h1>
          </div>
          <nav className="flex flex-wrap gap-2 text-xs font-black uppercase tracking-[0.14em]">
            {adminLinks.map(([href, label]) => (
              <Link key={href} href={href} className="rounded-full border border-white/10 bg-white/5 px-4 py-2">{label}</Link>
            ))}
            <button onClick={() => { logout(); router.push("/admin/login"); }} className="rounded-full bg-rtt-red px-4 py-2">Logout</button>
          </nav>
        </div>
      </header>
      <section className="mx-auto max-w-7xl px-5 py-8">{children}</section>
    </main>
  );
}
