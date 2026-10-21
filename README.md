# Esteira Segura: infográfico interativo

Página web animada do trabalho trimestral **"Automação Segura"** (Segurança e Higiene do Trabalho, CEP "Dario Geraldo Salles").

Ela mostra uma esteira automatizada em estilo isométrico, desenhada em serpentina (três trechos e duas curvas) para ocupar a tela do projetor. São **13 problemas de segurança**, todos ligados diretamente à esteira e marcados com um alerta, e mais **1 problema escondido**. Ao tocar em um alerta, abre um modal com três abas. Em cada aba vem primeiro a animação, depois o vídeo real (quando não há vídeo, ele simplesmente não aparece) e por último o texto:

1. **O acidente**: a animação do acidente, um vídeo real do YouTube mostrando o problema (com o selo **Acidente real** quando é filmagem de um acidente de verdade) e o texto "como acontece / consequência".
2. **O caso**: a imagem real (quando houver), o caso documentado (fiscalização, notícia, relatório), perigo / exposição / risco e as referências.
3. **Como resolvemos**: a animação da solução, um vídeo real da solução, as medidas de controle e o diagrama **Entrada → Lógica → Saída** quando a solução usa automação.

No fim do modal, o botão **Corrigir problema** aplica a solução: o desenho muda (aparece a grade, o cabo de emergência, o cadeado…) e o alerta vira um check verde.

**Acesse:** https://lucasramos-developer.github.io/seguranca-do-trabalho/

## Como funciona

- **Tela do jogo, sem rolagem:** a esteira fica no centro. À esquerda fica um painel de vidro suspenso com o título, o menu (Infográfico / Sobre o trabalho), os filtros e a lista de problemas, onde os resolvidos ficam marcados em verde. O painel pode ser recolhido para a esteira ocupar a tela toda. O botão **Como jogar**, no canto, mostra as instruções e a legenda.
- **Sobre o trabalho** é uma tela separada, aberta pelo menu (ou pelo endereço `#sobre`).
- **Selos de automação** nos alertas e na lista: engrenagem quando a solução é por automação, meio círculo quando é parcial e nenhum selo quando não há automação. Os filtros (Todos · Automação · Outros) destacam cada grupo.
- **Progresso salvo** no navegador (`localStorage`, chave `esteira-segura-v2`): dá para fechar e voltar depois. **Limpar progresso** apaga tudo, com confirmação no próprio botão (segundo toque).
- **Problema escondido:** com os 13 corrigidos, aparece "Ainda falta um! Turma, encontrem o problema escondido." e um ponto do cenário, até então sem clique, é liberado. Ele não tem alerta. Há um botão de dica, e depois de 20 s a dica aparece sozinha. Corrigindo esse 14º, aparece o selo **ESTEIRA 100% SEGURA**.
- **Vídeos:** a miniatura mostra uma prévia animada com quadros do próprio vídeo, como um GIF. O player só carrega quando alguém toca, e o vídeo para ao trocar de aba ou fechar o modal.

> Spoiler para o professor: o problema escondido é o **extintor bloqueado por caixas**, ao lado do painel elétrico.

## Abrir no computador

Não precisa instalar nada: o site é HTML, CSS e JavaScript puro, sem build.

- **Jeito mais simples:** dar dois cliques em `index.html`.
- **Com servidor local** (recomendado para testar como no GitHub Pages):
  ```bash
  python3 -m http.server 8000
  # abra http://localhost:8000
  ```

Feito para o projetor (16:9): textos grandes, alto contraste e a esteira ocupando a tela. As pessoas do cenário e das animações são figuras articuladas (capacete, colete refletivo, botas) que se mexem: andam, alcançam a esteira, levantam caixas, levam choque, escorregam. Também funciona em celular e tablet em pé, onde a esteira ocupa a altura toda e dá para arrastar para os lados, e no desktop a partir de 1024×600. Respeita a opção "reduzir movimento" do sistema e pausa as animações quando o modal está aberto ou a aba fica oculta, para poupar aparelhos fracos. Sem internet tudo funciona, menos os vídeos do YouTube, que viram link.

## Publicar (GitHub Pages)

O deploy é automático: cada `git push` na branch `main` roda o workflow `.github/workflows/pages.yml`, que publica a pasta do projeto no GitHub Pages.

```bash
git add -A
git commit -m "Atualiza conteúdo"
git push
```

O andamento aparece na aba **Actions** do repositório (ou com `gh run watch`).

## Editar o conteúdo

| Quero… | Onde |
|---|---|
| Mudar textos, NR, prioridade, solução de um problema | `js/data.js` |
| Trocar o vídeo do problema ou da solução | `videoProblema` / `videoSolucao` de cada problema em `js/data.js` |
| Trocar ou adicionar casos e referências | `referencias` de cada problema em `js/data.js` |
| Mudar o desenho do cenário | `js/scene.js` (usa as peças de `js/iso.js`) |
| Mudar as animações do modal | `js/animations.js` |
| Mudar o desenho ou as poses das pessoas | `js/humano.js` |
| Cores, tamanhos e layout | `css/style.css` (variáveis no `:root`) |
| Nomes da equipe | seção "Equipe" em `index.html` |

Depois de mexer em `js/data.js`, rode:

```bash
python3 tools/verificar-referencias.py   # confere vídeos (existem e permitem embed) e links
node tools/gerar-docs.js                 # atualiza docs/problemas.md
```

Para adicionar um problema novo, veja o passo a passo em [`docs/arquitetura.md`](docs/arquitetura.md).

## Documentação

- [`docs/problemas.md`](docs/problemas.md): ficha completa de cada problema (perigo, exposição, risco, caso real, solução, automação e todas as referências com link).
- [`docs/arquitetura.md`](docs/arquitetura.md): como os arquivos se conectam e como estender.

## Estrutura

```
index.html                     página (cabeçalho, palco, lateral, "Sobre", modal)
css/style.css                  estilos e animações
js/data.js                     catálogo dos 14 problemas (13 + 1 escondido) + vídeos e referências reais
js/humano.js                   figura humana articulada e poses animadas (usada no cenário e no modal)
js/iso.js                      peças isométricas (bloco, esteira, rolo, pessoa, robô paletizador…)
js/scene.js                    monta a esteira em serpentina e as versões perigo/seguro de cada problema
js/animations.js               mini-animações do modal (perigo e solução)
js/app.js                      pins, painel da esquerda, telas, modal, estado, filtros, problema escondido
assets/ref/                    imagem real de domínio público (OSHA)
tools/verificar-referencias.py checagem dos vídeos e links
tools/gerar-docs.js            gera docs/problemas.md
.github/workflows/pages.yml    deploy no GitHub Pages
```

## Créditos e direitos

- Vídeos: YouTube, de seus respectivos autores. São incorporados pelo player oficial (`youtube-nocookie.com`) e só carregam quando alguém toca neles.
- Imagem "Power transmission belt": OSHA / Departamento do Trabalho dos EUA, domínio público ([Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Power_transmission_belt.gif)).
- Casos e documentos: SINAIT, HSE (Reino Unido), CEREST Piracicaba, MPT-SP, MHLW (Japão), OSHA, Governo de Ontário, Flexco, Sompo, Unilab e outros, com link em `docs/problemas.md`.
- Ilustrações e animações: feitas em SVG para este trabalho, com estilo inspirado em infográficos isométricos de indústria.
