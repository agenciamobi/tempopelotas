# Arquitetura hidrológica do TEMPO Pelotas

## Objetivo

Organizar informações meteorológicas e hidrológicas relevantes para Pelotas em uma linguagem acessível, com proveniência explícita e sem substituir alertas oficiais.

A homepage possui duas etapas:

1. previsão meteorológica;
2. situação das águas no Rio Grande do Sul e em Pelotas.

## Relação regional apresentada

Bacias e rios do RS → Guaíba → Lagoa dos Patos → Laranjal, Canal São Gonçalo e áreas baixas de Pelotas.

Essa sequência é usada como contexto, não como um modelo determinístico. O nível futuro em Pelotas também depende de vento, chuva, armazenamento na lagoa, descarga pela Barra do Rio Grande e outras condições hidrodinâmicas.

## Estações de referência ANA

| Estação | Código ANA | Local |
| --- | --- | --- |
| Cais Mauá C6 | 87450004 | Guaíba, Porto Alegre |
| Laranjal | 87955000 | Lagoa dos Patos, Pelotas |
| Arambaré | 87540000 | Lagoa dos Patos, Arambaré |
| São Lourenço | 87921000 | Lagoa dos Patos, São Lourenço do Sul |
| Rio Grande / Regatas | 87980000 | Lagoa dos Patos, Rio Grande |

## Rede FURG e Portos RS

O portal também consulta a Rede de Monitoramento do Nível da Lagoa dos Patos:

- FURG CCMAR, em Rio Grande;
- São Lourenço do Sul;
- Arambaré;
- São José do Norte;
- Itapuã, em Viamão.

A fonte pública informa cota atual, horário da leitura, cota local de inundação e máximo de maio de 2024. As medições são apresentadas em centímetros e reduzidas ao referencial vertical brasileiro, o Marégrafo de Imbituba/SC.

Como não há documentação pública de API identificada, a integração atual processa o HTML renderizado da página principal. O parser:

- aceita decimais com ponto ou vírgula;
- valida nível e horário antes de publicar;
- usa cache de cinco minutos;
- sinaliza leitura atrasada após três horas;
- mantém cada estação isolada, sem derrubar a rede quando uma leitura falha;
- não inventa tendência ou histórico que a página principal não forneça;
- não usa os números encontrados em buscas como fallback de medição.

A cota de inundação é local. Para avaliação de proximidade, cada leitura deve ser comparada somente com a cota exibida no mesmo card.

## Situação das integrações

### Em uso

- Open-Meteo para previsão meteorológica;
- Embrapa Clima Temperado para observação meteorológica atual quando a leitura está recente;
- OpenWeather para radar quando a chave do produto está habilitada;
- LabHidroSens / UFPel para nível e série recente da Estação Laranjal;
- Nível Guaíba para Porto Alegre e rede regional de cidades;
- FURG & Portos RS para a rede de cotas da Lagoa dos Patos;
- Esri World Imagery para visualização de satélite cartográfico.

### Consulta oficial externa

- ANA / SNIRH para níveis, vazões, chuva e estações telemétricas;
- SGB / SACE para monitoramento, boletins e alertas hidrológicos.

### Em preparação

- credenciais para a API HidroWebService da ANA;
- precipitação observada do CEMADEN;
- imagens meteorológicas NOAA/NESDIS STAR;
- armazenamento persistente de séries hidrológicas próprias.

### Experimental

- GloFAS v4 para contexto de vazão preditiva. Qualquer resultado deverá ser claramente identificado como experimental e nunca substituir previsão hidrológica oficial local.

Tomorrow.io e Meteomatics não integram a versão atual.

## Regras de consistência

- manter origem, estação, horário e unidade;
- não regredir a última medição válida armazenada;
- separar medição, previsão e alerta oficial;
- rejeitar registros hidrológicos sem valor de nível válido;
- sinalizar sensores atrasados ou indisponíveis;
- não criar cotas de atenção, alerta ou inundação sem documentação na fonte;
- não apresentar dado de fallback como medição real;
- não comparar números absolutos entre réguas com referências diferentes;
- na rede FURG e Portos RS, comparar cada leitura com sua própria cota local.

## Dados públicos

- `/pelotas.json` — resumo aberto de tempo e hidrologia;
- `/api/weather` — previsão normalizada;
- `/api/weather/history` — histórico meteorológico recente;
- `/api/hydrology/laranjal` — nível local na Praia do Laranjal;
- `/api/hydrology/guaiba` — nível do Guaíba em Porto Alegre;
- `/api/hydrology/guaiba/cities` — rede regional do Nível Guaíba;
- `/api/hydrology/lagoon-network` — rede FURG e Portos RS na Lagoa dos Patos;
- `/feed` — JSON Feed 1.1 para agregadores.

## Limite operacional

O TEMPO Pelotas é um portal comunitário informativo. Não emite ordem de evacuação e não substitui Defesa Civil, Prefeitura, Sanep, ANA, SGB, CEMADEN, INMET ou demais autoridades competentes.
