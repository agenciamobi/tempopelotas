import { LAGOON_LEVEL_SOURCE } from "@/lib/lagoon-level";

export type HydrologySourceStatus =
  | "active"
  | "official-reference"
  | "prepared"
  | "experimental";

export type HydrologyStation = {
  name: string;
  code: string;
  waterBody: string;
  city: string;
  role: string;
  officialUrl: string;
};

export type HydrologyDataSource = {
  id: string;
  name: string;
  organization: string;
  category: string;
  description: string;
  status: HydrologySourceStatus;
  statusLabel: string;
  url: string;
};

export const ANA_MONITORING_URL = "https://www.gov.br/ana/pt-br/monitoramento";
export const ANA_TELEMETRY_URL =
  "https://www.snirh.gov.br/hidrotelemetria/gerarGrafico.aspx";
export const SGB_SACE_URL = "https://www.sgb.gov.br/sace/";
export const CEMADEN_URL = "https://www.gov.br/cemaden/pt-br";
export const NOAA_STAR_URL = "https://www.star.nesdis.noaa.gov/star/index.php";
export const OPEN_METEO_URL = "https://open-meteo.com/";
export const EMBRAPA_AGROMET_URL =
  "https://agromet.cpact.embrapa.br/online/Current_Monitor.htm";
export const GLOFAS_URL = "https://global-flood.emergency.copernicus.eu/";
export const NIVEL_GUAIBA_URL = "https://nivelguaiba.com.br/";

export const HYDROLOGY_FLOW = [
  {
    title: "Bacias do Guaíba",
    description:
      "Jacuí, Taquari-Antas, Caí, Sinos, Gravataí e outras bacias conduzem água para o Guaíba.",
  },
  {
    title: "Guaíba",
    description:
      "É uma das maiores contribuições para a Lagoa dos Patos e funciona como indicador regional a montante.",
  },
  {
    title: "Outros afluentes",
    description:
      "Camaquã, Litoral Médio, Mirim–São Gonçalo, rios e arroios também alimentam o sistema lagunar.",
  },
  {
    title: "Lagoa e Pelotas",
    description:
      "O nível no Laranjal depende do volume acumulado, da chuva local, do vento e do Canal São Gonçalo.",
  },
  {
    title: "Barra de Rio Grande",
    description:
      "O escoamento ao oceano ocorre pelo canal da Barra, entre Rio Grande e São José do Norte.",
  },
] as const;

export const HYDROLOGY_STATIONS: HydrologyStation[] = [
  {
    name: "Cais Mauá C6",
    code: "87450004",
    waterBody: "Guaíba",
    city: "Porto Alegre / RS",
    role: "Indicador regional a montante da Lagoa dos Patos.",
    officialUrl: ANA_TELEMETRY_URL,
  },
  {
    name: "Laranjal",
    code: "87955000",
    waterBody: "Lagoa dos Patos",
    city: "Pelotas / RS",
    role: "Referência oficial para acompanhamento do nível na região de Pelotas.",
    officialUrl: ANA_TELEMETRY_URL,
  },
  {
    name: "Arambaré",
    code: "87540000",
    waterBody: "Lagoa dos Patos",
    city: "Arambaré / RS",
    role: "Ajuda a observar o comportamento da lagoa em seu setor norte e central.",
    officialUrl: ANA_TELEMETRY_URL,
  },
  {
    name: "São Lourenço",
    code: "87921000",
    waterBody: "Lagoa dos Patos",
    city: "São Lourenço do Sul / RS",
    role: "Ponto intermediário para leitura espacial da Lagoa dos Patos.",
    officialUrl: ANA_TELEMETRY_URL,
  },
  {
    name: "Rio Grande / Regatas",
    code: "87980000",
    waterBody: "Lagoa dos Patos",
    city: "Rio Grande / RS",
    role: "Referência próxima à saída da lagoa e à Barra do Rio Grande.",
    officialUrl: ANA_TELEMETRY_URL,
  },
];

