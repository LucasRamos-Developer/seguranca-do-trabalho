# Esteira Segura: infográfico interativo

Página web animada do trabalho trimestral **"Automação Segura"** (Segurança e Higiene do Trabalho, CEP "Dario Geraldo Salles").

Ela mostra uma esteira automatizada em estilo isométrico, com **14 problemas de segurança** marcados com ⚠ e **1 problema escondido**. Ao tocar em um ⚠, abre um modal com três abas:

1. **Vídeo**: animação do acidente acontecendo e da solução funcionando, mais **vídeos reais** do YouTube.
2. **O caso**: caso real documentado (fiscalização, notícia, relatório), imagem real quando houver, perigo / exposição / risco.
3. **Como resolvemos**: medidas de controle, NR, prioridade e o diagrama **Entrada → Lógica → Saída** quando a solução usa automação.

No fim do modal, o botão **"Corrigir problema"** aplica a solução: o desenho muda (aparece a grade, o cabo de emergência, o cadeado…) e o ⚠ vira um escudo verde ✔.

**Acesse:** https://lucasramos-developer.github.io/seguranca-do-trabalho/

## Como funciona o jogo

- Os pins mostram um selo de automação: **⚙** quando a solução é por automação, **◐** quando a automação é parcial e nenhum selo quando não há automação. Os filtros da lateral (Todos · ⚙ Automação · Outros) destacam cada grupo.
- O progresso fica salvo no navegador (`localStorage`, chave `esteira-segura-v1`): dá para fechar e voltar depois. O botão **🗑 Limpar progresso** apaga tudo. Ele pede confirmação no próprio botão, com um segundo toque.
- **No desktop** a página ocupa a tela inteira. A lista de problemas e o placar ficam no botão flutuante **"Problemas X/14"**, no canto inferior direito, que abre uma gaveta. O progresso também aparece no topo e, em telas largas, há os cartões "Como jogar" e "Legenda" nas laterais do cenário.
- **No celular e no tablet** a lista fica logo abaixo do infográfico.
- Com os 14 corrigidos, aparece **"Ainda falta um! Turma, encontrem o problema escondido 🔍"** e um ponto do cenário, até então sem clique, é liberado. Ele não tem pin. Há um botão de dica, e depois de 20 s a dica aparece sozinha.
- Corrigindo o 15º, aparece o selo **"ESTEIRA 100% SEGURA — 15/15"**.

> Spoiler para o professor: o problema escondido é o **extintor bloqueado por caixas**, ao lado do painel elétrico.

## Abrir no computador

Não precisa instalar nada: o site é HTML, CSS e JavaScript puro, sem build.

- **Jeito mais simples:** dar dois cliques em `index.html`.
- **Com servidor local** (recomendado para testar como no GitHub Pages):
  ```bash
  python3 -m http.server 8000
  # abra http://localhost:8000
  ```

Funciona em celular (o cenário pode ser arrastado para os lados), tablet e desktop a partir de 1024×600. Respeita a opção "reduzir movimento" do sistema e pausa as animações quando o modal está aberto ou a aba fica oculta, para poupar aparelhos fracos. Sem internet tudo funciona, menos os vídeos do YouTube, que viram link.

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
| Trocar ou adicionar vídeos e referências | `referencias` de cada problema em `js/data.js` |
| Mudar o desenho do cenário | `js/scene.js` (usa as peças de `js/iso.js`) |
| Mudar as animações do modal | `js/animations.js` |
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
js/data.js                     catálogo dos 15 problemas + referências reais
js/iso.js                      peças isométricas (bloco, esteira, rolo, pessoa, robô…)
js/scene.js                    monta o cenário e as versões perigo/seguro de cada problema
js/animations.js               mini-animações do modal (perigo e solução)
js/app.js                      pins, modal, estado, filtros, problema escondido
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
