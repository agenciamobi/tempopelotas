import type { Metadata } from "next";
import { ForecastPageShell } from "@/components/forecast-page-shell";
import { WeatherCameraExplorer } from "@/components/weather-camera-explorer";
import { absoluteUrl } from "@/lib/site";
import { getWeatherCameras } from "@/lib/weather-cameras";
import { getPelotasWeather } from "@/lib/weather-service";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Câmeras ao vivo de Pelotas e Praia do Laranjal",
  description:
    "Acompanhe câmeras meteorológicas de Pelotas, Praia do Laranjal e Canal São Gonçalo para observar chuva, nuvens, vento e visibilidade.",
  alternates: { canonical: "/cameras-ao-vivo-pelotas" },
  openGraph: {
    title: "Câmeras ao vivo de Pelotas",
    description:
      "Visualize pontos de Pelotas e acompanhe as condições meteorológicas locais por imagem.",
    url: "/cameras-ao-vivo-pelotas",
  },
};

export default async function CamerasAoVivoPelotasPage() {
  const [weather, cameras] = await Promise.all([
    getPelotasWeather(),
    Promise.resolve(getWeatherCameras()),
  ]);
  const onlineCount = cameras.filter((camera) => camera.status === "online").length;

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Câmeras meteorológicas de Pelotas",
    url: absoluteUrl("/cameras-ao-vivo-pelotas"),
    numberOfItems: cameras.length,
    itemListElement: cameras.map((camera, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: camera.name,
      description: camera.description,
      item: `${absoluteUrl("/cameras-ao-vivo-pelotas")}#${camera.id}`,
    })),
  };

  return (
    <ForecastPageShell
      weather={weather}
      eyebrow="Observação visual"
      title="Câmeras ao vivo de Pelotas"
      description="Acompanhe pontos estratégicos da cidade para complementar a leitura da previsão com imagens locais, sem substituir dados de estações ou alertas oficiais."
      currentPath="/cameras-ao-vivo-pelotas"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListSchema).replace(/</g, "\\u003c"),
        }}
      />

      <section className="camera-overview" aria-label="Resumo da rede de câmeras">
        <article>
          <span>Pontos mapeados</span>
          <strong>{cameras.length}</strong>
          <small>Laranjal, Centro e São Gonçalo</small>
        </article>
        <article>
          <span>Disponíveis agora</span>
          <strong>{onlineCount}</strong>
          <small>{onlineCount ? "Transmissões configuradas" : "Aguardando ativação das fontes"}</small>
        </article>
        <article>
          <span>Temperatura atual</span>
          <strong>{weather.current.temperature}°C</strong>
          <small>{weather.current.condition}</small>
        </article>
        <article>
          <span>Maior rajada próxima</span>
          <strong>
            {Math.max(
              weather.current.windGust,
              ...weather.hourly.map((hour) => hour.windGust),
            )} km/h
          </strong>
          <small>Agora e próximas horas</small>
        </article>
      </section>

      <WeatherCameraExplorer cameras={cameras} />

      <section className="topic-section camera-guidance" aria-labelledby="camera-guidance-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Como interpretar</span>
            <h2 id="camera-guidance-title">Imagem complementa, mas não mede o tempo</h2>
          </div>
          <p>
            Câmeras ajudam a verificar visibilidade, cobertura de nuvens e presença aparente de
            chuva, mas não fornecem uma medição meteorológica completa.
          </p>
        </div>
        <div className="camera-guidance-grid">
          <article>
            <span>01</span>
            <h3>Observe a visibilidade</h3>
            <p>Neblina, chuva intensa e baixa nebulosidade podem reduzir a visão do horizonte.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Compare com a previsão</h3>
            <p>Use a imagem junto dos gráficos de chuva, vento e temperatura do portal.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Considere atrasos</h3>
            <p>Transmissões externas podem apresentar latência, pausas ou indisponibilidade.</p>
          </article>
        </div>
        <p className="data-note">
          As imagens pertencem aos respectivos provedores informados em cada transmissão. A
          disponibilidade pode variar sem aviso prévio.
        </p>
      </section>
    </ForecastPageShell>
  );
}
