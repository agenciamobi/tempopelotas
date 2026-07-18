const navItems = [
  { label: "Agora", href: "#agora" },
  { label: "Próximas horas", href: "#horas" },
  { label: "7 dias", href: "#semana" },
  { label: "Região", href: "#regiao" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="brand" href="#agora" aria-label="TEMPO Pelotas — página inicial">
        <span className="brand-symbol" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span className="brand-copy">
          <strong>TEMPO</strong>
          <small>Pelotas</small>
        </span>
      </a>

      <nav className="main-nav" aria-label="Navegação principal">
        {navItems.map((item) => (
          <a href={item.href} key={item.href}>
            {item.label}
          </a>
        ))}
      </nav>

      <a className="header-action" href="#alertas">
        <span className="header-action-dot" aria-hidden="true" />
        Alertas
      </a>
    </header>
  );
}
