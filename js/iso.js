/*
 * Primitivas isométricas em SVG (strings).
 * Mundo: x cresce para baixo-direita, y para baixo-esquerda, z para cima.
 * Faces visíveis de um bloco: topo, face y+d ("esquerda") e face x+w ("direita").
 */
(function () {
  const ISO = { ox: 495, oy: 60, c: 0.866, s: 0.5, W: 1440, H: 810 };

  function P(x, y, z = 0) {
    return [ISO.ox + (x - y) * ISO.c, ISO.oy + (x + y) * ISO.s - z];
  }
  const r1 = (n) => Math.round(n * 10) / 10;
  const pt = (p) => { const s = P(p[0], p[1], p[2] || 0); return r1(s[0]) + ',' + r1(s[1]); };
  const poly = (pts, fill, extra = '') => `<polygon points="${pts.map(pt).join(' ')}" fill="${fill}" ${extra}/>`;

  const COR = {
    belt:   { top: '#8fb4ee', left: '#4a73bf', right: '#3a5fa6' },
    frame:  { top: '#3b4f96', left: '#2c3c78', right: '#24326a' },
    orange: { top: '#ff8a5c', left: '#f26b3a', right: '#d4552a' },
    caixa:  { top: '#f6cf98', left: '#dda15c', right: '#c58645' },
    branco: { top: '#ffffff', left: '#d9e2f2', right: '#bccbe6' },
    cinza:  { top: '#c8d3e6', left: '#8d9bb8', right: '#74829f' },
    escuro: { top: '#5b6a8f', left: '#3f4b6b', right: '#343f5c' },
    amarelo:{ top: '#ffd84d', left: '#f5c242', right: '#d9a92f' },
    verde:  { top: '#5fe39a', left: '#2ecc71', right: '#25a85c' },
    vermelho:{ top: '#ff6b6b', left: '#e04848', right: '#bf3636' },
    palete: { top: '#c9a06a', left: '#a57d4b', right: '#8d6a3e' }
  };

  function box(x, y, z, w, d, h, c, extra = '') {
    return `<g ${extra}>` +
      poly([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]], c.left) +
      poly([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]], c.right) +
      poly([[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]], c.top) +
      '</g>';
  }

  // Círculo num plano vertical. plano 'xz' (normal y) ou 'yz' (normal x).
  function circ(plano, cx, cy, cz, r, n = 18) {
    const pts = [];
    for (let i = 0; i < n; i++) {
      const t = (i / n) * Math.PI * 2;
      if (plano === 'xz') pts.push([cx + r * Math.cos(t), cy, cz + r * Math.sin(t)]);
      else pts.push([cx, cy + r * Math.cos(t), cz + r * Math.sin(t)]);
    }
    return pts;
  }

  // Cilindro deitado (rolo/tambor). eixo 'y' (atravessa a esteira que anda em x) ou 'x'.
  function rolo(eixo, x, y, z, comp, r, cor = '#cfd8ea', tampa = '#7f8db0') {
    let s = '';
    if (eixo === 'y') {
      const a = circ('xz', x, y, z, r), b = circ('xz', x, y + comp, z, r);
      s += poly([[x, y, z + r], [x, y + comp, z + r], [x, y + comp, z - r], [x, y, z - r]], cor);
      s += poly([[x - r, y, z], [x - r, y + comp, z], [x + r, y + comp, z], [x + r, y, z]], cor);
      s += `<polygon points="${b.map(pt).join(' ')}" fill="${tampa}"/>`;
      s += `<polygon class="spin-dash" points="${b.map(pt).join(' ')}" fill="none" stroke="#fff" stroke-width="1.4" stroke-dasharray="3 5" opacity=".8"/>`;
    } else {
      const b = circ('yz', x + comp, y, z, r);
      s += poly([[x, y - r, z], [x + comp, y - r, z], [x + comp, y + r, z], [x, y + r, z]], cor);
      s += poly([[x, y, z + r], [x + comp, y, z + r], [x + comp, y, z - r], [x, y, z - r]], cor);
      s += `<polygon points="${b.map(pt).join(' ')}" fill="${tampa}"/>`;
      s += `<polygon class="spin-dash" points="${b.map(pt).join(' ')}" fill="none" stroke="#fff" stroke-width="1.4" stroke-dasharray="3 5" opacity=".8"/>`;
    }
    return `<g>${s}</g>`;
  }

  /*
   * Esteira. eixo 'x' ou 'y'; u = posição ao longo do eixo (a0..a1), v = largura (c..c+w).
   * z0/z1 = altura do topo da correia no início/fim (permite inclinar).
   */
  function esteira(o) {
    const { eixo, a0, a1, c, w, z0, z1 = z0, esp = 12, pernas = 130, rev = false } = o;
    const M = (u, v, z) => (eixo === 'x' ? [u, v, z] : [v, u, z]);
    const zAt = (u) => z0 + ((z1 - z0) * (u - a0)) / (a1 - a0);
    let s = '';
    // pernas
    for (let u = a0 + 20; u <= a1 - 10; u += pernas) {
      const [px, py] = eixo === 'x' ? [u, c + w - 10] : [c + w - 10, u];
      const [qx, qy] = eixo === 'x' ? [u, c + 2] : [c + 2, u];
      s += box(qx, qy, 0, 7, 7, zAt(u) - esp, COR.frame);
      s += box(px, py, 0, 7, 7, zAt(u) - esp, COR.frame);
    }
    // lateral visível
    const lado = eixo === 'x' ? COR.frame.left : COR.frame.right;
    s += poly([M(a0, c + w, z0 - esp), M(a1, c + w, z1 - esp), M(a1, c + w, z1), M(a0, c + w, z0)], lado);
    // ponta visível
    const ponta = eixo === 'x' ? COR.frame.right : COR.frame.left;
    s += poly([M(a1, c, z1 - esp), M(a1, c + w, z1 - esp), M(a1, c + w, z1), M(a1, c, z1)], ponta);
    // topo (correia)
    s += poly([M(a0, c, z0), M(a1, c, z1), M(a1, c + w, z1), M(a0, c + w, z0)], COR.belt.top);
    // listras animadas da correia
    const n = 3;
    for (let k = 1; k <= n; k++) {
      const v = c + (w * k) / (n + 1);
      const A = rev ? M(a1, v, z1 + 0.4) : M(a0, v, z0 + 0.4);
      const B = rev ? M(a0, v, z0 + 0.4) : M(a1, v, z1 + 0.4);
      const pa = P(...A), pb = P(...B);
      s += `<line class="belt-dash" x1="${r1(pa[0])}" y1="${r1(pa[1])}" x2="${r1(pb[0])}" y2="${r1(pb[1])}" stroke="#ffffff" stroke-opacity=".45" stroke-width="2" stroke-dasharray="10 14"/>`;
    }
    // bordas
    s += `<polyline points="${[M(a0, c + w, z0), M(a1, c + w, z1), M(a1, c, z1)].map(pt).join(' ')}" fill="none" stroke="#c3d6f7" stroke-width="1.2"/>`;
    return `<g class="esteira">${s}</g>`;
  }

  // Ponto de tela de uma posição do mundo (para sprites 2D)
  function S(x, y, z = 0) { const p = P(x, y, z); return { x: r1(p[0]), y: r1(p[1]) }; }

  /*
   * Pessoa com os pés em (sx, sy), desenhada por HUMANO (js/humano.js).
   * pose: nome de HUMANO.POSES ou lista de quadros [[pose, t], ...] para animar em loop.
   */
  const NOME_POSE = { alcancando: 'alcanca', levantando: 'levanta' };
  function pessoa(sx, sy, o = {}) {
    const { camisa = '#3f8de0', calca = '#2a3560', capacete = '#ffcc33', pose = 'pe', flip = false, escala = 1, extra = '', protetor = false, dur = '4s' } = o;
    const k = escala * 0.68;
    const ps = Array.isArray(pose) ? pose : NOME_POSE[pose] || pose;
    const t = `translate(${sx} ${sy}) scale(${flip ? -k : k} ${k})`;
    return `<g transform="${t}" ${extra}>${window.HUMANO.figura(ps, { camisa, calca, capacete, protetor, dur })}</g>`;
  }

  // Braço robótico (sprite 2D) com base em (sx, sy)
  function robo(sx, sy, o = {}) {
    const { escala = 1, anima = true } = o;
    const cls = anima ? 'robo-junta' : '';
    return `<g transform="translate(${sx} ${sy}) scale(${escala})">
      <ellipse cx="0" cy="0" rx="20" ry="9" fill="#d4552a"/>
      <rect x="-20" y="-12" width="40" height="12" fill="#f26b3a"/>
      <ellipse cx="0" cy="-12" rx="20" ry="9" fill="#ff8a5c"/>
      <rect x="-8" y="-36" width="16" height="26" rx="4" fill="#f26b3a"/>
      <g class="${cls}" style="transform-origin:0px -36px">
        <rect x="-6" y="-92" width="13" height="58" rx="6" fill="#ff8a5c" transform="rotate(28 0 -36)"/>
        <g transform="rotate(28 0 -36) translate(0 -86)">
          <g class="${anima ? 'robo-junta2' : ''}" style="transform-origin:0px 0px">
            <rect x="-5" y="-4" width="56" height="11" rx="5" fill="#f26b3a" transform="rotate(62)"/>
            <g transform="rotate(62) translate(52 1)">
              <circle r="6" fill="#d4552a"/>
              <rect x="4" y="-7" width="10" height="4" fill="#cfd8ea"/><rect x="4" y="3" width="10" height="4" fill="#cfd8ea"/>
            </g>
          </g>
          <circle r="7" fill="#d4552a"/>
        </g>
      </g>
      <circle cx="0" cy="-36" r="8" fill="#d4552a"/>
    </g>`;
  }

  // Coluna sinaleira (luz verde/amarela/vermelha) em (sx, sy)
  function sinaleiro(sx, sy, ativo = true) {
    return `<g transform="translate(${sx} ${sy})">
      <rect x="-1.5" y="-46" width="3" height="46" fill="#8d9bb8"/>
      <rect x="-5" y="-70" width="10" height="8" rx="2" fill="#2ecc71"/>
      <rect x="-5" y="-62" width="10" height="8" rx="2" fill="#f5c242" class="${ativo ? 'blink' : ''}"/>
      <rect x="-5" y="-54" width="10" height="8" rx="2" fill="#e04848"/>
      <path d="M-8 -78 h16 l-3 -6 h-10z" fill="#cfd8ea"/>
      ${ativo ? '<g class="ondas" fill="none" stroke="#f5c242" stroke-width="2" stroke-linecap="round"><path d="M10 -76 q6 6 0 12"/><path d="M15 -80 q10 10 0 20"/><path d="M-10 -76 q-6 6 0 12"/><path d="M-15 -80 q-10 10 0 20"/></g>' : ''}
    </g>`;
  }

  // Extintor (sprite 2D) em (sx, sy)
  function extintor(sx, sy) {
    return `<g transform="translate(${sx} ${sy})">
      <ellipse cx="0" cy="0" rx="7" ry="3" fill="#000" opacity=".3"/>
      <rect x="-6" y="-28" width="12" height="28" rx="5" fill="#e53935"/>
      <rect x="-6" y="-20" width="12" height="7" fill="#fff" opacity=".85"/>
      <rect x="-2.5" y="-33" width="5" height="6" fill="#333"/>
      <path d="M2 -31 q10 2 8 14" fill="none" stroke="#222" stroke-width="2"/>
      <rect x="-5" y="-37" width="11" height="3" rx="1" fill="#555"/>
    </g>`;
  }

  // Ondas sonoras animadas
  function ondasSom(sx, sy, cor = '#ff6b6b') {
    return `<g transform="translate(${sx} ${sy})" fill="none" stroke="${cor}" stroke-width="2.5" stroke-linecap="round">
      <path class="onda o1" d="M0 -10 q8 10 0 20"/><path class="onda o2" d="M8 -18 q14 18 0 36"/><path class="onda o3" d="M16 -26 q20 26 0 52"/>
    </g>`;
  }

  // Faíscas
  function faiscas(sx, sy) {
    return `<g transform="translate(${sx} ${sy})" stroke="#ffe066" stroke-width="2" stroke-linecap="round" class="faisca">
      <path d="M0 0 l8 -8 M0 0 l-7 -9 M0 0 l10 3 M0 0 l-9 4 M0 0 l2 -12"/>
      <circle r="3" fill="#fff6bf" stroke="none"/>
    </g>`;
  }

  // Engrenagem decorativa
  function engrenagem(cx, cy, r, cor = '#ffffff', op = 0.06, cls = 'gira') {
    let d = '';
    const dentes = 10;
    for (let i = 0; i < dentes; i++) {
      const a = (i / dentes) * Math.PI * 2;
      const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
      d += `<rect x="${r1(x - r * 0.12)}" y="${r1(y - r * 0.12)}" width="${r1(r * 0.24)}" height="${r1(r * 0.24)}" transform="rotate(${r1((a * 180) / Math.PI)} ${r1(x)} ${r1(y)})"/>`;
    }
    return `<g class="${cls}" style="transform-origin:${cx}px ${cy}px" fill="${cor}" opacity="${op}">${d}<circle cx="${cx}" cy="${cy}" r="${r * 0.88}"/><circle cx="${cx}" cy="${cy}" r="${r * 0.35}" fill="#1e2756"/></g>`;
  }

  window.ISO = { ISO, P, S, pt, poly, box, rolo, esteira, pessoa, robo, sinaleiro, extintor, ondasSom, faiscas, engrenagem, COR, circ, r1 };
})();
