"use client";

import Link from "next/link";
import { clearSession } from "@/lib/auth";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";

const adminLinks = [
  ["/admin/dashboard", "Dashboard"],
  ["/admin/qr", "QR"],
  ["/admin/places", "Places"],
  ["/admin/config", "Config"],
  ["/admin/control", "Control"],
  ["/admin/matches", "Scoring"],
  ["/admin/players", "Players"],
  ["/admin/create-match", "Match"],
  ["/admin/create-player", "Player"],
  ["/admin/users", "Users"],
  ["/admin/health", "Health"],
  ["/admin/setup", "Setup"],
  ["/live", "Public"],
] as const;

export function AdminShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 md:px-6 md:py-4">
          <button
            type="button"
            onClick={() => router.push("/admin/dashboard")}
            className="flex min-w-0 items-center gap-3 text-left"
            aria-label="Go to admin dashboard"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[1rem] bg-rtt-red text-xl font-black italic md:h-14 md:w-14 md:rounded-2xl md:text-2xl">
              <span className="-skew-x-12">R</span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="h-5 w-[2px] bg-white/20" />

                <span className="truncate text-[1.15rem] font-black italic uppercase leading-none tracking-[-0.03em] md:text-2xl">
                  Admin
                </span>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              clearSession();
              router.push("/login");
            }}
            className="shrink-0 rounded-full bg-rtt-red px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-white md:px-5 md:py-3 md:text-xs"
          >
            Logout
          </button>
        </div>

        <nav className="border-t border-white/10">
          <div className="mx-auto max-w-7xl overflow-x-auto px-4 py-2 md:px-6">
            <div className="flex min-w-max gap-2">
              {adminLinks.map(([href, label]) => {
                const active =
                  pathname === href ||
                  (href !== "/live" && pathname.startsWith(`${href}/`));

                return (
                  <Link
                    key={href}
                    href={href}
                    className={
                      active
                        ? "rounded-full bg-rtt-red px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.14em] text-white"
                        : "rounded-full border border-white/10 bg-white/[0.045] px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.14em] text-white/55 transition hover:text-white"
                    }
                  >
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      </header>

      <section className="mx-auto w-full max-w-7xl px-4 py-5 pb-10 md:px-6 md:py-8">
        {children}
      </section>
    </main>
  );
}