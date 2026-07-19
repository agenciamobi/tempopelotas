import type { WeatherData } from "@/lib/weather-data";

type SiteFooterProps = {
  source: WeatherData["source"];
};

export function SiteFooter({ source: _source }: SiteFooterProps) {
  return (
    <footer className="site-footer">
      <p>
        Tempo Pelotas é um projeto do Ecossistema{" "}
        <a href="https://agenciamobi.com.br" target="_blank" rel="noreferrer">
          MOBI - Marketing Inteligente
        </a>
      </p>
    </footer>
  );
}
