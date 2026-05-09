"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect, useMemo, useState } from "react";

type SkinConfig = Record<string, unknown>;

type RTTSkinShellProps = {
  children: ReactNode;
  config?: SkinConfig;
  activeHref?: string;
  headerTitle?: string;
  statusLabel?: string;
  showBack?: boolean;
};

function text(config: SkinConfig | undefined, key: string, fallback: string): string {
  const value = config?.[key];
  if (typeof value === "string" && value.trim()) return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return fallback;
}

function navActive(pathname: string, href: string, activeHref?: string) {
  const active = activeHref || pathname;
  if (href === "/") return active === "/";
  if (href === "/join") return active.startsWith("/join") || active.startsWith("/park");
  return active.startsWith(href);
}

function Icon({ name }: { name: "home" | "battle" | "qr" | "board" | "profile" }) {
  if (name === "home") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 11.4 12 4l8 7.4v8.1a1.1 1.1 0 0 1-1.1 1.1h-4.2v-5.7H9.3v5.7H5.1A1.1 1.1 0 0 1 4 19.5Z" fill="currentColor" />
      </svg>
    );
  }

  if (name === "battle") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 6.5h9.6a3.4 3.4 0 0 1 0 6.8H10l-1.3 4.2H5.9l1.3-4.2H5Zm10 1.9H7.3v3h7.7a1.5 1.5 0 0 0 0-3Zm-.6 8.5h5.9v2.2h-5.9Z" fill="currentColor" />
      </svg>
    );
  }

  if (name === "qr") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 4h7v7H4Zm2 2v3h3V6Zm7-2h7v7h-7Zm2 2v3h3V6ZM4 13h7v7H4Zm2 2v3h3v-3Zm8-2h2.2v2.2H14Zm4.1 0H20v3.8h-3.8v-1.9h1.9Zm-4.1 4.1h2.2V20H14Zm3.2 1h2.8V20h-2.8Z" fill="currentColor" />
      </svg>
    );
  }

  if (name === "board") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 4h14v3H5Zm0 5h14v3H5Zm0 5h14v3H5Zm0 5h10v2H5Z" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 12.2a4.2 4.2 0 1 0 0-8.4 4.2 4.2 0 0 0 0 8.4Zm-7.2 8.3a7.2 7.2 0 0 1 14.4 0Z" fill="currentColor" />
    </svg>
  );
}

export function RTTSkinShell({
  children,
  config = {},
  activeHref,
  headerTitle,
  statusLabel,
  showBack = true,
}: RTTSkinShellProps) {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const [profileHref, setProfileHref] = useState("/login");
  const [profileLabel, setProfileLabel] = useState(text(config, "nav.login", "PROFILE"));

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("rtt_user");
      const user = stored ? JSON.parse(stored) : null;
      if (user?.role === "admin") {
        setProfileHref("/admin/dashboard");
        setProfileLabel(text(config, "nav.admin", "ADMIN"));
      } else {
        setProfileHref("/login");
        setProfileLabel(text(config, "nav.profile", text(config, "nav.login", "PROFILE")));
      }
    } catch {
      setProfileHref("/login");
      setProfileLabel(text(config, "nav.profile", text(config, "nav.login", "PROFILE")));
    }
  }, [config]);

  const items = useMemo(
    () => [
      { href: "/", label: text(config, "nav.home", "HOME"), icon: "home" as const },
      { href: "/live", label: text(config, "nav.battles", text(config, "nav.live", "BATTLES")), icon: "battle" as const },
      { href: "/join", label: text(config, "nav.checkIn", text(config, "nav.join", "CHECK-IN")), icon: "qr" as const, center: true },
      { href: "/standings", label: text(config, "nav.theBoard", text(config, "nav.board", "THE BOARD")), icon: "board" as const },
      { href: profileHref, label: profileLabel, icon: "profile" as const },
    ],
    [config, profileHref, profileLabel]
  );

  return (
    <div className="rttb-stage" data-rtt-skin="battle-black">
      <div className="rttb-frame">
        <div className="rttb-background" aria-hidden="true" />
        <div className="rttb-content">
          <header className="rttb-header" aria-label="Run The Table skin header">
            <div className="rttb-header-inner">
              {showBack ? (
                <button type="button" className="rttb-icon-button" onClick={() => router.back()} aria-label="Go back">
                  ←
                </button>
              ) : (
                <Link className="rttb-icon-button" href="/" aria-label="Go home">
                  <img src="/assets/skins/rtt/rtt-crown.svg" alt="" aria-hidden="true" width="18" height="18" />
                </Link>
              )}

              <div className="rttb-header-title">
                {headerTitle || text(config, "skin.headerTitle", "JOIN THE MOVEMENT")}
              </div>

              <span className="rttb-live-pill">
                <span className="rttb-status-dot" aria-hidden="true" />
                {statusLabel || text(config, "nav.status", "LIVE")}
              </span>
            </div>
          </header>

          <main className="rttb-main">{children}</main>

          <nav className="rttb-bottom-nav" aria-label="RTT primary navigation">
            <div className="rttb-bottom-nav-inner">
              {items.map((item) => {
                const active = navActive(pathname, item.href, activeHref);
                const className = item.center
                  ? `rttb-nav-center${active ? " is-active" : ""}`
                  : `rttb-nav-item${active ? " is-active" : ""}`;

                return (
                  <Link key={item.href} href={item.href} className={className} aria-current={active ? "page" : undefined}>
                    <Icon name={item.icon} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
