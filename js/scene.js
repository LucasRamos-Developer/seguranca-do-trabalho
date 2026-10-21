/*
 * Monta o cenário isométrico principal.
 * Cada problema tem grupos <g class="prob" data-p="N"> com <g class="perigo"> e <g class="seguro">.
 * O app troca a classe "fixed" nesses grupos quando o problema é corrigido.
 * ANCORAS[N] = ponto do mundo [x, y, z] onde o pin do problema N aparece.
 */
(function () {
  const { P, S, poly, box, rolo, esteira, pessoa, robo, sinaleiro, extintor, ondasSom, faiscas, engrenagem, COR, r1 } = window.ISO;
  const W = window.ISO.ISO.W, H = window.ISO.ISO.H;

  // ---------- Layout (coordenadas do mundo) ----------
  const L = {
    A0: { eixo: 'x', a0: 40, a1: 150, c: 130, w: 70 },              // mesa de alimentação (altura muda: problema 6)
    A:  { eixo: 'x', a0: 150, a1: 400, c: 130, w: 70, z0: 40 },     // esteira de entrada
    B:  { eixo: 'y', a0: 130, a1: 820, c: 400, w: 70, z0: 36 },     // linha principal
    C:  { eixo: 'x', a0: 400, a1: 770, c: 820, w: 70, z0: 22, z1: 82 } // esteira inclinada
  };

  const ANCORAS = {
    1: [440, 815, 95],
    2: [478, 385, 62],
    3: [435, 232, 62],
    4: [135, 430, 92],
    5: [492, 585, 62],
    6: [92, 218, 70],
    7: [822, 862, 128],
    8: [492, 705, 70],
    9: [505, 765, 58],
    10: [662, 855, 112],
    11: [532, 855, 72],
    12: [436, 470, 82],
    13: [600, 300, 128],
    14: [770, 915, 110],
    15: [182, 452, 30]
  };

  const prob = (id, perigo, seguro) =>
    `<g class="prob" data-p="${id}"><g class="perigo">${perigo}</g><g class="seguro">${seguro}</g></g>`;

  // Bloco de grade (proteção) translúcido com malha
  function grade(x, y, z, w, d, h, extra = '') {
    const f = 'fill="url(#malha)" stroke="#ffd84d" stroke-width="1.4"';
    return `<g ${extra}>` +
      poly([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]], 'rgba(255,216,77,.18)') +
      poly([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]], 'none', f) +
      poly([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]], 'rgba(255,216,77,.12)') +
      poly([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]], 'none', f) +
      poly([[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]], 'rgba(255,216,77,.22)') +
      poly([[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]], 'none', f) +
      '</g>';
  }

  function caixaIso(x, y, z, t = 24, h = 18) {
    return box(x, y, z, t, t, h, COR.caixa) +
      poly([[x + t / 2 - 2, y, z + h], [x + t / 2 + 2, y, z + h], [x + t / 2 + 2, y + t, z + h], [x + t / 2 - 2, y + t, z + h]], '#c9924f');
  }

  // Caixa que anda de A até B (translate em tela, CSS)
  function caixaMovel(de, para, dur, atraso) {
    const a = P(...de), b = P(...para);
    const dx = r1(b[0] - a[0]), dy = r1(b[1] - a[1]);
    return `<g class="mover" style="--dx:${dx}px;--dy:${dy}px;--t:${dur}s;--d:${atraso}s">${caixaIso(de[0] - 12, de[1] - 12, de[2])}</g>`;
  }

  function linhaMundo(a, b, extra) {
    const p = P(...a), q = P(...b);
    return `<line x1="${r1(p[0])}" y1="${r1(p[1])}" x2="${r1(q[0])}" y2="${r1(q[1])}" ${extra}/>`;
  }

  // ---------- Fundo ----------
  function fundo() {
    let s = '';
    // piso
    s += poly([[-40, 60, 0], [1000, 60, 0], [1000, 1000, 0], [-40, 1000, 0]], '#232e6c');
    // grade isométrica do piso
    for (let k = 0; k <= 1040; k += 80) {
      s += linhaMundo([-40 + k, 60, 0], [-40 + k, 1000, 0], 'stroke="#ffffff" stroke-opacity=".035"');
      s += linhaMundo([-40, 60 + k * 0.9, 0], [1000, 60 + k * 0.9, 0], 'stroke="#ffffff" stroke-opacity=".035"');
    }
    // engrenagens decorativas
    s += engrenagem(80, 90, 46, '#ffffff', 0.05);
    s += engrenagem(840, 160, 34, '#ffffff', 0.05, 'gira-rev');
    s += engrenagem(830, 900, 52, '#ffffff', 0.05);
    s += engrenagem(70, 860, 30, '#ffffff', 0.05, 'gira-rev');
    // faixas de circulação (amarelas) no piso
    s += linhaMundo([300, 520, 0], [300, 780, 0], 'stroke="#f5c242" stroke-opacity=".3" stroke-width="3" stroke-dasharray="14 10"');
    s += linhaMundo([300, 780, 0], [370, 780, 0], 'stroke="#f5c242" stroke-opacity=".3" stroke-width="3" stroke-dasharray="14 10"');
    return s;
  }

  // ---------- Painel elétrico + extintor escondido (problemas 4 e 15) ----------
  function painel() {
    let s = '';
    // painel
    s += box(100, 396, 0, 62, 30, 78, COR.cinza);
    // porta (face y+d) e detalhes
    const fechada = poly([[104, 426, 6], [158, 426, 6], [158, 426, 74], [104, 426, 74]], '#a9b6cf') +
      `<g>${poly([[150, 426, 40], [154, 426, 40], [154, 426, 46], [150, 426, 46]], '#e04848')}</g>`;
    const aberta = poly([[104, 426, 6], [104, 470, 6], [104, 470, 74], [104, 426, 74]], '#a9b6cf') +
      poly([[106, 426, 10], [156, 426, 10], [156, 426, 70], [106, 426, 70]], '#26304f') +
      // fios e componentes à mostra
      poly([[112, 426, 50], [124, 426, 50], [124, 426, 64], [112, 426, 64]], '#5fe39a') +
      poly([[130, 426, 50], [150, 426, 50], [150, 426, 64], [130, 426, 64]], '#8fb4ee') +
      poly([[112, 426, 20], [150, 426, 20], [150, 426, 30], [112, 426, 30]], '#f5c242');
    const raio = S(131, 426, 82);
    const placa = `<g transform="translate(${raio.x} ${raio.y - 4})"><path d="M0 -9 L9 7 H-9Z" fill="#ffd84d" stroke="#222" stroke-width="1"/><path d="M1 -4 l-3 5 h3 l-2 5" stroke="#222" stroke-width="1.3" fill="none"/></g>`;
    const terra = S(162, 410, 4);
    s += prob(4,
      aberta + faiscas(S(128, 426, 40).x, S(128, 426, 40).y),
      fechada + placa +
      `<g transform="translate(${terra.x + 4} ${terra.y})" stroke="#2ecc71" stroke-width="2"><path d="M0 0 v-8 M-6 0 h12 M-4 3 h8 M-2 6 h4"/></g>` +
      `<g transform="translate(${S(158, 426, 46).x} ${S(158, 426, 46).y})"><rect x="-3" y="-4" width="7" height="8" rx="1.5" fill="#e04848"/><path d="M-1.5 -4 v-3 a2 2 0 0 1 4 0 v3" stroke="#e04848" fill="none" stroke-width="1.4"/></g>`
    );
    // extintor + caixas na frente (problema 15, escondido)
    const ext = S(186, 446, 0);
    s += prob(15,
      extintor(ext.x, ext.y) + caixaIso(170, 462, 0, 26, 20) + caixaIso(196, 462, 0, 26, 20) + caixaIso(178, 466, 20, 26, 20) + caixaIso(184, 462, 40, 22, 16),
      poly([[166, 430, 0.2], [206, 430, 0.2], [206, 470, 0.2], [166, 470, 0.2]], '#f5c242') +
      poly([[172, 436, 0.4], [200, 436, 0.4], [200, 464, 0.4], [172, 464, 0.4]], '#e53935') +
      extintor(ext.x, ext.y) +
      `<g transform="translate(${ext.x + 2} ${ext.y - 62})"><rect x="-9" y="-9" width="18" height="18" rx="2" fill="#e53935"/><path d="M-3 5 v-8 h5 l1 -3" stroke="#fff" stroke-width="2" fill="none"/></g>` +
      // caixas levadas para o lado, organizadas
      caixaIso(230, 520, 0, 24, 18) + caixaIso(256, 520, 0, 24, 18)
    );
    return s;
  }

  // ---------- Esteira A + mesa de alimentação (problema 6) ----------
  function entrada() {
    let s = '';
    const A0 = L.A0;
    // perigo: mesa baixa, operador curvado
    const baixa = esteira({ ...A0, z0: 18 }) + caixaIso(64, 150, 18);
    const w1 = S(92, 222, 0);
    // seguro: mesa elevatória (pantográfica) na altura certa
    let tesoura = '';
    [[48, 200], [48, 132]].forEach(([x, y]) => {
      const a = S(x, y, 0), b = S(x + 96, y, 28), c = S(x + 96, y, 0), d = S(x, y, 28);
      tesoura += `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="#f5c242" stroke-width="3"/><line x1="${c.x}" y1="${c.y}" x2="${d.x}" y2="${d.y}" stroke="#f5c242" stroke-width="3"/>`;
    });
    const alta = tesoura + esteira({ ...A0, z0: 40, pernas: 999 }) + caixaIso(64, 150, 40);
    s += prob(6,
      baixa + pessoa(w1.x, w1.y, { pose: 'curvado', flip: true, camisa: '#3f8de0', escala: 1.25 }),
      alta + pessoa(w1.x, w1.y, { pose: 'operando', flip: true, camisa: '#3f8de0', escala: 1.25 })
    );
    s += esteira({ ...L.A, z1: 40 });
    s += caixaMovel([170, 165, 40], [395, 165, 40], 7, 0) + caixaMovel([170, 165, 40], [395, 165, 40], 7, -3.5);
    return s;
  }

  // ---------- Linha principal B ----------
  function linhaB() {
    let s = '';
    const B = L.B;

    // atrás da esteira: sensores do lado de trás (problema 3, seguro)
    const sensorTras = box(392, 226, 0, 6, 6, 48, COR.cinza) + box(390, 224, 44, 10, 10, 8, COR.escuro);
    s += prob(3, '', sensorTras);

    // a esteira
    s += esteira({ ...B, z1: B.z0 });
    // tambor de tração (cabeceira, fim da linha B) — problema 1
    s += rolo('x', 400, 812, 30, 70, 10);

    // caixas andando em B
    for (let i = 0; i < 4; i++) s += caixaMovel([435, 150, 36], [435, 800, 36], 14, -i * 3.5);

    // problema 3: caixa atravessada e travada
    const travada = `<g class="treme">${box(418, 220, 36, 34, 22, 18, COR.caixa, 'transform="rotate(0)"')}</g>` +
      `<g transform="translate(${S(452, 232, 60).x} ${S(452, 232, 60).y})" class="blink"><circle r="6" fill="#e04848"/><text y="3.5" text-anchor="middle" font-size="9" font-weight="700" fill="#fff">!</text></g>`;
    const livre = linhaMundo([396, 230, 46], [476, 230, 46], 'stroke="#ff4d4d" stroke-width="1.6" stroke-dasharray="4 3" class="feixe"') +
      box(474, 226, 0, 6, 6, 48, COR.cinza) + box(472, 224, 44, 10, 10, 8, COR.escuro) +
      `<circle cx="${S(477, 229, 56).x}" cy="${S(477, 229, 56).y}" r="2.6" fill="#2ecc71" class="blink"/>`;
    s += prob(3, travada, livre);

    // problema 13: robô e célula
    const rb = S(600, 300, 0), op13 = S(540, 345, 0);
    const zonaPerigo = poly([[510, 250, 0.3], [680, 250, 0.3], [680, 380, 0.3], [510, 380, 0.3]], 'rgba(224,72,72,.22)', 'stroke="#e04848" stroke-dasharray="6 4" stroke-width="1.5"');
    const zonaSegura = poly([[510, 250, 0.3], [680, 250, 0.3], [680, 380, 0.3], [510, 380, 0.3]], 'url(#zebrado)', 'opacity=".55"');
    let cortina = '';
    [[505, 250], [505, 380]].forEach(([x, y]) => { cortina += box(x - 4, y - 4, 0, 8, 8, 70, COR.amarelo); });
    for (let z = 10; z <= 64; z += 9) cortina += linhaMundo([505, 254, z], [505, 376, z], 'stroke="#ff4d4d" stroke-width="1.2" class="feixe"');
    let cerca = '';
    cerca += grade(680, 250, 0, 4, 130, 60) + grade(510, 246, 0, 170, 4, 60);
    s += prob(13,
      zonaPerigo + robo(rb.x, rb.y, { escala: 1.05 }) + pessoa(op13.x, op13.y, { pose: 'alcancando', camisa: '#9b6bd6', flip: true, escala: 1.25 }),
      zonaSegura + cerca + robo(rb.x, rb.y, { escala: 1.05 }) + cortina + pessoa(S(470 + 10, 420, 0).x + 60, S(470, 420, 0).y + 10, { pose: 'pe', camisa: '#9b6bd6', escala: 1.25 })
    );

    // problema 2: cabo de emergência na lateral
    let cabo = '';
    for (let y = 150; y <= 800; y += 130) cabo += box(476, y, 0, 4, 4, 54, COR.amarelo);
    cabo += linhaMundo([478, 150, 52], [478, 804, 52], 'stroke="#f5c242" stroke-width="2.2"');
    const eA = S(480, 140, 46), eB = S(480, 812, 46);
    const cogumelo = (p) => `<g transform="translate(${p.x} ${p.y})"><rect x="-6" y="-2" width="12" height="12" rx="2" fill="#f5c242"/><ellipse cx="0" cy="-3" rx="6" ry="3.5" fill="#e04848"/></g>`;
    cabo += cogumelo(eA) + cogumelo(eB);
    const semCabo = `<g transform="translate(${S(480, 385, 40).x} ${S(480, 385, 40).y})"><rect x="-12" y="-10" width="24" height="16" rx="3" fill="#26304f" stroke="#e04848" stroke-width="1.5" stroke-dasharray="3 2"/><text y="2" text-anchor="middle" font-size="8" fill="#ff8080" font-weight="700">?</text></g>`;
    s += prob(2, semCabo, cabo);

    // problema 12: travessia por cima da esteira
    const pulo = S(436, 470, 36);
    let passarela = '';
    // escada de um lado, plataforma por cima, escada do outro
    passarela += box(360, 455, 0, 34, 36, 70, COR.cinza) + box(394, 455, 62, 82, 36, 8, COR.cinza) + box(476, 455, 0, 34, 36, 70, COR.cinza);
    for (let k = 1; k < 5; k++) passarela += linhaMundo([476 + k * 7, 491, 70 - k * 14], [476 + k * 7, 455, 70 - k * 14], 'stroke="#74829f" stroke-width="1.5"');
    passarela += linhaMundo([394, 491, 92], [476, 491, 92], 'stroke="#f5c242" stroke-width="2.5"') +
      linhaMundo([394, 455, 92], [476, 455, 92], 'stroke="#f5c242" stroke-width="2.5"') +
      linhaMundo([394, 491, 70], [394, 491, 92], 'stroke="#f5c242" stroke-width="2"') +
      linhaMundo([476, 491, 70], [476, 491, 92], 'stroke="#f5c242" stroke-width="2"') +
      linhaMundo([476, 491, 92], [510, 491, 70], 'stroke="#f5c242" stroke-width="2.5"');
    const topo = S(440, 475, 70);
    s += prob(12,
      pessoa(pulo.x, pulo.y, { pose: 'pulando', camisa: '#e8a33a', escala: 1.25 }),
      passarela + pessoa(topo.x, topo.y, { pose: 'pe', camisa: '#e8a33a', escala: 1.2 })
    );

    // problema 5: manutenção sem LOTO (técnico ajoelhado no rolete + seccionadora local)
    const tec = S(500, 600, 0), sec = S(520, 560, 0);
    const poste = box(518, 556, 0, 6, 6, 40, COR.escuro) + box(512, 550, 36, 18, 10, 22, COR.cinza);
    const alavancaOn = `<g transform="translate(${sec.x + 4} ${sec.y - 48})"><rect x="-2" y="-12" width="4" height="12" fill="#2ecc71"/><text x="6" y="-3" font-size="7" fill="#5fe39a" font-weight="700">ON</text></g>`;
    const alavancaOff = `<g transform="translate(${sec.x + 4} ${sec.y - 48})"><rect x="-2" y="-2" width="12" height="4" fill="#e04848"/>` +
      `<rect x="6" y="1" width="8" height="8" rx="1.5" fill="#e04848"/><path d="M7.5 1 v-3 a2.5 2.5 0 0 1 5 0 v3" stroke="#e04848" fill="none" stroke-width="1.6"/>` +
      `<g class="balanca" style="transform-origin:10px 9px"><line x1="10" y1="9" x2="10" y2="14" stroke="#fff"/><rect x="5" y="14" width="11" height="13" rx="1" fill="#fff"/><rect x="5" y="14" width="11" height="4" fill="#e04848"/></g></g>`;
    const zero = `<g transform="translate(${tec.x + 30} ${tec.y - 60})"><rect x="-16" y="-10" width="32" height="16" rx="8" fill="#2ecc71"/><text y="2" text-anchor="middle" font-size="9" font-weight="700" fill="#0b3d20">0 V</text></g>`;
    s += prob(5,
      poste + alavancaOn + pessoa(tec.x, tec.y, { pose: 'ajoelhado', camisa: '#2f9e8f', flip: true, escala: 1.25 }) +
      `<g transform="translate(${tec.x - 22} ${tec.y - 22})" stroke="#cfd8ea" stroke-width="2.5" stroke-linecap="round"><path d="M0 0 l8 -8"/><circle cx="9" cy="-9" r="3" fill="none"/></g>`,
      poste + alavancaOff + zero + pessoa(tec.x, tec.y, { pose: 'ajoelhado', camisa: '#2f9e8f', flip: true, escala: 1.25 })
    );

    // problema 8: partida inesperada (operador limpando a correia)
    const op8 = S(505, 712, 0), bec = S(486, 660, 0);
    s += prob(8,
      pessoa(op8.x, op8.y, { pose: 'alcancando', camisa: '#d6589b', flip: true, escala: 1.25 }) +
      `<g transform="translate(${op8.x - 26} ${op8.y - 34})" class="blink"><path d="M0 0 h10 l-3 -4 M10 0 l-3 4" stroke="#ff6b6b" stroke-width="2" fill="none"/></g>`,
      sinaleiro(bec.x, bec.y, true) + pessoa(op8.x + 18, op8.y + 8, { pose: 'pe', camisa: '#d6589b', escala: 1.25 }) +
      `<g transform="translate(${op8.x + 34} ${op8.y - 58})"><rect x="-17" y="-8" width="34" height="13" rx="3" fill="#f5c242"/><text y="2" text-anchor="middle" font-size="7" font-weight="800" fill="#222">ALERTA</text></g>`
    );

    // problema 9: motor + redutor com transmissão (lateral da cabeceira)
    let motor = box(492, 772, 0, 30, 30, 22, COR.escuro) + box(495, 776, 22, 24, 22, 20, COR.orange); // redutor
    motor += box(522, 778, 4, 30, 18, 18, COR.cinza); // motor
    const pol1 = S(486, 790, 32), pol2 = S(486, 816, 20);
    const transm = `<g><circle cx="${pol1.x}" cy="${pol1.y}" r="7" fill="#cfd8ea" stroke="#5b6a8f" stroke-width="2"/><circle cx="${pol2.x}" cy="${pol2.y}" r="10" fill="#cfd8ea" stroke="#5b6a8f" stroke-width="2"/>` +
      `<path class="correia-anda" d="M${pol1.x - 7} ${pol1.y} L${pol2.x - 10} ${pol2.y} M${pol1.x + 7} ${pol1.y} L${pol2.x + 10} ${pol2.y}" stroke="#222" stroke-width="2.5" stroke-dasharray="4 3"/>` +
      `<circle class="spin" style="transform-origin:${pol1.x}px ${pol1.y}px" cx="${pol1.x}" cy="${pol1.y - 5}" r="1.6" fill="#24326a"/><circle class="spin" style="transform-origin:${pol2.x}px ${pol2.y}px" cx="${pol2.x}" cy="${pol2.y - 8}" r="2" fill="#24326a"/></g>`;
    s += motor;
    s += prob(9, transm, transm + grade(478, 782, 6, 14, 42, 36));

    // problema 1: proteção do tambor de tração
    const nip = S(470, 806, 30);
    s += prob(1,
      `<g transform="translate(${nip.x} ${nip.y})" class="blink"><path d="M-8 -3 l8 6 l8 -6" stroke="#ff4d4d" stroke-width="2.5" fill="none"/></g>`,
      grade(396, 790, 8, 80, 36, 40) +
      `<g transform="translate(${S(476, 800, 50).x} ${S(476, 800, 50).y})"><rect x="-4" y="-6" width="8" height="10" rx="1.5" fill="#2ecc71"/><circle cy="-1" r="1.6" fill="#0b3d20"/></g>`
    );

    return s;
  }

  // ---------- Esteira inclinada C + paletização ----------
  function inclinada() {
    let s = '';
    const C = L.C;
    s += esteira(C);
    // problema 11: taliscas + backstop no seguro; caixa escorregando no perigo
    const taliscas = (() => {
      let t = '';
      for (let x = 430; x < 770; x += 40) {
        const z = C.z0 + ((C.z1 - C.z0) * (x - C.a0)) / (C.a1 - C.a0);
        t += linhaMundo([x, 822, z + 1], [x, 888, z + 1], 'stroke="#2c3c78" stroke-width="2.5"');
      }
      return t;
    })();
    const zAt = (x) => C.z0 + ((C.z1 - C.z0) * (x - C.a0)) / (C.a1 - C.a0);
    const desce = (() => {
      const de = [560, 855, zAt(560)], para = [470, 855, zAt(470)];
      const a = P(...de), b = P(...para);
      return `<g class="escorrega" style="--dx:${r1(b[0] - a[0])}px;--dy:${r1(b[1] - a[1])}px">${caixaIso(548, 843, zAt(560))}</g>`;
    })();
    const back = S(770, 900, 66);
    s += prob(11,
      desce + `<g transform="translate(${S(510, 855, 46).x} ${S(510, 855, 46).y})" class="blink"><path d="M0 0 l-12 6 m0 0 l4 -6 m-4 6 l7 2" stroke="#ff6b6b" stroke-width="2.2" fill="none"/></g>`,
      taliscas + `<g transform="translate(${back.x} ${back.y})"><circle r="9" fill="#5b6a8f" stroke="#2ecc71" stroke-width="2.5"/><path d="M-4 0 a4 4 0 1 1 4 4" stroke="#fff" stroke-width="1.8" fill="none"/><path d="M-4 0 l-2 -3 m2 3 l3 -2" stroke="#fff" stroke-width="1.5"/></g>`
    );
    // caixas subindo
    for (let i = 0; i < 3; i++) s += caixaMovel([420, 855, zAt(420)], [760, 855, zAt(760)], 10, -i * 3.3);

    // problema 10: queda de material x guias laterais
    const queda = (() => {
      const p = S(668, 892, zAt(668));
      return `<g class="cai" style="transform-origin:${p.x}px ${p.y}px"><g transform="translate(${p.x - 14} ${p.y - 18}) rotate(18)"><rect width="22" height="16" fill="#dda15c"/><rect width="22" height="5" fill="#f6cf98"/></g></g>` +
        `<g transform="translate(${S(668, 960, 0).x} ${S(668, 960, 0).y})"><ellipse rx="16" ry="5" fill="#000" opacity=".25"/></g>`;
    })();
    const guias = linhaMundo([420, 820, zAt(420) + 10], [770, 820, zAt(770) + 10], 'stroke="#f5c242" stroke-width="3"') +
      linhaMundo([420, 890, zAt(420) + 10], [770, 890, zAt(770) + 10], 'stroke="#f5c242" stroke-width="3"');
    s += prob(10, queda, guias);

    // plataforma de paletização
    s += box(770, 790, 0, 150, 150, 46, COR.escuro);
    s += poly([[770, 790, 46.2], [920, 790, 46.2], [920, 940, 46.2], [770, 940, 46.2]], '#4a5a85');
    // guarda-corpo da plataforma
    s += linhaMundo([920, 790, 46], [920, 940, 46], 'stroke="#f5c242" stroke-width="2"') + linhaMundo([920, 790, 76], [920, 940, 76], 'stroke="#f5c242" stroke-width="2"');
    // palete com caixas
    s += box(840, 840, 46, 60, 60, 6, COR.palete);
    s += caixaIso(844, 844, 52) + caixaIso(870, 844, 52) + caixaIso(844, 870, 52);

    // problema 14: ruído (motor do topo da inclinada)
    const mot = S(770, 910, 46);
    const motorC = box(750, 900, 46, 26, 22, 18, COR.cinza);
    s += prob(14,
      motorC + ondasSom(mot.x + 8, mot.y - 34) + pessoa(S(800, 925, 46).x, S(800, 925, 46).y, { pose: 'ouvidos', camisa: '#4caf50', escala: 1.2 }),
      grade(744, 894, 46, 40, 36, 30) + box(744, 894, 46, 40, 36, 30, { top: 'rgba(143,180,238,.55)', left: 'rgba(74,115,191,.6)', right: 'rgba(58,95,166,.6)' }) +
      `<g transform="translate(${mot.x - 30} ${mot.y - 60})"><rect x="-17" y="-9" width="34" height="15" rx="4" fill="#2ecc71"/><text y="2" text-anchor="middle" font-size="8" font-weight="800" fill="#0b3d20">78 dB</text></g>` +
      pessoa(S(800, 925, 46).x, S(800, 925, 46).y, { pose: 'pe', camisa: '#4caf50', escala: 1.2, protetor: true })
    );

    // problema 7: levantamento manual x robô paletizador
    const op7 = S(815, 875, 46);
    s += prob(7,
      pessoa(op7.x, op7.y, { pose: 'levantando', camisa: '#ef6c57', escala: 1.25 }) +
      `<g transform="translate(${op7.x + 18} ${op7.y - 26})"><rect x="-8" y="-6" width="16" height="12" fill="#dda15c"/></g>` +
      `<g transform="translate(${op7.x - 4} ${op7.y - 18})" class="blink"><path d="M0 -6 q-6 4 0 10" stroke="#ff6b6b" stroke-width="2" fill="none"/></g>`,
      robo(S(880, 820, 46).x, S(880, 820, 46).y, { escala: 0.85 }) +
      pessoa(S(905, 905, 46).x, S(905, 905, 46).y, { pose: 'operando', camisa: '#ef6c57', escala: 1.2, flip: true })
    );
    return s;
  }

  function defs() {
    return `<defs>
      <pattern id="malha" width="6" height="6" patternUnits="userSpaceOnUse"><path d="M0 6 L6 0 M-1 1 L1 -1 M5 7 L7 5" stroke="#ffd84d" stroke-width="1"/></pattern>
      <pattern id="zebrado" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="12" height="12" fill="#222"/><rect width="6" height="12" fill="#f5c242"/></pattern>
      <pattern id="hex" width="56" height="97" patternUnits="userSpaceOnUse"><path d="M28 0 L56 16 L56 48 L28 64 L0 48 L0 16 Z M28 64 L28 97" fill="none" stroke="#ffffff" stroke-opacity=".045" stroke-width="1.2"/></pattern>
    </defs>`;
  }

  function montar() {
    return `<svg class="cena" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="cena-titulo">
      <title id="cena-titulo">Infográfico isométrico de uma esteira automatizada com os pontos de risco marcados</title>
      ${defs()}
      <rect width="${W}" height="${H}" fill="url(#hex)"/>
      ${fundo()}
      ${painel()}
      ${entrada()}
      ${linhaB()}
      ${inclinada()}
    </svg>`;
  }

  function telaParaPercentual(id) {
    const a = ANCORAS[id];
    const p = P(...a);
    return { left: (p[0] / W) * 100, top: (p[1] / H) * 100 };
  }

  window.CENA = { montar, ANCORAS, telaParaPercentual, W, H };
})();
