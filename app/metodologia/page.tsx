import type { Metadata } from "next";
import Link from "next/link";
import { ForecastPageShell } from "@/components/forecast-page-shell";
import {
  HYDROLOGY_DATA_SOURCES,
  HYDROLOGY_STATIONS,
} from "@/lib/hydrology";
import { absoluteUrl } from "@/lib/site";
import { getPelotasWeather } from "@/lib/weather-service";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Metodologia, fontes e dados do TEMPO Pelotas",
  description:
    "Conheça as fontes meteorológicas e hidrológicas, regras de validação, limitações e endpoints públicos utilizados pelo TEMPO Pelotas.",
  alternates: { canonical: "/metodologia" },
  openGraph: {
    title: "Metodologia e fontes do TEMPO Pelotas",
    description:
      "Transparência sobre previsão do tempo, nível da lagoa, estações oficiais, radar e futuras integrações hidrológicas.",
    url: "/metodologia",
  },
};

const validationRules = [
  {
    title: "Origem identificada",
    description:
      "Cada informação deve manter instituição responsável, fonte original, horário de atualização e local de referência.",
  },
  {
    title: "Sem regressão de horário",
    description:
      "Ao persistir séries próprias, uma leitura mais antiga não deve substituir a última medição válida conhecida.",
  },
  {
    title: "Valores hidrológicos válidos",
    description:
      "Quando a API oficial estiver integrada, registros sem nível válido serão descartados e dados de chuva não serão tratados como nível do corpo hídrico.",
  },
  {
    title: "Observação separada de previsão",
    description:
      "Dados medidos, resultados de modelos numéricos e alertas oficiais permanecem identificados como categorias diferentes.",
  },
  {
    title: "Falha visível",
    description:
      "Sensor atrasado, indisponibilidade da fonte ou uso de contingência deve ser informado ao usuário, sem apresentar estimativa como medição real.",
  },
  {
    title: "Sem alerta inventado",
    description:
      "O portal não cria cotas locais de atenção, alerta ou inundação sem documentação técnica da autoridade responsável.",
  },
];

