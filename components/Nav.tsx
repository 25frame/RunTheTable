import Link from "next/link";

const links = [["/play","Play"],["/live","Live"],["/standings","Standings"],["/results","Results"],["/players","Players"],["/rules","Rules"],["/login","Login"]];

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-5 md:py-4">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <img src="/rtt-logo.svg" alt="RTT NYC" className="h-11 w-11 shrink-0 rounded-2xl md:h-12 md:w-12" />
          <div className="min-w-0 leading-none">
            <div className="truncate text-xl font-black italic tracking-tight text-white md:text-2xl">RTT NYC</div>
            <div className="truncate text-[10px] font-bold uppercase tracking-[0.26em] text-white/45 md:text-[11px] md:tracking-[0.32em]">Run The Table</div>
          </div>
        </Link>
        <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 text-xs font-black uppercase tracking-[0.12em] text-white/65 md:flex">
          {links.map(([href,label]) => <Link key={href} href={href} className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-white">{label}</Link>)}
        </nav>
      </div>
      <nav className="flex gap-2 overflow-x-auto border-t border-white/10 px-4 py-3 text-[11px] font-black uppercase tracking-[0.14em] text-white/70 md:hidden">
        {links.map(([href,label]) => <Link key={href} href={href} className="shrink-0 rounded-full border border-white/10 bg-white/5 px-4 py-2">{label}</Link>)}
      </nav>
    </header>
  );
}
