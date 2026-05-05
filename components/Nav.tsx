"use client";

import { usePathname, useRouter } from "next/navigation";

export function Nav() {
  const router = useRouter();
  const pathname = usePathname();

  const items = [
    { label: "HOME", href: "/" },
    { label: "LIVE", href: "/live" },
    { label: "BOARD", href: "/standings" },
    { label: "CREW", href: "/players" },
    { label: "RULES", href: "/rules" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-3 text-left"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rtt-red text-xl font-black italic">
              R
            </div>

            <div>
              <div className="text-2xl font-black italic uppercase leading-none">
                RUN THE TABLE
              </div>
              <div className="mt-1 text-xs font-black uppercase tracking-[0.25em] text-white/40">
                NYC Street Table Tennis
              </div>
            </div>
          </button>

          <button
            onClick={() => router.push("/live")}
            className="rounded-full bg-rtt-red px-5 py-3 text-xs font-black uppercase tracking-[0.18em]"
          >
            Live
          </button>
        </div>
      </header>

      <nav className="fixed bottom-4 left-4 right-4 z-50">
        <div className="mx-auto grid max-w-xl grid-cols-5 gap-2 rounded-[2rem] border border-white/10 bg-black/85 p-2 backdrop-blur-xl">
          {items.map((item) => {
            const active = pathname === item.href;

            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={
                  active
                    ? "rounded-2xl bg-rtt-red px-3 py-4 text-xs font-black uppercase tracking-[0.12em] text-white"
                    : "rounded-2xl px-3 py-4 text-xs font-black uppercase tracking-[0.12em] text-white/55"
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