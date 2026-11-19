window.__APP_FN = function () {
  let HH = 38, BH = 34, HM = {};
  const hh = n => HM[n.id] || NH;
  const FORCE_VIEW = !!window.__FORCE_VIEW;
  const OWNER_KEY = 'orgs_owner_v1';
  try {
    const params = new URLSearchParams(location.search);
    if (params.has('admin') || params.has('owner') || location.hash === '#admin') {
      localStorage.setItem(OWNER_KEY, '1');
      if (history.replaceState) history.replaceState(null, '', location.pathname);
    }
    if (params.has('visitante')) {
      localStorage.removeItem(OWNER_KEY);
    }
  } catch (e) {}
  let IS_OWNER = !FORCE_VIEW && (location.protocol === 'file:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1' || (function () { try { return localStorage.getItem(OWNER_KEY) === '1'; } catch (e) { return false; } })());
  let VIEW = true;
  const NW = 190, GX = 18, GY = 46, LH = 70, IND = 20, KEY = 'orgs_v1', IDB_NAME = 'orgs_idb_v1';
  let NH = 52, DEV = 'desktop', ORIENT = 'v';

  const COL0 = ['#1f3a5f','#b45309','#0f766e','#7c3aed','#be123c','#4d7c0f','#0369a1','#a16207','#c2410c','#6d28d9','#047857','#9d174d','#1d4ed8','#854d0e','#0e7490','#7e22ce'];
  const COL = ['#0A1D38','#1D5C63','#5B2A4E','#7A4A12','#2E4A1F','#3B2F6B','#7A1F2B','#27506B','#4A3B2A','#14463C','#5A3A1C','#1F3A5F','#6B2D5C','#2F4858','#6A3B14','#3D3D5C','#5C2E1F','#1E4D3A','#4B2A63','#2B3F5E','#6E4B1F','#3A4F2B','#5A2330','#244B5E'];
  const TT = [0, .14, .30, .46, .62, .76, .87, .93];
  const mix = (h, t) => {
    const c = [1, 3, 5].map(i => parseInt(h.substr(i, 2), 16)), w = [246, 243, 234];
    return '#' + c.map((v, i) => Math.round(v + (w[i] - v) * t).toString(16).padStart(2, '0')).join('');
  };
  const depth = n => {
    let d = 0, m = n;
    while (m.p && m.p != m.id) {
      m = node(m.p);
      if (!m) break;
      d++;
    }
    return d;
  };
  const cst = n => {
    const t = TT[Math.min(depth(n), 7)];
    return { bg: mix(COL[cix(n.t) % COL.length], t), fg: t <= .46 ? '#fff' : '#2a2722', t };
  };
  const $ = s => document.querySelector(s);
  const uid = () => 'x' + Math.random().toString(36).slice(2, 9);

  function tree0(s, id) {
    return s.trees.find(t => t.id == id);
  }

  // IndexedDB para respaldar fotos personalizadas sin límite de 5 MB de localStorage
  function openIDB() {
    return new Promise((resolve, reject) => {
      try {
        const req = indexedDB.open(IDB_NAME, 1);
        req.onupgradeneeded = () => {
          const db = req.result;
          if (!db.objectStoreNames.contains('state')) db.createObjectStore('state');
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      } catch (e) {
        reject(e);
      }
    });
  }

  async function saveIDB(customPhotos) {
    try {
      const db = await openIDB();
      const tx = db.transaction('state', 'readwrite');
      tx.objectStore('state').put(customPhotos, 'custom_photos');
    } catch (e) {}
  }

  async function loadIDB() {
    try {
      const db = await openIDB();
      return await new Promise(resolve => {
        const tx = db.transaction('state', 'readonly');
        const req = tx.objectStore('state').get('custom_photos');
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      });
    } catch (e) {
      return null;
    }
  }

  function hydratePhotos(state) {
    if (!state || !state.nodes) return state;
    state.nodes.forEach(n => {
      if (n.photo === '__PH__' || (!n.photo && n.noPhoto !== 1 && typeof PH !== 'undefined' && PH[n.id])) {
        n.photo = (typeof PH !== 'undefined' && PH[n.id]) ? PH[n.id] : '';
      }
    });
    return state;
  }

  let S;
  try {
    S = JSON.parse(localStorage.getItem(KEY));
  } catch (e) {}
  if (FORCE_VIEW && window.__DATA) S = window.__DATA;
  if (!S || !S.trees) S = seed();
  hydratePhotos(S);

  if (!S.v || S.v < 7) {
    const sd = seed(), ex = id => S.nodes.find(n => n.id == id);
    sd.trees.forEach(x => {
      if (!tree0(S, x.id)) {
        S.trees.push(x);
        S.nodes.push(...sd.nodes.filter(n => n.t == x.id));
      }
    });
    ['s5','w11','w12','w13','w14','doj2','doj3','fbi2','fbi3'].forEach(id => {
      const s = sd.nodes.find(n => n.id == id);
      if (s && !ex(id) && tree0(S, s.t)) S.nodes.push(s);
    });
    if (!ex('s4') && tree0(S, 'state')) S.nodes.push(sd.nodes.find(n => n.id == 's4'));
    const FX = {
      w1: { name: ['Juan Segura', 'Juan Pablo Segura'], title: ['Assistant Secretary – WHA', 'Assistant Secretary'] },
      w4: { title: ['Deputy Assistant Secretary for the Caribbean and Haiti', sd.nodes.find(n => n.id == 'w4').title] },
      w5: { title: ['Principal Deputy Assistant Secretary (E)', 'Senior Advisor for Western Hemisphere Affairs'] },
      w6: { name: ['Ricardo Pita', 'Ricardo Pita Macedo'], title: ['Deputy Assistant Secretary for North America (E)', 'Deputy Assistant Secretary for North America'] },
      w7: { name: ['Amb. Leandro Rizutto', 'Amb. Leandro Rizzuto'], title: ['Permanent Representative to the OAS', sd.nodes.find(n => n.id == 'w7').title] }
    };
    for (const id in FX) {
      const n = ex(id);
      if (n) for (const f in FX[id]) if (n[f] == FX[id][f][0]) n[f] = FX[id][f][1];
    }
    const b = ex('w5');
    if (b && b.p == 'w1' && ex('w2')) b.p = 'w2';
    sd.nodes.forEach(s => {
      const n = ex(s.id);
      if (n && !n.photo && s.photo) n.photo = s.photo;
    });
    ['dea3', 'dea4', 'dea5'].forEach(id => {
      const s = sd.nodes.find(n => n.id == id), n = ex(id);
      if (s && n) {
        n.photo = s.photo;
        n.es = s.es;
        n.en = s.en;
      }
    });
    S.v = 7;
  }

  // Cargar fotos personalizadas desde IndexedDB si las hubiera
  loadIDB().then(customPhotos => {
    if (customPhotos && S && S.nodes) {
      let changed = false;
      S.nodes.forEach(n => {
        if (customPhotos[n.id]) {
          n.photo = customPhotos[n.id];
          changed = true;
        }
      });
      if (changed) {
        draw();
        if (S.sel) panel();
      }
    }
  });

  let saveTimer = null;
  const showSaved = msg => {
    const el = $('#savestatus');
    if (!el) return;
    el.textContent = msg || '✓ Cambios guardados automáticamente';
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      if (el) el.textContent = '';
    }, 3000);
  };

  const save = () => {
    if (FORCE_VIEW) return;
    try {
      const customPhotos = {};
      const compact = {
        ...S,
        nodes: S.nodes.map(n => {
          const isDefaultPhoto = typeof PH !== 'undefined' && PH[n.id] && n.photo === PH[n.id];
          if (isDefaultPhoto) {
            return { ...n, photo: '__PH__' };
          }
          if (n.photo && (!PH || n.photo !== PH[n.id])) {
            customPhotos[n.id] = n.photo;
          }
          return { ...n, photo: '' };
        })
      };
      localStorage.setItem(KEY, JSON.stringify(compact));
      saveIDB(customPhotos);
      showSaved('✓ Cambios guardados automáticamente');
    } catch (e) {
      showSaved('⚠ Usa Exportar respaldo (JSON) para guardar');
    }
  };

  // Sincronización con los datos publicados (data.js): el estado guardado en
  // el navegador puede quedar desactualizado frente a data.js (p. ej., nodos
  // nuevos publicados desde otro equipo). En cada carga se incorporan los
  // árboles y nodos publicados que falten localmente, sin tocar los ya
  // presentes: las ediciones locales no publicadas se conservan.
  (function syncFromSeed() {
    if (FORCE_VIEW) return;
    try {
      const sd = seed();
      let added = 0;
      sd.trees.forEach(x => {
        if (!tree0(S, x.id)) { S.trees.push(x); added++; }
      });
      // Renombrados en la publicación (p. ej., ids corregidos): si un nodo
      // local ya no está en los datos publicados pero en su mismo árbol hay
      // un nodo publicado con el mismo nombre, el local es la versión vieja
      // del renombrado: se retira y los hijos locales que colgaban de él
      // pasan al id nuevo. Las demás ediciones locales no se tocan.
      const seedKeys = new Set(sd.nodes.map(n => n.id + '|' + n.t));
      const renamed = {}; // 'árbol|idViejo' -> idNuevo
      S.nodes.forEach(n => {
        if (n.name && !seedKeys.has(n.id + '|' + n.t)) {
          const rep = sd.nodes.find(sn => sn.t === n.t && sn.name === n.name && sn.id !== n.id);
          if (rep) renamed[n.t + '|' + n.id] = rep.id;
        }
      });
      if (Object.keys(renamed).length) {
        S.nodes = S.nodes.filter(n => !renamed[n.t + '|' + n.id]);
        S.nodes.forEach(n => {
          if (n.p && renamed[n.t + '|' + n.p]) n.p = renamed[n.t + '|' + n.p];
        });
        added++;
      }
      const have = new Set(S.nodes.map(n => n.id + '|' + n.t));
      sd.nodes.forEach(sn => {
        if (!have.has(sn.id + '|' + sn.t)) { S.nodes.push(sn); added++; }
      });
      if (added) save();
    } catch (e) {}
  })();

  const cix = id => {
    const t = S.trees.find(x => x.id == id);
    return t && t.ci != null ? t.ci : S.trees.findIndex(x => x.id == id);
  };
  const tcol = id => COL[cix(id) % COL.length];
  const node = id => S.nodes.find(n => n.id == id), tree = id => S.trees.find(t => t.id == id);
  const kv = id => node(id) && node(id).c ? [] : kids(id);
  const cnt = id => kids(id).reduce((a, c) => a + 1 + cnt(c.id), 0);
  const kids = id => S.nodes.filter(n => n.p == id).concat(S.trees.filter(t => t.link == id).flatMap(t => S.nodes.filter(n => n.t == t.id && !n.p)));
  const MC = document.createElement('canvas').getContext('2d');

  function calcH() {
    const M = DEV == 'mobile';
    let m = 1;
    MC.font = `bold ${M ? 19 : 11}px Georgia,serif`;
    S.trees.forEach(x => {
      m = Math.max(m, wrap(MC, x.name, NW - 16, 99).length);
    });
    BH = M ? Math.max(52, m * 24 + 16) : Math.max(30, m * 13 + 10);
    HH = BH + 4;
    S.nodes.forEach(n => {
      MC.font = `${M ? 16 : 11}px Georgia,serif`;
      const T = wrap(MC, n.title, NW - 18, 99);
      MC.font = `bold ${M ? 23 : 12}px Georgia,serif`;
      const Nn = n.name ? wrap(MC, n.name, NW - 18, 99) : [];
      HM[n.id] = Math.max(NH, M ? Math.ceil(T.length * 21 + Nn.length * 29.5 + 22) : Math.ceil(T.length * 13.8 + Nn.length * 14.6 + 14));
    });
  }

  let HBW = 150, BND = {};
  const BWd = n => ORIENT == 'h' ? hh(n) : NW, DHd = n => ORIENT == 'h' ? NW : hh(n), TOFF = () => ORIENT == 'h' ? HBW + 4 : HH;

  function bandH(n) {
    if (ORIENT != 'h') return BH;
    const M = DEV == 'mobile';
    MC.font = `bold ${M ? 19 : 11}px Georgia,serif`;
    return Math.max(hh(n), wrap(MC, tree(n.t).name, HBW - 16, 99).length * (M ? 24 : 13) + 14);
  }

  function place(n, x, y, P, E) {
    if (!n.p) y += TOFF();
    const ch = kv(n.id);
    if (!ch.length) {
      P[n.id] = { x, y };
      return BWd(n);
    }
    const lv = ch.filter(c => !kv(c.id).length), st = ORIENT == 'h' ? [] : (lv.length >= 3 ? lv : []), br = ch.filter(c => !st.includes(c)), ys = y + DHd(n) + GY;
    let cx = x;
    let yy = ys, ly = ys;
    if (st.length) {
      let mw = 0;
      st.forEach(c => {
        const h = c.p ? 0 : TOFF();
        P[c.id] = { x: cx + IND, y: yy + h };
        ly = yy + h + DHd(c) / 2;
        yy += h + DHd(c) + 8;
        mw = Math.max(mw, BWd(c));
      });
      cx += mw + IND + GX;
    }
    br.forEach(c => {
      cx += place(c, cx, ys, P, E) + GX;
    });
    const bw = BWd(n), tot = Math.max(bw, cx - GX - x), px = x + (tot - bw) / 2, pc = px + bw / 2, pb = y + DHd(n), my = pb + GY / 2;
    P[n.id] = { x: px, y };
    br.forEach(c => E.push([[pc, pb], [pc, my], [P[c.id].x + BWd(c) / 2, my], [P[c.id].x + BWd(c) / 2, P[c.id].y - (c.p ? 0 : TOFF())]]));
    if (st.length) {
      const tx = x + 8;
      E.push([[pc, pb], [pc, my], [tx, my], [tx, ly]]);
      st.forEach(c => E.push([[tx, P[c.id].y + DHd(c) / 2], [P[c.id].x, P[c.id].y + DHd(c) / 2]]));
    }
    return tot;
  }

  let V = { x: 20, y: 20, k: 1 };
  const apply = () => $('#world').style.transform = `translate(${V.x}px,${V.y}px) scale(${V.k})`;

  function draw(fit) {
    calcH();
    HBW = DEV == 'mobile' ? 176 : 150;
    const A = {}, E = [];
    let x = 0, W = 0, H = 0;
    const roots = S.nodes.filter(n => !n.p && (S.view == 'all' ? !tree(n.t).link : n.t == S.view));
    roots.forEach(r => {
      x += place(r, x, 0, A, E) + 70;
    });
    const ids = Object.keys(A);
    ids.forEach(i => {
      W = Math.max(W, A[i].x + BWd(node(i)));
      H = Math.max(H, A[i].y + DHd(node(i)));
    });
    const P = {};
    ids.forEach(i => {
      P[i] = ORIENT == 'h' ? { x: A[i].y, y: A[i].x } : A[i];
    });
    BND = {};
    ids.filter(i => !node(i).p).forEach(i => {
      const n = node(i), bh = bandH(n);
      BND[i] = ORIENT == 'h'
        ? { x: P[i].x - TOFF(), y: Math.max(0, P[i].y + (hh(n) - bh) / 2), w: HBW, h: bh }
        : { x: P[i].x, y: P[i].y - HH, w: NW, h: BH };
    });
    const ES = E.map(pl => pl.map((pt, j) => (j ? 'L' : 'M') + (ORIENT == 'h' ? pt[1] + ' ' + pt[0] : pt[0] + ' ' + pt[1])).join(''));
    const SW = ORIENT == 'h' ? H : W, SH = ORIENT == 'h' ? W : H;
    $('#edges').setAttribute('width', SW);
    $('#edges').setAttribute('height', SH);
    $('#edges').innerHTML = ES.map(d => `<path d="${d}"/>`).join('');
    $('#cards').innerHTML =
      ids.filter(i => !node(i).p).map(i => {
        const n = node(i), b = BND[i];
        return `<div class="ttl" data-t="${n.t}" title="${esc(tree(n.t).name)}" style="left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px;background:${tcol(n.t)}"><span>${esc(tree(n.t).name)}</span></div>`;
      }).join('') +
      ids.map(i => {
        const n = node(i), p = P[i];
        const showPfBtn = DEV == 'desktop' && (n.es || n.en || !VIEW);
        return `<div class="card${S.sel == i ? ' sel' : ''}" data-id="${i}" style="left:${p.x}px;top:${p.y}px;height:${hh(n)}px;background:${cst(n).bg};color:${cst(n).fg}">${n.name ? `<b>${esc(n.title)}</b><span>${esc(n.name)}</span>` : `<b>${esc(n.title)}</b>`}${showPfBtn ? `<button class="pf" data-pf="${i}" title="${VIEW ? 'Ver perfil' : 'Editar / Ver perfil'}" aria-label="Ver perfil de ${esc(n.name || n.title)}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5"/></svg></button>` : ''}${kids(i).length ? `<button class="tg" title="Plegar / desplegar dependientes">${n.c ? '+' + cnt(i) : '−'}</button>` : ''}</div>`;
      }).join('');
    W0 = SW;
    H0 = SH;
    LAY = { P, E: ES, ids };
    if (fit) fitView();
  }

  let W0 = 0, H0 = 0, LAY = null;
  function fitView() {
    const r = $('#stage').getBoundingClientRect();
    let tp = 20;
    ['#mn', '#devcorn', '#qwrap'].forEach(function (s) {
      const e = $(s);
      if (e && getComputedStyle(e).display != 'none') tp = Math.max(tp, e.getBoundingClientRect().bottom - r.top + 12);
    });
    V.k = Math.max(.02, Math.min(1, (r.width - 40) / (W0 || 1), (r.height - 20 - tp) / (H0 || 1)));
    V.x = Math.max(20, (r.width - W0 * V.k) / 2);
    V.y = tp;
    apply();
  }

  const esc = s => String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const ptree = t => {
    const l = t.link && node(t.link);
    return l ? tree(l.t) : null;
  };

  function rows(pid, d) {
    return S.trees.filter(t => {
      const p = ptree(t);
      return (p ? p.id : null) == pid;
    }).map(t => {
      const sub = S.trees.some(u => {
        const p = ptree(u);
        return p && p.id == t.id;
      }), l = t.link && node(t.link), on = S.view == t.id;
      return `<div class="tr${on ? ' on' : ''}" data-t="${t.id}" data-v="${t.id}" role="button" tabindex="0" title="Ver este árbol" aria-pressed="${on}" style="margin-left:${d * 14}px"><b class="arr"${sub ? ` data-a="${t.id}" title="Mostrar u ocultar subárboles en el índice" style="cursor:pointer"` : ''}>${sub ? (t.c ? '▸' : '▾') : ''}</b><i class="dot" style="background:${tcol(t.id)}"></i><span>${esc(t.name)}<br><small>${l ? 'dependiente de ' + esc(l.title) : 'independiente'}</small></span>${on ? '<span class="viendo">Viendo</span>' : ''}</div>` + (sub && !t.c ? rows(t.id, d + 1) : '');
    }).join('');
  }

  function side() {
    const vel = $('#view');
    if (vel) {
      vel.innerHTML = '<option value="all">Todo (árboles vinculados)</option>' + S.trees.map(t => `<option value="${t.id}">Solo: ${esc(t.name)}</option>`).join('');
      vel.value = S.view;
    }
    const allOn = S.view == 'all';
    $('#trees').innerHTML = `<div class="tr tr-all${allOn ? ' on' : ''}" data-v="all" role="button" tabindex="0" title="Ver todos los árboles vinculados" aria-pressed="${allOn}"><b class="arr"></b><i class="dot" style="background:conic-gradient(#0A1D38 0 25%,#1D5C63 0 50%,#5B2A4E 0 75%,#7A4A12 0)"></i><span>Todos los árboles<br><small>vista vinculada completa</small></span>${allOn ? '<span class="viendo">Viendo</span>' : ''}</div>` + rows(null, 0);
    const t = tree(S.tree);
    if (!t) {
      $('#tedit').innerHTML = '';
      return;
    }
    const desc = new Set([t.id]);
    let ch = 1;
    while (ch) {
      ch = 0;
      S.trees.forEach(u => {
        const l = u.link && node(u.link);
        if (l && desc.has(l.t) && !desc.has(u.id)) {
          desc.add(u.id);
          ch = 1;
        }
      });
    }
    const opts = S.nodes.filter(n => !desc.has(n.t)).map(n => `<option value="${n.id}"${t.link == n.id ? ' selected' : ''}>${esc(tree(n.t).name)} › ${esc(n.title)}${n.name ? ' – ' + esc(n.name) : ''}</option>`).join('');
    $('#tedit').innerHTML = `<h3>Árbol seleccionado</h3><input id="tn" value="${esc(t.name)}"><small style="color:var(--mu)">Dependiente de:</small><select id="tl"><option value="">— Independiente (no depende de ninguno) —</option>${opts}</select><button id="td">Eliminar este árbol</button>`;
  }

  function openPhoto(n) {
    if (!n || !n.photo) return;
    const im = $('#phi');
    im.src = n.photo;
    im.alt = 'Foto de ' + (n.name || n.title || 'funcionario');
    $('#phc').innerHTML = (n.name ? `<b>${esc(n.name)}</b>` : '') + esc(n.title || '');
    $('#phv').hidden = false;
    $('#phx').focus();
  }

  function closePhoto() {
    const v = $('#phv');
    if (v) v.hidden = true;
    const im = $('#phi');
    if (im) im.removeAttribute('src');
  }

  function paras(t) {
    const AB = { EE: 1, UU: 1, US: 1, USA: 1, Sr: 1, Sra: 1, Dr: 1, Dra: 1, Mr: 1, Mrs: 1, Ms: 1, St: 1, No: 1, vs: 1, etc: 1, al: 1 };
    const sents = b => {
      const out = [];
      let st = 0;
      const re = /[.!?]+/g;
      let m;
      while ((m = re.exec(b))) {
        let k = m.index + m[0].length;
        while (k < b.length && ')"”’»'.includes(b[k])) k++;
        if (k >= b.length) break;
        if (b[k] != ' ') continue;
        const nx = b[k + 1] || '';
        if (!/[A-ZÁÉÍÓÚÑÜ0-9¿¡(“]/.test(nx)) continue;
        const wm = b.slice(0, m.index).match(/([A-Za-zÀ-ÿ.]{1,14})$/);
        const w = wm ? wm[1] : '';
        if (AB[w] || (w.length == 1 && /[A-Z]/.test(w)) || (/^[A-ZÀ-Ü]+$/.test(w) && w.length <= 4) || w.endsWith('.')) continue;
        out.push(b.slice(st, k).trim());
        st = k + 1;
      }
      out.push(b.slice(st).trim());
      return out.filter(Boolean);
    };
    const res = [];
    String(t || '').split(/\n+/).map(x => x.trim()).filter(Boolean).forEach(b => {
      if (b.length < 200) {
        res.push(b);
        return;
      }
      const ss = sents(b);
      if (ss.length <= 1) {
        res.push(b);
        return;
      }
      if (ss.length <= 3) {
        ss.forEach(s => res.push(s));
        return;
      }
      const tgt = ss.reduce((a, s) => a + s.length, 0) / 3, gs = [[]];
      let cur = 0;
      ss.forEach(s => {
        if (gs[gs.length - 1].length && cur + s.length / 2 > tgt && gs.length < 3) {
          gs.push([]);
          cur = 0;
        }
        gs[gs.length - 1].push(s);
        cur += s.length + 1;
      });
      gs.forEach(g => {
        if (g.length) res.push(g.join(' '));
      });
    });
    return res.length ? res : [''];
  }

  let PANELW = 0;
  function bindResizeHandle(p) {
    if (PANELW) {
      p.style.width = PANELW + 'px';
      p.style.maxWidth = 'none';
    }
    const hd = $('#phandle');
    if (hd) {
      hd.onpointerdown = e => {
        e.preventDefault();
        try { hd.setPointerCapture(e.pointerId); } catch (_) {}
        const mv = ev => {
          const w = Math.min(Math.max(innerWidth - ev.clientX, 280), Math.max(320, innerWidth - 360));
          PANELW = w;
          p.style.width = w + 'px';
          p.style.maxWidth = 'none';
        };
        const up = () => {
          hd.removeEventListener('pointermove', mv);
          hd.removeEventListener('pointerup', up);
          hd.removeEventListener('pointercancel', up);
          document.body.style.userSelect = '';
        };
        document.body.style.userSelect = 'none';
        hd.addEventListener('pointermove', mv);
        hd.addEventListener('pointerup', up);
        hd.addEventListener('pointercancel', up);
      };
    }
  }

  function viewPanel(n, p) {
    const t = tree(n.t), ps = n.p && node(n.p);
    p.innerHTML = `<div id="phandle" title="Arrastra para cambiar el ancho del panel" role="separator" aria-orientation="vertical" aria-label="Cambiar el ancho del panel"></div><button id="pc" style="float:right">✕</button><div class="pwrap">${IS_OWNER ? `<div style="margin-bottom:8px"><button id="swEdit" style="width:100%">✏️ Editar este cargo / perfil</button></div>` : ''}<div class="row tabs" style="justify-content:center;margin:0 0 12px"><button data-l="es" class="on">Español</button><button data-l="en">English</button></div>${n.photo ? `<img id="pimg" class="pimg" src="${n.photo}" alt="Foto de ${esc(n.name || n.title)}" title="Ampliar foto" tabindex="0" role="button" aria-label="Ampliar foto" style="width:100%;max-width:250px;border-radius:8px;display:block;margin:0 auto 6px;clear:right"><div style="font-size:12px;color:var(--mu);margin:0 0 10px;text-align:center">Toca la foto para verla ampliada</div>` : ''}<h2 style="margin:0 0 2px;font-size:19px;text-align:center">${esc(n.name || n.title)}</h2>${n.name ? `<div style="text-align:center">${esc(n.title)}</div>` : ''}<div style="font-size:12px;color:var(--mu);margin:4px 0 12px;text-align:center">${esc(t.name)}${ps ? ' · dependiente de ' + esc(ps.title) : ''}</div><div id="pd"></div><div style="margin-top:16px;border-top:1px solid #88888855;padding-top:12px;text-align:center"><div style="font-size:12px;color:var(--mu);margin-bottom:8px">Descargar perfil en Word</div><div class="row" style="justify-content:center;margin:0"><button data-wd="es">Español</button><button data-wd="en">English</button></div><div id="wdmsg" style="margin-top:8px;font-size:13px"></div></div></div>`;
    bindResizeHandle(p);
    const swEdit = $('#swEdit');
    if (swEdit) swEdit.onclick = () => setMode('edit');
    const pi = $('#pimg');
    if (pi) {
      pi.onclick = () => openPhoto(n);
      pi.onkeydown = e => {
        if (e.key == 'Enter' || e.key == ' ') {
          e.preventDefault();
          openPhoto(n);
        }
      };
    }
    let L = 'es';
    const show = () => {
      const tx = n[L];
      $('#pd').innerHTML = tx ? paras(tx).map(x => `<p>${esc(x)}</p>`).join('') : `<p>${L == 'es' ? 'Sin perfil en español.' : 'No English profile yet.'}</p>`;
    };
    show();
    p.querySelectorAll('[data-l]').forEach(b => b.onclick = () => {
      L = b.dataset.l;
      p.querySelectorAll('[data-l]').forEach(x => x.classList.toggle('on', x == b));
      show();
    });
    p.querySelectorAll('[data-wd]').forEach(b => {
      if (!n[b.dataset.wd]) {
        b.disabled = true;
        b.title = b.dataset.wd == 'es' ? 'Sin perfil en español' : 'No English profile yet';
      }
      b.onclick = async () => {
        const m = $('#wdmsg');
        b.disabled = true;
        const old = b.textContent;
        b.textContent = 'Generando…';
        if (m) m.textContent = 'Generando el documento Word…';
        try {
          const r = await wordDoc([n], b.dataset.wd, profFileName(n));
          if (m) {
            m.innerHTML = '';
            if (r && r.blob) {
              const a = document.createElement('a');
              a.href = URL.createObjectURL(r.blob);
              a.download = r.name;
              a.textContent = 'Descargar ' + r.name;
              a.style.cssText = 'font-weight:700;text-decoration:underline';
              m.appendChild(a);
              const s = document.createElement('div');
              s.style.cssText = 'font-size:12px;color:var(--mu);margin-top:4px';
              s.textContent = 'La descarga debió empezar sola; si no, pulsa el enlace.';
              m.appendChild(s);
            } else {
              m.textContent = 'Documento generado.';
            }
          }
        } catch (e) {
          if (m) m.textContent = 'No se pudo generar el Word; inténtalo de nuevo.';
        }
        b.disabled = false;
        b.textContent = old;
      };
    });
    $('#pc').onclick = () => {
      S.sel = null;
      draw();
      p.hidden = true;
    };
  }

  function panel() {
    const n = node(S.sel), p = $('#panel');
    if (!n) {
      p.hidden = true;
      return;
    }
    p.hidden = false;
    if (VIEW) {
      viewPanel(n, p);
      return;
    }
    const bad = new Set([n.id]);
    let ch = 1;
    while (ch) {
      ch = 0;
      S.nodes.forEach(m => {
        if (bad.has(m.p) && !bad.has(m.id)) {
          bad.add(m.id);
          ch = 1;
        }
      });
    }
    const po = S.nodes.filter(m => m.t == n.t && !bad.has(m.id)).map(m => `<option value="${m.id}"${n.p == m.id ? ' selected' : ''}>${esc(m.title)}${m.name ? ' – ' + esc(m.name) : ''}</option>`).join('');
    p.innerHTML = `<div id="phandle" title="Arrastra para cambiar el ancho del panel" role="separator" aria-orientation="vertical" aria-label="Cambiar el ancho del panel"></div>
    <div class="row" style="margin:0 0 8px;justify-content:space-between;align-items:center">
      <button id="swView" style="flex:1">👁️ Ver ficha de lectura</button>
      <button id="pc" title="Cerrar panel">✕</button>
    </div>
    <div class="row tabs" style="margin:0 0 8px"><button data-l="es" class="on">Español</button><button data-l="en">English</button></div>
    <div class="row" style="margin:0">
      <div style="display:flex;flex-direction:column;gap:4px;align-items:center">
        <div id="ph" title="Haz clic para cambiar la foto">${n.photo ? `<img src="${n.photo}" style="width:110px;height:130px;object-fit:cover;border-radius:8px">` : '+ Foto'}</div>
        ${n.photo ? `<button id="phdel" style="font-size:11px;padding:2px 6px;width:110px">Quitar foto</button>` : ''}
      </div>
      <div style="flex:1">
        <label>Nombre</label><input id="pn" value="${esc(n.name)}">
        <label>Cargo / dependencia</label><input id="pt" value="${esc(n.title)}">
      </div>
    </div>
    <input type="file" id="pf" accept="image/*" hidden>
    <label>Biografía / Perfil (<span id="langlbl">Español</span>)</label>
    <textarea id="pd" placeholder="Perfil / Profile"></textarea>
    <label>Dependiente de</label><select id="pp"><option value="">— (cabeza del árbol, sin superior) —</option>${po}</select>
    <div class="row"><button id="pa" class="p">+ Dependiente</button><button id="pdel">Eliminar cargo</button></div>
    <label>Descargar perfil en Word</label><div class="row"><button data-w="es">ES</button><button data-w="en">EN</button><button data-w="both">ES + EN</button></div>`;
    bindResizeHandle(p);
    $('#swView').onclick = () => setMode('view');
    $('#pc').onclick = () => {
      S.sel = null;
      draw();
      p.hidden = true;
    };
    let L = 'es';
    const ta = $('#pd');
    ta.value = n.es || '';
    p.querySelectorAll('[data-l]').forEach(b => b.onclick = () => {
      L = b.dataset.l;
      p.querySelectorAll('[data-l]').forEach(x => x.classList.toggle('on', x == b));
      const lbl = $('#langlbl');
      if (lbl) lbl.textContent = L == 'es' ? 'Español' : 'English';
      ta.value = n[L] || '';
    });
    ta.oninput = () => {
      n[L] = ta.value;
      save();
    };
    $('#pn').oninput = e => {
      n.name = e.target.value;
      save();
      draw();
    };
    $('#pt').oninput = e => {
      n.title = e.target.value;
      save();
      draw();
    };
    $('#pp').onchange = e => {
      n.p = e.target.value || null;
      save();
      draw();
    };
    $('#ph').onclick = () => $('#pf').click();
    const phdel = $('#phdel');
    if (phdel) {
      phdel.onclick = () => {
        n.photo = '';
        n.noPhoto = 1;
        save();
        panel();
      };
    }
    $('#pf').onchange = e => {
      const f = e.target.files[0];
      if (!f) return;
      const r = new FileReader();
      r.onload = () => {
        n.photo = r.result;
        delete n.noPhoto;
        save();
        panel();
      };
      r.readAsDataURL(f);
    };
    $('#pa').onclick = () => {
      const m = { id: uid(), t: n.t, p: n.id, name: '', title: 'Nuevo cargo', photo: '', es: '', en: '' };
      S.nodes.push(m);
      S.sel = m.id;
      save();
      draw();
      side();
      panel();
    };
    $('#pdel').onclick = async () => {
      if (!await ask('¿Eliminar este cargo y todos sus dependientes?')) return;
      const gone = new Set([n.id]);
      let c = 1;
      while (c) {
        c = 0;
        S.nodes.forEach(m => {
          if (gone.has(m.p) && !gone.has(m.id)) {
            gone.add(m.id);
            c = 1;
          }
        });
      }
      S.trees.forEach(t => {
        if (gone.has(t.link)) t.link = null;
      });
      S.nodes = S.nodes.filter(m => !gone.has(m.id));
      S.sel = null;
      save();
      draw();
      side();
      panel();
    };
    p.querySelectorAll('[data-w]').forEach(b => b.onclick = () => wordDoc([n], b.dataset.w, profFileName(n)));
  }

  function instSiglas(t) {
    if (!t) return '';
    const nm = t.name || '';
    const pm = nm.match(/\(([^)]+)\)/);
    if (pm) return pm[1].trim().replace(/[^\w\u00C0-\u00FF-]+/g, '');
    const dm = nm.match(/^([A-Z\u00C1\u00C9\u00CD\u00D3\u00DA\u00D1]{2,})\s*[\u2013\u2014-]/);
    if (dm) return dm[1];
    const map = { dod: 'DOD', army: 'ARMY', af: 'USAF', navy: 'USN', state: 'DOS', wh: 'WH' };
    if (map[t.id]) return map[t.id];
    const stop = new Set(['of', 'the', 'and', 'for', 'de', 'la', 'el', 'los', 'las', 'y']);
    const ws = nm.replace(/[^A-Za-z\u00C0-\u00FF\s]/g, ' ').split(/\s+/).filter(Boolean).filter(w => !stop.has(w.toLowerCase()));
    const ac = ws.map(w => w[0].toUpperCase()).join('');
    return ac || String(t.id || '').toUpperCase();
  }

  function versionMarca() {
    const now = new Date(), p2 = n => String(n).padStart(2, '0');
    return 'V ' + p2(now.getDate()) + '.' + p2(now.getMonth() + 1) + '.' + p2(now.getFullYear() % 100) + ' ' + (now.getHours() < 12 ? 'AM' : 'PM');
  }

  function profFileName(n) {
    const clean = s => String(s || '').replace(/[\\/:*?"<>|]/g, '').trim();
    let ini = '', last = '';
    const raw = clean(String(n.name || '').split(',')[0]);
    if (raw) {
      const ranks = new Set(['dr', 'dra', 'ltgen', 'majgen', 'briggen', 'gen', 'col', 'maj', 'capt', 'lt', 'sgt', 'csm', 'amb', 'hon', 'mr', 'mrs', 'ms', 'sgtmaj', 'adm', 'vadm', 'radm']);
      const toks = raw.split(/\s+/).filter(Boolean);
      const ftoks = toks.filter(tok => !ranks.has(tok.replace(/\./g, '').toLowerCase()));
      const use = ftoks.length ? ftoks : toks;
      const ft = use[0] || '';
      ini = clean(ft).replace(/^[^A-Za-z\u00C0-\u00FF]*/, '').charAt(0).toUpperCase();
      let lt = use.length ? use[use.length - 1] : '';
      if (use.length > 2 && /^[A-Za-z\u00C0-\u00FF]\.?$/.test(lt)) lt = use[use.length - 2];
      last = clean(lt).replace(/[^A-Za-z\u00C0-\u00FF'-]/g, '');
    } else {
      last = clean(n.title || 'Perfil').replace(/\W+/g, ' ').trim();
    }
    const siglas = instSiglas(tree(n.t));
    const parts = ['Perfil'];
    if (ini) parts.push(ini);
    if (last) parts.push(last);
    if (siglas) parts.push(siglas);
    parts.push(versionMarca());
    parts.push('Borrador JPGBM');
    return parts.join(' ');
  }

  function bulkFileName(t) {
    const siglas = instSiglas(t);
    const parts = ['Perfiles'];
    if (siglas) parts.push(siglas);
    parts.push(versionMarca());
    parts.push('Borrador JPGBM');
    return parts.join(' ');
  }

  async function wordDoc(list, lang, fname) {
    const {
      Document, Packer, Paragraph, TextRun, ImageRun, AlignmentType, PageBreak,
      HorizontalPositionRelativeFrom: HR, HorizontalPositionAlign: HA,
      VerticalPositionRelativeFrom: VR, VerticalPositionAlign: VA,
      TextWrappingType: TW, TextWrappingSide: TS, LineRuleType, Header, Footer, PageNumber
    } = docx, ch = [], now = new Date(), p2 = n => String(n).padStart(2, '0'), yy = p2(now.getFullYear() % 100);
    const dt = l => l == 'es' ? p2(now.getDate()) + '.' + p2(now.getMonth() + 1) + '.' + yy : p2(now.getMonth() + 1) + '.' + p2(now.getDate()) + '.' + yy;
    const run = (t, o) => new TextRun({ text: t, font: 'Arial', size: 24, ...(o || {}) });
    let first = true;
    const db = s => {
      const b = atob(s.split(',')[1]), u = new Uint8Array(b.length);
      for (let j = 0; j < b.length; j++) u[j] = b.charCodeAt(j);
      return u;
    };
    const wm = await new Promise(r => {
      const im = new Image();
      im.onload = () => {
        try {
          const W = 470, H = Math.round(W * im.height / im.width), cv = document.createElement('canvas');
          cv.width = W;
          cv.height = H;
          const cx = cv.getContext('2d');
          cx.globalAlpha = .15;
          cx.drawImage(im, 0, 0, W, H);
          r({ u: db(cv.toDataURL('image/png')), w: W, h: H });
        } catch (e) {
          r(null);
        }
      };
      im.onerror = () => r(null);
      im.src = LOGO;
    });
    const hdrRuns = [];
    if (wm) hdrRuns.push(new ImageRun({
      type: 'png', data: wm.u, transformation: { width: wm.w, height: wm.h },
      floating: {
        horizontalPosition: { relative: HR.PAGE, align: HA.CENTER },
        verticalPosition: { relative: VR.PAGE, align: VA.CENTER },
        allowOverlap: true, behindDocument: true, wrap: { type: TW.NONE }
      }
    }));
    hdrRuns.push(new ImageRun({ type: 'png', data: db(LOGO), transformation: { width: 170, height: 81 } }));
    const hdr = new Header({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: hdrRuns })] });
    const ftr = new Footer({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ children: [PageNumber.CURRENT], font: 'Arial', size: 24 })] })] });
    for (const n of list) for (const l of (lang == 'both' ? ['es', 'en'] : [lang])) {
      if (!first) ch.push(new Paragraph({ children: [new PageBreak()] }));
      first = false;
      const inst = (tree(n.t) || {}).name || '';
      let ttl = (n.name || n.title) + (n.name ? ', ' + n.title : '');
      if (inst && ttl.indexOf(inst) < 0) ttl += ', ' + inst;
      ch.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { line: 240, after: 0 }, children: [run(ttl, { bold: true })] }));
      ch.push(new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { line: 240, after: 160 }, run: { font: 'Arial', size: 18 }, children: [new TextRun({ text: 'V ' + dt(l) + '. ' + (now.getHours() < 12 ? 'AM' : 'PM'), font: 'Arial', size: 18 })] }));
      let img = null;
      if (n.photo) {
        const im = await new Promise(r => {
          const x = new Image();
          x.onload = () => r(x);
          x.src = n.photo;
        }), b = atob(n.photo.split(',')[1]), u = new Uint8Array(b.length);
        for (let j = 0; j < b.length; j++) u[j] = b.charCodeAt(j);
        img = new ImageRun({
          type: n.photo.indexOf('data:image/png') == 0 ? 'png' : 'jpg',
          data: u,
          transformation: { width: 189, height: Math.round(189 * im.height / im.width) },
          floating: {
            horizontalPosition: { relative: HR.MARGIN, align: HA.LEFT },
            verticalPosition: { relative: VR.PARAGRAPH, offset: 13970 },
            allowOverlap: true, behindDocument: false,
            wrap: { type: TW.TIGHT, side: TS.BOTH_SIDES },
            margins: { left: 114300, right: 114300 }
          }
        });
      }
      paras(n[l] || '—').forEach((t, i) => ch.push(new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 160, line: 360, lineRule: LineRuleType.AT_LEAST },
        children: (i == 0 && img ? [img] : []).concat([run(t)])
      })));
    }
    const buf = await (await Packer.toBlob(new Document({
      styles: { default: { document: { run: { font: 'Arial', size: 24 } } } },
      sections: [{
        properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1134, right: 1418, bottom: 1134, left: 1418, header: 720, footer: 720 } } },
        headers: { default: hdr }, footers: { default: ftr }, children: ch
      }]
    }))).arrayBuffer();
    const z = await JSZip.loadAsync(buf);
    let x = await z.file('word/document.xml').async('string');
    const fixR = s => s.replace(/<w:rPr>([\s\S]*?)<\/w:rPr>/g, (m, g) => {
      const f = g.match(/<w:rFonts[^>]*\/>/);
      return f ? '<w:rPr>' + f[0] + g.replace(f[0], '') + '</w:rPr>' : m;
    });
    x = x.replace(/<wp:wrapTight\/>/g, '<wp:wrapTight wrapText="bothSides"><wp:wrapPolygon edited="0"><wp:start x="0" y="0"/><wp:lineTo x="0" y="21600"/><wp:lineTo x="21600" y="21600"/><wp:lineTo x="21600" y="0"/><wp:lineTo x="0" y="0"/></wp:wrapPolygon></wp:wrapTight>');
    x = fixR(x);
    z.file('word/document.xml', x);
    for (const nm of Object.keys(z.files)) if (/^word\/(styles|header\d*|footer\d*)\.xml$/.test(nm)) z.file(nm, fixR(await z.file(nm).async('string')));
    const blob = await z.generateAsync({ type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    dl(blob, fname + '.docx');
    return { blob: blob, name: fname + '.docx' };
  }

  function ask(msg, inp) {
    return new Promise(res => {
      const d = $('#dlg'), i = $('#di');
      $('#dm').textContent = msg;
      i.hidden = !inp;
      i.value = '';
      d.hidden = false;
      if (inp) setTimeout(() => i.focus(), 50);
      const done = v => {
        d.hidden = true;
        res(v);
      };
      $('#dok').onclick = () => done(inp ? i.value.trim() : true);
      $('#dno').onclick = () => done(inp ? null : false);
      i.onkeydown = e => {
        if (e.key == 'Enter') $('#dok').click();
      };
    });
  }

  async function dl(blob, name) {
    const isiOS = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform == 'MacIntel' && navigator.maxTouchPoints > 1);
    if (isiOS && navigator.canShare) {
      try {
        const f = new File([blob], name, { type: blob.type || 'application/octet-stream' });
        if (navigator.canShare({ files: [f] })) {
          await navigator.share({ files: [f] });
          return;
        }
      } catch (e) {
        if (e && e.name == 'AbortError') return;
      }
    }
    const u = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = u;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      a.remove();
      URL.revokeObjectURL(u);
    }, 60000);
  }

  // Interacciones del lienzo
  const st = $('#stage');
  let drag = null;
  let vanim = null, lastTap = { id: null, t: 0 };

  function stopAnim() {
    if (vanim) {
      cancelAnimationFrame(vanim);
      vanim = null;
    }
  }

  function animView(tx, ty, tk) {
    stopAnim();
    const sx = V.x, sy = V.y, sk = V.k;
    let rm = false;
    try { rm = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
    if (rm) {
      V.x = tx;
      V.y = ty;
      V.k = tk;
      apply();
      return;
    }
    const t0 = performance.now(), dur = 380;
    const step = t => {
      const u = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - u, 3);
      V.x = sx + (tx - sx) * e;
      V.y = sy + (ty - sy) * e;
      V.k = sk + (tk - sk) * e;
      apply();
      vanim = u < 1 ? requestAnimationFrame(step) : null;
    };
    vanim = requestAnimationFrame(step);
  }

  function focusCard(id) {
    const n = node(id);
    if (!n || !LAY || !LAY.P[id]) return;
    const p = LAY.P[id], cw = NW, ch = hh(n), r = st.getBoundingClientRect();
    let tp = 20;
    ['#mn', '#devcorn', '#qwrap'].forEach(function (s) {
      const e = $(s);
      if (e && getComputedStyle(e).display != 'none') tp = Math.max(tp, e.getBoundingClientRect().bottom - r.top + 12);
    });
    let bp = 20;
    const z = $('#zoom');
    if (z && getComputedStyle(z).display != 'none') bp = Math.max(bp, r.bottom - z.getBoundingClientRect().top + 12);
    let x0 = p.x, y0 = p.y, x1 = p.x + cw, y1 = p.y + ch, prev = null, next = null;
    const horiz = ORIENT != 'h';
    LAY.ids.forEach(function (i) {
      if (i == id) return;
      const q = LAY.P[i];
      if (!q) return;
      const qw = NW, qh = hh(node(i));
      if (horiz) {
        if (Math.min(y1, q.y + qh) - Math.max(y0, q.y) <= -GY) return;
        if (q.x + qw <= p.x + 1 && (!prev || q.x + qw > prev.x + prev.w)) prev = { x: q.x, y: q.y, w: qw, h: qh };
        if (q.x >= p.x + cw - 1 && (!next || q.x < next.x)) next = { x: q.x, y: q.y, w: qw, h: qh };
      } else {
        if (Math.min(x1, q.x + qw) - Math.max(x0, q.x) <= -GY) return;
        if (q.y + qh <= p.y + 1 && (!prev || q.y + qh > prev.y + prev.h)) prev = { x: q.x, y: q.y, w: qw, h: qh };
        if (q.y >= p.y + ch - 1 && (!next || q.y < next.x)) next = { x: q.x, y: q.y, w: qw, h: qh };
      }
    });
    if (horiz) {
      x0 = prev ? prev.x : p.x - (cw + GX);
      x1 = next ? next.x + next.w : p.x + cw + (cw + GX);
      if (prev) { y0 = Math.min(y0, prev.y); y1 = Math.max(y1, prev.y + prev.h); }
      if (next) { y0 = Math.min(y0, next.y); y1 = Math.max(y1, next.y + next.h); }
      y0 -= GY * .7;
      y1 += GY * .7;
    } else {
      y0 = prev ? prev.y : p.y - (ch + GX);
      y1 = next ? next.y + next.h : p.y + ch + (ch + GX);
      if (prev) { x0 = Math.min(x0, prev.x); x1 = Math.max(x1, prev.x + prev.w); }
      if (next) { x0 = Math.min(x0, next.x); x1 = Math.max(x1, next.x + next.w); }
      x0 -= GY * .7;
      x1 += GY * .7;
    }
    x0 -= 8; x1 += 8; y0 -= 8; y1 += 8;
    const bw = x1 - x0, bh = y1 - y0, aw = Math.max(60, r.width - 40), ah = Math.max(60, r.height - tp - bp), k = Math.max(.15, Math.min(3, aw / bw, ah / bh));
    animView(20 + (aw - bw * k) / 2 - x0 * k, tp + (ah - bh * k) / 2 - y0 * k, k);
  }

  function openCard(id) {
    lastTap = { id: null, t: 0 };
    S.sel = id;
    draw();
    panel();
  }

  st.onpointerdown = e => {
    stopAnim();
    drag = {
      t: e.target.closest('.ttl'),
      x: e.clientX, y: e.clientY,
      vx: V.x, vy: V.y, m: 0,
      c: e.target.closest('.card'),
      g: e.target.closest('.tg'),
      p: e.target.closest('.pf')
    };
  };
  window.onpointermove = e => {
    if (!drag) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (Math.abs(dx) + Math.abs(dy) > 4) drag.m = 1;
    if (drag.m) {
      V.x = drag.vx + dx;
      V.y = drag.vy + dy;
      apply();
    }
  };
  window.onpointerup = () => {
    if (drag && !drag.m && drag.p) {
      openCard(drag.p.dataset.pf);
    } else if (drag && !drag.m && drag.g) {
      const n = node(drag.c.dataset.id);
      n.c = n.c ? 0 : 1;
      save();
      draw();
    } else if (drag && !drag.m && drag.t) {
      S.tree = drag.t.dataset.t;
      save();
      side();
    } else if (drag && !drag.m && drag.c) {
      const id = drag.c.dataset.id, now = Date.now();
      if (!VIEW && DEV == 'desktop') {
        openCard(id);
      } else if (lastTap.id == id && now - lastTap.t < 450) {
        openCard(id);
      } else {
        lastTap = { id: id, t: now };
        focusCard(id);
      }
    }
    drag = null;
  };
  st.addEventListener('dblclick', e => {
    const c = e.target.closest('.card');
    if (!c || e.target.closest('.tg') || e.target.closest('.pf')) return;
    openCard(c.dataset.id);
  });

  function zoom(f, cx, cy) {
    stopAnim();
    const r = st.getBoundingClientRect();
    cx = cx ?? r.width / 2;
    cy = cy ?? r.height / 2;
    const k = Math.max(.1, Math.min(3, V.k * f));
    V.x = cx - (cx - V.x) * k / V.k;
    V.y = cy - (cy - V.y) * k / V.k;
    V.k = k;
    apply();
  }

  st.addEventListener('wheel', e => {
    e.preventDefault();
    const r = st.getBoundingClientRect();
    zoom(e.deltaY < 0 ? 1.12 : .89, e.clientX - r.left, e.clientY - r.top);
  }, { passive: false });

  $('#fa').onclick = () => {
    S.nodes.forEach(n => { n.c = kids(n.id).length && n.p ? 1 : 0; });
    save();
    draw(1);
  };
  $('#ua').onclick = () => {
    S.nodes.forEach(n => n.c = 0);
    save();
    draw(1);
  };
  $('#zf').onclick = fitView;

  function selectView(v) {
    if (!v) return;
    S.view = v;
    if (v != 'all') S.tree = v;
    S.sel = null;
    save();
    draw(1);
    side();
    panel();
    if (VIEW && (innerWidth <= 800 || DEV == 'mobile')) document.body.classList.add('noside');
  }

  const vel2 = $('#view');
  if (vel2) vel2.onchange = e => selectView(e.target.value);

  document.addEventListener('click', e => {
    const a = e.target.closest('.arr[data-a]');
    if (a) {
      const t = tree(a.dataset.a);
      t.c = t.c ? 0 : 1;
      save();
      side();
      return;
    }
    const r = e.target.closest('.tr');
    if (r) selectView(r.dataset.v || r.dataset.t);
  });

  document.addEventListener('keydown', e => {
    if (e.key != 'Enter' && e.key != ' ') return;
    const r = e.target.closest && e.target.closest('.tr');
    if (r && !e.target.closest('.arr[data-a]')) {
      e.preventDefault();
      selectView(r.dataset.v || r.dataset.t);
    }
  });

  document.addEventListener('change', e => {
    const t = tree(S.tree);
    if (!t) return;
    if (e.target.id == 'tn') { t.name = e.target.value; save(); draw(); side(); }
    if (e.target.id == 'tl') { t.link = e.target.value || null; save(); draw(1); side(); }
  });

  document.addEventListener('click', async e => {
    if (e.target.id != 'td') return;
    const t = tree(S.tree);
    if (!await ask('¿Eliminar el árbol "' + t.name + '" y todos sus cargos?')) return;
    const ids = new Set(S.nodes.filter(n => n.t == t.id).map(n => n.id));
    S.trees.forEach(u => { if (ids.has(u.link)) u.link = null; });
    S.nodes = S.nodes.filter(n => n.t != t.id);
    S.trees = S.trees.filter(u => u.id != t.id);
    S.tree = S.trees[0] && S.trees[0].id;
    if (S.view != 'all') S.view = 'all';
    S.sel = null;
    save();
    draw(1);
    side();
    panel();
  });

  $('#newT').onclick = async () => {
    const name = await ask('Nombre del nuevo árbol (departamento, agencia…)', 1);
    if (!name) return;
    const t = { id: uid(), name, link: null }, n = { id: uid(), t: t.id, p: null, name: '', title: name, photo: '', es: '', en: '' };
    S.trees.push(t);
    S.nodes.push(n);
    S.tree = t.id;
    S.view = t.id;
    S.sel = n.id;
    save();
    draw(1);
    side();
    panel();
  };

  $('#wAll').onclick = () => {
    const t = tree(S.tree);
    wordDoc(S.nodes.filter(n => n.t == t.id && n.name), 'both', bulkFileName(t));
  };

  $('#exp').onclick = () => dl(new Blob([JSON.stringify(S)], { type: 'application/json' }), 'organigramas_respaldo.json');
  const expDataJs = $('#expDataJs');
  if (expDataJs) {
    expDataJs.onclick = () => {
      const linksObj = {};
      S.trees.forEach(t => { if (t.link) linksObj[t.id] = t.link; });
      const tArr = S.trees.map(t => [t.id, t.name]);
      const dObj = {};
      const extraPhotos = {};
      S.trees.forEach(t => { dObj[t.id] = []; });
      S.nodes.forEach(n => {
        if (!dObj[n.t]) dObj[n.t] = [];
        dObj[n.t].push([n.id, n.p || 0, n.name || '', n.title || '', n.es || '', n.en || '']);
        if (n.photo && (!PH || PH[n.id] !== n.photo)) {
          extraPhotos[n.id] = n.photo;
        }
      });
      const dLines = Object.keys(dObj).map(tid => {
        const rows = dObj[tid].map(r => '  ' + JSON.stringify(r)).join(',\n');
        return ' ' + JSON.stringify(tid) + ': [\n' + rows + '\n ]';
      }).join(',\n');
      const extraPhCode = Object.keys(extraPhotos).length
        ? `\nif (typeof PH !== 'undefined') Object.assign(PH, ${JSON.stringify(extraPhotos)});\n`
        : '';
      const code = `// Datos de los árboles y perfiles bilingües (generado desde el editor)\nconst ARCH = 'Fuente: sitio archivado del Departamento de Estado (2021–2025); verificar vigencia del cargo.';\nconst NOTE = 'Pendiente: la diapositiva original repite el nombre de otro cargo; verificar.';\n${extraPhCode}function seed(){\n const LINKS = ${JSON.stringify(linksObj)};\n const T = ${JSON.stringify(tArr)}.map(([id,name])=>({id,name,link:LINKS[id]||null}));\n const D = {\n${dLines}\n };\n const N=[];for(const t in D)D[t].forEach(([id,p,name,title,es,en])=>N.push({id,t,p:p||null,name,title,photo:(typeof PH!=='undefined'&&PH[id])||'',es:es||'',en:en||''}));\n return{trees:T,nodes:N,view:'all',tree:'jcs',sel:null,v:7};\n}\n`;
      dl(new Blob([code], { type: 'application/javascript;charset=utf-8' }), 'data.js');
      showSaved('✓ Archivo data.js descargado (reemplázalo en la carpeta js/)');
    };
  }
  $('#imp').onclick = () => $('#impf').click();
  $('#impf').onchange = e => {
    const f = e.target.files[0];
    if (!f) return;
    f.text().then(x => {
      try {
        const d = JSON.parse(x);
        if (!d.trees || !d.nodes) throw 0;
        S = hydratePhotos(d);
        save();
        draw(1);
        side();
        panel();
        $('#msg').textContent = '✓ Respaldo importado correctamente';
      } catch (_) {
        $('#msg').textContent = 'Archivo no válido';
      }
    });
  };

  const resetBtn = $('#resetBtn');
  if (resetBtn) {
    resetBtn.onclick = async () => {
      if (!await ask('¿Restablecer los datos originales (data.js)? Se descartarán los cambios guardados en el navegador.')) return;
      localStorage.removeItem(KEY);
      saveIDB({});
      S = seed();
      draw(1);
      side();
      panel();
      showSaved('✓ Datos originales restablecidos');
    };
  }

  function wrap(c, s, w, max) {
    const ws = String(s || '').split(/\s+/), L = [];
    let cur = '';
    ws.forEach(x => {
      const tt = cur ? cur + ' ' + x : x;
      if (c.measureText(tt).width > w && cur) {
        L.push(cur);
        cur = x;
      } else cur = tt;
    });
    if (cur) L.push(cur);
    if (L.length > max) {
      L.length = max;
      L[max - 1] = L[max - 1].replace(/\s*\S*$/, '') + '…';
    }
    return L;
  }

  function png() {
    if (!LAY) return;
    const { P, E, ids } = LAY, pad = 30, top = 64, k = Math.min(2, 7000 / (W0 + 2 * pad)), w = W0 + 2 * pad, h = H0 + top + pad, cv = document.createElement('canvas');
    cv.width = w * k;
    cv.height = h * k;
    const c = cv.getContext('2d');
    c.scale(k, k);
    c.fillStyle = '#fff';
    c.fillRect(0, 0, w, h);
    const nm = S.view == 'all' ? 'Todos los árboles vinculados' : (tree(S.view) || {}).name;
    c.fillStyle = '#0A1D38';
    c.font = 'bold 22px Georgia,serif';
    c.textBaseline = 'alphabetic';
    c.fillText('Organigrama — ' + nm, pad, 36);
    c.font = '12px Georgia,serif';
    c.fillStyle = '#666';
    c.textAlign = 'right';
    c.fillText(new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' }), w - pad, 36);
    c.textAlign = 'left';
    c.strokeStyle = '#0A1D38';
    c.lineWidth = 1.5;
    c.beginPath();
    c.moveTo(pad, 46);
    c.lineTo(w - pad, 46);
    c.stroke();
    c.translate(pad, top);
    c.strokeStyle = '#9A9689';
    c.lineWidth = 1.2;
    E.forEach(d => c.stroke(new Path2D(d)));
    const rr = (x, y, ww, hh, r) => {
      c.beginPath();
      c.roundRect ? c.roundRect(x, y, ww, hh, r) : c.rect(x, y, ww, hh);
    };
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    const MP = DEV == 'mobile';
    ids.forEach(i => {
      const n = node(i);
      if (!n.p && BND[i]) {
        const b = BND[i];
        rr(b.x, b.y, b.w, b.h, 4);
        c.fillStyle = tcol(n.t);
        c.fill();
        c.fillStyle = '#fff';
        c.font = `bold ${MP ? 19 : 11}px Georgia,serif`;
        const L = wrap(c, tree(n.t).name, b.w - 16, 99);
        L.forEach((s, j) => c.fillText(s, b.x + b.w / 2, b.y + b.h / 2 + (j - (L.length - 1) / 2) * (MP ? 24 : 13)));
      }
    });
    ids.forEach(i => {
      const n = node(i), p = P[i], s = cst(n);
      c.save();
      c.shadowColor = 'rgba(0,0,0,.25)';
      c.shadowBlur = 3;
      c.shadowOffsetY = 1;
      rr(p.x, p.y, NW, hh(n), 4);
      c.fillStyle = s.bg;
      c.fill();
      c.restore();
      rr(p.x, p.y, NW, hh(n), 4);
      c.strokeStyle = 'rgba(0,0,0,.22)';
      c.lineWidth = 1;
      c.stroke();
      const lt = MP ? 21 : 13.8, ln = MP ? 29.5 : 14.6;
      c.fillStyle = s.fg;
      c.font = `${MP ? 16 : 11}px Georgia,serif`;
      const T = wrap(c, n.title, NW - 18, 99);
      c.font = `bold ${MP ? 23 : 12}px Georgia,serif`;
      const Nn = n.name ? wrap(c, n.name, NW - 18, 99) : [], th = T.length * lt + Nn.length * ln, y0 = p.y + (hh(n) - th) / 2 + lt / 2;
      c.font = `${MP ? 16 : 11}px Georgia,serif`;
      T.forEach((l, j) => c.fillText(l, p.x + NW / 2, y0 + j * lt));
      c.font = `bold ${MP ? 23 : 12}px Georgia,serif`;
      Nn.forEach((l, j) => c.fillText(l, p.x + NW / 2, y0 + T.length * lt + j * ln));
    });
    const u = cv.toDataURL('image/png');
    window.__OVU = u;
    {
      const c2 = document.createElement('canvas');
      c2.width = cv.width;
      c2.height = cv.height - 64 * k;
      c2.getContext('2d').drawImage(cv, 0, 64 * k, cv.width, c2.height, 0, 0, cv.width, c2.height);
      window.__OVW = c2.toDataURL('image/png');
    }
    $('#ovi').src = u;
    $('#ova').href = u;
    $('#ov').hidden = false;
    const qw = $('#qwrap');
    if (qw) qw.style.display = 'none';
  }

  function shareData() {
    let keep;
    if (S.view == 'all') keep = new Set(S.trees.map(x => x.id));
    else {
      keep = new Set([S.view]);
      let ch = 1;
      while (ch) {
        ch = 0;
        S.trees.forEach(u => {
          const l = u.link && node(u.link);
          if (l && keep.has(l.t) && !keep.has(u.id)) {
            keep.add(u.id);
            ch = 1;
          }
        });
      }
    }
    const clean = s => (s || '').replace(/Pendiente:.*?\.(\s|$)/g, '').replace('Fuente: sitio archivado del Departamento de Estado (2021–2025); verificar vigencia del cargo.', '').replace('Designado en abril de 2024 según contenido archivado (2021–2025); verificar vigencia.', '').trim();
    const d = {
      trees: S.trees.filter(x => keep.has(x.id)).map(x => ({ ...x, ci: cix(x.id) })),
      nodes: S.nodes.filter(n => keep.has(n.t)).map(n => ({ ...n, es: clean(n.es), en: clean(n.en) })),
      view: S.view,
      tree: S.view == 'all' ? S.tree : S.view,
      sel: null,
      v: 7
    };
    if (S.view != 'all') d.trees.find(x => x.id == S.view).link = null;
    return d;
  }

  function getAppStyles() {
    if (window.__CSS_TEXT) return window.__CSS_TEXT;
    const inlineStyle = document.getElementById('inline-styles');
    if (inlineStyle && inlineStyle.textContent) return inlineStyle.textContent;
    let css = '';
    try {
      for (const sheet of document.styleSheets) {
        for (const rule of sheet.cssRules) css += rule.cssText + '\n';
      }
    } catch (e) {}
    return css;
  }

  function shareHTML(d) {
    const nm = S.view == 'all' ? 'Organigramas DOD / JCS' : tree(S.view).name;
    const shellClone = document.body.cloneNode(true);
    shellClone.querySelectorAll('script, style, link, #modeselect').forEach(e => e.remove());
    const p = shellClone.querySelector('#panel');
    if (p) { p.hidden = true; p.innerHTML = ''; }
    const sh = shellClone.querySelector('#sh');
    if (sh) sh.hidden = true;
    const jszipCode = window.__JSZIP_FN ? `!function(e){window.JSZip=e()}(${window.__JSZIP_FN.toString()});` : '';
    const docxCode = window.__DOCX_FN ? `(function(g,f){f(g.docx={})})(window,${window.__DOCX_FN.toString()});` : '';
    const appCode = `const LOGO=${JSON.stringify(LOGO)};const PH={};function seed(){return window.__DATA;}\nwindow.__VIEW=1;window.__FORCE_VIEW=1;window.__DATA=${JSON.stringify(d).replace(/</g, '\\u003c')};\n(${window.__APP_FN.toString()})();`;
    return '<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + esc(nm) + '</title><style>' + getAppStyles() + '</style></head><body class="view">' + shellClone.innerHTML + '<script>' + jszipCode.replace(/<\/script>/g, '<\\/script>') + '<\/script><script>' + docxCode.replace(/<\/script>/g, '<\\/script>') + '<\/script><script>' + appCode.replace(/<\/script>/g, '<\\/script>') + '<\/script></body></html>';
  }

  $('#share').onclick = () => {
    const d = shareData(), h = shareHTML(d), u = URL.createObjectURL(new Blob([h], { type: 'text/html' })), nm = S.view == 'all' ? 'Organigramas' : tree(S.view).name;
    $('#sha').href = u;
    $('#sha').download = ('Organigrama_' + nm.replace(/[^\w]+/g, '_').slice(0, 40) + '.html');
    $('#shi').textContent = 'Incluye: ' + nm + ' — ' + d.nodes.length + ' cargos, ' + d.nodes.filter(n => n.photo).length + ' fotos (' + (h.length / 1048576).toFixed(1) + ' MB).';
    $('#sh').hidden = false;
  };
  $('#shc').onclick = () => $('#sh').hidden = true;

  function unlockOwner() {
    IS_OWNER = true;
    try { localStorage.setItem(OWNER_KEY, '1'); } catch (e) {}
    const ms = $('#modeselect');
    if (ms) ms.hidden = false;
    const g = $('#gate');
    if (g) g.hidden = true;
    document.body.style.overflow = '';
  }

  // Pantalla de acceso para visitantes (no aparece para el propietario)
  // A quien ya se registró en este navegador no se le vuelve a pedir el
  // nombre; en modo incógnito no queda registro y la puerta sí aparece.
  let YA_REGISTRADO = false;
  try {
    if (localStorage.getItem('orgs_visitante')) YA_REGISTRADO = true;
    else {
      const av = JSON.parse(localStorage.getItem('orgs_visitas_v1') || '[]');
      for (let i = av.length - 1; i >= 0; i--) {
        if (av[i] && av[i].nombre) { localStorage.setItem('orgs_visitante', JSON.stringify({ n: av[i].nombre, e: av[i].correo || '' })); YA_REGISTRADO = true; break; }
      }
    }
  } catch (e) {}
  if (!IS_OWNER && !YA_REGISTRADO) {
    const g = $('#gate'), inp = $('#gname'), eml = $('#gemail'), btn = $('#gbtn');
    if (g && inp && btn) {
      g.hidden = false;
      document.body.style.overflow = 'hidden';
      const correoOk = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      const esClave = v => { const t = v.trim().toLowerCase(); return t === 'jgonzalez' || t === 'admin123'; };
      const chk = () => { btn.disabled = !(esClave(inp.value) || (inp.value.trim().length >= 2 && (!eml || correoOk(eml.value.trim())))); };
      inp.addEventListener('input', chk);
      if (eml) eml.addEventListener('input', chk);
      chk();
      const go = () => {
        const nombre = inp.value.trim();
        if (esClave(nombre)) { unlockOwner(); return; }
        const correo = eml ? eml.value.trim() : '';
        if (nombre.length < 2 || (eml && !correoOk(correo))) return;
        try { localStorage.setItem('orgs_visitante', JSON.stringify({ n: nombre, e: correo })); } catch (e) {}
        btn.disabled = true;
        try {
          let a = JSON.parse(localStorage.getItem('orgs_visitas_v1')) || [];
          if (a.length) { a[a.length - 1].nombre = nombre; a[a.length - 1].correo = correo; }
          localStorage.setItem('orgs_visitas_v1', JSON.stringify(a));
        } catch (e) {}
        try {
          fetch('https://formsubmit.co/ajax/juan.bogotag@gmail.com', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
              name: nombre, email: correo, pagina: 'Organigrama',
              _subject: 'Registro de visitante — Organigrama',
              _template: 'table', _captcha: 'false'
            })
          }).catch(() => {});
        } catch (e) {}
        g.hidden = true;
        document.body.style.overflow = '';
      };
      btn.onclick = go;
      inp.addEventListener('keydown', e => { if (e.key == 'Enter') go(); });
      if (eml) eml.addEventListener('keydown', e => { if (e.key == 'Enter') go(); });
      setTimeout(() => { try { inp.focus(); } catch (e) {} }, 60);
    }
  } else {
    const ms = $('#modeselect');
    if (ms) ms.hidden = false;

    // Visitante que ya se registró y vuelve a entrar: aviso de ingreso
    // (asunto distinto al del registro, etiqueta «Ingresos» en Gmail).
    // El propietario no se reporta. No bloquea la carga si falla la red.
    if (!IS_OWNER && YA_REGISTRADO) {
      try {
        const v = localStorage.getItem('orgs_visitante') || '';
        let reg = null;
        if (v.charAt(0) === '{') { const o = JSON.parse(v); reg = { n: o.n || '', e: o.e || '' }; }
        else if (v) reg = { n: v, e: '' };
        if (reg && reg.n) {
          fetch('https://formsubmit.co/ajax/juan.bogotag@gmail.com', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
              name: reg.n, email: reg.e, pagina: 'Organigrama',
              _subject: 'Ingreso de visitante — Organigrama',
              _template: 'table', _captcha: 'false'
            })
          }).catch(() => {});
        }
      } catch (e) {}
    }
  }

  document.body.classList.add('view');
  if (innerWidth < 800) document.body.classList.add('noside');
  $('#mn').onclick = () => document.body.classList.toggle('noside');

  function setMode(m) {
    if (!IS_OWNER) return;
    VIEW = (m == 'view');
    document.body.classList.toggle('view', VIEW);
    const vs = $('#viewsubtitle');
    if (vs) vs.hidden = !VIEW;
    if (!VIEW) document.body.classList.remove('noside');
    document.querySelectorAll('[data-mode]').forEach(b => {
      b.classList.toggle('on', b.dataset.mode == (VIEW ? 'view' : 'edit'));
      b.setAttribute('aria-pressed', String(b.dataset.mode == (VIEW ? 'view' : 'edit')));
    });
    const mh = $('#modehint');
    if (mh) {
      mh.textContent = VIEW
        ? 'Modo Consulta activo (a ti nunca te pide nombre al entrar).'
        : 'Modo Edición activo: haz clic en cualquier cargo para editarlo.';
    }
    draw();
    side();
    panel();
  }

  document.querySelectorAll('[data-mode]').forEach(b => b.onclick = () => setMode(b.dataset.mode));

  const ptrs = new Map();
  let pd0 = 0;
  st.addEventListener('pointerdown', e => { ptrs.set(e.pointerId, [e.clientX, e.clientY]); });
  st.addEventListener('pointermove', e => {
    if (!ptrs.has(e.pointerId)) return;
    ptrs.set(e.pointerId, [e.clientX, e.clientY]);
    if (ptrs.size == 2) {
      drag = null;
      const [a, b] = [...ptrs.values()], dd = Math.hypot(a[0] - b[0], a[1] - b[1]), r = st.getBoundingClientRect();
      if (pd0) zoom(dd / pd0, (a[0] + b[0]) / 2 - r.left, (a[1] + b[1]) / 2 - r.top);
      pd0 = dd;
    }
  });
  ['pointerup', 'pointercancel'].forEach(ev => st.addEventListener(ev, e => {
    ptrs.delete(e.pointerId);
    pd0 = 0;
  }));

  $('#png').onclick = png;
  $('#ovw').onclick = async () => {
    const u = window.__OVW || window.__OVU;
    if (!u) return;
    const { Document, Packer, Paragraph, ImageRun, AlignmentType } = docx;
    const b = atob(u.split(',')[1]), ua = new Uint8Array(b.length);
    for (let j = 0; j < b.length; j++) ua[j] = b.charCodeAt(j);
    const img = new Image();
    await new Promise(r => { img.onload = r; img.src = u; });
    const sc = Math.min(1056 / img.width, 816 / img.height), W = Math.max(1, Math.round(img.width * sc)), H = Math.max(1, Math.round(img.height * sc));
    const nm = S.view == 'all' ? 'Todos los árboles vinculados' : (tree(S.view) || {}).name;
    const doc = new Document({
      sections: [{
        properties: { page: { size: { width: 12240, height: 15840, orientation: 'landscape' }, margin: { top: 0, right: 0, bottom: 0, left: 0 } } },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new ImageRun({ type: 'png', data: ua, transformation: { width: W, height: H } })] })]
      }]
    });
    dl(await Packer.toBlob(doc), 'Organigrama_' + nm.replace(/[^\w]+/g, '_').slice(0, 40) + '.docx');
  };
  $('#ovc').onclick = () => {
    $('#ov').hidden = true;
    const qw = $('#qwrap');
    if (qw) qw.style.display = '';
  };

  $('#vlog').onclick = () => {
    let a = [];
    try { a = JSON.parse(localStorage.getItem('orgs_visitas_v1')) || []; } catch (e) {}
    const q = s => '"' + String(s || '').replace(/"/g, '""') + '"';
    dl(new Blob(['nombre,dia,hora,dispositivo,navegador\n' + a.map(v => [v.nombre || '', v.dia, v.hora, v.dispositivo, v.navegador].map(q).join(',')).join('\n')], { type: 'text/csv' }), 'registro_visitas.csv');
  };

  let SV = null;
  window.onbeforeprint = () => {
    SV = { ...V };
    const k = Math.min(1.3, 980 / (W0 || 1), 620 / (H0 || 1));
    V = { x: Math.max(0, (980 - W0 * k) / 2), y: 0, k };
    apply();
    $('#stage').style.height = Math.ceil(H0 * k + 6) + 'px';
    const nm = S.view == 'all' ? 'Todos los árboles vinculados' : (tree(S.view) || {}).name;
    $('#ptitle').innerHTML = 'Organigrama — ' + esc(nm) + '<small>Impreso el ' + new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' }) + '</small>';
  };
  window.onafterprint = () => {
    if (SV) { V = SV; apply(); }
    $('#stage').style.height = '';
  };

  function setDev(m, fit) {
    DEV = m == 'mobile' ? 'mobile' : 'desktop';
    NH = DEV == 'mobile' ? 92 : 52;
    document.body.classList.toggle('dev-mobile', DEV == 'mobile');
    document.body.classList.toggle('dev-desktop', DEV == 'desktop');
    if (VIEW) {
      if (DEV == 'mobile') document.body.classList.add('noside');
      else document.body.classList.remove('noside');
    }
    document.querySelectorAll('[data-dev]').forEach(b => {
      b.classList.toggle('on', b.dataset.dev == DEV);
      b.setAttribute('aria-pressed', String(b.dataset.dev == DEV));
    });
    const s = $('#devsel');
    if (s) s.value = DEV;
    const bm = $('#devm'), bd = $('#devd');
    if (bm) { bm.classList.toggle('on', DEV == 'mobile'); bm.setAttribute('aria-pressed', String(DEV == 'mobile')); }
    if (bd) { bd.classList.toggle('on', DEV == 'desktop'); bd.setAttribute('aria-pressed', String(DEV == 'desktop')); }
    const h = $('#devhint');
    if (h) h.textContent = DEV == 'mobile'
      ? 'Vista de celular activa: nombres y cargos mucho más grandes. Toca un cargo para acercar la vista sobre él; tócalo dos veces para ver su foto y perfil.'
      : 'Vista de computador activa: diseño amplio de escritorio. Haz clic en un cargo para acercar la vista o editarlo; pulsa el icono de perfil para ver su ficha a la derecha.';
    if (fit) draw(1);
  }

  function setOrient(o) {
    ORIENT = o == 'h' ? 'h' : 'v';
    document.body.classList.toggle('orient-h', ORIENT == 'h');
    const b = $('#ori');
    if (b) {
      b.textContent = ORIENT == 'h' ? '⇅' : '⇄';
      b.setAttribute('aria-pressed', String(ORIENT == 'h'));
    }
    draw(1);
  }

  function detectDev() {
    try {
      return ((window.matchMedia && matchMedia('(pointer:coarse)').matches && innerWidth <= 900) || innerWidth <= 800) ? 'mobile' : 'desktop';
    } catch (e) {
      return innerWidth <= 800 ? 'mobile' : 'desktop';
    }
  }

  document.querySelectorAll('[data-dev]').forEach(b => b.onclick = () => setDev(b.dataset.dev, 1));
  const bm2 = $('#devm'), bd2 = $('#devd');
  if (bm2) bm2.onclick = () => setDev('mobile', 1);
  if (bd2) bd2.onclick = () => setDev('desktop', 1);
  const zi2 = $('#zin'), zo2 = $('#zout');
  if (zi2) zi2.onclick = () => zoom(1.25);
  if (zo2) zo2.onclick = () => zoom(.8);
  const orb = $('#ori');
  if (orb) orb.onclick = () => setOrient(ORIENT == 'h' ? 'v' : 'h');
  $('#phx').onclick = closePhoto;
  $('#phb').onclick = closePhoto;
  $('#phv').addEventListener('click', e => { if (e.target == e.currentTarget) closePhoto(); });
  document.addEventListener('keydown', e => { if (e.key == 'Escape') closePhoto(); });

  // Buscador por nombre o cargo
  (function () {
    const q = document.getElementById('q'), res = document.getElementById('qres');
    if (!q || !res) return;
    const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    function hide() { res.hidden = true; res.innerHTML = ''; }
    function go(id) {
      const n = node(id);
      if (!n) return;
      let m = n;
      while (m && m.p) { m = node(m.p); if (m) m.c = 0; }
      hide();
      if (S.view !== n.t) { selectView(n.t); } else { save(); draw(); }
      focusCard(id);
      openCard(id);
      if (window.innerWidth <= 800 || DEV === 'mobile') document.body.classList.add('noside');
      q.blur();
    }
    q.addEventListener('input', () => {
      const v = norm(q.value.trim());
      if (v.length < 2) { hide(); return; }
      const hits = S.nodes.filter(n => (n.name && norm(n.name).includes(v)) || (n.title && norm(n.title).includes(v))).slice(0, 12);
      if (!hits.length) {
        res.innerHTML = '<div class="qr"><small>Sin resultados para \u201c' + esc(q.value.trim()) + '\u201d</small></div>';
        res.hidden = false;
        return;
      }
      res.innerHTML = hits.map(n => {
        const t = tree(n.t);
        return '<div class="qr" data-id="' + n.id + '" role="button" tabindex="0"><b>' + esc(n.name || n.title) + '</b><span class="qt">' + esc(n.name ? (n.title || '') : '') + '</span><br><small>' + esc(t ? t.name : '') + '</small></div>';
      }).join('');
      res.hidden = false;
    });
    res.addEventListener('click', e => {
      const r = e.target.closest('.qr');
      if (r && r.dataset.id) go(r.dataset.id);
    });
    q.addEventListener('keydown', e => {
      if (e.key === 'Escape') { hide(); q.blur(); }
      if (e.key === 'Enter') {
        const first = res.querySelector('.qr[data-id]');
        if (first) go(first.dataset.id);
      }
    });
    document.addEventListener('click', e => { if (!e.target.closest('#qwrap')) hide(); });
  })();

  // Enlace directo desde Torio: ?tree=<id> abre solo ese árbol, desplegado.
  try {
    const tq = new URLSearchParams(location.search).get('tree');
    if (tq && tree(tq)) {
      S.view = tq;
      S.tree = tq;
      S.sel = null;
      S.nodes.forEach(n => { if (n.t == tq) n.c = 0; });
    }
  } catch (e) {}

  setDev(detectDev(), 0);
  if (IS_OWNER) setMode('view');
  else {
    draw(1);
    side();
    panel();
  }
};
window.__APP_FN();
