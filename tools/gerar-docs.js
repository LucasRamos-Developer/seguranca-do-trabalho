#!/usr/bin/env node
/*
 * Gera docs/problemas.md a partir de js/data.js (a mesma fonte que o site usa).
 * Uso: node tools/gerar-docs.js
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const raiz = path.resolve(__dirname, '..');
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(raiz, 'js', 'data.js'), 'utf8'), ctx);
const PROBLEMAS = ctx.window.PROBLEMAS;

const AUTO = { sim: '⚙ Sim', parcial: '◐ Parcial', nao: '✖ Não' };
const TIPO = { caso: 'Caso real', imagem: 'Imagem real', documento: 'Referência técnica' };

function video(rotulo, v) {
  const extra = v.embed === false ? ' (abre direto no YouTube: o autor bloqueou a incorporação)' : '';
  return `- **${rotulo}:** [${v.titulo}](https://www.youtube.com/watch?v=${v.id})${extra}`;
}

function ref(r) {
  const titulo = r.url ? `[${r.titulo}](${r.url})` : r.titulo;
  const data = r.data ? ` (${r.data})` : '';
  const img = r.src ? ` Arquivo local: \`${r.src}\`.` : '';
  const resumo = r.resumo ? ` ${r.resumo}` : '';
  return `- **${TIPO[r.tipo]}:** ${titulo}. ${r.fonte}${data}.${resumo}${img}`;
}

let md = `# Ficha técnica dos problemas

> Arquivo gerado por \`node tools/gerar-docs.js\` a partir de \`js/data.js\`. Não edite à mão: altere \`js/data.js\` e rode o script de novo.

São ${PROBLEMAS.length} problemas: ${PROBLEMAS.filter((p) => !p.escondido).length} visíveis no infográfico e 1 escondido, que só fica clicável depois que todos os outros forem corrigidos.

## Resumo

| # | Problema | NR | Prioridade | Automação |
|---|---|---|---|---|
${PROBLEMAS.map((p) => `| ${p.id} | ${p.titulo}${p.escondido ? ' *(escondido)*' : ''} | ${p.nr} | ${p.prioridade} | ${AUTO[p.automacao]} |`).join('\n')}

`;

for (const p of PROBLEMAS) {
  const c = p.cadeia || {};
  md += `---

## ${p.id}. ${p.titulo}${p.escondido ? ' (problema escondido)' : ''}

**Categoria:** ${p.categoria} · **NR:** ${p.nr} · **Prioridade:** ${p.prioridade} · **Automação:** ${AUTO[p.automacao]}

| | |
|---|---|
| **Onde** | ${p.onde} |
| **Quem fica exposto** | ${p.quem} |
| **Consequência** | ${p.consequencia} |
| **Perigo** | ${p.perigo} |
| **Exposição** | ${p.exposicao} |
| **Risco** | ${p.risco} |

**O caso:** ${p.caso}

**Solução:**
${p.solucao.map((s) => `- ${s}`).join('\n')}

**Como reduz o risco:** ${p.comoReduz}

**Automação:** ${c.entrada ? `${c.entrada} → ${c.logica} → ${c.saida}. ` : ''}${c.nota || ''}

**Vídeos reais:**
${video('Vídeo do problema', p.videoProblema)}
${video('Vídeo da solução', p.videoSolucao)}

**Referências reais:**
${p.referencias.map(ref).join('\n')}

`;
}

fs.writeFileSync(path.join(raiz, 'docs', 'problemas.md'), md);
console.log(`docs/problemas.md gerado (${PROBLEMAS.length} problemas).`);
