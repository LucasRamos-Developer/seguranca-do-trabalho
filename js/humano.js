/*
 * Figura humana articulada (SVG), usada no cenário (iso.js) e nas mini-cenas do modal (animations.js).
 *
 * A pessoa é um esqueleto 2D visto de lado, de frente para a direita, com os pés em (0, 0) e ~64 unidades de altura.
 * Pontos do esqueleto: q (quadril), o (ombros), c (centro da cabeça), pF/pT (pés da frente/de trás),
 * mF/mT (mãos), e opcionalmente jF/jT (joelhos) e cF/cT (cotovelos). Joelhos e cotovelos que não forem
 * informados são calculados por cinemática inversa de dois segmentos.
 *
 * Cada parte do corpo é desenhada como <path> com a mesma sequência de comandos em qualquer pose. Por isso uma
 * animação pode trocar de pose interpolando o atributo "d" com SMIL (<animate attributeName="d">).
 */
(function () {
  const COXA = 14, CANELA = 14, BRACO = 11.5, ANTEBRACO = 11;
  const PELE = '#f2c6a0', CABELO = '#3b2a20', BOTA = '#2b2320';

  // ---------- poses (de frente para a direita) ----------
  // dJ/dC: lado da dobra de joelhos e cotovelos (-1 ou 1), [frente, trás]
  const POSES = {
    pe: { q: [0, -27], o: [0, -47], c: [1, -57], pF: [3, -1], pT: [-3, -1], mF: [3, -25.5], mT: [-2, -25.5] },
    anda1: { q: [0, -26.5], o: [2, -46.5], c: [3.5, -56.5], pF: [10, -1], pT: [-9, -1.5], mF: [-6, -27], mT: [8, -28] },
    anda2: { q: [0, -27.5], o: [2, -47.5], c: [3.5, -57.5], pF: [1, -1], pT: [-3, -7], mF: [1, -25.5], mT: [1, -25.5] },
    anda3: { q: [0, -26.5], o: [2, -46.5], c: [3.5, -56.5], pF: [-9, -1.5], pT: [10, -1], mF: [8, -28], mT: [-6, -27] },
    anda4: { q: [0, -27.5], o: [2, -47.5], c: [3.5, -57.5], pF: [-3, -7], pT: [1, -1], mF: [1, -25.5], mT: [1, -25.5] },
    corre: { q: [0, -26], o: [4, -45.5], c: [6.5, -55.5], pF: [12, -4], pT: [-11, -7], mF: [13, -37], mT: [-10, -33], dC: [1, 1] },
    curvado: { q: [-2, -27], o: [14, -40], c: [21.5, -46], pF: [2, -1], pT: [-4, -1], mF: [24, -25], mT: [20, -26] },
    operando: { q: [0, -27], o: [1, -47], c: [2.5, -57], pF: [3, -1], pT: [-3, -1], mF: [17, -33], mT: [14, -31], dC: [1, 1] },
    alcanca: { q: [0, -27], o: [3, -47], c: [5, -57], pF: [5, -1], pT: [-4, -1], mF: [24, -40], mT: [20, -35], dC: [1, 1] },
    ouvidos: { q: [0, -27], o: [0, -47], c: [1, -56.5], pF: [3, -1], pT: [-3, -1], mF: [2, -57], mT: [-1, -57], dC: [-1, 1] },
    levanta: { q: [-3, -25], o: [12, -38], c: [19, -43], pF: [3, -1], pT: [-5, -1], mF: [21, -14], mT: [18, -15] },
    segura: { q: [0, -27], o: [-1, -47], c: [0, -57], pF: [3, -1], pT: [-3, -1], mF: [11, -35], mT: [9, -35], dC: [1, 1] },
    agacha: { q: [-4, -15], o: [2, -35], c: [5, -45], pF: [6, -1], pT: [-5, -1], mF: [14, -13], mT: [12, -14] },
    ajoelhado: { q: [0, -16], o: [4, -36], c: [6, -46], pF: [10, -1], jF: [10, -15], pT: [-14, -1.5], jT: [-2, -3], mF: [19, -30], mT: [16, -27], dC: [1, 1] },
    pulando: { q: [0, -31], o: [3, -51], c: [5, -61], pF: [13, -21], pT: [-4, -4], mF: [15, -52], mT: [-12, -43], dJ: [1, -1], dC: [1, -1] },
    puxado: { q: [3, -27], o: [11, -44], c: [13, -54], pF: [9, -1], pT: [-6, -2], mF: [32, -36], mT: [-3, -48], dC: [1, -1] },
    choque: { q: [-2, -27], o: [-4, -47], c: [-6, -56.5], pF: [4, -1], pT: [-5, -1], mF: [12, -60], mT: [-15, -56], dC: [1, -1] },
    escorrega: { q: [0, -23], o: [-7, -42], c: [-10, -51], pF: [14, -10], pT: [4, -1], mF: [8, -56], mT: [-17, -50], dC: [1, -1] }
  };

  // ---------- geometria ----------
  const r1 = (n) => Math.round(n * 10) / 10;
  const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
  const mul = (a, k) => [a[0] * k, a[1] * k];
  const lerp = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
  const p = (a) => `${r1(a[0])} ${r1(a[1])}`;

  // junta do meio de um membro de dois segmentos (cinemática inversa)
  function junta(a, alvo, l1, l2, lado) {
    const dx = alvo[0] - a[0], dy = alvo[1] - a[1];
    const d = Math.min(Math.max(Math.hypot(dx, dy), Math.abs(l1 - l2) + 0.01), l1 + l2 - 0.01);
    const th = Math.atan2(dy, dx);
    const al = Math.acos((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d));
    const ang = th + lado * al;
    return [a[0] + l1 * Math.cos(ang), a[1] + l1 * Math.sin(ang)];
  }

  // segmento arredondado e afinado de a (raio ra) até b (raio rb)
  function capsula(a, b, ra, rb) {
    let dx = b[0] - a[0], dy = b[1] - a[1];
    const L = Math.hypot(dx, dy) || 0.001;
    dx /= L; dy /= L;
    const n = [-dy, dx];
    return `M${p(add(a, mul(n, ra)))} L${p(add(b, mul(n, rb)))} A${r1(rb)} ${r1(rb)} 0 0 0 ${p(add(b, mul(n, -rb)))} ` +
      `L${p(add(a, mul(n, -ra)))} A${r1(ra)} ${r1(ra)} 0 0 0 ${p(add(a, mul(n, ra)))}Z`;
  }
  const circulo = (c, r) => `M${p([c[0] - r, c[1]])} A${r} ${r} 0 1 0 ${p([c[0] + r, c[1]])} A${r} ${r} 0 1 0 ${p([c[0] - r, c[1]])}Z`;
  const quad = (a, b, c, d) => `M${p(a)} L${p(b)} L${p(c)} L${p(d)}Z`;

  function escurece(hex, k = 0.78) {
    const n = parseInt(hex.slice(1), 16);
    const f = (v) => Math.round(v * k).toString(16).padStart(2, '0');
    return `#${f(n >> 16)}${f((n >> 8) & 255)}${f(n & 255)}`;
  }

  // completa joelhos e cotovelos que faltam
  function resolver(pose) {
    const s = typeof pose === 'string' ? POSES[pose] || POSES.pe : pose;
    const [dJF, dJT] = s.dJ || [-1, -1];
    const [dCF, dCT] = s.dC || [1, 1];
    return {
      ...s,
      jF: s.jF || junta(s.q, s.pF, COXA, CANELA, dJF),
      jT: s.jT || junta(s.q, s.pT, COXA, CANELA, dJT),
      cF: s.cF || junta(s.o, s.mF, BRACO, ANTEBRACO, dCF),
      cT: s.cT || junta(s.o, s.mT, BRACO, ANTEBRACO, dCT)
    };
  }

  // lista de partes: [cor, d]. A ordem e a quantidade são sempre as mesmas.
  function partes(pose, o) {
    const s = resolver(pose);
    const camisa = o.camisa, camisaT = escurece(camisa), calca = o.calca, calcaT = escurece(calca);
    const peleT = escurece(PELE, 0.88);

    // eixo do tronco e inclinação da cabeça
    let tx = s.o[0] - s.q[0], ty = s.o[1] - s.q[1];
    const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl;
    const nt = [-ty, tx];
    const incl = Math.atan2(s.c[0] - s.o[0], -(s.c[1] - s.o[1]));
    const gira = (v) => {
      const cs = Math.cos(incl), sn = Math.sin(incl);
      return add(s.c, [v[0] * cs - v[1] * sn, v[0] * sn + v[1] * cs]);
    };
    const faixa = (k1, k2, w) => {
      const a = lerp(s.q, s.o, k1), b = lerp(s.q, s.o, k2);
      return quad(add(a, mul(nt, w)), add(b, mul(nt, w)), add(b, mul(nt, -w)), add(a, mul(nt, -w)));
    };
    const pe = (pt, cor) => capsula(add(pt, [-2, -2.2]), add(pt, [4.5, -1.6]), 2.6, 2.1);

    const omb = lerp(s.o, s.q, 0.1); // articulação do ombro, um pouco abaixo do topo do tronco
    const L = [];
    // braço de trás
    L.push([camisaT, capsula(omb, s.cT, 3.6, 3)], [camisaT, capsula(s.cT, s.mT, 3, 2.5)], [peleT, circulo(s.mT, 2.7)]);
    // perna de trás
    L.push([calcaT, capsula(s.q, s.jT, 4.6, 3.8)], [calcaT, capsula(s.jT, s.pT, 3.8, 3)], [BOTA, pe(s.pT)]);
    // perna da frente
    L.push([calca, capsula(s.q, s.jF, 4.6, 3.8)], [calca, capsula(s.jF, s.pF, 3.8, 3)], [BOTA, pe(s.pF)]);
    // pescoço, tronco, faixa refletiva e cinto
    L.push([peleT, capsula(lerp(s.o, s.c, 0.1), lerp(s.o, s.c, 0.55), 2.7, 2.7)]);
    L.push([camisa, capsula(lerp(s.q, s.o, 0.1), s.o, 5.6, 7)]);
    L.push(['#eef3fb', faixa(0.52, 0.63, 6.5)]);
    L.push([o.calca === '#2a3560' ? '#1a2142' : escurece(calca, 0.6), faixa(0.08, 0.17, 5.9)]);
    // cabeça
    L.push([PELE, circulo(s.c, 6.6)]);
    L.push([peleT, circulo(gira([-1.2, 1.4]), 1.7)]);                                      // orelha
    L.push([CABELO, `M${p(gira([-6.6, -0.5]))} Q${p(gira([-7, 4.5]))} ${p(gira([-3.4, 5.6]))} L${p(gira([-3, 0]))}Z`]);
    L.push(['#2a2230', circulo(gira([3.6, 0.6]), 0.95)]);                                  // olho
    L.push([peleT, `M${p(gira([6.2, 0.4]))} L${p(gira([8, 2.6]))} L${p(gira([6, 3.4]))}Z`]); // nariz
    // capacete com aba para a frente
    L.push([o.capacete, `M${p(gira([-7.6, -0.6]))} A7.6 7.4 0 0 1 ${p(gira([7.4, -0.8]))} L${p(gira([10.6, -0.3]))} ` +
      `L${p(gira([10.6, 1.1]))} L${p(gira([-7.8, 1.1]))}Z`]);
    L.push(['#ffffff', `M${p(gira([-3.5, -5.6]))} A6 6 0 0 1 ${p(gira([2.5, -6.4]))} L${p(gira([2.4, -5.2]))} A5 5 0 0 0 ${p(gira([-3, -4.4]))}Z`]);
    if (o.protetor) {
      L.push(['#e04848', `M${p(gira([-4.4, -1]))} L${p(gira([-1.6, -8.6]))} L${p(gira([0.2, -8.2]))} L${p(gira([-2.6, -0.6]))}Z`]);
      L.push(['#e04848', circulo(gira([-1.4, 1.6]), 3.2)]);
    }
    // braço da frente
    L.push([camisa, capsula(omb, s.cF, 3.8, 3.2)], [camisa, capsula(s.cF, s.mF, 3.2, 2.6)], [PELE, circulo(s.mF, 2.9)]);
    return L;
  }

  /*
   * figura(pose, opções) → SVG da pessoa com os pés em (0, 0).
   * pose: nome de POSES, objeto de pose, ou lista de quadros [[pose, t], ...] com t de 0 a 1 (animação em loop).
   * opções: camisa, calca, capacete, protetor, dur (padrão '4s'), sombra (padrão true)
   */
  function figura(pose, opc = {}) {
    const o = { camisa: '#3f8de0', calca: '#2a3560', capacete: '#ffcc33', protetor: false, dur: '4s', sombra: true, ...opc };
    const sombra = o.sombra ? `<ellipse cx="0" cy="0.5" rx="12" ry="3.2" fill="#000" opacity=".28"/>` : '';
    if (!Array.isArray(pose)) {
      return sombra + partes(pose, o).map(([cor, d]) => `<path fill="${cor}" d="${d}"/>`).join('');
    }
    const quadros = pose.map(([ps]) => partes(ps, o));
    const tempos = pose.map(([, t]) => t).join(';');
    const curvas = pose.slice(1).map(() => '.42 0 .58 1').join(';');
    return sombra + quadros[0].map(([cor, d], i) => {
      const valores = quadros.map((q) => q[i][1]);
      if (valores.every((v) => v === d)) return `<path fill="${cor}" d="${d}"/>`;
      return `<path fill="${cor}" d="${d}"><animate attributeName="d" values="${valores.join(';')}" keyTimes="${tempos}" ` +
        `calcMode="spline" keySplines="${curvas}" dur="${o.dur}" repeatCount="indefinite"/></path>`;
    }).join('');
  }

  // mistura duas poses (k = 0 → a, k = 1 → b); útil para poses intermediárias
  function mistura(a, b, k) {
    const A = resolver(a), B = resolver(b), r = {};
    for (const n of ['q', 'o', 'c', 'pF', 'pT', 'mF', 'mT', 'jF', 'jT', 'cF', 'cT']) r[n] = lerp(A[n], B[n], k);
    return r;
  }

  // copia uma pose trocando alguns pontos (ex.: com('alcanca', { mF: [30, -36] }))
  const com = (nome, mudancas) => ({ ...(typeof nome === 'string' ? POSES[nome] : nome), ...mudancas });

  // ciclo de caminhada em n passos, para usar com um deslocamento (mover) por fora
  function caminhada(passos = 2, t0 = 0, t1 = 1) {
    const seq = ['anda1', 'anda2', 'anda3', 'anda4'];
    const n = passos * 2, q = [];
    for (let i = 0; i <= n; i++) q.push([seq[i % 4], t0 + (t1 - t0) * (i / n)]);
    return q;
  }

  window.HUMANO = { figura, POSES, mistura, com, caminhada };
})();
