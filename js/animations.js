/*
 * Mini-cenas animadas do modal (vista lateral 2D, SVG + SMIL).
 * Cada problema tem duas cenas: perigo (o acidente acontecendo) e seguro (a solução funcionando).
 * Todas usam um ciclo de 4 s (CICLO) para ficarem sincronizadas e poderem ser reiniciadas com setCurrentTime(0).
 */
(function () {
  const CICLO = '4s';
  const rep = `dur="${CICLO}" repeatCount="indefinite"`;

  // ---------- peças ----------
  const chao = () => `<rect x="0" y="150" width="320" height="30" fill="#1a2256"/><line x1="0" y1="150" x2="320" y2="150" stroke="#3b4f96" stroke-width="2"/>`;

  // correia vista de lado. modo: 'anda' | 'para' (anda e para na metade) | 'parte' (parada e parte na metade) | 'parado'
  function correia(x, y, w, modo = 'anda') {
    let anim = '';
    if (modo === 'anda') anim = `<animate attributeName="stroke-dashoffset" values="0;-128" ${rep}/>`;
    if (modo === 'para') anim = `<animate attributeName="stroke-dashoffset" values="0;-64;-64" keyTimes="0;.5;1" ${rep}/>`;
    if (modo === 'parte') anim = `<animate attributeName="stroke-dashoffset" values="0;0;-64" keyTimes="0;.5;1" ${rep}/>`;
    const giro = modo === 'parado' ? '' : (modo === 'anda' ? `<animateTransform attributeName="transform" type="rotate" from="0" to="720" ${rep}/>` :
      modo === 'para' ? `<animateTransform attributeName="transform" type="rotate" values="0;360;360" keyTimes="0;.5;1" ${rep}/>` :
        `<animateTransform attributeName="transform" type="rotate" values="0;0;360" keyTimes="0;.5;1" ${rep}/>`);
    const tambor = (cx) => `<g transform="translate(${cx} ${y + 9})"><circle r="11" fill="#cfd8ea" stroke="#5b6a8f" stroke-width="2"/><g>${giro}<line x1="-9" y1="0" x2="9" y2="0" stroke="#5b6a8f" stroke-width="2"/><line x1="0" y1="-9" x2="0" y2="9" stroke="#5b6a8f" stroke-width="2"/></g></g>`;
    return `<g>
      <rect x="${x + 10}" y="${y + 18}" width="6" height="${150 - y - 18}" fill="#2c3c78"/><rect x="${x + w - 16}" y="${y + 18}" width="6" height="${150 - y - 18}" fill="#2c3c78"/>
      <rect x="${x}" y="${y - 2}" width="${w}" height="22" rx="11" fill="#4a73bf"/>
      <line x1="${x + 10}" y1="${y - 1}" x2="${x + w - 10}" y2="${y - 1}" stroke="#8fb4ee" stroke-width="3" stroke-dasharray="8 8">${anim}</line>
      ${tambor(x + 11)}${tambor(x + w - 11)}
    </g>`;
  }

  // pessoa com os pés em (x, y); pose pode ser uma lista de quadros [[pose, t], ...] (ver js/humano.js)
  function pessoa(x, y, o = {}) {
    const { cor = '#3f8de0', pose = 'pe', flip = false, capacete = '#ffcc33', extra = '', protetor = false } = o;
    return `<g transform="translate(${x} ${y}) scale(${flip ? -1 : 1} 1)" ${extra}>${window.HUMANO.figura(pose, { camisa: cor, capacete, protetor, dur: CICLO })}</g>`;
  }

  const caixa = (x, y, w = 26, h = 20, extra = '') => `<g ${extra}><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#dda15c"/><rect x="${x}" y="${y}" width="${w}" height="5" fill="#f6cf98"/><rect x="${x + w / 2 - 2}" y="${y}" width="4" height="${h}" fill="#c58645"/></g>`;
  const rotulo = (x, y, t, cor = '#ff8080', extra = '') => `<text x="${x}" y="${y}" font-size="11" font-weight="800" fill="${cor}" text-anchor="middle" font-family="system-ui,sans-serif" ${extra}>${t}</text>`;
  // elemento que só aparece entre as frações a e b do ciclo
  const janela = (a, b, conteudo) => `<g opacity="0"><animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;${a};${a + 0.01};${b};${b + 0.01};1" ${rep}/>${conteudo}</g>`;
  const flash = (a = 0.55) => janela(a, Math.min(a + 0.35, 0.98), `<rect width="320" height="180" fill="#e04848" opacity=".18"/>`);
  const larg = (t) => Math.max(90, Math.round(t.length * 6.6 + 22));
  const okSelo = (x, y, t) => janela(0.6, 0.98, `<g transform="translate(${Math.min(Math.max(x, larg(t) / 2 + 4), 316 - larg(t) / 2)} ${y})"><rect x="${-larg(t) / 2}" y="-13" width="${larg(t)}" height="22" rx="11" fill="#2ecc71"/><text y="2.5" font-size="10.5" font-weight="800" fill="#062b16" text-anchor="middle" font-family="system-ui,sans-serif">${t}</text></g>`);
  const alerta = (x, y, t) => janela(0.55, 0.98, `<g transform="translate(${Math.min(Math.max(x, larg(t) / 2 + 4), 316 - larg(t) / 2)} ${y})"><rect x="${-larg(t) / 2}" y="-13" width="${larg(t)}" height="22" rx="11" fill="#e04848"/><text y="2.5" font-size="10.5" font-weight="800" fill="#fff" text-anchor="middle" font-family="system-ui,sans-serif">${t}</text></g>`);
  const mover = (valores, tempos, conteudo, extra = '') => `<g ${extra}><animateTransform attributeName="transform" type="translate" values="${valores}" keyTimes="${tempos}" ${rep}/>${conteudo}</g>`;
  const malha = (x, y, w, h) => `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="rgba(255,216,77,.2)" stroke="#ffd84d" stroke-width="2"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="url(#m-malha)"/></g>`;
  const relé = (x, y, ativo) => `<g transform="translate(${x} ${y})"><rect x="-16" y="-12" width="32" height="24" rx="4" fill="#f5c242"/><text y="4" font-size="8" font-weight="800" text-anchor="middle" fill="#3a2a00" font-family="system-ui,sans-serif">RELÉ</text>${ativo ? janela(0.5, 0.98, '<circle cx="12" cy="-8" r="3" fill="#2ecc71"/>') : ''}</g>`;
  const motorIco = (x, y, para) => `<g transform="translate(${x} ${y})"><rect x="-18" y="-12" width="36" height="24" rx="4" fill="#8d9bb8"/><circle cx="18" cy="0" r="4" fill="#5b6a8f"/>${para ? janela(0.5, 0.98, '<text y="4" font-size="8" font-weight="800" text-anchor="middle" fill="#e04848" font-family="system-ui,sans-serif">OFF</text>') : ''}</g>`;
  const defs = `<defs><pattern id="m-malha" width="6" height="6" patternUnits="userSpaceOnUse"><path d="M0 6 L6 0" stroke="#ffd84d" stroke-width="1"/></pattern><pattern id="m-zebra" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="10" height="10" fill="#222"/><rect width="5" height="10" fill="#f5c242"/></pattern></defs>`;
  const wrap = (conteudo) => `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" role="img">${defs}<rect width="320" height="180" fill="#141b45"/>${chao()}${conteudo}</svg>`;

  // poses e sequências de pessoas (js/humano.js)
  const H = window.HUMANO, com = H.com;
  const anda = (n = 2, a = 0, b = 1) => H.caminhada(n, a, b);

  const CENAS = {
    1: {
      perigo: () => wrap(
        correia(40, 90, 220, 'anda') +
        pessoa(214, 150, { cor: '#3f8de0', pose: [['pe', 0], ['pe', .1], [com('alcanca', { mF: [22, -58], mT: [8, -32] }), .42],
          [com('puxado', { mF: [34, -51] }), .6], [com('puxado', { q: [6, -26], o: [17, -41], c: [21, -50], mF: [36, -49] }), .95], ['pe', 1]] }) +
        janela(0.55, 0.98, `<circle cx="248" cy="99" r="16" fill="none" stroke="#ff4d4d" stroke-width="3"/>`) +
        flash() + alerta(160, 30, 'BRAÇO PUXADO PARA O TAMBOR')
      ),
      seguro: () => wrap(
        correia(40, 90, 220, 'para') + malha(222, 70, 52, 52) +
        pessoa(196, 150, { cor: '#3f8de0', pose: [['pe', 0], ['pe', .1], [com('alcanca', { mF: [25, -56] }), .45], [com('alcanca', { mF: [25, -56] }), .95], ['pe', 1]] }) +
        `<g transform="translate(286 80)"><rect x="-6" y="-8" width="12" height="16" rx="2" fill="#2ecc71"/></g>` +
        relé(286, 40, true) + okSelo(130, 30, 'GRADE + INTERTRAVAMENTO')
      )
    },
    2: {
      perigo: () => wrap(
        correia(20, 96, 280, 'anda') +
        mover('30 150;110 150;190 150', '0;.6;1', pessoa(0, 0, { pose: anda(6), cor: '#9b6bd6' })) +
        `<g transform="translate(296 40)"><rect x="-14" y="-14" width="28" height="28" rx="4" fill="#26304f" stroke="#8d9bb8"/><circle r="8" fill="#e04848"/></g>` +
        `<line x1="40" y1="20" x2="276" y2="20" stroke="#8d9bb8" stroke-dasharray="4 3"/>` + rotulo(160, 16, 'botão de parada longe demais', '#b8c3e8') +
        alerta(160, 140, 'NINGUÉM ALCANÇA O BOTÃO')
      ),
      seguro: () => wrap(
        correia(20, 96, 280, 'para') +
        pessoa(150, 150, { cor: '#9b6bd6', pose: [['pe', 0], ['pe', .15], [com('alcanca', { mF: [10, -64], mT: [-3, -26] }), .4],
          [com('alcanca', { mF: [10, -55], mT: [-3, -26], o: [4, -46] }), .5], [com('alcanca', { mF: [10, -55], mT: [-3, -26], o: [4, -46] }), .95], ['pe', 1]] }) +
        `<polyline points="20,86 160,86 300,86" fill="none" stroke="#f5c242" stroke-width="3"><animate attributeName="points" values="20,86 160,86 300,86;20,86 160,86 300,86;20,86 160,95 300,86;20,86 160,95 300,86" keyTimes="0;.4;.5;1" ${rep}/></polyline>` +
        `<rect x="14" y="78" width="8" height="72" fill="#f5c242"/><rect x="298" y="78" width="8" height="72" fill="#f5c242"/>` +
        okSelo(160, 30, 'CABO PUXADO: ESTEIRA PARA')
      )
    },
    3: {
      perigo: () => wrap(
        correia(30, 100, 260, 'anda') +
        `<g transform="translate(150 70) rotate(-14)"><animateTransform attributeName="transform" type="translate" additive="sum" values="0 0;1 -1;0 0" dur=".2s" repeatCount="indefinite"/>${caixa(0, 0, 36, 26)}</g>` +
        `<rect x="186" y="64" width="6" height="36" fill="#8d9bb8"/>` +
        pessoa(222, 150, { flip: true, cor: '#ef9a3a', pose: [['pe', 0], ['pe', .1], [com('alcanca', { mF: [28, -66], mT: [14, -40] }), .45],
          [com('puxado', { mF: [32, -62] }), .62], [com('puxado', { mF: [33, -61], q: [5, -26], o: [15, -42], c: [18, -52] }), .95], ['pe', 1]] }) +
        motorIco(60, 40, false) + janela(0, 0.98, `<text x="60" y="22" font-size="9" fill="#ff8080" text-anchor="middle" font-weight="700" font-family="system-ui,sans-serif">forçando…</text>`) +
        flash(0.6) + alerta(160, 150 - 120, 'TENTANDO SOLTAR COM A MÃO')
      ),
      seguro: () => wrap(
        correia(30, 100, 260, 'para') +
        `<g transform="translate(150 70) rotate(-14)">${caixa(0, 0, 36, 26)}</g>` +
        `<rect x="118" y="60" width="8" height="40" fill="#8d9bb8"/><rect x="200" y="60" width="8" height="40" fill="#8d9bb8"/>` +
        `<line x1="126" y1="76" x2="200" y2="76" stroke="#ff4d4d" stroke-width="2" stroke-dasharray="4 3"/>` +
        `<g transform="translate(250 34)"><rect x="-34" y="-16" width="68" height="32" rx="4" fill="#26304f" stroke="#8fb4ee"/><rect x="-26" y="-8" width="52" height="7" rx="3" fill="#3b4f96"/>` +
        `<rect x="-26" y="-8" width="0" height="7" rx="3" fill="#f5c242"><animate attributeName="width" values="0;52;52" keyTimes="0;.5;1" ${rep}/></rect>` +
        `<text y="11" font-size="8" fill="#b8c3e8" text-anchor="middle" font-family="system-ui,sans-serif">timeout CLP</text></g>` +
        okSelo(110, 30, 'ATOLAMENTO: PARADA')
      )
    },
    4: {
      perigo: () => wrap(
        `<rect x="110" y="40" width="90" height="110" rx="4" fill="#8d9bb8"/><rect x="118" y="48" width="74" height="94" fill="#26304f"/>` +
        `<rect x="40" y="48" width="70" height="94" fill="#a9b6cf" transform="skewY(-8)"/>` +
        `<rect x="126" y="58" width="22" height="16" fill="#5fe39a"/><rect x="154" y="58" width="30" height="16" fill="#8fb4ee"/><rect x="126" y="92" width="58" height="10" fill="#f5c242"/>` +
        pessoa(218, 150, { flip: true, cor: '#7e8bd6', pose: [['pe', 0], ['pe', .1], [com('alcanca', { mF: [24, -57] }), .45], ['choque', .5],
          [com('choque', { c: [-8, -55], mF: [14, -62] }), .58], ['choque', .66], [com('escorrega', { q: [-4, -23] }), .8], [com('escorrega', { q: [-4, -23] }), .95], ['pe', 1]] }) +
        janela(0.47, 0.75, `<g transform="translate(186 92)" stroke="#ffe066" stroke-width="3" stroke-linecap="round"><path d="M0 0 l16 -16 M0 0 l-14 -18 M0 0 l20 6 M0 0 l-16 10 M0 0 l4 -22"/><circle r="8" fill="#fff6bf" stroke="none"/></g>`) +
        flash(0.47) + alerta(160, 24, 'CHOQUE / ARCO ELÉTRICO')
      ),
      seguro: () => wrap(
        `<rect x="110" y="40" width="90" height="110" rx="4" fill="#8d9bb8"/><rect x="116" y="46" width="78" height="98" rx="3" fill="#a9b6cf"/>` +
        `<g transform="translate(155 80)"><path d="M0 -16 L16 12 H-16Z" fill="#ffd84d" stroke="#222"/><path d="M2 -7 l-5 8 h5 l-3 8" stroke="#222" stroke-width="2" fill="none"/></g>` +
        `<g transform="translate(184 106)"><rect x="-6" y="-2" width="12" height="12" rx="2" fill="#e04848"/><path d="M-3 -2 v-4 a3 3 0 0 1 6 0 v4" stroke="#e04848" fill="none" stroke-width="2"/></g>` +
        `<g transform="translate(222 150)" stroke="#2ecc71" stroke-width="3"><path d="M-22 -40 h22 v40 M-10 0 h20 M-6 5 h12 M-2 10 h4"/></g>` +
        okSelo(160, 24, 'FECHADO, ATERRADO, SINALIZADO')
      )
    },
    5: {
      perigo: () => wrap(
        correia(20, 104, 200, 'parte') +
        pessoa(112, 150, { cor: '#2f9e8f', pose: [['ajoelhado', 0], [com('ajoelhado', { mF: [21, -33] }), .15], ['ajoelhado', .3], [com('ajoelhado', { mF: [21, -33] }), .45],
          [com('ajoelhado', { o: [11, -34], c: [15, -43], mF: [34, -30], mT: [22, -30] }), .6], [com('ajoelhado', { o: [12, -33], c: [16, -42], mF: [36, -29], mT: [22, -30] }), .95], ['ajoelhado', 1]] }) +
        `<g transform="translate(270 70)"><rect x="-26" y="-22" width="52" height="44" rx="4" fill="#26304f" stroke="#8fb4ee"/><text y="-6" font-size="8" fill="#b8c3e8" text-anchor="middle" font-family="system-ui,sans-serif">IHM</text>` +
        `<rect x="-16" y="0" width="32" height="14" rx="3" fill="#2ecc71"/><text y="10" font-size="8" font-weight="800" text-anchor="middle" fill="#062b16" font-family="system-ui,sans-serif">START</text></g>` +
        janela(0.45, 0.55, `<circle cx="270" cy="77" r="16" fill="none" stroke="#fff" stroke-width="2"/>`) +
        rotulo(270, 120, 'outra pessoa liga', '#b8c3e8') + flash(0.55) + alerta(140, 30, 'ESTEIRA LIGOU COM O TÉCNICO DENTRO')
      ),
      seguro: () => wrap(
        correia(20, 104, 200, 'parado') +
        pessoa(112, 150, { cor: '#2f9e8f', pose: [['ajoelhado', 0], [com('ajoelhado', { mF: [21, -33] }), .25], ['ajoelhado', .5], [com('ajoelhado', { mF: [21, -33] }), .75], ['ajoelhado', 1]] }) +
        `<g transform="translate(262 72)"><rect x="-22" y="-30" width="44" height="60" rx="4" fill="#8d9bb8"/>` +
        `<g><animateTransform attributeName="transform" type="rotate" values="0;0;90;90" keyTimes="0;.15;.3;1" ${rep}/><rect x="-3" y="-18" width="6" height="18" fill="#e04848"/></g>` +
        janela(0.3, 0.98, `<rect x="6" y="2" width="12" height="11" rx="2" fill="#e04848"/><path d="M8 2 v-4 a4 4 0 0 1 8 0 v4" stroke="#e04848" fill="none" stroke-width="2"/><rect x="5" y="16" width="14" height="16" fill="#fff"/><rect x="5" y="16" width="14" height="5" fill="#e04848"/>`) + `</g>` +
        janela(0.5, 0.98, `<g transform="translate(262 140)"><rect x="-22" y="-12" width="44" height="22" rx="4" fill="#f5c242"/><text y="4" font-size="10" font-weight="800" text-anchor="middle" fill="#222" font-family="system-ui,sans-serif">0 V</text></g>`) +
        okSelo(140, 30, 'BLOQUEADO E ETIQUETADO')
      )
    },
    6: {
      perigo: () => wrap(
        `<rect x="120" y="116" width="150" height="12" rx="6" fill="#4a73bf"/><rect x="130" y="128" width="6" height="22" fill="#2c3c78"/><rect x="254" y="128" width="6" height="22" fill="#2c3c78"/>` +
        caixa(170, 96) + pessoa(96, 150, { cor: '#3f8de0', pose: [['curvado', 0], [com('curvado', { mF: [28, -26], mT: [24, -27] }), .5], ['curvado', 1]] }) +
        janela(0, 0.98, `<path d="M98 126 q10 -14 20 -22" stroke="#ff4d4d" stroke-width="4" fill="none" stroke-linecap="round" opacity=".8"/>`) +
        alerta(160, 30, 'COLUNA CURVADA O TURNO TODO')
      ),
      seguro: () => wrap(
        mover('0 34;0 34;0 0;0 0', '0;.2;.5;1',
          `<rect x="120" y="82" width="150" height="12" rx="6" fill="#4a73bf"/>` + caixa(170, 62)) +
        `<g stroke="#f5c242" stroke-width="4"><line x1="140" y1="150" x2="250" y2="96"><animate attributeName="y2" values="128;128;96;96" keyTimes="0;.2;.5;1" ${rep}/></line><line x1="250" y1="150" x2="140" y2="96"><animate attributeName="y2" values="128;128;96;96" keyTimes="0;.2;.5;1" ${rep}/></line></g>` +
        pessoa(98, 150, { cor: '#3f8de0', pose: [['curvado', 0], ['curvado', .2], ['operando', .5], [com('operando', { mF: [20, -35] }), .75], ['operando', .97], ['curvado', 1]] }) +
        okSelo(160, 30, 'ALTURA AJUSTADA AO OPERADOR')
      )
    },
    7: {
      perigo: () => wrap(
        correia(10, 80, 120, 'anda') +
        `<rect x="200" y="140" width="90" height="10" fill="#a57d4b"/>` + caixa(206, 120) + caixa(236, 120) +
        pessoa(170, 150, { cor: '#ef6c57', pose: [[com('segura', { mF: [-8, -36], mT: [-10, -36], o: [-3, -47] }), 0], ['segura', .3], ['levanta', .7], ['levanta', .85], [com('segura', { mF: [-8, -36], mT: [-10, -36], o: [-3, -47] }), 1]] }) +
        mover('148 78;176 84;184 110;184 110;148 78', '0;.3;.7;.85;1', caixa(0, 0)) +
        janela(0, 0.98, `<path d="M168 128 q6 -10 14 -14" stroke="#ff4d4d" stroke-width="4" fill="none" stroke-linecap="round"/>`) +
        alerta(160, 30, 'CENTENAS DE CAIXAS POR TURNO')
      ),
      seguro: () => wrap(
        correia(10, 80, 120, 'anda') +
        `<rect x="200" y="140" width="90" height="10" fill="#a57d4b"/>` + caixa(206, 120) + caixa(236, 120) +
        `<rect x="296" y="20" width="10" height="130" fill="#8d9bb8"/>` +
        mover('0 0;-160 0;-160 0;-60 0;-60 0', '0;.25;.35;.7;1',
          `<rect x="270" y="24" width="40" height="8" fill="#cfd8ea"/><line x1="280" y1="32" x2="280" y2="60" stroke="#5b6a8f" stroke-width="5"/><rect x="268" y="58" width="24" height="6" rx="2" fill="#5b6a8f"/>` +
          janela(0.3, 0.72, caixa(266, 64))) +
        pessoa(170, 150, { cor: '#ef6c57', pose: [['pe', 0], ['operando', .3], ['operando', .7], ['pe', 1]] }) +
        okSelo(160, 14, 'O ROBÔ LEVANTA, A PESSOA SUPERVISIONA')
      )
    },
    8: {
      perigo: () => wrap(
        correia(20, 100, 280, 'parte') +
        pessoa(130, 150, { cor: '#d6589b', pose: [[com('alcanca', { mF: [24, -50] }), 0], [com('alcanca', { mF: [16, -52] }), .15], [com('alcanca', { mF: [24, -50] }), .3],
          [com('alcanca', { mF: [18, -52] }), .48], [com('puxado', { mF: [34, -50] }), .6], [com('puxado', { q: [6, -26], o: [17, -41], c: [21, -50], mF: [38, -49] }), .95], [com('alcanca', { mF: [24, -50] }), 1]] }) +
        rotulo(80, 30, 'esteira parada…', '#b8c3e8') + flash(0.55) + alerta(200, 30, 'PARTIU SEM AVISO')
      ),
      seguro: () => wrap(
        correia(20, 100, 280, 'parte') +
        `<g transform="translate(270 98)"><rect x="-2" y="-50" width="4" height="50" fill="#8d9bb8"/><rect x="-7" y="-76" width="14" height="10" rx="2" fill="#2ecc71"/>` +
        `<rect x="-7" y="-66" width="14" height="10" rx="2" fill="#f5c242"><animate attributeName="opacity" values="1;.2;1" dur=".4s" repeatCount="indefinite"/></rect><rect x="-7" y="-56" width="14" height="10" rx="2" fill="#e04848"/></g>` +
        janela(0, 0.5, `<g fill="none" stroke="#f5c242" stroke-width="2.5" stroke-linecap="round"><path d="M284 -2 q8 8 0 16" transform="translate(0 30)"/><path d="M290 -8 q14 14 0 28" transform="translate(0 30)"/></g>`) +
        mover('130 150;130 150;80 150;80 150', '0;.15;.42;1', pessoa(0, 0, { cor: '#d6589b', pose: [[com('alcanca', { mF: [24, -50] }), 0], [com('alcanca', { mF: [18, -52] }), .12],
          ['anda1', .2], ['anda2', .27], ['anda3', .34], ['anda4', .4], ['pe', .45], ['pe', .97], [com('alcanca', { mF: [24, -50] }), 1]] })) +
        rotulo(150, 30, 'sirene + luz por 5 s antes de partir', '#f5c242') + okSelo(150, 150 - 10, 'TODO MUNDO SE AFASTOU')
      )
    },
    9: {
      perigo: () => wrap(
        `<g transform="translate(110 90)"><circle r="18" fill="#cfd8ea" stroke="#5b6a8f" stroke-width="3"/><g><animateTransform attributeName="transform" type="rotate" from="0" to="1440" ${rep}/><line x1="-14" x2="14" stroke="#5b6a8f" stroke-width="3"/></g></g>` +
        `<g transform="translate(230 110)"><circle r="30" fill="#cfd8ea" stroke="#5b6a8f" stroke-width="3"/><g><animateTransform attributeName="transform" type="rotate" from="0" to="864" ${rep}/><line x1="-26" x2="26" stroke="#5b6a8f" stroke-width="3"/><line y1="-26" y2="26" stroke="#5b6a8f" stroke-width="3"/></g></g>` +
        `<path d="M110 72 L230 80 M110 108 L230 140" stroke="#222" stroke-width="5" stroke-dasharray="6 4"><animate attributeName="stroke-dashoffset" values="0;-200" ${rep}/></path>` +
        pessoa(72, 150, { cor: '#f08a3a', pose: [['pe', 0], ['pe', .1], [com('alcanca', { mF: [24, -60] }), .45], [com('puxado', { mF: [30, -62] }), .6], [com('puxado', { mF: [32, -60], q: [5, -26], o: [15, -43], c: [18, -53] }), .95], ['pe', 1]] }) + flash(0.55) + alerta(160, 24, 'AGARRAMENTO NA POLIA')
      ),
      seguro: () => wrap(
        `<g transform="translate(110 90)"><circle r="18" fill="#cfd8ea"/></g><g transform="translate(230 110)"><circle r="30" fill="#cfd8ea"/></g>` +
        `<rect x="76" y="56" width="196" height="94" rx="20" fill="#f26b3a"/><rect x="76" y="56" width="196" height="94" rx="20" fill="url(#m-malha)" opacity=".5"/>` +
        pessoa(46, 150, { cor: '#f08a3a', pose: [['pe', 0], ['pe', .1], [com('alcanca', { mF: [24, -56] }), .45], [com('alcanca', { mF: [24, -56] }), .95], ['pe', 1]] }) + okSelo(170, 30, 'TRANSMISSÃO ENCLAUSURADA')
      )
    },
    10: {
      perigo: () => wrap(
        `<line x1="20" y1="140" x2="300" y2="60" stroke="#4a73bf" stroke-width="16" stroke-linecap="round"/>` +
        mover('0 0;60 -18;120 -34;120 60;120 60', '0;.3;.5;.75;1', `<g transform="translate(110 92) rotate(-16)">${caixa(0, 0)}</g>`) +
        pessoa(250, 150, { cor: '#e8a33a', pose: [['pe', 0], ['pe', .62], ['choque', .72], [com('escorrega', { q: [-3, -23] }), .82], [com('escorrega', { q: [-3, -23] }), .95], ['pe', 1]] }) + flash(0.7) + alerta(110, 24, 'CAIXA CAIU DA ESTEIRA')
      ),
      seguro: () => wrap(
        `<line x1="20" y1="140" x2="300" y2="60" stroke="#4a73bf" stroke-width="16" stroke-linecap="round"/>` +
        `<line x1="20" y1="124" x2="300" y2="44" stroke="#f5c242" stroke-width="4"/>` +
        mover('0 0;60 -18;120 -34;170 -48', '0;.3;.6;1', `<g transform="translate(110 92) rotate(-16)">${caixa(0, -4)}</g>`) +
        pessoa(240, 150, { pose: 'pe', cor: '#e8a33a' }) + okSelo(110, 24, 'GUIAS LATERAIS SEGURAM A CARGA')
      )
    },
    11: {
      perigo: () => wrap(
        `<line x1="40" y1="140" x2="290" y2="50" stroke="#4a73bf" stroke-width="16" stroke-linecap="round"/>` +
        motorIco(290, 26, true) +
        mover('0 0;0 0;-140 50;-140 50', '0;.45;.8;1', `<g transform="translate(220 64) rotate(-20)">${caixa(0, -6)}</g>`) +
        pessoa(70, 150, { cor: '#26a69a', pose: [['pe', 0], ['pe', .7], ['choque', .8], ['choque', .95], ['pe', 1]] }) + flash(0.75) + alerta(160, 160, 'FALTOU ENERGIA: CARGA VOLTOU')
      ),
      seguro: () => wrap(
        `<line x1="40" y1="140" x2="290" y2="50" stroke="#4a73bf" stroke-width="16" stroke-linecap="round"/>` +
        [80, 130, 180, 230].map((x) => `<line x1="${x}" y1="${140 - (x - 40) * 0.36 - 10}" x2="${x}" y2="${140 - (x - 40) * 0.36 + 2}" stroke="#2c3c78" stroke-width="4"/>`).join('') +
        motorIco(290, 26, true) +
        `<g transform="translate(250 26)"><circle r="12" fill="#5b6a8f" stroke="#2ecc71" stroke-width="3"/><path d="M-6 0 a6 6 0 1 1 6 6" stroke="#fff" stroke-width="2" fill="none"/></g>` +
        `<g transform="translate(220 64) rotate(-20)">${caixa(0, -6)}</g>` +
        pessoa(70, 150, { pose: 'pe', cor: '#26a69a' }) + okSelo(140, 166, 'FREIO ANTI-RETORNO SEGUROU')
      )
    },
    12: {
      perigo: () => wrap(
        correia(20, 110, 280, 'anda') +
        mover('60 110;150 96;160 96;230 112', '0;.4;.55;1', `<g><animateTransform attributeName="transform" type="rotate" values="0;0;-25;-60" keyTimes="0;.4;.6;1" ${rep}/>${pessoa(0, 0, { cor: '#e8a33a', pose: [['corre', 0], ['anda1', .13], ['anda3', .26], ['anda1', .4], ['escorrega', .55], ['escorrega', 1]] })}</g>`) +
        flash(0.6) + alerta(160, 30, 'ESCORREGOU NA CORREIA')
      ),
      seguro: () => wrap(
        correia(20, 110, 280, 'anda') +
        `<path d="M90 150 L120 70 H200 L230 150" fill="none" stroke="#8d9bb8" stroke-width="8"/><path d="M110 50 H210" stroke="#f5c242" stroke-width="4"/><path d="M110 50 V70 M210 50 V70" stroke="#f5c242" stroke-width="3"/>` +
        mover('70 150;120 70;200 70;240 150', '0;.3;.7;1', pessoa(0, 0, { pose: anda(8), cor: '#e8a33a' })) +
        okSelo(160, 24, 'PASSARELA COM GUARDA-CORPO')
      )
    },
    13: {
      perigo: () => wrap(
        `<rect x="40" y="96" width="80" height="54" rx="6" fill="#8d9bb8"/><circle cx="120" cy="122" r="8" fill="#5b6a8f"/>` +
        `<g fill="none" stroke="#ff6b6b" stroke-width="3" stroke-linecap="round">${[0, 1, 2].map((i) => `<path d="M${136 + i * 16} ${104 - i * 8} q${10 + i * 6} ${18 + i * 8} 0 ${36 + i * 16}"><animate attributeName="opacity" values="0;1;0" dur="1s" begin="${i * 0.25}s" repeatCount="indefinite"/></path>`).join('')}</g>` +
        pessoa(240, 150, { cor: '#4caf50', pose: [['ouvidos', 0], [com('ouvidos', { c: [-1, -56] }), .25], [com('ouvidos', { c: [3, -56.5] }), .5], [com('ouvidos', { c: [-1, -56] }), .75], ['ouvidos', 1]] }) +
        `<g transform="translate(270 40)"><rect x="-26" y="-14" width="52" height="26" rx="6" fill="#e04848"/><text y="5" font-size="12" font-weight="800" text-anchor="middle" fill="#fff" font-family="system-ui,sans-serif">95 dB</text></g>`
      ),
      seguro: () => wrap(
        `<rect x="30" y="86" width="104" height="64" rx="8" fill="rgba(143,180,238,.35)" stroke="#8fb4ee" stroke-width="2"/>` +
        `<rect x="40" y="96" width="80" height="54" rx="6" fill="#8d9bb8"/><circle cx="62" cy="96" r="6" fill="#2ecc71"><animate attributeName="opacity" values="1;.3;1" dur="1s" repeatCount="indefinite"/></circle>` +
        `<path d="M146 112 q8 12 0 24" fill="none" stroke="#8fb4ee" stroke-width="2"/>` +
        pessoa(240, 150, { cor: '#4caf50', protetor: true, flip: true, pose: [['pe', 0], ['operando', .35], ['operando', .65], ['pe', 1]] }) +
        `<g transform="translate(270 40)"><rect x="-26" y="-14" width="52" height="26" rx="6" fill="#2ecc71"/><text y="5" font-size="12" font-weight="800" text-anchor="middle" fill="#062b16" font-family="system-ui,sans-serif">78 dB</text></g>` +
        rotulo(82, 76, 'sensor de vibração', '#6ff0a6')
      )
    },
    14: {
      perigo: () => wrap(
        `<rect x="20" y="50" width="70" height="100" rx="4" fill="#8d9bb8"/>` +
        `<g fill="#9aa3b5" opacity=".7">${[0, 1, 2].map((i) => `<circle cx="${50 + i * 8}" cy="${54 - i * 8}" r="${7 + i * 2}"><animate attributeName="cy" values="${54 - i * 8};${44 - i * 8}" dur="1.5s" repeatCount="indefinite"/></circle>`).join('')}</g>` +
        `<rect x="190" y="100" width="20" height="44" rx="6" fill="#e53935"/>` + caixa(170, 110, 36, 40) + caixa(210, 110, 36, 40) + caixa(186, 76, 36, 34) +
        mover('300 150;250 150;250 150', '0;.5;1', pessoa(0, 0, { cor: '#4a73bf', flip: true, pose: [...anda(4, 0, .5), [com('alcanca', { mF: [26, -40] }), .62], [com('choque', { o: [-2, -47] }), .75], [com('alcanca', { mF: [26, -40] }), .9], ['anda1', 1]] })) +
        alerta(160, 22, 'NÃO DÁ PARA PEGAR O EXTINTOR')
      ),
      seguro: () => wrap(
        `<rect x="20" y="50" width="70" height="100" rx="4" fill="#8d9bb8"/>` +
        `<rect x="160" y="150" width="64" height="10" fill="#f5c242"/><rect x="168" y="150" width="48" height="10" fill="#e53935"/>` +
        `<g transform="translate(192 60)"><rect x="-10" y="-10" width="20" height="20" rx="2" fill="#e53935"/><path d="M-3 6 v-10 h6 l1 -3" stroke="#fff" stroke-width="2" fill="none"/></g>` +
        mover('0 0;0 0;0 -20;0 -20', '0;.55;.6;1', `<rect x="182" y="104" width="20" height="44" rx="6" fill="#e53935"/>`) +
        mover('300 150;214 150;214 150', '0;.5;1', pessoa(0, 0, { cor: '#4a73bf', flip: true, pose: [...anda(4, 0, .5), [com('alcanca', { mF: [22, -48] }), .56], ['segura', .65], ['segura', .97], ['anda1', 1]] })) +
        caixa(270, 128, 22, 22) + okSelo(130, 22, 'LIVRE, DEMARCADO, SINALIZADO')
      )
    }
  };

  // ---------- ícones ----------
  function iconeAlerta(n) {
    return `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 3 L38 35 H2 Z" fill="#f5c242" stroke="#1e2756" stroke-width="2" stroke-linejoin="round"/><text x="20" y="31" text-anchor="middle" font-size="18" font-weight="900" fill="#1e2756" font-family="system-ui,sans-serif">!</text></svg>`;
  }
  function iconeEscudo() {
    return `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 2 L36 8 V20 C36 30 29 36 20 39 C11 36 4 30 4 20 V8 Z" fill="#2ecc71" stroke="#0f5132" stroke-width="2"/><path d="M12 20 l6 6 l11 -12" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }
  function iconeLupa() {
    return `<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="17" cy="17" r="11" fill="none" stroke="#f5c242" stroke-width="4"/><path d="M25 25 L36 36" stroke="#f5c242" stroke-width="5" stroke-linecap="round"/></svg>`;
  }
  const ICONES_NO = {
    entrada: `<svg viewBox="0 0 40 40"><rect x="6" y="12" width="16" height="16" rx="3" fill="#8fb4ee"/><circle cx="22" cy="20" r="3" fill="#ff4d4d"/><path d="M26 20 h10" stroke="#ff4d4d" stroke-width="2" stroke-dasharray="3 2"/></svg>`,
    logica: `<svg viewBox="0 0 40 40"><rect x="9" y="9" width="22" height="22" rx="3" fill="#f5c242"/><text x="20" y="24" font-size="8" font-weight="900" text-anchor="middle" fill="#3a2a00" font-family="system-ui,sans-serif">CLP</text><path d="M14 9 v-4 M20 9 v-4 M26 9 v-4 M14 31 v4 M20 31 v4 M26 31 v4" stroke="#f5c242" stroke-width="2"/></svg>`,
    saida: `<svg viewBox="0 0 40 40"><rect x="4" y="12" width="24" height="16" rx="3" fill="#8d9bb8"/><circle cx="32" cy="20" r="5" fill="#5b6a8f"/><path d="M10 34 h16" stroke="#2ecc71" stroke-width="3" stroke-linecap="round"/></svg>`
  };

  window.ANIM = { CENAS, iconeAlerta, iconeEscudo, iconeLupa, ICONES_NO };
})();
