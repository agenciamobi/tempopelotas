# TEMPO Pelotas

Portal meteorológico local para Pelotas e a Zona Sul do Rio Grande do Sul.

## Stack

- Next.js 16 com App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Open-Meteo como fonte meteorológica inicial
- MapLibre GL JS para visualização geográfica
- OpenFreeMap como camada cartográfica
- Vercel para validação de produção

## Desenvolvimento local

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`.

Para definir a URL pública localmente, copie `.env.example` para `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Validação

```bash
npm run typecheck
npm run build
```

O GitHub Actions e a Vercel validam as atualizações enviadas para a `main`.

## Dados meteorológicos

A integração atual está centralizada em `lib/weather-service.ts` e normaliza os dados antes de entregá-los aos componentes.

Informações disponíveis:

- temperatura e sensação térmica;
- umidade, pressão e visibilidade;
- velocidade, direção e rajadas de vento;
- previsão horária;
- previsão para sete dias;
- probabilidade e acumulado estimado de chuva;
- nascer e pôr do sol;
- condições regionais de Pelotas, Rio Grande, Canguçu e São Lourenço do Sul.

Os dados de previsão são revalidados a cada 10 minutos. Em caso de indisponibilidade da fonte externa, o sistema utiliza uma estrutura de contingência sem interromper a página.

## Histórico meteorológico

O serviço `lib/weather-history-service.ts` consulta os últimos 30 dias completos na API Historical Forecast do Open-Meteo e entrega uma série diária normalizada.

A página de histórico oferece:

- médias das temperaturas máximas e mínimas;
- chuva acumulada no período;
- maior rajada registrada pelo modelo;
- identificação do dia mais quente, mais frio e mais chuvoso;
- gráfico interativo para 7, 14 ou 30 dias;
- alternância entre temperatura, chuva e rajadas;
- Schema.org do tipo `Dataset`;
- endpoint interno `/api/weather/history`.

O histórico é revalidado a cada seis horas. Nesta etapa, os dados são recuperados da fonte histórica com cache; ainda não existe armazenamento próprio em banco de dados.

## Experiência mobile

A interface para celulares segue uma linguagem próxima de aplicativo nativo:

- cabeçalho fixo com suporte à área segura de aparelhos com notch;
- barra inferior com cinco abas, ícones e indicação da rota ativa;
- navegação preparada para instalação como PWA;
- cartões compactos com hierarquia adaptada para toque;
- carrosséis horizontais com scroll snap para previsão horária e conteúdos relacionados;
- suporte a `viewport-fit=cover` e `safe-area-inset`;
- manifesto com atalhos para tempo atual, previsão semanal, chuva, histórico e alertas;
- estilos específicos para execução em modo `standalone`.

Os principais ajustes estão em `app/mobile-app.css` e `components/site-header.tsx`.

## Gráficos meteorológicos

O componente `components/weather-trend-chart.tsx` apresenta a evolução horária sem adicionar bibliotecas externas de gráficos.

Recursos:

- alternância entre temperatura, probabilidade de chuva e rajadas;
- gráfico SVG responsivo com área, linha, grade e ponto selecionado;
- seleção de horário por botões acessíveis;
- resumo numérico atualizado em tempo real;
- carrossel com scroll snap no celular;
- tema inicial contextual nas páginas de chuva e vento;
- uso na página inicial e nas páginas específicas de previsão.

O componente `components/weather-history-chart.tsx` aplica a mesma arquitetura ao histórico diário e permite alternar o período exibido.

## Mapa regional

O mapa da página inicial utiliza coordenadas geográficas reais e apresenta marcadores meteorológicos para as cidades monitoradas.

Características:

- carregamento progressivo somente quando o mapa se aproxima da área visível;
- navegação, zoom e centralização em Pelotas;
- marcadores acessíveis com temperatura e condição atual;
- popup com detalhes por cidade;
- gestos cooperativos para não bloquear a rolagem da página;
- atribuição cartográfica automática;
- fallback visual quando a camada externa não puder ser carregada.

## Páginas

- `/` — painel meteorológico principal;
- `/tempo-hoje-pelotas` — condição atual e previsão horária;
- `/previsao-7-dias-pelotas` — tendência semanal completa;
- `/chuva-em-pelotas` — probabilidade e acumulado de chuva;
- `/vento-em-pelotas` — vento médio e rajadas;
- `/historico-climatico-pelotas` — comparação dos últimos 30 dias;
- `/alertas` — leitura automática de condições de atenção;
- `/api/weather` — endpoint interno com dados normalizados;
- `/api/weather/history` — endpoint interno do histórico recente.

## SEO e distribuição

- metadados por página;
- URLs canônicas;
- Schema.org, FAQPage e Dataset;
- sitemap dinâmico;
- robots.txt;
- navegação interna entre previsões;
- manifesto instalável e ícone do aplicativo;
- conteúdo renderizado no servidor.

## Alertas

A página de alertas utiliza critérios internos para destacar chuva, rajadas e indicação de temporal. Essa leitura não representa um alerta oficial e não substitui a Defesa Civil, o INMET ou as autoridades locais.

## Próximas etapas

- integrar alertas oficiais quando houver uma fonte adequada;
- adicionar câmeras meteorológicas locais;
- persistir snapshots diários em banco de dados para comparações próprias de longo prazo;
- ampliar a cobertura para mais cidades da Zona Sul;
- revisar identidade visual e conteúdo com base no uso real.
