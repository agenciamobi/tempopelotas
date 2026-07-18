import type { WeatherData } from "@/lib/weather-data";

type SiteFooterProps = {
  source: WeatherData["source"];
};

export function SiteFooter({ source }: SiteFooterProps) {
  return (
    <footer className="site-footer">
      <div>
        <strong>TEMPO Pelotas</strong>
        <p>Informação meteorológica local, clara e acessível.</p>
      </div>
      <p>
        Fonte meteorológica: {source.url ? (
          <a href={source.url} target="_blank" rel="noreferrer">
            {source.name}
          </a>
        ) : source.name}
        {source.isFallback
          ? ". A integração externa está temporariamente indisponível e o sistema exibiu dados de contingência."
          : ". Dados atualizados automaticamente a cada 10 minutos."}
      </p>
    </footer>
  );
}
