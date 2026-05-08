"use client";

import Link from "next/link";
import { clearSession } from "@/lib/auth";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";

const adminLinks = [
  ["/admin/dashboard", "Dashboard"],
  ["/admin/control", "Control"],
  ["/admin/matches", "Scoring"],
  ["/admin/players", "Players"],
  ["/admin/create-match", "Match"],
  ["/admin/create-player", "Player"],
  ["/admin/users", "Users"],
  ["/admin/health", "Health"],
  ["/live", "Public"],
] as const;

export function AdminShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <main className="min-h-screen bg-black pb-28 text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 md:px-6 md:py-4">
          <button
            type="button"
            onClick={() => router.push("/admin/dashboard")}
            className="flex min-w-0 items-center gap-3 text-left"
            aria-label="Go to admin dashboard"
          >
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-[1rem] bg-rtt-red text-xl font-black italic md:h-12 md:w-12">
              <span className="-skew-x-12">R</span>
            </div>

            <div className="min-w-0">
              <p className="truncate text-lg font-black italic uppercase leading-none tracking-[-0.04em] md:text-2xl">
                RTT Admin
              </p>
              <p className="mt-1 hidden text-[9px] font-black uppercase tracking-[0.22em] text-white/40 sm:block">
                Control Room
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              clearSession();
              router.push("/login");
            }}
            className="shrink-0 rounded-full bg-rtt-red px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] md:px-5 md:py-3 md:text-xs"
          >
            Logout
          </button>
        </div>

        <nav className="mx-auto max-w-7xl overflow-x-auto border-t border-white/10 px-4 py-2 md:px-6">
          <div className="flex min-w-max gap-2">
            {adminLinks.map(([href, label]) => {
              const active =
                pathname === href ||
                (href !== "/live" && pathname.startsWith(href + "/"));

              return (
                <Link
                  key={href}
                  href={href}
                  className={
                    active
                      ? "rounded-full bg-rtt-red px-4 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-white"
                      : "rounded-full border border-white/10 bg-white/[0.045] px-4 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-white/55"
                  }
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      <section className="mx-auto w-full max-w-7xl px-4 py-5 md:px-6 md:py-8">
        {children}
      </section>
    </main>
  );
}