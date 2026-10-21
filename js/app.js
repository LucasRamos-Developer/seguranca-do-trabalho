/*
 * Liga tudo: cenário, pins, legenda, modal, estado (localStorage), filtros,
 * problema escondido e celebração.
 */
(function () {
  const PROBLEMAS = window.PROBLEMAS;
  const { CENAS, iconeAlerta, iconeEscudo, iconeLupa, ICONES_NO } = window.ANIM;
  const CHAVE = 'esteira-segura-v1';
  const VISIVEIS = PROBLEMAS.filter((p) => !p.escondido);
  const ESCONDIDO = PROBLEMAS.find((p) => p.escondido);
  const porId = (id) => PROBLEMAS.find((p) => p.id === id);
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // ---------- estado ----------
  let estado = { resolvidos: [], escondidoLiberado: false };
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE) || 'null');
    if (salvo && Array.isArray(salvo.resolvidos)) estado = { ...estado, ...salvo };
  } catch (e) { /* sem storage: segue sem salvar */ }
  const salvar = () => { try { localStorage.setItem(CHAVE, JSON.stringify(estado)); } catch (e) { /* ignora */ } };
  const resolvido = (id) => estado.resolvidos.includes(id);
  const todosVisiveisResolvidos = () => VISIVEIS.every((p) => resolvido(p.id));

  // ---------- cenário ----------
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
  alvo.tabIndex = -1;
  alvo.setAttribute('aria-hidden', 'true');
  const posAlvo = window.CENA.telaParaPercentual(ESCONDIDO.id);
  alvo.style.left = posAlvo.left + '%';
  alvo.style.top = posAlvo.top + '%';
  alvo.addEventListener('click', () => { if (estado.escondidoLiberado) abrir(ESCONDIDO.id); });
  palco.appendChild(alvo);

  function desenharPin(p) {
    const b = pins[p.id];
    if (!b) return;
    const ok = resolvido(p.id);
    const auto = p.automacao === 'sim' ? '<span class="auto" title="Resolvido com automação">⚙</span>' :
      p.automacao === 'parcial' ? '<span class="auto parcial" title="Automação parcial"></span>' : '';
    b.classList.toggle('resolvido', ok);
    b.innerHTML = ok
      ? `<svg viewBox="0 0 40 40" class="pulso">${iconeEscudo().replace(/<\/?svg[^>]*>/g, '')}</svg><span class="num">${p.id}</span>${auto}`
      : `<svg viewBox="0 0 40 40"><circle class="onda-pin" cx="20" cy="24" r="14" fill="#f5c242" opacity=".5"/><g class="pulso">${iconeAlerta().replace(/<\/?svg[^>]*>/g, '')}</g></svg><span class="num">${p.id}</span>${auto}`;
    b.setAttribute('aria-label', `${p.id}. ${p.titulo}${ok ? ' (resolvido)' : ''}`);
  }

  function aplicarCena() {
    PROBLEMAS.forEach((p) => {
      $$(`.prob[data-p="${p.id}"]`, palco).forEach((g) => g.classList.toggle('fixed', resolvido(p.id)));
      desenharPin(p);
    });
    alvo.classList.toggle('liberado', estado.escondidoLiberado && !resolvido(ESCONDIDO.id));
    if (estado.escondidoLiberado) { alvo.tabIndex = 0; alvo.removeAttribute('aria-hidden'); alvo.setAttribute('aria-label', 'Problema escondido'); }
    else { alvo.tabIndex = -1; alvo.setAttribute('aria-hidden', 'true'); alvo.classList.remove('dica'); }
    $('#banner-escondido').hidden = !(estado.escondidoLiberado && !resolvido(ESCONDIDO.id));
  }

  // ---------- legenda, placar, tabela ----------
  const legenda = $('#legenda');
  function desenharLegenda() {
    legenda.innerHTML = PROBLEMAS.map((p) => {
      const ok = resolvido(p.id);
      const auto = p.automacao === 'sim' ? '⚙' : p.automacao === 'parcial' ? '<span class="meia" aria-hidden="true"></span>' : '';
      const ic = ok ? iconeEscudo() : p.escondido ? iconeLupa() : iconeAlerta(p.id);
      const cls = [ok ? 'resolvido' : '', p.escondido ? 'escondido' : '', p.escondido && estado.escondidoLiberado ? 'revelado' : ''].join(' ');
      return `<li class="${cls}" data-id="${p.id}" data-auto="${p.automacao}">
        <button type="button" data-abrir="${p.id}"><span class="ic">${ic}</span>
        <span class="t">${p.id}. ${esc(p.curto)}<small>${esc(p.nr)} · ${ok ? 'resolvido' : 'prioridade ' + esc(p.prioridade.toLowerCase())}</small></span>
        <span class="a" title="${p.automacao === 'sim' ? 'Resolvido com automação' : p.automacao === 'parcial' ? 'Automação parcial' : 'Sem automação'}">${auto}</span></button></li>`;
    }).join('');
    $$('[data-abrir]', legenda).forEach((b) => b.addEventListener('click', () => { fecharGaveta(false); abrir(+b.dataset.abrir); }));
    aplicarFiltro();
  }

  function atualizarPlacar() {
    const total = estado.escondidoLiberado ? PROBLEMAS.length : VISIVEIS.length;
    const conta = estado.resolvidos.filter((id) => estado.escondidoLiberado || !porId(id).escondido).length;
    const auto = estado.resolvidos.filter((id) => porId(id).automacao !== 'nao').length;
    $('#cont-resolvidos').textContent = conta;
    $('#cont-total').textContent = total;
    $('#cont-auto').textContent = auto;
    $('#barra-fill').style.width = (conta / total) * 100 + '%';
    $('#topo-cont').textContent = conta;
    $('#topo-total').textContent = total;
    $('#topo-fill').style.width = (conta / total) * 100 + '%';
    $('#fab-cont').textContent = `${conta}/${total}`;
    const barra = $('#barra');
    barra.setAttribute('aria-valuemax', total);
    barra.setAttribute('aria-valuenow', conta);
    const chip = $('#chip-oculto');
    chip.textContent = estado.escondidoLiberado ? (resolvido(ESCONDIDO.id) ? '🔓 Escondido encontrado!' : '🔍 Encontre o escondido!') : '🔒 + 1 problema escondido';
    chip.classList.toggle('aberto', estado.escondidoLiberado);
  }

  function desenharTabela() {
    const rot = { sim: '⚙ Sim', parcial: '<span class="meia" aria-hidden="true"></span> Parcial', nao: '✖ Não' };
    $('#tabela-auto tbody').innerHTML = PROBLEMAS.map((p) => {
      const c = p.cadeia || {};
      const cadeia = c.entrada ? `${esc(c.entrada)} → ${esc(c.logica)} → ${esc(c.saida)}` : esc(c.nota || '');
      const nome = p.escondido && !estado.escondidoLiberado ? '??? (problema escondido)' : esc(p.curto);
      const det = p.escondido && !estado.escondidoLiberado ? 'Descubra no infográfico depois de corrigir os 14.' : cadeia;
      return `<tr><td>${p.id}</td><td>${nome}</td><td>${rot[p.automacao]}</td><td>${det}</td></tr>`;
    }).join('');
  }

  // ---------- filtros ----------
  let filtro = 'todos';
  function passa(p) {
    if (filtro === 'auto') return p.automacao !== 'nao';
    if (filtro === 'outros') return p.automacao === 'nao';
    return true;
  }
  function aplicarFiltro() {
    VISIVEIS.forEach((p) => pins[p.id].classList.toggle('apagado', !passa(p)));
    $$('li', legenda).forEach((li) => li.classList.toggle('apagado', !passa(porId(+li.dataset.id))));
  }
  $$('.filtro').forEach((b) => b.addEventListener('click', () => {
    filtro = b.dataset.filtro;
    $$('.filtro').forEach((x) => { x.classList.toggle('ativo', x === b); x.setAttribute('aria-pressed', x === b); });
    aplicarFiltro();
  }));

  // ---------- modal ----------
  const modal = $('#modal');
  const corpo = $('#modal-corpo');
  let atual = null;
  let abaAtual = 'video';
  let ultimoFoco = null;
  let corrigindo = false;
  const ABAS = ['video', 'caso', 'solucao'];

  function tagsHtml(p) {
    const pri = { Alta: 'alta', Média: 'media', Baixa: 'baixa' }[p.prioridade];
    const auto = { sim: ['auto-sim', '⚙ Resolvido com automação'], parcial: ['auto-parcial', '<span class="meia" aria-hidden="true"></span> Automação parcial'], nao: ['auto-nao', 'Sem automação'] }[p.automacao];
    return `<span class="tag nr">${esc(p.nr)}</span><span class="tag ${pri}">Prioridade ${esc(p.prioridade)}</span>` +
      `<span class="tag ${auto[0]}">${auto[1]}</span>` + (resolvido(p.id) ? '<span class="tag ok">✔ Resolvido</span>' : '') +
      (p.escondido ? '<span class="tag media">🔍 Escondido</span>' : '');
  }

  function painelVideo(p) {
    const videos = p.referencias.filter((r) => r.tipo === 'video');
    const online = navigator.onLine !== false;
    const cards = videos.map((v) => {
      const yt = `https://www.youtube.com/watch?v=${v.id}`;
      const ext = v.embed === false;
      const fachada = online
        ? `<button type="button" class="video-fachada${ext ? ' externo' : ''}" data-video="${esc(v.id)}" data-ext="${ext ? 1 : 0}" aria-label="Assistir: ${esc(v.titulo)}" style="background-image:url('https://i.ytimg.com/vi/${esc(v.id)}/hqdefault.jpg')"></button>`
        : '';
      return `<div class="video-card">${fachada}<div class="video-info">${esc(v.titulo)}<br><a href="${yt}" target="_blank" rel="noopener">abrir no YouTube ↗</a></div></div>`;
    }).join('');
    return `
      <div class="anim-box" id="anim-box">
        <div id="anim-svg">${CENAS[p.id][resolvido(p.id) ? 'seguro' : 'perigo']()}</div>
        <div class="anim-legenda">
          <span>Animação: <span class="estado ${resolvido(p.id) ? 'seguro' : 'perigo'}" id="anim-estado">${resolvido(p.id) ? 'SOLUÇÃO' : 'O ACIDENTE'}</span></span>
          <span class="anim-ctrl"><button type="button" id="anim-pausa" aria-label="Pausar">❚❚</button><button type="button" id="anim-replay" aria-label="Repetir">↺</button></span>
        </div>
      </div>
      <div class="anim-alterna" role="group" aria-label="Escolher animação">
        <button type="button" data-cena="perigo" class="${resolvido(p.id) ? '' : 'ativo'}">⚠ Como acontece</button>
        <button type="button" data-cena="seguro" class="${resolvido(p.id) ? 'ativo' : ''}">🛡 Com a solução</button>
      </div>
      <h3 class="secao-tit">Vídeos reais</h3>
      ${videos.length ? `<div class="videos">${cards}</div>` : '<p class="nota">Sem vídeo para este problema: veja o caso real e as referências na aba "O caso".</p>'}
      ${online ? '' : '<p class="nota">Você está offline: os vídeos abrem quando houver internet.</p>'}`;
  }

  function painelCaso(p) {
    const refs = p.referencias.filter((r) => r.tipo !== 'video');
    const rot = { caso: 'Caso real', imagem: 'Imagem real', documento: 'Referência técnica' };
    const cards = refs.map((r) => `
      <article class="ref-card ${r.tipo}">
        <div class="tipo">${rot[r.tipo]}${r.data ? ' · ' + esc(r.data) : ''}</div>
        <h4>${esc(r.titulo)}</h4>
        ${r.src ? `<img src="${esc(r.src)}" alt="${esc(r.titulo)}" loading="lazy" width="320" height="240">` : ''}
        ${r.resumo ? `<p>${esc(r.resumo)}</p>` : ''}
        <div class="fonte">Fonte: ${esc(r.fonte)}${r.url ? ` · <a href="${esc(r.url)}" target="_blank" rel="noopener">abrir ↗</a>` : ''}</div>
      </article>`).join('');
    return `
      <p>${esc(p.caso)}</p>
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
      ${cards}`;
  }

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
      ${resolvido(p.id) ? '<div class="resolvido-faixa">✔ Problema resolvido no infográfico</div>' : ''}
      <ul class="solucao-lista">${p.solucao.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
      <p class="como"><b>Como reduz o risco:</b> ${esc(p.comoReduz)}</p>
      <h3 class="secao-tit">${p.automacao === 'nao' ? 'Por que não é automação?' : 'Solução por automação'}</h3>
      ${cadeia}`;
  }

  function trocarCena(qual) {
    const p = porId(atual);
    $('#anim-svg').innerHTML = CENAS[p.id][qual]();
    const est = $('#anim-estado');
    est.textContent = qual === 'seguro' ? 'SOLUÇÃO' : 'O ACIDENTE';
    est.className = 'estado ' + qual;
    $$('.anim-alterna button', corpo).forEach((b) => b.classList.toggle('ativo', b.dataset.cena === qual));
    $('#anim-pausa').textContent = '❚❚';
  }

  function ligarPainelVideo() {
    $$('.anim-alterna button', corpo).forEach((b) => b.addEventListener('click', () => trocarCena(b.dataset.cena)));
    $('#anim-pausa').addEventListener('click', (e) => {
      const svg = $('#anim-svg svg');
      if (!svg) return;
      if (svg.animationsPaused()) { svg.unpauseAnimations(); e.currentTarget.textContent = '❚❚'; }
      else { svg.pauseAnimations(); e.currentTarget.textContent = '▶'; }
    });
    $('#anim-replay').addEventListener('click', () => { const svg = $('#anim-svg svg'); if (svg) { svg.setCurrentTime(0); svg.unpauseAnimations(); $('#anim-pausa').textContent = '❚❚'; } });
    $$('.video-fachada', corpo).forEach((b) => b.addEventListener('click', () => {
      const id = b.dataset.video;
      if (b.dataset.ext === '1') { window.open(`https://www.youtube.com/watch?v=${id}`, '_blank', 'noopener'); return; }
      const f = document.createElement('iframe');
      f.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1`;
      f.title = b.getAttribute('aria-label');
      f.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen';
      f.allowFullscreen = true;
      f.loading = 'lazy';
      b.replaceWith(f);
    }));
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const svg = $('#anim-svg svg'); if (svg) svg.pauseAnimations();
    }
  }

  function mostrarAba(nome) {
    abaAtual = nome;
    $$('.aba', modal).forEach((a) => a.setAttribute('aria-selected', a.dataset.aba === nome));
    $$('.painel-aba', modal).forEach((s) => { s.hidden = s.dataset.painel !== nome; });
    corpo.scrollTop = 0;
    const i = ABAS.indexOf(nome);
    $('#btn-proxima').textContent = i < ABAS.length - 1 ? 'Próxima →' : '← Vídeo';
  }

  function abrir(id) {
    const p = porId(id);
    if (!p) return;
    atual = id;
    ultimoFoco = document.activeElement;
    $('#modal-titulo').textContent = `${p.id}. ${p.titulo}`;
    $('#modal-tags').innerHTML = tagsHtml(p);
    $('#modal-icone').innerHTML = resolvido(id) ? iconeEscudo() : iconeAlerta(id);
    $('[data-painel="video"]', modal).innerHTML = painelVideo(p);
    $('[data-painel="caso"]', modal).innerHTML = painelCaso(p);
    $('[data-painel="solucao"]', modal).innerHTML = painelSolucao(p);
    ligarPainelVideo();
    const btn = $('#btn-corrigir');
    btn.disabled = false;
    btn.classList.toggle('reabrir', resolvido(id));
    btn.textContent = resolvido(id) ? '↺ Reabrir problema' : '🛡 Corrigir problema';
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    palco.classList.add('pausado');
    mostrarAba(resolvido(id) ? 'solucao' : 'video');
    $('.modal-x', modal).focus();
  }

  function fechar() {
    if (modal.hidden) return;
    modal.hidden = true;
    document.body.style.overflow = '';
    palco.classList.remove('pausado');
    $$('.painel-aba', modal).forEach((s) => { s.innerHTML = ''; }); // para vídeos tocando
    atual = null;
    corrigindo = false;
    if (ultimoFoco && document.contains(ultimoFoco)) ultimoFoco.focus();
  }

  $$('[data-fechar]', modal).forEach((el) => el.addEventListener('click', fechar));
  $$('.aba', modal).forEach((a) => a.addEventListener('click', () => mostrarAba(a.dataset.aba)));
  $('#btn-proxima').addEventListener('click', () => {
    const i = ABAS.indexOf(abaAtual);
    mostrarAba(ABAS[(i + 1) % ABAS.length]);
  });

  // swipe entre abas
  let toqueX = null, toqueY = null;
  corpo.addEventListener('touchstart', (e) => { toqueX = e.touches[0].clientX; toqueY = e.touches[0].clientY; }, { passive: true });
  corpo.addEventListener('touchend', (e) => {
    if (toqueX === null) return;
    const dx = e.changedTouches[0].clientX - toqueX, dy = e.changedTouches[0].clientY - toqueY;
    toqueX = null;
    if (Math.abs(dx) < 60 || Math.abs(dy) > Math.abs(dx)) return;
    if (e.target.closest('.videos, .tabela-wrap')) return;
    const i = ABAS.indexOf(abaAtual);
    const j = dx < 0 ? Math.min(i + 1, ABAS.length - 1) : Math.max(i - 1, 0);
    if (j !== i) mostrarAba(ABAS[j]);
  }, { passive: true });

  // teclado: Esc fecha, Tab fica dentro do modal
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
    } else if (gavetaAberta() && e.key === 'Escape') {
      fecharGaveta(true);
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
    mostrarAba('video');
    trocarCena('seguro');
    const svg = $('#anim-svg svg');
    if (svg) svg.setCurrentTime(0);
    const espera = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 300 : 2600;
    setTimeout(() => {
      estado.resolvidos.push(id);
      salvar();
      fechar();
      atualizarTudo();
      const pin = pins[id];
      if (pin) pin.classList.add('resolvido');
      toast(`🛡 ${p.curto}: resolvido!`);
      verificarConclusao(id);
    }, espera);
  });

  function verificarConclusao(idResolvido) {
    if (idResolvido === ESCONDIDO.id && resolvido(ESCONDIDO.id)) {
      confete();
      mostrarSelo('ESTEIRA 100% SEGURA', `${PROBLEMAS.length}/${PROBLEMAS.length}: vocês acharam o problema escondido e controlaram todos os riscos!`);
      return;
    }
    if (!estado.escondidoLiberado && todosVisiveisResolvidos()) {
      estado.escondidoLiberado = true;
      salvar();
      confete();
      mostrarSelo('ESTEIRA SEGURA ✔', `${VISIVEIS.length}/${VISIVEIS.length} riscos controlados… mas ainda tem um problema escondido no infográfico!`, () => {
        atualizarTudo();
        $('#banner-escondido').scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    $('#banner-escondido').innerHTML = '<strong>Dica:</strong> procurem perto da energia elétrica… o que deveria estar à vista e não está? 🔍';
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
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const box = $('#confete');
    const cores = ['#f5c242', '#2ecc71', '#6f9be0', '#f26b3a', '#ffffff'];
    let html = '';
    for (let i = 0; i < 60; i++) {
      const dur = 2 + Math.random() * 2;
      html += `<i style="left:${Math.random() * 100}%;background:${cores[i % cores.length]};--x:${Math.round(Math.random() * 160 - 80)}px;animation-duration:${dur}s;animation-delay:${Math.random() * 0.6}s"></i>`;
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

  // ---------- limpar progresso (salvo no localStorage) ----------
  const btnLimpar = $('#btn-limpar');
  const TEXTO_LIMPAR = btnLimpar.textContent;
  let timerLimpar = null;
  btnLimpar.addEventListener('click', () => {
    // 1º toque pede confirmação no próprio botão; 2º toque limpa
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
    $('#banner-escondido').innerHTML = '<strong>Ainda falta um!</strong> Turma, encontrem o problema escondido 🔍 <button type="button" class="btn-link" id="btn-dica">Preciso de uma dica</button>';
    $('#btn-dica').addEventListener('click', darDica);
    atualizarTudo();
    toast('🗑 Progresso apagado: comece de novo!');
  });

  // ---------- gaveta (desktop): botão flutuante abre a lista ----------
  const painel = $('#painel');
  const fab = $('#fab');
  const fundoGaveta = $('#gaveta-fundo');
  const gavetaAberta = () => painel.classList.contains('aberto');
  function abrirGaveta() {
    painel.classList.add('aberto');
    fundoGaveta.hidden = false;
    fab.setAttribute('aria-expanded', 'true');
    $('#gaveta-fechar').focus();
  }
  function fecharGaveta(devolverFoco) {
    if (!gavetaAberta()) return;
    painel.classList.remove('aberto');
    fundoGaveta.hidden = true;
    fab.setAttribute('aria-expanded', 'false');
    if (devolverFoco) fab.focus();
  }
  fab.addEventListener('click', () => (gavetaAberta() ? fecharGaveta(true) : abrirGaveta()));
  $('#gaveta-fechar').addEventListener('click', () => fecharGaveta(true));
  fundoGaveta.addEventListener('click', () => fecharGaveta(true));
  $('#link-sobre').addEventListener('click', () => fecharGaveta(false));

  // legenda flutuante (desktop largo)
  $('#callout-legenda').innerHTML = `<h3>Legenda</h3><ul>
    <li><span class="ic">${iconeAlerta()}</span>Problema a corrigir</li>
    <li><span class="ic">${iconeEscudo()}</span>Resolvido</li>
    <li><span class="ic">⚙</span>Resolvido com automação</li>
    <li><span class="ic"><span class="meia"></span></span>Automação parcial</li>
  </ul>`;

  // ---------- celular: centraliza o cenário rolável ----------
  const rolo = $('#palco-scroll');
  function centralizar() { if (rolo.scrollWidth > rolo.clientWidth) rolo.scrollLeft = (rolo.scrollWidth - rolo.clientWidth) / 2; }
  centralizar();
  // o próprio centralizar() dispara 'scroll'; só escuta o arraste da pessoa depois dele
  setTimeout(() => rolo.addEventListener('scroll', () => $('#dica-arraste').classList.add('some'), { once: true, passive: true }), 400);

  // ---------- pausa quando a aba fica oculta ----------
  document.addEventListener('visibilitychange', () => {
    palco.classList.toggle('pausado', document.hidden || !modal.hidden);
  });

  function atualizarTudo() {
    aplicarCena();
    desenharLegenda();
    atualizarPlacar();
    desenharTabela();
  }

  atualizarTudo();
  if (estado.escondidoLiberado && !resolvido(ESCONDIDO.id)) agendarDica();
})();
