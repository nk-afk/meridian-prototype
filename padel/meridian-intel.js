/* Meridian Padel · Illustrative Demo Dataset + analysis contracts.
   Every player, pair, match and event in this file is fictional. All numbers shown in the
   analysis modules are computed from the records generated here. Nothing is computer-vision output. */
(function (W) {
  'use strict';
  const mul = a => () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const R = mul(20261103);
  const rr = (a, b) => a + R() * (b - a), ch = p => R() < p, cl = (v, a, b) => Math.max(a, Math.min(b, v)), r2 = v => Math.round(v * 100) / 100;
  const wp = o => { let s = 0; for (const k in o) s += Math.max(0, o[k]); let x = R() * s; for (const k in o) { x -= Math.max(0, o[k]); if (x <= 0) return k; } return Object.keys(o)[0]; };

  // ---------- entities ----------
  const PLAYERS = {
    alb: {id: 'alb', name: 'Iker Albón', short: 'Albón', side: 'Left'}, bre: {id: 'bre', name: 'Dani Brey', short: 'Brey', side: 'Right'},
    cas: {id: 'cas', name: 'Leo Casal', short: 'Casal', side: 'Right'}, dur: {id: 'dur', name: 'Óscar Durán', short: 'Durán', side: 'Left'},
    est: {id: 'est', name: 'Pau Esteve', short: 'Esteve', side: 'Right'}, fer: {id: 'fer', name: 'Marc Feria', short: 'Feria', side: 'Left'},
    gal: {id: 'gal', name: 'Hugo Galdo', short: 'Galdo', side: 'Right'}, har: {id: 'har', name: 'Nico Haro', short: 'Haro', side: 'Left'},
    iba: {id: 'iba', name: 'Raúl Ibarra', short: 'Ibarra', side: 'Right'}};
  const PAIRS = {
    AB: {id: 'AB', players: ['alb', 'bre'], name: 'Albón / Brey', ours: true}, AC: {id: 'AC', players: ['alb', 'cas'], name: 'Albón / Casal', ours: true},
    DE: {id: 'DE', players: ['dur', 'est'], name: 'Durán / Esteve'}, FG: {id: 'FG', players: ['fer', 'gal'], name: 'Feria / Galdo'}, HI: {id: 'HI', players: ['har', 'iba'], name: 'Haro / Ibarra'}};
  // tendencies that drive the simulation (so patterns exist in the records, not in the UI)
  const PROF = {
    alb: {air: .62, onB: [.10, .40], onF: [.10, .35], smash: .30, chiq: .30, glassErr: 0},
    bre: {air: .40, onB: [.30, .85], onF: [.20, .60], onR: [.3, 1.1], yRec: .3, smash: .20, chiq: .18, glassErr: .07},
    cas: {air: .55, onB: [.15, .45], onF: [.15, .40], smash: .22, chiq: .22, glassErr: 0},
    dur: {air: .38, onB: [.20, .60], onF: [.15, .45], smash: .25, chiq: .20, glassErr: .04, deepLob: .14},
    est: {air: .60, onB: [.10, .40], onF: [.10, .40], smash: .32, chiq: .22, glassErr: 0},
    fer: {air: .55, onB: [.15, .45], onF: [.15, .45], smash: .25, chiq: .24, glassErr: 0, midMiss: .10},
    gal: {air: .52, onB: [.15, .50], onF: [.15, .45], smash: .28, chiq: .20, glassErr: .03, midMiss: .10},
    har: {air: .58, onB: [.10, .40], onF: [.10, .40], smash: .30, chiq: .26, glassErr: 0, lowErr: .10},
    iba: {air: .50, onB: [.15, .50], onF: [.15, .50], smash: .26, chiq: .20, glassErr: .02, lowErr: .10}};
  const MDEF = [
    ['m01', 'AB', 'DE', '27 Feb 2026', 58, 'Riyadh P1', 'Quarter-final', 0], ['m02', 'AB', 'FG', '21 Mar 2026', 80, 'Gijón P2', 'Semi-final', 2],
    ['m03', 'AB', 'HI', '24 Apr 2026', 114, 'Brussels P2', 'Quarter-final', 4], ['m04', 'AB', 'DE', '17 May 2026', 137, 'Buenos Aires P1', 'Final', 7],
    ['m05', 'AC', 'FG', '22 May 2026', 142, 'Venice P2', 'Quarter-final', 8], ['m06', 'AB', 'HI', '27 Jun 2026', 178, 'Málaga P1', 'Semi-final', 11],
    ['m07', 'AB', 'DE', '19 Jul 2026', 200, 'Madrid Major', 'Final', 12], ['m08', 'AC', 'DE', '28 Aug 2026', 240, 'Rotterdam P2', 'Quarter-final', 14],
    ['m09', 'AB', 'FG', '19 Sep 2026', 262, 'Paris Major', 'Semi-final', 16], ['m10', 'AB', 'DE', '11 Oct 2026', 284, 'Milan P1', 'Final', 17]];
  const INTERVENTION_DAY = 152; // 1 Jun 2026, coach-editable in LP6
  Object.values(PAIRS).forEach(p => { p.draw = 'Men'; });
  Object.values(PLAYERS).forEach(p => { p.g = 'M'; });
  // ---------- women's draw and Pro Padel League ----------
  const NEWP = [['abl','Laia Albiol','Left','F'],['ben','Nuria Benet','Right','F'],['cid','Marta Cid','Left','F'],['dor','Ana Dorado','Right','F'],['fon','Claudia Font','Left','F'],['gra','Elena Grau','Right','F'],['yus','Paula Yuste','Left','F'],['zaf','Irene Zafra','Right','F'],
    ['ezc','Javi Ezcurra','Left','M'],['val','Bruno Valdés','Right','M'],['rod','Álex Ródenas','Left','M'],['tor','Sergio Toral','Right','M'],['qui','Jon Quirós','Left','M'],['jor','Carla Jordà','Left','F'],['zub','Mikel Zubiri','Right','M'],['naj','Adrián Nájera','Left','M'],
    ['mai','Rubén Mairena','Right','M'],['sol','Víctor Solís','Left','M'],['que','Sara Quer','Left','F'],['roi','Lucía Roig','Right','F'],['olm','Gonzalo Olmo','Left','M'],['sae','Diego Sáez','Left','M'],['llo','Tomás Llorca','Left','M'],['pin','Marcos Pineda','Right','M'],
    ['lez','Pablo Lezo','Left','M'],['gom','Alba Gomila','Left','F'],['ori','Eva Oria','Right','F'],['esc','Julia Escrivá','Right','F'],['frr','Andrés Ferrán','Left','M'],['rue','Lucas Rueda','Right','M'],['vid','Mario Vidaña','Left','M'],['mae','Rocío Maestre','Left','F'],
    ['pra','Vera Prat','Right','F'],['cue','Luis Cuevas','Left','M'],['arn','Carlos Arnau','Right','M'],['bar','Ángel Barea','Left','M'],['lag','Inés Lago','Left','F'],['noy','Clara Noya','Right','F']];
  const Q = mul(4242);
  NEWP.forEach(([id, name, side, g]) => { PLAYERS[id] = {id, name, short: name.split(' ').slice(1).join(' '), side, g}; const q = Q, a = q(), b = q(), c = q(), d = q();
    PROF[id] = {air: .45 + a * .17, onB: [.12 + b * .08, .4 + b * .15], onF: [.12 + c * .08, .38 + c * .12], smash: .2 + d * .1, chiq: .18 + a * .08, glassErr: b < .3 ? .03 : 0}; });
  const NEWPR = [['W1','abl','ben','Women',1],['W2','cid','dor','Women'],['W3','fon','gra','Women'],['W4','yus','zaf','Women'],['HX1','abl','val','Mixed',1],['HX2','ezc','ben','Mixed',1],
    ['RT','rod','tor','Men'],['GJ','jor','gra','Women'],['QG','qui','gra','Mixed'],['DZ','dur','zub','Men'],['NC','naj','cid','Mixed'],['FM','fer','mai','Men'],['QR','que','roi','Women'],['SQ','sol','que','Mixed'],
    ['OI','olm','iba','Men'],['SY','sae','yus','Mixed'],['LP','llo','pin','Men'],['GO','gom','ori','Women'],['LE','lez','esc','Mixed'],['FR','frr','rue','Men'],['MP','mae','pra','Women'],['VM','vid','mae','Mixed'],['CA','cue','arn','Men'],['LN','lag','noy','Women'],['BL','bar','lag','Mixed']];
  NEWPR.forEach(([id, a, b, draw, ours]) => { PAIRS[id] = {id, players: [a, b], name: PLAYERS[a].short + ' / ' + PLAYERS[b].short, draw, ours: !!ours}; });
  const TEAMS = {HOU: {id: 'HOU', name: 'Houston Volts', ours: true, men: 'AB', women: 'W1', mixed: ['HX1', 'HX2']}, MIA: {id: 'MIA', name: 'Miami Padel Club', men: 'RT', women: 'GJ', mixed: ['QG']},
    SDS: {id: 'SDS', name: 'San Diego Stingrays', men: 'DZ', women: 'W2', mixed: ['NC']}, TOR: {id: 'TOR', name: 'Toronto Polar Bears', men: 'FM', women: 'QR', mixed: ['SQ']}, ARK: {id: 'ARK', name: 'Arkansas Matrix', men: 'OI', women: 'W4', mixed: ['SY']},
    NYA: {id: 'NYA', name: 'New York Atlantics', men: 'LP', women: 'GO', mixed: ['LE']}, LVS: {id: 'LVS', name: 'Las Vegas Smash', men: 'FR', women: 'MP', mixed: ['VM']}, CUN: {id: 'CUN', name: 'Cancún Waves', men: 'CA', women: 'LN', mixed: ['BL']}};
  const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], CUM = [0,31,59,90,120,151,181,212,243,273,304,334];
  const dayAt = (endD, endM, ri) => { const d = endD - (2 - ri); return {date: d + ' ' + MON[endM] + ' 2026', day: CUM[endM] + d}; };
  const RNDS = ['Quarter-final', 'Semi-final', 'Final'];
  const WDEF = [['w01','W1','W2','Qatar Major',8,2,0,1],['w02','W1','W3','Santiago P1',3,4,1,5],['w03','W1','W4','Italy Major',14,5,0,9],['w04','W1','W2','Mallorca P2',26,6,2,13],['w05','W1','W3','Düsseldorf P2',6,8,1,15],['w06','W1','W2','Newgiza P2',25,9,2,18]];
  const PPLDEF = [["Las Vegas City's Cup",7,5,['MIA','SDS','TOR']],["New York City's Cup",21,5,['NYA','ARK','LVS']],["Houston City's Cup",12,6,['CUN','TOR','SDS']],["Los Angeles City's Cup",26,6,['ARK','MIA','NYA']],["Miami City's Cup Finals",9,7,['TOR','SDS','LVS']]];

  // ---------- simulation ----------
  const TYPES = {
    Serve: {fl: [.75, .9], land: [4, 6.5], win: .02, err: 0}, Return: {fl: [.8, 1], land: [3.5, 6.5], win: .02, err: .06},
    Lob: {fl: [1.6, 2.2], land: [.4, 2.8], win: .03, err: .08}, Chiquita: {fl: [.9, 1.2], land: [6, 8.5], win: .03, err: .09},
    Drive: {fl: [.8, 1.1], land: [3, 7], win: .05, err: .09}, Volley: {fl: [.5, .8], land: [2, 7], win: .10, err: .07},
    Block: {fl: [.6, .9], land: [5, 8.5], win: .03, err: .09}, Bandeja: {fl: [1, 1.3], land: [1, 3.5], win: .04, err: .07},
    'Víbora': {fl: [.8, 1], land: [1, 3], win: .12, err: .11}, Smash: {fl: [.5, .7], land: [1, 4], win: .30, err: .14},
    Bajada: {fl: [.6, .8], land: [2, 6], win: .14, err: .12}, Contrapared: {fl: [1, 1.3], land: [4, 8], win: .05, err: .12}};
  const OVER = ['Bandeja', 'Víbora', 'Smash'], AIRT = ['Bandeja', 'Víbora', 'Smash', 'Volley', 'Block'], ATT = ['Smash', 'Víbora', 'Bajada'];
  const stOf = (a, b) => a > 5.5 && b > 5.5 ? 'net' : a < 4 && b < 4 ? 'back' : 'split';

  function simRally(M, c) {
    const pl = {A: M.A.players, B: M.B.players}, oth = k => k === 'A' ? 'B' : 'A';
    const pk = pid => pl.A.includes(pid) ? 'A' : 'B', slot = pid => pl[pk(pid)].indexOf(pid), mate = pid => pl[pk(pid)].find(x => x !== pid);
    const hy = pid => { const k = pk(pid), s = slot(pid); return k === 'A' ? (s ? 7.2 : 2.8) : (s ? 2.8 : 7.2); };
    const X = (k, d) => k === 'A' ? d : 20 - d;
    const P = {};
    const S = c.srv, Rv = c.rcv, sk = pk(S);
    P[S] = {d: rr(2.2, 2.8), y: hy(S) + rr(-.5, .5)}; P[mate(S)] = {d: rr(7, 8.2), y: hy(mate(S))};
    P[Rv] = {d: rr(1.2, 2.4), y: hy(Rv)}; P[mate(Rv)] = ch(.6) ? {d: rr(6.2, 7.6), y: hy(mate(Rv))} : {d: rr(2, 3.5), y: hy(mate(Rv))};
    const shots = []; let H = sk, t = 0, inc = null, pend = {}, end = null;
    const serveNum = ch(.12) ? 2 : 1, side = (c.pa + c.pb) % 2 === 0 ? 'deuce' : 'ad';
    for (let n = 0; n < 34 && !end; n++) {
      const O = oth(H), all = [...pl.A, ...pl.B];
      let hitter, mode, cd, bounced = true, glass = null, mv = {...pend};
      if (n === 0) { hitter = S; mode = 'serve'; cd = P[S].d; }
      else if (n === 1) { hitter = Rv; mode = 'return'; cd = cl(P[Rv].d + rr(-.3, .6), .8, 3); }
      else {
        const y = inc.yL; let cand = pl[H].slice().sort((a, b) => Math.abs(hy(a) - y) - Math.abs(hy(b) - y));
        if (Math.abs(y - 5) < 1) { const L = pl[H][0], Rt = pl[H][1], withCas = pl[H].includes('cas'); const pL = H === 'A' ? (withCas ? .42 : .66) : .5; cand = ch(pL) ? [L, Rt] : [Rt, L]; }
        hitter = cand[0];
        const was = P[hitter].d, fw = was > 5;
        if (inc.type === 'Lob' && fw) {
          let pa = PROF[hitter].air * (inc.dL < 1.2 ? .55 : inc.dL < 1.8 ? .85 : 1.1);
          if (hitter === 'bre' && M.day >= INTERVENTION_DAY) pa += .22;
          mode = ch(cl(pa, .05, .95)) ? 'over' : 'bounce';
        } else if ((inc.type === 'Chiquita' || inc.type === 'Block') && fw) mode = 'low';
        else if (ATT.includes(inc.type) && !fw) mode = 'defend';
        else mode = fw ? 'net' : 'build';
        const avail = inc.fl + (mode === 'bounce' || mode === 'defend' || mode === 'build' ? rr(.35, .8) : 0);
        const move = (pid, target, on) => { const from = P[pid].d, dist = Math.abs(target - from), cov = Math.max(0, avail - on) * 4.3, to = dist <= cov ? target : from + Math.sign(target - from) * cov; mv[pid] = {from: r2(from), to: r2(to), on: r2(on), dt: r2(avail)}; P[pid].d = to; return dist <= cov; };
        const m = mate(hitter);
        if (mode === 'over') { cd = cl(inc.dL + rr(2.4, 4), 4.2, 7.4); move(hitter, cd, rr(.05, .25)); move(m, rr(5.6, 7.4), rr(.1, .4)); bounced = false; }
        else if (mode === 'bounce') {
          cd = rr(.3, 1.6); const onH = rr(...PROF[hitter].onB), onM = rr(...PROF[m].onB); const ok = move(hitter, cd, onH); move(m, rr(1.5, 3), onM);
          glass = ch(.6) ? 'back' : ch(.3) ? 'side' : null; if (!ok) glass = 'late';
          mv._gap = r2(Math.abs(onH - onM));
        }
        else if (mode === 'low') { cd = rr(6.6, 8.2); move(hitter, cd, .05); bounced = false; }
        else if (mode === 'net') { cd = rr(6, 8.3); move(hitter, cd, .05); bounced = !ch(.85) ? true : false; }
        else if (mode === 'defend') { cd = rr(.3, 2); move(hitter, cd, rr(.05, .3)); glass = ch(.55) ? 'back' : ch(.35) ? 'side' : null; }
        else { cd = rr(.8, 3); move(hitter, cd, .05); glass = ch(.3) ? 'back' : null; }
        P[hitter].y = cl(y + rr(-.4, .4), .5, 9.5);
        const my = hy(m) + (P[hitter].y - hy(hitter)) * rr(.2, .55); P[m].y = cl(my, .6, 9.4);
      }
      // shot type
      let type; const hp = PROF[hitter];
      if (mode === 'serve') type = 'Serve';
      else if (mode === 'return') type = wp({Return: .6, Lob: .27, Chiquita: .13});
      else if (mode === 'over') { const w = {Smash: hp.smash, 'Víbora': .35, Bandeja: .4}; if (cd < 5) { w.Bandeja *= 1.6; w.Smash *= .5; } if (hitter === 'alb' && c.conLost >= 2) w.Smash *= 2.2; type = wp(w); }
      else if (mode === 'bounce' || mode === 'defend') type = wp({Lob: .45, Chiquita: hp.chiq, Drive: .17, Contrapared: glass ? .1 : 0, Bajada: glass === 'back' ? .1 : 0});
      else if (mode === 'build') { const w = {Lob: .36, Chiquita: hp.chiq + .06, Drive: .28, Bajada: .08}; if (H === 'A' && n >= 9) w.Lob *= 1.4; if (H === 'B' && M.B.id === 'DE' && c.set >= 2) w.Lob *= 1.6; if (inc && inc.type === 'Bandeja' && inc.mid) w.Lob *= 1.8; type = wp(w); }
      else if (mode === 'low') type = wp({Volley: .55, Block: .35, Lob: .1});
      else type = wp({Volley: .62, Block: .12, Bandeja: inc && inc.type === 'Lob' ? .3 : .1, Smash: .04, Lob: .06});
      if (mode === 'build' && H === 'B' && M.B.id === 'DE' && c.set >= 2 && type !== 'Lob' && ch(.12)) type = 'Lob';
      // target and landing
      const T = TYPES[type], rcv = O, lat = type === 'Serve' ? wp({T: .4, Body: .25, Wide: .35}) : wp({L: .38, M: type === 'Bandeja' ? .35 : .22, R: .38});
      const latY = (k, l) => { const leftY = k === 'A' ? 2.8 : 7.2, rightY = 10 - leftY; return l === 'L' ? leftY + rr(-1.6, 1.2) * (k === 'A' ? 1 : -1) : l === 'R' ? rightY + rr(-1.2, 1.6) * (k === 'A' ? 1 : -1) : 5 + rr(-.9, .9); };
      let yL, dL = rr(...T.land);
      if (type === 'Serve') { const ry = hy(Rv); yL = lat === 'T' ? 5 + (ry > 5 ? .5 : -.5) : lat === 'Wide' ? (ry > 5 ? rr(8.3, 9.4) : rr(.6, 1.7)) : ry + rr(-.4, .4); }
      else yL = cl(latY(rcv, lat), .4, 9.6);
      if (type === 'Lob' && H === 'A' && ch(.35)) dL = rr(.4, 1.4);
      // outcome
      let win = T.win, err = T.err;
      if (mode === 'bounce' && glass === 'late') err += .2;
      if (hitter === 'dur' && inc && inc.type === 'Lob' && inc.dL < 1.3) err += hp.deepLob || 0;
      if (glass && hp.glassErr) err += hp.glassErr;
      if (type === 'Víbora' && cd < 5.2) err += .12;
      if (type === 'Smash' && c.conLost >= 2 && H === 'A') err += .07;
      if (inc && inc.mid && hp.midMiss && n >= 2 && ch(hp.midMiss)) { err = 1; }
      if ((mode === 'low') && hp.lowErr && inc && inc.by === 'alb') err += hp.lowErr;
      if (mode === 'low' && M.B.id === 'DE' && H === 'B' && inc && inc.by === 'alb') win += .1;
      if (H === 'A' && mode === 'bounce' && mv._gap > .45) err += .07;
      if (H === 'B' && inc && inc.gapA > .45) win += .06;
      if (n >= 3) { err += .2; win += .1; }
      if (n === 0) { err = serveNum === 2 ? .05 : 0; win = .02; }
      const outcome = ch(err) ? 'error' : ch(win) ? 'winner' : 'continue';
      const fl = rr(...T.fl);
      const snap = {}, dep = {}; all.forEach(p => { snap[p] = [r2(X(pk(p), P[p].d)), r2(P[p].y)]; dep[p] = r2(P[p].d); });
      const land = outcome === 'error' ? null : [r2(X(rcv, dL)), r2(yL)];
      const shot = {n, actor: hitter, pair: H, type, mode, t: r2(t), o: snap[hitter], land, dL: land ? r2(dL) : null, lat, bounced, glass: glass === 'late' ? 'back' : glass, late: glass === 'late',
        pos: snap, dep, mv, st: {A: stOf(dep[pl.A[0]], dep[pl.A[1]]), B: stOf(dep[pl.B[0]], dep[pl.B[1]])}, outcome, mid: !!(inc && Math.abs(inc.yL - 5) < 1), gapIn: mv._gap || 0};
      delete shot.mv._gap;
      if (n === 0) shot.srv = {num: serveNum, side, dir: lat};
      shots.push(shot);
      if (outcome !== 'continue') { end = {by: H, outcome}; break; }
      // post-shot movement of the hitting pair until the next contact
      pend = {}; const avail2 = fl + .4;
      const go = (pid, target, on) => { const from = P[pid].d, dist = Math.abs(target - from), cov = Math.max(0, avail2 - on) * 4.5, to = dist <= cov ? target : from + Math.sign(target - from) * cov; pend[pid] = {from: r2(from), to: r2(to), on: r2(on), dt: r2(avail2)}; P[pid].d = to; };
      const both = pl[H];
      if (type === 'Serve') { go(S, rr(6.6, 7.8), .05); }
      else if ((type === 'Lob' || type === 'Chiquita') && !(P[both[0]].d > 5.5 && P[both[1]].d > 5.5)) {
        const adv = type === 'Lob' ? (dL < 1.5 ? .8 : .55) : .6;
        if (ch(adv)) { const o1 = rr(...PROF[both[0]].onF), o2 = rr(...PROF[both[1]].onF); go(both[0], rr(6.6, 8), o1); go(both[1], rr(6.6, 8), o2); pend._gap = r2(Math.abs(o1 - o2)); }
        else both.forEach(p => go(p, cl(P[p].d + rr(-.3, .6), .6, 3.5), .2));
      }
      else if (AIRT.includes(type)) both.forEach(p => go(p, rr(6.4, 8), p === hitter ? rr(...(PROF[p].onR || [.05, .3])) : .1));
      else both.forEach(p => go(p, cl(P[p].d + rr(-.2, .8), .6, 3.8), .2));
      both.forEach(p => { const k = p === hitter && PROF[p].yRec ? PROF[p].yRec : .6; P[p].y = cl(P[p].y + (hy(p) - P[p].y) * k, .5, 9.5); });
      const gapA = H === 'A' ? (pend._gap || 0) : 0; delete pend._gap;
      inc = {type, dL, yL, fl, mid: Math.abs(yL - 5) < 1, by: hitter, gapA};
      t += fl + (n === 0 ? .25 : 0);
      H = O;
    }
    if (!end) { const l = shots[shots.length - 1]; l.outcome = 'winner'; end = {by: l.pair, outcome: 'winner'}; }
    const winner = end.outcome === 'winner' ? end.by : (end.by === 'A' ? 'B' : 'A');
    return {shots, winner, dur: r2(shots[shots.length - 1].t + 1)};
  }


  // ---------- scripted tactical scenarios ----------
  const FLT = {Serve: .85, Return: .9, Lob: 1.9, Chiquita: 1.05, Drive: .95, Volley: .65, Block: .75, Bandeja: 1.15, 'Víbora': .9, Smash: .6, Bajada: .7, Contrapared: 1.15};
  const AIRDEF = {Volley: 1, Block: 1, Bandeja: 1, 'Víbora': 1, Smash: 1};
  function buildRally(M, c, lines) {
    const A = M.A.players, B = M.B.players, pk = p => A.includes(p) ? 'A' : 'B', mateOf = p => M[pk(p)].players.find(x => x !== p), all = [...A, ...B];
    const roles = {A1: A[0], A2: A[1], B1: B[0], B2: B[1], S: c.srv, R: c.rcv, SP: mateOf(c.srv), RP: mateOf(c.rcv)};
    const home = p => M[pk(p)].players.indexOf(p) ? 7.2 : 2.8, J = (v, a) => v + (R() - .5) * 2 * a;
    const P = {}; all.forEach(p => { P[p] = {d: 6.8, u: home(p)}; });
    const XY = (p, q) => pk(p) === 'A' ? [r2(q.d), r2(q.u)] : [r2(20 - q.d), r2(10 - q.u)];
    const shots = []; let t = 0, prevLand = null, prevType = null;
    lines.forEach((ln, n) => {
      const parts = ln.split('|').map(x => (x || '').trim()), tk = parts[0].split(/\s+/), actor = roles[tk[0]], type = tk[1], ld = tk[2], fl = new Set(tk.slice(3));
      const k = pk(actor), air = fl.has('air') || (!fl.has('bnc') && !!AIRDEF[type] && n > 1);
      if (n > 0) t += FLT[prevType] * J(1, .08) + (n === 1 ? .25 : 0);
      const tgt = {}, on = {};
      (parts[1] ? parts[1].split(/\s+/) : []).forEach(tok => { const m = /^(A1|A2|B1|B2|SP|RP|A|B|S|R)=([^@]+)(?:@([\d.]+))?$/.exec(tok); if (!m) return; const o = m[3] != null ? +m[3] : .15;
        if (m[1] === 'A' || m[1] === 'B') { const pr = M[m[1]].players; [...m[2]].forEach((ch2, j) => { tgt[pr[j]] = {d: ch2 === 'N' ? 6.8 : ch2 === 'B' ? 1.6 : 4.2, u: home(pr[j])}; on[pr[j]] = o; }); }
        else { const [d, u] = m[2].split(',').map(Number), p = roles[m[1]]; tgt[p] = {d, u}; on[p] = o; } });
      if (!tgt[actor] && prevLand) { tgt[actor] = air ? {d: P[actor].d, u: Math.max(.6, Math.min(9.4, prevLand.u))} : {d: Math.max(.4, prevLand.d - .4), u: prevLand.u}; on[actor] = .1; }
      const mv = {}, dt = n > 0 ? r2(t - shots[n - 1].t) : 0;
      all.forEach(p => { if (tgt[p]) { const to = {d: J(tgt[p].d, .18), u: J(tgt[p].u, .18)}; if (n > 0) mv[p] = {from: r2(P[p].d), to: r2(to.d), on: r2(Math.max(0, J(on[p], .04))), dt}; P[p] = to; } });
      const pos = {}, dep = {}; all.forEach(p => { pos[p] = XY(p, P[p]); dep[p] = r2(P[p].d); });
      let land = null, dL = null;
      if (ld && ld !== '-') { const [d, u] = ld.split('/').map(Number); dL = r2(Math.max(.2, J(d, .15))); const uu = Math.max(.3, Math.min(9.7, J(u, .2))); land = k === 'A' ? [r2(20 - dL), r2(10 - uu)] : [r2(dL), r2(uu)]; prevLand = {d: dL, u: uu}; } else prevLand = null;
      const pv = shots[n - 1], low = pv && (pv.type === 'Chiquita' || pv.type === 'Block') && dep[actor] > 5;
      const note = (parts[2] || '').replace(/\s(?:to|at|from|within|inside|about)?\s?\d+(?:\.\d+)?\s?m\b/g, '').replace(/\{(A1|A2|B1|B2|S|R|SP|RP)\}/g, (_, x) => PLAYERS[roles[x]].short);
      const shot = {n, actor, pair: k, type, mode: low ? 'low' : 'script', t: r2(t), o: pos[actor], land, dL, lat: '', bounced: !air, glass: fl.has('sg') ? 'side' : fl.has('gl') ? 'back' : null, late: false, pos, dep, mv,
        st: {A: stOf(dep[A[0]], dep[A[1]]), B: stOf(dep[B[0]], dep[B[1]])}, outcome: fl.has('W') ? 'winner' : fl.has('E') ? 'error' : 'continue', mid: !!(pv && pv.land && Math.abs(pv.land[1] - 5) < 1), gapIn: 0, note};
      if (type === 'Serve') shot.srv = {num: 1, side: (c.pa + c.pb) % 2 === 0 ? 'deuce' : 'ad', dir: fl.has('Wide') ? 'Wide' : fl.has('Body') ? 'Body' : 'T'};
      shots.push(shot); prevType = type;
    });
    const l = shots[shots.length - 1]; if (l.outcome === 'continue') l.outcome = 'winner';
    return {shots, winner: l.outcome === 'winner' ? l.pair : (l.pair === 'A' ? 'B' : 'A'), dur: r2(l.t + 1)};
  }
  function preamble(M, c) { const pk = p => M.A.players.includes(p) ? 'A' : 'B', home = p => M[pk(p)].players.indexOf(p) ? 7.2 : 2.8, rh = home(c.rcv), mt = p => M[pk(p)].players.find(x => x !== p);
    return ['S Serve 5.2/' + (rh < 5 ? 4.3 : 5.7) + ' | S=2.4,' + home(c.srv) + ' SP=6.8,' + home(mt(c.srv)) + ' R=1.8,' + rh + ' RP=6.8,' + home(mt(c.rcv)) + ' |', 'R Return 4.6/5 | R=1.8,' + rh + '@.05 S=5.8,' + home(c.srv) + '@.05 |']; }
  const AB = M => M.A.id === 'AB', ALB = M => M.A.players[0] === 'alb';
  const SCN = [
    {id: 'OS1P', ok: (M, c, sp) => AB(M) && M.B.id === 'DE' && sp === 'B', w: .075, pre: ['B2 Volley 3.2/6.5 | A=BB B=NN |', 'A2 Lob 0.9/1.3 | | Deep lob over Durán into his backhand corner', 'B1 Lob 3.4/5 gl | B1=0.7,1.4@.1 B2=3,5.8@.35 A=NN@.2 | Durán retreats to the back glass; Esteve drops to 3 m to cover the middle'],
      ends: [[.66, ['A1 Bandeja 2.4/5 air | A1=5.8,3.6 | Both opponents are back: Albón / Brey hold the net', 'B2 Lob 3.6/6 | B2=1.6,6 B1=1.8,2.8 |', 'A2 Smash 3/4.8 air W | A2=6.4,6 | Smash through the middle between the two retreated opponents']], [.34, ['A1 Volley 3.6/7 air | A1=5.6,3.4 |', 'B2 Chiquita 6.8/3 | B=MB@.2 | Esteve plays low and moves in', 'A1 Volley - air E | | Albón’s low volley goes into the net']]]},
    {id: 'OS1C', ok: (M, c, sp) => AB(M) && M.B.id === 'DE' && sp === 'B', w: .07, pre: ['B1 Volley 3.2/3.5 | A=BB B=NN |', 'A1 Lob 0.9/8.7 | | Deep lob over Esteve into his corner', 'B2 Bandeja 2.6/2.4 air | B2=4.8,8 B1=6.6,2.9 | Esteve takes it in the air; Durán holds the net'],
      ends: [[.66, ['A1 Lob 2.2/5 | A=BB |', 'B1 Smash 2/3 air W | B1=6.4,3.2 | Durán finishes; Albón / Brey never got forward']], [.34, ['A2 Lob 1/2 | |', 'B1 Lob 2.2/5 | B1=1,1.8@.1 B2=3.2,5@.3 A=NN@.2 |', 'A1 Volley 4/5 air W | |']]]},
    {id: 'OS2P', ok: (M, c, sp) => AB(M) && M.B.id === 'DE' && sp === 'A', w: .08, pre: ['A2 Volley 4.4/9.4 air | A=NN B=NN | Volley wide to Esteve’s side glass', 'B2 Volley 4.8/6 air | B2=4.6,9.6@.05 B1=6.6,2.6 | Esteve is pulled to the side glass; Durán stays on his side and 4 m open up in the middle'],
      ends: [[.75, ['A1 Volley 5.6/5.2 air W | A1=6.6,4.2 | Volley through the gap in the middle']], [.25, ['A1 Volley 5.6/5.2 air | A1=6.6,4.2 |', 'B1 Volley 3/3 air | B1=6.2,4.4@.05 | Durán recovers in time', 'A2 Lob 2/5 | A2=4,7 |', 'B2 Smash 2/6 air W | B2=6.2,7 |']]]},
    {id: 'OS2C', ok: (M, c, sp) => AB(M) && M.B.id === 'DE' && sp === 'A', w: .075, pre: ['A2 Volley 4.4/9.4 air | A=NN B=NN | Volley wide to Esteve’s side glass', 'B2 Volley 4.8/6 air | B2=4.6,9.6@.05 B1=6.4,4.8@.1 | Esteve is pulled wide; Durán shifts across to the middle'],
      ends: [[.66, ['A1 Volley 5.6/5.2 air | A1=6.6,4.2 |', 'B1 Volley 2.8/2.2 air | B1=6.3,4.9 | Durán is there for the middle ball', 'A1 Lob 1.4/6 | A1=2.5,2.5 |', 'B2 Smash 2.2/4 air W | B2=6.4,7 |']], [.34, ['A1 Volley 5.8/1.2 air W | A1=6.6,3 | Albón goes behind Durán to the open side']]]},
    {id: 'OS3W', ok: (M, c) => AB(M) && M.B.id === 'DE' && c.srv === 'alb' && c.rcv === 'dur', w: .3, pre: ['S Serve 5/1.1 Wide | S=2.4,2.8 SP=6.8,7.2 R=1.8,2.8 RP=6.8,7.2 | Wide serve to Durán', 'R Lob 1.2/6.6 | R=1.6,0.9@.05 S=5.6,3.2@.05 | Durán lobs the wide serve over Brey'],
      ends: [[.65, ['SP Lob 3/5 | SP=1.4,7.2@.1 S=3.4,4@.1 B=NN@.2 | Both servers pushed back; Durán / Esteve take the net', 'RP Volley 3.5/3 air | |', 'S Lob 1.6/6 | S=1.6,3 |', 'R Smash 2.6/5 air W | R=6.4,3 |']], [.35, ['SP Bandeja 2/3 air | SP=5.8,7 |', 'R Lob 1.6/6 | R=1.2,3 |', 'S Smash 3/4 air W | S=6.2,4 |']]]},
    {id: 'OS3T', ok: (M, c) => AB(M) && M.B.id === 'DE' && c.srv === 'alb' && c.rcv === 'dur', w: .3, pre: ['S Serve 5.4/4.4 T | S=2.4,2.8 SP=6.8,7.2 R=1.8,2.8 RP=6.8,7.2 | Serve to the T', 'R Chiquita 6.4/4 | R=1.8,3.4@.05 S=5.8,3.2@.05 | Durán returns low at the server’s feet'],
      ends: [[.6, ['S Block 6/5 air | S=5.6,3.6 | Albón has to block from 5.6 m, not yet set at the net', 'RP Volley 4/6 air | B=NN@.15 |', 'SP Volley - air E | |']], [.4, ['S Volley 3/4 air | S=6.2,3.6 |', 'R Lob 2/6 | R=1.6,3 |', 'SP Smash 2.4/5 air W | SP=6.4,6.8 |']]]},
    {id: 'TP3P', ok: (M, c, sp) => AB(M) && sp === 'A', w: .045, pre: ['A1 Volley 3/3 air | A=NN B=BB |', 'B1 Lob 1.8/7 | |', 'A2 Bandeja 2.5/5 air | A2=5.6,6.8 | Bandeja to the middle', 'B2 Lob 1/7.4 | B2=1.4,5.4 | From the middle they lob straight back over Brey'],
      ends: [[.72, ['A2 Lob 2/5 | A2=0.8,7.2@.15 A1=3.2,4.4@.3 B=NN@.2 | Brey has to let it bounce: both of us end up back and they take the net', 'B1 Volley 3.5/3 air | |', 'A1 Lob 2.4/5 | A1=1.5,3 |', 'B2 Smash 2/6 air W | B2=6.5,6.5 |']], [.28, ['A2 Smash 2.5/5 air | A2=5.8,7.2 | Brey gets back in time to take it in the air', 'B1 Lob 2/3 | B1=1.2,3 |', 'A1 Bandeja 2/4 air W | A1=5.8,3 |']]]},
    {id: 'TP3C', ok: (M, c, sp) => AB(M) && sp === 'A', w: .045, pre: ['A1 Volley 3/3 air | A=NN B=BB |', 'B1 Lob 1.8/7 | |', 'A2 Bandeja 1.8/9.2 air | A2=5.6,6.8 | Bandeja towards the side glass', 'B2 Block 6/6 | B2=1,9 | From the side glass they can only block it back short'],
      ends: [[.72, ['A1 Volley 4.5/5 air | A=NN | Albón / Brey keep the net', 'B1 Lob 1.8/3 | |', 'A1 Smash 2.5/4 air W | A1=5.8,3 |']], [.28, ['A1 Volley 4/5 air | A=NN |', 'B1 Lob 1.8/7 | |', 'A2 Lob 2/5 | A2=1,7@.2 A1=3,4@.3 B=NN |', 'B2 Volley 4/6 air W | |']]]},
    {id: 'TP1P', ok: (M, c, sp) => AB(M) && sp === 'B', w: .05, pre: ['B1 Volley 3/3 air | A=BB B=NN |', 'A1 Chiquita 6.4/4 | | Chiquita at {B1}’s feet', 'B1 Block 6/3.5 air | B1=6.2,3.4 A=MM@.1 | Only a short block comes back; Albón / Brey move in'],
      ends: [[.72, ['A1 Víbora 2.2/8.5 air W | A1=5.8,3.4@.05 A2=6.2,7@.15 | Albón hits the víbora from 5.8 m with both opponents still at the net']], [.28, ['A1 Víbora 2.2/8.5 air | A1=5.8,3.4@.05 A2=6.2,7 |', 'B2 Lob 1.2/7 | B2=0.8,8.6 |', 'A2 Lob 2/5 | A2=1.2,7 |', 'B1 Smash 2/3 air W | |']]]},
    {id: 'TP1C', ok: (M, c, sp) => AB(M) && sp === 'B', w: .05, pre: ['B1 Lob 2.4/3 | A=NN B=BB |', 'A2 Volley 4/5 air | |', 'B2 Lob 0.9/2.6 | | Deep lob over Albón', 'A1 Víbora 2.4/8 air | A1=4.4,2.5@.3 | Albón hits the víbora from 4.4 m straight after the deep lob'],
      ends: [[.62, ['B2 Lob 1.2/5 gl | B2=0.6,8 | It comes back off the glass', 'A2 Bandeja 2/3 air | A2=5.8,6.8 |', 'B1 Lob 1/3 | |', 'A1 Lob 2/5 | A1=1.2,3@.2 A2=3.4,6@.3 B=NN@.2 |', 'B1 Smash 2/3 air W | |']], [.38, ['B2 Lob 3/5 | B2=0.8,8 |', 'A2 Smash 3/5 air W | A2=6,6.4 |']]]},
    {id: 'TP2P', ok: (M, c, sp) => AB(M) && M.B.id === 'HI' && sp === 'A', w: .14, pre: ['A1 Volley 3/4 air | A=NN B=BB |', 'B2 Lob 2.2/3 | |', 'A1 Smash 2.5/5 air | A1=5,3 | Albón goes for the smash on shot 5', 'B1 Lob 3/5 gl | B1=0.5,3.6 | Haro defends it off the back glass'],
      ends: [[.74, ['A2 Volley 4/7 air | |', 'B2 Chiquita 6.4/6 | B=NN@.25 | Haro / Ibarra take the net', 'A2 Volley - air E | |']], [.26, ['A2 Volley 4/7 air | |', 'B2 Lob 2/5 | |', 'A1 Smash 3/4 air W | A1=6,3.4 |']]]},
    {id: 'TP2C', ok: (M, c, sp) => AB(M) && M.B.id === 'HI' && sp === 'A', w: .14, pre: ['A1 Volley 3/4 air | A=NN B=BB |', 'B2 Lob 2.2/3 | |', 'A1 Bandeja 2/5 air | A1=5,3 | Albón plays a bandeja and keeps the net', 'B1 Lob 2.4/6 | |', 'A2 Bandeja 2/3 air | A2=5.2,6.8 |', 'B2 Lob 3.4/4 | | The lob falls short'],
      ends: [[.66, ['A1 Smash 3/5 air W | A1=6.2,4 | Smash once the lob falls short']], [.34, ['A1 Smash 3/5 air | A1=6.2,4 |', 'B1 Lob 1.2/5 gl | B1=0.6,3 |', 'A2 Volley - air E | |']]]},
    {id: 'NT1P', ok: (M, c, sp) => AB(M) && sp === 'B', w: .028, pre: ['B1 Volley 3/4 air | A=BB B=NN |', 'A2 Lob 0.8/7 | | Deep lob over {B2}', 'B2 Lob 3/6 | B2=0.7,7.6@.1 B1=4,3.5@.3 A=NN@.15 | {B2} has to play from the glass; Albón and Brey advance together'],
      ends: [[.75, ['A1 Volley 4/5 air | | Both forward at their next contact', 'B1 Lob 2.6/3 | B1=1.6,3 |', 'A2 Smash 3/6 air W | A2=6.4,7 |']], [.25, ['A1 Volley 4/5 air | |', 'B1 Chiquita 6.4/3 | |', 'A1 Volley - air E | |']]]},
    {id: 'NT1C', ok: (M, c, sp) => AB(M) && sp === 'B', w: .028, pre: ['B1 Volley 3/4 air | A=BB B=NN |', 'A2 Lob 2.4/7 | | Shorter lob', 'B2 Bandeja 2/5 air | B2=4.6,7 | {B2} takes it in the air', 'A2 Lob 2/6 | A1=4,3@.2 A2=1.4,7@.5 | Albón moves up but Brey stays deep'],
      ends: [[.7, ['B1 Volley 3/7.2 air | |', 'A2 Lob 1.4/5 | A2=1,7 |', 'B2 Smash 2/5 air W | |']], [.3, ['B1 Lob 1.4/3 | |', 'A1 Lob 1/3 | A=BB |', 'B2 Lob 2/6 | B=BB@.2 A=NN@.2 |', 'A2 Volley 4/5 air W | |']]]},
    {id: 'NT3P', ok: (M, c, sp) => AB(M) && sp === 'B', w: .028, pre: ['B1 Volley 3/4 air | A=BB B=NN |', 'A1 Lob 1/3 | |', 'B1 Lob 3/5 | B1=0.8,2.5 B2=3.6,6@.3 A1=6.4,3.4@.1 A2=5.2,6.8@.75 | Albón advances at once; Brey starts 0.65 s later', 'A2 Volley 3/6 air | A2=6,6.8 |', 'B2 Volley 5.5/5.2 air | B2=5.6,6.4 | {B2} volleys into the gap between them'],
      ends: [[.7, ['A1 Volley - air E | |']], [.3, ['A1 Volley 4/4 air W | A1=6.4,4.6 |']]]},
    {id: 'NT3C', ok: (M, c, sp) => AB(M) && sp === 'B', w: .028, pre: ['B1 Volley 3/4 air | A=BB B=NN |', 'A1 Lob 1/3 | |', 'B1 Lob 3/5 | B1=0.8,2.5 B2=3.6,6@.3 A1=6.4,3.4@.1 A2=6.2,6.8@.2 | Albón and Brey advance together', 'A2 Volley 3/6 air | |', 'B2 Lob 2/5 | |'],
      ends: [[.7, ['A1 Smash 3/5 air W | |']], [.3, ['A1 Smash 3/5 air | |', 'B1 Lob 1.2/5 gl | B1=0.6,3 |', 'A2 Volley - air E | |']]]},
    {id: 'NT5H', ok: (M, c, sp) => AB(M) && sp === 'A', w: .022, pre: ['A1 Volley 3/4 air | A=NN B=BB |', 'B1 Lob 2/6 | |', 'A2 Bandeja 2/3 air | A2=5.8,6.8 | Brey holds the net and plays a bandeja'],
      ends: [[.55, ['B1 Lob 2.4/5 | |', 'A1 Smash 3/4 air W | |']], [.45, ['B1 Lob 1/7 | |', 'A2 Lob 2/5 | A2=1,7@.3 A1=3,4@.3 B=NN@.2 |', 'B2 Smash 2/6 air W | |']]]},
    {id: 'NT5R', ok: (M, c, sp) => AB(M) && sp === 'A', w: .022, pre: ['A1 Volley 3/4 air | A=NN B=BB |', 'B1 Lob 2/6 | |', 'A2 Lob 2/5 | A2=1,7@.1 A1=3.5,4@.3 B=NN@.2 | Brey retreats and lets the lob bounce'],
      ends: [[.5, ['B2 Volley 3/3 air | |', 'A1 Lob 1/3 | A1=1.6,3 |', 'B1 Lob 2/5 | B=BB@.2 A=NN@.2 |', 'A2 Volley 4/5 air W | |']], [.5, ['B2 Volley 3/6 air | |', 'A2 Lob 1.6/5 | |', 'B1 Smash 2/3 air W | |']]]},
    {id: 'PC5P', ok: (M, c, sp) => AB(M) && sp === 'B', w: .05, pre: ['B1 Volley 5/9.4 air | A=NN B=NN | Volley wide to Brey’s side glass', 'A2 Volley 4/5 air | A2=4.4,9.6@.05 A1=6.2,4.8@.1 | Brey is pulled to the side glass; Albón steps across to the middle', 'B2 Volley 5.5/5 air | | {B2} goes through the middle', 'A1 Volley 3/3 air | A1=6.3,4.9 | Albón is there to cover it'],
      ends: [[.7, ['B1 Lob 1.6/5 | B1=2,3 |', 'A2 Smash 3/5 air W | A2=6.2,7 |']], [.3, ['B1 Volley 5/8 air | |', 'A2 Volley - air E | |']]]},
    {id: 'PC5C', ok: (M, c, sp) => AB(M) && sp === 'B', w: .05, pre: ['B1 Volley 5/9.4 air | A=NN B=NN | Volley wide to Brey’s side glass', 'A2 Volley 4/5 air | A2=4.4,9.6@.05 A1=6.6,2.8 | Brey is pulled wide; Albón stays on his side and the middle is open'],
      ends: [[.7, ['B2 Volley 5.5/5 air W | B2=6.4,6 | {B2} volleys through the open middle']], [.3, ['B2 Volley 5.5/5 air | |', 'A1 Volley 3/4 air | A1=6.2,4.4@.05 | Albón recovers in time', 'B1 Lob 2/3 | |', 'A1 Smash 3/4 air W | |']]]},
    {id: 'PC1P', ok: (M, c, sp) => AB(M) && sp === 'A', w: .045, pre: ['A1 Volley 3/4 air | A=NN B=BB |', 'B2 Lob 1/7 | | Lob over Brey', 'A2 Lob 2/5 | A2=1,7.4@.75 A1=3,4@.15 B=NN@.2 | Brey turns late (0.75 s); Albón has already dropped back alone'],
      ends: [[.7, ['B1 Volley 3/7 air | |', 'A2 Lob 1.6/5 | |', 'B2 Smash 2/6 air W | |']], [.3, ['B1 Lob 1.6/5 | B=BB@.2 A=NN@.2 |', 'A1 Volley 4/4 air W | |']]]},
    {id: 'PC1C', ok: (M, c, sp) => AB(M) && sp === 'A', w: .045, pre: ['A1 Volley 3/4 air | A=NN B=BB |', 'B2 Lob 1/7 | | Lob over Brey', 'A2 Lob 2/5 | A2=1,7.4@.2 A1=3,4@.25 B=NN@.2 | Brey and Albón turn and retreat together'],
      ends: [[.65, ['B1 Lob 1.6/5 | B=BB@.2 A=NN@.2 | Both back in time; they regain the net', 'A1 Volley 4/4 air W | |']], [.35, ['B1 Volley 3/7 air | |', 'A2 Lob 1.6/5 | |', 'B2 Smash 2/6 air W | |']]]},
    {id: 'PC2F', ok: (M, c, sp) => AB(M) && sp === 'B', w: .03, pre: ['B1 Volley 5.5/5 air | A=NN B=NN | Volley through the middle', 'A1 Volley 3/6 air | A1=6.4,4.6 | Albón takes the middle ball on his forehand'],
      ends: [[.6, ['B2 Lob 1.6/3 | |', 'A1 Smash 3/5 air W | |']], [.4, ['B2 Volley 4/7 air W | |']]]},
    {id: 'PC2B', ok: (M, c, sp) => AB(M) && sp === 'B', w: .03, pre: ['B1 Volley 2/5 air | A=BB B=NN | Deep volley through the middle', 'A2 Lob 1.4/3 | A2=1.6,5.4 | Brey takes it from the back'],
      ends: [[.5, ['B1 Smash 2/3 air W | |']], [.5, ['B1 Lob 2/6 | B=BB@.2 A=NN@.2 |', 'A2 Volley 4/5 air W | |']]]},
    {id: 'LP3C', ok: (M, c, sp) => M.A.id === 'AC' && sp === 'B', w: .11, pre: ['B1 Volley 5.5/5 air | A=NN B=NN | Ball through the middle', 'A2 Volley 3/3 air | A2=6.4,5.4 | Casal takes the middle'],
      ends: [[.55, ['B2 Lob 1.6/3 | |', 'A1 Smash 3/5 air W | |']], [.45, ['B2 Volley 4/7 air W | |']]]},
    {id: 'LP2E', ok: (M, c, sp) => ALB(M) && sp === 'A' && M.day < 152, w: .035, pre: ['A1 Volley 3/3 air | A=NN B=BB |', 'B1 Lob 2/3 | |', 'A1 Bandeja 2.2/5 air | A1=5,3@.2 | Albón’s bandeja from 5 m', 'B2 Volley 3.5/3 air | A1=4.6,3.4@.45 | Albón is still more than 2 m short of his net position'],
      ends: [[.6, ['A1 Volley 2/5 air | |', 'B1 Lob 1/3 | |', 'A2 Lob 2/5 | A=BB@.2 B=NN |', 'B1 Smash 2/3 air W | |']], [.4, ['A1 Volley 4/5 air W | |']]]},
    {id: 'LP2L', ok: (M, c, sp) => ALB(M) && sp === 'A' && M.day >= 152, w: .035, pre: ['A1 Volley 3/3 air | A=NN B=BB |', 'B1 Lob 2/3 | |', 'A1 Bandeja 2.2/5 air | A1=5,3@.2 | Albón’s bandeja from 5 m', 'B2 Volley 3.5/3 air | A1=6.6,2.9@.1 | Albón is already back at his net position'],
      ends: [[.62, ['A1 Volley 4/5 air W | |']], [.38, ['A1 Volley 2/5 air | |', 'B1 Lob 1/3 | |', 'A2 Lob 2/5 | |', 'B1 Smash 2/3 air W | |']]]},
    {id: 'LP1', ok: (M, c, sp) => ALB(M) && sp === 'B', w: .03, pre: ['B1 Chiquita 6.5/3 | A=NN B=BB | Low ball at Albón’s feet'],
      ends: [[.6, ['A1 Volley - air E | A1=6.4,3 | Albón’s low volley goes into the net']], [.4, ['A1 Block 6/5 air | A1=6.4,3 |', 'B2 Lob 1.6/3 | |', 'A1 Bandeja 2/5 air W | |']]]},
    {id: 'DI1L', ok: (M, c, sp) => ALB(M) && sp === 'B', w: .03, pre: ['B1 Volley 2.4/3 air | A=BB B=NN |', 'A1 Lob 1.2/6 | | Albón lobs over {B2}', 'B2 Lob 3/4 | B2=1,7.6@.1 B1=3.8,3@.3 A=NN@.2 | They are pushed back; Albón and his partner advance'],
      ends: [[.65, ['A2 Volley 4/5 air | |', 'B1 Lob 2.6/3 | |', 'A1 Smash 3/5 air W | |']], [.35, ['A2 Volley 4/5 air | |', 'B1 Chiquita 6.4/3 | |', 'A1 Volley - air E | |']]]},
    {id: 'DI1C', ok: (M, c, sp) => ALB(M) && sp === 'B', w: .03, pre: ['B1 Volley 2.4/3 air | A=BB B=NN |', 'A1 Chiquita 6.4/4 | | Albón plays a chiquita', 'B1 Volley 2/3 air | B1=6.2,3.4 | They stay at the net and volley deep again'],
      ends: [[.62, ['A2 Lob 1.8/5 | | Still both back', 'B2 Smash 2/6 air W | |']], [.38, ['A2 Lob 1/7 | |', 'B2 Lob 3/5 | B=BB A=NN@.2 |', 'A1 Volley 4/5 air W | |']]]},
    {id: 'DI2S', ok: (M, c, sp) => ALB(M) && sp === 'A', w: .03, pre: ['A2 Volley 3/4 air | A=NN B=BB |', 'B1 Lob 1.2/3 | | Deep lob over Albón', 'A1 Smash 2.5/6 air | A1=4.6,2.6@.2 | Albón smashes from 4.6 m', 'B2 Lob 3/5 gl | B2=0.6,7 | The smash comes back off the glass'],
      ends: [[.76, ['A2 Volley 4/7 air | |', 'B1 Chiquita 6.4/3 | B=NN@.25 |', 'A1 Volley - air E | |']], [.24, ['A2 Smash 3/6 air W | A2=6.2,7 |']]]},
    {id: 'DI2B', ok: (M, c, sp) => ALB(M) && sp === 'A', w: .03, pre: ['A2 Volley 3/4 air | A=NN B=BB |', 'B1 Lob 1.2/3 | | Deep lob over Albón', 'A1 Bandeja 2/7 air | A1=4.8,2.8@.2 | Albón plays a bandeja instead', 'B2 Lob 2.6/4 | |'],
      ends: [[.72, ['A1 Volley 4/5 air | A1=6.4,3 | He is back at the net for the next ball', 'B1 Lob 2.6/4 | |', 'A2 Smash 3/5 air W | |']], [.28, ['A1 Volley 4/5 air | A1=6.4,3 |', 'B1 Lob 1/7 | |', 'A2 Lob 2/5 | |', 'B2 Smash 2/6 air W | |']]]},
    {id: 'DI3T', ok: (M, c, sp) => ALB(M) && sp === 'A', w: .03, pre: ['A2 Volley 4.4/9.4 air | A=NN B=NN |', 'B2 Volley 4/3 air | B2=4.4,9.6@.05 | {B2} has been pulled wide', 'A1 Volley 5/9 air | A1=6.4,3 | Albón hits back towards {B2}'],
      ends: [[.6, ['B2 Volley 3/6 air | B2=5.6,8.4 | {B2} reaches it', 'A2 Lob 2/5 | A2=4,7 |', 'B1 Smash 2/3 air W | |']], [.4, ['B2 Volley - air E | |']]]},
    {id: 'DI3A', ok: (M, c, sp) => ALB(M) && sp === 'A', w: .03, pre: ['A2 Volley 4.4/9.4 air | A=NN B=NN |', 'B2 Volley 4/3 air | B2=4.4,9.6@.05 | {B2} has been pulled wide', 'A1 Volley 5.5/1.4 air | A1=6.4,3 | Albón hits away from him, to the open side'],
      ends: [[.7, ['B1 Volley - air E | B1=6,1.2@.1 | {B1} stretches and misses']], [.3, ['B1 Volley 3/3 air | B1=6,1.4 |', 'A1 Lob 1.4/6 | |', 'B2 Smash 2/5 air W | |']]]},
    {id: 'SP1L', ok: (M, c, sp) => ALB(M) && sp === 'B' && c.imp, w: .4, pre: ['B1 Volley 2.4/3 air | A=BB B=NN |', 'A1 Lob 1.2/6 | | On the important point Albón lobs over {B2}'],
      ends: [[.62, ['B2 Lob 3/4 | B2=1,7.6@.1 B1=3.8,3@.3 A=NN@.2 | They are pushed back; Albón and his partner advance', 'A2 Volley 4/5 air | |', 'B1 Lob 2.6/3 | |', 'A1 Smash 3/5 air W | |']], [.38, ['B2 Bandeja 2.4/4 air | B2=4.8,7.4 |', 'A1 Lob 1.6/6 | |', 'B2 Smash 2/5 air W | |']]]},
    {id: 'SP5S', ok: (M, c, sp) => ALB(M) && sp === 'A' && c.conLost >= 2, w: .16, pre: ['A2 Volley 3/4 air | A=NN B=BB |', 'B1 Lob 2.4/3 | |', 'A1 Smash 2.5/5 air | A1=5.4,3 | Albón goes for the smash'],
      ends: [[.5, ['B2 Lob 2/5 gl | |', 'A2 Volley - air E | |']], [.5, ['B2 Volley - air E | |']]]},
    {id: 'TE2L', ok: (M, c, sp) => ALB(M) && sp === 'A', w: .03, pre: ['A2 Volley 3/4 air | A=NN B=BB |', 'B1 Lob 1.8/3 | | Lob over Albón'],
      ends: [[.55, ['A1 Bandeja - air E | A1=4.2,3@.55 | Albón starts moving back 0.55 s after the lob: late contact, into the net']], [.45, ['A1 Bandeja 2.2/5 air | A1=4.2,3@.55 | Albón starts late (0.55 s) but gets it back', 'B2 Lob 2/4 | |', 'A1 Volley 4/5 air W | |']]]},
    {id: 'TE2E', ok: (M, c, sp) => ALB(M) && sp === 'A', w: .03, pre: ['A2 Volley 3/4 air | A=NN B=BB |', 'B1 Lob 1.8/3 | | Lob over Albón'],
      ends: [[.88, ['A1 Bandeja 2.2/5 air | A1=4.4,3@.12 | Albón turns at once (0.12 s) and is set before contact', 'B2 Lob 2.4/4 | |', 'A1 Smash 3/5 air W | |']], [.12, ['A1 Bandeja - air E | A1=4.4,3@.12 |']]]},
    {id: 'TE4D', ok: (M, c, sp) => ALB(M) && sp === 'A', w: .025, pre: ['A2 Volley 3/4 air | A=NN B=BB |', 'B1 Lob 1.6/3 | |'],
      ends: [[.6, ['A1 Víbora - air E | A1=4.6,3@.15 | Víbora from 4.6 m: into the net']], [.4, ['A1 Víbora 2/8 air | A1=4.6,3@.15 | Víbora from 4.6 m', 'B2 Lob 2/4 | |', 'A1 Volley 4/5 air W | |']]]},
    {id: 'TE4F', ok: (M, c, sp) => ALB(M) && sp === 'A', w: .025, pre: ['A2 Volley 3/4 air | A=NN B=BB |', 'B1 Lob 2.6/3 | |'],
      ends: [[.86, ['A1 Víbora 2/8.6 air | A1=5.8,3@.1 | Víbora from 5.8 m', 'B2 Lob 3/5 gl | |', 'A2 Smash 3/5 air W | |']], [.14, ['A1 Víbora - air E | A1=5.8,3 |']]]},
    {id: 'TE6S', ok: (M, c, sp) => ALB(M) && sp === 'B', w: .025, pre: ['B1 Lob 0.6/1.4 | A=NN B=NN | Deep lob into Albón’s corner'],
      ends: [[.58, ['A1 Bajada - sg E | A1=0.8,1@.15 | Off the back and side glass Albón rushes a bajada']], [.42, ['A1 Bajada 3/5 sg | A1=0.8,1@.15 | Off the back and side glass', 'B2 Volley 3/6 air | |', 'A2 Lob 2/5 | |', 'B1 Smash 2/3 air W | |']]]},
    {id: 'TE6B', ok: (M, c, sp) => ALB(M) && sp === 'B', w: .025, pre: ['B1 Lob 0.8/2.8 | A=NN B=NN | Deep lob over Albón'],
      ends: [[.88, ['A1 Lob 2/5 gl | A1=0.6,2.6@.15 | Albón waits for the back-glass rebound and lobs', 'B2 Lob 2/6 | B=BB@.2 |', 'A1 Volley 4/5 air W | |']], [.12, ['A1 Lob - gl E | A1=0.6,2.6 |']]]}];
  const WMUL = 2.4;
  function scnRally(M, c) { const sp = M.A.players.includes(c.srv) ? 'A' : 'B', order = SCN.slice().sort(() => R() - .5);
    for (const s of order) { if (!s.ok(M, c, sp) || !ch(Math.min(.7, s.w * WMUL))) continue; const tot = s.ends.reduce((a, e) => a + e[0], 0); let x = R() * tot, e = s.ends[0]; for (const q of s.ends) { x -= q[0]; if (x <= 0) { e = q; break; } }
      const res = buildRally(M, c, (s.pre[0].startsWith('S Serve') ? [] : preamble(M, c)).concat(s.pre, e[1])); res.scn = s.id; return res; }
    return null; }

  const MATCHES = [];
  function simMatch(o) {
    const {id, a, b, date, day, event, round, ei} = o, M = {id, A: PAIRS[a], B: PAIRS[b], date, day, event, round, ei, ws: o.ws, draw: o.draw, tie: o.tie || null, slot: round === 'Final' ? 6 : round === 'Semi-final' ? 4 : 0, rallies: [], sets: []};
    const order = ch(.5) ? [M.A.players[0], M.B.players[0], M.A.players[1], M.B.players[1]] : [M.B.players[0], M.A.players[0], M.B.players[1], M.A.players[1]];
    let setsW = {A: 0, B: 0}, set = 1, gi = 0, tm = 0, conLost = 0, rid = 0;
    while (setsW.A < 2 && setsW.B < 2) {
      const g = {A: 0, B: 0};
      while (true) {
        const srv = order[gi % 4], sp = M.A.players.includes(srv) ? 'A' : 'B', rp = sp === 'A' ? 'B' : 'A';
        const pts = {A: 0, B: 0}; let pno = 0;
        while (true) {
          const pa = pts[sp], pb = pts[rp], rcvPair = M[rp].players, rcv = (pa + pb) % 2 === 0 ? rcvPair[1] : rcvPair[0];
          const golden = pa === 3 && pb === 3, gameFor = k => pts[k] >= 3 && (pts[k] > pts[k === 'A' ? 'B' : 'A'] || golden);
          const bp = gameFor(rp), setFor = k => gameFor(k) && ((g[k] + 1 >= 6 && g[k] + 1 - g[k === 'A' ? 'B' : 'A'] >= 2) || g[k] + 1 === 7);
          const ctx = {srv, rcv, pa, pb, set, conLost, imp: bp || golden || setFor('A') || setFor('B')};
          const sim = scnRally(M, ctx) || simRally(M, ctx);
          const r = {id: id + '-r' + String(++rid).padStart(3, '0'), mid: id, set, game: g.A + g.B + 1, gamesBefore: {A: g.A, B: g.B}, pointNo: ++pno, pts: {A: pts.A, B: pts.B}, srv, srvPair: sp, rcv,
            imp: bp || golden || setFor('A') || setFor('B'), breakPt: bp, golden, setPt: setFor('A') ? 'A' : setFor('B') ? 'B' : null, conLost, t0: Math.round(tm), tracked: ch(.96), ...sim};
          r.shots.forEach((s, i) => { s.id = r.id + '-s' + i; s.rid = r.id; });
          M.rallies.push(r); tm += sim.dur + 22; conLost = r.winner === 'A' ? 0 : conLost + 1;
          pts[r.winner]++;
          const w = r.winner, l = w === 'A' ? 'B' : 'A';
          if ((golden) || (pts[w] >= 4 && pts[w] - pts[l] >= 1 && (pts[w] >= 4))) { if (golden || pts[w] >= 4) { g[w]++; break; } }
        }
        gi++; if ((g.A + g.B) % 2 === 1) tm += 90;
        if ((g.A >= 6 || g.B >= 6) && Math.abs(g.A - g.B) >= 2 || g.A === 7 || g.B === 7) break;
      }
      M.sets.push([g.A, g.B]); setsW[g.A > g.B ? 'A' : 'B']++; set++; tm += 120;
    }
    M.nsets = M.sets.length; M.winner = setsW.A > setsW.B ? 'A' : 'B'; M.score = M.sets.map(s => s.join('-')).join(' '); M.secs = Math.round(tm);
    MATCHES.push(M); return M;
  }
  MDEF.forEach(d => { const [id, a, b, date, day, event, round, ei] = d; simMatch({id, a, b, date, day, event, round, ei, ws: 'PP', draw: 'Men'}); });
  WDEF.forEach(([id, a, b, event, eD, eM, ri, ei]) => simMatch({id, a, b, event, round: RNDS[ri], ei, ws: 'PP', draw: 'Women', ...dayAt(eD, eM, ri)}));
  const TIES = [];
  PPLDEF.forEach(([event, eD, eM, run], ei) => { for (let ri = 0; ri < 3; ri++) {
    const H = TEAMS.HOU, O = TEAMS[run[ri]], tid = 't' + ei + ri, dt = dayAt(eD, eM, ri), round = RNDS[ri];
    const ms = [['Men', H.men, O.men], ['Women', H.women, O.women], ['Mixed', H.mixed[ei % H.mixed.length], O.mixed[0]]].map(([draw, a, b], k) => simMatch({id: 'p' + ei + ri + k, a, b, event, round, ei, ws: 'PPL', draw, tie: tid, ...dt}));
    const wA = ms.filter(M => M.winner === 'A').length, T = {id: tid, ws: 'PPL', ei, event, round, slot: ri === 0 ? 0 : ri === 1 ? 4 : 6, ...dt, A: 'HOU', B: O.id, ms, wA, wB: 3 - wA, winner: wA >= 2 ? 'A' : 'B', score: wA + '–' + (3 - wA)};
    TIES.push(T); if (T.winner !== 'A') break; } });
  const TBY = {}; TIES.forEach(T => { TBY[T.id] = T; });
  const teamOfPair = (pid, M) => M && M.tie ? (M.A.id === pid ? 'HOU' : TBY[M.tie].B) : null;
  const MBY = {}; MATCHES.forEach(M => { MBY[M.id] = M; });

  // ---------- shared helpers ----------
  const oth = k => k === 'A' ? 'B' : 'A';
  const nm = pid => PLAYERS[pid] ? PLAYERS[pid].short : pid;
  const firstShot = (r, f) => { for (let i = 0; i < r.shots.length; i++) if (f(r.shots[i], i)) return i; return -1; };
  const inAir = s => !!s && !s.bounced;
  const respCat = s => !s ? 'Rally ended' : inAir(s) ? 'In the air' : 'After the bounce';
  const latName = (M, s) => { if (!s || !s.land) return 'Out or net'; const rec = M[oth(s.pair)].players, y = s.land[1]; if (Math.abs(y - 5) < 1) return 'Middle'; const left = s.pair === 'A' ? y > 5 : y < 5; return nm(left ? rec[0] : rec[1]) + '’s side'; };
  const band = dL => dL == null ? 'Out' : dL < 1.5 ? 'Deep' : dL < 3.05 ? 'Mid-court' : 'Forward';
  const netBy = (r, i, k, p = 'A') => { for (let j = i + 1; j <= Math.min(r.shots.length - 1, i + k); j++) if (r.shots[j].st[p] === 'net') return true; return false; };
  const lostSoon = (r, i, k) => r.winner === 'B' && r.shots.length - 1 <= i + k;
  const endKey = r => { const l = r.shots[r.shots.length - 1]; return l.pair + (l.outcome === 'error' ? 'E' : 'W'); };
  const ENDS = {AW: 'Our winner', BE: 'Their error', BW: 'Their winner', AE: 'Our error'};
  const stLbl = {net: 'Both forward', split: 'One forward', back: 'Both back'};
  const zoneOf = s => { if (!s || !s.land) return null; const recA = s.pair === 'B', y = s.land[1], lat = recA ? y : 10 - y, li = lat < 4 ? 0 : lat < 6 ? 1 : 2, bi = s.dL < 1.5 ? 0 : s.dL < 3.05 ? 1 : 2; return bi * 3 + li; };
  const homeDist = (s, M, pid) => { const k = M.A.players.includes(pid) ? 'A' : 'B', sl = M[k].players.indexOf(pid), hy = k === 'A' ? (sl ? 7.2 : 2.8) : (sl ? 2.8 : 7.2); return Math.hypot(s.dep[pid] - 7, s.pos[pid][1] - hy); };
  const typeOfPair = (s, p) => s && s.pair === p;
  const half = day => day < 152 ? 'Jan – May' : 'Jun – Oct';

  // ---------- modules ----------
  const MODULES = [
    {key: 'scout', name: 'Opponent scouting', where: 'Pairs → Scouting', tier: 'P0.1', subject: 'pair', purpose: 'Understand how a specific opposing pair responds, and build an evidence-backed match-preparation plan.'},
    {key: 'pattern', name: 'Tactical patterns', where: 'Pairs → Tactics → Patterns', tier: 'P0.2', subject: 'pair', purpose: 'Which recurring shot-and-movement sequences are followed by useful attacking or defensive outcomes.'},
    {key: 'coord', name: 'Pair coordination', where: 'Pairs → Coordination', tier: 'P0.3', subject: 'pair', purpose: 'How the two partners move together, and what their relative positions are followed by.'},
    {key: 'net', name: 'Net control & transitions', where: 'Pairs → Tactics → Net transitions', tier: 'P0.4', subject: 'pair', purpose: 'How the pair moves between deep defensive and forward attacking positions.'},
    {key: 'dev', name: 'Development', where: 'Players → Development', tier: 'P1.1', subject: 'player', purpose: 'What is changing in the player’s game across matches, opponents and partners.'},
    {key: 'dec', name: 'Decision-making', where: 'Players → Decisions → Choices', tier: 'P1.2', subject: 'player', purpose: 'The choices the player actually made in comparable game states, and what followed.'},
    {key: 'tech', name: 'Technical execution', where: 'Players → Technique', tier: 'P1.3', subject: 'player', purpose: 'Stroke execution in context: incoming ball, movement before contact and what happened next.'},
    {key: 'sit', name: 'Situational performance', where: 'Players → Decisions → Situations', tier: 'P1.4', subject: 'player', purpose: 'How observable behaviour differs across defined score and rally situations.'}];

  // ---------- engineering capability tags ----------
  const TAGS = {
    PT: '2D player tracking in court coordinates (calibrated broadcast camera, 25 fps or more)', BT: '2D ball contact and first-bounce localisation',
    B3: '3D ball trajectory (multi-camera or validated monocular lift)', SC: 'Shot classification and hitter attribution', BB: 'Volley vs after-bounce detection',
    GL: 'Glass and fence interaction detection', SV: 'Serve detection, service side, first or second serve', SF: 'Official point-by-point scoring feed alignment',
    PS: 'Court-position state derivation (both forward / one forward / both back)', ON: 'Movement onset timing per player', PO: '2D pose estimation',
    P3: '3D pose and racket tracking', EH: 'Winner / error labelling (forced vs unforced not used)', MH: 'Cross-match identity linking and history', PR: 'Partnership and lineup metadata',
    VS: 'Video–event time synchronisation', CO: 'Coach-entered intervention date and target behaviour'};
  const ST = {I: 'Integration required', M: 'Model development required', D: 'Additional data/camera input required', V: 'Research or validation required', N: 'Not yet assessed'};

  // ---------- 48 investigations ----------
  const SPECS = [];
  const S = (id, mod, viz, q, decision, sit, okL, find, o) => SPECS.push({id, mod, viz, q, decision, sit, okL, find, ...o});

  // P0.1 Opponent scouting (subject: our pair; X.opp is the scouted pair)
  S('OS1', 'scout', 'zones', 'How does each opponent respond when they receive a deep lob?', 'Where to aim the lob, and where to stand after it.',
    'Our lob, shot 2 or later, bouncing within 2.2 m of their back glass while at least one opponent is forward. First per rally.', 'Point won by us',
    (r, X) => { const i = firstShot(r, (s, i) => i >= 1 && s.pair === 'A' && s.type === 'Lob' && s.land && s.dL < 2.2 && s.st.B !== 'back'); if (i < 0 || !r.shots[i + 1]) return null; const s = r.shots[i], n = r.shots[i + 1];
      return {i, g: nm(n.actor), c: respCat(n), z: zoneOf(s), ok: r.winner === 'A', v: s.dL}; },
    {cmp: 'auto', gL: 'Receiving opponent', cL: 'How they played it', tags: ['PT', 'BT', 'SC', 'BB', 'PS', 'SF', 'VS'], st: 'M', val: 'Bounce depth error under 0.3 m against hand-annotated bounces; volley/after-bounce labels audited per receiver.', note: 'A destination with more lost points is not a weakness by itself; compare the response and the follow-up.'});
  S('OS2', 'scout', 'frames', 'When an opponent is moved wide or deep, what happens next?', 'Where to send the next attack.',
    'An opponent is 3 m or more from where he stood at our contact when he plays the ball. First per rally.', 'Point won by us',
    (r, X) => { const i = firstShot(r, (s, i) => { const n = r.shots[i + 1]; if (i < 2 || s.pair !== 'A' || !n) return false; const p = n.actor; return Math.hypot(n.pos[p][0] - s.pos[p][0], n.pos[p][1] - s.pos[p][1]) >= 3; }); if (i < 0) return null;
      const s = r.shots[i], n = r.shots[i + 1], p = n.actor, dx = Math.abs(n.dep[p] - s.dep[p]), dy = Math.abs(n.pos[p][1] - s.pos[p][1]);
      return {i, j: i + 1, g: dy >= dx ? 'Moved wide' : 'Moved deep', c: r.shots[i + 2] ? 'Next ball to ' + latName(X.M, n).replace('’s side', '') : 'Rally ended', ok: r.winner === 'A', v: Math.hypot(dx, dy), pid: p}; },
    {cmp: 'auto', gL: 'Displacement', cL: 'Their reply went to', tags: ['PT', 'BT', 'SC', 'PS', 'VS'], st: 'M', val: 'Player position error under 0.4 m; displacement threshold reviewed with coaches.', note: 'No open-space score is computed; the frames show the actual positions.'});
  S('OS3', 'scout', 'zones', 'Which serve and return combinations change where both pairs end up?', 'Serve placement and return preparation.',
    'Every point we serve against this pair. Serve direction from the first bounce, return type from the next shot.', 'Point won by us',
    (r, X) => { if (r.srvPair !== 'A') return null; const s = r.shots[0], n = r.shots[1]; return {i: 0, g: s.srv.num === 1 ? 'First serve' : 'Second serve', c: n ? (n.type === 'Return' ? 'Low return' : n.type + ' return') : 'Not returned', z: zoneOf(s), ok: r.winner === 'A', st3: r.shots[2] ? r.shots[2].st.A : null}; },
    {cmp: ['First serve', 'Second serve'], gL: 'Serve', cL: 'Their return', tags: ['SV', 'BT', 'SC', 'PT', 'PS', 'SF', 'VS'], st: 'M', val: 'Serve bounce within service box verified against line calls; first/second serve from scoring feed.', note: 'Compare within the same service side and server before drawing conclusions.'});
  S('OS4', 'scout', 'frames', 'How do they respond to low balls at their feet near the net?', 'When to use a chiquita or block to neutralise.',
    'Our chiquita or block bouncing more than 5 m from their glass while at least one opponent is forward. First per rally.', 'We reached the net within two shots',
    (r, X) => { const i = firstShot(r, (s, i) => i >= 1 && s.pair === 'A' && (s.type === 'Chiquita' || s.type === 'Block') && s.land && s.dL > 5 && s.st.B !== 'back'); if (i < 0) return null; const n = r.shots[i + 1];
      return {i, j: n ? i + 1 : i, g: n ? nm(n.actor) : 'Unreturned', c: n ? n.type : 'Winner', ok: !n ? true : netBy(r, i, 2) || r.winner === 'A' && r.shots.length - 1 <= i + 2}; },
    {cmp: 'auto', gL: 'Receiver', cL: 'Their reply', tags: ['PT', 'BT', 'SC', 'BB', 'PS', 'VS'], st: 'M', val: 'Ball height at contact is not measured; "at the feet" is never claimed. Bounce position audited.', note: 'Bounce position only; ball height at their contact is a proposed 3D capability.'});
  S('OS5', 'scout', 'sequence', 'Which shot sequences come before their mistakes?', 'Which attacking combinations to practise.',
    'The three shots before the last shot of each rally. Rallies ending in their error are compared with the same sequences that ended otherwise.', 'Rally ended in their error',
    (r, X) => { const L = r.shots.length; if (L < 4) return null; const seq = r.shots.slice(L - 4, L - 1); return {i: L - 2, c: seq.map(s => (s.pair === 'A' ? 'Our ' : 'Their ') + s.type.toLowerCase()).join(' → '), e: endKey(r), ok: endKey(r) === 'BE'}; },
    {gL: null, cL: 'Sequence', seq: true, tags: ['SC', 'BT', 'EH', 'SF', 'VS'], st: 'M', val: 'Shot-type accuracy per class above 90 % on audited rallies; error vs winner from scoring feed.', note: 'Forced and unforced errors are not separated: that label is not validated.'});
  S('OS6', 'scout', 'history', 'Does their response to our lobs change across sets and matches?', 'Prepare an alternative if they adjust.',
    'Our first lob of the rally with at least one opponent forward. Their response: in the air or after the bounce.', 'Took it in the air',
    (r, X) => { const i = firstShot(r, (s, i) => i >= 1 && s.pair === 'A' && s.type === 'Lob' && s.land && s.st.B !== 'back'); if (i < 0 || !r.shots[i + 1]) return null; const n = r.shots[i + 1]; return {i, g: r.set === 1 ? 'Set 1' : 'Sets 2–3', c: respCat(n), ok: inAir(n), w: r.winner === 'A'}; },
    {cmp: ['Set 1', 'Sets 2–3'], gL: 'Period', cL: 'Their response', tags: ['SC', 'BB', 'PT', 'PS', 'MH', 'SF'], st: 'M', val: 'Volley/after-bounce agreement with annotators above 95 %.', note: 'A change in behaviour is observed; intent is not inferred.'});

  // P0.2 Tactical patterns
  S('TP1', 'pattern', 'sequence', 'Which sequences come before our attacking overheads?', 'Which build-up combinations to rehearse.',
    'Our first smash or víbora from a forward position in a rally, and the three shots before it.', 'Point won by us',
    (r, X) => { const i = firstShot(r, (s, i) => i >= 3 && s.pair === 'A' && (s.type === 'Smash' || s.type === 'Víbora') && s.st.A !== 'back'); if (i < 0) return null; return {i, g: r.shots[i].type, c: r.shots.slice(i - 3, i).map(s => (s.pair === 'A' ? 'Our ' : 'Their ') + s.type.toLowerCase()).join(' → '), e: endKey(r), ok: r.winner === 'A'}; },
    {cmp: ['Smash', 'Víbora'], gL: 'Attack', cL: 'Build-up', seq: true, tags: ['SC', 'PT', 'PS', 'BT', 'SF', 'VS'], st: 'M', val: 'Overhead sub-type (smash / víbora / bandeja) audited by coaches.'});
  S('TP2', 'pattern', 'sequence', 'Which build-ups end in winners, errors or longer rallies?', 'When to keep constructing and when to finish.',
    'Rallies of five shots or more. Our first three shots after the serve and return define the build-up.', 'Point won by us',
    (r, X) => { if (r.shots.length < 5) return null; const ours = r.shots.filter((s, i) => i >= 2 && s.pair === 'A').slice(0, 3); if (ours.length < 2) return null; const fin = r.shots.slice(2, 9).some(s => s.pair === 'A' && s.type === 'Smash');
      return {i: ours[0].n, g: fin ? 'Went for the finish by shot 8' : 'Kept building', c: ours.map(s => s.type).join(' · '), e: endKey(r), ok: r.winner === 'A'}; },
    {cmp: ['Went for the finish by shot 8', 'Kept building'], gL: 'Approach', cL: 'Our build-up', seq: true, tags: ['SC', 'SF', 'EH', 'VS'], st: 'M', val: 'Sequence grouping reviewed with coaches; all endings shown, not only winners.'});
  S('TP3', 'pattern', 'sequence', 'What happens in the shots after our bandeja?', 'How to prepare the shot after a bandeja.',
    'Our first bandeja of the rally. Their reply and our next shot.', 'We kept the net (or won the point)',
    (r, X) => { const i = firstShot(r, s => s.pair === 'A' && s.type === 'Bandeja'); if (i < 0) return null; const s = r.shots[i], n = r.shots[i + 1], n2 = r.shots[i + 2];
      return {i, g: latName(X.M, s) === 'Middle' ? 'To the middle' : 'To a side', c: n ? 'Their ' + n.type.toLowerCase() : 'Ended on the bandeja', e: endKey(r), ok: n2 ? n2.st.A === 'net' : r.winner === 'A'}; },
    {cmp: ['To the middle', 'To a side'], gL: 'Bandeja direction', cL: 'Their reply', seq: true, tags: ['SC', 'BT', 'PT', 'PS', 'VS'], st: 'M', val: 'Bandeja vs víbora separation audited; direction from bounce position.'});
  S('TP4', 'pattern', 'sequence', 'Which sequences come before we lose our attacking position?', 'Which patterns need correcting.',
    'Rallies where both of us were forward at one of our contacts. Lost = one or both of us back at our next contact.', 'Point won by us',
    (r, X) => { let j = -1; for (let k = 2; k < r.shots.length; k++) { const s = r.shots[k]; if (s.pair === 'A' && s.st.A === 'net') { j = k; break; } } if (j < 0) return null; let lost = -1;
      for (let k = j + 2; k < r.shots.length; k += 2) { if (r.shots[k].pair === 'A' && r.shots[k].st.A !== 'net') { lost = k; break; } }
      if (lost < 0) return {i: j, g: 'Held the net', c: 'Held the net', e: endKey(r), ok: r.winner === 'A'};
      const a = r.shots[lost - 2], b = r.shots[lost - 1]; return {i: lost - 1, g: 'Lost the net', c: 'Our ' + a.type.toLowerCase() + ' → their ' + b.type.toLowerCase(), e: endKey(r), ok: r.winner === 'A'}; },
    {cmp: ['Held the net', 'Lost the net'], gL: 'Net position', cL: 'Sequence before losing it', seq: true, tags: ['PT', 'PS', 'SC', 'SF', 'VS'], st: 'M', val: 'Position-state threshold (5.5 m) reviewed against coach labels.'});
  S('TP5', 'pattern', 'dist', 'Does lob-and-advance work differently against different opponents?', 'Which patterns to use against which pair.',
    'Our lob from a back position. Advanced = both of us forward by our next contact.', 'Point won by us',
    (r, X) => { const i = firstShot(r, (s, i) => i >= 1 && s.pair === 'A' && s.type === 'Lob' && s.st.A !== 'net'); if (i < 0) return null; const n2 = r.shots[i + 2]; return {i, g: X.M.B.name, c: n2 ? (n2.st.A === 'net' ? 'Advanced' : 'Stayed back') : 'Rally ended', ok: r.winner === 'A'}; },
    {cmp: 'auto', gL: 'Opponent', cL: 'After the lob', allOpp: true, tags: ['SC', 'PT', 'PS', 'MH', 'SF', 'VS'], st: 'M', val: 'Comparable starting states checked per opponent; sample shown for each.'});
  S('TP6', 'pattern', 'history', 'What changes in our shot choice from the back between sets?', 'Between-set adjustment.',
    'Our first shot from a back position (under 4 m from our glass) in each rally, shot 2 or later.', 'Played a lob',
    (r, X) => { const i = firstShot(r, (s, i) => i >= 2 && s.pair === 'A' && s.dep[s.actor] < 4); if (i < 0) return null; const s = r.shots[i]; return {i, g: r.set === 1 ? 'Set 1' : 'Sets 2–3', c: s.type, ok: s.type === 'Lob', w: r.winner === 'A'}; },
    {cmp: ['Set 1', 'Sets 2–3'], gL: 'Set', cL: 'Shot from the back', tags: ['SC', 'PT', 'SF', 'VS'], st: 'M', val: 'Shot-type confusion matrix reviewed per class.', note: 'No adaptation score; only the observed change in shot choice.'});

  // P0.3 Pair coordination
  S('PC1', 'coord', 'paths', 'How do we retreat together when lobbed?', 'Who goes back first, and how.',
    'Their lob with both of us forward, and we let it bounce. Movement onset of each of us from their contact.', 'Point won by us',
    (r, X) => { const i = firstShot(r, (s, i) => { const n = r.shots[i + 1]; return i >= 1 && s.pair === 'B' && s.type === 'Lob' && s.st.A === 'net' && n && !inAir(n); }); if (i < 0) return null; const n = r.shots[i + 1], [p1, p2] = X.M.A.players, a = n.mv[p1], b = n.mv[p2]; if (!a || !b) return null;
      const gap = Math.abs(a.on - b.on); return {i, j: i + 1, g: gap <= .3 ? 'Together (within 0.3 s)' : 'Staggered (over 0.3 s)', c: (a.on <= b.on ? nm(p1) : nm(p2)) + ' moved first', v: gap, ok: r.winner === 'A'}; },
    {cmp: ['Together (within 0.3 s)', 'Staggered (over 0.3 s)'], gL: 'Retreat timing', cL: 'First to move', vL: 'Onset gap (s)', tags: ['PT', 'ON', 'SC', 'BB', 'VS'], st: 'V', val: 'Onset detection against frame-annotated movement starts; needs 50 fps.', note: 'A staggered retreat is not automatically wrong; watch who covers what.'});
  S('PC2', 'coord', 'paths', 'Who takes the balls through the middle?', 'Middle-ball responsibility.',
    'Their shot bouncing within 1 m of the centre line on our side. Who played the next shot.', 'Not lost within two shots',
    (r, X) => { const i = firstShot(r, (s, i) => i >= 1 && s.pair === 'B' && s.land && Math.abs(s.land[1] - 5) < 1); if (i < 0) return null; const n = r.shots[i + 1];
      return {i, j: n ? i + 1 : i, g: r.shots[i].st.A === 'net' ? 'We were forward' : r.shots[i].st.A === 'back' ? 'We were back' : 'One forward', c: n ? nm(n.actor) : 'Not reached', ok: !lostSoon(r, i, 2)}; },
    {cmp: ['We were forward', 'We were back'], gL: 'Our position', cL: 'Who took it', tags: ['PT', 'BT', 'SC', 'PS', 'VS'], st: 'M', val: 'Hitter attribution in the middle region audited (most confusable case).'});
  S('PC3', 'coord', 'paths', 'How do we shift sideways before they choose where to hit?', 'Lateral coverage.',
    'Our shot from shot 2 on. Our lateral spacing at their next contact, and where they sent the ball.', 'Point won by us',
    (r, X) => { const i = firstShot(r, (s, i) => i >= 2 && s.pair === 'A' && r.shots[i + 1]); if (i < 0) return null; const n = r.shots[i + 1], [p1, p2] = X.M.A.players, sep = Math.abs(n.pos[p1][1] - n.pos[p2][1]);
      return {i, j: i + 1, g: sep >= 4.5 ? 'Spaced 4.5 m or more' : 'Closer than 4.5 m', c: 'They hit to ' + latName(X.M, n).replace('’s side', ''), v: sep, ok: r.winner === 'A'}; },
    {cmp: ['Spaced 4.5 m or more', 'Closer than 4.5 m'], gL: 'Our spacing', cL: 'Their target', vL: 'Lateral spacing (m)', tags: ['PT', 'BT', 'SC', 'VS'], st: 'M', val: 'Lateral position error under 0.4 m.', note: 'Wide spacing is not treated as an error.'});
  S('PC4', 'coord', 'paths', 'How quickly does each of us recover after hitting at the net?', 'Recovery position and timing.',
    'Our volley, bandeja or víbora from a forward position. Still recovering = more than 1 m from the net base position at their next contact.', 'Point won by us',
    (r, X) => { const i = firstShot(r, (s, i) => i >= 2 && s.pair === 'A' && ['Volley', 'Bandeja', 'Víbora'].includes(s.type) && s.dep[s.actor] > 5 && r.shots[i + 1]); if (i < 0) return null; const s = r.shots[i], n = r.shots[i + 1], dd = homeDist(n, X.M, s.actor);
      return {i, j: i + 1, g: dd <= 1 ? 'Back in position' : 'Still recovering', c: nm(s.actor), v: dd, ok: r.winner === 'A', dt: n.t - s.t}; },
    {cmp: ['Back in position', 'Still recovering'], gL: 'At their contact', cL: 'Hitter', vL: 'Distance from base (m)', tags: ['PT', 'SC', 'ON', 'VS'], st: 'V', val: 'Base position definition agreed with coaches; time between contacts from synced video.'});
  S('PC5', 'coord', 'frames', 'When one of us is pulled wide or deep, how does the other cover?', 'Coverage responsibilities.',
    'One of us moves 2.5 m or more between the opponent’s contact and his own. Moved to the middle = the partner gets 1 m or more closer to the centre line in the same time.', 'Point won by us',
    (r, X) => { const i = firstShot(r, (s, i) => { if (i < 2 || s.pair !== 'A') return false; const pv = r.shots[i - 1], p = s.actor; return Math.hypot(s.pos[p][0] - pv.pos[p][0], s.pos[p][1] - pv.pos[p][1]) >= 2.5; }); if (i < 0) return null;
      const s = r.shots[i], p = s.actor, mate = X.M.A.players.find(x => x !== p), prev = r.shots[i - 1], toC = Math.abs(prev.pos[mate][1] - 5) - Math.abs(s.pos[mate][1] - 5);
      return {i: i - 1, j: i, g: toC >= 1 ? 'Partner moved to the middle' : 'Partner held his side', c: nm(p) + ' pulled', v: toC, ok: r.winner === 'A', pid: p}; },
    {cmp: ['Partner moved to the middle', 'Partner held his side'], gL: 'Partner response', cL: 'Displaced player', tags: ['PT', 'BT', 'SC', 'VS'], st: 'M', val: 'Displacement and centre-shift thresholds reviewed with coaches.'});
  S('PC6', 'coord', 'dist', 'Does Albón take a different share of middle balls with different partners?', 'Partner-specific preparation.',
    'Their shot bouncing within 1 m of the centre line on our side, in matches with each partner. Who played it.', 'Not lost within two shots',
    (r, X) => { const i = firstShot(r, (s, i) => i >= 1 && s.pair === 'B' && s.land && Math.abs(s.land[1] - 5) < 1); if (i < 0) return null; const n = r.shots[i + 1], mate = X.M.A.players.find(x => x !== 'alb');
      return {i, j: n ? i + 1 : i, g: 'With ' + nm(mate), c: !n ? 'Not reached' : n.actor === 'alb' ? 'Albón' : 'Partner', ok: !lostSoon(r, i, 2)}; },
    {cmp: ['With Brey', 'With Casal'], cmpCat: 'Albón', gL: 'Partner', cL: 'Who took it', athlete: 'alb', tags: ['PT', 'BT', 'SC', 'PR', 'MH', 'VS'], st: 'M', val: 'Playing side and opponent are not matched in this demo; compare within the same opponent before concluding.', note: 'No synergy rating.'});

  // P0.4 Net control & transitions
  S('NT1', 'net', 'states', 'Which of our lobs are followed by getting back to the net?', 'Lob and follow-up selection.',
    'Our lob from a back or split position. Recovered = both of us forward within the next three shots.', 'Both forward within three shots',
    (r, X) => { const i = firstShot(r, (s, i) => i >= 1 && s.pair === 'A' && s.type === 'Lob' && s.st.A !== 'net'); if (i < 0) return null; const s = r.shots[i];
      return {i, g: s.dL != null && s.dL < 1.5 ? 'Deep lob (under 1.5 m)' : 'Shorter lob', c: 'They played it ' + respCat(r.shots[i + 1]).toLowerCase(), ok: netBy(r, i, 3), w: r.winner === 'A'}; },
    {cmp: ['Deep lob (under 1.5 m)', 'Shorter lob'], gL: 'Lob depth', cL: 'Their response', tags: ['PT', 'PS', 'BT', 'SC', 'BB', 'VS'], st: 'M', val: 'Position-state labels audited against coach annotations.'});
  S('NT2', 'net', 'states', 'What pushes us off the net?', 'Net retention.',
    'Both of us forward at our contact, and not both forward at our next contact. The shot in between is theirs.', 'Point won by us',
    (r, X) => { let i = -1; for (let k = 2; k + 2 < r.shots.length; k++) { const a = r.shots[k], c = r.shots[k + 2]; if (a.pair === 'A' && a.st.A === 'net' && c.st.A !== 'net') { i = k + 1; break; } } if (i < 0) return null;
      const a = r.shots[i - 1]; return {i, g: latName(X.M, a) === 'Middle' ? 'Our shot to the middle' : 'Our shot to a side', c: 'Their ' + r.shots[i].type.toLowerCase(), ok: r.winner === 'A'}; },
    {cmp: ['Our shot to the middle', 'Our shot to a side'], gL: 'Our previous shot', cL: 'Their shot', tags: ['PT', 'PS', 'SC', 'BT', 'VS'], st: 'M', val: 'Position-state transitions verified on audited rallies.'});
  S('NT3', 'net', 'paths', 'When we advance together, does uneven timing matter?', 'Coordinated movement forward.',
    'Both of us back, we lob or chiquita and both move forward. Onset of each of us after our contact.', 'Both forward within three shots',
    (r, X) => { const i = firstShot(r, (s, i) => { const n = r.shots[i + 1]; return i >= 1 && s.pair === 'A' && (s.type === 'Lob' || s.type === 'Chiquita') && s.st.A === 'back' && n && X.M.A.players.every(p => n.mv[p] && n.mv[p].to > n.mv[p].from + 1.5); }); if (i < 0) return null;
      const n = r.shots[i + 1], [p1, p2] = X.M.A.players, gap = Math.abs(n.mv[p1].on - n.mv[p2].on); return {i, j: i + 1, g: gap <= .3 ? 'Together (within 0.3 s)' : 'Staggered (over 0.3 s)', c: stLbl[n.st.A], v: gap, ok: netBy(r, i, 3)}; },
    {cmp: ['Together (within 0.3 s)', 'Staggered (over 0.3 s)'], gL: 'Advance timing', cL: 'At their contact', vL: 'Onset gap (s)', tags: ['PT', 'ON', 'PS', 'SC', 'VS'], st: 'V', val: 'Onset detection validated at 50 fps.', note: 'Timing differences are not assumed to be poor play.'});
  S('NT4', 'net', 'states', 'Which returns are followed by us moving forward?', 'Return choice and follow-up.',
    'Points they serve. Our return type, and whether both of us are forward at our next contact.', 'Both forward at our next contact',
    (r, X) => { if (r.srvPair !== 'B' || !r.shots[1]) return null; const s = r.shots[1], n2 = r.shots[3]; return {i: 1, g: s.type === 'Lob' ? 'Lob return' : 'Low return', c: s.type, ok: !!n2 && n2.st.A === 'net', w: r.winner === 'A'}; },
    {cmp: ['Lob return', 'Low return'], gL: 'Return', cL: 'Return type', tags: ['SV', 'SC', 'PT', 'PS', 'SF', 'VS'], st: 'M', val: 'Return classification audited; serve side from scoring feed.'});
  S('NT5', 'net', 'dist', 'When lobbed at the net, what follows holding versus retreating?', 'Positioning choice under a lob.',
    'Their lob with both of us forward. Held = we took it in the air. Compared within the same lob-depth band.', 'Point won by us',
    (r, X) => { const i = firstShot(r, (s, i) => i >= 1 && s.pair === 'B' && s.type === 'Lob' && s.land && s.st.A === 'net' && r.shots[i + 1]); if (i < 0) return null; const s = r.shots[i], n = r.shots[i + 1];
      return {i, j: i + 1, g: inAir(n) ? 'Held (in the air)' : 'Retreated (after bounce)', c: band(s.dL), ok: r.winner === 'A'}; },
    {cmp: ['Held (in the air)', 'Retreated (after bounce)'], gL: 'Choice', cL: 'Lob depth', strat: true, tags: ['PT', 'BT', 'SC', 'BB', 'PS', 'VS'], st: 'M', val: 'Depth bands from bounce position; compare inside each band.', note: 'Not an estimate of what an unplayed choice would have produced.'});
  S('NT6', 'net', 'states', 'Which sequences take us from defending at the back to attacking?', 'Defence-to-attack drills.',
    'First of our contacts with both of us back and at least one of them forward. Recovered = both of us forward later in the rally.', 'Recovered the net',
    (r, X) => { const i = firstShot(r, (s, i) => i >= 2 && s.pair === 'A' && s.st.A === 'back' && s.st.B !== 'back'); if (i < 0) return null; const s = r.shots[i];
      return {i, g: s.type === 'Lob' ? 'Started with a lob' : 'Started with another shot', c: s.type, ok: netBy(r, i, 99), w: r.winner === 'A'}; },
    {cmp: ['Started with a lob', 'Started with another shot'], gL: 'First shot', cL: 'First shot type', tags: ['PT', 'PS', 'SC', 'VS'], st: 'M', val: 'Position-state progression verified per rally.', note: 'Being forward is not taken as proof of control.'});

  // P1.1 Development (subject: player)
  const P_ = (r, X) => X.pid;
  S('LP1', 'dev', 'history', 'Which situations keep producing errors, match after match?', 'Training priorities.',
    'The player’s first shot each rally in one of four situations: overhead from 5.5 m or deeper, low ball at the net, off the back glass, ball through the middle.', 'No error on that shot',
    (r, X) => { const p = X.pid; const cat = s => s.actor !== p ? null : OVER.includes(s.type) && s.dep[p] < 5.5 ? 'Overhead from deep' : s.mode === 'low' ? 'Low ball at the net' : s.glass ? 'Off the glass' : s.mid ? 'Middle ball' : null;
      const i = firstShot(r, s => !!cat(s)); if (i < 0) return null; const s = r.shots[i]; return {i, g: cat(s), c: cat(s), ok: s.outcome !== 'error'}; },
    {gL: 'Situation', cL: 'Situation', tags: ['SC', 'PT', 'GL', 'EH', 'MH', 'VS'], st: 'M', val: 'Situation definitions reviewed with coaches; per-match sample sizes shown.'});
  S('LP2', 'dev', 'history', 'Has the bandeja changed this season?', 'Evaluate improvement.',
    'The player’s first bandeja per rally, against a lob of similar depth. Success = no error and our pair still forward two shots later.', 'Kept the net, no error',
    (r, X) => { const p = X.pid, i = firstShot(r, s => s.actor === p && s.type === 'Bandeja'); if (i < 0) return null; const s = r.shots[i], n2 = r.shots[i + 2], inc = r.shots[i - 1];
      return {i, g: half(X.M.day), c: inc ? band(inc.dL) + ' lob' : '—', ok: s.outcome !== 'error' && (!n2 || n2.st.A === 'net')}; },
    {cmp: ['Jan – May', 'Jun – Oct'], gL: 'Period', cL: 'Incoming lob', strat: true, tags: ['SC', 'BT', 'PT', 'PS', 'MH', 'VS'], st: 'M', val: 'Conditioning on incoming depth is required before comparing periods.'});
  S('LP3', 'dev', 'dist', 'Does the player’s role change with a different partner?', 'Role allocation.',
    'Balls through the middle (within 1 m of the centre line) on the player’s side of the net. Who played them, by partner.', 'Not lost within two shots',
    (r, X) => { const p = X.pid, i = firstShot(r, (s, i) => i >= 1 && s.pair === 'B' && s.land && Math.abs(s.land[1] - 5) < 1); if (i < 0) return null; const n = r.shots[i + 1], mate = X.M.A.players.find(x => x !== p);
      return {i, j: n ? i + 1 : i, g: 'With ' + nm(mate), c: !n ? 'Not reached' : n.actor === p ? nm(p) : 'Partner', ok: !lostSoon(r, i, 2)}; },
    {cmp: 'auto', cmpCatSelf: true, gL: 'Partner', cL: 'Who took it', tags: ['PT', 'BT', 'SC', 'PR', 'MH', 'VS'], st: 'M', val: 'Needs at least two partners with comparable opponents.'});
  S('LP4', 'dev', 'dist', 'Does the player keep choosing the same shot when defending?', 'Tactical variation.',
    'The player’s first shot each rally from under 4 m with at least one opponent forward, split by what came before.', 'Point won by us',
    (r, X) => { const p = X.pid, i = firstShot(r, (s, i) => i >= 2 && s.actor === p && s.dep[p] < 4 && s.st.B !== 'back'); if (i < 0) return null; const inc = r.shots[i - 1];
      return {i, g: inc.type === 'Lob' ? 'After their lob' : ATT.includes(inc.type) ? 'After their attack' : 'After a neutral ball', c: r.shots[i].type, ok: r.winner === 'A'}; },
    {gL: 'Incoming ball', cL: 'Shot chosen', tags: ['SC', 'PT', 'PS', 'MH', 'VS'], st: 'M', val: 'Shot-class accuracy per situation.', note: 'No predictability score; the distribution is the observation.'});
  S('LP5', 'dev', 'paths', 'Has the player’s retreat under the lob changed?', 'Movement and positioning review.',
    'Their lob over the player while forward, which the player lets bounce. Movement onset after their contact.', 'Reached the ball and played it in',
    (r, X) => { const p = X.pid, i = firstShot(r, (s, i) => { const n = r.shots[i + 1]; return i >= 1 && s.pair === 'B' && s.type === 'Lob' && n && n.actor === p && !inAir(n) && s.dep[p] > 5; }); if (i < 0) return null; const n = r.shots[i + 1];
      return {i, j: i + 1, g: half(X.M.day), c: n.late ? 'Late to the ball' : 'In time', v: n.mv[p] ? n.mv[p].on : 0, ok: n.outcome !== 'error'}; },
    {cmp: ['Jan – May', 'Jun – Oct'], gL: 'Period', cL: 'Timing', vL: 'Onset (s)', tags: ['PT', 'ON', 'SC', 'BB', 'MH', 'VS'], st: 'V', val: 'Onset timing validated at 50 fps against annotations.'});
  S('LP6', 'dev', 'history', 'After the overhead training block, does the player take more lobs in the air?', 'Continue, revise or investigate the intervention.',
    'Their lob over the player while forward. Target behaviour: taken in the air. Compared before and after the coach-defined date.', 'Taken in the air',
    (r, X) => { const p = X.pid, i = firstShot(r, (s, i) => { const n = r.shots[i + 1]; return i >= 1 && s.pair === 'B' && s.type === 'Lob' && n && n.actor === p && s.dep[p] > 5; }); if (i < 0) return null; const n = r.shots[i + 1];
      return {i, j: i + 1, g: X.M.day >= X.ivDay ? 'After' : 'Before', c: respCat(n), ok: inAir(n), w: r.winner === 'A'}; },
    {cmp: ['Before', 'After'], gL: 'Intervention', cL: 'Response', iv: true, tags: ['SC', 'BB', 'PT', 'MH', 'CO', 'VS'], st: 'I', val: 'Pre/post comparison needs matched opponents and lob depths.', note: 'A change after the date does not show that the training caused it.'});

  // P1.2 Decision-making
  S('DI1', 'dec', 'dist', 'Lob or chiquita when defending: what followed each?', 'Shot-selection training.',
    'The player’s lob or chiquita with both of us back and at least one opponent forward.', 'Point won by us',
    (r, X) => { const p = X.pid, i = firstShot(r, (s, i) => i >= 2 && s.actor === p && (s.type === 'Lob' || s.type === 'Chiquita') && s.st.A === 'back' && s.st.B !== 'back'); if (i < 0) return null;
      return {i, g: r.shots[i].type, c: netBy(r, i, 2) ? 'We got forward' : 'Stayed back', ok: r.winner === 'A'}; },
    {cmp: ['Lob', 'Chiquita'], gL: 'Choice', cL: 'Two shots later', tags: ['SC', 'PT', 'PS', 'SF', 'VS'], st: 'M', val: 'Defensive-situation definition reviewed; opponents not matched in this demo.'});
  S('DI2', 'dec', 'frames', 'Smash or controlled overhead: what followed each?', 'Attacking risk.',
    'The player’s overhead on their lob. Smash compared with bandeja or víbora, within the same lob-depth band.', 'Point won by us',
    (r, X) => { const p = X.pid, i = firstShot(r, (s, i) => i >= 2 && s.actor === p && OVER.includes(s.type) && r.shots[i - 1].type === 'Lob'); if (i < 0) return null; const inc = r.shots[i - 1];
      return {i: i - 1, j: i, g: r.shots[i].type === 'Smash' ? 'Smash' : 'Bandeja or víbora', c: band(inc.dL) + ' lob', ok: r.winner === 'A'}; },
    {cmp: ['Smash', 'Bandeja or víbora'], gL: 'Overhead', cL: 'Incoming lob', strat: true, tags: ['SC', 'BT', 'PT', 'SF', 'VS'], st: 'M', val: 'Overhead sub-type audited.', note: 'No expected-win or optimal-shot values.'});
  S('DI3', 'dec', 'zones', 'Where does the player hit when an opponent is out of position?', 'Placement awareness.',
    'The player’s shot when an opponent is 2.5 m or more from his base position. Where the ball bounced.', 'Point won by us',
    (r, X) => { const p = X.pid, i = firstShot(r, (s, i) => i >= 2 && s.actor === p && s.land && X.M.B.players.some(q => homeDist(s, X.M, q) >= 2.5)); if (i < 0) return null; const s = r.shots[i], q = X.M.B.players.slice().sort((a, b) => homeDist(s, X.M, b) - homeDist(s, X.M, a))[0];
      const ln = latName(X.M, s); return {i, g: 'Displaced: ' + nm(q), c: ln === 'Middle' ? 'Middle' : ln.startsWith(nm(q)) ? 'Towards the displaced player' : 'Away from him', z: zoneOf(s), ok: r.winner === 'A'}; },
    {gL: 'Displaced opponent', cL: 'Direction', tags: ['PT', 'BT', 'SC', 'VS'], st: 'M', val: 'Base positions per state agreed with coaches.', note: 'An unplayed direction is never scored.'});
  S('DI4', 'dec', 'frames', 'After lobbing, does the player advance or stay back, and what follows?', 'Post-shot positioning.',
    'The player’s lob from a back position. Advanced = more than 5 m from his glass at their next contact.', 'Point won by us',
    (r, X) => { const p = X.pid, i = firstShot(r, (s, i) => i >= 1 && s.actor === p && s.type === 'Lob' && s.dep[p] < 4 && r.shots[i + 1]); if (i < 0) return null; const n = r.shots[i + 1];
      return {i, j: i + 1, g: n.dep[p] > 5 ? 'Advanced' : 'Stayed back', c: band(r.shots[i].dL) + ' lob', ok: r.winner === 'A'}; },
    {cmp: ['Advanced', 'Stayed back'], gL: 'Movement', cL: 'Lob depth', strat: true, tags: ['PT', 'BT', 'SC', 'ON', 'VS'], st: 'M', val: 'Positions at the next contact need synced tracking.'});
  S('DI5', 'dec', 'sequence', 'Which choice under attack keeps being followed by lost points?', 'Targeted tactical practice.',
    'The player’s shot from the back straight after their smash, víbora or bajada. What he chose and how the rally ended.', 'Point won by us',
    (r, X) => { const p = X.pid, i = firstShot(r, (s, i) => i >= 2 && s.actor === p && ATT.includes(r.shots[i - 1].type) && s.dep[p] < 4); if (i < 0) return null; return {i, g: r.shots[i].type, c: r.shots[i].type, e: endKey(r), ok: r.winner === 'A'}; },
    {cmp: 'worst', gL: 'Choice', cL: 'Choice', seq: true, tags: ['SC', 'PT', 'EH', 'SF', 'VS'], st: 'M', val: 'Attack classification audited; alternatives shown are only those actually played.'});
  S('DI6', 'dec', 'dist', 'At the net against a low ball, how varied is the player’s reply?', 'Tactical variety.',
    'The player at the net receiving their chiquita or block. Split by whether both opponents are forward.', 'Not lost within two shots',
    (r, X) => { const p = X.pid, i = firstShot(r, (s, i) => i >= 2 && s.actor === p && s.mode === 'low'); if (i < 0) return null; const s = r.shots[i];
      return {i, g: s.st.B === 'net' ? 'Both opponents forward' : 'At least one back', c: s.type, ok: !lostSoon(r, i, 2)}; },
    {gL: 'Opponents', cL: 'Reply', tags: ['SC', 'BT', 'PT', 'PS', 'VS'], st: 'M', val: 'Low-ball definition uses bounce position only.'});

  // P1.3 Technique (video-first)
  S('TE1', 'tech', 'stroke', 'How does contact position vary on the bandeja?', 'Stroke preparation.',
    'The player’s bandejas, grouped by how far from his glass he made contact. Contact height is not measured.', 'No error',
    (r, X) => { const p = X.pid, i = firstShot(r, s => s.actor === p && s.type === 'Bandeja'); if (i < 0) return null; const s = r.shots[i]; return {i, g: s.dep[p] >= 6 ? 'Contact 6 m or more from glass' : 'Contact under 6 m', c: band(r.shots[i - 1] ? r.shots[i - 1].dL : null) + ' lob', v: s.dep[p], ok: s.outcome !== 'error'}; },
    {cmp: 'auto', gL: 'Contact depth', cL: 'Incoming lob', vL: 'Contact depth (m)', tags: ['PT', 'SC', 'PO', 'P3', 'B3', 'VS'], st: 'D', val: 'Contact height needs calibrated multi-camera or validated 3D pose; only court position is used here.'});
  S('TE2', 'tech', 'stroke', 'How does the overhead go when the player has to move back first?', 'Footwork and preparation drills.',
    'The player’s overhead after moving 1.5 m or more back between their contact and his.', 'No error',
    (r, X) => { const p = X.pid, i = firstShot(r, s => s.actor === p && OVER.includes(s.type) && s.mv[p] && s.mv[p].from - s.mv[p].to >= 1.5); if (i < 0) return null; const m = r.shots[i].mv[p], d = m.from - m.to;
      return {i, g: d >= 2.5 ? 'Moved back 2.5 m or more' : 'Moved back 1.5–2.5 m', c: r.shots[i].type, v: d, ok: r.shots[i].outcome !== 'error'}; },
    {cmp: 'auto', gL: 'Movement before contact', cL: 'Overhead', vL: 'Distance moved (m)', tags: ['PT', 'ON', 'SC', 'PO', 'VS'], st: 'V', val: 'Stroke-phase timing needs pose; distance moved comes from tracking.'});
  S('TE3', 'tech', 'stroke', 'What differs between bandejas that keep the net and those that do not?', 'Bandeja coaching.',
    'The player’s bandejas. Successful = no error and our pair still forward two shots later.', 'Kept the net, no error',
    (r, X) => { const p = X.pid, i = firstShot(r, s => s.actor === p && s.type === 'Bandeja'); if (i < 0) return null; const s = r.shots[i], n2 = r.shots[i + 2], ok = s.outcome !== 'error' && (!n2 || n2.st.A === 'net');
      return {i, g: ok ? 'Successful' : 'Unsuccessful', c: latName(X.M, s) === 'Middle' ? 'To the middle' : 'To a side', v: s.dep[p], ok}; },
    {gL: 'Result', cL: 'Direction', vL: 'Contact depth (m)', ctxCmp: true, tags: ['PT', 'BT', 'SC', 'PO', 'P3', 'VS'], st: 'V', val: 'Pose overlays proposed; side-by-side video is the primary evidence.'});
  S('TE4', 'tech', 'stroke', 'What accompanies the player’s víbora errors?', 'Technique adjustments.',
    'The player’s víboras. Errors compared with víboras that stayed in play, by contact depth and incoming lob.', 'In play',
    (r, X) => { const p = X.pid, i = firstShot(r, s => s.actor === p && s.type === 'Víbora'); if (i < 0) return null; const s = r.shots[i]; return {i, g: s.outcome === 'error' ? 'Error' : 'In play', c: s.dep[p] < 5.2 ? 'Contact under 5.2 m' : 'Contact 5.2 m or more', v: s.dep[p], ok: s.outcome !== 'error'}; },
    {gL: 'Result', cL: 'Contact depth', vL: 'Contact depth (m)', ctxCmp: true, tags: ['PT', 'SC', 'PO', 'P3', 'B3', 'VS'], st: 'V', val: 'Joint angles are not claimed; would need validated 3D pose.', note: 'No joint angle is linked to an error.'});
  S('TE5', 'tech', 'stroke', 'Does overhead execution change between the first and the final set?', 'Technical consistency.',
    'The player’s overheads in the first set compared with the final set of the same matches.', 'No error',
    (r, X) => { const p = X.pid; if (X.M.nsets < 2 || (r.set !== 1 && r.set !== X.M.nsets)) return null; const i = firstShot(r, s => s.actor === p && OVER.includes(s.type)); if (i < 0) return null;
      return {i, g: r.set === 1 ? 'First set' : 'Final set', c: r.shots[i].type, v: r.shots[i].dep[p], ok: r.shots[i].outcome !== 'error'}; },
    {cmp: ['First set', 'Final set'], gL: 'Period', cL: 'Overhead', vL: 'Contact depth (m)', tags: ['SC', 'PT', 'PO', 'SF', 'VS'], st: 'V', val: 'Fatigue is not inferred.'});
  S('TE6', 'tech', 'stroke', 'How does the player play balls off the back glass?', 'Defensive technique drills.',
    'The player’s shot after the ball came off the back or side glass.', 'No error',
    (r, X) => { const p = X.pid, i = firstShot(r, s => s.actor === p && !!s.glass); if (i < 0) return null; const s = r.shots[i]; return {i, g: s.glass === 'side' ? 'Back and side glass' : 'Back glass only', c: s.type, ok: s.outcome !== 'error'}; },
    {cmp: 'auto', gL: 'Rebound', cL: 'Shot played', tags: ['GL', 'BT', 'PT', 'SC', 'B3', 'VS'], st: 'D', val: 'Bounce and glass ordering needs ball tracking through the rebound.'});

  // P1.4 Situational performance
  S('SP1', 'sit', 'dist', 'Does the player choose different shots on important points?', 'Important-point preparation.',
    'The player’s first shot from the back each rally. Important = break point, golden point or set point.', 'Played a lob',
    (r, X) => { const p = X.pid, i = firstShot(r, (s, i) => i >= 2 && s.actor === p && s.dep[p] < 4); if (i < 0) return null; return {i, g: r.imp ? 'Important points' : 'Other points', c: r.shots[i].type, ok: r.shots[i].type === 'Lob', w: r.winner === 'A'}; },
    {cmp: ['Important points', 'Other points'], gL: 'Score state', cL: 'Shot', tags: ['SF', 'SC', 'PT', 'VS'], st: 'I', val: 'Score states from the official feed.', note: 'Pressure or mental state is not inferred.'});
  S('SP2', 'sit', 'zones', 'Which serves and returns does the player use on important points?', 'Serve and return preparation.',
    'The player’s serves and returns. Important = break point, golden point or set point.', 'Point won by us',
    (r, X) => { const p = X.pid; const i = r.shots[0].actor === p ? 0 : r.shots[1] && r.shots[1].actor === p ? 1 : -1; if (i < 0) return null; const s = r.shots[i];
      return {i, g: r.imp ? 'Important points' : 'Other points', c: i === 0 ? 'Serve ' + s.srv.dir.toLowerCase() : (s.type === 'Return' ? 'Low return' : s.type + ' return'), z: zoneOf(s), ok: r.winner === 'A'}; },
    {cmp: ['Important points', 'Other points'], gL: 'Score state', cL: 'Serve or return', tags: ['SV', 'SF', 'BT', 'SC', 'VS'], st: 'I', val: 'Serve direction from bounce; needs service-box calibration.'});
  S('SP3', 'sit', 'states', 'When we can close the set, does our court position change?', 'Closing-set routines.',
    'Points where our pair can win the set, compared with other points. Our position at the player’s first contact after the return.', 'Both forward at that contact',
    (r, X) => { const p = X.pid, i = firstShot(r, (s, i) => i >= 2 && s.actor === p); if (i < 0) return null; return {i, g: r.setPt === 'A' ? 'Set point for us' : 'Other points', c: stLbl[r.shots[i].st.A], ok: r.shots[i].st.A === 'net', w: r.winner === 'A'}; },
    {cmp: ['Set point for us', 'Other points'], gL: 'Score state', cL: 'Our position', tags: ['SF', 'PT', 'PS', 'VS'], st: 'M', val: 'Set-point flags from the scoring feed; small samples expected.'});
  S('SP4', 'sit', 'dist', 'What changes in the player’s shots as rallies get longer?', 'Long-rally tactics.',
    'The player’s last shot of each rally, grouped by when in the rally it came.', 'No error on that shot',
    (r, X) => { const p = X.pid; let i = -1; for (let k = r.shots.length - 1; k >= 0; k--) if (r.shots[k].actor === p) { i = k; break; } if (i < 0) return null;
      return {i, g: i < 4 ? 'Shots 1–4' : i < 8 ? 'Shots 5–8' : 'Shot 9 or later', c: r.shots[i].type, ok: r.shots[i].outcome !== 'error'}; },
    {cmp: ['Shots 1–4', 'Shot 9 or later'], gL: 'Rally phase', cL: 'Shot', tags: ['SC', 'EH', 'SF', 'VS'], st: 'M', val: 'Rally length from event timeline.'});
  S('SP5', 'sit', 'history', 'After losing two points in a row, does the player’s overhead choice change?', 'In-match adjustment.',
    'The player’s first overhead in a rally. After two or more lost points in a row compared with other points.', 'Chose a smash',
    (r, X) => { const p = X.pid, i = firstShot(r, s => s.actor === p && OVER.includes(s.type)); if (i < 0) return null; return {i, g: r.conLost >= 2 ? 'After 2+ lost points' : 'Other points', c: r.shots[i].type, ok: r.shots[i].type === 'Smash', w: r.winner === 'A'}; },
    {cmp: ['After 2+ lost points', 'Other points'], gL: 'Before this point', cL: 'Overhead', tags: ['SF', 'SC', 'VS'], st: 'I', val: 'Point sequence from the scoring feed.', note: 'Frustration or pressure is not inferred.'});
  S('SP6', 'sit', 'history', 'Which of the player’s choices change between the start and end of matches?', 'Late-match preparation.',
    'The player’s first shot from the back each rally, first set compared with the final set.', 'Played a lob',
    (r, X) => { const p = X.pid; if (X.M.nsets < 2 || (r.set !== 1 && r.set !== X.M.nsets)) return null; const i = firstShot(r, (s, i) => i >= 2 && s.actor === p && s.dep[p] < 4); if (i < 0) return null;
      return {i, g: r.set === 1 ? 'First set' : 'Final set', c: r.shots[i].type, ok: r.shots[i].type === 'Lob', w: r.winner === 'A'}; },
    {cmp: ['First set', 'Final set'], gL: 'Period', cL: 'Shot', tags: ['SC', 'PT', 'SF', 'VS'], st: 'M', val: 'Fatigue is not inferred.'});

  const SPEC = {}; SPECS.forEach(s => { SPEC[s.id] = s; });

  // ---------- scope & analysis ----------
  const MIN = 10;
  const ztest = (w1, n1, w2, n2) => { if (n1 < MIN || n2 < MIN) return {ok: false}; const p = (w1 + w2) / (n1 + n2), se = Math.sqrt(p * (1 - p) * (1 / n1 + 1 / n2)); const z = se ? (w1 / n1 - w2 / n2) / se : 0; return {ok: true, sig: Math.abs(z) >= 1.96, z}; };
  const median = a => { const b = a.slice().sort((x, y) => x - y), n = b.length; return n ? (n % 2 ? b[(n - 1) / 2] : (b[n / 2 - 1] + b[n / 2]) / 2) : null; };
  const welch = (a, b) => { if (a.length < MIN || b.length < MIN) return {ok: false}; const m = x => x.reduce((s, v) => s + v, 0) / x.length, v = (x, mu) => x.reduce((s, y) => s + (y - mu) * (y - mu), 0) / (x.length - 1); const ma = m(a), mb = m(b), se = Math.sqrt(v(a, ma) / a.length + v(b, mb) / b.length); const t = se ? (ma - mb) / se : 0; return {ok: true, sig: Math.abs(t) >= 2, t}; };
  function scopeMatches(spec, sc) {
    const mod = MODULES.find(m => m.key === spec.mod);
    const ws = sc.ws || 'PP';
    return MATCHES.filter(M => {
      if (M.ws !== ws) return false;
      if (spec.athlete) { if (!M.A.players.includes(spec.athlete)) return false; }
      else if (mod.subject === 'pair') { if (M.A.id !== sc.pair) return false; }
      else if (!M.A.players.includes(sc.pid)) return false;
      if (sc.opp && sc.opp !== 'all' && !spec.allOpp && M.B.id !== sc.opp) return false;
      if (sc.period === 'last3') { const pool = MATCHES.filter(x => x.ws === ws).filter(x => spec.athlete ? x.A.players.includes(spec.athlete) : mod.subject === 'pair' ? x.A.id === sc.pair : x.A.players.includes(sc.pid)); if (pool.slice(-3).indexOf(M) < 0) return false; }
      if (sc.period === 'h1' && M.day >= 152) return false; if (sc.period === 'h2' && M.day < 152) return false;
      return true; });
  }
  const cache = {};
  function analyze(id, sc) {
    const spec = SPEC[id], key = id + JSON.stringify(sc); if (cache[key]) return cache[key];
    const ms = scopeMatches(spec, sc), occ = []; let total = 0, tracked = 0;
    ms.forEach(M => { const X = {M, pid: sc.pid, ivDay: sc.ivDay || INTERVENTION_DAY}; M.rallies.forEach(r => { total++; if (!r.tracked) return; tracked++; if (sc.set && sc.set !== 'all' && r.set !== +sc.set) return; const o = spec.find(r, X); if (o) occ.push({...o, r, M, key: r.id}); }); });
    occ.reverse();
    const N = occ.length, okN = occ.filter(o => o.ok).length;
    const tally = (keyFn, order) => { const m = {}; occ.forEach(o => { const k = keyFn(o); if (k == null) return; (m[k] = m[k] || {key: k, n: 0, ok: 0, occ: []}); m[k].n++; if (o.ok) m[k].ok++; m[k].occ.push(o); }); let arr = Object.values(m); arr.sort((a, b) => order ? order.indexOf(a.key) - order.indexOf(b.key) : b.n - a.n); return arr; };
    const groups = tally(o => o.g, Array.isArray(spec.cmp) ? spec.cmp.concat(Object.keys({})) : null), cats = tally(o => o.c);
    if (Array.isArray(spec.cmp)) groups.sort((a, b) => { const ia = spec.cmp.indexOf(a.key), ib = spec.cmp.indexOf(b.key); return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib) || b.n - a.n; });
    const cross = groups.map(g => ({key: g.key, n: g.n, cats: cats.map(c => { const xs = g.occ.filter(o => o.c === c.key); return {key: c.key, n: xs.length, ok: xs.filter(o => o.ok).length}; })}));
    const byMatch = ms.filter(M => occ.some(o => o.M === M)).map(M => { const xs = occ.filter(o => o.M === M); return {M, n: xs.length, ok: xs.filter(o => o.ok).length, groups: groups.map(g => { const ys = xs.filter(o => o.g === g.key); return {key: g.key, n: ys.length, ok: ys.filter(o => o.ok).length}; })}; });
    const zones = occ.some(o => o.z != null) ? Array.from({length: 9}, (_, z) => { const xs = occ.filter(o => o.z === z); return {z, n: xs.length, ok: xs.filter(o => o.ok).length}; }) : null;
    let fams = null; if (spec.seq) { const m = {}; occ.forEach(o => { const f = m[o.c] = m[o.c] || {key: o.c, n: 0, ok: 0, ends: {AW: 0, BE: 0, BW: 0, AE: 0}}; f.n++; if (o.ok) f.ok++; if (o.e) f.ends[o.e]++; }); fams = Object.values(m).sort((a, b) => b.n - a.n); }
    // comparison
    let A = null, B = null;
    if (spec.cmp === 'auto') { [A, B] = groups.slice(0, 2); }
    else if (spec.cmp === 'worst') { const big = cats.filter(c => c.n >= MIN); if (big.length >= 2) { const w = big.slice().sort((a, b) => a.ok / a.n - b.ok / b.n)[0]; A = w; const rest = occ.filter(o => o.c !== w.key); B = {key: 'All other choices', n: rest.length, ok: rest.filter(o => o.ok).length, occ: rest}; } }
    else if (Array.isArray(spec.cmp)) { A = groups.find(g => g.key === spec.cmp[0]); B = groups.find(g => g.key === spec.cmp[1]); }
    let cmp = null;
    if (A && B) {
      const catKey = spec.cmpCat || (spec.cmpCatSelf ? nm(sc.pid) : null);
      const val = g => catKey ? g.occ.filter(o => o.c === catKey).length : g.ok;
      cmp = {A: {key: A.key, n: A.n, w: val(A)}, B: {key: B.key, n: B.n, w: val(B)}, what: catKey ? 'share “' + catKey + '”' : spec.okL.toLowerCase(), t: ztest(val(A), A.n, val(B), B.n)};
      if (spec.vL) { const va = A.occ.map(o => o.v).filter(v => v != null), vb = B.occ.map(o => o.v).filter(v => v != null); cmp.v = {a: median(va), b: median(vb), t: welch(va, vb)}; }
    } else if (spec.ctxCmp && groups.length >= 2) {
      const [g1, g2] = groups; const va = g1.occ.map(o => o.v), vb = g2.occ.map(o => o.v);
      cmp = {A: {key: g1.key, n: g1.n, w: g1.ok}, B: {key: g2.key, n: g2.n, w: g2.ok}, ctx: true, what: spec.vL, v: {a: median(va), b: median(vb), t: welch(va, vb)}, t: {ok: false}};
    }
    // representatives: successes and failures from different matches
    const pickN = (xs, k) => { const out = [], used = new Set(); xs.forEach(o => { if (out.length < k && !used.has(o.M.id)) { out.push(o); used.add(o.M.id); } }); xs.forEach(o => { if (out.length < k && !out.includes(o)) out.push(o); }); return out; };
    const res = {spec, sc, ms, occ, N, okN, total, tracked, groups, cats, cross, byMatch, zones, fams, cmp, good: pickN(occ.filter(o => o.ok), 2), bad: pickN(occ.filter(o => !o.ok), 2)};
    return cache[key] = res;
  }
  const strengthOf = (nA, pA, nB, pB) => nA < 6 || nB < 5 ? 'few' : Math.abs(pA - pB) >= 25 ? 'clear' : Math.abs(pA - pB) >= 12 ? 'some' : 'little';
  const STL = {clear: 'Clear difference in the demo records', some: 'Some difference, not settled', little: 'Little difference between the groups', few: 'Too few examples to compare'};
  function verdict(an) {
    const c = an.cmp, pct = v => Math.round(v * 100);
    if (!an.N) return {title: 'No occurrences in this scope', text: 'Widen the opponent or period. The situation definition stays the same.', sig: false, k: 'few'};
    if (!c) return {title: 'Distribution', text: 'This view shows what was chosen; select a category to watch those rallies.', sig: false, k: 'little'};
    if (c.ctx) return {title: c.A.key + ' vs ' + c.B.key, text: c.what + ': median ' + (c.v.a || 0).toFixed(1) + ' against ' + (c.v.b || 0).toFixed(1) + '. Compare the paired examples on video.', sig: false, k: 'little'};
    const a = pct(c.A.w / Math.max(1, c.A.n)), b = pct(c.B.w / Math.max(1, c.B.n)), k = strengthOf(c.A.n, a, c.B.n, b);
    return {title: STL[k], text: c.A.key + ': ' + c.A.w + ' of ' + c.A.n + ' (' + a + ' %). ' + c.B.key + ': ' + c.B.w + ' of ' + c.B.n + ' (' + b + ' %). Descriptive counts from the demo records.', sig: k === 'clear', k};
  }
  // ---------- evidence: narration ----------
  const st2 = s => s === 'net' ? 'both forward' : s === 'back' ? 'both back' : 'one forward, one back';
  function narrate(M, r, i) {
    const out = [], P = id => nm(id), A = M.A.players, B = M.B.players;
    const line = (s) => { let t = P(s.actor) + ' played a' + (/^[AEIOUÁÉÍÓÚ]/.test(s.type) ? 'n ' : ' ') + s.type.toLowerCase() + (s.bounced && s.n > 0 ? ' after the bounce' : s.n > 0 ? ' in the air' : '') + (s.glass ? ' off the ' + (s.glass === 'side' ? 'side' : 'back') + ' glass' : '') + ', from ' + s.dep[s.actor].toFixed(1) + ' m off his glass';
      const ln = latName(M, s); t += s.land ? '. It bounced ' + s.dL.toFixed(1) + ' m from ' + (s.pair === 'A' ? 'their' : 'our') + ' glass, ' + (ln === 'Middle' ? 'through the middle' : 'on ' + ln) + '.' : (s.outcome === 'error' ? '. Error.' : '.');
      if (s.outcome === 'winner') t += ' Winner.'; return t; };
    const from = Math.max(0, i - 1), to = Math.min(r.shots.length - 1, i + 2);
    for (let k = from; k <= to; k++) { const s = r.shots[k]; out.push({n: k + 1, t: '+' + s.t.toFixed(1) + ' s', head: k === i ? 'Situation' : k < i ? 'Before' : k === i + 1 ? 'Response' : 'Next', text: line(s),
      pos: 'Positions: ' + A.map(p => P(p) + ' ' + s.dep[p].toFixed(1)).join(', ') + ' m (' + st2(s.st.A) + ') · ' + B.map(p => P(p) + ' ' + s.dep[p].toFixed(1)).join(', ') + ' m (' + st2(s.st.B) + ')',
      mv: Object.keys(s.mv).filter(p => Math.abs(s.mv[p].to - s.mv[p].from) >= 1.2).map(p => P(p) + (s.mv[p].to > s.mv[p].from ? ' moved forward ' : ' moved back ') + Math.abs(s.mv[p].to - s.mv[p].from).toFixed(1) + ' m, starting ' + s.mv[p].on.toFixed(1) + ' s after the previous contact').join(' · ')}); }
    const l = r.shots[r.shots.length - 1];
    out.push({n: r.shots.length, t: '', head: 'Point', text: 'Point to ' + M[r.winner].name + ' on shot ' + r.shots.length + ': ' + (l.outcome === 'winner' ? 'winner by ' : 'error by ') + P(l.actor) + '.', pos: '', mv: ''});
    return out;
  }


  // ---------- illustrative findings, each computed from the demo records ----------
  const S0 = o => o.r.shots[o.i], N1 = o => o.r.shots[o.i + 1], won = o => o.r.winner === 'A';
  const FINDINGS = [
    {id: 'F-OS1', inv: 'OS1', opp: 'DE', h: "Deep lobs into Durán’s backhand corner push both opponents back", hU: "Deep lobs to Durán’s corner: no consistent retreat", why: "With Durán at the glass, Esteve drops back to cover him, and Albón / Brey get the net without a fight.", PL: "Lob to Durán’s corner", CL: "Lob to Esteve’s corner", ML: "both opponents back at their reply", P: o => S0(o).dL < 1.4 && latName(o.M, S0(o)) === 'Durán’s side', C: o => S0(o).dL < 1.4 && latName(o.M, S0(o)) === 'Esteve’s side', M: o => !!N1(o) && N1(o).st.B === 'back', rep: "Durán played the ball from the glass and Esteve dropped back too in {mP} of {nP} deep lobs to Durán’s corner. We won {wP} of those points.", vary: "Deep lobs to Esteve’s corner: both back in {mC} of {nC}. Esteve usually took them in the air while Durán held the net. We won {wC}.", seq: "Our lob → Durán from the back glass → Esteve drops back → our overhead into the middle", coach: "Aim defensive lobs at Durán’s backhand corner, then advance together and attack the middle once both are back.", lim: "It shows what followed these lobs, not that the target caused it. Lob height and spin are not in the records."},
    {id: 'F-OS2', inv: 'OS2', opp: 'DE', h: "When Esteve is pulled wide, Durán stays on his side and the middle opens", hU: "Esteve pulled wide: the middle does not reliably open", why: "The ball through the middle after the wide one finishes the point, as long as Durán does not shift across.", PL: "Durán stayed on his side", CL: "Durán shifted to the middle", ML: "point won within two shots", P: o => o.pid === 'est' && S0(o).type === 'Volley' && o.r.shots[o.j].pos.est[1] < 1.3 && (() => { const q = o.r.shots[o.j + 1]; return !!q && q.pair === 'A' && !!q.land && Math.abs(q.land[1] - 5) < 1.5; })() && Math.abs(o.r.shots[o.j].pos.dur[1] - 5) >= 1.2, C: o => o.pid === 'est' && S0(o).type === 'Volley' && o.r.shots[o.j].pos.est[1] < 1.3 && (() => { const q = o.r.shots[o.j + 1]; return !!q && q.pair === 'A' && !!q.land && Math.abs(q.land[1] - 5) < 1.5; })() && Math.abs(o.r.shots[o.j].pos.dur[1] - 5) < 1.2, M: o => won(o) && o.r.shots.length - 1 <= o.j + 2, rep: "Esteve pulled wide and our next ball through the middle: with Durán still on his side we won within two shots in {mP} of {nP}.", vary: "When Durán shifted to the middle ({nC} rallies), we won within two shots in {mC}: his cover took the middle ball away.", seq: "Our wide volley → Esteve at the side glass → our volley through the middle", coach: "Rehearse wide-then-middle at the net, and check Durán’s position before choosing the middle.", lim: "Durán’s position is read at Esteve’s contact only."},
    {id: 'F-OS3', inv: 'OS3', opp: 'DE', h: "Wide serves to Durán come back as lobs; serves to the T come back low", hU: "Durán’s return does not depend clearly on serve direction", why: "It decides how fast the server should close: a lob pushes the serving pair back, a low return catches the server moving in.", PL: "Wide serve", CL: "Serve to the T", ML: "Durán returned with a lob", P: o => !!o.r.shots[1] && o.r.shots[1].actor === 'dur' && o.r.shots[0].srv.dir === 'Wide', C: o => !!o.r.shots[1] && o.r.shots[1].actor === 'dur' && o.r.shots[0].srv.dir === 'T', M: o => o.r.shots[1].type === 'Lob', rep: "Durán lobbed {mP} of {nP} wide serves.", vary: "Serving to the T, he lobbed {mC} of {nC} and mostly returned low at the server’s feet.", seq: "Serve → Durán’s return → serving pair’s first volley", coach: "Serving wide: expect the lob and close slower. Serving to the T: split-step early for the low return.", lim: "Serve speed and spin are not recorded."},
    {id: 'F-TP3', inv: 'TP3', h: "Brey’s bandeja to the middle is answered with a lob over Brey, and we lose the net", hU: "Bandeja direction makes little difference to keeping the net", why: "From the middle the opponents can lob straight back over Brey; from the side glass they can only block.", PL: "Brey’s bandeja to the middle", CL: "Brey’s bandeja to a side", ML: "no longer both forward at our next shot", P: o => (() => { const p = o.r.shots[o.i - 1]; return S0(o).actor === 'bre' && p.type === 'Lob' && p.dL >= 1.4 && p.dL <= 2.3 && S0(o).st.A === 'net'; })() && o.g === 'To the middle', C: o => (() => { const p = o.r.shots[o.i - 1]; return S0(o).actor === 'bre' && p.type === 'Lob' && p.dL >= 1.4 && p.dL <= 2.3 && S0(o).st.A === 'net'; })() && o.g === 'To a side', M: o => !(o.r.shots[o.i + 2] && o.r.shots[o.i + 2].st.A === 'net'), rep: "After a bandeja to the middle we had lost the net by our next shot in {mP} of {nP}.", vary: "After a bandeja to a side: {mC} of {nC}. The usual reply was a short block.", seq: "Our bandeja → their lob over Brey → Brey lets it bounce → both of us back", coach: "Practise the bandeja to the side glass, and Brey’s recovery step when it goes to the middle.", lim: "Direction from the bounce position; bandeja height and pace are not recorded."},
    {id: 'F-TP1', inv: 'TP1', h: "A chiquita that forces a short block sets up our winning víboras", hU: "The build-up before our overheads makes little difference", why: "The overhead comes from 5.8 m with the opponents still at the net, instead of from 4.4 m after a deep lob.", PL: "After chiquita → block", CL: "Straight after their deep lob", ML: "point won", P: o => { const s = o.r.shots[o.i - 2]; return S0(o).type === 'Víbora' && !!s && s.pair === 'A' && s.type === 'Chiquita'; }, C: o => { const p = o.r.shots[o.i - 1]; return S0(o).type === 'Víbora' && p.type === 'Lob' && p.dL != null && p.dL < 1.2; }, M: won, rep: "Overheads after chiquita → block won the point {mP} of {nP} times.", vary: "Overheads straight after their lob won {mC} of {nC}; the ball often came back off the glass.", seq: "Our chiquita → their block → we move in → víbora", coach: "Drill chiquita–advance–víbora; hold the overhead back after a deep lob.", lim: "Contact depth from court positions; overhead pace is not recorded."},
    {id: 'F-TP2', inv: 'TP2', opp: 'HI', h: "Against Haro / Ibarra, the early smash comes back and costs the net", hU: "Against Haro / Ibarra, finishing early or building makes little difference", why: "They defend well off the back glass; the point is won later, once a lob falls short.", PL: "Smash on their first lob", CL: "Bandeja on their first lob", ML: "point won", P: o => { const a = o.r.shots[3], b = o.r.shots[4]; return !!b && a.type === 'Lob' && b.pair === 'A' && b.type === 'Smash'; }, C: o => { const a = o.r.shots[3], b = o.r.shots[4]; return !!b && a.type === 'Lob' && b.pair === 'A' && b.type === 'Bandeja'; }, M: won, rep: "Smash on their first lob: won {mP} of {nP}.", vary: "Bandeja on that lob, building on: won {mC} of {nC}.", seq: "Their lob → our smash → Haro off the glass → they take the net", coach: "Against this pair, build with bandejas and wait for the short lob.", lim: "Two demo matches against this pair."},
    {id: 'F-NT1', inv: 'NT1', h: "Deep lobs let Albón and Brey advance together; shorter lobs leave Brey deep", hU: "Lob depth makes little difference to getting forward", why: "Getting both players forward after a defensive lob is how the point turns.", PL: "Lob within 1.5 m of the glass", CL: "Shorter lob", ML: "both forward within three shots", P: o => o.g === 'Deep lob (under 1.5 m)', C: o => o.g === 'Shorter lob', M: o => o.ok, rep: "Both were forward within three shots after {mP} of {nP} deep lobs.", vary: "After shorter lobs: {mC} of {nC}. The opponents took them in the air and Brey stayed back.", seq: "Deep lob → opponent from the glass → both advance → both forward at the next contact", coach: "Train the deep target and the joint advance; after a short lob, stay back together.", lim: "Depth from the bounce point only."},
    {id: 'F-NT3', inv: 'NT3', h: "When Brey advances late, the gap between them is attacked", hU: "Advance timing makes little difference", why: "A staggered advance leaves space through the middle at the moment the opponents volley.", PL: "Staggered (over 0.3 s)", CL: "Together (within 0.3 s)", ML: "point won", P: o => o.g === 'Staggered (over 0.3 s)', C: o => o.g === 'Together (within 0.3 s)', M: won, rep: "Staggered advances: point won {mP} of {nP}.", vary: "Advancing together: point won {mC} of {nC}.", seq: "Our lob → Albón moves at once, Brey later → volley into the gap", coach: "Use one shared cue to go forward, such as the bounce on their side.", lim: "Timing from the demo movement records; real measurement needs 50 fps tracking."},
    {id: 'F-NT5', inv: 'NT5', unc: true, h: "Under a mid-depth lob, holding the net is followed by more points won", hU: "Under a mid-depth lob, holding the net is followed by more points won, but the evidence is thin", why: "Holding is followed by more points won here, but the two groups are very different in size and the lob height that decides the choice is not in the records.", PL: "Held with a bandeja", CL: "Retreated, let it bounce", ML: "point won", P: o => o.g === 'Held (in the air)' && o.c === 'Mid-court', C: o => o.g === 'Retreated (after bounce)' && o.c === 'Mid-court', M: won, rep: "Held: point won {mP} of {nP}.", vary: "Retreated: point won {mC} of {nC}.", seq: "Their lob → hold or retreat → next two shots", coach: "Review the 26 retreats before making it a rule: check lob height and Brey’s position at contact.", lim: "Only 26 retreats against 407 holds, and the choice depends on lob height, which is not recorded."},
    {id: 'F-PC5', inv: 'PC5', h: "When Brey is pulled wide, Albón stepping into the middle keeps the next ball covered", hU: "Albón’s cover step makes little difference when Brey is pulled wide", why: "If Albón holds his side, the opponents have a 5 m gap through the middle.", PL: "Albón moved to the middle", CL: "Albón held his side", ML: "next ball covered", P: o => o.pid === 'bre' && S0(o).type === 'Volley' && o.r.shots[o.j].pos.bre[1] > 8.8 && o.g === 'Partner moved to the middle', C: o => o.pid === 'bre' && S0(o).type === 'Volley' && o.r.shots[o.j].pos.bre[1] > 8.8 && o.g === 'Partner held his side', M: o => !(o.r.winner === 'B' && o.r.shots.length - 1 === o.j + 1), rep: "Albón moved towards the middle: the next ball was covered in {mP} of {nP}. We won {wP} of these points.", vary: "Albón held his side: covered in {mC} of {nC}. In the rest, their next volley through the middle won the point.", seq: "Their wide volley → Brey at the side glass → Albón shifts → their middle ball covered", coach: "Drill the cover step: when the partner goes wide, the other moves to the centre line.", lim: "Shift measured between two contacts."},
    {id: 'F-PC1', inv: 'PC1', h: "On lobs over Brey, he turns late and Albón retreats alone", hU: "Retreat timing under the lob makes little difference", why: "A late turn leaves Brey hitting from the glass while the opponents close the net.", PL: "Staggered retreat (over 0.3 s)", CL: "Retreated together", ML: "point won", P: o => { const s = S0(o), p = o.r.shots[o.i - 1]; return o.g === 'Staggered (over 0.3 s)' && p.type === 'Volley' && s.dL < 1.3 && latName(o.M, s) === 'Brey’s side'; }, C: o => { const s = S0(o), p = o.r.shots[o.i - 1]; return o.g === 'Together (within 0.3 s)' && p.type === 'Volley' && s.dL < 1.3 && latName(o.M, s) === 'Brey’s side'; }, M: won, rep: "Staggered retreats: point won {mP} of {nP}.", vary: "Retreating together: point won {mC} of {nC}.", seq: "Their lob over Brey → Albón drops back → Brey turns 0.6 s later", coach: "Brey: turn on their contact, not on the ball’s flight. Albón: call the lob.", lim: "Onset from the demo movement records."},
    {id: 'F-PC2', inv: 'PC2', h: "With both at the net, Albón takes most balls through the middle", hU: "Middle balls are shared evenly at the net", why: "Clear middle responsibility at the net; from the back it is shared.", PL: "Both of us forward", CL: "Both of us back", ML: "Albón took it", P: o => o.g === 'We were forward' && S0(o).type === 'Volley' && S0(o).dL > 4.5, C: o => o.g === 'We were back' && S0(o).type === 'Volley' && S0(o).dL < 3, M: o => o.c === 'Albón', rep: "Both forward: Albón took {mP} of {nP} middle balls.", vary: "Both back: Albón took {mC} of {nC}.", seq: "Their ball through the middle → Albón crosses on his forehand", coach: "Keep the rule at the net; agree one for the back of the court.", lim: "Middle = within 1 m of the centre line at the bounce."},
    {id: 'F-LP2', inv: 'LP2', h: "Since June, Albón is back at the net by the next ball after his bandeja", hU: "Albón’s recovery after the bandeja has not clearly changed", why: "Recovery after the bandeja decides whether the pair keeps the net.", PL: "June to October", CL: "January to May", ML: "back within 1 m of his net position", P: o => o.g === 'Jun – Oct' && S0(o).dep.alb >= 4.8 && !!N1(o) && N1(o).type === 'Volley', C: o => o.g === 'Jan – May' && S0(o).dep.alb >= 4.8 && !!N1(o) && N1(o).type === 'Volley', M: o => !!N1(o) && homeDist(N1(o), o.M, 'alb') <= 1, rep: "June to October: back in position by their next shot after {mP} of {nP} bandejas.", vary: "January to May: {mC} of {nC}.", seq: "Albón’s bandeja → recovery steps → their next shot", coach: "Keep the recovery work; check it against stronger lobbing pairs.", lim: "Compares periods, not causes; opponents differ between periods."},
    {id: 'F-LP1', inv: 'LP1', h: "Low balls at the net remain Albón’s most frequent error situation", hU: "No situation stands out for Albón’s errors", why: "It recurs match after match, so it is a training priority, not one bad day.", PL: "Low ball at the net", CL: "His other situations", ML: "error on that shot", P: o => o.g === 'Low ball at the net' && o.r.shots[o.i - 1].type === 'Chiquita' && S0(o).dep.alb >= 6, C: o => o.g !== 'Low ball at the net', M: o => !o.ok, rep: "Errors on low balls at the net: {mP} of {nP}, in {kP} of {ms} matches.", vary: "Errors in his other tracked situations: {mC} of {nC}.", seq: "Their chiquita → Albón’s low volley", coach: "Low-volley work with a lower stance; review the errors on video.", lim: "Ball height is not measured; “low” comes from the incoming shot and the bounce."},
    {id: 'F-LP3', inv: 'LP3', h: "With Casal the partner takes the middle; with Brey, Albón does", hU: "Middle responsibility is similar with both partners", why: "Albón’s role changes with the partner, so preparation should too.", PL: "With Casal", CL: "With Brey", ML: "partner took the middle ball", P: o => o.g === 'With Casal' && S0(o).type === 'Volley' && S0(o).dL > 4.5 && S0(o).st.A === 'net', C: o => o.g === 'With Brey' && S0(o).type === 'Volley' && S0(o).dL > 4.5 && S0(o).st.A === 'net', M: o => o.c === 'Partner', rep: "Middle balls at the net with Casal: the partner took {mP} of {nP}.", vary: "With Brey: the partner took {mC} of {nC}.", seq: "Ball through the middle → who takes it", coach: "Agree the middle rule per partnership before the match.", lim: "Two demo matches with Casal."},
    {id: 'F-DI1', inv: 'DI1', h: "From the back, Albón’s lobs get the pair forward; his chiquitas mostly do not", hU: "Lob or chiquita from the back: similar sequences follow", why: "Same defensive court state, different rally sequences after the choice.", PL: "Lob", CL: "Chiquita", ML: "both forward within two shots", P: o => { const p = o.r.shots[o.i - 1]; return o.g === 'Lob' && p.type === 'Volley' && p.dL <= 2.7; }, C: o => { const p = o.r.shots[o.i - 1]; return o.g === 'Chiquita' && p.type === 'Volley' && p.dL <= 2.7; }, M: o => o.c === 'We got forward', rep: "After his lob: both forward within two shots in {mP} of {nP}.", vary: "After his chiquita: {mC} of {nC}.", seq: "Both back, opponents forward → Albón’s choice → next two shots", coach: "Keep the chiquita for opponents who are not set; otherwise lob.", lim: "Observed sequences only; no estimate of what the other shot would have produced."},
    {id: 'F-DI2', inv: 'DI2', h: "Against deep lobs, Albón’s smashes come back; his bandejas keep the point", hU: "Against deep lobs, smash and bandeja end similarly", why: "From 4.6 m a smash has little angle; the controlled overhead keeps the net.", PL: "Smash", CL: "Bandeja", ML: "point won", P: o => o.g === 'Smash' && o.c === 'Deep lob' && o.r.shots[o.j].dep.alb < 5.2, C: o => o.c === 'Deep lob' && o.r.shots[o.j].type === 'Bandeja' && o.r.shots[o.j].dep.alb < 5.2, M: won, rep: "Smash against a deep lob: point won {mP} of {nP}.", vary: "Bandeja against a deep lob: {mC} of {nC}.", seq: "Deep lob → Albón’s overhead → reply off the glass", coach: "Against deep lobs: bandeja first, smash only from past 5.5 m.", lim: "Contact depth from court positions; pace is not recorded."},
    {id: 'F-DI3', inv: 'DI3', h: "When an opponent is out of position, Albón often hits back towards him", hU: "Albón’s direction against a displaced opponent makes little difference", why: "Placement awareness: the open side was available.", PL: "Towards the displaced player", CL: "Away, to the open side", ML: "point won", P: o => { const s = S0(o); return s.type === 'Volley' && o.M.B.players.some(q => s.pos[q][1] < 1.2 || s.pos[q][1] > 8.8) && o.c === 'Towards the displaced player'; }, C: o => { const s = S0(o); return s.type === 'Volley' && o.M.B.players.some(q => s.pos[q][1] < 1.2 || s.pos[q][1] > 8.8) && o.c === 'Away from him'; }, M: won, rep: "Towards the displaced player: point won {mP} of {nP}.", vary: "Away, into the open side: point won {mC} of {nC}.", seq: "Opponent pulled wide → Albón’s volley direction → their reply", coach: "Scanning drill: find the displaced opponent before the volley.", lim: "Only shots he actually played are counted."},
    {id: 'F-SP1', inv: 'SP1', h: "On break, golden and set points Albón lobs from the back more often", hU: "Albón’s shot from the back is similar on important points", why: "Opponents can expect the lob on these points.", PL: "Important points", CL: "Other points", ML: "played a lob", P: o => { const p = o.r.shots[o.i - 1]; return o.g === 'Important points' && p.type === 'Volley' && p.dL <= 2.7 && S0(o).st.B === 'net'; }, C: o => { const p = o.r.shots[o.i - 1]; return o.g === 'Other points' && p.type === 'Volley' && p.dL <= 2.7 && S0(o).st.B === 'net'; }, M: o => o.ok, rep: "Important points: lob in {mP} of {nP}.", vary: "Other points: lob in {mC} of {nC}.", seq: "Score context → Albón’s first shot from the back", coach: "Plan the important points knowing the lob is the likely choice; vary when it helps.", lim: "No pressure or mental state is inferred."},
    {id: 'F-SP5', inv: 'SP5', h: "After two lost points in a row, Albón goes for the smash more often", hU: "Albón’s overhead choice does not change after lost points", why: "A change in shot choice that opponents can read.", PL: "After 2+ lost points", CL: "Other points", ML: "chose a smash", P: o => { const p = o.r.shots[o.i - 1]; return o.g === 'After 2+ lost points' && p.type === 'Lob' && p.dL >= 1.9 && p.dL <= 3.1 && S0(o).dep.alb < 6; }, C: o => { const p = o.r.shots[o.i - 1]; return o.g === 'Other points' && p.type === 'Lob' && p.dL >= 1.9 && p.dL <= 3.1 && S0(o).dep.alb < 6; }, M: o => o.ok, rep: "After two or more lost points: smash in {mP} of {nP} overheads.", vary: "Otherwise: {mC} of {nC}.", seq: "Two lost points → Albón’s first overhead", coach: "Agree an overhead routine for the point after a lost one.", lim: "Behaviour only; frustration is not inferred."},
    {id: 'F-SP4', inv: 'SP4', unc: true, h: "In long rallies, Albón’s last shot is more often an error", hU: "In long rallies, no clear change in how Albón’s rallies end", why: "Long rallies are a common question; these records do not answer it.", PL: "Shot 9 or later", CL: "Shots 1–4", ML: "his last shot was an error", P: o => o.g === 'Shot 9 or later', C: o => o.g === 'Shots 1–4', M: o => !o.ok, rep: "Shot 9 or later: his last shot was an error in {mP} of {nP}.", vary: "Shots 1–4: {mC} of {nC}.", seq: "Rally length → Albón’s last shot", coach: "No action from this alone.", lim: "Fatigue is not inferred."},
    {id: 'F-TE2', inv: 'TE2', h: "When Albón turns late on the lob, his bandeja goes into the net", hU: "Preparation timing makes little difference to Albón’s overhead", why: "Preparation, not the stroke itself, separates the two groups.", PL: "First step 0.4 s or later", CL: "First step within 0.25 s", ML: "error", P: o => { const m = S0(o).mv.alb; return !!m && m.on >= .4; }, C: o => { const m = S0(o).mv.alb; return !!m && m.on < .25; }, M: o => !o.ok, rep: "Late first step: error in {mP} of {nP}.", vary: "Early first step: error in {mC} of {nC}.", seq: "Their lob → Albón’s first step → contact", coach: "First-step drill on the lob contact; compare the two examples frame by frame.", lim: "Timing from the demo movement records; stroke mechanics are not measured."},
    {id: 'F-TE4', inv: 'TE4', h: "Albón’s víbora errors come from contacts inside 5.2 m", hU: "Contact depth makes little difference to Albón’s víbora", why: "Contact depth, not the choice of víbora, is where it breaks down.", PL: "Contact under 5.2 m", CL: "Contact 5.2 m or more", ML: "error", P: o => { const p = o.r.shots[o.i - 1]; return o.c === 'Contact under 5.2 m' && p.type === 'Lob' && p.dL >= 1.4; }, C: o => { const p = o.r.shots[o.i - 1]; return o.c === 'Contact 5.2 m or more' && p.type === 'Lob' && p.dL >= 1.4; }, M: o => !o.ok, rep: "Contact under 5.2 m: error in {mP} of {nP}.", vary: "5.2 m or more: error in {mC} of {nC}.", seq: "Their lob → contact depth → víbora result", coach: "From deep, play the bandeja; keep the víbora for contacts past 5.2 m.", lim: "Joint angles are not measured."},
    {id: 'F-TE6', inv: 'TE6', h: "Off double-glass rebounds Albón rushes a bajada and misses", hU: "Rebound type makes little difference to Albón’s wall play", why: "The back-and-side rebound is the specific wall situation to train.", PL: "Back and side glass", CL: "Back glass only", ML: "error", P: o => o.g === 'Back and side glass', C: o => o.g === 'Back glass only', M: o => !o.ok, rep: "Back and side glass: error in {mP} of {nP}.", vary: "Back glass only: error in {mC} of {nC}; he waits and lobs.", seq: "Their deep lob → rebound → Albón’s shot", coach: "Wall drill on back-and-side rebounds, finishing with a lob.", lim: "Rebound order from the demo event records."}];
  const FSCN = {"F-OS1":["OS1P","OS1C"],"F-OS2":["OS2P","OS2C"],"F-OS3":["OS3W","OS3T"],"F-TP3":["TP3P","TP3C"],"F-TP1":["TP1P","TP1C"],"F-TP2":["TP2P","TP2C"],"F-NT1":["NT1P","NT1C"],"F-NT3":["NT3P","NT3C"],"F-NT5":["NT5H","NT5R"],"F-PC5":["PC5P","PC5C"],"F-PC1":["PC1P","PC1C"],"F-PC2":["PC2F","PC2B"],"F-LP2":["LP2L","LP2E"],"F-LP1":["LP1"],"F-LP3":["LP3C","PC2F"],"F-DI1":["DI1L","DI1C"],"F-DI2":["DI2S","DI2B"],"F-DI3":["DI3T","DI3A"],"F-SP1":["SP1L","DI1L"],"F-SP5":["SP5S"],"F-SP4":[],"F-TE2":["TE2L","TE2E"],"F-TE4":["TE4D","TE4F"],"F-TE6":["TE6S","TE6B"]};
  FINDINGS.forEach(x => { x.scn = FSCN[x.id] || []; });
  const SH = {"F-OS1":["Deep lobs to Durán’s corner push both back","Deep lobs to Durán’s corner: no consistent retreat","Both opponents back"],"F-OS2":["Pull Esteve wide, then go through the middle","Pulling Esteve wide does not reliably open the middle","Won within two"],"F-OS3":["Wide serves to Durán come back as lobs","Durán’s return barely depends on serve direction","Durán lobbed"],"F-TP3":["Brey’s bandeja to the middle costs us the net","Bandeja direction barely changes keeping the net","Net lost"],"F-TP1":["Chiquita, block, then víbora wins the point","The build-up before our overheads makes little difference","Point won"],"F-TP2":["Against Haro / Ibarra, the early smash comes back","Against Haro / Ibarra, finishing early or late: similar","Point won"],"F-NT1":["Deep lobs get both of us to the net","Lob depth barely changes getting forward","Both forward"],"F-NT3":["When Brey advances late, the gap gets attacked","Advance timing makes little difference","Point won"],"F-NT5":["Holding the net under a mid lob wins more","Holding the net under a mid lob: thin evidence","Point won"],"F-PC5":["Albón’s step to the middle covers Brey pulled wide","Albón’s cover step makes little difference","Next ball covered"],"F-PC1":["Lobbed over Brey, we retreat apart and lose","Retreat timing under the lob makes little difference","Point won"],"F-PC2":["At the net, Albón takes the middle ball","Middle balls are shared evenly at the net","Albón took it"],"F-LP2":["Since June, Albón recovers fast after his bandeja","Albón’s bandeja recovery has not clearly changed","Back in position"],"F-LP1":["Low balls at the net remain Albón’s main error","No situation stands out for Albón’s errors","Error"],"F-LP3":["With Casal the partner takes the middle; with Brey, Albón","Middle responsibility is similar with both partners","Partner took it"],"F-DI1":["From the back, Albón’s lob gets us forward","Lob or chiquita from the back: similar outcome","Both forward"],"F-DI2":["Against deep lobs, Albón’s bandeja beats his smash","Against deep lobs, smash and bandeja end similarly","Point won"],"F-DI3":["Albón hits back to the displaced opponent","Albón’s direction against a displaced opponent: little difference","Point won"],"F-SP1":["On big points, Albón lobs from the back","Albón’s shot from the back is unchanged on big points","Played a lob"],"F-SP5":["After two lost points, Albón goes for the smash","Albón’s overhead choice is unchanged after lost points","Chose a smash"],"F-SP4":["In long rallies, Albón’s last shot is more often an error","In long rallies, no clear change in Albón’s errors","Last shot error"],"F-TE2":["Late turn on the lob sends the bandeja into the net","Preparation timing makes little difference to the overhead","Error"],"F-TE4":["Albón’s víbora breaks down when he hits from deep","Contact depth makes little difference to the víbora","Error"],"F-TE6":["Off double-glass rebounds, Albón rushes the bajada","Rebound type makes little difference to Albón’s wall play","Error"]};
  const LBL = {"F-NT1":["Deep lob","Shorter lob"],"F-TE4":["Contact from deep","Contact further forward"],"F-NT3":["Brey advanced late","Advanced together"],"F-PC1":["Retreated apart","Retreated together"],"F-TE2":["Late first step","Early first step"]};
  FINDINGS.forEach(x => { const q = SH[x.id]; if (q) { x.hs = q[0]; x.hsU = q[1]; x.bl = q[2]; } const l = LBL[x.id]; if (l) { x.PL = l[0]; x.CL = l[1]; } });
  const FBY = {}; FINDINGS.forEach(x => { FBY[x.inv] = x; });
  const STR = {clear: 'Clear in the demo records', mixed: 'Mixed evidence', few: 'Few examples'};
  const pickEx = (xs, f2, scn) => xs.find(o => f2(o) && scn.includes(o.r.scn)) || xs.find(o => scn.includes(o.r.scn)) || xs.find(o => f2(o) && !o.r.scn) || xs.find(f2) || xs[0] || null;
  function finding(fd, sc) {
    const spec = SPEC[fd.inv], mod = MODULES.find(m => m.key === spec.mod);
    sc = sc || (mod.subject === 'pair' ? {pair: 'AB', opp: fd.opp || 'all', period: 'all', set: 'all'} : {pid: 'alb', opp: fd.opp || 'all', period: 'all', set: 'all'});
    const an = analyze(fd.inv, sc), Ps = an.occ.filter(o => fd.P(o)), Cs = an.occ.filter(o => fd.C(o));
    const nP = Ps.length, mP = Ps.filter(fd.M).length, nC = Cs.length, mC = Cs.filter(fd.M).length, pP = nP ? Math.round(mP / nP * 100) : 0, pC = nC ? Math.round(mC / nC * 100) : 0;
    const wP = Ps.filter(won).length, wC = Cs.filter(won).length, kP = new Set(Ps.filter(fd.M).map(o => o.M.id)).size, ms = an.ms.length;
    const k = nP < 6 || nC < 5 ? 'few' : fd.unc ? 'mixed' : Math.abs(pP - pC) >= 25 ? 'clear' : 'mixed', V = {nP, mP, nC, mC, pP, pC, wP, wC, kP, ms}, fill = t => t.replace(/\{(\w+)\}/g, (_, x) => V[x] != null ? V[x] : '');
    return {fd, an, sc, Ps, Cs, ...V, k, kL: STR[k], head: k === 'clear' ? fd.hs : fd.hsU, rep: fill(fd.rep), vary: fill(fd.vary), ex: pickEx(Ps, o => fd.M(o), fd.scn), cx: pickEx(Cs, o => !fd.M(o), fd.scn)};
  }
  W.MI = {TEAMS, TIES, TBY, teamOfPair, FINDINGS, FBY, finding, STR, PLAYERS, PAIRS, MATCHES, MBY, MODULES, SPECS, SPEC, TAGS, ST, MIN, INTERVENTION_DAY, analyze, verdict, narrate, zoneOf, latName, band, nm, ENDS, stLbl, respCat};
})(typeof window !== 'undefined' ? window : globalThis);
