// Broadcast-frame renderer for rally playback: perspective frame with telestration, synced top-down court.
(function (W) {
  'use strict';
  const VW = 960, VH = 540, BALL = '#F5B700';
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const norm = a => { const l = Math.hypot(a[0], a[1], a[2]); return [a[0] / l, a[1] / l, a[2] / l]; };
  const pos0 = [-7.2, 5, 7.4], f = norm(sub([10.6, 5, 0], pos0)), rgt = norm(cross([0, 0, 1], f)), up = cross(f, rgt);
  const raw = p => { const d = sub(p, pos0), z = dot(d, f); return [dot(d, rgt) / z, dot(d, up) / z, z]; };
  const FIT = (() => { const q = [[0, 0, 0], [0, 10, 0], [20, 0, 0], [20, 10, 0], [20, 0, 4], [20, 10, 4], [-.4, 0, 0], [-.4, 10, 0]].map(raw);
    const xs = q.map(p => p[0]), ys = q.map(p => p[1]), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const s = Math.min((VW - 60) / (x1 - x0), (VH - 40) / (y1 - y0)); return {s, ox: VW / 2 - (x0 + x1) / 2 * s, oy: VH / 2 + (y0 + y1) / 2 * s + 6}; })();
  const P = (x, y, z = 0) => { const q = raw([x, y, z]); return [+(FIT.ox + q[0] * FIT.s).toFixed(1), +(FIT.oy - q[1] * FIT.s).toFixed(1)]; };
  const pts = a => a.map(p => P(...p).join(',')).join(' ');
  const poly = (a, fill, stroke, sw, op) => `<polygon points="${pts(a)}" fill="${fill}"${op != null ? ` fill-opacity="${op}"` : ''}${stroke ? ` stroke="${stroke}" stroke-width="${sw || 1}"` : ''}/>`;
  const seg = (a, b, c, w, extra) => { const A = P(...a), B = P(...b); return `<line x1="${A[0]}" y1="${A[1]}" x2="${B[0]}" y2="${B[1]}" stroke="${c}" stroke-width="${w}" ${extra || ''}/>`; };

  // ---------- static court layer ----------
  const COURT = (() => {
    let s = `<rect width="${VW}" height="${VH}" fill="#0B1322"/><rect width="${VW}" height="${VH * .3}" fill="#101A2C"/>`;
    s += poly([[-3, -3, 0], [23, -3, 0], [23, 13, 0], [-3, 13, 0]], '#16243A');
    s += poly([[0, 0, 0], [20, 0, 0], [20, 10, 0], [0, 10, 0]], '#2C5E9E');
    const L = 'rgba(255,255,255,.88)';
    s += seg([0, 0, 0], [20, 0, 0], L, 2) + seg([0, 10, 0], [20, 10, 0], L, 2) + seg([0, 0, 0], [0, 10, 0], L, 2) + seg([20, 0, 0], [20, 10, 0], L, 2);
    s += seg([3.05, 0, 0], [3.05, 10, 0], L, 1.6) + seg([16.95, 0, 0], [16.95, 10, 0], L, 1.6) + seg([3.05, 5, 0], [16.95, 5, 0], L, 1.6);
    // far wall glass + fence, side glass
    const G = 'rgba(214,230,255,.38)';
    s += poly([[20, 0, 0], [20, 10, 0], [20, 10, 3], [20, 0, 3]], '#D6E6FF', G, 1.2, .05) + poly([[20, 0, 3], [20, 10, 3], [20, 10, 4], [20, 0, 4]], '#D6E6FF', 'rgba(214,230,255,.22)', 1, .03);
    [2, 4, 6, 8].forEach(y => { s += seg([20, y, 0], [20, y, 4], 'rgba(214,230,255,.16)', 1); });
    for (const y of [0, 10]) {
      s += poly([[16, y, 0], [18, y, 0], [18, y, 2], [16, y, 2]], '#D6E6FF', G, 1, .04) + poly([[18, y, 0], [20, y, 0], [20, y, 3], [18, y, 3]], '#D6E6FF', G, 1, .05);
      s += poly([[2, y, 0], [4, y, 0], [4, y, 2], [2, y, 2]], '#D6E6FF', G, 1, .04) + poly([[0, y, 0], [2, y, 0], [2, y, 3], [0, y, 3]], '#D6E6FF', G, 1, .05);
      s += seg([4, y, 3], [16, y, 3], 'rgba(214,230,255,.18)', 1);
      for (let x = 4; x <= 16; x += 2) s += seg([x, y, 0], [x, y, 3], 'rgba(214,230,255,.12)', 1);
    }
    return s;
  })();
  const NET = poly([[10, 0, 0], [10, 10, 0], [10, 10, .92], [10, 0, .92]], '#0B1322', null, 0, .42) + seg([10, 0, .92], [10, 10, .92], 'rgba(255,255,255,.95)', 2.4) + seg([10, 0, 0], [10, 0, 1.0], '#E5E7EB', 2.4) + seg([10, 10, 0], [10, 10, 1.0], '#E5E7EB', 2.4);

  // ---------- rally kinematics ----------
  const ZC = {Bandeja: 2.5, 'Víbora': 2.5, Smash: 2.8, Serve: .9, Volley: 1.05, Block: .95, Bajada: 1.3};
  const APEX = {Lob: 5.2, Chiquita: .8, Serve: 1.1, Return: 1.1, Volley: .5, Block: .5, Bandeja: .9, 'Víbora': .7, Smash: .15, Bajada: .5, Contrapared: 2.2, Drive: .7};
  const cz = s => ZC[s.type] != null ? ZC[s.type] : .75;
  const C3 = s => [s.o[0], s.o[1], cz(s)];
  const arc = (a, b, h, k) => { const out = []; for (let i = 0; i <= k; i++) { const u = i / k; out.push([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u + 4 * h * u * (1 - u)]); } return out; };
  function flight(r, k) {
    const s = r.shots[k], n = r.shots[k + 1], a = C3(s), h = APEX[s.type] != null ? APEX[s.type] : .7;
    const t0 = s.t, t1 = n ? n.t : s.t + 1.1;
    if (!s.land) { const end = [s.o[0] + (s.pair === 'A' ? 1 : -1) * Math.max(1, Math.abs(10 - s.o[0]) * .95), s.o[1], .3]; return {legs: [{p: arc(a, end, h * .4, 14), t0, t1: t0 + .7}], land: null}; }
    const L = [s.land[0], s.land[1], 0];
    if (n && !n.bounced) return {legs: [{p: arc(a, C3(n), h, 18), t0, t1}], land: null};
    const tl = n ? t0 + (t1 - t0) * .7 : t0 + .8, legs = [{p: arc(a, L, h, 18), t0, t1: tl}];
    if (n) { const c = C3(n); if (n.glass) { const wx = n.pair === 'A' ? 0 : 20, w = [wx, (L[1] + c[1]) / 2, 1.3]; legs.push({p: arc(L, w, .5, 8), t0: tl, t1: tl + (t1 - tl) * .55}, {p: arc(w, c, .3, 8), t0: tl + (t1 - tl) * .55, t1}); } else legs.push({p: arc(L, c, .55, 10), t0: tl, t1}); }
    return {legs, land: L};
  }
  const shotAt = (r, t) => { let k = 0; for (let i = 0; i < r.shots.length; i++) if (r.shots[i].t <= t + 1e-6) k = i; return k; };
  const dur = r => r.shots[r.shots.length - 1].t + 1.4;
  const ease = u => u < .5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
  function at(r, t) {
    const k = shotAt(r, t), s = r.shots[k], n = r.shots[k + 1], u = n ? Math.max(0, Math.min(1, (t - s.t) / Math.max(.05, n.t - s.t))) : 0, e = ease(u), pos = {};
    Object.keys(s.pos).forEach(p => { const a = s.pos[p], b = n ? n.pos[p] : a; pos[p] = [a[0] + (b[0] - a[0]) * e, a[1] + (b[1] - a[1]) * e]; });
    const F = flight(r, k); let ball = null, trail = [];
    for (const lg of F.legs) { if (t < lg.t0) break; const v = Math.min(1, (t - lg.t0) / Math.max(.01, lg.t1 - lg.t0)), m = Math.round(v * (lg.p.length - 1)); trail = trail.concat(lg.p.slice(0, m + 1)); ball = lg.p[m]; if (v < 1) break; }
    if (t < s.t + .02) ball = C3(s);
    return {k, pos, ball, trail, F};
  }

  // ---------- players ----------
  const COL = {A: ['#111827', '#FFFFFF'], B: ['#A3C9FF', '#0B1322']};
  function figure(x, y, pair, hl, name) {
    const F = P(x, y, 0), H = P(x, y, 1.72), h = Math.max(8, F[1] - H[1]), b0 = P(x, y, .18), b1 = P(x, y, 1.36), hd = P(x, y, 1.58), [fill, line] = COL[pair];
    let s = `<ellipse cx="${F[0]}" cy="${F[1]}" rx="${(h * .26).toFixed(1)}" ry="${(h * .08).toFixed(1)}" fill="#000" fill-opacity=".38"/>`;
    if (hl) s += `<ellipse cx="${F[0]}" cy="${F[1]}" rx="${(h * .42).toFixed(1)}" ry="${(h * .13).toFixed(1)}" fill="none" stroke="${BALL}" stroke-width="2.4"/>`;
    const w = (h * .2).toFixed(1), w2 = (h * .2 + 3).toFixed(1);
    s += `<line x1="${b0[0]}" y1="${b0[1]}" x2="${b1[0]}" y2="${b1[1]}" stroke="${line}" stroke-width="${w2}" stroke-linecap="round"/><line x1="${b0[0]}" y1="${b0[1]}" x2="${b1[0]}" y2="${b1[1]}" stroke="${fill}" stroke-width="${w}" stroke-linecap="round"/>`;
    s += `<circle cx="${hd[0]}" cy="${hd[1]}" r="${(h * .095).toFixed(1)}" fill="${fill}" stroke="${line}" stroke-width="1.5"/>`;
    if (name) s += `<text x="${H[0]}" y="${(H[1] - 7).toFixed(1)}" text-anchor="middle" font-family="Inter,system-ui,sans-serif" font-size="13" font-weight="600" fill="#FFFFFF" stroke="#0B1322" stroke-width="3.2" paint-order="stroke">${name}</text>`;
    return s;
  }
  const short = (MI, pid) => MI.PLAYERS[pid] ? MI.PLAYERS[pid].short : pid;
  const PTS = ['0', '15', '30', '40'];
  function bug(M, r) {
    const A = M.A.name, B = M.B.name, prev = M.sets.slice(0, r.set - 1), gA = r.gamesBefore.A, gB = r.gamesBefore.B;
    const pt = k => r.golden ? '40' : PTS[Math.min(3, r.pts[k])] || '40';
    const row = (y, nm, sets, g, p, c) => `<circle cx="22" cy="${y - 4}" r="4" fill="${c}"/><text x="32" y="${y}" font-size="13" font-weight="600" fill="#FFFFFF">${nm}</text>` + sets.map((v, i) => `<text x="${178 + i * 20}" y="${y}" font-size="13" font-weight="600" fill="rgba(255,255,255,.62)" text-anchor="middle">${v}</text>`).join('') + `<text x="${178 + sets.length * 20}" y="${y}" font-size="13" font-weight="700" fill="#FFFFFF" text-anchor="middle">${g}</text><rect x="${192 + sets.length * 20}" y="${y - 13}" width="30" height="18" rx="4" fill="rgba(255,255,255,.14)"/><text x="${207 + sets.length * 20}" y="${y}" font-size="13" font-weight="700" fill="#FFFFFF" text-anchor="middle">${p}</text>`;
    const w = 236 + prev.length * 20;
    return `<g font-family="Inter,system-ui,sans-serif"><rect x="10" y="10" width="${w}" height="52" rx="8" fill="#0B1322" fill-opacity=".78"/>${row(31, A, prev.map(s => s[0]), gA, pt('A'), '#FFFFFF')}${row(53, B, prev.map(s => s[1]), gB, pt('B'), '#A3C9FF')}</g>`;
  }
  const pathD = a => a.map((p, i) => (i ? 'L' : 'M') + P(...p).join(' ')).join('');

  // ---------- broadcast frame ----------
  function frame(M, r, t, o) {
    o = o || {}; const MI = W.MI, st = at(r, t), s = r.shots[st.k], key = o.key != null ? o.key : -1;
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VW} ${VH}" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style="display:block">` + COURT;
    const ps = Object.keys(st.pos).map(p => ({p, x: st.pos[p][0], y: st.pos[p][1], pair: M.A.players.includes(p) ? 'A' : 'B'}));
    const hl = new Set([s.actor].concat(o.hl || []));
    const fig = q => figure(q.x, q.y, q.pair, hl.has(q.p), o.names === false ? '' : short(MI, q.p));
    ps.filter(q => q.x >= 10).sort((a, b) => b.x - a.x).forEach(q => { svg += fig(q); });
    svg += NET;
    ps.filter(q => q.x < 10).sort((a, b) => b.x - a.x).forEach(q => { svg += fig(q); });
    // telestration: full path of the current shot faint, travelled part solid
    const all = st.F.legs.reduce((a, l) => a.concat(l.p), []);
    if (o.full !== false) svg += `<path d="${pathD(all)}" fill="none" stroke="${BALL}" stroke-width="2.4" stroke-opacity=".45" stroke-dasharray="7 6"/>`;
    if (st.trail.length > 1) svg += `<path d="${pathD(st.trail)}" fill="none" stroke="${BALL}" stroke-width="3.4" stroke-linecap="round"/>`;
    const c = C3(s), cp = P(...c), cf = P(c[0], c[1], 0);
    svg += `<line x1="${cp[0]}" y1="${cp[1]}" x2="${cf[0]}" y2="${cf[1]}" stroke="#FFFFFF" stroke-opacity=".5" stroke-width="1.2" stroke-dasharray="3 3"/><circle cx="${cp[0]}" cy="${cp[1]}" r="5" fill="#FFFFFF" stroke="${BALL}" stroke-width="2.2"/>`;
    if (st.F.land) { const L = st.F.land, a = P(L[0] - .35, L[1], 0), b = P(L[0] + .35, L[1], 0), cc = P(L[0], L[1], 0), d = P(L[0], L[1] - .35, 0), e = P(L[0], L[1] + .35, 0);
      svg += `<ellipse cx="${cc[0]}" cy="${cc[1]}" rx="${(Math.abs(e[0] - d[0]) / 1.6 + 4).toFixed(1)}" ry="${(Math.abs(b[1] - a[1]) / 1.6 + 2.5).toFixed(1)}" fill="${BALL}" fill-opacity=".25" stroke="${BALL}" stroke-width="2.2"/>`; }
    if (st.ball) { const b = P(...st.ball), sh = P(st.ball[0], st.ball[1], 0); svg += `<ellipse cx="${sh[0]}" cy="${sh[1]}" rx="4" ry="1.6" fill="#000" fill-opacity=".45"/><circle cx="${b[0]}" cy="${b[1]}" r="5.2" fill="#E8F542" stroke="#0B1322" stroke-width="1.2"/>`; }
    if (o.bug !== false) svg += bug(M, r);
    if (o.note && s.note) svg += `<g font-family="Inter,system-ui,sans-serif"><rect x="10" y="${VH - 42}" width="${Math.min(VW - 20, 22 + s.note.length * 7.4)}" height="30" rx="8" fill="#0B1322" fill-opacity=".78"/><text x="22" y="${VH - 22}" font-size="13.5" font-weight="500" fill="#FFFFFF">${s.note}</text></g>`;
    return svg + '</svg>';
  }
  const cache = {};
  function still(M, r, i, o) {
    o = o || {}; const k = r.id + '|' + i + '|' + (o.names === false ? 0 : 1) + (o.bug === false ? 0 : 1) + (o.hl || []).join(''); if (cache[k]) return cache[k];
    const t = r.shots[i].t + .05 + (r.shots[i + 1] ? (r.shots[i + 1].t - r.shots[i].t) * .5 : .3);
    let s = frame(M, r, t, {...o, key: i, full: true}); s = s.replace('width="100%" height="100%"', `width="${VW}" height="${VH}"`);
    return cache[k] = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);
  }

  // ---------- synced top-down court ----------
  function court(M, r, t, o) {
    o = o || {}; const st = at(r, t), s = r.shots[st.k], X = v => (v * 20).toFixed(1);
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-8 -8 416 216" width="100%" height="100%" style="display:block"><rect x="0" y="0" width="400" height="200" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="1.5"/>`;
    svg += `<line x1="61" y1="0" x2="61" y2="200" stroke="#FFFFFF" stroke-width="2.5"/><line x1="339" y1="0" x2="339" y2="200" stroke="#FFFFFF" stroke-width="2.5"/><line x1="61" y1="100" x2="339" y2="100" stroke="#FFFFFF" stroke-width="2.5"/><line x1="200" y1="-6" x2="200" y2="206" stroke="#4B5563" stroke-width="3"/>`;
    const all = st.F.legs.reduce((a, l) => a.concat(l.p), []);
    svg += `<path d="${all.map((p, i) => (i ? 'L' : 'M') + X(p[0]) + ' ' + X(p[1])).join('')}" fill="none" stroke="${BALL}" stroke-width="2" stroke-dasharray="5 4" stroke-opacity=".7"/>`;
    if (st.trail.length > 1) svg += `<path d="${st.trail.map((p, i) => (i ? 'L' : 'M') + X(p[0]) + ' ' + X(p[1])).join('')}" fill="none" stroke="${BALL}" stroke-width="3" stroke-linecap="round"/>`;
    if (st.F.land) svg += `<circle cx="${X(st.F.land[0])}" cy="${X(st.F.land[1])}" r="6" fill="${BALL}" fill-opacity=".25" stroke="${BALL}" stroke-width="2"/>`;
    Object.keys(st.pos).forEach(p => { const A = M.A.players.includes(p), q = st.pos[p], act = p === s.actor;
      svg += (act ? `<circle cx="${X(q[0])}" cy="${X(q[1])}" r="13" fill="none" stroke="${BALL}" stroke-width="2.2"/>` : '') + `<circle cx="${X(q[0])}" cy="${X(q[1])}" r="8.5" fill="${A ? '#111827' : '#A3C9FF'}" stroke="${A ? '#FFFFFF' : '#111827'}" stroke-width="1.6"/>` +
        `<text x="${X(q[0])}" y="${(q[1] * 20 - 13).toFixed(1)}" text-anchor="middle" font-family="Inter,system-ui,sans-serif" font-size="11" font-weight="600" fill="#111827" stroke="#F1F5F9" stroke-width="3" paint-order="stroke">${short(W.MI, p)}</text>`; });
    if (st.ball) svg += `<circle cx="${X(st.ball[0])}" cy="${X(st.ball[1])}" r="${(4 + Math.min(4, st.ball[2] * .8)).toFixed(1)}" fill="#E8F542" stroke="#111827" stroke-width="1.2"/>`;
    return svg + '</svg>';
  }
  // zone map of the receiving half, mirrored so both pairs' shots read the same way
  W.MV = {frame, still, court, at, dur, shotAt, VW, VH, BALL};
})(typeof window !== 'undefined' ? window : globalThis);
