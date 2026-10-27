# Arquitetura

Site estático, sem build e sem dependências. Os scripts são carregados em ordem no fim do `index.html`:

```
data.js  →  nrs.js  →  humano.js  →  iso.js  →  scene.js  →  animations.js  →  app.js
(dados)     (peças)    (cenário)     (modal)           (comportamento)
```

Os dados ficam em um arquivo `.js` (e não em `.json` carregado por `fetch`) para o site abrir com dois cliques no `index.html`: navegadores bloqueiam `fetch` em `file://`.

## Fluxo

1. **`js/data.js`** define `window.PROBLEMAS`: um objeto por problema, com textos, NR, prioridade, classificação de automação (`automacao: 'sim' | 'parcial' | 'nao'`), a cadeia `{entrada, logica, saida, nota}`, `videoProblema` e `videoSolucao` (`{ id, titulo, real? }` do YouTube) e `referencias[]` (casos, imagens e documentos).
1a. **`js/nrs.js`** expõe `window.NRS = { NRS, NR_ITENS, HIERARQUIA }`: a ficha de cada norma (nome, do que trata, link do PDF oficial no gov.br e aviso de mudança de texto, como a NR-10 nova que vale a partir de 01/06/2027) e, para cada problema, os itens que se aplicam, resumidos. O app monta com isso a gaveta "NRs" do modal (`#nr-gaveta`); `tools/gerar-docs.js` usa os mesmos dados em `docs/problemas.md` e `tools/verificar-referencias.py` testa os links.
1b. **`js/humano.js`** expõe `window.HUMANO`, a figura humana usada em todo o site.
   - A pessoa é um esqueleto 2D visto de lado (quadril, ombros, cabeça, pés e mãos); joelhos e cotovelos saem por cinemática inversa de dois segmentos. Cada parte (braço, perna, tronco, colete, cabeça, capacete) vira um `<path>`.
   - `figura(pose)` desenha uma pose de `HUMANO.POSES` (`pe`, `anda1..4`, `corre`, `curvado`, `operando`, `alcanca`, `ouvidos`, `levanta`, `segura`, `agacha`, `ajoelhado`, `pulando`, `puxado`, `choque`, `escorrega`).
   - `figura([[pose, t], ...])` anima: como todas as poses geram os mesmos comandos de path, o SMIL interpola o atributo `d` entre os quadros (com easing). `com('alcanca', { mF: [x, y] })` ajusta pontos de uma pose; `caminhada(n)` gera um ciclo de passos.
2. **`js/iso.js`** expõe `window.ISO` com a projeção isométrica e as peças de desenho:
   - `P(x, y, z)` converte coordenadas do mundo em pontos da tela. `x` cresce para baixo-direita, `y` para baixo-esquerda e `z` para cima.
   - `box()`, `esteira()`, `rolo()` são peças 3D desenhadas como polígonos.
   - `pessoa()` (desenha com `HUMANO.figura`), `robo()`, `sinaleiro()`, `extintor()` são sprites 2D posicionados num ponto da tela.
3. **`js/scene.js`** expõe `window.CENA`:
   - `montar()` devolve o `<svg>` do cenário (viewBox 1440×810, 16:9). A esteira é uma serpentina: R1 (alto, para a direita) → K1 (curva da direita) → R2 (volta para a esquerda) → K2 (curva da esquerda) → R3 (inclinada até a paletização). As coordenadas ficam no objeto `L`.
   - Cada problema aparece como um ou mais `<g class="prob" data-p="N">`, cada um com `<g class="perigo">` e `<g class="seguro">`. O CSS mostra um ou outro conforme a classe `fixed`.
   - `ANCORAS[N]` é o ponto do mundo `[x, y, z]` onde fica o pin do problema N. `telaParaPercentual(N)` converte esse ponto em `left/top` em %, para posicionar o pin (um `<button>` HTML) por cima do SVG.
   - O desenho segue a ordem do pintor: o que está mais ao fundo (menor `x + y`) é desenhado primeiro.