export const HYDROLOGY_DATA_SOURCES: HydrologyDataSource[] = [
  {
    id: "labhidrosens",
    name: "Estação Laranjal",
    organization: "LabHidroSens / UFPel",
    category: "Nível local da lagoa",
    description:
      "Painel público incorporado ao portal para consulta visual do nível na Praia do Laranjal.",
    status: "active",
    statusLabel: "Em uso",
    url: LAGOON_LEVEL_SOURCE.dashboardUrl,
  },
  {
    id: "nivel-guaiba",
    name: "Nível do Guaíba em Porto Alegre",
    organization: "Nível Guaíba",
    category: "Indicador regional agregado",
    description:
      "Série pública materializada a partir de dados telemétricos de ANA e SGB. O TEMPO Pelotas calcula tendência de seis horas e variação de 24 horas sem tratar o Guaíba como previsão isolada para Pelotas.",
    status: "active",
    statusLabel: "Em uso",
    url: NIVEL_GUAIBA_URL,
  },
  {
    id: "ana",
    name: "Rede Hidrometeorológica Nacional",
    organization: "ANA / SNIRH",
    category: "Níveis, vazões e chuva",
    description:
      "Rede telemétrica oficial com estações automáticas e séries hidrológicas. A integração automatizada depende de credenciais da API HidroWebService.",
    status: "official-reference",
    statusLabel: "Consulta oficial",
    url: ANA_MONITORING_URL,
  },
  {
    id: "sgb",
    name: "SACE",
    organization: "Serviço Geológico do Brasil",
    category: "Monitoramento e alertas hidrológicos",
    description:
      "Boletins, níveis de rios, chuva e sistemas de alerta produzidos pelo SGB para apoio à prevenção de eventos críticos.",
    status: "official-reference",
    statusLabel: "Consulta oficial",
    url: SGB_SACE_URL,
  },
  {
    id: "open-meteo",
    name: "Modelos meteorológicos",
    organization: "Open-Meteo",
    category: "Previsão do tempo",
    description:
      "Distribuição de previsões numéricas de modelos como ECMWF IFS, DWD ICON e NOAA GFS, normalizadas pelo portal.",
    status: "active",
    statusLabel: "Em uso",
    url: OPEN_METEO_URL,
  },
  {
    id: "embrapa-agromet",
    name: "Posto Meteorológico da Sede",
    organization: "Embrapa Clima Temperado",
    category: "Observação meteorológica local",
    description:
      "Leituras automáticas de temperatura, umidade, pressão, vento, chuva, extremos do dia e evapotranspiração em um ponto físico de Pelotas.",
    status: "active",
    statusLabel: "Em uso",
    url: EMBRAPA_AGROMET_URL,
  },
  {
    id: "cemaden",
    name: "Rede de pluviômetros",
    organization: "CEMADEN / MCTI",
    category: "Precipitação observada",
    description:
      "Fonte prevista para complementar a chuva modelada com registros de pluviômetros automáticos e comunitários.",
    status: "prepared",
    statusLabel: "Em preparação",
    url: CEMADEN_URL,
  },
  {
    id: "noaa-star",
    name: "GOES-19",
    organization: "NOAA / NESDIS STAR",
    category: "Imagens meteorológicas",
    description:
      "Fonte planejada para imagens oficiais de satélite e acompanhamento da evolução de sistemas meteorológicos.",
    status: "prepared",
    statusLabel: "Em preparação",
    url: NOAA_STAR_URL,
  },
  {
    id: "glofas",
    name: "GloFAS v4",
    organization: "Copernicus / ECMWF",
    category: "Vazão preditiva",
    description:
      "Modelo global de previsão de cheias considerado para análises experimentais, sem substituir previsões hidrológicas oficiais locais.",
    status: "experimental",
    statusLabel: "Experimental",
    url: GLOFAS_URL,
  },
];
