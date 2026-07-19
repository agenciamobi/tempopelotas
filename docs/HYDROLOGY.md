# Arquitetura hidrológica do TEMPO Pelotas

## Objetivo

Organizar informações meteorológicas e hidrológicas relevantes para Pelotas em uma linguagem acessível, com proveniência explícita e sem substituir alertas oficiais.

A homepage possui duas etapas:

1. previsão meteorológica;
2. situação das águas no Rio Grande do Sul e em Pelotas.

## Relação regional apresentada

Bacias e rios do RS → Guaíba → Lagoa dos Patos → Laranjal, Canal São Gonçalo e áreas baixas de Pelotas.

Essa sequência é usada como contexto, não como um modelo determinístico. O nível futuro em Pelotas também depende de vento, chuva, armazenamento na lagoa, descarga pela Barra do Rio Grande e outras condições hidrodinâmicas.

## Estações de referência

| Estação | Código ANA | Local |
| --- | --- | --- |
| Cais Mauá C6 | 87450004 | Guaíba, Porto Alegre |
| Laranjal | 87955000 | Lagoa dos Patos, Pelotas |
| Arambaré | 87540000 | Lagoa dos Patos, Arambaré |
| São Lourenço | 87921000 | Lagoa dos Patos, São Lourenço do Sul |
| Rio Grande / Regatas | 87980000 | Lagoa dos Patos, Rio Grande |

Níveis de estações diferentes não devem ser comparados diretamente sem considerar a referência vertical e a documentação técnica de cada ponto.

## Situação das integrações

### Em uso

- Open-Meteo para previsão meteorológica;
- OpenWeather para radar quando a chave do produto está habilitada;
- LabHidroSens / UFPel para o painel visual da Estação Laranjal;
- Esri World Imagery para visualização de satélite cartográfico.

### Consulta oficial externa

- ANA / SNIRH para níveis, vazões, chuva e estações telemétricas;
- SGB / SACE para monitoramento, boletins e alertas hidrológicos.

### Em preparação

- credenciais para a API HidroWebService da ANA;
- precipitação observada do CEMADEN;
- imagens meteorológicas NOAA/NESDIS STAR;
- armazenamento de séries hidrológicas próprias.

### Experimental

- GloFAS v4 para contexto de vazão preditiva. Qualquer resultado deverá ser claramente identificado como experimental e nunca substituir previsão hidrológica oficial local.

Tomorrow.io e Meteomatics não integram a versão atual.

## Regras de consistência

- manter origem, estação, horário e unidade;
- não regredir a última medição válida armazenada;
- separar medição, previsão e alerta oficial;
- rejeitar registros hidrológicos sem valor de nível válido;
- sinalizar sensores atrasados ou indisponíveis;
- não criar cotas de atenção, alerta ou inundação sem documentação oficial;
- não apresentar dado de fallback como medição real.

## Dados públicos

- `/pelotas.json` — resumo aberto de tempo e referências hidrológicas;
- `/api/weather` — previsão normalizada;
- `/api/weather/history` — histórico meteorológico recente;
- `/feed` — JSON Feed 1.1 para agregadores.

## Limite operacional

O TEMPO Pelotas é um portal comunitário informativo. Não emite ordem de evacuação e não substitui Defesa Civil, Prefeitura, Sanep, ANA, SGB, CEMADEN, INMET ou demais autoridades competentes.