4. **`js/animations.js`** expõe `window.ANIM.CENAS[N] = { perigo(), seguro() }`, que devolvem mini-SVGs 320×180 animados com SMIL em um ciclo de 4 s. O app usa `svg.setCurrentTime(0)` para repetir e `pauseAnimations()` para pausar.
5. **`js/app.js`** liga tudo:
   - estado em `localStorage` (`esteira-segura-v1`): `{ resolvidos: [ids], escondidoLiberado }`. O botão "Limpar progresso" remove a chave; ele confirma com um segundo toque, sem `confirm()` do navegador;
   - painel suspenso à esquerda (`<aside id="painel">`, vidro): título, menu de telas, resumo, filtros, lista de problemas e "Limpar progresso". Recolhe pelo botão `#painel-recolher` e volta pelo `#painel-abrir`. Em telas de até 900 px começa recolhido;
   - telas: "Infográfico" (`#tela-jogo`, tela cheia, sem rolagem) e "Sobre o trabalho" (`#tela-sobre`, endereço `#sobre`), trocadas pelo menu. O botão "Como jogar" abre a ajuda com a legenda;
   - pins, legenda, placar, filtros e tabela "Quais problemas a automação resolve?";
   - modal: abas "O acidente", "O caso" e "Como resolvemos", num seletor de vidro em largura total cujo destaque (`.abas-glider`) desliza até a aba ativa (vermelho, amarelo e verde; `data-ativa` na `<nav>`). Em cada uma vem a animação, depois o link do vídeo real (`midiaBloco`; sem vídeo, o bloco não aparece) e por último o texto. A imagem real, quando existe, abre a aba "O caso". "O acidente" mostra `videoProblema` (selo "Acidente real" quando `real: 'acidente'`) e "Como resolvemos" mostra `videoSolucao`. O vídeo não é incorporado: `videoBloco()` gera um cartão-link que abre o YouTube em outra aba. O botão "Corrigir" leva à aba "Como resolvemos" e toca a animação da solução antes de fechar;
   - problema escondido: um `<button class="alvo-escondido">` transparente sobre o extintor, inativo até os 13 visíveis serem corrigidos;
   - gaveta "NRs" (`alternarNr()`): abre (e fecha) pelo botão `.btn-nr`, à direita das etiquetas, ou pela tecla N. Em telas de 1100 px ou mais fica ao lado do modal (o modal ganha `.com-nr` e encolhe); em telas menores abre por cima dele. Esc fecha primeiro a gaveta quando o foco está nela. Cada modal abre com a gaveta fechada;
   - celebração (confete), selo final, dica, toast, swipe entre abas, Esc e foco preso dentro do modal.

## Apresentação em slides

`apresentacao.html` carrega os mesmos scripts do infográfico (sem `app.js`) e mais dois:

- **`js/slides-dados.js`** expõe `window.APRESENTACAO`: as cinco seções, a lista `SLIDES` (id, seção, título e `roteiro`), as peças do diagrama "Como funciona", o quadro de perigos do PDF, as três melhorias, os passos do LOTO, a estimativa de risco `RISCO[id] = { antes: [P, G], depois: [P, G] }` e a conclusão. Textos de problemas e NRs não são copiados: vêm de `PROBLEMAS` e `NRS`.
- **`js/slides.js`** monta cada slide com `MONTAR[id]` e liga as interações com `LIGAR[id]`. O palco tem 1600×900 px e é escalado com `transform: scale()` para caber na tela.
  - Passos: elementos `[data-passo]` aparecem um por vez com →; `LIGAR[id]` pode devolver uma função chamada a cada passo (é assim que as melhorias trocam para "Depois" e a matriz move os pontos). Voltar para um slide mostra todos os passos dele.
  - Só o slide atual se mexe: os outros ganham `.pausado` e `pauseAnimations()` no SVG.
  - `[data-ir-problema]` leva ao mapa com o problema aberto; `[data-ir-slide]` leva a outro slide.
  - O problema escondido fica com `.spoiler` (borrado) até ser revelado no mapa (`body.escondido-revelado`).

## Desempenho

- As animações do cenário usam só `transform`, `opacity` e `stroke-dashoffset`.
- Quando o modal abre ou a aba fica oculta, `pausarCena()` coloca a classe `.pausado` no palco (`animation-play-state: paused`, para a esteira e as caixas) e chama `pauseAnimations()` no SVG (para as pessoas, que usam SMIL).
- Nenhum vídeo é incorporado: os vídeos são só links, então o modal não carrega nada do YouTube.
- `prefers-reduced-motion` desliga as animações.
- O palco ocupa a tela toda (menos o painel, quando aberto); o SVG 16:9 é centralizado e o piso "vaza" para as laterais (`overflow: visible`), enquanto o fundo hexagonal vem do CSS.
- Em tela em pé (proporção até 5:4, como celular e tablet em retrato), a esteira ocupa a altura toda dentro de uma área que rola para os lados. A página em si nunca rola no jogo.

## Como adicionar um problema novo

1. **Dados:** em `js/data.js`, copie um objeto existente, troque o `id` (o próximo número) e preencha os textos e a classificação de automação. Preencha `videoProblema`, `videoSolucao` e pelo menos uma referência real em `referencias[]`; o script de verificação falha sem isso.
2. **Cenário:** em `js/scene.js`:
   - acrescente a âncora do pin em `ANCORAS`;
   - desenhe as duas versões com `prob(id, svgPerigo, svgSeguro)` dentro da função da área certa (`painel`, `entrada`, `linhaB` ou `inclinada`), respeitando a ordem de desenho.
3. **Animação do modal:** em `js/animations.js`, acrescente `CENAS[id] = { perigo: () => wrap(...), seguro: () => wrap(...) }`. Use as peças `correia`, `pessoa`, `caixa`, `mover`, `janela`, `alerta` e `okSelo`.
4. **Problema escondido:** só um problema pode ter `escondido: true`. Ele não tem pin, só o alvo transparente posicionado pela âncora dele.
5. **Conferir:**
   ```bash
   python3 tools/verificar-referencias.py
   node tools/gerar-docs.js
   python3 -m http.server 8000   # e testar no navegador
   ```
