// Del Pallet al Mueble · motor del juego

(function () {
  'use strict';

    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const rand = (a, b) => a + Math.random() * (b - a);

    const W = {
      l: '#E4B87E', m: '#D9A96E', d: '#C08A56', dd: '#A9713F', deep: '#8A5730',
      ink: '#3B2415', cream: '#FFF3DF', amber: '#F6A93B', amber2: '#E08A23',
      moss: '#7D9A5A', rust: '#B5533C', steel: '#B9B2AA', steelDark: '#6B6560'
    };

    function svg(inner, vb = '0 0 64 64') {
      return '<svg viewBox="' + vb + '" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' + inner + '</svg>';
    }

    // ============================================================
    // Estado y referencias
    // ============================================================
    const screens = {
      start: $('#screen-start'),
      game: $('#screen-game'),
      end: $('#screen-end')
    };

    const stage = $('#stage');
    const dock = $('#dock');
    const btnNext = $('#btn-next');
    const progressFill = $('#progress-fill');
    const progressLabel = $('#progress-label');
    const stepKicker = $('#step-kicker');
    const stepTitle = $('#step-title');
    const phaseChip = $('#phase-chip');
    const guideText = $('#guide-text');
    const toastEl = $('#toast');
    const hudSteps = $$('#hud-steps .hud-step');
    const soundBtn = $('#sound-toggle');

    const STEP_META = {
      1: { kicker: 'Estación 1', title: 'Llegada al taller', phase: 'Descarga' },
      2: { kicker: 'Estación 2', title: 'Selección y limpieza', phase: 'Inspección' },
      3: { kicker: 'Estación 3', title: 'Lijado y barnizado', phase: 'Acabado' },
      4: { kicker: 'Estación 4', title: 'Trazado y ensamble', phase: 'Alinear' }
    };

    const state = {
      screen: 'start',
      step: 0,
      phase: '',
      muted: false,
      tool: null,
      finishTool: 'sander',
      timers: [],
      raf: 0,
      lastFrame: 0,
      hoverPiece: null,
      items: [],
      itemEls: [],
      finishPieces: [],
      finishEls: [],
      alignPieces: [],
      resolved: 0,
      discarded: 0,
      align: 0,
      marks: 0,
      drills: 0,
      relayout: null,
      onDragMove: null,
      warnAt: 0
    };

    try {
      state.muted = localStorage.getItem('dpam-muted') === '1';
    } catch (e) { /* sin almacenamiento */ }

    // ============================================================
    // Audio
    // ============================================================
    let actx = null;

    function ensureAudio() {
      if (state.muted) return;
      if (!actx) {
        try {
          actx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
          actx = null;
        }
      }
      if (actx && actx.state === 'suspended') {
        actx.resume().catch(function () {});
      }
    }

    function tone(freq, dur, type, vol, delay) {
      if (state.muted || !actx) return;
      try {
        const t0 = actx.currentTime + (delay || 0);
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        osc.type = type || 'sine';
        osc.frequency.setValueAtTime(freq, t0);
        gain.gain.setValueAtTime(0.0001, t0);
        gain.gain.linearRampToValueAtTime(vol || 0.05, t0 + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
        osc.connect(gain);
        gain.connect(actx.destination);
        osc.start(t0);
        osc.stop(t0 + dur + 0.03);
      } catch (e) { /* audio no disponible */ }
    }

    function sfx(name) {
      ensureAudio();
      if (state.muted) return;
      switch (name) {
        case 'click': tone(330, 0.07, 'triangle', 0.045); break;
        case 'pick': tone(520, 0.07, 'triangle', 0.04); break;
        case 'pop':
          tone(700, 0.09, 'sine', 0.05);
          tone(980, 0.08, 'sine', 0.035, 0.05);
          break;
        case 'ok':
          tone(620, 0.1, 'sine', 0.05);
          tone(880, 0.14, 'sine', 0.045, 0.08);
          break;
        case 'err': tone(180, 0.14, 'sawtooth', 0.035); break;
        case 'beep':
          tone(760, 0.1, 'square', 0.025);
          tone(760, 0.1, 'square', 0.025, 0.28);
          break;
        case 'pencil':
          tone(1100, 0.04, 'triangle', 0.02);
          tone(900, 0.05, 'triangle', 0.018, 0.04);
          break;
        case 'drill':
          tone(150, 0.12, 'sawtooth', 0.04);
          tone(220, 0.08, 'square', 0.025, 0.1);
          break;
        case 'sand':
          if (Math.random() < 0.12) tone(rand(120, 200), 0.04, 'sawtooth', 0.012);
          break;
        case 'chime':
          [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) {
            tone(f, 0.45, 'sine', 0.06, i * 0.13);
          });
          break;
      }
    }

    function updateSoundBtn() {
      if (!soundBtn) return;
      soundBtn.classList.toggle('muted', state.muted);
      soundBtn.setAttribute('aria-pressed', state.muted ? 'true' : 'false');
    }

    if (soundBtn) {
      soundBtn.addEventListener('click', function () {
        state.muted = !state.muted;
        try {
          localStorage.setItem('dpam-muted', state.muted ? '1' : '0');
        } catch (e) { /* sin almacenamiento */ }
        updateSoundBtn();
        if (!state.muted) {
          ensureAudio();
          sfx('click');
        }
      });
    }
    updateSoundBtn();

    // ============================================================
    // UI general
    // ============================================================
    let toastTimer = 0;

    function showToast(msg, type, dur) {
      type = type || 'ok';
      toastEl.textContent = msg;
      toastEl.className = 'toast show ' + type;
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () {
        toastEl.className = 'toast ' + type;
      }, dur || 2600);
    }

    function hideToast() {
      clearTimeout(toastTimer);
      toastEl.classList.remove('show');
    }

    function setProgress(done, total) {
      const pct = total > 0 ? Math.round((done / total) * 100) : 0;
      progressFill.style.width = pct + '%';
      progressLabel.textContent = done + ' / ' + total;
    }

    function setStepUI(n) {
      state.step = n;
      hudSteps.forEach(function (el) {
        const k = Number(el.dataset.step);
        el.classList.toggle('active', k === n);
        el.classList.toggle('done', k < n);
      });
      const meta = STEP_META[n];
      if (meta) {
        stepKicker.textContent = meta.kicker;
        stepTitle.textContent = meta.title;
        phaseChip.textContent = meta.phase;
      }
    }

    function setGuide(text) {
      guideText.textContent = text;
    }

    function setPhase(text) {
      phaseChip.textContent = text;
    }

    function showNext(label) {
      btnNext.innerHTML = label + ' <span aria-hidden="true">→</span>';
      btnNext.classList.remove('hidden');
    }

    function hideNext() {
      btnNext.classList.add('hidden');
    }

    function showScreen(name) {
      Object.keys(screens).forEach(function (key) {
        screens[key].classList.toggle('active', key === name);
        screens[key].classList.toggle('hidden', key !== name);
      });
      state.screen = name;
      hideToast();
    }

    function later(fn, ms) {
      const id = setTimeout(fn, ms);
      state.timers.push(id);
      return id;
    }

    function clearTimers() {
      state.timers.forEach(function (id) { clearTimeout(id); });
      state.timers = [];
    }

    function stopRaf() {
      if (state.raf) cancelAnimationFrame(state.raf);
      state.raf = 0;
      state.hoverPiece = null;
      state.lastFrame = 0;
    }

    function cleanStage() {
      clearTimers();
      stopRaf();
      hideToast();
      stage.className = 'stage';
      stage.innerHTML = '';
      dock.classList.add('hidden');
      dock.innerHTML = '';
      hideNext();
      state.onDragMove = null;
      state.relayout = null;
      state.hoverPiece = null;
      $$('.dust, .spark').forEach(function (n) { n.remove(); });
    }

    // ============================================================
    // Arrastre con detección de toque
    // ============================================================
    let drag = null;

    function point(e) {
      if (e.touches && e.touches.length) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      if (e.changedTouches && e.changedTouches.length) return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
      return { x: e.clientX, y: e.clientY };
    }

    function makeDraggable(el, handlers) {
      handlers = handlers || {};
      const down = function (e) {
        if (el.dataset.locked === '1' || el.classList.contains('placed') || el.classList.contains('resolved') || el.classList.contains('discarded')) return;
        if (typeof e.button === 'number' && e.button !== 0) return;
        const p = point(e);
        const er = el.getBoundingClientRect();
        drag = {
          el: el,
          onDrop: handlers.onDrop,
          onTap: handlers.onTap,
          startX: p.x,
          startY: p.y,
          dx: p.x - er.left,
          dy: p.y - er.top,
          active: false
        };
      };
      el.addEventListener('mousedown', down);
      el.addEventListener('touchstart', down, { passive: true });
    }

    function dragMove(e) {
      if (!drag) return;
      const p = point(e);
      const dist = Math.hypot(p.x - drag.startX, p.y - drag.startY);

      if (!drag.active && dist > 6) {
        drag.active = true;
        drag.el.classList.add('dragging');
        drag.el.style.zIndex = '80';
        drag.el.style.transition = 'none';
      }

      if (drag.active) {
        if (e.cancelable) e.preventDefault();
        const sr = stage.getBoundingClientRect();
        const left = p.x - sr.left - drag.dx;
        const top = p.y - sr.top - drag.dy;
        const maxL = (stage.clientWidth || sr.width) - drag.el.offsetWidth;
        const maxT = (stage.clientHeight || sr.height) - drag.el.offsetHeight;
        drag.el.style.left = clamp(left, 0, Math.max(0, maxL)) + 'px';
        drag.el.style.top = clamp(top, 0, Math.max(0, maxT)) + 'px';
        if (typeof state.onDragMove === 'function') state.onDragMove(drag.el);
      }
    }

    function dragEnd() {
      if (!drag) return;
      const d = drag;
      drag = null;

      if (!d.active) {
        if (typeof d.onTap === 'function') d.onTap();
        return;
      }

      d.el.classList.remove('dragging');
      d.el.style.transition = '';
      d.el.style.zIndex = '20';
      if (typeof d.onDrop === 'function') d.onDrop(d.el);
    }

    document.addEventListener('mousemove', dragMove);
    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('touchmove', dragMove, { passive: false });
    document.addEventListener('touchend', dragEnd);
    document.addEventListener('touchcancel', dragEnd);

    function resetEl(el) {
      el.style.transition = 'left .22s ease, top .22s ease, transform .22s ease';
      el.style.left = el.dataset.ox || '0px';
      el.style.top = el.dataset.oy || '0px';
      setTimeout(function () {
        el.style.transition = '';
      }, 250);
    }

    function overlaps(a, b) {
      const ra = a.getBoundingClientRect();
      const rb = b.getBoundingClientRect();
      const x = Math.max(0, Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left));
      const y = Math.max(0, Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top));
      return x * y > Math.min(ra.width * ra.height, rb.width * rb.height) * 0.12;
    }

    function layoutGrid(els, cols, cardW, cardH, gap, area) {
      const rows = Math.ceil(els.length / cols);
      const totalH = rows * cardH + (rows - 1) * gap;
      const startY = area.y + Math.max(0, (area.h - totalH) / 2);
      const colW = (area.w - gap * (cols - 1)) / cols;

      els.forEach(function (el, i) {
        if (el.dataset.fixed === '1' || el.classList.contains('discarded')) return;
        const r = Math.floor(i / cols);
        const c = i % cols;
        el.style.width = cardW + 'px';
        el.style.height = cardH + 'px';
        el.style.left = (area.x + c * (colW + gap) + (colW - cardW) / 2) + 'px';
        el.style.top = (startY + r * (cardH + gap)) + 'px';
        el.dataset.ox = el.style.left;
        el.dataset.oy = el.style.top;
      });
    }

    // ============================================================
    // PASO 1 · Descarga
    // ============================================================
    function loadStep1() {
      cleanStage();
      setStepUI(1);
      setPhase('Descarga');
      setGuide('Dos camiones llegan al taller: uno trae pallets recuperados y el otro, troncos de poda. La descarga es automática.');
      setProgress(0, 1);
      stage.classList.add('step-1');

      stage.innerHTML =
        '<div class="stage-sign">Muelle de recepción</div>' +
        '<div class="intro-scene">' +
          '<div class="truck-lane">' +
            '<div class="truck truck-a">' +
              '<span class="beep">¡bip! ¡bip!</span>' +
              '<div class="truck-art">' + PalletsIcons.truck('pallet') + '</div>' +
              '<span class="truck-label">Camión A · Pallets</span>' +
            '</div>' +
            '<div class="truck truck-b">' +
              '<span class="beep">¡bip! ¡bip!</span>' +
              '<div class="truck-art">' + PalletsIcons.truck('log') + '</div>' +
              '<span class="truck-label">Camión B · Troncos</span>' +
            '</div>' +
          '</div>' +
          '<div class="intro-caption">Descarga automática a la zona de recepción</div>' +
          '<div class="reception">' +
            '<div class="pile" id="pile-a">' +
              '<span class="pile-title">Recepción · Pallets</span>' +
              '<div class="pile-items"><span>' + PalletsIcons.pallet() + '</span><span>' + PalletsIcons.pallet() + '</span><span>' + PalletsIcons.board() + '</span></div>' +
            '</div>' +
            '<div class="pile" id="pile-b">' +
              '<span class="pile-title">Recepción · Troncos</span>' +
              '<div class="pile-items"><span>' + PalletsIcons.log() + '</span><span>' + PalletsIcons.log() + '</span><span>' + PalletsIcons.log() + '</span></div>' +
            '</div>' +
          '</div>' +
          '<button class="skip-btn" id="skip-intro" type="button">Saltar animación</button>' +
        '</div>';

      const skip = $('#skip-intro');
      const pileA = $('#pile-a');
      const pileB = $('#pile-b');

      const finishIntro = function () {
        clearTimers();
        stage.classList.add('unloaded');
        pileA.classList.add('show');
        pileB.classList.add('show');
        if (skip) skip.classList.add('hidden');
        setProgress(1, 1);
        setGuide('La madera ya está en recepción. Ahora revisá cada pieza y sacá los defectos.');
        showNext('Comenzar inspección');
        sfx('ok');
      };

      if (skip) {
        skip.addEventListener('click', function () {
          sfx('click');
          finishIntro();
        });
      }

      later(function () { sfx('beep'); }, 220);
      later(function () { pileA.classList.add('show'); sfx('pop'); }, 1450);
      later(function () { pileB.classList.add('show'); sfx('pop'); }, 1850);
      later(finishIntro, 2650);
    }

    // ============================================================
    // PASO 2 · Selección y limpieza
    // ============================================================
    const TOOLS = {
      pliers: { name: 'Tenaza', icon: PalletsIcons.pliers },
      shears: { name: 'Podadora', icon: PalletsIcons.shears },
      peeler: { name: 'Descortezador', icon: PalletsIcons.peeler }
    };

    const INSPECTION_ITEMS = [
      { id: 'p1', type: 'pallet', label: 'Pallet', defect: 'nails', tool: 'pliers' },
      { id: 'b1', type: 'board', label: 'Tablón', defect: 'broken' },
      { id: 'l1', type: 'log', label: 'Tronco', defect: 'crooked' },
      { id: 'l2', type: 'log', label: 'Tronco', defect: 'branches', tool: 'shears', next: 'bark', nextTool: 'peeler' },
      { id: 'b2', type: 'board', label: 'Tablón', defect: 'nails', tool: 'pliers' },
      { id: 'l3', type: 'log', label: 'Tronco', defect: 'bark', tool: 'peeler' }
    ];

    const DEFECT_LABELS = {
      nails: 'Clavos',
      broken: 'Partido',
      crooked: 'Chueco',
      branches: 'Ramas',
      bark: 'Corteza'
    };

    function defectLabel(defect) {
      return DEFECT_LABELS[defect] || 'Lista';
    }

    function materialArt(item) {
      if (item.type === 'pallet') {
        return PalletsIcons.pallet(item.defect === 'nails' ? 'nails' : item.defect === 'broken' ? 'broken' : 'none');
      }
      if (item.type === 'board') {
        return PalletsIcons.board(item.defect === 'broken' ? 'broken' : item.defect === 'nails' ? 'nails' : 'none');
      }
      return PalletsIcons.log(
        item.defect === 'crooked' ? 'crooked' :
        item.defect === 'branches' ? 'branches' :
        item.defect === 'bark' ? 'bark' : 'none'
      );
    }

    function loadStep2() {
      cleanStage();
      setStepUI(2);
      setPhase('Inspección');
      setGuide('Revisá cada pieza: sacá los clavos, cortá las ramas, pelá la corteza y descartá lo que no sirve.');
      setProgress(0, 6);

      state.items = INSPECTION_ITEMS.map(function (o) {
        return Object.assign({}, o, { resolved: false });
      });
      state.resolved = 0;
      state.discarded = 0;
      state.tool = null;
      state.itemEls = [];
      stage.classList.add('step-2');

      stage.innerHTML =
        '<div class="bin" id="discard-bin">' +
          '<div class="bin-art">' + PalletsIcons.bin() + '</div>' +
          '<span class="bin-title">Descarte</span>' +
          '<span class="bin-sub">vuelve a biomasa</span>' +
        '</div>';

      state.items.forEach(function (item) {
        const card = document.createElement('div');
        card.className = 'material';
        card.dataset.id = item.id;
        card.innerHTML =
          '<div class="art">' + materialArt(item) + '</div>' +
          '<div class="meta"><strong>' + item.label + '</strong><span class="badge">' + defectLabel(item.defect) + '</span></div>';

        item.el = card;
        state.itemEls.push(card);

        makeDraggable(card, {
          onTap: function () { handleItemTap(item); },
          onDrop: function (node) { handleItemDrop(item, node); }
        });

        stage.appendChild(card);
      });

      dock.classList.remove('hidden');
      dock.innerHTML = '<span class="dock-label">Herramientas</span>' +
        Object.keys(TOOLS).map(function (key) {
          const t = TOOLS[key];
          return '<button class="tool-btn" data-tool="' + key + '" type="button">' + t.icon() + '<span>' + t.name + '</span></button>';
        }).join('');

      $$('.tool-btn', dock).forEach(function (btn) {
        btn.addEventListener('click', function () {
          selectTool(btn.dataset.tool);
        });
      });

      selectTool('pliers');
      layoutMaterials();

      state.relayout = layoutMaterials;
      state.onDragMove = function (node) {
        const bin = $('#discard-bin');
        if (bin) bin.classList.toggle('hot', overlaps(node, bin));
      };
    }

    function layoutMaterials() {
      if (state.step !== 2) return;
      const W = stage.clientWidth || 900;
      const H = stage.clientHeight || 420;
      const small = W < 620;
      const bin = $('#discard-bin');
      const binW = small ? 104 : 152;

      if (bin) bin.style.width = binW + 'px';

      const cols = small ? 2 : 3;
      const cardW = small ? 98 : 124;
      const cardH = small ? 94 : 132;
      const gap = small ? 7 : 12;
      const area = { x: 14, y: 14, w: W - binW - (small ? 36 : 72), h: H - 28 };

      layoutGrid(state.itemEls, cols, cardW, cardH, gap, area);
    }

    function renderItem(item) {
      if (!item.el) return;
      const art = $('.art', item.el);
      const badge = $('.badge', item.el);
      if (art) art.innerHTML = materialArt(item);
      if (badge) badge.textContent = item.resolved ? 'Lista' : defectLabel(item.defect);
      item.el.classList.toggle('ready', !!item.resolved);
      item.el.classList.toggle('needs-tool', !item.resolved && item.tool === state.tool);
      if (item.resolved) item.el.classList.remove('needs-tool');
    }

    function selectTool(key) {
      state.tool = key;
      $$('.tool-btn', dock).forEach(function (btn) {
        btn.classList.toggle('active', btn.dataset.tool === key);
      });
      state.items.forEach(function (item) {
        if (item.el) {
          item.el.classList.toggle('needs-tool', !item.resolved && item.tool === key);
        }
      });
      sfx('pick');
    }

    function handleItemTap(item) {
      if (state.step !== 2) return;
      if (item.resolved) {
        showToast('Esta pieza ya está lista para el siguiente paso.', 'ok');
        return;
      }
      if (item.defect === 'broken' || item.defect === 'crooked') {
        sfx('err');
        showToast(
          item.defect === 'broken'
            ? 'Este tablón está partido: arrastralo al contenedor de descarte.'
            : 'Este tronco está chueco: arrastralo al tacho de descarte.',
          'err'
        );
        return;
      }
      if (!state.tool) {
        showToast('Elegí una herramienta del banco.', 'warn');
        return;
      }
      if (state.tool !== item.tool) {
        sfx('err');
        const hint =
          item.defect === 'nails' ? 'Para los clavos usá la tenaza.' :
          item.defect === 'branches' ? 'Para las ramas usá la podadora.' :
          item.defect === 'bark' ? 'Para la corteza usá el descortezador.' :
          'Esa no es la herramienta indicada.';
        showToast(hint, 'warn');
        return;
      }

      if (item.next) {
        item.defect = item.next;
        item.tool = item.nextTool;
        item.next = null;
        item.nextTool = null;
        renderItem(item);
        sfx('ok');
        showToast('Ramas cortadas. Ahora pelá la corteza con el descortezador.', 'ok');
        later(function () { selectTool(item.tool); }, 180);
        return;
      }

      resolveItem(item);
    }

    function resolveItem(item) {
      item.resolved = true;
      item.defect = null;
      item.el.dataset.locked = '1';
      item.el.classList.add('resolved');
      item.el.classList.remove('needs-tool');
      renderItem(item);
      state.resolved++;
      sfx('ok');
      showToast('¡Bien! La pieza quedó limpia y lista.', 'ok', 1800);
      setProgress(state.resolved, 6);
      checkInspectionDone();
    }

    function handleItemDrop(item, node) {
      const bin = $('#discard-bin');
      if (bin) bin.classList.remove('hot');

      if (bin && overlaps(node, bin)) {
        if (item.defect === 'broken' || item.defect === 'crooked') {
          discardItem(item, node, bin);
        } else {
          sfx('err');
          showToast('Esta pieza está sana: no la descartes. Usala para la mesa.', 'warn');
          resetEl(node);
        }
        return;
      }

      resetEl(node);
    }

    function discardItem(item, node, bin) {
      item.resolved = true;
      node.dataset.locked = '1';
      node.classList.add('discarded');

      const br = bin.getBoundingClientRect();
      const sr = stage.getBoundingClientRect();
      node.style.transition = 'left .3s ease, top .3s ease, transform .3s ease, opacity .3s ease';
      node.style.left = (br.left - sr.left + br.width / 2 - node.offsetWidth / 2) + 'px';
      node.style.top = (br.top - sr.top + br.height / 2 - node.offsetHeight / 2) + 'px';

      state.resolved++;
      state.discarded++;
      sfx('pop');
      showToast('Bien descartado: esta madera vuelve al ciclo como biomasa.', 'ok');
      setProgress(state.resolved, 6);
      checkInspectionDone();
    }

    function checkInspectionDone() {
      if (state.resolved >= 6) {
        setProgress(6, 6);
        setGuide('Selección completa: cuatro piezas limpias y dos descartadas. La madera útil pasa al banco de acabado.');
        showNext('Ir al acondicionamiento');
        sfx('ok');
        showToast('¡Inspección completa! La madera útil está lista.', 'ok', 2800);
      }
    }

    // ============================================================
    // PASO 3 · Lijado y barnizado
    // ============================================================
    const FINISH_PIECES = [
      { id: 'f1', type: 'board', name: 'Tablón 1' },
      { id: 'f2', type: 'board', name: 'Tablón 2' },
      { id: 'f3', type: 'log', name: 'Tronco 1' },
      { id: 'f4', type: 'log', name: 'Tronco 2' }
    ];

    function loadStep3() {
      cleanStage();
      setStepUI(3);
      setPhase('Acabado');
      setGuide('Pasá la lijadora sobre cada pieza. Cuando estén todas suaves, barnizalas para proteger la madera.');
      setProgress(0, 8);

      state.finishTool = 'sander';
      state.finishPieces = FINISH_PIECES.map(function (p) {
        return Object.assign({}, p, { sand: 0, varnish: 0, sanded: false, varnished: false });
      });
      state.finishEls = [];
      state.lastFrame = performance.now();
      stage.classList.add('step-3');

      stage.innerHTML = '<div class="tool-cursor" id="tool-cursor">' + PalletsIcons.sander() + '</div>';

      state.finishPieces.forEach(function (piece) {
        const card = document.createElement('div');
        card.className = 'finish-piece';
        card.dataset.id = piece.id;
        card.innerHTML =
          '<div class="art">' + (piece.type === 'board' ? PalletsIcons.board() : PalletsIcons.log()) + '</div>' +
          '<div class="p-name">' + piece.name + '</div>' +
          '<div class="p-state">Sin lijar</div>' +
          '<div class="bar"><span></span></div>';
        piece.el = card;
        state.finishEls.push(card);
        stage.appendChild(card);
      });

      layoutFinish();
      state.relayout = layoutFinish;

      dock.classList.remove('hidden');
      dock.innerHTML =
        '<span class="dock-label">Acabado</span>' +
        '<button class="tool-btn active" data-tool="sander" type="button">' + PalletsIcons.sander() + '<span>Lijadora</span></button>' +
        '<button class="tool-btn locked" data-tool="brush" type="button">' + PalletsIcons.brush() + '<span>Barniz</span> <span class="lock">primero lijá</span></button>';

      $$('.tool-btn', dock).forEach(function (btn) {
        btn.addEventListener('click', function () {
          selectFinishTool(btn.dataset.tool);
        });
      });

      const move = function (e) {
        const p = point(e);
        const sr = stage.getBoundingClientRect();
        const cursor = $('#tool-cursor');
        if (cursor) {
          cursor.style.left = (p.x - sr.left) + 'px';
          cursor.style.top = (p.y - sr.top) + 'px';
          cursor.classList.add('visible');
        }
        const piece = pieceAt(p.x, p.y);
        state.hoverPiece = piece;
        if (piece) applyFinish(piece, 22);
        if (e.cancelable && e.type === 'touchmove') e.preventDefault();
      };

      const leave = function () {
        state.hoverPiece = null;
        const cursor = $('#tool-cursor');
        if (cursor) cursor.classList.remove('visible');
      };

      const press = function (e) {
        const p = point(e);
        const piece = pieceAt(p.x, p.y);
        state.hoverPiece = piece;
        if (piece) applyFinish(piece, 30);
      };

      stage.addEventListener('mousemove', move);
      stage.addEventListener('touchmove', move, { passive: false });
      stage.addEventListener('mouseleave', leave);
      stage.addEventListener('mousedown', press);
      stage.addEventListener('touchstart', press, { passive: true });
      stage.addEventListener('touchend', function () {
        setTimeout(leave, 320);
      });

      state.raf = requestAnimationFrame(finishTick);
    }

    function layoutFinish() {
      if (state.step !== 3) return;
      const W = stage.clientWidth || 900;
      const H = stage.clientHeight || 420;
      const small = W < 620;
      const cols = small ? 2 : 4;
      const cardW = small ? 118 : 160;
      const cardH = small ? 126 : 190;
      const gap = small ? 12 : 14;
      const area = { x: 16, y: 16, w: W - 32, h: H - 32 };
      layoutGrid(state.finishEls, cols, cardW, cardH, gap, area);
    }

    function pieceAt(x, y) {
      for (let i = 0; i < state.finishPieces.length; i++) {
        const p = state.finishPieces[i];
        if (!p.el) continue;
        const r = p.el.getBoundingClientRect();
        if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return p;
      }
      return null;
    }

    function allSanded() {
      return state.finishPieces.every(function (p) { return p.sanded; });
    }

    function allVarnished() {
      return state.finishPieces.every(function (p) { return p.varnished; });
    }

    function selectFinishTool(key) {
      if (key === 'brush' && !allSanded()) {
        sfx('err');
        showToast('Primero lijá todas las piezas. El barniz necesita una superficie suave.', 'warn');
        return;
      }
      state.finishTool = key;
      $$('.tool-btn', dock).forEach(function (btn) {
        btn.classList.toggle('active', btn.dataset.tool === key);
      });
      const cursor = $('#tool-cursor');
      if (cursor) cursor.innerHTML = key === 'sander' ? PalletsIcons.sander() : PalletsIcons.brush();
      sfx('pick');
    }

    function applyFinish(piece, ms) {
      if (!piece || state.step !== 3) return;

      if (state.finishTool === 'sander') {
        if (piece.sanded) return;
        piece.sand = Math.min(100, piece.sand + ms * 0.085);
        if (piece.sand >= 100) completeSand(piece);
        else {
          piece.el.classList.add('sanding');
          updateFinishPiece(piece);
          sfx('sand');
        }
        return;
      }

      if (state.finishTool === 'brush') {
        if (!allSanded()) {
          const now = Date.now();
          if (now - state.warnAt > 2200) {
            state.warnAt = now;
            showToast('Las piezas todavía no están lijadas. Primero pasá la lijadora.', 'warn');
          }
          return;
        }
        if (!piece.sanded || piece.varnished) return;
        piece.varnish = Math.min(100, piece.varnish + ms * 0.075);
        if (piece.varnish >= 100) completeVarnish(piece);
        else {
          piece.el.classList.add('sanding');
          updateFinishPiece(piece);
        }
      }
    }

    function updateFinishPiece(piece) {
      if (!piece.el) return;
      const bar = $('.bar span', piece.el);
      const stateEl = $('.p-state', piece.el);
      if (!bar || !stateEl) return;

      if (piece.varnished) {
        bar.style.width = '100%';
        stateEl.textContent = 'Barnizada';
        piece.el.classList.add('sanded', 'varnished');
        return;
      }
      if (piece.sanded) {
        bar.style.width = piece.varnish + '%';
        stateEl.textContent = piece.varnish > 0 ? 'Barnizando…' : 'Lijada';
        piece.el.classList.add('sanded');
        return;
      }
      bar.style.width = piece.sand + '%';
      stateEl.textContent = piece.sand > 0 ? 'Lijando…' : 'Sin lijar';
      piece.el.classList.remove('sanded');
    }

    function completeSand(piece) {
      piece.sand = 100;
      piece.sanded = true;
      piece.el.classList.remove('sanding');
      updateFinishPiece(piece);
      burstAt(piece.el, 'dust', 7);
      sfx('ok');
      setFinishProgress();
      showToast('Superficie lijada: la madera quedó suave y lista.', 'ok', 1500);

      if (allSanded()) {
        const brushBtn = $('.tool-btn[data-tool="brush"]', dock);
        if (brushBtn) {
          brushBtn.classList.remove('locked');
          brushBtn.innerHTML = PalletsIcons.brush() + '<span>Barniz</span>';
        }
        selectFinishTool('brush');
        setGuide('¡Todas las piezas están lijadas! Ahora pasá el barniz para protegerlas y realzar su color.');
        showToast('¡Todas lijadas! Ahora pasá el barniz.', 'ok', 2800);
      }
    }

    function completeVarnish(piece) {
      piece.varnish = 100;
      piece.varnished = true;
      piece.el.classList.remove('sanding');
      updateFinishPiece(piece);
      burstAt(piece.el, 'spark', 5);
      sfx('ok');
      setFinishProgress();
      showToast('Barniz aplicado: la madera queda protegida y con brillo cálido.', 'ok', 1600);

      if (allVarnished()) {
        state.hoverPiece = null;
        const cursor = $('#tool-cursor');
        if (cursor) cursor.classList.remove('visible');
        setGuide('Acabado completo. Las piezas están listas para el trazado y el ensamble.');
        showNext('Ir al ensamble');
        sfx('ok');
        showToast('¡Acabado listo! Ahora armá la mesa.', 'ok', 2800);
      }
    }

    function setFinishProgress() {
      const done = state.finishPieces.filter(function (p) { return p.sanded; }).length +
        state.finishPieces.filter(function (p) { return p.varnished; }).length;
      setProgress(done, 8);
    }

    function finishTick(now) {
      if (state.step !== 3 || state.screen !== 'game') return;
      const dt = Math.min(60, now - (state.lastFrame || now));
      state.lastFrame = now;
      if (state.hoverPiece) applyFinish(state.hoverPiece, dt);
      if (state.step === 3) state.raf = requestAnimationFrame(finishTick);
    }

    function burstAt(el, type, n) {
      if (!el) return;
      const sr = stage.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      for (let i = 0; i < n; i++) {
        const dot = document.createElement('span');
        dot.className = type;
        dot.style.left = (r.left - sr.left + r.width * rand(0.25, 0.75)) + 'px';
        dot.style.top = (r.top - sr.top + r.height * rand(0.25, 0.75)) + 'px';
        dot.style.setProperty('--dx', rand(-44, 44) + 'px');
        dot.style.setProperty('--dy', rand(-58, -14) + 'px');
        stage.appendChild(dot);
        setTimeout(function () { dot.remove(); }, 850);
      }
    }

    // ============================================================
    // PASO 4 · Croquis, marcado y ensamble
    // ============================================================
    function loadStep4() {
      cleanStage();
      setStepUI(4);
      setPhase('Alinear');
      setGuide('Arrastrá cada pieza barnizada a su lugar en el croquis. Después vas a marcar y atornillar.');
      setProgress(0, 4);

      state.phase = 'align';
      state.align = 0;
      state.marks = 0;
      state.drills = 0;

      stage.classList.add('step-4');
      stage.innerHTML =
        '<div class="plan-board" id="plan-board">' +
          '<div class="plan-ghost">' + PalletsIcons.table() + '</div>' +
          '<div class="slot s0" data-slot="0">Tapa</div>' +
          '<div class="slot s1" data-slot="1">Pata izq.</div>' +
          '<div class="slot s2" data-slot="2">Estante</div>' +
          '<div class="slot s3" data-slot="3">Pata der.</div>' +
        '</div>';

      const pieces = [
        { id: 'a1', target: '0', name: 'Tapa', icon: PalletsIcons.board() },
        { id: 'a2', target: '1', name: 'Pata izq.', icon: PalletsIcons.log() },
        { id: 'a3', target: '2', name: 'Estante', icon: PalletsIcons.board() },
        { id: 'a4', target: '3', name: 'Pata der.', icon: PalletsIcons.log() }
      ];
      state.alignPieces = pieces;

      pieces.forEach(function (piece) {
        const el = document.createElement('div');
        el.className = 'assembly-piece';
        el.dataset.id = piece.id;
        el.dataset.target = piece.target;
        el.innerHTML = '<span class="e-art">' + piece.icon + '</span><span class="e-label">' + piece.name + '</span>';
        piece.el = el;

        makeDraggable(el, {
          onDrop: function (node) { handleAssemblyDrop(piece, node); }
        });

        stage.appendChild(el);
      });

      layoutAssembly();
      state.relayout = layoutAssembly;
      state.onDragMove = function (node) {
        $$('.slot', stage).forEach(function (slot) {
          slot.classList.toggle('hot', overlaps(node, slot) && !slot.classList.contains('filled'));
        });
      };
    }

    function layoutAssembly() {
      if (state.step !== 4 || state.phase !== 'align') return;
      const W = stage.clientWidth || 900;
      const H = stage.clientHeight || 420;
      const small = W < 620;
      const size = small ? 72 : 104;
      const gap = small ? 10 : 14;
      const totalW = 4 * size + 3 * gap;
      const startX = (W - totalW) / 2;
      const top = H - size - 16;

      state.alignPieces.forEach(function (piece, i) {
        if (!piece.el || piece.el.classList.contains('placed')) return;
        piece.el.style.width = size + 'px';
        piece.el.style.height = size + 'px';
        piece.el.style.left = (startX + i * (size + gap)) + 'px';
        piece.el.style.top = top + 'px';
        piece.el.dataset.ox = piece.el.style.left;
        piece.el.dataset.oy = piece.el.style.top;
      });
    }

    function handleAssemblyDrop(piece, node) {
      const slots = $$('.slot', stage);
      let target = null;
      slots.forEach(function (slot) {
        slot.classList.remove('hot');
        if (overlaps(node, slot) && !slot.classList.contains('filled')) target = slot;
      });

      if (target && target.dataset.slot === piece.target) {
        target.classList.add('filled');
        node.classList.add('placed');
        node.dataset.locked = '1';

        const sr = stage.getBoundingClientRect();
        const tr = target.getBoundingClientRect();
        node.style.transition = 'left .3s ease, top .3s ease, transform .3s ease';
        node.style.left = (tr.left - sr.left + tr.width / 2 - node.offsetWidth / 2) + 'px';
        node.style.top = (tr.top - sr.top + tr.height / 2 - node.offsetHeight / 2) + 'px';
        node.style.transform = 'scale(.8)';

        sfx('ok');
        state.align++;
        setProgress(state.align, 4);
        showToast('Pieza en su lugar.', 'ok', 1300);

        if (state.align === 4) {
          setGuide('Croquis completo. Ahora marcá los puntos donde irán los tornillos.');
          later(startMarkPhase, 750);
        }
      } else if (target && target.dataset.slot !== piece.target) {
        sfx('err');
        showToast('Esa pieza va en otro lugar del croquis. Mirá la etiqueta del plano.', 'warn');
        resetEl(node);
      } else {
        resetEl(node);
      }
    }

    function startMarkPhase() {
      if (state.step !== 4) return;
      hideToast();
      state.phase = 'mark';
      state.marks = 0;
      setPhase('Marcar');
      setGuide('Con el lápiz, marcá los 6 puntos donde irán los tornillos. Seguí las guías del croquis.');
      setProgress(0, 6);

      const marks = [
        { x: 22, y: 40 }, { x: 78, y: 40 },
        { x: 36, y: 56 }, { x: 64, y: 56 },
        { x: 22, y: 78 }, { x: 78, y: 78 }
      ];

      stage.innerHTML =
        '<div class="mark-scene">' +
          '<div class="build-table" id="build-table">' +
            PalletsIcons.table() +
            marks.map(function (m, i) {
              return '<button class="mark" type="button" data-mark="' + i + '" style="left:' + m.x + '%;top:' + m.y + '%" aria-label="Punto ' + (i + 1) + '"></button>';
            }).join('') +
          '</div>' +
          '<div class="phase-tool">' + PalletsIcons.pencil() + '<span>Lápiz</span></div>' +
        '</div>';

      $$('.mark', stage).forEach(function (mark) {
        mark.addEventListener('click', function () { markPoint(mark); });
      });
      sfx('pick');
    }

    function markPoint(mark) {
      if (state.phase !== 'mark' || mark.classList.contains('marked')) return;
      mark.classList.add('marked');
      state.marks++;
      sfx('pencil');
      burstAt(mark, 'dust', 3);
      setProgress(state.marks, 6);
      if (state.marks === 6) {
        showToast('Puntos marcados. Ahora perforá y atornillá cada uno.', 'ok');
        later(startDrillPhase, 750);
      }
    }

    function startDrillPhase() {
      if (state.step !== 4) return;
      hideToast();
      state.phase = 'drill';
      state.drills = 0;
      setPhase('Atornillar');
      setGuide('Con el taladro, perforá y atornillá cada marca hasta fijar la estructura.');
      setProgress(0, 6);

      const tool = $('.phase-tool', stage);
      if (tool) tool.innerHTML = PalletsIcons.drill() + '<span>Taladro</span>';

      $$('.mark', stage).forEach(function (mark) {
        mark.addEventListener('click', function () { drillPoint(mark); });
      });
      sfx('pick');
    }

    function drillPoint(mark) {
      if (state.phase !== 'drill' || mark.classList.contains('drilled')) return;
      mark.classList.add('drilled');
      state.drills++;
      sfx('drill');
      burstAt(mark, 'dust', 5);
      setProgress(state.drills, 6);
      if (state.drills === 6) {
        later(completeAssembly, 550);
      }
    }

    function completeAssembly() {
      if (state.step !== 4) return;
      hideToast();
      setGuide('¡Mesa ensamblada! Cada tornillo quedó en su lugar y la estructura está firme.');
      stage.insertAdjacentHTML('beforeend',
        '<div class="build-done">' +
          '<h3>Mesa ensamblada</h3>' +
          '<p>4 piezas · 6 tornillos</p>' +
        '</div>'
      );
      showNext('Ver el resultado');
      sfx('ok');
    }

    // ============================================================
    // Final
    // ============================================================
    let confettiRaf = 0;

    function finishGame() {
      clearTimers();
      stopRaf();
      showScreen('end');
      const table = $('#end-table');
      if (table) table.innerHTML = PalletsIcons.table();
      const reused = $('#stat-reused');
      const discarded = $('#stat-discarded');
      if (reused) reused.textContent = '4';
      if (discarded) discarded.textContent = String(state.discarded || 2);
      sfx('chime');
      startConfetti();
    }

    function startConfetti() {
      const canvas = $('#confetti');
      if (!canvas) return;
      let ctx = null;
      try {
        ctx = canvas.getContext('2d');
      } catch (e) {
        ctx = null;
      }
      if (!ctx) return;

      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const resize = function () {
        const r = canvas.getBoundingClientRect();
        canvas.width = Math.max(1, Math.floor(r.width * dpr));
        canvas.height = Math.max(1, Math.floor(r.height * dpr));
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };
      resize();

      const colors = ['#F6A93B', '#E08A23', '#7D9A5A', '#B5533C', '#FFF3DF', '#D9A96E'];
      const parts = [];
      for (let i = 0; i < 150; i++) {
        parts.push({
          x: Math.random() * canvas.clientWidth,
          y: rand(-canvas.clientHeight, canvas.clientHeight),
          w: rand(4, 9),
          h: rand(3, 7),
          vx: rand(-0.25, 0.25),
          vy: rand(0.6, 1.6),
          rot: rand(0, Math.PI * 2),
          vr: rand(-0.08, 0.08),
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }

      let last = performance.now();
      const loop = function (now) {
        if (state.screen !== 'end') return;
        const dt = Math.min(32, now - last);
        last = now;
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        ctx.clearRect(0, 0, w, h);
        parts.forEach(function (p) {
          p.x += p.vx * dt * 0.06;
          p.y += p.vy * dt * 0.06;
          p.rot += p.vr * dt * 0.06;
          if (p.y > h + 24) {
            p.y = -24;
            p.x = Math.random() * w;
          }
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
        });
        confettiRaf = requestAnimationFrame(loop);
      };

      cancelAnimationFrame(confettiRaf);
      confettiRaf = requestAnimationFrame(loop);
    }

    // ============================================================
    // Navegación
    // ============================================================
    $('#btn-start').addEventListener('click', function () {
      ensureAudio();
      sfx('click');
      showScreen('game');
      loadStep1();
    });

    btnNext.addEventListener('click', function () {
      sfx('click');
      if (state.step === 1) loadStep2();
      else if (state.step === 2) loadStep3();
      else if (state.step === 3) loadStep4();
      else if (state.step === 4) finishGame();
    });

    $('#btn-restart').addEventListener('click', function () {
      ensureAudio();
      sfx('click');
      cancelAnimationFrame(confettiRaf);
      showScreen('start');
    });

    $('#btn-exit').addEventListener('click', function () {
      sfx('click');
      clearTimers();
      stopRaf();
      showScreen('start');
    });

    let resizeTimer = 0;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        if (typeof state.relayout === 'function') state.relayout();
      }, 140);
    });
  })();
