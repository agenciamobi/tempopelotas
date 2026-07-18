Análise da referência ClicTempo

A estrutura visual é forte como conceito, mas tecnologicamente envelhecida.

Composição

O desktop é dividido em três áreas:

Mapa lateral
Ocupa aproximadamente 35% da tela.
Mostra RS/SC com marcadores meteorológicos.
Funciona como elemento visual e navegação geográfica.
Conteúdo principal
Temperatura em escala muito grande.
Condição atual, sensação térmica, umidade, pressão e vento.
Previsão ao longo do dia.
Continuação vertical com previsão detalhada dos próximos dias.
Barra semanal fixa
Lista compacta com sete dias.
Permite leitura rápida sem rolar a página.

A página efetivamente apresenta condição atual, umidade, pressão, vento, previsão horária e previsão semanal.

O que devemos preservar
Forte impacto visual da temperatura atual.
Leitura meteorológica imediata.
Mapa como elemento editorial.
Previsão horária bem destacada.
Navegação semanal sempre acessível.
Poucos elementos de navegação tradicional.
O que não devemos copiar
Layout rigidamente desktop.
Barra semanal estreita e desconfortável.
Contraste baixo entre fundo azul e textos secundários.
Excesso de espaço ocupado pelo mapa.
Publicidade interferindo na leitura.
Botões sociais obsoletos.
Ícones e tipografia datados.
Dependência visual de blocos com largura fixa.

Há ainda problemas estruturais: os títulos de previsão aparecem duplicados no conteúdo e a página informa “Climatempo Meteorologia” nos blocos, enquanto o rodapé também atribui previsão ao yr.no, deixando a origem dos dados pouco clara.

Direção recomendada para o TEMPO Pelotas
Stack
Next.js
TypeScript
Tailwind CSS
Server Components
API Route para normalizar os dados meteorológicos
Cache e revalidação periódica
Deploy na Vercel

Next.js é preferível ao Vite neste projeto por SEO, conteúdo indexável, metadados dinâmicos e geração estruturada das previsões.

Primeira dobra

No desktop:

28%: mapa da região de Pelotas e Zona Sul
54%: condição meteorológica atual
18%: previsão dos próximos dias

No mobile:

Cabeçalho compacto
Condição atual
Alertas meteorológicos
Previsão horária horizontal
Previsão de sete dias
Mapa abaixo do conteúdo principal
Identidade

Não recomendo reproduzir o azul acinzentado da referência. O TEMPO Pelotas deve ter personalidade própria:

Fundo azul profundo e superfícies claras
Ciano para informações meteorológicas
Amarelo solar para destaques
Azul de chuva para precipitação
Vermelho somente para alertas
Visual limpo, local e confiável
Conteúdo e SEO

Estrutura inicial:

/ — Tempo em Pelotas
/previsao-do-tempo-pelotas
/tempo-hoje-pelotas
/previsao-7-dias-pelotas
/chuva-em-pelotas
/vento-em-pelotas
/clima-de-pelotas
/alertas
/cameras-ao-vivo
/blog

O projeto já tinha como base a integração CPTEC/INPE para previsão de quatro dias. Devemos manter essa possibilidade, mas criar uma camada interna de normalização para não acoplar a interface diretamente ao XML do provedor.

A direção correta é usar a referência como modelo de hierarquia meteorológica, não como modelo visual literal. O novo site deve ser mais responsivo, mais editorial, mais local e preparado para SEO de Pelotas e região.
