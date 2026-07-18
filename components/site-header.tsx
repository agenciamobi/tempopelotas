"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavigationIconName = "home" | "today" | "week" | "rain" | "camera" | "alert";

type NavigationItem = {
  label: string;
  href: string;
  icon: NavigationIconName;
};

const desktopNavItems: NavigationItem[] = [
  { label: "Agora", href: "/", icon: "home" },
  { label: "Hoje", href: "/tempo-hoje-pelotas", icon: "today" },
  { label: "7 dias", href: "/previsao-7-dias-pelotas", icon: "week" },
  { label: "Chuva", href: "/chuva-em-pelotas", icon: "rain" },
  { label: "Câmeras", href: "/cameras-ao-vivo-pelotas", icon: "camera" },
];

const mobileNavItems: NavigationItem[] = [
  { label: "Agora", href: "/", icon: "home" },
  { label: "Hoje", href: "/tempo-hoje-pelotas", icon: "today" },
  { label: "7 dias", href: "/previsao-7-dias-pelotas", icon: "week" },
  { label: "Chuva", href: "/chuva-em-pelotas", icon: "rain" },
  { label: "Alertas", href: "/alertas", icon: "alert" },
];

function NavigationIcon({ name }: { name: NavigationIconName }) {
  if (name === "home") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m3.5 10.5 8.5-7 8.5 7v9a1.5 1.5 0 0 1-1.5 1.5H5a1.5 1.5 0 0 1-1.5-1.5v-9Z" />
        <path d="M9 21v-7h6v7" />
      </svg>
    );
  }

  if (name === "today") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2.2M12 19.8V22M2 12h2.2M19.8 12H22M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M19.1 4.9l-1.6 1.6M6.5 17.5l-1.6 1.6" />
      </svg>
    );
  }

  if (name === "week") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="5" width="18" height="16" rx="3" />
        <path d="M8 3v4M16 3v4M3 10h18M7.5 14h2M11 14h2M14.5 14h2M7.5 17.5h2M11 17.5h2M14.5 17.5h2" />
      </svg>
    );
  }

  if (name === "rain") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6.5 15.5h10a4 4 0 0 0 .5-8 5.5 5.5 0 0 0-10.4 1.7 3.2 3.2 0 0 0-.1 6.3Z" />
        <path d="m8 18-1 2M12 18l-1 2M16 18l-1 2" />
      </svg>
    );
  }

  if (name === "camera") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="6" width="14" height="12" rx="3" />
        <path d="m17 10 4-2v8l-4-2M7.5 4.5h5" />
        <circle cx="10" cy="12" r="2.7" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3 2.8 19h18.4L12 3Z" />
      <path d="M12 9v4.8M12 17.2v.1" />
    </svg>
  );
}

function isActivePath(pathname: string, href: string) {
  return href === "/" ? pathname === href : pathname.startsWith(href);
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <>
      <header className="site-header">
        <Link className="brand" href="/" aria-label="TEMPO Pelotas — página inicial">
          <span className="brand-symbol" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className="brand-copy">
            <strong>TEMPO</strong>
            <small>Pelotas, RS</small>
          </span>
        </Link>

        <nav className="main-nav" aria-label="Navegação principal">
          {desktopNavItems.map((item) => {
            const isActive = isActivePath(pathname, item.href);

            return (
              <Link
                className={isActive ? "is-active" : undefined}
                href={item.href}
                key={item.href}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link
          className={`header-action ${isActivePath(pathname, "/alertas") ? "is-active" : ""}`}
          href="/alertas"
          aria-current={isActivePath(pathname, "/alertas") ? "page" : undefined}
          aria-label="Abrir alertas meteorológicos"
        >
          <span className="header-action-dot" aria-hidden="true" />
          <span className="header-action-icon" aria-hidden="true">
            <NavigationIcon name="alert" />
          </span>
          <span className="header-action-label">Alertas</span>
        </Link>
      </header>

      <nav className="mobile-tab-bar" aria-label="Navegação principal do aplicativo">
        {mobileNavItems.map((item) => {
          const isActive = isActivePath(pathname, item.href);

          return (
            <Link
              className={isActive ? "is-active" : undefined}
              href={item.href}
              key={item.href}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="mobile-tab-icon">
                <NavigationIcon name={item.icon} />
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
