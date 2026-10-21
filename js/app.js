/*
 * Liga tudo: cenário, pins, painel da esquerda (menu + lista), telas, modal,
 * estado (localStorage), filtros, problema escondido e celebração.
 */
(function () {
  const PROBLEMAS = window.PROBLEMAS;
  const { CENAS, ICONES_NO } = window.ANIM;
  const CHAVE = 'esteira-segura-v2'; // v2: numeração nova (sem o robô)
  const VISIVEIS = PROBLEMAS.filter((p) => !p.escondido);
  const ESCONDIDO = PROBLEMAS.find((p) => p.escondido);
  const porId = (id) => PROBLEMAS.find((p) => p.id === id);
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const movimentoReduzido = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- ícones (SVG, sem emoji) ----------
  const IC = {
    alerta: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 L22 20 H2 Z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><path d="M12 9.5 v5 M12 17.2 v.3" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5 L10 17.5 L19 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    lupa: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M15.5 15.5 L21 21" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>',
    engrenagem: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5 l1.6 2.4 2.8-.8.5 2.9 2.8.9-.8 2.8 2.4 1.6-2.4 1.6.8 2.8-2.8.9-.5 2.9-2.8-.8L12 21.5l-1.6-2.4-2.8.8-.5-2.9-2.8-.9.8-2.8L2.7 12l2.4-1.6-.8-2.8 2.8-.9.5-2.9 2.8.8z" fill="currentColor"/><circle cx="12" cy="12" r="3.4" fill="#1b2350"/></svg>',
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5 v14 l11-7z" fill="currentColor"/></svg>',
    pausa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5 h3.5 v14 H7z M13.5 5 H17 v14 h-3.5z" fill="currentColor"/></svg>',
    repetir: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 12 a7.5 7.5 0 1 0 2.4-5.5 M4.5 4 v4.5 H9" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    fechar: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6 L18 18 M18 6 L6 18" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>',
    escudo: '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 2 L36 8 V20 C36 30 29 36 20 39 C11 36 4 30 4 20 V8 Z" fill="#2ecc71"/><path d="M12 20 l6 6 l11 -12" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    alertaCheio: '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 3 L38 35 H2 Z" fill="#f5c242" stroke-linejoin="round"/><path d="M20 14 v10 M20 29 v.5" stroke="#1b2350" stroke-width="4" stroke-linecap="round"/></svg>'
  };
  const icAuto = (p) => (p.automacao === 'sim' ? IC.engrenagem : p.automacao === 'parcial' ? '<span class="meia" aria-hidden="true"></span>' : '');
  const textoAuto = { sim: 'Resolvido com automação', parcial: 'Automação parcial', nao: 'Sem automação' };

  // ---------- estado (salvo no localStorage) ----------
  let estado = { resolvidos: [], escondidoLiberado: false };
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE) || 'null');
    if (salvo && Array.isArray(salvo.resolvidos)) estado = { ...estado, ...salvo };
  } catch (e) { /* sem storage: segue sem salvar */ }
  const salvar = () => { try { localStorage.setItem(CHAVE, JSON.stringify(estado)); } catch (e) { /* ignora */ } };
  const resolvido = (id) => estado.resolvidos.includes(id);
  const todosVisiveisResolvidos = () => VISIVEIS.every((p) => resolvido(p.id));

  // ---------- cenário + pins ----------
  const palco = $('#palco');
  palco.innerHTML = window.CENA.montar();

  const pins = {};
  VISIVEIS.forEach((p) => {
    const pos = window.CENA.telaParaPercentual(p.id);
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'pin';
    b.style.left = pos.left + '%';
    b.style.top = pos.top + '%';
    b.dataset.id = p.id;
    b.addEventListener('click', () => abrir(p.id));
    palco.appendChild(b);
    pins[p.id] = b;
  });

  // alvo invisível do problema escondido
  const alvo = document.createElement('button');
  alvo.type = 'button';
  alvo.className = 'alvo-escondido';
  const posAlvo = window.CENA.telaParaPercentual(ESCONDIDO.id);
  alvo.style.left = posAlvo.left + '%';
  alvo.style.top = posAlvo.top + '%';
  alvo.addEventListener('click', () => { if (estado.escondidoLiberado) abrir(ESCONDIDO.id); });
  palco.appendChild(alvo);

  function desenharPin(p) {
    const b = pins[p.id];
    if (!b) return;
    const ok = resolvido(p.id);
    const auto = p.automacao === 'nao' ? '' : `<span class="auto ${p.automacao === 'parcial' ? 'parcial' : ''}" title="${textoAuto[p.automacao]}">${p.automacao === 'sim' ? IC.engrenagem : ''}</span>`;
    b.classList.toggle('resolvido', ok);
    b.innerHTML = `<span class="pin-ic">${ok ? IC.check : IC.alerta}</span><span class="num">${p.id}</span>${auto}`;
    b.setAttribute('aria-label', `${p.id}. ${p.titulo}${ok ? ' (resolvido)' : ''}`);
  }

  function aplicarCena() {
    PROBLEMAS.forEach((p) => {
      $$(`.prob[data-p="${p.id}"]`, palco).forEach((g) => g.classList.toggle('fixed', resolvido(p.id)));
      desenharPin(p);
    });
    const liberado = estado.escondidoLiberado && !resolvido(ESCONDIDO.id);
    alvo.classList.toggle('liberado', liberado);
    alvo.tabIndex = liberado ? 0 : -1;
    if (liberado) { alvo.removeAttribute('aria-hidden'); alvo.setAttribute('aria-label', 'Problema escondido'); }
    else { alvo.setAttribute('aria-hidden', 'true'); alvo.classList.remove('dica'); }
    $('#banner-escondido').hidden = !liberado;
  }

  // ---------- lista de problemas (painel da esquerda) ----------
  const legenda = $('#legenda');
  function desenharLegenda() {
    legenda.innerHTML = PROBLEMAS.map((p) => {
      const ok = resolvido(p.id);
      const ic = ok ? `<span style="color:var(--verde)">${IC.check}</span>` : p.escondido ? `<span style="color:var(--amarelo)">${IC.lupa}</span>` : `<span style="color:var(--amarelo)">${IC.alerta}</span>`;
      const cls = [ok ? 'resolvido' : '', p.escondido ? 'escondido' : '', p.escondido && estado.escondidoLiberado ? 'revelado' : ''].join(' ');
      const sub = ok ? 'Resolvido' : `Prioridade ${esc(p.prioridade.toLowerCase())} · ${esc(p.nr)}`;
      return `<li class="${cls}" data-id="${p.id}">
        <button type="button" data-abrir="${p.id}"><span class="ic">${ic}</span>
        <span class="t">${p.id}. ${esc(p.curto)}<small>${sub}</small></span>
        <span class="a" title="${textoAuto[p.automacao]}">${icAuto(p)}</span></button></li>`;
    }).join('');
    $$('[data-abrir]', legenda).forEach((b) => b.addEventListener('click', () => {
      if (window.innerWidth <= 900) recolherPainel(true);
      mostrarTela('jogo');
      abrir(+b.dataset.abrir);
    }));
    aplicarFiltro();
  }

  function atualizarResumo() {
    const total = estado.escondidoLiberado ? PROBLEMAS.length : VISIVEIS.length;
    const conta = estado.resolvidos.filter((id) => estado.escondidoLiberado || !porId(id).escondido).length;
    const auto = estado.resolvidos.filter((id) => porId(id).automacao !== 'nao').length;
    $('#cont-resolvidos').textContent = conta;
    $('#cont-total').textContent = total;
    $('#cont-auto').textContent = auto;
    $('#abrir-cont').textContent = `${conta}/${total}`;
  }

  function desenharTabela() {
    const rot = { sim: 'Sim', parcial: 'Parcial', nao: 'Não' };
    $('#tabela-auto tbody').innerHTML = PROBLEMAS.map((p) => {
      const c = p.cadeia || {};
      const cadeia = c.entrada ? `${esc(c.entrada)} → ${esc(c.logica)} → ${esc(c.saida)}` : esc(c.nota || '');
      const oculto = p.escondido && !estado.escondidoLiberado;
      return `<tr><td>${p.id}</td><td>${oculto ? 'Problema escondido' : esc(p.curto)}</td><td>${rot[p.automacao]}</td>` +
        `<td>${oculto ? `Descubra no infográfico depois de corrigir os ${VISIVEIS.length}.` : cadeia}</td></tr>`;
    }).join('');
  }

  // ---------- filtros ----------
  let filtro = 'todos';
  const passa = (p) => (filtro === 'auto' ? p.automacao !== 'nao' : filtro === 'outros' ? p.automacao === 'nao' : true);
  function aplicarFiltro() {
    VISIVEIS.forEach((p) => pins[p.id].classList.toggle('apagado', !passa(p)));
    $$('li', legenda).forEach((li) => li.classList.toggle('apagado', !passa(porId(+li.dataset.id))));
  }
  $$('.filtro').forEach((b) => b.addEventListener('click', () => {
    filtro = b.dataset.filtro;
    $$('.filtro').forEach((x) => { x.classList.toggle('ativo', x === b); x.setAttribute('aria-pressed', x === b); });
    aplicarFiltro();
  }));

  // ---------- painel da esquerda: recolher / abrir ----------
  const btnAbrirPainel = $('#painel-abrir');
  function recolherPainel(sim) {
    document.body.classList.toggle('painel-recolhido', sim);
    btnAbrirPainel.hidden = !sim;
    btnAbrirPainel.setAttribute('aria-expanded', String(!sim));
    setTimeout(centralizar, 320);
  }
  $('#painel-recolher').addEventListener('click', () => { recolherPainel(true); btnAbrirPainel.focus(); });
  btnAbrirPainel.addEventListener('click', () => { recolherPainel(false); $('#painel-recolher').focus(); });
  recolherPainel(window.innerWidth <= 900);

  // ---------- telas (menu) ----------
  function mostrarTela(nome) {
    const jogo = nome !== 'sobre';
    $('#tela-jogo').hidden = !jogo;
    $('#tela-sobre').hidden = jogo;
    document.body.classList.toggle('na-tela-jogo', jogo);
    document.body.classList.toggle('na-tela-sobre', !jogo);
    $$('.menu-item').forEach((b) => (b.dataset.tela === (jogo ? 'jogo' : 'sobre') ? b.setAttribute('aria-current', 'page') : b.removeAttribute('aria-current')));
    if (location.hash !== (jogo ? '' : '#sobre')) history.replaceState(null, '', jogo ? location.pathname + location.search : '#sobre');
    if (!jogo) window.scrollTo(0, 0);
    else setTimeout(centralizar, 50);
  }
  $$('.menu-item').forEach((b) => b.addEventListener('click', () => {
    mostrarTela(b.dataset.tela);
    if (window.innerWidth <= 900) recolherPainel(true);
  }));
  window.addEventListener('hashchange', () => mostrarTela(location.hash === '#sobre' ? 'sobre' : 'jogo'));

  // ---------- "Como jogar" + legenda ----------
  const ajuda = $('#ajuda'), btnAjuda = $('#btn-ajuda');
  $('#ajuda-legenda').innerHTML = `<h3>Legenda</h3><ul>
    <li><span class="ic" style="color:var(--amarelo)">${IC.alerta}</span>Problema a corrigir</li>
    <li><span class="ic" style="color:var(--verde)">${IC.check}</span>Resolvido</li>
    <li><span class="ic">${IC.engrenagem}</span>Resolvido com automação</li>
    <li><span class="ic"><span class="meia"></span></span>Automação parcial</li>
  </ul>`;
  const ajudaAberta = () => !ajuda.hidden;
  function alternarAjuda(abrirAjuda) {
    ajuda.hidden = !abrirAjuda;
    btnAjuda.setAttribute('aria-expanded', String(abrirAjuda));
  }
  btnAjuda.addEventListener('click', () => alternarAjuda(!ajudaAberta()));
  document.addEventListener('click', (e) => {
    if (ajudaAberta() && !ajuda.contains(e.target) && !btnAjuda.contains(e.target)) alternarAjuda(false);
  });

  // ---------- modal ----------
  const modal = $('#modal');
  const corpo = $('#modal-corpo');
  let atual = null;
  let abaAtual = 'video';
  let ultimoFoco = null;
  let corrigindo = false;
  const ABAS = ['video', 'caso', 'solucao'];
  $$('.modal-x', modal).forEach((b) => { b.innerHTML = IC.fechar; });

  function tagsHtml(p) {
    const pri = { Alta: 'alta', Média: 'media', Baixa: 'baixa' }[p.prioridade];
    const auto = { sim: 'auto-sim', parcial: 'auto-parcial', nao: 'auto-nao' }[p.automacao];
    return `<span class="tag prioridade ${pri}">Prioridade ${esc(p.prioridade)}</span>` +
      `<span class="tag nr">${esc(p.nr)}</span>` +
      `<span class="tag ${auto}">${icAuto(p)}${textoAuto[p.automacao]}</span>` +
      (resolvido(p.id) ? `<span class="tag ok">${IC.check}Resolvido</span>` : '') +
      (p.escondido ? '<span class="tag escondido">Problema escondido</span>' : '');
  }

  // vídeo real: miniatura com prévia animada (3 quadros do vídeo) até a pessoa tocar
  function videoBloco(v) {
    if (!v) return '';
    const online = navigator.onLine !== false;
    const yt = `https://www.youtube.com/watch?v=${v.id}`;
    const ext = v.embed === false;
    const quadros = [1, 2, 3].map((n) => `<span class="quadro q${n}" style="background-image:url('https://i.ytimg.com/vi/${esc(v.id)}/hq${n}.jpg')"></span>`).join('');
    const selo = v.real === 'acidente' ? '<span class="selo-real"><i></i>Acidente real</span>' :
      v.real === 'situacao' ? '<span class="selo-real situacao"><i></i>Situação real</span>' : '';
    const fachada = online
      ? `<button type="button" class="video-fachada${ext ? ' externo' : ''}" data-video="${esc(v.id)}" data-ext="${ext ? 1 : 0}" aria-label="Assistir: ${esc(v.titulo)}" style="background-image:url('https://i.ytimg.com/vi/${esc(v.id)}/hqdefault.jpg')">${quadros}${selo}<span class="play">${IC.play}</span></button>`
      : '';
    return `<div class="video-card">${fachada}
      ${v.real === 'acidente' ? '<p class="video-aviso">Atenção: cenas reais de acidente de trabalho.</p>' : ''}
      <div class="video-info"><span class="video-titulo">${esc(v.titulo)}</span><a href="${yt}" target="_blank" rel="noopener">abrir no YouTube</a></div></div>
      ${online ? '' : '<p class="nota">Sem internet: o vídeo abre quando houver conexão.</p>'}`;
  }

  function animBloco(p, qual) {
    const rot = qual === 'seguro' ? 'a solução funcionando' : 'como o acidente acontece';
    return `<div class="anim-box" data-cena="${qual}">
        <div class="anim-svg">${CENAS[p.id][qual]()}</div>
        <div class="anim-legenda">
          <span>Animação: <span class="estado ${qual}">${rot}</span></span>
          <span class="anim-ctrl"><button type="button" data-acao="pausa" aria-label="Pausar">${IC.pausa}</button><button type="button" data-acao="replay" aria-label="Repetir">${IC.repetir}</button></span>
        </div>
      </div>`;
  }

  const ROT_REF = { caso: 'Caso real', imagem: 'Imagem real', documento: 'Referência técnica' };
  const refCard = (r) => `
      <article class="ref-card ${r.tipo}">
        <div class="tipo">${ROT_REF[r.tipo]}${r.data ? ' · ' + esc(r.data) : ''}</div>
        <h4>${esc(r.titulo)}</h4>
        ${r.src ? `<img src="${esc(r.src)}" alt="${esc(r.titulo)}" loading="lazy" width="360" height="270">` : ''}
        ${r.resumo ? `<p>${esc(r.resumo)}</p>` : ''}
        <div class="fonte">Fonte: ${esc(r.fonte)}${r.url ? ` · <a href="${esc(r.url)}" target="_blank" rel="noopener">abrir</a>` : ''}</div>
      </article>`;

  // vídeo real com título; sem vídeo, o bloco não aparece
  const midiaBloco = (v, titulo) => (v ? `<h3 class="secao-tit">${titulo}</h3>${videoBloco(v)}` : '');

  // aba 1: animação → vídeo do acidente (se houver) → texto
  function painelVideo(p) {
    const v = p.videoProblema;
    return `
      <h3 class="secao-tit primeira">Em animação</h3>
      ${animBloco(p, 'perigo')}
      ${midiaBloco(v, v && v.real === 'acidente' ? 'Vídeo do acidente real' : 'Vídeo do problema')}
      <h3 class="secao-tit">O que acontece</h3>
      <div class="texto-final">
        <p><b>Como acontece:</b> ${esc(p.exposicao)}</p>
        <p><b>Consequência:</b> ${esc(p.consequencia)}</p>
      </div>`;
  }

  // aba 2: imagem real (se houver) → caso e referências
  function painelCaso(p) {
    const imagens = p.referencias.filter((r) => r.tipo === 'imagem');
    const outras = p.referencias.filter((r) => r.tipo !== 'imagem');
    return `
      ${imagens.length ? `<h3 class="secao-tit primeira">Imagem real</h3>${imagens.map(refCard).join('')}` : ''}
      <h3 class="secao-tit ${imagens.length ? '' : 'primeira'}">O caso</h3>
      <div class="texto-final"><p>${esc(p.caso)}</p></div>
      <div class="triade-cards">
        <div class="tc perigo"><b>Perigo</b>${esc(p.perigo)}</div>
        <div class="tc expo"><b>Exposição</b>${esc(p.exposicao)}</div>
        <div class="tc risco"><b>Risco</b>${esc(p.risco)}</div>
      </div>
      <dl class="info-lista">
        <dt>Onde</dt><dd>${esc(p.onde)}</dd>
        <dt>Quem</dt><dd>${esc(p.quem)}</dd>
        <dt>Consequência</dt><dd>${esc(p.consequencia)}</dd>
      </dl>
      <h3 class="secao-tit">Referências reais</h3>
      ${outras.map(refCard).join('')}`;
  }

  // aba 3: animação → vídeo da solução (se houver) → texto
  function painelSolucao(p) {
    const c = p.cadeia || {};
    const cadeia = c.entrada
      ? `<div class="cadeia">
          <div class="cadeia-nos">
            <div class="no">${ICONES_NO.entrada}<b>Entrada</b>${esc(c.entrada)}</div>
            <div class="seta"><i></i></div>
            <div class="no">${ICONES_NO.logica}<b>Lógica</b>${esc(c.logica)}</div>
            <div class="seta s2"><i></i></div>
            <div class="no">${ICONES_NO.saida}<b>Saída</b>${esc(c.saida)}</div>
          </div>
          <p>${esc(c.nota || '')}</p>
        </div>`
      : `<div class="cadeia sem"><p style="margin:0"><b>Sem automação.</b> ${esc(c.nota || '')}</p></div>`;
    return `
      ${resolvido(p.id) ? '<div class="resolvido-faixa">Problema resolvido no infográfico</div>' : ''}
      <h3 class="secao-tit primeira">Em animação</h3>
      ${animBloco(p, 'seguro')}
      ${midiaBloco(p.videoSolucao, 'Vídeo da solução')}
      <h3 class="secao-tit">O que fazer</h3>
      <ul class="solucao-lista">${p.solucao.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
      <p class="como"><b>Como reduz o risco:</b> ${esc(p.comoReduz)}</p>
      <h3 class="secao-tit">${p.automacao === 'nao' ? 'Por que não é automação?' : 'Solução por automação'}</h3>
      ${cadeia}`;
  }

  // troca o iframe de volta pela miniatura (para o vídeo parar ao trocar de aba ou fechar)
  function pararVideos(raiz) {
    $$('iframe[data-fachada]', raiz).forEach((f) => {
      const tmp = document.createElement('div');
      tmp.innerHTML = f.dataset.fachada;
      const b = tmp.firstElementChild;
      f.replaceWith(b);
      ligarFachada(b);
    });
  }

  function ligarFachada(b) {
    b.addEventListener('click', () => {
      const id = b.dataset.video;
      if (b.dataset.ext === '1') { window.open(`https://www.youtube.com/watch?v=${id}`, '_blank', 'noopener'); return; }
      const f = document.createElement('iframe');
      f.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1`;
      f.title = b.getAttribute('aria-label');
      f.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen';
      f.allowFullscreen = true;
      f.dataset.fachada = b.outerHTML;
      b.replaceWith(f);
    });
  }

  function ligarPaineis() {
    $$('.video-fachada', modal).forEach(ligarFachada);
    $$('.anim-box', modal).forEach((box) => {
      const svg = () => $('.anim-svg svg', box);
      const pausa = $('[data-acao="pausa"]', box);
      pausa.addEventListener('click', () => {
        const el = svg(); if (!el) return;
        if (el.animationsPaused()) { el.unpauseAnimations(); pausa.innerHTML = IC.pausa; pausa.setAttribute('aria-label', 'Pausar'); }
        else { el.pauseAnimations(); pausa.innerHTML = IC.play; pausa.setAttribute('aria-label', 'Continuar'); }
      });
      $('[data-acao="replay"]', box).addEventListener('click', () => {
        const el = svg(); if (el) { el.setCurrentTime(0); el.unpauseAnimations(); pausa.innerHTML = IC.pausa; }
      });
      if (movimentoReduzido()) { const el = svg(); if (el) el.pauseAnimations(); }
    });
  }

  function mostrarAba(nome) {
    abaAtual = nome;
    $$('.aba', modal).forEach((a) => a.setAttribute('aria-selected', a.dataset.aba === nome));
    $$('.painel-aba', modal).forEach((s) => { s.hidden = s.dataset.painel !== nome; if (s.hidden) pararVideos(s); });
    corpo.scrollTop = 0;
    const i = ABAS.indexOf(nome);
    $('#btn-proxima').textContent = i < ABAS.length - 1 ? 'Próxima' : 'Voltar ao início';
  }

  function abrir(id) {
    const p = porId(id);
    if (!p) return;
    alternarAjuda(false);
    atual = id;
    ultimoFoco = document.activeElement;
    $('#modal-titulo').textContent = `${p.id}. ${p.titulo}`;
    $('#modal-tags').innerHTML = tagsHtml(p);
    $('#modal-icone').innerHTML = resolvido(id) ? IC.escudo : IC.alertaCheio;
    $('[data-painel="video"]', modal).innerHTML = painelVideo(p);
    $('[data-painel="caso"]', modal).innerHTML = painelCaso(p);
    $('[data-painel="solucao"]', modal).innerHTML = painelSolucao(p);
    ligarPaineis();
    const btn = $('#btn-corrigir');
    btn.disabled = false;
    btn.classList.toggle('reabrir', resolvido(id));
    btn.textContent = resolvido(id) ? 'Reabrir problema' : 'Corrigir problema';
    modal.hidden = false;
    pausarCena(true);
    mostrarAba(resolvido(id) ? 'solucao' : 'video');
    $('.modal-x', modal).focus();
  }

  function fechar() {
    if (modal.hidden) return;
    modal.hidden = true;
    pausarCena(false);
    $$('.painel-aba', modal).forEach((s) => { s.innerHTML = ''; }); // para vídeos tocando
    atual = null;
    corrigindo = false;
    if (ultimoFoco && document.contains(ultimoFoco)) ultimoFoco.focus();
  }

  $$('[data-fechar]', modal).forEach((el) => el.addEventListener('click', fechar));
  $$('.aba', modal).forEach((a) => a.addEventListener('click', () => mostrarAba(a.dataset.aba)));
  $('#btn-proxima').addEventListener('click', () => mostrarAba(ABAS[(ABAS.indexOf(abaAtual) + 1) % ABAS.length]));

  // swipe entre abas (toque)
  let toqueX = null, toqueY = null;
  corpo.addEventListener('touchstart', (e) => { toqueX = e.touches[0].clientX; toqueY = e.touches[0].clientY; }, { passive: true });
  corpo.addEventListener('touchend', (e) => {
    if (toqueX === null) return;
    const dx = e.changedTouches[0].clientX - toqueX, dy = e.changedTouches[0].clientY - toqueY;
    toqueX = null;
    if (Math.abs(dx) < 60 || Math.abs(dy) > Math.abs(dx)) return;
    const i = ABAS.indexOf(abaAtual);
    const j = dx < 0 ? Math.min(i + 1, ABAS.length - 1) : Math.max(i - 1, 0);
    if (j !== i) mostrarAba(ABAS[j]);
  }, { passive: true });

  // teclado: Esc fecha; Tab fica dentro do modal
  document.addEventListener('keydown', (e) => {
    if (!modal.hidden) {
      if (e.key === 'Escape') { fechar(); return; }
      if (e.key === 'Tab') {
        const foc = $$('button, [href], iframe, [tabindex]:not([tabindex="-1"])', $('.modal-caixa')).filter((el) => !el.closest('[hidden]') && el.offsetParent !== null);
        if (!foc.length) return;
        const pri = foc[0], ult = foc[foc.length - 1];
        if (e.shiftKey && document.activeElement === pri) { e.preventDefault(); ult.focus(); }
        else if (!e.shiftKey && document.activeElement === ult) { e.preventDefault(); pri.focus(); }
      }
    } else if (!$('#selo-final').hidden && e.key === 'Escape') {
      fecharSelo();
    } else if (ajudaAberta() && e.key === 'Escape') {
      alternarAjuda(false); btnAjuda.focus();
    }
  });

  // ---------- corrigir ----------
  $('#btn-corrigir').addEventListener('click', () => {
    if (corrigindo || atual === null) return;
    const id = atual;
    const p = porId(id);
    if (resolvido(id)) {
      estado.resolvidos = estado.resolvidos.filter((x) => x !== id);
      salvar();
      atualizarTudo();
      toast(`Problema ${id} reaberto`);
      fechar();
      return;
    }
    corrigindo = true;
    const btn = $('#btn-corrigir');
    btn.disabled = true;
    btn.textContent = 'Aplicando a solução…';
    mostrarAba('solucao');
    const boxSeguro = $('.anim-box[data-cena="seguro"]', modal);
    const svg = $('.anim-svg svg', boxSeguro);
    if (svg) { svg.setCurrentTime(0); svg.unpauseAnimations(); }
    boxSeguro.scrollIntoView({ block: 'center', behavior: 'smooth' });
    setTimeout(() => {
      estado.resolvidos.push(id);
      salvar();
      fechar();
      atualizarTudo();
      toast(`${p.curto}: resolvido`);
      verificarConclusao(id);
    }, movimentoReduzido() ? 300 : 2800);
  });

  function verificarConclusao(idResolvido) {
    if (idResolvido === ESCONDIDO.id && resolvido(ESCONDIDO.id)) {
      confete();
      mostrarSelo('ESTEIRA 100% SEGURA', `${PROBLEMAS.length} de ${PROBLEMAS.length}: vocês acharam o problema escondido e controlaram todos os riscos.`);
      return;
    }
    if (!estado.escondidoLiberado && todosVisiveisResolvidos()) {
      estado.escondidoLiberado = true;
      salvar();
      confete();
      mostrarSelo('ESTEIRA SEGURA', `${VISIVEIS.length} de ${VISIVEIS.length} riscos controlados… mas ainda tem um problema escondido na esteira.`, () => {
        atualizarTudo();
        agendarDica();
      });
    }
  }

  let timerDica = null;
  function agendarDica() {
    clearTimeout(timerDica);
    timerDica = setTimeout(() => { if (estado.escondidoLiberado && !resolvido(ESCONDIDO.id)) darDica(); }, 20000);
  }
  function darDica() {
    alvo.classList.add('dica');
    $('#banner-escondido').innerHTML = '<strong>Dica:</strong> procurem perto do painel elétrico. O que deveria estar à vista e não está?';
  }
  $('#btn-dica').addEventListener('click', darDica);

  // ---------- selo final, confete, toast ----------
  let aoFecharSelo = null;
  function mostrarSelo(titulo, texto, depois) {
    $('#selo-titulo').textContent = titulo;
    $('#selo-texto').textContent = texto;
    aoFecharSelo = depois || null;
    $('#selo-final').hidden = false;
    $('#btn-selo-ok').focus();
  }
  function fecharSelo() {
    $('#selo-final').hidden = true;
    if (aoFecharSelo) { const f = aoFecharSelo; aoFecharSelo = null; f(); }
  }
  $('#btn-selo-ok').addEventListener('click', fecharSelo);

  function confete() {
    if (movimentoReduzido()) return;
    const box = $('#confete');
    const cores = ['#f5c242', '#2ecc71', '#6f9be0', '#f26b3a', '#ffffff'];
    let html = '';
    for (let i = 0; i < 60; i++) {
      html += `<i style="left:${Math.random() * 100}%;background:${cores[i % cores.length]};--x:${Math.round(Math.random() * 160 - 80)}px;animation-duration:${2 + Math.random() * 2}s;animation-delay:${Math.random() * 0.6}s"></i>`;
    }
    box.innerHTML = html;
    setTimeout(() => { box.innerHTML = ''; }, 5000);
  }

  let timerToast = null;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(timerToast);
    timerToast = setTimeout(() => t.classList.remove('show'), 2600);
  }

  // ---------- limpar progresso (dois toques, sem pop-up do navegador) ----------
  const btnLimpar = $('#btn-limpar');
  const TEXTO_LIMPAR = btnLimpar.textContent;
  let timerLimpar = null;
  btnLimpar.addEventListener('click', () => {
    if (!btnLimpar.classList.contains('confirmar')) {
      btnLimpar.classList.add('confirmar');
      btnLimpar.textContent = 'Tem certeza? Toque de novo';
      clearTimeout(timerLimpar);
      timerLimpar = setTimeout(() => { btnLimpar.classList.remove('confirmar'); btnLimpar.textContent = TEXTO_LIMPAR; }, 4000);
      return;
    }
    clearTimeout(timerLimpar);
    btnLimpar.classList.remove('confirmar');
    btnLimpar.textContent = TEXTO_LIMPAR;
    estado = { resolvidos: [], escondidoLiberado: false };
    try { localStorage.removeItem(CHAVE); } catch (e) { /* ignora */ }
    clearTimeout(timerDica);
    $('#banner-escondido').innerHTML = '<strong>Ainda falta um!</strong> Turma, encontrem o problema escondido. <button type="button" class="btn-link" id="btn-dica">Preciso de uma dica</button>';
    $('#btn-dica').addEventListener('click', darDica);
    atualizarTudo();
    toast('Progresso apagado: comece de novo');
  });

  // ---------- tela em pé: centraliza a esteira rolável ----------
  const rolo = $('#palco-scroll');
  function centralizar() { if (rolo.scrollWidth > rolo.clientWidth) rolo.scrollLeft = (rolo.scrollWidth - rolo.clientWidth) / 2; }
  window.addEventListener('resize', centralizar);
  // o próprio centralizar() dispara 'scroll'; só escuta o arraste da pessoa depois dele
  setTimeout(() => rolo.addEventListener('scroll', () => $('#dica-arraste').classList.add('some'), { once: true, passive: true }), 500);

  // ---------- pausa quando a aba fica oculta ----------
  // CSS (esteira, caixas) e SMIL (pessoas) param juntos
  function pausarCena(sim) {
    palco.classList.toggle('pausado', sim);
    const svg = $('svg', palco);
    if (!svg || !svg.pauseAnimations) return;
    if (sim || movimentoReduzido()) svg.pauseAnimations(); else svg.unpauseAnimations();
  }
  if (movimentoReduzido()) pausarCena(false);
  document.addEventListener('visibilitychange', () => {
    pausarCena(document.hidden || !modal.hidden);
  });

  function atualizarTudo() {
    aplicarCena();
    desenharLegenda();
    atualizarResumo();
    desenharTabela();
  }

  atualizarTudo();
  mostrarTela(location.hash === '#sobre' ? 'sobre' : 'jogo');
  centralizar();
  if (estado.escondidoLiberado && !resolvido(ESCONDIDO.id)) agendarDica();
})();
