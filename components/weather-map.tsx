import { regionalWeather } from "@/lib/weather-data";
import { WeatherIcon } from "@/components/weather-icon";

export function WeatherMap() {
  return (
    <section className="map-panel" id="regiao" aria-labelledby="map-title">
      <div className="map-panel-heading">
        <div>
          <span className="eyebrow">Zona Sul do RS</span>
          <h2 id="map-title">Tempo na região</h2>
        </div>
        <button className="map-control" type="button" aria-label="Centralizar mapa em Pelotas">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm9 3h-2.07A7 7 0 0 0 13 5.07V3h-2v2.07A7 7 0 0 0 5.07 11H3v2h2.07A7 7 0 0 0 11 18.93V21h2v-2.07A7 7 0 0 0 18.93 13H21v-2Z" fill="currentColor" />
          </svg>
        </button>
      </div>

      <div className="map-canvas" role="img" aria-label="Mapa ilustrativo da região de Pelotas com condições meteorológicas">
        <svg className="map-shape" viewBox="0 0 500 640" aria-hidden="true">
          <defs>
            <linearGradient id="land" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor="#eaf3ee" />
              <stop offset="1" stopColor="#d9e9e0" />
            </linearGradient>
            <linearGradient id="water" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#b9dce6" />
              <stop offset="1" stopColor="#9ecbd9" />
            </linearGradient>
          </defs>
          <path d="M-10 5h520v650H-10z" fill="url(#land)" />
          <path d="M350-20c-35 86-61 151-53 220 7 59 48 91 45 155-2 59-47 103-42 168 4 53 39 95 74 137h140V-20H350Z" fill="url(#water)" />
          <path d="M318-15c-22 63-50 129-44 203 5 71 45 104 42 170-3 65-43 105-38 171 4 51 30 93 56 126" stroke="#fff" strokeWidth="3" fill="none" opacity=".9" />
          <path d="M35 150c101 14 157 3 244-31M16 285c95-10 183 1 281 38M40 430c72-29 140-19 240 15" stroke="#fff" strokeWidth="2" fill="none" opacity=".65" />
          <path d="M91 46c29 56 37 111 27 172-12 69 6 133 33 181 26 47 35 99 20 164" stroke="#c7ddd1" strokeWidth="2" fill="none" />
          <path d="M198 36c13 75 10 141-7 198-14 51-10 109 20 174 23 50 28 102 16 157" stroke="#c7ddd1" strokeWidth="2" fill="none" />
        </svg>

        {regionalWeather.map((item) => (
          <div
            className={`map-marker ${item.city === "Pelotas" ? "is-active" : ""}`}
            key={item.city}
            style={{ left: `${item.x}%`, top: `${item.y}%` }}
          >
            <div className="map-marker-icon">
              <WeatherIcon name={item.condition} />
            </div>
            <span>{item.temperature}°</span>
            <small>{item.city}</small>
          </div>
        ))}

        <div className="map-legend" aria-hidden="true">
          <span>10°</span>
          <i />
          <span>25°</span>
        </div>
      </div>
    </section>
  );
}
