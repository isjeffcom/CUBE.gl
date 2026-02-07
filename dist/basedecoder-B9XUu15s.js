function s(n, o) {
  let t = n.length - o, a = 0;
  do {
    for (let r = o; r > 0; r--)
      n[a + o] += n[a], a++;
    t -= o;
  } while (t > 0);
}
function h(n, o, t) {
  let a = 0, r = n.length;
  const l = r / t;
  for (; r > o; ) {
    for (let e = o; e > 0; --e)
      n[a + o] += n[a], ++a;
    r -= o;
  }
  const i = n.slice();
  for (let e = 0; e < l; ++e)
    for (let c = 0; c < t; ++c)
      n[t * e + c] = i[(t - c - 1) * l + e];
}
function u(n, o, t, a, r, l) {
  if (!o || o === 1)
    return n;
  for (let c = 0; c < r.length; ++c) {
    if (r[c] % 8 !== 0)
      throw new Error("When decoding with predictor, only multiple of 8 bits are supported.");
    if (r[c] !== r[0])
      throw new Error("When decoding with predictor, all samples must have the same size.");
  }
  const i = r[0] / 8, e = l === 2 ? 1 : r.length;
  for (let c = 0; c < a && !(c * e * t * i >= n.byteLength); ++c) {
    let f;
    if (o === 2) {
      switch (r[0]) {
        case 8:
          f = new Uint8Array(n, c * e * t * i, e * t * i);
          break;
        case 16:
          f = new Uint16Array(n, c * e * t * i, e * t * i / 2);
          break;
        case 32:
          f = new Uint32Array(n, c * e * t * i, e * t * i / 4);
          break;
        default:
          throw new Error(`Predictor 2 not allowed with ${r[0]} bits per sample.`);
      }
      s(f, e);
    } else o === 3 && (f = new Uint8Array(n, c * e * t * i, e * t * i), h(f, e, i));
  }
  return n;
}
class d {
  constructor(o) {
    this.parameters = o;
  }
  async decode(o) {
    const t = await this.decodeBlock(o), { tileWidth: a, tileHeight: r, predictor: l, bitsPerSample: i, planarConfiguration: e } = this.parameters;
    return l !== 1 ? u(t, l, a, r, i, e) : t;
  }
}
export {
  d as B
};
//# sourceMappingURL=basedecoder-B9XUu15s.js.map
