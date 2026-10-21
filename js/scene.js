/*
 * Monta o cenário isométrico principal (paisagem, viewBox 1440×810).
 * Traçado em serpentina, com três trechos longos ligados por duas curvas:
 *   R1 (alto, anda para a direita) → K1 (desce na ponta direita) → R2 (volta para a esquerda)
 *   → K2 (desce na ponta esquerda) → R3 (inclinada, sobe até a plataforma de paletização).
 * Cada problema tem grupos <g class="prob" data-p="N"> com <g class="perigo"> e <g class="seguro">.
 * O app troca a classe "fixed" nesses grupos quando o problema é corrigido.
 * ANCORAS[N] = ponto do mundo [x, y, z] onde o pin do problema N aparece.
 */
(function () {
  const { P, S, poly, box, rolo, esteira, pessoa, robo, sinaleiro, extintor, ondasSom, faiscas, engrenagem, COR, r1 } = window.ISO;
  const W = window.ISO.ISO.W, H = window.ISO.ISO.H;
  const { com } = window.HUMANO;

  // ---------- Layout (coordenadas do mundo) ----------
  const L = {
    A0: { eixo: 'x', a0: 0, a1: 110, c: 0, w: 70 },                               // mesa de alimentação (problema 6)
    R1: { eixo: 'x', a0: 110, a1: 900, c: 0, w: 70, z0: 40 },
    K1: { eixo: 'y', a0: 0, a1: 300, c: 900, w: 70, z0: 36 },
    R2: { eixo: 'x', a0: 150, a1: 900, c: 230, w: 70, z0: 32, rev: true },
    K2: { eixo: 'y', a0: 230, a1: 570, c: 80, w: 70, z0: 30 },
    R3: { eixo: 'x', a0: 150, a1: 780, c: 500, w: 70, z0: 24, z1: 84 }           // inclinada
  };
  const zR3 = (x) => L.R3.z0 + ((L.R3.z1 - L.R3.z0) * (x - L.R3.a0)) / (L.R3.a1 - L.R3.a0);

  const ANCORAS = {
    1: [935, 300, 100],
    2: [760, 78, 62],
    3: [330, 35, 62],
    4: [291, 355, 92],
    5: [720, 316, 70],
    6: [55, 100, 75],
    7: [830, 535, 128],
    8: [470, 320, 75],
    9: [1005, 280, 58],
    10: [520, 570, 105],
    11: [280, 570, 75],
    12: [585, 10, 150],
    13: [770, 585, 110],
    14: [352, 380, 28]
  };

  const prob = (id, perigo, seguro) =>
    `<g class="prob" data-p="${id}"><g class="perigo">${perigo}</g><g class="seguro">${seguro}</g></g>`;

  // Bloco de grade (proteção) translúcido com malha
  function grade(x, y, z, w, d, h) {
    const f = 'fill="url(#malha)" stroke="#ffd84d" stroke-width="1.4"';
    const faces = [
      [[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]],
      [[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]],
      [[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]]
    ];
    const fundo = ['rgba(255,216,77,.18)', 'rgba(255,216,77,.12)', 'rgba(255,216,77,.22)'];
    return '<g>' + faces.map((fc, i) => poly(fc, fundo[i]) + poly(fc, 'none', f)).join('') + '</g>';
  }

  function caixaIso(x, y, z, t = 24, h = 18) {
    return box(x, y, z, t, t, h, COR.caixa) +
      poly([[x + t / 2 - 2, y, z + h], [x + t / 2 + 2, y, z + h], [x + t / 2 + 2, y + t, z + h], [x + t / 2 - 2, y + t, z + h]], '#c9924f');
  }

  // Caixa que anda de um ponto a outro (translate em tela, CSS)
  function caixaMovel(de, para, dur, atraso) {
    const a = P(...de), b = P(...para);
    return `<g class="mover" style="--dx:${r1(b[0] - a[0])}px;--dy:${r1(b[1] - a[1])}px;--t:${dur}s;--d:${atraso}s">${caixaIso(de[0] - 12, de[1] - 12, de[2])}</g>`;
  }

  function linhaMundo(a, b, extra) {
    const p = P(...a), q = P(...b);
    return `<line x1="${r1(p[0])}" y1="${r1(p[1])}" x2="${r1(q[0])}" y2="${r1(q[1])}" ${extra}/>`;
  }

  const marcaPerigo = (p) => `<g transform="translate(${p.x} ${p.y})" class="blink"><circle r="7" fill="#e04848"/><text y="4" text-anchor="middle" font-size="10" font-weight="800" fill="#fff">!</text></g>`;
  const ESC = 1.4; // escala das pessoas

  // ---------- Fundo ----------
  function fundo() {
    let s = poly([[-260, -260, 0], [1180, -260, 0], [1180, 820, 0], [-260, 820, 0]], '#232e6c');
    for (let k = 0; k <= 1440; k += 90) {
      s += linhaMundo([-260 + k, -260, 0], [-260 + k, 820, 0], 'stroke="#ffffff" stroke-opacity=".035"');
      s += linhaMundo([-260, -260 + k * 0.75, 0], [1180, -260 + k * 0.75, 0], 'stroke="#ffffff" stroke-opacity=".035"');
    }
    s += engrenagem(80, 110, 40, '#ffffff', 0.05);
    s += engrenagem(1360, 110, 32, '#ffffff', 0.05, 'gira-rev');
    s += engrenagem(1360, 730, 46, '#ffffff', 0.05);
    s += engrenagem(80, 730, 30, '#ffffff', 0.05, 'gira-rev');
    // faixas de circulação entre os trechos
    s += linhaMundo([180, 165, 0], [860, 165, 0], 'stroke="#f5c242" stroke-opacity=".28" stroke-width="3" stroke-dasharray="14 10"');
    s += linhaMundo([200, 405, 0], [740, 405, 0], 'stroke="#f5c242" stroke-opacity=".28" stroke-width="3" stroke-dasharray="14 10"');
    return s;
  }

  // ---------- Trecho 1 (R1) + mesa de alimentação ----------
  function trecho1() {
    let s = '';
    // problema 12 (seguro): escada de trás da passarela fica atrás da esteira
    let escadaTras = '';
    for (let k = 0; k < 5; k++) escadaTras += box(540, -44 + k * 7, 0, 36, 7, 14 + k * 14, COR.cinza);
    s += prob(12, '', escadaTras);

    // problema 6: mesa de alimentação baixa x mesa elevatória
    const A0 = L.A0;
    const w1 = S(55, 104, 0);
    let tesoura = '';
    [[8, 70], [8, 2]].forEach(([x, y]) => {
      const a = S(x, y, 0), b = S(x + 84, y, 28), c = S(x + 84, y, 0), d = S(x, y, 28);
      tesoura += `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="#f5c242" stroke-width="3"/><line x1="${c.x}" y1="${c.y}" x2="${d.x}" y2="${d.y}" stroke="#f5c242" stroke-width="3"/>`;
    });
    s += prob(6,
      esteira({ ...A0, z0: 18 }) + caixaIso(20, 20, 18) + pessoa(w1.x, w1.y, { pose: [['curvado', 0], [com('curvado', { mF: [28, -26], mT: [24, -27] }), .5], ['curvado', 1]], flip: true, camisa: '#3f8de0', escala: ESC }),
      tesoura + esteira({ ...A0, z0: 40, pernas: 999 }) + caixaIso(20, 20, 40) + pessoa(w1.x, w1.y, { pose: [['operando', 0], [com('operando', { mF: [21, -35] }), .5], ['operando', 1]], flip: true, camisa: '#3f8de0', escala: ESC })
    );

    s += esteira({ ...L.R1, z1: 40 });
    for (let i = 0; i < 4; i++) s += caixaMovel([130, 35, 40], [885, 35, 40], 12, -i * 3);

    // problema 3: caixa atravessada e travada x sensor de acúmulo
    s += prob(3,
      `<g class="treme">${box(314, 22, 40, 34, 26, 18, COR.caixa)}</g>` + marcaPerigo(S(340, 30, 66)),
      box(334, -8, 0, 6, 6, 52, COR.cinza) + box(332, -10, 48, 10, 10, 8, COR.escuro) +
      linhaMundo([337, -4, 50], [337, 76, 50], 'stroke="#ff4d4d" stroke-width="1.6" stroke-dasharray="4 3" class="feixe"') +
      box(334, 74, 0, 6, 6, 52, COR.cinza) + box(332, 72, 48, 10, 10, 8, COR.escuro) +
      `<circle cx="${S(337, 77, 60).x}" cy="${S(337, 77, 60).y}" r="2.6" fill="#2ecc71" class="blink"/>`
    );

    // problema 12: travessia por cima da esteira x passarela
    const pulo = S(558, 35, 40);
    let passarela = box(540, -10, 62, 36, 90, 8, COR.cinza);
    for (let k = 0; k < 5; k++) passarela += box(540, 80 + k * 7, 0, 36, 7, 70 - k * 14, COR.cinza);
    passarela += linhaMundo([540, -10, 92], [540, 80, 92], 'stroke="#f5c242" stroke-width="2.5"') +
      linhaMundo([576, -10, 92], [576, 80, 92], 'stroke="#f5c242" stroke-width="2.5"') +
      linhaMundo([576, 80, 70], [576, 80, 92], 'stroke="#f5c242" stroke-width="2"') +
      linhaMundo([576, 80, 92], [576, 114, 70], 'stroke="#f5c242" stroke-width="2.5"');
    const topo = S(560, 35, 70);
    s += prob(12,
      pessoa(pulo.x, pulo.y, { pose: [['anda1', 0], ['pulando', .45], ['pulando', .6], ['anda3', 1]], camisa: '#e8a33a', escala: ESC }),
      passarela + pessoa(topo.x, topo.y, { pose: 'pe', camisa: '#e8a33a', escala: 1.3 })
    );

    // problema 2: cabo de emergência ao longo da frente do trecho 1
    let cabo = '';
    [150, 300, 450, 640, 800].forEach((x) => { cabo += box(x, 76, 0, 4, 4, 54, COR.amarelo); });
    cabo += linhaMundo([110, 78, 52], [895, 78, 52], 'stroke="#f5c242" stroke-width="2.4"');
    const cogumelo = (p) => `<g transform="translate(${p.x} ${p.y})"><rect x="-6" y="-2" width="12" height="12" rx="2" fill="#f5c242"/><ellipse cx="0" cy="-3" rx="6" ry="3.5" fill="#e04848"/></g>`;
    cabo += cogumelo(S(104, 82, 46)) + cogumelo(S(900, 82, 46));
    const semCabo = `<g transform="translate(${S(760, 80, 40).x} ${S(760, 80, 40).y})"><rect x="-13" y="-11" width="26" height="18" rx="3" fill="#26304f" stroke="#e04848" stroke-width="1.5" stroke-dasharray="3 2"/><text y="2" text-anchor="middle" font-size="9" fill="#ff8080" font-weight="700">?</text></g>`;
    s += prob(2, semCabo, cabo);
    return s;
  }

  // ---------- Curva da esquerda (K2), atrás do trecho 2 ----------
  function curvaEsquerda() {
    let s = esteira({ ...L.K2, z1: L.K2.z0 });
    for (let i = 0; i < 2; i++) s += caixaMovel([115, 250, 30], [115, 555, 30], 7, -i * 3.5);
    return s;
  }

  // ---------- Trecho 2 (R2, volta para a esquerda) e o que fica na frente dele ----------
  function trecho2() {
    let s = esteira({ ...L.R2, z1: L.R2.z0 });
    for (let i = 0; i < 4; i++) s += caixaMovel([885, 265, 32], [165, 265, 32], 12, -i * 3);

    // problema 4: painel elétrico da esteira, ligado à linha pela eletrocalha
    s += linhaMundo([291, 300, 58], [291, 340, 58], 'stroke="#8d9bb8" stroke-width="5"');
    s += box(260, 340, 0, 62, 30, 78, COR.cinza);
    const fechada = poly([[264, 370, 6], [318, 370, 6], [318, 370, 74], [264, 370, 74]], '#a9b6cf') +
      poly([[310, 370, 40], [314, 370, 40], [314, 370, 46], [310, 370, 46]], '#e04848');
    const aberta = poly([[264, 370, 6], [264, 414, 6], [264, 414, 74], [264, 370, 74]], '#a9b6cf') +
      poly([[266, 370, 10], [316, 370, 10], [316, 370, 70], [266, 370, 70]], '#26304f') +
      poly([[272, 370, 50], [284, 370, 50], [284, 370, 64], [272, 370, 64]], '#5fe39a') +
      poly([[290, 370, 50], [310, 370, 50], [310, 370, 64], [290, 370, 64]], '#8fb4ee') +
      poly([[272, 370, 20], [310, 370, 20], [310, 370, 30], [272, 370, 30]], '#f5c242');
    const raio = S(291, 370, 82);
    const placa = `<g transform="translate(${raio.x} ${raio.y - 4})"><path d="M0 -9 L9 7 H-9Z" fill="#ffd84d" stroke="#222" stroke-width="1"/><path d="M1 -4 l-3 5 h3 l-2 5" stroke="#222" stroke-width="1.3" fill="none"/></g>`;
    const terra = S(322, 354, 4);
    s += prob(4,
      aberta + faiscas(S(288, 370, 40).x, S(288, 370, 40).y),
      fechada + placa +
      `<g transform="translate(${terra.x + 4} ${terra.y})" stroke="#2ecc71" stroke-width="2"><path d="M0 0 v-8 M-6 0 h12 M-4 3 h8 M-2 6 h4"/></g>` +
      `<g transform="translate(${S(318, 370, 46).x} ${S(318, 370, 46).y})"><rect x="-3" y="-4" width="7" height="8" rx="1.5" fill="#e04848"/><path d="M-1.5 -4 v-3 a2 2 0 0 1 4 0 v3" stroke="#e04848" fill="none" stroke-width="1.4"/></g>`
    );

    // problema 14 (escondido): extintor ao lado do painel, atrás de caixas
    const ext = S(352, 386, 0);
    s += prob(14,
      extintor(ext.x, ext.y) + caixaIso(336, 398, 0, 26, 20) + caixaIso(362, 398, 0, 26, 20) + caixaIso(344, 402, 20, 26, 20) + caixaIso(350, 398, 40, 22, 16),
      poly([[332, 366, 0.2], [372, 366, 0.2], [372, 406, 0.2], [332, 406, 0.2]], '#f5c242') +
      poly([[338, 372, 0.4], [366, 372, 0.4], [366, 400, 0.4], [338, 400, 0.4]], '#e53935') +
      extintor(ext.x, ext.y) +
      `<g transform="translate(${ext.x + 2} ${ext.y - 62})"><rect x="-9" y="-9" width="18" height="18" rx="2" fill="#e53935"/><path d="M-3 5 v-8 h5 l1 -3" stroke="#fff" stroke-width="2" fill="none"/></g>` +
      caixaIso(420, 432, 0, 24, 18) + caixaIso(446, 432, 0, 24, 18)
    );

    // problema 8: partida inesperada (operador limpando a correia)
    const op8 = S(470, 336, 0), bec = S(525, 310, 0);
    s += prob(8,
      pessoa(op8.x, op8.y, { pose: [[com('alcanca', { mF: [24, -40] }), 0], [com('alcanca', { mF: [16, -38] }), .5], [com('alcanca', { mF: [24, -40] }), 1]], camisa: '#d6589b', escala: ESC }) +
      `<g transform="translate(${op8.x + 26} ${op8.y - 40})" class="blink"><path d="M0 0 h10 l-3 -4 M10 0 l-3 4" stroke="#ff6b6b" stroke-width="2" fill="none"/></g>`,
      sinaleiro(bec.x, bec.y, true) + pessoa(op8.x - 20, op8.y + 12, { pose: 'pe', camisa: '#d6589b', escala: ESC }) +
      `<g transform="translate(${op8.x - 40} ${op8.y - 64})"><rect x="-20" y="-9" width="40" height="14" rx="3" fill="#f5c242"/><text y="2" text-anchor="middle" font-size="7.5" font-weight="800" fill="#222">ALERTA</text></g>`
    );

    // problema 5: manutenção sem LOTO (técnico no rolete + seccionadora local)
    const tec = S(720, 334, 0), sec = S(762, 326, 0);
    const poste = box(762, 326, 0, 6, 6, 40, COR.escuro) + box(756, 320, 36, 18, 10, 22, COR.cinza);
    const alavancaOn = `<g transform="translate(${sec.x + 4} ${sec.y - 48})"><rect x="-2" y="-12" width="4" height="12" fill="#2ecc71"/><text x="6" y="-3" font-size="7" fill="#5fe39a" font-weight="700">ON</text></g>`;
    const alavancaOff = `<g transform="translate(${sec.x + 4} ${sec.y - 48})"><rect x="-2" y="-2" width="12" height="4" fill="#e04848"/>` +
      `<rect x="6" y="1" width="8" height="8" rx="1.5" fill="#e04848"/><path d="M7.5 1 v-3 a2.5 2.5 0 0 1 5 0 v3" stroke="#e04848" fill="none" stroke-width="1.6"/>` +
      `<g class="balanca" style="transform-origin:10px 9px"><line x1="10" y1="9" x2="10" y2="14" stroke="#fff"/><rect x="5" y="14" width="11" height="13" rx="1" fill="#fff"/><rect x="5" y="14" width="11" height="4" fill="#e04848"/></g></g>`;
    const zero = `<g transform="translate(${tec.x - 34} ${tec.y - 64})"><rect x="-17" y="-10" width="34" height="16" rx="8" fill="#2ecc71"/><text y="2" text-anchor="middle" font-size="9" font-weight="700" fill="#0b3d20">0 V</text></g>`;
    s += prob(5,
      poste + alavancaOn + pessoa(tec.x, tec.y, { pose: [['ajoelhado', 0], [com('ajoelhado', { mF: [21, -33] }), .5], ['ajoelhado', 1]], camisa: '#2f9e8f', escala: ESC }) +
      `<g transform="translate(${tec.x + 22} ${tec.y - 24})" stroke="#cfd8ea" stroke-width="2.5" stroke-linecap="round"><path d="M0 0 l8 -8"/><circle cx="9" cy="-9" r="3" fill="none"/></g>`,
      poste + alavancaOff + zero + pessoa(tec.x, tec.y, { pose: [['ajoelhado', 0], [com('ajoelhado', { mF: [21, -33] }), .5], ['ajoelhado', 1]], camisa: '#2f9e8f', escala: ESC })
    );
    return s;
  }

  // ---------- Curva da direita (K1): tambor de tração + motor ----------
  function curvaDireita() {
    let s = esteira({ ...L.K1, z1: L.K1.z0 });
    for (let i = 0; i < 2; i++) s += caixaMovel([935, 20, 36], [935, 285, 36], 6, -i * 3);
    s += rolo('x', 900, 290, 30, 70, 10);

    // problema 1: ponto de esmagamento no tambor x proteção com intertravamento
    const nip = S(970, 296, 30);
    s += prob(1,
      `<g transform="translate(${nip.x} ${nip.y})" class="blink"><path d="M-8 -3 l8 6 l8 -6" stroke="#ff4d4d" stroke-width="2.5" fill="none"/></g>`,
      grade(896, 276, 8, 80, 36, 40) +
      `<g transform="translate(${S(976, 286, 50).x} ${S(976, 286, 50).y})"><rect x="-4" y="-6" width="8" height="10" rx="1.5" fill="#2ecc71"/><circle cy="-1" r="1.6" fill="#0b3d20"/></g>`
    );

    // problema 9: motor + redutor e a transmissão exposta
    s += box(985, 262, 0, 30, 30, 22, COR.escuro) + box(988, 266, 22, 24, 22, 20, COR.orange) + box(1015, 272, 4, 30, 18, 18, COR.cinza);
    const pol1 = S(979, 280, 32), pol2 = S(979, 306, 20);
    const transm = `<g><circle cx="${pol1.x}" cy="${pol1.y}" r="7" fill="#cfd8ea" stroke="#5b6a8f" stroke-width="2"/><circle cx="${pol2.x}" cy="${pol2.y}" r="10" fill="#cfd8ea" stroke="#5b6a8f" stroke-width="2"/>` +
      `<path class="correia-anda" d="M${pol1.x - 7} ${pol1.y} L${pol2.x - 10} ${pol2.y} M${pol1.x + 7} ${pol1.y} L${pol2.x + 10} ${pol2.y}" stroke="#222" stroke-width="2.5" stroke-dasharray="4 3"/>` +
      `<circle class="spin" style="transform-origin:${pol1.x}px ${pol1.y}px" cx="${pol1.x}" cy="${pol1.y - 5}" r="1.6" fill="#24326a"/><circle class="spin" style="transform-origin:${pol2.x}px ${pol2.y}px" cx="${pol2.x}" cy="${pol2.y - 8}" r="2" fill="#24326a"/></g>`;
    s += prob(9, transm, transm + grade(971, 270, 6, 14, 42, 36));
    return s;
  }

  // ---------- Trecho 3 (R3, inclinada) + paletização ----------
  function trecho3() {
    const R3 = L.R3;
    let s = esteira(R3);

    // problema 11: caixa escorregando x taliscas + freio anti-retorno
    let taliscas = '';
    for (let x = 180; x < 780; x += 45) taliscas += linhaMundo([x, 502, zR3(x) + 1], [x, 568, zR3(x) + 1], 'stroke="#2c3c78" stroke-width="2.5"');
    const de = [360, 535, zR3(360)], para = [270, 535, zR3(270)];
    const a = P(...de), b = P(...para);
    const desce = `<g class="escorrega" style="--dx:${r1(b[0] - a[0])}px;--dy:${r1(b[1] - a[1])}px">${caixaIso(348, 523, zR3(360))}</g>`;
    const back = S(780, 580, 70);
    s += prob(11,
      desce + `<g transform="translate(${S(240, 535, 50).x} ${S(240, 535, 50).y})" class="blink"><path d="M0 0 l-12 6 m0 0 l4 -6 m-4 6 l7 2" stroke="#ff6b6b" stroke-width="2.2" fill="none"/></g>`,
      taliscas + `<g transform="translate(${back.x} ${back.y})"><circle r="9" fill="#5b6a8f" stroke="#2ecc71" stroke-width="2.5"/><path d="M-4 0 a4 4 0 1 1 4 4" stroke="#fff" stroke-width="1.8" fill="none"/></g>`
    );
    for (let i = 0; i < 3; i++) s += caixaMovel([170, 535, zR3(170)], [770, 535, zR3(770)], 10, -i * 3.3);

    // problema 10: queda de material x guias laterais
    const p = S(520, 572, zR3(520));
    const queda = `<g class="cai" style="transform-origin:${p.x}px ${p.y}px"><g transform="translate(${p.x - 14} ${p.y - 18}) rotate(18)"><rect width="22" height="16" fill="#dda15c"/><rect width="22" height="5" fill="#f6cf98"/></g></g>` +
      `<g transform="translate(${S(520, 630, 0).x} ${S(520, 630, 0).y})"><ellipse rx="16" ry="5" fill="#000" opacity=".25"/></g>`;
    const guias = linhaMundo([170, 500, zR3(170) + 10], [780, 500, zR3(780) + 10], 'stroke="#f5c242" stroke-width="3"') +
      linhaMundo([170, 570, zR3(170) + 10], [780, 570, zR3(780) + 10], 'stroke="#f5c242" stroke-width="3"');
    s += prob(10, queda, guias);

    // plataforma de paletização
    s += box(780, 480, 0, 100, 110, 46, COR.escuro);
    s += poly([[780, 480, 46.2], [880, 480, 46.2], [880, 590, 46.2], [780, 590, 46.2]], '#4a5a85');
    s += linhaMundo([880, 480, 46], [880, 590, 46], 'stroke="#f5c242" stroke-width="2"') + linhaMundo([880, 480, 76], [880, 590, 76], 'stroke="#f5c242" stroke-width="2"');
    s += box(830, 490, 46, 46, 46, 6, COR.palete);
    s += caixaIso(834, 494, 52) + caixaIso(852, 494, 52) + caixaIso(834, 512, 52);

    // problema 7: levantamento manual x robô paletizador
    const op7 = S(805, 566, 46);
    s += prob(7,
      pessoa(op7.x, op7.y, { pose: [['levanta', 0], ['levanta', .2], ['segura', .55], ['segura', .75], ['levanta', 1]], camisa: '#ef6c57', escala: ESC }) +
      `<g transform="translate(${op7.x + 20} ${op7.y - 28})"><rect x="-8" y="-6" width="16" height="12" fill="#dda15c"/></g>` +
      `<g transform="translate(${op7.x - 4} ${op7.y - 20})" class="blink"><path d="M0 -6 q-6 4 0 10" stroke="#ff6b6b" stroke-width="2" fill="none"/></g>`,
      robo(S(862, 486, 46).x, S(862, 486, 46).y, { escala: 0.85 }) +
      pessoa(S(866, 580, 46).x, S(866, 580, 46).y, { pose: 'operando', camisa: '#ef6c57', escala: 1.3, flip: true })
    );

    // problema 13: ruído do motor de acionamento da inclinada
    const motorR3 = box(758, 576, 0, 24, 18, 40, COR.escuro) + box(754, 572, 40, 30, 24, 20, COR.cinza) + rolo('x', 784, 584, 50, 8, 6);
    const mot = S(770, 584, 60);
    const op13 = S(738, 628, 0);
    s += prob(13,
      motorR3 + ondasSom(mot.x + 22, mot.y - 10) + pessoa(op13.x, op13.y, { pose: [['ouvidos', 0], [com('ouvidos', { c: [-1, -56] }), .5], ['ouvidos', 1]], camisa: '#4caf50', escala: ESC }),
      motorR3 + grade(748, 566, 38, 44, 34, 30) + box(748, 566, 38, 44, 34, 30, { top: 'rgba(143,180,238,.5)', left: 'rgba(74,115,191,.55)', right: 'rgba(58,95,166,.55)' }) +
      `<g transform="translate(${mot.x - 46} ${mot.y - 30})"><rect x="-19" y="-10" width="38" height="17" rx="5" fill="#2ecc71"/><text y="3" text-anchor="middle" font-size="9" font-weight="800" fill="#0b3d20">78 dB</text></g>` +
      pessoa(op13.x, op13.y, { pose: 'pe', camisa: '#4caf50', escala: ESC, protetor: true })
    );
    return s;
  }

  function defs() {
    return `<defs>
      <pattern id="malha" width="6" height="6" patternUnits="userSpaceOnUse"><path d="M0 6 L6 0 M-1 1 L1 -1 M5 7 L7 5" stroke="#ffd84d" stroke-width="1"/></pattern>
    </defs>`;
  }

  // ordem do pintor: o que está mais ao fundo primeiro
  function montar() {
    return `<svg class="cena" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="cena-titulo">
      <title id="cena-titulo">Infográfico isométrico de uma esteira automatizada em serpentina com os pontos de risco marcados</title>
      ${defs()}
      ${fundo()}
      ${trecho1()}
      ${curvaEsquerda()}
      ${trecho2()}
      ${curvaDireita()}
      ${trecho3()}
    </svg>`;
  }

  function telaParaPercentual(id) {
    const p = P(...ANCORAS[id]);
    return { left: (p[0] / W) * 100, top: (p[1] / H) * 100 };
  }

  window.CENA = { montar, ANCORAS, telaParaPercentual, W, H };
})();
