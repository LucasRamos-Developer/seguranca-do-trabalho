/*
 * Apresentação em slides (apresentacao.html): monta os slides, navega entre eles e liga as interações.
 * Conteúdo próprio em js/slides-dados.js; problemas, NRs e animações vêm do infográfico
 * (js/data.js, js/nrs.js, js/scene.js, js/animations.js).
 *
 * Passos: elementos com [data-passo] aparecem um de cada vez com → antes de ir para o próximo slide
 * (como os "fragmentos" de outros programas de slides). Cada slide pode reagir aos passos em LIGAR.
 */
(function () {
  const A = window.APRESENTACAO;
  const PROBLEMAS = window.PROBLEMAS;
  const { CENAS, ICONES_NO } = window.ANIM;
  const { NRS: FICHAS, NR_ITENS, HIERARQUIA } = window.NRS;
  const ESCONDIDO = PROBLEMAS.find((p) => p.escondido);
  const porId = (id) => PROBLEMAS.find((p) => p.id === id);
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const movimentoReduzido = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nrsDe = (p) => p.nr.split('/').map((s) => s.trim());

  const IC = {
    alerta: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 L22 20 H2 Z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><path d="M12 9.5 v5 M12 17.2 v.3" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
    engrenagem: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5 l1.6 2.4 2.8-.8.5 2.9 2.8.9-.8 2.8 2.4 1.6-2.4 1.6.8 2.8-2.8.9-.5 2.9-2.8-.8L12 21.5l-1.6-2.4-2.8.8-.5-2.9-2.8-.9.8-2.8L2.7 12l2.4-1.6-.8-2.8 2.8-.9.5-2.9 2.8.8z" fill="currentColor"/><circle cx="12" cy="12" r="3.4" fill="#1b2350"/></svg>',
    xis: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#e5484d"/><path d="M8 8 L16 16 M16 8 L8 16" stroke="#fff" stroke-width="2.8" stroke-linecap="round"/></svg>',
    externo: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4 h6 v6 M20 4 L11 13 M18 14 v5 a1 1 0 0 1 -1 1 H5 a1 1 0 0 1 -1 -1 V7 a1 1 0 0 1 1 -1 h5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    escudo: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 4 L58 14 V32 C58 48 46 58 32 62 C18 58 6 48 6 32 V14 Z" fill="#2ecc71"/><path d="M20 32 l9 9 l16 -18" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round"/></svg>',
    ant: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5 L8 12 L15 19" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    prox: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5 L16 12 L9 19" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  // ---------- peças reaproveitadas ----------
  // chip com o número de um problema; clicar abre o problema no mapa
  const pchip = (id) => {
    const p = porId(id);
    return `<button type="button" class="pchip${p.prioridade === 'Alta' ? ' grave' : ''}" data-ir-problema="${id}" title="${esc(p.titulo)}">${id}</button>`;
  };
  const seloAuto = (p) => p.automacao === 'sim' ? `<span class="auto-sim" title="Solução por automação">${IC.engrenagem}</span>`
    : p.automacao === 'parcial' ? '<span class="meia" title="Automação parcial"></span>' : '';
  // cenário do infográfico; sem id fixo, porque ele aparece em mais de um slide
  const cena = () => window.CENA.montar().replace(' aria-labelledby="cena-titulo"', '').replace(' id="cena-titulo"', '');
  const cadeia = (p) => {
    const c = p.cadeia;
    return `<div class="cadeia"><div class="cadeia-nos">
        <div class="no">${ICONES_NO.entrada}<b>Entrada</b>${esc(c.entrada)}</div><div class="seta"><i></i></div>
        <div class="no">${ICONES_NO.logica}<b>Lógica</b>${esc(c.logica)}</div><div class="seta s2"><i></i></div>
        <div class="no">${ICONES_NO.saida}<b>Saída</b>${esc(c.saida)}</div>
      </div></div>`;
  };
  const nivel = (pg) => { const r = pg[0] * pg[1]; return r >= 6 ? 'alto' : r >= 3 ? 'medio' : 'baixo'; };

  // perfis de esteira (figura 1 do PDF), pequenos e animados
  function svgTipo(tipo) {
    const caixa = (d) => `<g class="mover" style="--t:4s;--dx:150px;--dy:0px;--d:${d}s"><rect x="40" y="38" width="34" height="26" rx="3" fill="#dda15c"/><rect x="40" y="38" width="34" height="6" fill="#f6cf98"/></g>`;
    const giro = '<animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="1.4s" repeatCount="indefinite"/>';
    const roda = (cx, cy, r) => `<g transform="translate(${cx} ${cy})"><circle r="${r}" fill="#cfd8ea" stroke="#5b6a8f" stroke-width="2"/><g>${giro}<path d="M${-r + 3} 0 H${r - 3} M0 ${-r + 3} V${r - 3}" stroke="#5b6a8f" stroke-width="2"/></g></g>`;
    let corpo = '';
    if (tipo === 'rolos') corpo = [40, 72, 104, 136, 168, 200].map((x) => roda(x, 76, 11)).join('') + caixa(0) + caixa(-2);
    if (tipo === 'plana') corpo = `<rect x="26" y="64" width="188" height="24" rx="12" fill="#4a73bf"/><line x1="38" y1="65" x2="202" y2="65" class="belt-dash" stroke="#8fb4ee" stroke-width="3" stroke-dasharray="12 12"/>${roda(38, 76, 11)}${roda(202, 76, 11)}${caixa(0)}${caixa(-2)}`;
    if (tipo === 'inclinada') corpo = `<g transform="rotate(-16 120 76)"><rect x="26" y="64" width="188" height="24" rx="12" fill="#4a73bf"/><line x1="38" y1="65" x2="202" y2="65" class="belt-dash" stroke="#8fb4ee" stroke-width="3" stroke-dasharray="12 12"/>${[60, 100, 140, 180].map((x) => `<rect x="${x}" y="56" width="4" height="9" fill="#cfd8ea"/>`).join('')}${roda(38, 76, 11)}${roda(202, 76, 11)}${caixa(0)}${caixa(-2)}</g>`;
    return `<svg viewBox="0 0 240 120" aria-hidden="true"><rect x="0" y="104" width="240" height="16" fill="#1a2256"/>${corpo}</svg>`;
  }

  // diagrama "Como funciona": vista de lado com as peças clicáveis e o sinal andando pelos fios
  function diagrama() {
    const comp = (id, conteudo) => `<g class="comp" data-comp="${id}" tabindex="0" role="button" aria-label="${esc(A.COMPONENTES[id].nome)}">${conteudo}</g>`;
    const giro = '<animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="1.6s" repeatCount="indefinite"/>';
    const rolo = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#cfd8ea" stroke="#5b6a8f" stroke-width="3"/><g transform="translate(${cx} ${cy})"><g>${giro}<path d="M${-r + 6} 0 H${r - 6} M0 ${-r + 6} V${r - 6}" stroke="#5b6a8f" stroke-width="3"/></g></g>`;
    const fio = (d, atraso = 0) => `<path d="${d}" class="fio"/><path d="${d}" class="fio-sinal" style="animation-delay:${atraso}s"/>`;
    const rotulo = (x, y, t, anchor = 'middle') => `<text x="${x}" y="${y}" class="diag-rot" text-anchor="${anchor}">${t}</text>`;
    const caixas = [0, -2.5, -5].map((d) => `<g class="mover" style="--t:7.5s;--dx:470px;--dy:0px;--d:${d}s"><rect x="190" y="222" width="56" height="40" rx="4" fill="#dda15c"/><rect x="190" y="222" width="56" height="8" fill="#f6cf98"/><rect x="215" y="222" width="6" height="40" fill="#c58645"/></g>`).join('');
    return `<svg class="diag" viewBox="0 0 1000 560" role="img" aria-label="Diagrama da esteira com sensores, CLP, inversor e motor">
      <rect x="0" y="500" width="1000" height="60" fill="#1a2256"/><line x1="0" y1="500" x2="1000" y2="500" stroke="#3b4f96" stroke-width="2"/>
      <rect x="128" y="150" width="170" height="350" rx="12" class="zona"/>${rotulo(213, 140, 'Zona de alimentação')}
      <rect x="610" y="150" width="180" height="350" rx="12" class="zona"/>${rotulo(700, 140, 'Zona de recolhimento')}
      ${fio('M70 190 V70 H945 V140', 0)}
      ${fio('M476 160 V100 H900 V140', 0.3)}
      ${fio('M812 283 H830 V172 H866', 0.6)}
      ${fio('M915 204 V222', 0.9)}
      ${fio('M866 290 H836 V420 H774', 1.2)}
      <rect x="200" y="300" width="14" height="200" fill="#2c3c78"/><rect x="690" y="300" width="14" height="200" fill="#2c3c78"/>
      <rect x="146" y="262" width="618" height="40" rx="20" fill="#4a73bf"/>
      <line x1="168" y1="264" x2="742" y2="264" class="belt-dash" stroke="#8fb4ee" stroke-width="4" stroke-dasharray="12 12"/>
      ${caixas}
      ${comp('rolo', rolo(168, 282, 24))}${rotulo(168, 336, 'Rolo movido')}
      ${comp('tambor', rolo(740, 282, 30))}
      <g transform="translate(712 214)"><path d="M0 -16 L15 10 H-15 Z" fill="#e5484d"/><text y="7" text-anchor="middle" font-size="16" font-weight="900" fill="#fff">!</text></g>${rotulo(712, 186, 'Ponto de esmagamento')}
      ${comp('sensor', `<rect x="472" y="160" width="8" height="102" fill="#5b6a8f"/><rect x="458" y="150" width="36" height="28" rx="5" fill="#f5c242"/><circle cx="476" cy="172" r="5" fill="#e5484d"/><line x1="476" y1="180" x2="476" y2="262" stroke="#ff6b6b" stroke-width="3" stroke-dasharray="6 5" class="feixe"/>`)}
      ${comp('indutivo', `<rect x="776" y="274" width="38" height="18" rx="5" fill="#9cbcf2"/><rect x="770" y="277" width="8" height="12" fill="#6f9be0"/>`)}
      ${comp('motor', `<line x1="752" y1="398" x2="742" y2="312" stroke="#8d9bb8" stroke-width="7" stroke-dasharray="10 6" class="spin-dash"/><rect x="636" y="392" width="94" height="58" rx="8" fill="#8d9bb8"/><text x="683" y="429" text-anchor="middle" font-size="24" font-weight="900" fill="#1b2350">M</text><rect x="730" y="398" width="44" height="46" rx="5" fill="#6d7ca0"/>`)}
      ${rotulo(705, 476, 'Motor + redutor')}
      <rect x="850" y="120" width="132" height="330" rx="10" fill="#2a3470" stroke="#9cbcf2" stroke-width="2"/>${rotulo(916, 432, 'Painel')}
      ${comp('clp', `<rect x="866" y="140" width="100" height="64" rx="6" fill="#f5c242"/><text x="916" y="181" text-anchor="middle" font-size="24" font-weight="900" fill="#3a2a00">CLP</text>`)}
      ${comp('inversor', `<rect x="866" y="222" width="100" height="84" rx="6" fill="#8d9bb8"/><rect x="880" y="234" width="72" height="24" rx="3" fill="#1b2350"/><text x="916" y="252" text-anchor="middle" font-size="15" font-weight="800" fill="#9ff0c2">60 Hz</text><text x="916" y="290" text-anchor="middle" font-size="16" font-weight="800" fill="#1b2350">Inversor</text>`)}
      ${comp('rele', `<rect x="866" y="324" width="100" height="50" rx="6" fill="#ffb454"/><text x="916" y="355" text-anchor="middle" font-size="16" font-weight="900" fill="#3a2a00">Relé seg.</text>`)}
      <rect x="896" y="450" width="10" height="50" fill="#2c3c78"/><rect x="926" y="450" width="10" height="50" fill="#2c3c78"/>
      ${comp('ihm', `<rect x="64" y="250" width="12" height="250" fill="#5b6a8f"/><rect x="26" y="186" width="88" height="68" rx="8" fill="#1b2350" stroke="#9cbcf2" stroke-width="3"/><rect x="36" y="196" width="68" height="30" rx="3" fill="#2ecc71" opacity=".8"/><text x="70" y="246" text-anchor="middle" font-size="14" font-weight="800" fill="#fff">IHM</text>`)}
    </svg>`;
  }

  // ---------- montagem de cada slide (devolve o HTML do corpo) ----------
  const MONTAR = {
    capa: () => `
      <div class="capa-cena" aria-hidden="true">${cena()}</div>
      <div class="capa-texto">
        <p class="capa-kicker">Trabalho trimestral · Automação Segura</p>
        <h1 class="capa-titulo"><span class="contorno">ESTEIRA</span><span class="forte">SEGURA</span></h1>
        <p class="capa-sub">Como fazer uma esteira automatizada funcionar com segurança</p>
        <ul class="capa-equipe">${A.EQUIPE.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>
        <p class="capa-pe">${esc(A.ESCOLA)}<br>Disciplina: ${esc(A.DISCIPLINA)}<br>Processo escolhido: Esteira Automatizada</p>
        <p class="capa-dica">Aperte → para começar · <b>R</b> mostra o roteiro</p>
      </div>`,

    processo: () => `
      <div class="proc">
        <div>
          <p class="lead">Sistema eletromecânico que transporta, sem parar, matérias-primas, peças e produtos entre <b>produção</b>, <b>inspeção</b> e <b>embalagem</b>.</p>
          <div class="tipos-esteira">${A.TIPOS.map((t) => `<figure class="tipo-esteira">${svgTipo(t.icone)}<figcaption>${esc(t.nome)}</figcaption></figure>`).join('')}</div>
        </div>
        <div>
          <h3 class="sub">Onde aparece na indústria</h3>
          <ul class="aplic">${A.APLICACOES.map((a) => `<li><b>${esc(a.nome)}</b>${esc(a.texto)}</li>`).join('')}</ul>
        </div>
      </div>
      <div class="pergunta"><span>Pergunta norteadora</span><p>${esc(A.PERGUNTA)}</p></div>`,

    funcionamento: () => `
      <div class="func">
        <div class="func-diag">${diagrama()}</div>
        <aside class="func-info" aria-live="polite">
          <div class="func-txt"></div>
          <div class="comp-lista">${Object.entries(A.COMPONENTES).map(([id, c]) => `<button type="button" data-comp="${id}">${esc(c.nome)}</button>`).join('')}</div>
        </aside>
      </div>`,

    conceitos: () => {
      const cartoes = [
        { t: 'Perigo', cor: 'verm', def: 'Fonte ou condição com potencial de causar dano.', ex: 'O movimento rotativo do tambor de tração e a energia elétrica do painel.' },
        { t: 'Exposição', cor: 'amar', def: 'Como a pessoa entra em contato com o perigo.', ex: 'O operador põe a mão na área em movimento para desobstruir uma carga.' },
        { t: 'Risco', cor: 'lar', def: 'Probabilidade × gravidade.', ex: 'A chance de esmagamento e amputação no contato com o rolo em movimento.' }
      ];
      return `<div class="flips">${cartoes.map((c, i) => `
          <button type="button" class="flip ${c.cor}" aria-pressed="false">
            <span class="flip-frente"><span class="flip-n">${i + 1}</span><span class="flip-t">${c.t}</span><span class="flip-dica">toque para ver</span></span>
            <span class="flip-verso"><span class="flip-t2">${c.t}</span><span class="flip-def">${c.def}</span><span class="flip-ex"><b>Na esteira:</b> ${c.ex}</span></span>
          </button>`).join('')}</div>
        <p class="formula">Risco = <b>Probabilidade</b> × <b>Gravidade</b></p>`;
    },

    mapa: () => {
      const cats = ['Todos', 'Mecânico', 'Elétrico', 'Cinemático', 'Ergonômico', 'Físico', 'Incêndio'];
      return `<div class="mapa">
          <div>
            <div class="mapa-cena">${cena()}</div>
            <div class="mapa-pe">
              <span><i class="leg-grave"></i> borda vermelha: prioridade alta</span>
              <span><span class="auto-sim">${IC.engrenagem}</span> solução por automação</span>
              <button type="button" class="btn-revelar">Revelar o problema escondido</button>
            </div>
          </div>
          <aside class="mapa-lado">
            <div class="filtros-cat" role="group" aria-label="Filtrar por tipo">${cats.map((c, i) => `<button type="button" data-cat="${c}" aria-pressed="${i === 0}">${c}</button>`).join('')}</div>
            <div class="det" aria-live="polite"></div>
          </aside>
        </div>`;
    },

    quadro: () => `
      <table class="quadro-tab">
        <thead><tr><th>Tipo</th><th>Perigo / fonte</th><th>Onde está?</th><th>Quem está exposto?</th><th>Possível consequência</th><th>No infográfico</th></tr></thead>
        <tbody>${A.QUADRO.map((l) => {
          const ids = PROBLEMAS.filter((p) => p.categoria.includes(l.cat)).map((p) => p.id);
          const oculto = ids.every((id) => id === ESCONDIDO.id);
          return `<tr class="${oculto ? 'linha-escondida' : ''}">
            <td><span class="cat-badge" data-cat="${l.cat}">${l.cat}</span></td>
            <td class="${oculto ? 'spoiler' : ''}"><b>${esc(l.perigo)}</b></td><td class="${oculto ? 'spoiler' : ''}">${esc(l.onde)}</td>
            <td class="${oculto ? 'spoiler' : ''}">${esc(l.quem)}</td><td class="${oculto ? 'spoiler' : ''}">${esc(l.consequencia)}</td>
            <td><span class="pchips">${ids.map(pchip).join('')}</span></td></tr>`;
        }).join('')}</tbody>
      </table>
      <p class="nota-slide">Toque em um número para ver o problema no mapa. Fonte: tabela "Identificação dos perigos" do trabalho, com os tipos que o infográfico acrescentou.</p>`,

    acidente: () => `
      <div class="acid">
        <div>
          <div class="ap-anim">${CENAS[1].perigo()}</div>
          <p class="ap-anim-leg">Animação: como o acidente acontece</p>
          <p class="fonte">Fonte: ${esc(A.ACIDENTE.fonte)}, caso analisado no trabalho.</p>
        </div>
        <div>
          <ol class="linha-tempo">${A.ACIDENTE.passos.map((t, i) => `<li data-passo${i === 3 ? ' class="grave"' : ''}>${esc(t)}</li>`).join('')}</ol>
          <div class="falhas" data-passo>
            <h3 class="sub">Três falhas ao mesmo tempo</h3>
            <ul>${A.ACIDENTE.perigos.map((f, i) => `<li><button type="button" data-ir-slide="melhoria${i + 1}">${IC.xis}<span>${esc(f.texto)}</span><em>vira a melhoria ${i + 1}</em></button></li>`).join('')}</ul>
          </div>
        </div>
      </div>`,

    pecem: () => {
      const caso = porId(2).referencias.find((r) => r.tipo === 'caso');
      const bristol = porId(3).referencias.find((r) => r.tipo === 'caso');
      const cerest = porId(1).referencias.find((r) => r.tipo === 'caso' && r.url);
      return `<div class="pecem">
          <article class="caso-card principal">
            <p class="caso-data">${esc(caso.data)} · Porto do Pecém (CE)</p>
            <p class="caso-txt">Um trabalhador terceirizado de <b>23 anos</b> fazia manutenção com a esteira de carvão funcionando, foi puxado para dentro do equipamento e <b>morreu no local</b>.</p>
            <h3 class="sub">O que a fiscalização encontrou</h3>
            <ul class="achados">${A.PECEM.achados.map((a) => `<li data-passo>${IC.xis}<span>${esc(a.texto)}</span>${pchip(a.problema)}</li>`).join('')}</ul>
            <p class="caso-res" data-passo><b>Esteira interditada.</b> Exigências: ${esc(A.PECEM.exigencias)}</p>
            <p class="fonte">Fonte: <a href="${esc(caso.url)}" target="_blank" rel="noopener">${esc(caso.fonte)}</a></p>
          </article>
          <div class="pecem-lado">
            <p class="pecem-lema">Os mesmos erros, em lugares diferentes:</p>
            <article class="caso-card">
              <p class="caso-data">jan/2024 · Bristol (Reino Unido)</p>
              <p>Ao desobstruir uma esteira, o trabalhador escorregou e teve o braço puxado na ponta sem proteção: fraturas e lesão de nervos. Multa de £64.666.</p>
              <p class="fonte">Fonte: <a href="${esc(bristol.url)}" target="_blank" rel="noopener">${esc(bristol.fonte)}</a></p>
            </article>
            <article class="caso-card">
              <p class="caso-data">Cerâmica · Piracicaba (SP)</p>
              <p>Um trabalhador teve o braço direito amputado ao verificar um defeito com a esteira em movimento.</p>
              <p class="fonte">Fonte: <a href="${esc(cerest.url)}" target="_blank" rel="noopener">${esc(cerest.fonte)}</a></p>
            </article>
          </div>
        </div>`;
    },

    nrs: () => `
      <div class="nrs-sl">
        <div class="nr-grade" role="group" aria-label="Normas">${A.NR_GRUPOS.map((g, i) => `
          <button type="button" class="nr-btn" data-grupo="${i}" aria-pressed="${i === 0}"><b>${g.nrs.join(' · ')}</b><span>${esc(g.rotulo)}</span></button>`).join('')}
        </div>
        <div class="nr-det" aria-live="polite"></div>
      </div>`,

    hierarquia: () => `
      <div class="hier">
        <div class="piramide">
          ${HIERARQUIA.map((h, i) => `<button type="button" class="nivel n${i + 1}" data-nivel="${i}" aria-pressed="${i === 1}"><b>${i + 1}</b><span>${esc(h)}</span></button>`).join('')}
          <span class="eficacia">mais eficaz</span>
        </div>
        <div class="hier-det" aria-live="polite"></div>
      </div>
      <p class="pergunta-mini">"O foco das soluções de engenharia é aplicar intertravamentos e proteções coletivas, minimizando a dependência exclusiva de EPIs." <span>NR-1, item 1.4.1, alínea g</span></p>`,

    melhoria: (slide) => {
      const p = porId(slide.problema);
      const m = A.MELHORIAS[slide.problema];
      return `<div class="mel">
          <div>
            <div class="seg" role="group" aria-label="Antes ou depois">
              <button type="button" data-modo="perigo" aria-pressed="true">Antes</button>
              <button type="button" data-modo="seguro" aria-pressed="false">Depois</button>
            </div>
            <div class="ap-anim">${CENAS[p.id].perigo()}</div>
            <p class="ap-anim-leg">Antes: como o acidente acontece</p>
            <i class="passo-acao" data-passo></i>
          </div>
          <div class="mel-texto">
            <div class="mel-linha"><span class="rot verm">Problema</span><p>${esc(m.problema)}</p></div>
            <div class="mel-linha"><span class="rot verde">Controle</span><p>${esc(m.controle)}</p></div>
            <p class="como"><b>Como reduz o risco:</b> ${esc(m.como)}</p>
            ${cadeia(p)}
            <p class="mel-pe"><span class="prio ${m.prioridade === 'Alta' ? 'alta' : ''}">Prioridade ${esc(m.prioridade)}</span> ${esc(m.nr)} · problema ${pchip(p.id)} do infográfico</p>
          </div>
        </div>`;
    },

    medidas: () => `
      <div class="med">
        <div>
          <div class="tiles">${PROBLEMAS.map((p) => `
            <button type="button" class="tile${p.prioridade === 'Alta' ? ' grave' : ''}${p.escondido ? ' escondido' : ''}" data-tile="${p.id}">
              <b>${p.id}</b>${seloAuto(p)}<span class="${p.escondido ? 'spoiler' : ''}">${esc(p.curto)}</span>
            </button>`).join('')}</div>
          <div class="tile-det" aria-live="polite"><p class="dica-sl">Toque em um problema para ver a solução. <span class="auto-sim">${IC.engrenagem}</span> automação · <span class="meia"></span> parcial · sem selo: sem automação</p></div>
        </div>
        <div class="loto">
          <h3 class="sub">Manutenção: bloqueio e etiquetagem (LOTO)</h3>
          <ol>${A.LOTO.map((l) => `<li data-passo><b>${esc(l.t)}</b>${esc(l.d)}</li>`).join('')}</ol>
        </div>
      </div>`,

    matriz: () => {
      const rot = ['Baixa', 'Média', 'Alta'];
      let celulas = '';
      for (let g = 3; g >= 1; g--) for (let pr = 1; pr <= 3; pr++) celulas += `<div class="celula ${nivel([pr, g])}"><span>${pr * g}</span></div>`;
      return `<div class="mat">
          <div class="mat-area">
            <div class="mat-y">${rot.slice().reverse().map((r) => `<span>${r}</span>`).join('')}<b>Gravidade</b></div>
            <div class="mat-grade">${celulas}
              ${PROBLEMAS.map((p) => `<button type="button" class="ponto" data-ponto="${p.id}" title="${esc(p.titulo)}">${p.id}</button>`).join('')}
            </div>
            <div class="mat-x">${rot.map((r) => `<span>${r}</span>`).join('')}<b>Probabilidade</b></div>
          </div>
          <aside class="mat-lado">
            <div class="seg" role="group" aria-label="Antes ou depois">
              <button type="button" data-modo="antes" aria-pressed="true">Antes</button>
              <button type="button" data-modo="depois" aria-pressed="false">Com as melhorias</button>
            </div>
            <i class="passo-acao" data-passo></i>
            <ul class="mat-cont"></ul>
            <div class="mat-det" aria-live="polite"></div>
            <p class="nota-slide">Estimativa qualitativa da equipe, a partir dos casos reais e das NRs. As proteções reduzem sobretudo a probabilidade; a gravidade só cai quando a medida limita o dano.</p>
          </aside>
        </div>`;
    },

    numeros: () => {
      const cont = (campo, valor) => PROBLEMAS.filter((p) => p[campo] === valor).length;
      const nrs = new Set(PROBLEMAS.flatMap(nrsDe).concat('NR-1'));
      const altosAntes = Object.values(A.RISCO).filter((r) => nivel(r.antes) === 'alto').length;
      const altosDepois = Object.values(A.RISCO).filter((r) => nivel(r.depois) === 'alto').length;
      const barra = (itens) => `<div class="barra-emp">${itens.map(([n, rot, cls]) => `<span class="${cls}" style="flex:${n}"><b>${n}</b> ${rot}</span>`).join('')}</div>`;
      return `<div class="nums">
          <div class="stat"><b data-conta="${PROBLEMAS.length}">${PROBLEMAS.length}</b><span>problemas encontrados<br>(13 no mapa + 1 escondido)</span></div>
          <div class="stat"><b data-conta="${nrs.size}">${nrs.size}</b><span>normas regulamentadoras aplicadas</span></div>
          <div class="stat verde"><b><span data-conta="${altosAntes}">${altosAntes}</span> → <span data-conta="${altosDepois}">${altosDepois}</span></b><span>problemas com risco alto,<br>antes → depois</span></div>
          <div class="stat largo"><h3 class="sub">Solução por automação</h3>${barra([[cont('automacao', 'sim'), 'com automação', 'sim'], [cont('automacao', 'parcial'), 'parcial', 'parcial'], [cont('automacao', 'nao'), 'sem', 'nao']])}</div>
          <div class="stat largo"><h3 class="sub">Prioridade</h3>${barra([[cont('prioridade', 'Alta'), 'alta', 'alta'], [cont('prioridade', 'Média'), 'média', 'media'], [cont('prioridade', 'Baixa'), 'baixa', 'baixa']])}</div>
          <div class="stat largo limites"><h3 class="sub">O que a automação não resolve sozinha</h3>
            <ul>
              <li>${pchip(12)} Travessia: a solução é uma passarela com guarda-corpo.</li>
              <li>${pchip(ESCONDIDO.id)} <span class="spoiler">Extintor bloqueado: organização e inspeção.</span></li>
              <li>${pchip(5)} LOTO: a automação confirma a energia zero, mas o cadeado é posto por uma pessoa.</li>
            </ul>
          </div>
        </div>`;
    },

    conclusao: () => `
      <p class="pergunta-mini">${esc(A.PERGUNTA)}</p>
      <div class="concl">${A.CONCLUSAO.map((c, i) => `<article data-passo><b>${i + 1}</b><h3>${esc(c.t)}</h3><p>${esc(c.d)}</p></article>`).join('')}</div>
      <div class="concl-fim" data-passo>
        <div class="concl-cena" aria-hidden="true">${cena()}</div>
        <div class="selo-texto">
          <div class="selo-linha">${IC.escudo}<b>ESTEIRA 100% SEGURA</b></div>
          <p>A automação não substitui as pessoas: ela tira as pessoas da zona de perigo e para a máquina antes do acidente. O que sobra (manutenção, organização e treinamento) depende de todos nós.</p>
        </div>
      </div>`,

    fim: () => `
      <div class="fim">
        <div>
          <p class="lead">Abram o infográfico, corrijam os <b>13 problemas</b> e depois encontrem o <b>escondido</b>.</p>
          <a class="btn-grande" href="index.html" target="_blank" rel="noopener">Abrir o infográfico ${IC.externo}</a>
          <p class="obrigado">Obrigado!</p>
          <ul class="capa-equipe">${A.EQUIPE.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>
        </div>
        <div class="refs">
          <h3 class="sub">Referências principais</h3>
          <ul>${A.REFERENCIAS.map((r) => `<li><b>${r.url ? `<a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.titulo)}</a>` : esc(r.titulo)}</b><span>${esc(r.fonte)}</span></li>`).join('')}</ul>
          <p class="nota-slide">Todas as fontes de cada problema estão no infográfico (aba "O caso").</p>
        </div>
      </div>`
  };

  // ---------- interações de cada slide (devolvem, se precisarem, uma função chamada a cada passo) ----------
  const LIGAR = {
    funcionamento(el) {
      const txt = $('.func-txt', el);
      const padrao = '<h3>Toque em uma peça</h3><p>O <b>sensor</b> vê a caixa, o <b>CLP</b> decide, o <b>inversor</b> controla a velocidade e o <b>motor</b> puxa a correia pelo tambor de tração.</p><p class="seg-txt">Os pontos amarelos são o sinal andando pelos fios.</p>';
      txt.innerHTML = padrao;
      const escolher = (id) => {
        $$('[data-comp]', el).forEach((c) => c.classList.toggle('sel', c.dataset.comp === id));
        const c = A.COMPONENTES[id];
        txt.innerHTML = `<h3>${esc(c.nome)}</h3><p>${esc(c.texto)}</p><p class="seg-txt"><b>Segurança:</b> ${esc(c.seg)}</p>`;
      };
      $$('[data-comp]', el).forEach((c) => {
        c.addEventListener('click', () => escolher(c.dataset.comp));
        c.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); escolher(c.dataset.comp); } });
      });
    },

    conceitos(el) {
      $$('.flip', el).forEach((b) => b.addEventListener('click', () => b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true')));
    },

    mapa(el) {
      const palco = $('.mapa-cena', el);
      const det = $('.det', el);
      const pins = {};
      const criarPin = (p) => {
        const pos = window.CENA.telaParaPercentual(p.id);
        const b = document.createElement('button');
        b.type = 'button';
        b.className = p.prioridade === 'Alta' ? 'pin grave' : 'pin';
        b.style.left = pos.left + '%';
        b.style.top = pos.top + '%';
        b.innerHTML = `<span class="pin-ic">${IC.alerta}</span><span class="num">${p.id}</span>${p.automacao === 'nao' ? '' : `<span class="auto ${p.automacao === 'parcial' ? 'parcial' : ''}">${p.automacao === 'sim' ? IC.engrenagem : ''}</span>`}`;
        b.setAttribute('aria-label', `${p.id}. ${p.titulo}`);
        b.addEventListener('click', () => selecionar(p.id));
        palco.appendChild(b);
        pins[p.id] = b;
      };
      PROBLEMAS.filter((p) => !p.escondido).forEach(criarPin);

      const resumo = () => {
        const cats = {};
        PROBLEMAS.filter((p) => !p.escondido).forEach((p) => p.categoria.split('/').forEach((c) => { c = c.trim(); cats[c] = (cats[c] || 0) + 1; }));
        det.innerHTML = `<h3>Toque em um alerta</h3><p>Cada alerta é um problema ligado diretamente à esteira.</p>
          <ul class="det-resumo">${Object.entries(cats).map(([c, n]) => `<li><span class="cat-badge" data-cat="${c}">${c}</span><b>${n}</b></li>`).join('')}</ul>`;
      };
      const selecionar = (id) => {
        const p = porId(id);
        if (p.escondido) revelarEscondido();
        Object.entries(pins).forEach(([k, b]) => b.classList.toggle('sel', +k === id));
        det.innerHTML = `<p class="det-num">Problema ${p.id} · ${esc(p.categoria)}</p>
          <h3>${esc(p.titulo)}</h3>
          <p class="det-tags"><span class="tag">${esc(p.nr)}</span><span class="tag ${p.prioridade === 'Alta' ? 'alta' : ''}">Prioridade ${esc(p.prioridade)}</span></p>
          <div class="ap-anim">${CENAS[p.id].perigo()}</div>
          <dl><dt>Onde</dt><dd>${esc(p.onde)}</dd><dt>Quem fica exposto</dt><dd>${esc(p.quem)}</dd><dt>Consequência</dt><dd>${esc(p.consequencia)}</dd></dl>`;
        reiniciarAnim(det);
      };
      const filtrar = (cat) => {
        $$('[data-cat]', $('.filtros-cat', el)).forEach((b) => b.setAttribute('aria-pressed', b.dataset.cat === cat));
        Object.entries(pins).forEach(([k, b]) => b.classList.toggle('apagado', cat !== 'Todos' && !porId(+k).categoria.includes(cat)));
      };
      $$('.filtros-cat button', el).forEach((b) => b.addEventListener('click', () => filtrar(b.dataset.cat)));
      $('.btn-revelar', el).addEventListener('click', () => selecionar(ESCONDIDO.id));
      ouvirRevelado(() => { if (!pins[ESCONDIDO.id]) { criarPin(ESCONDIDO); $('.btn-revelar', el).hidden = true; } });
      resumo();
      el.selecionarProblema = selecionar;
    },

    nrs(el) {
      const det = $('.nr-det', el);
      const itensDe = (nr) => {
        const itens = new Map();
        Object.entries(NR_ITENS).forEach(([pid, lista]) => lista.forEach((it) => {
          if (it.nr !== nr) return;
          if (!itens.has(it.item)) itens.set(it.item, { ...it, problemas: [] });
          itens.get(it.item).problemas.push(+pid);
        }));
        return [...itens.values()];
      };
      const mostrar = (i) => {
        const g = A.NR_GRUPOS[i];
        $$('.nr-btn', el).forEach((b) => b.setAttribute('aria-pressed', +b.dataset.grupo === i));
        const probs = g.todos ? PROBLEMAS : PROBLEMAS.filter((p) => nrsDe(p).some((n) => g.nrs.includes(n)));
        const soEscondido = probs.length > 0 && probs.every((p) => p.escondido);
        det.innerHTML = g.nrs.map((nr) => {
          const f = FICHAS[nr];
          const itens = itensDe(nr);
          return `<section class="nr-bloco">
              <h3><span class="nr-cod">${nr}</span> ${esc(f.nome)}</h3>
              <p>${esc(g.trabalho && g.nrs.length === 1 ? g.trabalho : f.sobre)}</p>
              ${itens.length ? `<ul class="nr-itens${soEscondido ? ' spoiler' : ''}">${itens.map((it) => `<li><span class="nr-item">${esc(it.item)}</span><span>${esc(it.texto)}</span><span class="pchips">${it.problemas.map(pchip).join('')}</span></li>`).join('')}</ul>` : ''}
              <a class="nr-link" href="${esc(f.url)}" target="_blank" rel="noopener">Texto oficial no gov.br ${IC.externo}</a>
            </section>`;
        }).join('') + (g.todos ? `<p class="nr-todos">Vale para os ${PROBLEMAS.length} problemas: cada um precisa estar no PGR com o seu plano de ação.</p>` : '');
        det.scrollTop = 0;
      };
      $$('.nr-btn', el).forEach((b) => b.addEventListener('click', () => mostrar(+b.dataset.grupo)));
      mostrar(0);
    },

    hierarquia(el) {
      const det = $('.hier-det', el);
      const mostrar = (i) => {
        $$('.nivel', el).forEach((b) => b.setAttribute('aria-pressed', +b.dataset.nivel === i));
        const ex = A.HIERARQUIA_EXEMPLOS[i];
        det.innerHTML = `<p class="det-num">Nível ${i + 1}</p><h3>${esc(HIERARQUIA[i])}</h3>
          <ul>${ex.itens.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
          <p class="det-probs">Problemas do infográfico: <span class="pchips">${ex.problemas.map(pchip).join('')}</span></p>`;
      };
      $$('.nivel', el).forEach((b) => b.addEventListener('click', () => mostrar(+b.dataset.nivel)));
      mostrar(1);
    },

    melhoria(el, slide) {
      const caixa = $('.ap-anim', el);
      const leg = $('.ap-anim-leg', el);
      const modo = (m) => {
        $$('.seg button', el).forEach((b) => b.setAttribute('aria-pressed', b.dataset.modo === m));
        caixa.innerHTML = CENAS[slide.problema][m]();
        leg.textContent = m === 'seguro' ? 'Depois: a melhoria funcionando' : 'Antes: como o acidente acontece';
        caixa.classList.toggle('seguro', m === 'seguro');
        reiniciarAnim(caixa);
      };
      $$('.seg button', el).forEach((b) => b.addEventListener('click', () => definirPassos(indice(slide.id), b.dataset.modo === 'seguro' ? 1 : 0)));
      return (n) => modo(n > 0 ? 'seguro' : 'perigo');
    },

    medidas(el) {
      const det = $('.tile-det', el);
      $$('.tile', el).forEach((b) => b.addEventListener('click', () => {
        const p = porId(+b.dataset.tile);
        $$('.tile', el).forEach((t) => t.classList.toggle('sel', t === b));
        if (p.escondido && !revelado) {
          det.innerHTML = '<h3>Problema escondido</h3><p>A turma descobre no infográfico, no fim da apresentação.</p>';
          return;
        }
        det.innerHTML = `<h3>${p.id}. ${esc(p.titulo)}</h3>
          <ul>${p.solucao.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
          <p class="como"><b>Como reduz o risco:</b> ${esc(p.comoReduz)}</p>`;
      }));
    },

    matriz(el) {
      const grade = $('.mat-grade', el);
      const det = $('.mat-det', el);
      const cont = $('.mat-cont', el);
      const CEL_W = 216, CEL_H = 166, PASSO = 50;
      let fase = 'antes';
      const posicionar = () => {
        const grupos = {};
        PROBLEMAS.forEach((p) => {
          const [pr, g] = A.RISCO[p.id][fase];
          const k = pr + '-' + g;
          const i = (grupos[k] = (grupos[k] || 0) + 1) - 1;
          const b = $(`[data-ponto="${p.id}"]`, grade);
          b.style.left = ((pr - 1) * CEL_W + 14 + (i % 4) * PASSO) + 'px';
          b.style.top = ((3 - g) * CEL_H + 14 + Math.floor(i / 4) * (PASSO + 4)) + 'px';
          b.style.transitionDelay = (p.id * 0.04) + 's';
          b.className = 'ponto ' + nivel(A.RISCO[p.id][fase]);
        });
        const conta = (f, nv) => Object.values(A.RISCO).filter((r) => nivel(r[f]) === nv).length;
        cont.innerHTML = [['alto', 'Risco alto'], ['medio', 'Risco médio'], ['baixo', 'Risco baixo']].map(([nv, rot]) =>
          `<li class="${nv}"><span>${rot}</span><b>${conta('antes', nv)}</b>${fase === 'depois' ? ` → <b>${conta('depois', nv)}</b>` : ''}</li>`).join('');
      };
      $$('.ponto', grade).forEach((b) => b.addEventListener('click', () => {
        const p = porId(+b.dataset.ponto);
        const r = A.RISCO[p.id];
        const txt = (pg) => `P${pg[0]} × G${pg[1]} = ${pg[0] * pg[1]}`;
        det.innerHTML = `<h3>${p.id}. <span class="${p.escondido ? 'spoiler' : ''}">${esc(p.titulo)}</span></h3><p>Antes: <b>${txt(r.antes)}</b> · Depois: <b>${txt(r.depois)}</b></p>`;
      }));
      $$('.seg button', el).forEach((b) => b.addEventListener('click', () => definirPassos(indice('matriz'), b.dataset.modo === 'depois' ? 1 : 0)));
      posicionar();
      return (n) => {
        fase = n > 0 ? 'depois' : 'antes';
        $$('.seg button', el).forEach((b) => b.setAttribute('aria-pressed', b.dataset.modo === fase));
        posicionar();
      };
    },

    conclusao(el) {
      const total = $$('[data-passo]', el).length;
      // no último passo a esteira do fundo fica toda corrigida
      return (n) => $$('.concl-cena .prob', el).forEach((g) => g.classList.toggle('fixed', n >= total));
    }
  };

  // ---------- problema escondido: some dos textos até alguém revelar no mapa ----------
  let revelado = false;
  const aoRevelar = [];
  const ouvirRevelado = (fn) => aoRevelar.push(fn);
  function revelarEscondido() {
    if (revelado) return;
    revelado = true;
    document.body.classList.add('escondido-revelado');
    aoRevelar.forEach((fn) => fn());
  }

  // ---------- montagem ----------
  const SLIDES = A.SLIDES;
  const cont = $('#slides');
  const indice = (id) => SLIDES.findIndex((s) => s.id === id);
  const aoPasso = [];

  SLIDES.forEach((s, i) => {
    const el = document.createElement('section');
    const sec = A.SECOES[s.secao - 1];
    el.className = `sl sl-${s.id}`;
    el.dataset.id = s.id;
    el.setAttribute('aria-roledescription', 'slide');
    el.setAttribute('aria-label', `${i + 1} de ${SLIDES.length}: ${s.titulo}`);
    if (sec) el.style.setProperty('--cor-sec', sec.cor);
    const tipo = s.problema ? 'melhoria' : s.id;
    const corpo = MONTAR[tipo](s);
    el.innerHTML = s.id === 'capa' ? corpo : `
      <header class="sl-topo">
        <span class="sl-sec"><b>${sec.n}</b>${esc(sec.titulo)}</span>
        ${s.problema ? `<span class="sl-kicker">Melhoria ${A.MELHORIAS[s.problema].n} de 3</span>` : ''}
      </header>
      <h2 class="sl-titulo">${esc(s.titulo)}</h2>
      <div class="sl-corpo">${corpo}</div>`;
    cont.appendChild(el);
    const ligar = LIGAR[tipo];
    aoPasso[i] = (ligar && ligar(el, s)) || null;
  });
  const slidesEl = $$('.sl', cont);

  // ---------- animações: só o slide atual se mexe ----------
  const svgsRaiz = (el) => $$('svg', el).filter((s) => !s.parentElement.closest('svg'));
  function reiniciarAnim(el) {
    svgsRaiz(el).forEach((s) => {
      if (!s.setCurrentTime) return;
      s.setCurrentTime(0);
      if (movimentoReduzido()) s.pauseAnimations(); else s.unpauseAnimations();
    });
  }
  function pausar(el, sim) {
    el.classList.toggle('pausado', sim);
    svgsRaiz(el).forEach((s) => { if (s.pauseAnimations) { if (sim || movimentoReduzido()) s.pauseAnimations(); else s.unpauseAnimations(); } });
  }

  // números que contam do zero quando o slide aparece
  function contar(el) {
    $$('[data-conta]', el).forEach((n) => {
      const alvo = +n.dataset.conta;
      if (movimentoReduzido()) { n.textContent = alvo; return; }
      const t0 = performance.now();
      const passo = (t) => {
        const k = Math.min(1, (t - t0) / 900);
        n.textContent = Math.round(alvo * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(passo);
      };
      requestAnimationFrame(passo);
    });
  }

  // ---------- passos e navegação ----------
  let atual = -1;
  const passos = SLIDES.map(() => 0);
  const totalPassos = (i) => $$('[data-passo]', slidesEl[i]).length;

  function definirPassos(i, n) {
    passos[i] = Math.max(0, Math.min(n, totalPassos(i)));
    $$('[data-passo]', slidesEl[i]).forEach((f, k) => f.classList.toggle('visto', k < passos[i]));
    if (aoPasso[i]) aoPasso[i](passos[i]);
  }

  function irPara(i, { fim = false } = {}) {
    i = Math.max(0, Math.min(SLIDES.length - 1, i));
    const mudou = i !== atual;
    atual = i;
    slidesEl.forEach((el, k) => {
      el.classList.toggle('atual', k === i);
      el.classList.toggle('antes', k < i);
      el.inert = k !== i;
      pausar(el, k !== i);
    });
    if (mudou) {
      definirPassos(i, fim ? totalPassos(i) : 0);
      reiniciarAnim(slidesEl[i]);
      contar(slidesEl[i]);
    }
    atualizarBarra();
    const hash = '#' + (i + 1);
    if (location.hash !== hash) history.replaceState(null, '', hash);
  }

  function avancar() {
    if (passos[atual] < totalPassos(atual)) definirPassos(atual, passos[atual] + 1);
    else irPara(atual + 1);
  }
  function voltar() {
    if (passos[atual] > 0) definirPassos(atual, passos[atual] - 1);
    else if (atual > 0) irPara(atual - 1, { fim: true });
  }

  function irProblema(id) {
    const i = indice('mapa');
    irPara(i);
    slidesEl[i].selecionarProblema(id);
  }

  // ---------- barra de baixo, índice e roteiro ----------
  const progresso = $('#ap-progresso');
  progresso.innerHTML = A.SECOES.map((s) => {
    const n = SLIDES.filter((x) => x.secao === s.n).length;
    return `<button type="button" class="ap-seg" data-secao="${s.n}" style="flex:${n};--cor-sec:${s.cor}" title="${s.n}. ${esc(s.titulo)}"><i></i></button>`;
  }).join('');
  $$('.ap-seg', progresso).forEach((b) => b.addEventListener('click', () => irPara(SLIDES.findIndex((s) => s.secao === +b.dataset.secao))));

  const roteiro = $('#ap-roteiro');
  function atualizarBarra() {
    const s = SLIDES[atual];
    $('#ap-cont').textContent = `${atual + 1} / ${SLIDES.length}`;
    $$('.ap-seg', progresso).forEach((b) => {
      const sec = +b.dataset.secao;
      const daSecao = SLIDES.map((x, k) => [x, k]).filter(([x]) => x.secao === sec);
      const feitos = daSecao.filter(([, k]) => k <= atual).length;
      b.querySelector('i').style.width = (feitos / daSecao.length) * 100 + '%';
      b.classList.toggle('atual', sec === s.secao);
    });
    $('#ap-roteiro-tit').textContent = `Roteiro · ${s.titulo}`;
    $('#ap-roteiro-txt').textContent = s.roteiro;
    $$('.ap-indice-lista button').forEach((b) => b.setAttribute('aria-current', +b.dataset.slide === atual ? 'true' : 'false'));
  }

  const alternarRoteiro = (abrir = roteiro.hidden) => {
    roteiro.hidden = !abrir;
    $('#ap-btn-roteiro').setAttribute('aria-pressed', abrir);
  };

  const indiceEl = $('#ap-indice');
  $('.ap-indice-lista').innerHTML = [{ n: 0, titulo: 'Capa' }].concat(A.SECOES).map((sec) => `
    <li><span class="ap-indice-sec" style="--cor-sec:${sec.cor || '#fff'}">${sec.n ? sec.n + '. ' : ''}${esc(sec.titulo)}</span>
      <ol>${SLIDES.map((s, k) => [s, k]).filter(([s]) => s.secao === sec.n).map(([s, k]) => `<li><button type="button" data-slide="${k}"><span>${k + 1}</span>${esc(s.titulo)}</button></li>`).join('')}</ol></li>`).join('');
  const alternarIndice = (abrir = indiceEl.hidden) => {
    indiceEl.hidden = !abrir;
    $('#ap-btn-menu').setAttribute('aria-expanded', abrir);
    if (abrir) $(`[data-slide="${atual}"]`, indiceEl).focus();
  };
  $$('.ap-indice-lista button').forEach((b) => b.addEventListener('click', () => { alternarIndice(false); irPara(+b.dataset.slide); }));
  indiceEl.addEventListener('click', (e) => { if (e.target === indiceEl) alternarIndice(false); });

  const telaCheia = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(() => {});
  };

  $('#ap-ant').addEventListener('click', voltar);
  $('#ap-prox').addEventListener('click', avancar);
  $('#ap-btn-menu').addEventListener('click', () => alternarIndice());
  $('#ap-btn-roteiro').addEventListener('click', () => alternarRoteiro());
  $('#ap-btn-tela').addEventListener('click', telaCheia);
  $('#ap-roteiro-fechar').addEventListener('click', () => alternarRoteiro(false));

  // links entre slides e para os problemas no mapa
  cont.addEventListener('click', (e) => {
    const ir = e.target.closest('[data-ir-problema]');
    if (ir) { irProblema(+ir.dataset.irProblema); return; }
    const sl = e.target.closest('[data-ir-slide]');
    if (sl) irPara(indice(sl.dataset.irSlide));
  });

  // teclado (inclui passador de slides, que manda PageDown/PageUp)
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const k = e.key;
    if (k === 'Escape') {
      if (!indiceEl.hidden) alternarIndice(false);
      else if (!roteiro.hidden) alternarRoteiro(false);
      return;
    }
    if (!indiceEl.hidden) return;
    const emBotao = e.target.closest && e.target.closest('button, a, [role="button"]');
    if (k === 'ArrowRight' || k === 'PageDown' || (k === ' ' && !emBotao)) { e.preventDefault(); avancar(); }
    else if (k === 'ArrowLeft' || k === 'PageUp') { e.preventDefault(); voltar(); }
    else if (k === 'Home') { e.preventDefault(); irPara(0); }
    else if (k === 'End') { e.preventDefault(); irPara(SLIDES.length - 1); }
    else if (k === 'r' || k === 'R') alternarRoteiro();
    else if (k === 'm' || k === 'M') alternarIndice();
    else if (k === 'f' || k === 'F') telaCheia();
  });

  // arrastar para os lados no celular
  let toque = null;
  cont.addEventListener('touchstart', (e) => { const t = e.touches[0]; toque = { x: t.clientX, y: t.clientY }; }, { passive: true });
  cont.addEventListener('touchend', (e) => {
    if (!toque) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - toque.x, dy = t.clientY - toque.y;
    toque = null;
    if (Math.abs(dx) > 60 && Math.abs(dy) < 50) (dx < 0 ? avancar : voltar)();
  });

  // ---------- palco 1600×900 escalado para caber na tela ----------
  const palco = $('#ap-palco');
  const escalar = () => palco.style.setProperty('--escala', Math.min(window.innerWidth / 1600, window.innerHeight / 900));
  window.addEventListener('resize', escalar);
  escalar();

  document.addEventListener('visibilitychange', () => { if (atual >= 0) pausar(slidesEl[atual], document.hidden); });
  window.addEventListener('hashchange', () => { const n = parseInt(location.hash.slice(1), 10); if (n && n - 1 !== atual) irPara(n - 1); });

  const inicial = parseInt(location.hash.slice(1), 10);
  irPara(inicial ? inicial - 1 : 0);
})();
