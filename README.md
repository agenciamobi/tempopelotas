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

A integração está centralizada em `lib/weather-service.ts` e normaliza os dados antes de entregá-los aos componentes.

Informações disponíveis:

- temperatura e sensação térmica;
- umidade, pressão e visibilidade;
- velocidade, direção e rajadas de vento;
- previsão horária;
- previsão para sete dias;
- probabilidade e acumulado estimado de chuva;
- nascer e pôr do sol;
- condições regionais de Pelotas, Rio Grande, Canguçu e São Lourenço do Sul.

Os dados são revalidados a cada 10 minutos. Em caso de indisponibilidade da fonte externa, o sistema utiliza uma estrutura de contingência sem interromper a página.

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
- `/alertas` — leitura automática de condições de atenção;
- `/api/weather` — endpoint interno com dados normalizados.

## SEO e distribuição

- metadados por página;
- URLs canônicas;
- Schema.org e FAQPage;
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
- criar histórico e gráficos de temperatura, chuva e vento;
- ampliar a cobertura para mais cidades da Zona Sul;
- revisar identidade visual e conteúdo com base no uso real.
