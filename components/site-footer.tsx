import Link from "next/link";
import type { WeatherData } from "@/lib/weather-data";

const MOBI_SITE_URL =
  "https://agenciamobi.com.br/?utm_source=tempopelotas&utm_medium=footer&utm_campaign=portal_tempo_pelotas";

const footerGroups = [
  {
    title: "Previsão",
    links: [
      { label: "Tempo agora", href: "/" },
      { label: "Previsão para hoje", href: "/tempo-hoje-pelotas" },
      { label: "Previsão para amanhã", href: "/tempo-amanha-pelotas" },
      { label: "Próximos 7 dias", href: "/previsao-7-dias-pelotas" },
      { label: "Chuva em Pelotas", href: "/chuva-em-pelotas" },
      { label: "Vento em Pelotas", href: "/vento-em-pelotas" },
    ],
  },
  {
    title: "Águas e alertas",
    links: [
      { label: "Situação hidrológica", href: "/situacao-hidrologica-pelotas" },
      { label: "Lagoa dos Patos no Laranjal", href: "/nivel-da-lagoa-dos-patos-laranjal" },
      { label: "Avisos meteorológicos", href: "/alertas" },
      { label: "Câmeras de Pelotas", href: "/cameras-ao-vivo-pelotas" },
    ],
  },
  {
    title: "Dados e transparência",
    links: [
      { label: "Clima em Pelotas", href: "/clima-em-pelotas" },
      { label: "Estação Embrapa", href: "/estacao-embrapa-pelotas" },
      { label: "Histórico climático", href: "/historico-climatico-pelotas" },
      { label: "Metodologia e fontes", href: "/metodologia" },
      { label: "Dados em JSON", href: "/pelotas.json" },
    ],
  },
] as const;

type SiteFooterProps = {
  source: WeatherData["source"];
};

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M14 7l5 5-5 5" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3 2 20h20L12 3Zm0 6v5m0 3v.01" />
    </svg>
  );
}

function WaterIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 9c2.2 0 2.2-1.5 4.5-1.5S9.8 9 12 9s2.2-1.5 4.5-1.5S18.8 9 21 9M3 14c2.2 0 2.2-1.5 4.5-1.5S9.8 14 12 14s2.2-1.5 4.5-1.5S18.8 14 21 14M3 19c2.2 0 2.2-1.5 4.5-1.5S9.8 19 12 19s2.2-1.5 4.5-1.5S18.8 19 21 19" />
    </svg>
  );
}

