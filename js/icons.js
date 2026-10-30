(function () {
  'use strict';

    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const rand = (a, b) => a + Math.random() * (b - a);

    const W = {
      l: '#D4B08A', m: '#C9A27C', d: '#A87C52', dd: '#8A6239', deep: '#6B4A2A',
      ink: '#1A1A1A', cream: '#E8E8E8', amber: '#F5A623', amber2: '#FF6B35',
      moss: '#4A7C59', rust: '#D32F2F', steel: '#8A8A8A', steelDark: '#4A4A4A'
    };

    function svg(inner, vb = '0 0 64 64') {
      return '<svg viewBox="' + vb + '" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' + inner + '</svg>';
    }

    // ============================================================
    // Ilustraciones SVG
    // ============================================================
    function iconPallet(variant) {
      variant = variant || 'none';
      const broken = variant === 'broken';
      const nails = variant === 'nails';
      return svg(
        '<g stroke="' + W.ink + '" stroke-width="2.4" stroke-linejoin="round">' +
          '<rect x="5" y="14" width="54" height="7" rx="1.5" fill="' + W.m + '"/>' +
          '<rect x="5" y="24" width="' + (broken ? 24 : 54) + '" height="7" rx="1.5" fill="' + W.d + '"/>' +
          (broken ? '<rect x="34" y="24" width="25" height="7" rx="1.5" fill="' + W.d + '" transform="rotate(3 34 24)"/>' : '') +
          '<rect x="8" y="34" width="10" height="13" rx="1.5" fill="' + W.dd + '"/>' +
          '<rect x="27" y="34" width="10" height="13" rx="1.5" fill="' + W.deep + '"/>' +
          '<rect x="46" y="34" width="10" height="13" rx="1.5" fill="' + W.dd + '"/>' +
          '<rect x="5" y="50" width="' + (broken ? 30 : 54) + '" height="7" rx="1.5" fill="' + W.m + '"/>' +
          (broken ? '<path d="M31 49 l5 4 -4 3 6 4" stroke="' + W.ink + '"/>' : '') +
          (nails ? '<g fill="' + W.steel + '" stroke="' + W.steelDark + '" stroke-width="1"><circle cx="16" cy="17.5" r="2.2"/><circle cx="36" cy="27.5" r="2.2"/><circle cx="50" cy="17.5" r="2.2"/></g>' : '') +
        '</g>'
      );
    }

    function iconBoard(variant) {
      variant = variant || 'none';
      const broken = variant === 'broken';
      const nails = variant === 'nails';
      return svg(
        '<g stroke="' + W.ink + '" stroke-width="2.4" stroke-linejoin="round">' +
          (broken
            ? '<path d="M6 24 h20 l4 5 -3 4 4 5 h-25 z" fill="' + W.d + '"/>' +
              '<path d="M32 27 l22 -3 4 4 -4 5 -22 3 -2 -4z" fill="' + W.m + '" transform="rotate(4 32 27)"/>'
            : '<rect x="5" y="22" width="54" height="22" rx="3" fill="' + W.d + '"/>') +
          '<path d="M10 28 h44 M10 34 h44 M10 40 h30" stroke="' + W.dd + '" stroke-width="1.2" opacity=".55" stroke-linecap="round"/>' +
          (nails ? '<g fill="' + W.steel + '" stroke="' + W.steelDark + '" stroke-width="1"><circle cx="16" cy="28" r="2.2"/><circle cx="46" cy="28" r="2.2"/><circle cx="30" cy="38" r="2.2"/></g>' : '') +
          (broken ? '<path d="M31 24 l3 6 -4 4 4 5" stroke="' + W.ink + '" stroke-width="2"/>' : '') +
        '</g>'
      );
    }

    function iconLog(variant) {
      variant = variant || 'none';
      const bark = variant === 'bark';
      const branches = variant === 'branches';
      const crooked = variant === 'crooked';
      const body = bark ? '#9A6A3F' : W.d;

      if (crooked) {
        return svg(
          '<g stroke="' + W.ink + '" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">' +
            '<path d="M8 34 C 18 20, 32 46, 48 30" stroke="' + W.ink + '" stroke-width="19" fill="none"/>' +
            '<path d="M8 34 C 18 20, 32 46, 48 30" stroke="' + body + '" stroke-width="15" fill="none"/>' +
            '<ellipse cx="50" cy="29" rx="6" ry="8" fill="' + W.l + '" stroke="' + W.ink + '" stroke-width="2" transform="rotate(18 50 29)"/>' +
            '<ellipse cx="50" cy="29" rx="2.5" ry="4" fill="' + W.dd + '" transform="rotate(18 50 29)"/>' +
            '<path d="M14 31 q6 -5 12 -1" stroke="' + W.dd + '" stroke-width="1.2" opacity=".7"/>' +
          '</g>'
        );
      }

      return svg(
        '<g stroke="' + W.ink + '" stroke-width="2.4" stroke-linejoin="round">' +
          '<rect x="8" y="23" width="40" height="20" rx="9" fill="' + body + '"/>' +
          '<ellipse cx="48" cy="33" rx="6.5" ry="10" fill="' + W.l + '" stroke="' + W.ink + '" stroke-width="2"/>' +
          '<ellipse cx="48" cy="33" rx="2.5" ry="5" fill="' + W.dd + '"/>' +
          '<path d="M14 28 h22 M14 33 h18 M14 38 h24" stroke="' + W.dd + '" stroke-width="1.2" opacity=".5" stroke-linecap="round"/>' +
          (bark ? '<path d="M10 27 q4 4 0 8 M17 26 q4 5 0 10 M24 27 q4 4 0 8 M31 26 q4 5 0 10" stroke="' + W.deep + '" stroke-width="1.5" opacity=".7" fill="none"/>' : '') +
          (branches ? '<path d="M22 23 l-3 -9 M22 23 l-7 -4" stroke="' + W.ink + '" stroke-width="3" stroke-linecap="round"/><path d="M36 23 l4 -8" stroke="' + W.ink + '" stroke-width="3" stroke-linecap="round"/>' : '') +
        '</g>'
      );
    }

    function palletMini() {
      return '<g stroke="#1A1A1A" stroke-width="2"><rect x="0" y="0" width="34" height="5" rx="1" fill="#C9A27C"/><rect x="0" y="7" width="34" height="4" rx="1" fill="#A87C52"/><rect x="2" y="13" width="6" height="8" fill="#8A6239"/><rect x="14" y="13" width="6" height="8" fill="#6B4A2A"/><rect x="26" y="13" width="6" height="8" fill="#8A6239"/><rect x="0" y="23" width="34" height="5" rx="1" fill="#C9A27C"/></g>';
    }

    function logMini() {
      return '<g stroke="#1A1A1A" stroke-width="2"><rect x="0" y="2" width="44" height="16" rx="8" fill="#8A6239"/><ellipse cx="44" cy="10" rx="5" ry="8" fill="#D4B08A"/></g>';
    }

    function iconTruck(kind) {
      const cargo = kind === 'pallet'
        ? '<g transform="translate(21 33) scale(.55)">' + palletMini() + '</g>'
        : '<g transform="translate(23 38) scale(.7)">' + logMini() + '</g>';
      return svg(
        '<g stroke="' + W.ink + '" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round">' +
          '<rect x="8" y="16" width="84" height="42" rx="5" fill="' + W.dd + '"/>' +
          '<rect x="8" y="16" width="84" height="8" rx="3" fill="' + W.amber + '"/>' +
          '<path d="M92 28 h20 l12 14 v16 h-32 z" fill="' + W.d + '"/>' +
          '<rect x="98" y="32" width="12" height="10" rx="2" fill="' + W.cream + '" opacity=".85"/>' +
          '<circle cx="30" cy="60" r="9" fill="' + W.ink + '"/><circle cx="30" cy="60" r="3.5" fill="' + W.m + '"/>' +
          '<circle cx="96" cy="60" r="9" fill="' + W.ink + '"/><circle cx="96" cy="60" r="3.5" fill="' + W.m + '"/>' +
          '<circle cx="8" cy="50" r="3" fill="#FFE7A8"/>' +
          cargo +
        '</g>',
        '0 0 128 76'
      );
    }

    function iconBin() {
      return svg(
        '<g stroke="' + W.ink + '" stroke-width="2.5" stroke-linejoin="round">' +
          '<path d="M13 20 h38 l-4 36 h-30 z" fill="' + W.deep + '"/>' +
          '<rect x="10" y="15" width="44" height="6" rx="2" fill="' + W.dd + '"/>' +
          '<path d="M23 31 l18 18 M41 31 l-18 18" stroke="' + W.rust + '" stroke-width="3.5" stroke-linecap="round"/>' +
          '<path d="M18 24 v30 M46 24 v30" stroke="' + W.ink + '" stroke-width="1" opacity=".3"/>' +
        '</g>'
      );
    }

    function iconTable() {
      return svg(
        '<g stroke="' + W.ink + '" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">' +
          '<rect x="8" y="30" width="144" height="15" rx="7" fill="' + W.d + '"/>' +
          '<rect x="8" y="30" width="144" height="5" rx="2.5" fill="' + W.m + '"/>' +
          '<rect x="24" y="45" width="11" height="58" rx="3" fill="' + W.dd + '"/>' +
          '<rect x="125" y="45" width="11" height="58" rx="3" fill="' + W.dd + '"/>' +
          '<rect x="55" y="45" width="9" height="54" rx="3" fill="' + W.deep + '"/>' +
          '<rect x="96" y="45" width="9" height="54" rx="3" fill="' + W.deep + '"/>' +
          '<rect x="35" y="80" width="90" height="9" rx="3" fill="' + W.m + '"/>' +
          '<path d="M12 38 h136" stroke="' + W.l + '" stroke-width="2" opacity=".8"/>' +
          '<path d="M28 47 v52 M132 47 v52" stroke="' + W.l + '" stroke-width="1.5" opacity=".4"/>' +
          '<path d="M104 30 v-9" stroke="#5F7C40" stroke-width="2"/>' +
          '<path d="M104 24 q-8 -8 -15 -6 q4 9 15 6" fill="' + W.moss + '" stroke="' + W.ink + '" stroke-width="1.5"/>' +
          '<path d="M104 21 q8 -9 15 -7 q-4 9 -15 7" fill="' + W.moss + '" stroke="' + W.ink + '" stroke-width="1.5"/>' +
          '<rect x="96" y="28" width="16" height="6" rx="2" fill="' + W.rust + '" stroke="' + W.ink + '" stroke-width="1.5"/>' +
        '</g>',
        '0 0 160 120'
      );
    }

    function iconPliers() {
      return svg(
        '<g stroke-linecap="round" stroke-linejoin="round" fill="none">' +
          '<path d="M18 8 L24 22 M30 8 L24 22" stroke="' + W.steelDark + '" stroke-width="4"/>' +
          '<path d="M24 22 L16 39 M24 22 L32 39" stroke="' + W.amber2 + '" stroke-width="4"/>' +
          '<circle cx="24" cy="22" r="3.5" fill="' + W.steelDark + '" stroke="' + W.ink + '" stroke-width="1.5"/>' +
          '<path d="M16 39 l-3 5 M32 39 l3 5" stroke="' + W.deep + '" stroke-width="4"/>' +
        '</g>',
        '0 0 48 48'
      );
    }

    function iconShears() {
      return svg(
        '<g stroke-linecap="round" stroke-linejoin="round" fill="none">' +
          '<path d="M12 40 L23 19 M36 40 L25 19" stroke="' + W.steelDark + '" stroke-width="4"/>' +
          '<path d="M23 19 L17 8 M25 19 L31 8" stroke="' + W.steel + '" stroke-width="4"/>' +
          '<circle cx="24" cy="19" r="3" fill="' + W.amber2 + '" stroke="' + W.ink + '" stroke-width="1.5"/>' +
          '<path d="M12 40 q-6 5 0 9" stroke="' + W.rust + '" stroke-width="4"/>' +
          '<path d="M36 40 q6 5 0 9" stroke="' + W.rust + '" stroke-width="4"/>' +
        '</g>',
        '0 0 48 48'
      );
    }

    function iconPeeler() {
      return svg(
        '<g stroke="' + W.ink + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
          '<rect x="4" y="20" width="10" height="8" rx="3" fill="' + W.dd + '"/>' +
          '<rect x="34" y="20" width="10" height="8" rx="3" fill="' + W.dd + '"/>' +
          '<path d="M14 24 q10 -9 20 0" stroke="' + W.steel + '" stroke-width="4" fill="none"/>' +
          '<path d="M14 24 q10 4 20 0" stroke="' + W.steelDark + '" stroke-width="2" fill="none"/>' +
        '</g>',
        '0 0 48 48'
      );
    }

    function iconSander() {
      return svg(
        '<g stroke="' + W.ink + '" stroke-width="2" stroke-linejoin="round">' +
          '<path d="M13 18 q11 -9 22 0" stroke="' + W.ink + '" stroke-width="5" fill="none"/>' +
          '<rect x="8" y="18" width="32" height="15" rx="6" fill="' + W.amber2 + '"/>' +
          '<rect x="10" y="32" width="28" height="6" rx="2" fill="' + W.steelDark + '"/>' +
          '<circle cx="18" cy="25" r="3" fill="' + W.cream + '"/>' +
          '<path d="M12 38 h24" stroke="' + W.dd + '" stroke-width="2"/>' +
        '</g>',
        '0 0 48 48'
      );
    }

    function iconBrush() {
      return svg(
        '<g stroke="' + W.ink + '" stroke-width="2" stroke-linejoin="round">' +
          '<rect x="19" y="5" width="10" height="16" rx="3" fill="' + W.dd + '"/>' +
          '<rect x="15" y="20" width="18" height="8" rx="2" fill="' + W.steel + '"/>' +
          '<path d="M17 28 v11 M22 28 v12 M27 28 v11 M32 28 v9" stroke="' + W.amber + '" stroke-width="4" stroke-linecap="round"/>' +
        '</g>',
        '0 0 48 48'
      );
    }

    function iconPencil() {
      return svg(
        '<g stroke="' + W.ink + '" stroke-width="2" stroke-linejoin="round">' +
          '<path d="M12 34 L32 7 l7 5 -20 27 -9 2 z" fill="' + W.amber + '"/>' +
          '<path d="M12 34 l-2 7 8 -3" fill="' + W.cream + '"/>' +
          '<path d="M32 7 l7 5" stroke="' + W.ink + '" stroke-width="2"/>' +
          '<path d="M30 12 l6 4" stroke="' + W.ink + '" stroke-width="1.5" opacity=".6"/>' +
        '</g>',
        '0 0 48 48'
      );
    }

    function iconDrill() {
      return svg(
        '<g stroke="' + W.ink + '" stroke-width="2" stroke-linejoin="round">' +
          '<rect x="6" y="14" width="24" height="14" rx="6" fill="' + W.amber2 + '"/>' +
          '<rect x="12" y="27" width="9" height="13" rx="4" fill="' + W.dd + '"/>' +
          '<path d="M30 21 h10 M40 19 l6 2 -6 2" stroke="' + W.steelDark + '" stroke-width="3" stroke-linecap="round"/>' +
          '<circle cx="14" cy="21" r="3" fill="' + W.cream + '"/>' +
          '<path d="M10 33 h5" stroke="' + W.steel + '" stroke-width="2"/>' +
        '</g>',
        '0 0 48 48'
      );
    }

  window.PalletsIcons = {
    svg: svg,
    pallet: iconPallet,
    board: iconBoard,
    log: iconLog,
    truck: iconTruck,
    bin: iconBin,
    table: iconTable,
    pliers: iconPliers,
    shears: iconShears,
    peeler: iconPeeler,
    sander: iconSander,
    brush: iconBrush,
    pencil: iconPencil,
    drill: iconDrill
  };
})();
