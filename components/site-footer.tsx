import Link from "next/link";
import type { WeatherData } from "@/lib/weather-data";

const MOBI_SITE_URL =
  "https://agenciamobi.com.br/?utm_source=tempopelotas&utm_medium=footer&utm_campaign=portal_tempo_pelotas";

const footerGroups = [
  {
    title: "Previsão do tempo",
    links: [
      { label: "Tempo agora", href: "/" },
      { label: "Previsão para hoje", href: "/tempo-hoje-pelotas" },
      { label: "Próximos 7 dias", href: "/previsao-7-dias-pelotas" },
      { label: "Chuva em Pelotas", href: "/chuva-em-pelotas" },
      { label: "Vento em Pelotas", href: "/vento-em-pelotas" },
    ],
  },
  {
    title: "Águas e região",
    links: [
      { label: "Situação hidrológica", href: "/situacao-hidrologica-pelotas" },
      { label: "Nível da Lagoa dos Patos", href: "/nivel-da-lagoa-dos-patos-laranjal" },
      { label: "Estação Embrapa", href: "/estacao-embrapa-pelotas" },
      { label: "Condições de atenção", href: "/alertas" },
    ],
  },
  {
    title: "Dados e recursos",
    links: [
      { label: "Histórico climático", href: "/historico-climatico-pelotas" },
      { label: "Câmeras ao vivo", href: "/cameras-ao-vivo-pelotas" },
      { label: "Metodologia e fontes", href: "/metodologia" },
      { label: "Dados em JSON", href: "/pelotas.json" },
    ],
  },
] as const;

type SiteFooterProps = {
  source: WeatherData["source"];
};

export function SiteFooter({ source }: SiteFooterProps) {
  const currentYear = new Date().getFullYear();
  const sourceStatus = source.isFallback ? "Modo de contingência" : "Dados meteorológicos ativos";

  return (
    <footer className="site-footer">
      <div className="portal-footer">
        <div className="portal-footer-orb portal-footer-orb--one" aria-hidden="true" />
        <div className="portal-footer-orb portal-footer-orb--two" aria-hidden="true" />

        <section className="portal-footer-intro" aria-labelledby="portal-footer-title">
          <Link className="portal-footer-brand" href="/" aria-label="TEMPO Pelotas — página inicial">
            <img
              className="portal-footer-logo"
              src="/brand/mobi-tempo-pelotas-footer"
              alt="MOBI Tempo Pelotas"
              width={7418}
              height={2934}
              loading="lazy"
              draggable={false}
            />
          </Link>

          <div className="portal-footer-heading">
            <span>Tempo · Águas · Alertas</span>
            <h2 id="portal-footer-title">Informação local para decisões mais seguras.</h2>
            <p>
              Uma plataforma dedicada a acompanhar o tempo e a situação das águas em Pelotas e na
              Zona Sul do Rio Grande do Sul.
            </p>
          </div>

          <div className={`portal-footer-status${source.isFallback ? " is-fallback" : ""}`}>
            <span className="portal-footer-status-dot" aria-hidden="true" />
            <div>
              <strong>{sourceStatus}</strong>
              <small>{source.name}</small>
            </div>
          </div>
        </section>

        <div className="portal-footer-divider" aria-hidden="true" />

        <div className="portal-footer-directory">
          <div className="portal-footer-links">
            {footerGroups.map((group) => (
              <nav className="portal-footer-column" aria-label={group.title} key={group.title}>
                <strong>{group.title}</strong>
                <ul>
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href}>{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          <aside className="portal-footer-highlight">
            <span>Acesso rápido</span>
            <h3>Acompanhe as mudanças que importam para Pelotas.</h3>
            <p>Consulte alertas, chuva, vento e níveis das águas em uma única plataforma.</p>
            <div className="portal-footer-actions">
              <Link className="portal-footer-primary-action" href="/alertas">
                Ver condições de atenção
                <span aria-hidden="true">→</span>
              </Link>
              <Link className="portal-footer-secondary-action" href="/situacao-hidrologica-pelotas">
                Situação das águas
              </Link>
            </div>
          </aside>
        </div>

        <div className="portal-footer-notice">
          <span aria-hidden="true">i</span>
          <p>
            As informações possuem caráter de apoio. Em situações de risco, acompanhe também os
            comunicados da Defesa Civil e dos órgãos oficiais.
          </p>
          <Link href="/metodologia">Entenda os dados</Link>
        </div>

        <div className="portal-footer-bottom">
          <p>© {currentYear} TEMPO Pelotas. Plataforma local de informação meteorológica.</p>
          <div>
            <Link href="/metodologia">Metodologia</Link>
            {source.url ? (
              <a href={source.url} target="_blank" rel="noreferrer">
                Fonte meteorológica
              </a>
            ) : null}
            <a href={MOBI_SITE_URL} target="_blank" rel="noreferrer">
              Desenvolvido pela MOBI ↗
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
