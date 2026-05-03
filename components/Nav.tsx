import Link from "next/link";

const links = [
  ["/", "Home"],
  ["/live", "Live"],
  ["/standings", "Board"],
  ["/players", "Crew"],
  ["/login", "Login"],
];

export function Nav() {
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <img src="/rtt-logo.svg" alt="Run The Table" className="h-11 w-11 shrink-0 rounded-2xl" />
            <div className="min-w-0 leading-none">
              <div className="truncate text-xl font-black italic tracking-[-0.05em]">RUN THE TABLE</div>
              <div className="truncate text-[10px] font-black uppercase tracking-[0.25em] text-white/40">NYC Street Table Tennis</div>
            </div>
          </Link>

          <Link href="/live" className="rounded-full bg-rtt-red px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em]">
            Live
          </Link>
        </div>
      </header>

      <nav className="rtt-bottom-nav">
        {links.map(([href, label]) => (
          <Link key={href} href={href}>{label}</Link>
        ))}
      </nav>
    </>
  );
}
