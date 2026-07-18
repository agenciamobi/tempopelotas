import Link from "next/link";

const navItems = [
  { label: "Agora", href: "/" },
  { label: "Hoje", href: "/tempo-hoje-pelotas" },
  { label: "7 dias", href: "/previsao-7-dias-pelotas" },
  { label: "Chuva", href: "/chuva-em-pelotas" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="TEMPO Pelotas — página inicial">
        <span className="brand-symbol" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span className="brand-copy">
          <strong>TEMPO</strong>
          <small>Pelotas</small>
        </span>
      </Link>

      <nav className="main-nav" aria-label="Navegação principal">
        {navItems.map((item) => (
          <Link href={item.href} key={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>

      <Link className="header-action" href="/alertas">
        <span className="header-action-dot" aria-hidden="true" />
        Alertas
      </Link>
    </header>
  );
}
