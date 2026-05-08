"use client";

import { getCurrentUser } from "@/lib/auth";
import { cfg } from "@/lib/siteConfig";
import type { RTTConfig, RTTData } from "@/lib/googleData";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function Nav() {
  const router = useRouter();
  const pathname = usePathname();

  const [isAdmin, setIsAdmin] = useState(false);
  const [config, setConfig] = useState<RTTConfig>({});

  useEffect(() => {
    const user = getCurrentUser();
    setIsAdmin(user?.role === "admin");
  }, [pathname]);

  useEffect(() => {
    loadConfig();
  }, []);

  async function loadConfig() {
    try {
      const response = await fetch("/api/rtt", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) return;

      const data = (await response.json()) as RTTData;
      setConfig(data.config || {});
    } catch {
      setConfig({});
    }
  }

  // Admin pages use AdminShell, so do not show the public header or bottom nav there.
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const siteShortName = cfg(config, "site.shortName", "RTT NYC");
  const siteTagline = cfg(
    config,
    "site.tagline",
    "NYC Street Table Tennis"
  );

  const loginHref = isAdmin ? "/admin/dashboard" : "/login";
  const loginLabel = isAdmin
    ? cfg(config, "nav.admin", "ADMIN")
    : cfg(config, "nav.login", "LOGIN");

  const items = [
    { label: cfg(config, "nav.home", "HOME"), href: "/" },
    { label: cfg(config, "nav.join", "JOIN"), href: "/join" },
    { label: cfg(config, "nav.live", "LIVE"), href: "/live" },
    { label: cfg(config, "nav.board", "BOARD"), href: "/standings" },
    { label: loginLabel, href: loginHref },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 md:px-6 md:py-4">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex min-w-0 items-center gap-3 text-left"
            aria-label="Go to home"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[1rem] bg-rtt-red text-xl font-black italic md:h-14 md:w-14 md:rounded-2xl md:text-2xl">
              <span className="-skew-x-12">R</span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="h-8 w-[2px] shrink-0 bg-white/20" />

                <div className="min-w-0">
                  <span className="block truncate text-[1.15rem] font-black italic uppercase leading-none tracking-[-0.03em] md:text-2xl">
                    {siteShortName}
                  </span>

                  <span className="mt-1 block max-w-[170px] truncate text-[8px] font-black uppercase tracking-[0.18em] text-white/35 sm:max-w-none md:text-[9px]">
                    {siteTagline}
                  </span>
                </div>
              </div>
            </div>
          </button>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => router.push(loginHref)}
              className="rounded-full border border-white/10 bg-white/[0.055] px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-white/70 md:px-5 md:py-3 md:text-xs"
            >
              {loginLabel}
            </button>

            <button
              type="button"
              onClick={() => router.push("/join")}
              className="rounded-full bg-rtt-red px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-white md:px-5 md:py-3 md:text-xs"
            >
              {cfg(config, "nav.joinButton", "Join")}
            </button>
          </div>
        </div>
      </header>

      <nav className="fixed bottom-3 left-3 right-3 z-50 md:bottom-4 md:left-4 md:right-4">
        <div className="mx-auto grid max-w-xl grid-cols-5 gap-1 rounded-[1.6rem] border border-white/10 bg-black/90 p-1.5 shadow-[0_0_30px_rgba(0,0,0,0.55)] backdrop-blur-xl md:gap-2 md:rounded-[2rem] md:p-2">
          {items.map((item) => {
            const active =
              pathname === item.href ||
              (item.href === "/admin/dashboard" &&
                pathname.startsWith("/admin"));

            return (
              <button
                key={item.href}
                type="button"
                onClick={() => router.push(item.href)}
                className={
                  active
                    ? "rounded-[1.25rem] bg-rtt-red px-2 py-3 text-[10px] font-black uppercase tracking-[0.1em] text-white md:rounded-2xl md:px-3 md:py-4 md:text-xs"
                    : "rounded-[1.25rem] px-2 py-3 text-[10px] font-black uppercase tracking-[0.1em] text-white/55 transition hover:text-white md:rounded-2xl md:px-3 md:py-4 md:text-xs"
                }
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}