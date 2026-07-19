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
    "Conheça as fontes meteorológicas e hidrológicas, observações da Embrapa, regras de validação, limitações e endpoints públicos do TEMPO Pelotas.",
  alternates: { canonical: "/metodologia" },
  openGraph: {
    title: "Metodologia e fontes do TEMPO Pelotas",
    description:
      "Transparência sobre previsão, observações meteorológicas, nível da lagoa, radar e integrações hidrológicas.",
    url: "/metodologia",
  },
};

const validationRules = [
  {
    title: "Origem identificada",
    description:
      "Cada informação deve manter instituição responsável, fonte original, horário de consulta e local de referência.",
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
      "Sensor atrasado, indisponibilidade da fonte, mudança no HTML ou uso de contingência deve ser informado sem apresentar estimativa como medição real.",
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
      description="Esta página documenta o que o portal usa hoje, como as fontes são interpretadas, o que ainda está em preparação e quais regras protegem a comunidade contra leituras enganosas."
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
            <h3>Previsão meteorológica</h3>
            <p>
              A previsão é obtida via Open-Meteo, que distribui modelos numéricos de instituições
              como ECMWF, DWD e NOAA. O radar usa OpenWeather quando o produto está habilitado.
            </p>
          </article>
          <article>
            <h3>Observação meteorológica</h3>
            <p>
              Temperatura, umidade, pressão, vento, chuva e evapotranspiração são consultados na
              página pública da estação automática da Embrapa Clima Temperado em Pelotas.
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
              experimentais. Eles não aparecem como fontes ativas antes da validação.
            </p>
          </article>
        </div>
      </section>

      <section className="topic-section" aria-labelledby="method-embrapa-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Coleta Embrapa</span>
            <h2 id="method-embrapa-title">Como a página meteorológica é interpretada</h2>
          </div>
          <p>
            Como não existe uma API pública documentada para o monitor atual, a consulta é feita pelo
            servidor do TEMPO Pelotas e nunca diretamente pelo navegador do usuário.
          </p>
        </div>

        <div className="methodology-rules-grid">
          <article>
            <h3>Consulta server-side</h3>
            <p>
              O HTML público é obtido a cada cinco minutos, com timeout e cache. A página original
              permanece sempre vinculada para conferência.
            </p>
          </article>
          <article>
            <h3>Codificação legada</h3>
            <p>
              O conteúdo é decodificado como Windows-1252 antes da leitura dos rótulos, evitando que
              acentos antigos interrompam o processamento.
            </p>
          </article>
          <article>
            <h3>Rótulos conhecidos</h3>
            <p>
              O parser procura nomes estáveis como temperatura do ar, umidade relativa, pressão,
              chuva diária, extremos e evapotranspiração, sem depender da posição visual da tabela.
            </p>
          </article>
          <article>
            <h3>Falha segura</h3>
            <p>
              Se leituras essenciais não forem reconhecidas, o portal exibe indisponibilidade e não
              completa valores com estimativas ou dados antigos não identificados.
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
            preparação. Essa separação impede que uma intenção futura pareça um dado operacional.
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
            As regras abaixo orientam as integrações meteorológicas, o arquivo próprio e as futuras
            conexões com APIs hidrológicas oficiais.
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
            pesquisadores, aplicativos e agregadores. O conteúdo informa a fonte e sua situação.
          </p>
        </div>

        <div className="raw-data-grid">
          <a href="/pelotas.json">
            <strong>Resumo de Pelotas</strong>
            <span>Previsão, observação da Embrapa e referências hidrológicas.</span>
            <code>/pelotas.json</code>
          </a>
          <a href="/api/weather/embrapa">
            <strong>Observação da Embrapa</strong>
            <span>Leituras reconhecidas no monitor meteorológico da estação.</span>
            <code>/api/weather/embrapa</code>
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
          <Link className="hydrology-secondary-action" href="/estacao-embrapa-pelotas">
            Ver estação Embrapa
          </Link>
          <Link className="hydrology-secondary-action" href="/">
            Voltar à página inicial
          </Link>
        </div>
      </section>
    </ForecastPageShell>
  );
}
