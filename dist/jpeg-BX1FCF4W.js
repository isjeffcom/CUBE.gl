import { B as re } from "./basedecoder-B9XUu15s.js";
const O = new Int32Array([
  0,
  1,
  8,
  16,
  9,
  2,
  3,
  10,
  17,
  24,
  32,
  25,
  18,
  11,
  4,
  5,
  12,
  19,
  26,
  33,
  40,
  48,
  41,
  34,
  27,
  20,
  13,
  6,
  7,
  14,
  21,
  28,
  35,
  42,
  49,
  56,
  57,
  50,
  43,
  36,
  29,
  22,
  15,
  23,
  30,
  37,
  44,
  51,
  58,
  59,
  52,
  45,
  38,
  31,
  39,
  46,
  53,
  60,
  61,
  54,
  47,
  55,
  62,
  63
]), Y = 4017, Z = 799, $ = 3406, N = 2276, Q = 1567, W = 3784, R = 5793, K = 2896;
function ne(q, l) {
  let o = 0;
  const u = [];
  let T = 16;
  for (; T > 0 && !q[T - 1]; )
    --T;
  u.push({ children: [], index: 0 });
  let w = u[0], C;
  for (let t = 0; t < T; t++) {
    for (let h = 0; h < q[t]; h++) {
      for (w = u.pop(), w.children[w.index] = l[o]; w.index > 0; )
        w = u.pop();
      for (w.index++, u.push(w); u.length <= t; )
        u.push(C = { children: [], index: 0 }), w.children[w.index] = C.children, w = C;
      o++;
    }
    t + 1 < T && (u.push(C = { children: [], index: 0 }), w.children[w.index] = C.children, w = C);
  }
  return u[0].children;
}
function ce(q, l, o, u, T, w, C, t, h) {
  const { mcusPerLine: F, progressive: c } = o, r = l;
  let b = l, i = 0, d = 0;
  function x() {
    if (d > 0)
      return d--, i >> d & 1;
    if (i = q[b++], i === 255) {
      const f = q[b++];
      if (f)
        throw new Error(`unexpected marker: ${(i << 8 | f).toString(16)}`);
    }
    return d = 7, i >>> 7;
  }
  function m(f) {
    let a = f, p;
    for (; (p = x()) !== null; ) {
      if (a = a[p], typeof a == "number")
        return a;
      if (typeof a != "object")
        throw new Error("invalid huffman sequence");
    }
    return null;
  }
  function E(f) {
    let a = f, p = 0;
    for (; a > 0; ) {
      const L = x();
      if (L === null)
        return;
      p = p << 1 | L, --a;
    }
    return p;
  }
  function k(f) {
    const a = E(f);
    return a >= 1 << f - 1 ? a : a + (-1 << f) + 1;
  }
  function A(f, a) {
    const p = m(f.huffmanTableDC), L = p === 0 ? 0 : k(p);
    f.pred += L, a[0] = f.pred;
    let v = 1;
    for (; v < 64; ) {
      const P = m(f.huffmanTableAC), y = P & 15, S = P >> 4;
      if (y === 0) {
        if (S < 15)
          break;
        v += 16;
      } else {
        v += S;
        const I = O[v];
        a[I] = k(y), v++;
      }
    }
  }
  function D(f, a) {
    const p = m(f.huffmanTableDC), L = p === 0 ? 0 : k(p) << h;
    f.pred += L, a[0] = f.pred;
  }
  function s(f, a) {
    a[0] |= x() << h;
  }
  let n = 0;
  function g(f, a) {
    if (n > 0) {
      n--;
      return;
    }
    let p = w;
    const L = C;
    for (; p <= L; ) {
      const v = m(f.huffmanTableAC), P = v & 15, y = v >> 4;
      if (P === 0) {
        if (y < 15) {
          n = E(y) + (1 << y) - 1;
          break;
        }
        p += 16;
      } else {
        p += y;
        const S = O[p];
        a[S] = k(P) * (1 << h), p++;
      }
    }
  }
  let e = 0, _;
  function te(f, a) {
    let p = w;
    const L = C;
    let v = 0;
    for (; p <= L; ) {
      const P = O[p], y = a[P] < 0 ? -1 : 1;
      switch (e) {
        case 0: {
          const S = m(f.huffmanTableAC), I = S & 15;
          if (v = S >> 4, I === 0)
            v < 15 ? (n = E(v) + (1 << v), e = 4) : (v = 16, e = 1);
          else {
            if (I !== 1)
              throw new Error("invalid ACn encoding");
            _ = k(I), e = v ? 2 : 3;
          }
          continue;
        }
        case 1:
        // skipping r zero items
        case 2:
          a[P] ? a[P] += (x() << h) * y : (v--, v === 0 && (e = e === 2 ? 3 : 0));
          break;
        case 3:
          a[P] ? a[P] += (x() << h) * y : (a[P] = _ << h, e = 0);
          break;
        case 4:
          a[P] && (a[P] += (x() << h) * y);
          break;
      }
      p++;
    }
    e === 4 && (n--, n === 0 && (e = 0));
  }
  function se(f, a, p, L, v) {
    const P = p / F | 0, y = p % F, S = P * f.v + L, I = y * f.h + v;
    a(f, f.blocks[S][I]);
  }
  function oe(f, a, p) {
    const L = p / f.blocksPerLine | 0, v = p % f.blocksPerLine;
    a(f, f.blocks[L][v]);
  }
  const V = u.length;
  let U, j, G, X, B, H;
  c ? w === 0 ? H = t === 0 ? D : s : H = t === 0 ? g : te : H = A;
  let M = 0, z, J;
  V === 1 ? J = u[0].blocksPerLine * u[0].blocksPerColumn : J = F * o.mcusPerColumn;
  const ee = T || J;
  for (; M < J; ) {
    for (j = 0; j < V; j++)
      u[j].pred = 0;
    if (n = 0, V === 1)
      for (U = u[0], B = 0; B < ee; B++)
        oe(U, H, M), M++;
    else
      for (B = 0; B < ee; B++) {
        for (j = 0; j < V; j++) {
          U = u[j];
          const { h: f, v: a } = U;
          for (G = 0; G < a; G++)
            for (X = 0; X < f; X++)
              se(U, H, M, G, X);
        }
        if (M++, M === J)
          break;
      }
    if (d = 0, z = q[b] << 8 | q[b + 1], z < 65280)
      throw new Error("marker was not found");
    if (z >= 65488 && z <= 65495)
      b += 2;
    else
      break;
  }
  return b - r;
}
function ie(q, l) {
  const o = [], { blocksPerLine: u, blocksPerColumn: T } = l, w = u << 3, C = new Int32Array(64), t = new Uint8Array(64);
  function h(F, c, r) {
    const b = l.quantizationTable;
    let i, d, x, m, E, k, A, D, s;
    const n = r;
    let g;
    for (g = 0; g < 64; g++)
      n[g] = F[g] * b[g];
    for (g = 0; g < 8; ++g) {
      const e = 8 * g;
      if (n[1 + e] === 0 && n[2 + e] === 0 && n[3 + e] === 0 && n[4 + e] === 0 && n[5 + e] === 0 && n[6 + e] === 0 && n[7 + e] === 0) {
        s = R * n[0 + e] + 512 >> 10, n[0 + e] = s, n[1 + e] = s, n[2 + e] = s, n[3 + e] = s, n[4 + e] = s, n[5 + e] = s, n[6 + e] = s, n[7 + e] = s;
        continue;
      }
      i = R * n[0 + e] + 128 >> 8, d = R * n[4 + e] + 128 >> 8, x = n[2 + e], m = n[6 + e], E = K * (n[1 + e] - n[7 + e]) + 128 >> 8, D = K * (n[1 + e] + n[7 + e]) + 128 >> 8, k = n[3 + e] << 4, A = n[5 + e] << 4, s = i - d + 1 >> 1, i = i + d + 1 >> 1, d = s, s = x * W + m * Q + 128 >> 8, x = x * Q - m * W + 128 >> 8, m = s, s = E - A + 1 >> 1, E = E + A + 1 >> 1, A = s, s = D + k + 1 >> 1, k = D - k + 1 >> 1, D = s, s = i - m + 1 >> 1, i = i + m + 1 >> 1, m = s, s = d - x + 1 >> 1, d = d + x + 1 >> 1, x = s, s = E * N + D * $ + 2048 >> 12, E = E * $ - D * N + 2048 >> 12, D = s, s = k * Z + A * Y + 2048 >> 12, k = k * Y - A * Z + 2048 >> 12, A = s, n[0 + e] = i + D, n[7 + e] = i - D, n[1 + e] = d + A, n[6 + e] = d - A, n[2 + e] = x + k, n[5 + e] = x - k, n[3 + e] = m + E, n[4 + e] = m - E;
    }
    for (g = 0; g < 8; ++g) {
      const e = g;
      if (n[8 + e] === 0 && n[16 + e] === 0 && n[24 + e] === 0 && n[32 + e] === 0 && n[40 + e] === 0 && n[48 + e] === 0 && n[56 + e] === 0) {
        s = R * r[g + 0] + 8192 >> 14, n[0 + e] = s, n[8 + e] = s, n[16 + e] = s, n[24 + e] = s, n[32 + e] = s, n[40 + e] = s, n[48 + e] = s, n[56 + e] = s;
        continue;
      }
      i = R * n[0 + e] + 2048 >> 12, d = R * n[32 + e] + 2048 >> 12, x = n[16 + e], m = n[48 + e], E = K * (n[8 + e] - n[56 + e]) + 2048 >> 12, D = K * (n[8 + e] + n[56 + e]) + 2048 >> 12, k = n[24 + e], A = n[40 + e], s = i - d + 1 >> 1, i = i + d + 1 >> 1, d = s, s = x * W + m * Q + 2048 >> 12, x = x * Q - m * W + 2048 >> 12, m = s, s = E - A + 1 >> 1, E = E + A + 1 >> 1, A = s, s = D + k + 1 >> 1, k = D - k + 1 >> 1, D = s, s = i - m + 1 >> 1, i = i + m + 1 >> 1, m = s, s = d - x + 1 >> 1, d = d + x + 1 >> 1, x = s, s = E * N + D * $ + 2048 >> 12, E = E * $ - D * N + 2048 >> 12, D = s, s = k * Z + A * Y + 2048 >> 12, k = k * Y - A * Z + 2048 >> 12, A = s, n[0 + e] = i + D, n[56 + e] = i - D, n[8 + e] = d + A, n[48 + e] = d - A, n[16 + e] = x + k, n[40 + e] = x - k, n[24 + e] = m + E, n[32 + e] = m - E;
    }
    for (g = 0; g < 64; ++g) {
      const e = 128 + (n[g] + 8 >> 4);
      e < 0 ? c[g] = 0 : e > 255 ? c[g] = 255 : c[g] = e;
    }
  }
  for (let F = 0; F < T; F++) {
    const c = F << 3;
    for (let r = 0; r < 8; r++)
      o.push(new Uint8Array(w));
    for (let r = 0; r < u; r++) {
      h(l.blocks[F][r], t, C);
      let b = 0;
      const i = r << 3;
      for (let d = 0; d < 8; d++) {
        const x = o[c + d];
        for (let m = 0; m < 8; m++)
          x[i + m] = t[b++];
      }
    }
  }
  return o;
}
class le {
  constructor() {
    this.jfif = null, this.adobe = null, this.quantizationTables = [], this.huffmanTablesAC = [], this.huffmanTablesDC = [], this.resetFrames();
  }
  resetFrames() {
    this.frames = [];
  }
  parse(l) {
    let o = 0;
    function u() {
      const t = l[o] << 8 | l[o + 1];
      return o += 2, t;
    }
    function T() {
      const t = u(), h = l.subarray(o, o + t - 2);
      return o += h.length, h;
    }
    function w(t) {
      let h = 0, F = 0, c, r;
      for (r in t.components)
        t.components.hasOwnProperty(r) && (c = t.components[r], h < c.h && (h = c.h), F < c.v && (F = c.v));
      const b = Math.ceil(t.samplesPerLine / 8 / h), i = Math.ceil(t.scanLines / 8 / F);
      for (r in t.components)
        if (t.components.hasOwnProperty(r)) {
          c = t.components[r];
          const d = Math.ceil(Math.ceil(t.samplesPerLine / 8) * c.h / h), x = Math.ceil(Math.ceil(t.scanLines / 8) * c.v / F), m = b * c.h, E = i * c.v, k = [];
          for (let A = 0; A < E; A++) {
            const D = [];
            for (let s = 0; s < m; s++)
              D.push(new Int32Array(64));
            k.push(D);
          }
          c.blocksPerLine = d, c.blocksPerColumn = x, c.blocks = k;
        }
      t.maxH = h, t.maxV = F, t.mcusPerLine = b, t.mcusPerColumn = i;
    }
    let C = u();
    if (C !== 65496)
      throw new Error("SOI not found");
    for (C = u(); C !== 65497; ) {
      switch (C) {
        case 65280:
          break;
        case 65504:
        // APP0 (Application Specific)
        case 65505:
        // APP1
        case 65506:
        // APP2
        case 65507:
        // APP3
        case 65508:
        // APP4
        case 65509:
        // APP5
        case 65510:
        // APP6
        case 65511:
        // APP7
        case 65512:
        // APP8
        case 65513:
        // APP9
        case 65514:
        // APP10
        case 65515:
        // APP11
        case 65516:
        // APP12
        case 65517:
        // APP13
        case 65518:
        // APP14
        case 65519:
        // APP15
        case 65534: {
          const t = T();
          C === 65504 && t[0] === 74 && t[1] === 70 && t[2] === 73 && t[3] === 70 && t[4] === 0 && (this.jfif = {
            version: { major: t[5], minor: t[6] },
            densityUnits: t[7],
            xDensity: t[8] << 8 | t[9],
            yDensity: t[10] << 8 | t[11],
            thumbWidth: t[12],
            thumbHeight: t[13],
            thumbData: t.subarray(14, 14 + 3 * t[12] * t[13])
          }), C === 65518 && t[0] === 65 && t[1] === 100 && t[2] === 111 && t[3] === 98 && t[4] === 101 && t[5] === 0 && (this.adobe = {
            version: t[6],
            flags0: t[7] << 8 | t[8],
            flags1: t[9] << 8 | t[10],
            transformCode: t[11]
          });
          break;
        }
        case 65499: {
          const h = u() + o - 2;
          for (; o < h; ) {
            const F = l[o++], c = new Int32Array(64);
            if (F >> 4 === 0)
              for (let r = 0; r < 64; r++) {
                const b = O[r];
                c[b] = l[o++];
              }
            else if (F >> 4 === 1)
              for (let r = 0; r < 64; r++) {
                const b = O[r];
                c[b] = u();
              }
            else
              throw new Error("DQT: invalid table spec");
            this.quantizationTables[F & 15] = c;
          }
          break;
        }
        case 65472:
        // SOF0 (Start of Frame, Baseline DCT)
        case 65473:
        // SOF1 (Start of Frame, Extended DCT)
        case 65474: {
          u();
          const t = {
            extended: C === 65473,
            progressive: C === 65474,
            precision: l[o++],
            scanLines: u(),
            samplesPerLine: u(),
            components: {},
            componentsOrder: []
          }, h = l[o++];
          let F;
          for (let c = 0; c < h; c++) {
            F = l[o];
            const r = l[o + 1] >> 4, b = l[o + 1] & 15, i = l[o + 2];
            t.componentsOrder.push(F), t.components[F] = {
              h: r,
              v: b,
              quantizationIdx: i
            }, o += 3;
          }
          w(t), this.frames.push(t);
          break;
        }
        case 65476: {
          const t = u();
          for (let h = 2; h < t; ) {
            const F = l[o++], c = new Uint8Array(16);
            let r = 0;
            for (let i = 0; i < 16; i++, o++)
              c[i] = l[o], r += c[i];
            const b = new Uint8Array(r);
            for (let i = 0; i < r; i++, o++)
              b[i] = l[o];
            h += 17 + r, F >> 4 === 0 ? this.huffmanTablesDC[F & 15] = ne(c, b) : this.huffmanTablesAC[F & 15] = ne(c, b);
          }
          break;
        }
        case 65501:
          u(), this.resetInterval = u();
          break;
        case 65498: {
          u();
          const t = l[o++], h = [], F = this.frames[0];
          for (let d = 0; d < t; d++) {
            const x = F.components[l[o++]], m = l[o++];
            x.huffmanTableDC = this.huffmanTablesDC[m >> 4], x.huffmanTableAC = this.huffmanTablesAC[m & 15], h.push(x);
          }
          const c = l[o++], r = l[o++], b = l[o++], i = ce(l, o, F, h, this.resetInterval, c, r, b >> 4, b & 15);
          o += i;
          break;
        }
        case 65535:
          l[o] !== 255 && o--;
          break;
        default:
          if (l[o - 3] === 255 && l[o - 2] >= 192 && l[o - 2] <= 254) {
            o -= 3;
            break;
          }
          throw new Error(`unknown JPEG marker ${C.toString(16)}`);
      }
      C = u();
    }
  }
  getResult() {
    const { frames: l } = this;
    if (this.frames.length === 0)
      throw new Error("no frames were decoded");
    this.frames.length > 1 && console.warn("more than one frame is not supported");
    for (let c = 0; c < this.frames.length; c++) {
      const r = this.frames[c].components;
      for (const b of Object.keys(r))
        r[b].quantizationTable = this.quantizationTables[r[b].quantizationIdx], delete r[b].quantizationIdx;
    }
    const o = l[0], { components: u, componentsOrder: T } = o, w = [], C = o.samplesPerLine, t = o.scanLines;
    for (let c = 0; c < T.length; c++) {
      const r = u[T[c]];
      w.push({
        lines: ie(o, r),
        scaleX: r.h / o.maxH,
        scaleY: r.v / o.maxV
      });
    }
    const h = new Uint8Array(C * t * w.length);
    let F = 0;
    for (let c = 0; c < t; ++c)
      for (let r = 0; r < C; ++r)
        for (let b = 0; b < w.length; ++b) {
          const i = w[b];
          h[F] = i.lines[0 | c * i.scaleY][0 | r * i.scaleX], ++F;
        }
    return h;
  }
}
class ae extends re {
  constructor(l) {
    super(l), this.reader = new le(), l.JPEGTables && this.reader.parse(l.JPEGTables);
  }
  decodeBlock(l) {
    return this.reader.resetFrames(), this.reader.parse(new Uint8Array(l)), this.reader.getResult().buffer;
  }
}
export {
  ae as default
};
//# sourceMappingURL=jpeg-BX1FCF4W.js.map
