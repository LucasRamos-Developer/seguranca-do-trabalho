# Arquitetura

Site estático, sem build e sem dependências. Os scripts são carregados em ordem no fim do `index.html`:

```
data.js  →  iso.js  →  scene.js  →  animations.js  →  app.js
(dados)     (peças)    (cenário)     (modal)           (comportamento)
```

Os dados ficam em um arquivo `.js` (e não em `.json` carregado por `fetch`) para o site abrir com dois cliques no `index.html`: navegadores bloqueiam `fetch` em `file://`.

## Fluxo

1. **`js/data.js`** define `window.PROBLEMAS`: um objeto por problema, com textos, NR, prioridade, classificação de automação (`automacao: 'sim' | 'parcial' | 'nao'`), a cadeia `{entrada, logica, saida, nota}` e `referencias[]`.
2. **`js/iso.js`** expõe `window.ISO` com a projeção isométrica e as peças de desenho:
   - `P(x, y, z)` converte coordenadas do mundo em pontos da tela. `x` cresce para baixo-direita, `y` para baixo-esquerda e `z` para cima.
   - `box()`, `esteira()`, `rolo()` são peças 3D desenhadas como polígonos.
   - `pessoa()`, `robo()`, `sinaleiro()`, `extintor()` são sprites 2D posicionados num ponto da tela.
3. **`js/scene.js`** expõe `window.CENA`:
   - `montar()` devolve o `<svg>` do cenário (viewBox 900×1000).
   - Cada problema aparece como um ou mais `<g class="prob" data-p="N">`, cada um com `<g class="perigo">` e `<g class="seguro">`. O CSS mostra um ou outro conforme a classe `fixed`.
   - `ANCORAS[N]` é o ponto do mundo `[x, y, z]` onde fica o pin do problema N. `telaParaPercentual(N)` converte esse ponto em `left/top` em %, para posicionar o pin (um `<button>` HTML) por cima do SVG.
   - O desenho segue a ordem do pintor: o que está mais ao fundo (menor `x + y`) é desenhado primeiro.
4. **`js/animations.js`** expõe `window.ANIM.CENAS[N] = { perigo(), seguro() }`, que devolvem mini-SVGs 320×180 animados com SMIL em um ciclo de 4 s. O app usa `svg.setCurrentTime(0)` para repetir e `pauseAnimations()` para pausar.
5. **`js/app.js`** liga tudo:
   - estado em `localStorage` (`esteira-segura-v1`): `{ resolvidos: [ids], escondidoLiberado }`. O botão "Limpar progresso" remove a chave; ele confirma com um segundo toque, sem `confirm()` do navegador;
   - desktop (≥ 1000 px): o `<aside id="painel">` vira uma gaveta lateral aberta pelo botão flutuante `#fab`, que fecha com ×, clique no fundo ou Esc. No celular e no tablet o mesmo `<aside>` fica abaixo do cenário;
   - pins, legenda, placar, filtros e tabela "Quais problemas a automação resolve?";
   - modal: abas, fachada dos vídeos (miniatura → iframe só ao tocar), botão corrigir/reabrir;
   - problema escondido: um `<button class="alvo-escondido">` transparente sobre o extintor, inativo até os 14 visíveis serem corrigidos;
   - celebração (confete), selo final, dica, toast, swipe entre abas, Esc e foco preso dentro do modal.

## Desempenho

- As animações do cenário usam só `transform`, `opacity` e `stroke-dashoffset`.
- O palco ganha a classe `.pausado` (com `animation-play-state: paused`) quando o modal abre ou a aba fica oculta.
- Os vídeos do YouTube só carregam quando alguém toca neles.
- `prefers-reduced-motion` desliga as animações.
- No desktop, o palco ocupa a largura toda e a altura da tela; o SVG é centralizado e o piso "vaza" para as laterais (`overflow: visible`), enquanto o fundo hexagonal vem do CSS.
- No celular (≤ 640 px), o cenário fica com 600 px de largura dentro de uma área rolável na horizontal, para os pins não se sobreporem. A página em si nunca rola para os lados.

## Como adicionar um problema novo

1. **Dados:** em `js/data.js`, copie um objeto existente, troque o `id` (o próximo número) e preencha os textos e a classificação de automação. Coloque pelo menos uma referência real em `referencias[]`; o script de verificação falha sem isso.
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

## Vídeos que não permitem incorporação

Alguns autores bloqueiam o player embutido. O verificador (`tools/verificar-referencias.py`) detecta isso pelo oEmbed (HTTP 401/403). Nesse caso, marque o vídeo com `embed: false` em `js/data.js`: a fachada passa a mostrar "abre no YouTube ↗" e abre o vídeo em uma nova aba.