export default async function MetodologiaPage() {
  const weather = await getPelotasWeather();

  const techArticleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: "Metodologia, fontes e proveniência do TEMPO Pelotas",
    description:
      "Documentação pública sobre dados meteorológicos e hidrológicos utilizados pelo portal.",
    url: absoluteUrl("/metodologia"),
    inLanguage: "pt-BR",
    dateModified: new Date().toISOString(),
    author: {
      "@type": "Organization",
      name: "TEMPO Pelotas",
    },
  };

  return (
    <ForecastPageShell
      weather={weather}
      eyebrow="Transparência e dados públicos"
      title="Metodologia e fontes"
      description="Esta página documenta o que o portal usa hoje, o que ainda está em preparação e quais regras serão aplicadas para proteger a comunidade contra leituras enganosas."
      currentPath="/metodologia"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(techArticleSchema).replace(/</g, "\\u003c"),
        }}
      />

      <section className="topic-section" aria-labelledby="method-purpose-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Finalidade pública</span>
            <h2 id="method-purpose-title">Informar para ajudar a comunidade a se preparar</h2>
          </div>
          <p>
            O TEMPO Pelotas reúne informações dispersas em uma linguagem local e acessível. A
            prioridade é apresentar proveniência, horário e limitações, sem substituir órgãos de
            monitoramento, alerta ou resposta.
          </p>
        </div>

        <div className="methodology-rules-grid">
          <article>
            <h3>Meteorologia</h3>
            <p>
              A previsão atual é obtida via Open-Meteo, que combina modelos numéricos de instituições
              como ECMWF, DWD e NOAA. O radar de precipitação usa OpenWeather quando a chave do
              produto está habilitada.
            </p>
          </article>
          <article>
            <h3>Hidrologia</h3>
            <p>
              O medidor local incorporado é fornecido pelo LabHidroSens / UFPel. ANA e SGB são as
              referências oficiais para níveis, vazões, chuva e boletins hidrológicos.
            </p>
          </article>
          <article>
            <h3>Fontes futuras</h3>
            <p>
              NOAA/NESDIS STAR, CEMADEN e GloFAS estão documentados como integrações em preparação ou
              experimentais. Eles não são apresentados como fontes ativas enquanto a conexão não for
              validada.
            </p>
          </article>
          <article>
            <h3>Fornecedores não ativos</h3>
            <p>
              Tomorrow.io e Meteomatics podem ser avaliados futuramente, mas não integram a versão
              atual do portal e, portanto, não são citados como origem da previsão exibida.
            </p>
          </article>
        </div>
      </section>

      <section className="topic-section" aria-labelledby="method-sources-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">De onde vêm os dados</span>
            <h2 id="method-sources-title">Fontes, situação e responsabilidade</h2>
          </div>
          <p>
            O status diferencia integrações em uso, consultas oficiais externas e recursos ainda em
            preparação. Essa separação impede que uma intenção futura pareça um dado já operacional.
          </p>
        </div>

        <div className="methodology-source-grid">
          {HYDROLOGY_DATA_SOURCES.map((source) => (
            <article key={source.id}>
              <span className={`source-status source-status--${source.status}`}>
                {source.statusLabel}
              </span>
              <small>{source.organization}</small>
              <h3>{source.name}</h3>
              <p>{source.description}</p>
              <a href={source.url} target="_blank" rel="noreferrer">
                Consultar fonte
                <span aria-hidden="true">↗</span>
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="topic-section" aria-labelledby="method-stations-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Identificação das estações</span>
            <h2 id="method-stations-title">Pontos de referência hidrológica</h2>
          </div>
          <p>
            Os códigos abaixo são mantidos para rastreabilidade. Um nível em metros ou centímetros só
            deve ser interpretado dentro da referência técnica da própria estação.
          </p>
        </div>

        <div className="hydrology-stations-grid">
          {HYDROLOGY_STATIONS.map((station) => (
            <article key={station.code}>
              <span className="station-code">ANA {station.code}</span>
              <small>{station.city}</small>
              <h3>{station.name}</h3>
              <p>{station.role}</p>
              <a href={station.officialUrl} target="_blank" rel="noreferrer">
                Abrir telemetria
                <span aria-hidden="true">↗</span>
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="topic-section" aria-labelledby="method-validation-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Tratamento e consistência</span>
            <h2 id="method-validation-title">Regras para não induzir a comunidade ao erro</h2>
          </div>
          <p>
            As regras abaixo orientam a evolução do arquivo próprio e das futuras integrações com as
            APIs hidrológicas oficiais.
          </p>
        </div>

        <div className="methodology-rules-grid">
          {validationRules.map((rule) => (
            <article key={rule.title}>
              <h3>{rule.title}</h3>
              <p>{rule.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="topic-section" aria-labelledby="method-raw-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Acesso aberto</span>
            <h2 id="method-raw-title">Dados brutos e integração</h2>
          </div>
          <p>
            Os endpoints abaixo são públicos, não exigem autenticação e podem ser usados por
            pesquisadores, aplicativos e agregadores. O conteúdo informa quando determinado dado é
            externo, demonstrativo ou ainda indisponível.
          </p>
        </div>

        <div className="raw-data-grid">
          <a href="/pelotas.json">
            <strong>Resumo de Pelotas</strong>
            <span>Tempo atual, previsão e metadados das referências hidrológicas.</span>
            <code>/pelotas.json</code>
          </a>
          <a href="/api/weather">
            <strong>Previsão normalizada</strong>
            <span>Estrutura interna utilizada pelas páginas meteorológicas.</span>
            <code>/api/weather</code>
          </a>
          <a href="/api/weather/history">
            <strong>Histórico recente</strong>
            <span>Série diária de temperatura, chuva e rajadas dos últimos 30 dias.</span>
            <code>/api/weather/history</code>
          </a>
          <a href="/feed">
            <strong>Feed público</strong>
            <span>JSON Feed 1.1 com resumos para agregadores e automações.</span>
            <code>/feed</code>
          </a>
        </div>
      </section>

      <section className="topic-section" aria-labelledby="method-limit-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Limitações</span>
            <h2 id="method-limit-title">O que o portal não faz</h2>
          </div>
        </div>

        <div className="lagoon-disclaimer">
          <strong>Não é um sistema oficial de alerta</strong>
          <p>
            O TEMPO Pelotas não define cotas de inundação, não emite ordem de evacuação e não garante
            disponibilidade contínua de fontes externas. Em risco iminente, siga exclusivamente as
            orientações da Defesa Civil e das autoridades competentes.
          </p>
        </div>

        <div className="hydrology-home-actions">
          <Link className="hydrology-primary-action" href="/situacao-hidrologica-pelotas">
            Abrir situação hidrológica
            <span aria-hidden="true">→</span>
          </Link>
          <Link className="hydrology-secondary-action" href="/">
            Voltar à página inicial
          </Link>
        </div>
      </section>
    </ForecastPageShell>
  );
}
