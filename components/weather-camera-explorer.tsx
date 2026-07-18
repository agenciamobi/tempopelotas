"use client";

import { useMemo, useState } from "react";
import type { WeatherCamera } from "@/lib/weather-cameras";

type WeatherCameraExplorerProps = {
  cameras: WeatherCamera[];
};

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="6" width="14" height="12" rx="3" />
      <path d="m17 10 4-2v8l-4-2M7.5 4.5h5" />
      <circle cx="10" cy="12" r="2.7" />
    </svg>
  );
}

export function WeatherCameraExplorer({ cameras }: WeatherCameraExplorerProps) {
  const initialCamera = useMemo(
    () => cameras.find((camera) => camera.status === "online") ?? cameras[0],
    [cameras],
  );
  const hasOnlineCamera = cameras.some((camera) => camera.status === "online");
  const [selectedId, setSelectedId] = useState(initialCamera?.id ?? "");
  const [playerOpen, setPlayerOpen] = useState(false);
  const selectedCamera =
    cameras.find((camera) => camera.id === selectedId) ?? initialCamera;

  if (!selectedCamera) return null;

  const selectCamera = (camera: WeatherCamera) => {
    setSelectedId(camera.id);
    setPlayerOpen(false);
  };

  return (
    <section className="camera-explorer" aria-labelledby="camera-explorer-title">
      <div className="camera-explorer-heading">
        <div>
          <span className="eyebrow">Visualização local</span>
          <h2 id="camera-explorer-title">
            {hasOnlineCamera ? "Observe Pelotas em tempo real" : "Rede visual preparada para Pelotas"}
          </h2>
          <p>
            {hasOnlineCamera
              ? "Escolha um ponto da cidade. A transmissão externa só é carregada depois do seu toque, preservando desempenho e consumo de dados."
              : "Os pontos já estão organizados e serão habilitados individualmente quando transmissões públicas e estáveis estiverem disponíveis."}
          </p>
        </div>
        <div className="camera-live-summary" aria-live="polite">
          <span
            className={`camera-status camera-status--${selectedCamera.status}`}
          >
            <i aria-hidden="true" />
            {selectedCamera.status === "online" ? "Disponível" : "Em preparação"}
          </span>
          <strong>{selectedCamera.shortName}</strong>
          <small>{selectedCamera.observation}</small>
        </div>
      </div>

      <div className="camera-selector" role="tablist" aria-label="Pontos de câmera">
        {cameras.map((camera) => {
          const isSelected = camera.id === selectedCamera.id;

          return (
            <button
              type="button"
              role="tab"
              aria-selected={isSelected}
              className={isSelected ? "is-active" : undefined}
              key={camera.id}
              onClick={() => selectCamera(camera)}
            >
              <span>{camera.shortName}</span>
              <small>{camera.status === "online" ? "Ao vivo" : "Em preparação"}</small>
            </button>
          );
        })}
      </div>

      <div className="camera-stage">
        <div className="camera-frame">
          {selectedCamera.status === "online" && selectedCamera.embedUrl ? (
            playerOpen ? (
              <iframe
                src={selectedCamera.embedUrl}
                title={selectedCamera.name}
                loading="lazy"
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            ) : (
              <button
                className="camera-launch"
                type="button"
                onClick={() => setPlayerOpen(true)}
                aria-label={`Abrir transmissão da ${selectedCamera.name}`}
              >
                <span className="camera-launch-icon">
                  <CameraIcon />
                </span>
                <strong>Abrir câmera</strong>
                <small>A transmissão será carregada agora</small>
              </button>
            )
          ) : (
            <div className="camera-placeholder" role="status">
              <span className="camera-placeholder-icon">
                <CameraIcon />
              </span>
              <strong>Transmissão em preparação</strong>
              <p>
                A estrutura deste ponto está pronta. A câmera será ativada quando uma fonte pública
                e estável for configurada.
              </p>
            </div>
          )}
          <div className="camera-frame-label">
            <span>{selectedCamera.area}</span>
            <small>{selectedCamera.provider ?? "TEMPO Pelotas"}</small>
          </div>
        </div>

        <aside className="camera-details" aria-label="Informações da câmera selecionada">
          <span className="eyebrow">Ponto selecionado</span>
          <h3>{selectedCamera.name}</h3>
          <p>{selectedCamera.description}</p>
          <dl>
            <div>
              <dt>Local</dt>
              <dd>{selectedCamera.area}</dd>
            </div>
            <div>
              <dt>Coordenadas</dt>
              <dd>
                {selectedCamera.latitude.toFixed(4)}, {selectedCamera.longitude.toFixed(4)}
              </dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{selectedCamera.status === "online" ? "Câmera disponível" : "Aguardando fonte"}</dd>
            </div>
          </dl>
          {selectedCamera.publicUrl ? (
            <a
              className="camera-external-link"
              href={selectedCamera.publicUrl}
              target="_blank"
              rel="noreferrer"
            >
              Abrir na fonte original
              <span aria-hidden="true">↗</span>
            </a>
          ) : null}
        </aside>
      </div>

      <div className="camera-list" aria-label="Resumo dos pontos de câmera">
        {cameras.map((camera) => (
          <button
            id={camera.id}
            type="button"
            className={camera.id === selectedCamera.id ? "is-active" : undefined}
            key={camera.id}
            onClick={() => selectCamera(camera)}
          >
            <span className="camera-list-icon">
              <CameraIcon />
            </span>
            <span>
              <strong>{camera.shortName}</strong>
              <small>{camera.area}</small>
            </span>
            <i
              className={`camera-list-state camera-list-state--${camera.status}`}
              aria-hidden="true"
            />
            <span className="sr-only">
              {camera.status === "online" ? "Disponível" : "Em preparação"}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
