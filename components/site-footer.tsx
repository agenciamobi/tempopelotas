import Link from "next/link";
import type { WeatherData } from "@/lib/weather-data";

const MOBI_SITE_URL =
  "https://agenciamobi.com.br/?utm_source=tempopelotas&utm_medium=banner&utm_campaign=sites_inteligentes";

type SiteFooterProps = {
  source: WeatherData["source"];
};

export function SiteFooter({ source: _source }: SiteFooterProps) {
  return (
    <footer className="site-footer">
      <nav className="footer-resource-links" aria-label="Informações do portal">
        <Link href="/estacao-embrapa-pelotas">Medições da Embrapa</Link>
        <Link href="/situacao-hidrologica-pelotas">Situação das águas</Link>
        <Link href="/nivel-da-lagoa-dos-patos-laranjal">Nível no Laranjal</Link>
        <Link href="/metodologia">De onde vêm as informações</Link>
      </nav>

      <a
        className="mobi-sites-banner"
        href={MOBI_SITE_URL}
        target="_blank"
        rel="noreferrer"
        aria-label="Conheça o serviço de desenvolvimento de sites inteligentes da Agência MOBI"
      >
        <span className="mobi-ad-brand">
          <img
            className="mobi-ad-logo"
            src="/brand/mobi-tempo-pelotas-footer"
            alt=""
            width={7418}
            height={2934}
            loading="lazy"
            draggable={false}
          />
        </span>

        <span className="mobi-ad-message">
          <strong>Desenvolvimento de Sites Inteligentes</strong>
          <small>Estratégia, presença no Google e tecnologia para gerar resultados.</small>
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
