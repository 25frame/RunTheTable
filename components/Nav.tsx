"use client";

import { usePathname, useRouter } from "next/navigation";

export function Nav() {
  const router = useRouter();
  const pathname = usePathname();

  const items = [
    { label: "HOME", href: "/" },
    { label: "JOIN", href: "/join" },
    { label: "LIVE", href: "/live" },
    { label: "BOARD", href: "/standings" },
    { label: "CREW", href: "/players" },
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
                <span className="h-5 w-[2px] bg-white/20" />

                <span className="truncate text-[1.15rem] font-black italic uppercase leading-none tracking-[-0.03em] md:text-2xl">
                  RTT NYC
                </span>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => router.push("/join")}
            className="shrink-0 rounded-full bg-rtt-red px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] md:px-5 md:py-3 md:text-xs"
          >
            Join
          </button>
        </div>
      </header>

      <nav className="fixed bottom-3 left-3 right-3 z-50 md:bottom-4 md:left-4 md:right-4">
        <div className="mx-auto grid max-w-xl grid-cols-5 gap-1 rounded-[1.6rem] border border-white/10 bg-black/90 p-1.5 shadow-[0_0_30px_rgba(0,0,0,0.55)] backdrop-blur-xl md:gap-2 md:rounded-[2rem] md:p-2">
          {items.map((item) => {
            const active = pathname === item.href;

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