export function SiteFooter({ source }: SiteFooterProps) {
  const currentYear = new Date().getFullYear();
  const sourceStatus = source.isFallback ? "Operação em contingência" : "Fontes conectadas";
  const activeSources = Array.from(
    new Set(
      [source.observationName, source.forecastName, source.name]
        .filter((item): item is string => Boolean(item?.trim()))
        .map((item) => item.trim()),
    ),
  ).slice(0, 3);

  return (
    <footer className="site-footer-v3">
      <div className="editorial-footer">
        <div className="editorial-footer__brand-line" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>

        <section className="editorial-footer__lead" aria-labelledby="editorial-footer-title">
          <div className="editorial-footer__lead-copy">
            <Link className="editorial-footer__brand" href="/" aria-label="TEMPO Pelotas — página inicial">
              <img
                src="/brand/tempo-pelotas-header"
                alt="TEMPO Pelotas"
                width={900}
                height={180}
                loading="lazy"
                draggable={false}
              />
            </Link>

            <span className="editorial-footer__eyebrow">Tempo e águas de Pelotas</span>
            <h2 id="editorial-footer-title">
              Informação local para acompanhar o dia e agir com antecedência.
            </h2>
            <p>
              Previsão, medições locais, avisos oficiais e situação das águas reunidos em uma leitura direta
              para Pelotas e a Zona Sul do Rio Grande do Sul.
            </p>
          </div>

          <div className="editorial-footer__lead-aside">
            <div className={`editorial-footer__status${source.isFallback ? " is-fallback" : ""}`}>
              <span aria-hidden="true" />
              <div>
                <small>Estado dos dados</small>
                <strong>{sourceStatus}</strong>
              </div>
            </div>

            <div className="editorial-footer__actions">
              <Link className="editorial-footer__action editorial-footer__action--primary" href="/tempo-hoje-pelotas">
                Ver previsão de hoje
                <ArrowIcon />
              </Link>
              <Link className="editorial-footer__action" href="/alertas">
                Consultar avisos
              </Link>
            </div>
          </div>
        </section>

        <section className="editorial-footer__directory" aria-label="Navegação do portal">
          <div className="editorial-footer__groups">
            {footerGroups.map((group) => (
              <nav className="editorial-footer__group" aria-label={group.title} key={group.title}>
                <strong>{group.title}</strong>
                <ul>
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href}>
                        <span>{link.label}</span>
                        <ArrowIcon />
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          <aside className="editorial-footer__operational" aria-label="Acessos operacionais">
            <span className="editorial-footer__eyebrow">Acesso operacional</span>

            <Link className="editorial-footer__operational-link" href="/alertas">
              <span className="editorial-footer__operational-icon editorial-footer__operational-icon--alert">
                <AlertIcon />
              </span>
              <span>
                <small>Chuva, vento e temporais</small>
                <strong>Avisos meteorológicos</strong>
              </span>
              <ArrowIcon />
            </Link>

            <Link
              className="editorial-footer__operational-link"
              href="/nivel-da-lagoa-dos-patos-laranjal"
            >
              <span className="editorial-footer__operational-icon editorial-footer__operational-icon--water">
                <WaterIcon />
              </span>
              <span>
                <small>Painel público da UFPel</small>
                <strong>Lagoa dos Patos no Laranjal</strong>
              </span>
              <ArrowIcon />
            </Link>
          </aside>
        </section>

        <aside className="editorial-footer__mobi-banner" aria-label="Desenvolvimento de sites pela Agência MOBI">
          <div className="editorial-footer__mobi-mark" aria-hidden="true">
            <span>M</span>
            <span>O</span>
            <span>B</span>
            <span>I</span>
          </div>
          <div className="editorial-footer__mobi-copy">
            <small>Agência MOBI · Pelotas</small>
            <strong>Desenvolvimento de sites inteligentes.</strong>
            <p>Estratégia, tecnologia e presença digital para empresas que precisam crescer.</p>
          </div>
          <a href={MOBI_SITE_URL} target="_blank" rel="noreferrer">
            Conheça a MOBI
            <ArrowIcon />
          </a>
        </aside>

        <section className="editorial-footer__transparency" aria-label="Fontes e orientação de segurança">
          <div className="editorial-footer__sources">
            <span>Fontes meteorológicas em uso</span>
            <p>{activeSources.length ? activeSources.join(" · ") : "Fontes públicas meteorológicas"}</p>
          </div>

          <div className="editorial-footer__guidance">
            <span aria-hidden="true">i</span>
            <p>
              Em situações de risco, siga os comunicados da Defesa Civil, do INMET e das autoridades locais.
            </p>
          </div>

          <nav className="editorial-footer__legal" aria-label="Transparência e fontes">
            <Link href="/metodologia">Metodologia</Link>
            {source.url ? (
              <a href={source.url} target="_blank" rel="noreferrer">
                Fonte meteorológica
              </a>
            ) : null}
          </nav>
        </section>

        <div className="editorial-footer__base">
          <span>© {currentYear}</span>
          <p>
            Tempo Pelotas é um projeto do{" "}
            <a href={MOBI_SITE_URL} target="_blank" rel="noreferrer">
              Ecossistema MOBI - Marketing Inteligente
            </a>
          </p>
          <Link href="/metodologia">Fontes e limitações</Link>
        </div>
      </div>
    </footer>
  );
}
