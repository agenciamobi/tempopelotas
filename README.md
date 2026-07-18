# TEMPO Pelotas

Portal meteorológico local para Pelotas e a Zona Sul do Rio Grande do Sul.

## Stack

- Next.js 16 com App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Deploy previsto na Vercel

## Desenvolvimento

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`.

## Validação

```bash
npm run typecheck
npm run build
```

O GitHub Actions executa as duas verificações automaticamente em cada atualização da `main`.

## Front-end implementado

- condição meteorológica atual em destaque;
- mapa ilustrativo de Pelotas e cidades próximas;
- umidade, pressão, vento e visibilidade;
- previsão horária com navegação horizontal no celular;
- previsão para sete dias;
- área preparada para alertas meteorológicos;
- cabeçalho fixo e navegação mobile;
- metadados, Schema.org, sitemap e robots.txt;
- layout responsivo e suporte a redução de movimento.

Os dados exibidos nesta etapa são demonstrativos e estão centralizados em `lib/weather-data.ts`.

## Direção visual

A referência do ClicTempo foi usada somente como base de hierarquia da informação. O projeto adota identidade própria:

- azul profundo para a condição atual;
- superfícies claras e alto contraste;
- ciano para informações meteorológicas;
- amarelo solar para destaques;
- azul para precipitação;
- laranja reservado aos alertas.

No desktop, o mapa permanece lateral e o conteúdo meteorológico recebe maior área útil. No mobile, a condição atual, previsão horária, alertas e previsão semanal aparecem antes do mapa.

## Próxima etapa

Criar uma camada interna de normalização e cache para integrar fontes meteorológicas sem acoplar os componentes diretamente a uma API específica. A fonte utilizada deverá ser identificada claramente em cada previsão.
