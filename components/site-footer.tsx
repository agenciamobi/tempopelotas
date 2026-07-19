import Link from "next/link";
import type { WeatherData } from "@/lib/weather-data";

const MOBI_SITE_URL =
  "https://agenciamobi.com.br/?utm_source=tempopelotas&utm_medium=banner&utm_campaign=sites_inteligentes";

type SiteFooterProps = {
  source: WeatherData["source"];
};

function MobiMark() {
  return (
    <span className="mobi-ad-mark" aria-hidden="true">
      <span>M</span>
      <span>O</span>
      <span>B</span>
      <span>I</span>
    </span>
  );
}

export function SiteFooter({ source: _source }: SiteFooterProps) {
  return (
    <footer className="site-footer">
      <nav className="footer-resource-links" aria-label="Transparência e recursos públicos">
        <Link href="/estacao-embrapa-pelotas">Estação Embrapa</Link>
        <Link href="/situacao-hidrologica-pelotas">Situação das águas</Link>
        <Link href="/metodologia">Metodologia e fontes</Link>
        <a href="/pelotas.json">Dados JSON</a>
        <a href="/feed">Feed público</a>
      </nav>

      <a
        className="mobi-sites-banner"
        href={MOBI_SITE_URL}
        target="_blank"
        rel="noreferrer"
        aria-label="Conheça o serviço de desenvolvimento de sites inteligentes da Agência MOBI"
      >
        <span className="mobi-ad-brand">
          <MobiMark />
          <span>
            <small>Marketing Inteligente</small>
            <strong>Sites que trabalham pelo seu negócio.</strong>
          </span>
        </span>

        <span className="mobi-ad-message">
          <strong>Desenvolvimento de Sites Inteligentes</strong>
          <small>Estratégia, SEO, performance e tecnologia para gerar resultados.</small>
        </span>

        <span className="mobi-ad-action">
          Conheça a MOBI
          <span aria-hidden="true">↗</span>
        </span>
      </a>

      <p>
        Tempo Pelotas é um projeto do Ecossistema{" "}
        <a href="https://agenciamobi.com.br" target="_blank" rel="noreferrer">
          MOBI - Marketing Inteligente
        </a>
      </p>
    </footer>
  );
}
