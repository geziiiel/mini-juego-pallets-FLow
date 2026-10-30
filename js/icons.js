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
    // Ilustraciones SVG detalladas
    // ============================================================
    function iconPallet(variant) {
      variant = variant || 'none';
      const broken = variant === 'broken';
      const nails = variant === 'nails';
      const bottomW = broken ? 30 : 54;
      const middleLeftW = broken ? 24 : 54;
      const nailHeads = nails
        ? '<g>' +
            '<circle cx="16" cy="17.5" r="2.6" fill="' + W.steel + '" stroke="' + W.steelDark + '" stroke-width="1"/>' +
            '<circle cx="16" cy="17.5" r="0.9" fill="' + W.cream + '" opacity=".9"/>' +
            '<circle cx="36" cy="27.5" r="2.6" fill="' + W.steel + '" stroke="' + W.steelDark + '" stroke-width="1"/>' +
            '<circle cx="36" cy="27.5" r="0.9" fill="' + W.cream + '" opacity=".9"/>' +
            '<circle cx="50" cy="17.5" r="2.6" fill="' + W.steel + '" stroke="' + W.steelDark + '" stroke-width="1"/>' +
            '<circle cx="50" cy="17.5" r="0.9" fill="' + W.cream + '" opacity=".9"/>' +
            '<circle cx="20" cy="53.5" r="2.4" fill="' + W.steel + '" stroke="' + W.steelDark + '" stroke-width="1"/>' +
            '<circle cx="44" cy="53.5" r="2.4" fill="' + W.steel + '" stroke="' + W.steelDark + '" stroke-width="1"/>' +
          '</g>'
        : '';
      return svg(
        '<defs>' +
          '<linearGradient id="palletTop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + W.m + '"/><stop offset="1" stop-color="' + W.d + '"/></linearGradient>' +
        '</defs>' +
        '<ellipse cx="32" cy="62" rx="27" ry="3" fill="' + W.ink + '" opacity=".2"/>' +
        // bottom plank
        '<rect x="5" y="50" width="' + bottomW + '" height="7" rx="1.5" fill="url(#palletTop)"/>' +
        '<path d="M7 52 h' + (bottomW-4) + ' M7 54.5 h' + (bottomW-6) + '" stroke="' + W.dd + '" stroke-width="0.8" opacity=".55" stroke-linecap="round"/>' +
        (broken ? '<path d="M31 49 l5 4 -4 3 6 4" stroke="' + W.ink + '" stroke-width="2" fill="none" stroke-linecap="round"/>' : '') +
        // stringers (supports)
        '<rect x="8" y="34" width="10" height="13" rx="1.5" fill="' + W.dd + '"/>' +
        '<rect x="27" y="34" width="10" height="13" rx="1.5" fill="' + W.deep + '"/>' +
        '<rect x="46" y="34" width="10" height="13" rx="1.5" fill="' + W.dd + '"/>' +
        '<path d="M10 36 v9 M13 36 v9 M16 36 v9" stroke="' + W.deep + '" stroke-width="0.7" opacity=".6"/>' +
        '<path d="M29 36 v9 M32 36 v9 M35 36 v9" stroke="' + W.ink + '" stroke-width="0.7" opacity=".45"/>' +
        '<path d="M48 36 v9 M51 36 v9 M54 36 v9" stroke="' + W.deep + '" stroke-width="0.7" opacity=".6"/>' +
        // middle plank
        '<rect x="5" y="24" width="' + middleLeftW + '" height="7" rx="1.5" fill="' + W.d + '"/>' +
        (broken ? '<rect x="34" y="24" width="25" height="7" rx="1.5" fill="' + W.d + '" transform="rotate(3 34 24)"/>' : '') +
        '<path d="M7 26 h' + (middleLeftW-4) + ' M7 28.5 h' + (middleLeftW-6) + '" stroke="' + W.dd + '" stroke-width="0.8" opacity=".5" stroke-linecap="round"/>' +
        (broken ? '<path d="M36 25 h20 M36 27.5 h18" stroke="' + W.dd + '" stroke-width="0.8" opacity=".5" stroke-linecap="round" transform="rotate(3 34 24)"/>' : '') +
        // top plank
        '<rect x="5" y="14" width="54" height="7" rx="1.5" fill="url(#palletTop)"/>' +
        '<path d="M7 16 h50 M7 18.5 h46" stroke="' + W.dd + '" stroke-width="0.8" opacity=".55" stroke-linecap="round"/>' +
        '<rect x="5" y="14" width="54" height="2" rx="1" fill="' + W.l + '" opacity=".35"/>' +
        nailHeads +
        (broken ? '<path d="M29 24 l3 6 -4 4 4 5" stroke="' + W.ink + '" stroke-width="2" fill="none" stroke-linecap="round"/>' : '') +
      ''
      );
    }

    function iconBoard(variant) {
      variant = variant || 'none';
      const broken = variant === 'broken';
      const nails = variant === 'nails';
      const nailHeads = nails
        ? '<g>' +
            '<circle cx="16" cy="28" r="2.6" fill="' + W.steel + '" stroke="' + W.steelDark + '" stroke-width="1"/>' +
            '<circle cx="16" cy="28" r="0.9" fill="' + W.cream + '" opacity=".9"/>' +
            '<circle cx="46" cy="28" r="2.6" fill="' + W.steel + '" stroke="' + W.steelDark + '" stroke-width="1"/>' +
            '<circle cx="46" cy="28" r="0.9" fill="' + W.cream + '" opacity=".9"/>' +
            '<circle cx="30" cy="38" r="2.6" fill="' + W.steel + '" stroke="' + W.steelDark + '" stroke-width="1"/>' +
            '<circle cx="30" cy="38" r="0.9" fill="' + W.cream + '" opacity=".9"/>' +
          '</g>'
        : '';
      if (broken) {
        return svg(
          '<g stroke="' + W.ink + '" stroke-width="2.4" stroke-linejoin="round">' +
            '<ellipse cx="32" cy="46" rx="26" ry="2.5" fill="' + W.ink + '" opacity=".18"/>' +
            '<path d="M6 24 h20 l4 5 -3 4 4 5 h-25 z" fill="' + W.d + '"/>' +
            '<path d="M7 28 h18 M7 33 h16 M7 38 h14" stroke="' + W.dd + '" stroke-width="1" opacity=".5" stroke-linecap="round"/>' +
            '<path d="M32 27 l22 -3 4 4 -4 5 -22 3 -2 -4 z" fill="' + W.m + '" transform="rotate(4 32 27)"/>' +
            '<path d="M34 28 l18 -2 M34 32 l16 -2 M34 36 l14 -2" stroke="' + W.dd + '" stroke-width="1" opacity=".5" stroke-linecap="round" transform="rotate(4 32 27)"/>' +
            '<path d="M31 24 l3 6 -4 4 4 5" stroke="' + W.ink + '" stroke-width="2" fill="none" stroke-linecap="round"/>' +
            '<rect x="5" y="22" width="54" height="2" rx="1" fill="' + W.l + '" opacity=".3"/>' +
            nailHeads +
          '</g>'
        );
      }
      return svg(
        '<g stroke="' + W.ink + '" stroke-width="2.4" stroke-linejoin="round">' +
          '<ellipse cx="32" cy="46" rx="26" ry="2.5" fill="' + W.ink + '" opacity=".18"/>' +
          '<rect x="5" y="22" width="54" height="22" rx="3" fill="' + W.d + '"/>' +
          '<rect x="5" y="22" width="54" height="3" rx="1.5" fill="' + W.m + '" opacity=".6"/>' +
          '<path d="M10 28 h44 M10 34 h44 M10 40 h30" stroke="' + W.dd + '" stroke-width="1.2" opacity=".55" stroke-linecap="round"/>' +
          '<path d="M8 24 h50 M8 42 h50" stroke="' + W.l + '" stroke-width="1" opacity=".35" stroke-linecap="round"/>' +
          nailHeads +
        '</g>'
      );
    }

    function iconLog(variant) {
      variant = variant || 'none';
      const bark = variant === 'bark';
      const branches = variant === 'branches';
      const crooked = variant === 'crooked';
      const body = bark ? '#9A6A3F' : W.d;
      const darkBody = bark ? W.deep : W.dd;

      if (crooked) {
        return svg(
          '<g stroke="' + W.ink + '" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">' +
            '<ellipse cx="30" cy="46" rx="22" ry="2.5" fill="' + W.ink + '" opacity=".18"/>' +
            '<path d="M8 34 C 18 20, 32 46, 48 30" stroke="' + W.ink + '" stroke-width="19" fill="none"/>' +
            '<path d="M8 34 C 18 20, 32 46, 48 30" stroke="' + body + '" stroke-width="15" fill="none"/>' +
            '<path d="M10 30 C 20 18, 32 44, 46 28" stroke="' + darkBody + '" stroke-width="1.2" opacity=".55" fill="none"/>' +
            '<path d="M12 36 C 22 26, 30 40, 44 32" stroke="' + darkBody + '" stroke-width="1" opacity=".4" fill="none"/>' +
            '<ellipse cx="50" cy="29" rx="6" ry="8" fill="' + W.l + '" stroke="' + W.ink + '" stroke-width="2" transform="rotate(18 50 29)"/>' +
            '<ellipse cx="50" cy="29" rx="4.2" ry="6" fill="none" stroke="' + W.dd + '" stroke-width="1" transform="rotate(18 50 29)"/>' +
            '<ellipse cx="50" cy="29" rx="2.2" ry="3.6" fill="none" stroke="' + W.dd + '" stroke-width="1" transform="rotate(18 50 29)"/>' +
            '<ellipse cx="50" cy="29" rx="0.8" ry="1.4" fill="' + W.deep + '" transform="rotate(18 50 29)"/>' +
            '<circle cx="20" cy="26" r="1.6" fill="' + darkBody + '" opacity=".7"/>' +
            '<circle cx="34" cy="40" r="1.4" fill="' + darkBody + '" opacity=".7"/>' +
          '</g>'
        );
      }

      const branchesSvg = branches
        ? '<g stroke="' + W.ink + '" stroke-width="2.4" stroke-linecap="round">' +
            '<path d="M22 23 l-3 -9" stroke="' + W.deep + '" stroke-width="3"/>' +
            '<path d="M22 23 l-7 -4" stroke="' + W.deep + '" stroke-width="3"/>' +
            '<path d="M36 23 l4 -8" stroke="' + W.deep + '" stroke-width="3"/>' +
            '<circle cx="18" cy="13" r="4" fill="' + W.moss + '" stroke="' + W.ink + '" stroke-width="1.4"/>' +
            '<circle cx="14" cy="18" r="3.5" fill="' + W.moss + '" stroke="' + W.ink + '" stroke-width="1.4"/>' +
            '<circle cx="41" cy="14" r="4" fill="' + W.moss + '" stroke="' + W.ink + '" stroke-width="1.4"/>' +
            '<circle cx="20" cy="11" r="1.6" fill="' + W.l + '" opacity=".6"/>' +
          '</g>'
        : '';

      const barkTexture = bark
        ? '<path d="M10 27 q4 4 0 8 M17 26 q4 5 0 10 M24 27 q4 4 0 8 M31 26 q4 5 0 10 M38 27 q4 4 0 8" stroke="' + W.deep + '" stroke-width="1.6" opacity=".75" fill="none"/>' +
          '<path d="M12 30 q3 2 0 5 M19 29 q3 3 0 6 M26 30 q3 2 0 5 M33 29 q3 3 0 6" stroke="' + W.ink + '" stroke-width="0.8" opacity=".35" fill="none"/>'
        : '<path d="M14 28 h22 M14 33 h18 M14 38 h24" stroke="' + darkBody + '" stroke-width="1.2" opacity=".45" stroke-linecap="round"/>';

      return svg(
        '<g stroke="' + W.ink + '" stroke-width="2.4" stroke-linejoin="round">' +
          '<ellipse cx="28" cy="46" rx="22" ry="2.5" fill="' + W.ink + '" opacity=".18"/>' +
          '<rect x="8" y="23" width="40" height="20" rx="9" fill="' + body + '"/>' +
          '<rect x="8" y="23" width="40" height="4" rx="2" fill="' + W.l + '" opacity=".25"/>' +
          barkTexture +
          '<circle cx="16" cy="30" r="1.7" fill="' + darkBody + '" opacity=".6"/>' +
          '<circle cx="26" cy="38" r="1.4" fill="' + darkBody + '" opacity=".6"/>' +
          '<circle cx="36" cy="29" r="1.5" fill="' + darkBody + '" opacity=".6"/>' +
          '<ellipse cx="48" cy="33" rx="6.5" ry="10" fill="' + W.l + '" stroke="' + W.ink + '" stroke-width="2"/>' +
          '<ellipse cx="48" cy="33" rx="4.5" ry="7.5" fill="none" stroke="' + W.dd + '" stroke-width="1"/>' +
          '<ellipse cx="48" cy="33" rx="2.5" ry="5" fill="none" stroke="' + W.dd + '" stroke-width="1"/>' +
          '<ellipse cx="48" cy="33" rx="0.9" ry="2" fill="' + W.deep + '"/>' +
          branchesSvg +
        '</g>'
      );
    }

    function palletMini() {
      return '<g stroke="#1A1A1A" stroke-width="2">' +
        '<ellipse cx="17" cy="22" rx="16" ry="2" fill="#1A1A1A" opacity=".2"/>' +
        '<rect x="0" y="0" width="34" height="5" rx="1" fill="#C9A27C"/>' +
        '<path d="M2 2 h30 M2 4 h28" stroke="#8A6239" stroke-width="0.6" opacity=".5"/>' +
        '<rect x="0" y="7" width="34" height="4" rx="1" fill="#A87C52"/>' +
        '<rect x="2" y="13" width="6" height="8" fill="#8A6239"/>' +
        '<rect x="14" y="13" width="6" height="8" fill="#6B4A2A"/>' +
        '<rect x="26" y="13" width="6" height="8" fill="#8A6239"/>' +
        '<rect x="0" y="23" width="34" height="5" rx="1" fill="#C9A27C"/>' +
        '<path d="M2 25 h30 M2 27 h28" stroke="#8A6239" stroke-width="0.6" opacity=".5"/>' +
      '</g>';
    }

    function logMini() {
      return '<g stroke="#1A1A1A" stroke-width="2">' +
        '<ellipse cx="22" cy="20" rx="20" ry="2" fill="#1A1A1A" opacity=".2"/>' +
        '<rect x="0" y="2" width="44" height="16" rx="8" fill="#8A6239"/>' +
        '<path d="M4 6 h36 M4 10 h32 M4 14 h34" stroke="#6B4A2A" stroke-width="0.8" opacity=".5"/>' +
        '<ellipse cx="44" cy="10" rx="5" ry="8" fill="#D4B08A"/>' +
        '<ellipse cx="44" cy="10" rx="3" ry="5" fill="none" stroke="#A87C52" stroke-width="0.8"/>' +
        '<ellipse cx="44" cy="10" rx="1" ry="2" fill="#8A6239"/>' +
      '</g>';
    }

    function iconTruck(kind) {
      const cargo = '<g class="truck-cargo">' + (kind === 'pallet'
        ? '<g transform="translate(20 30) scale(.5)">' + palletMini() + '</g>'
        : '<g transform="translate(24 36) scale(.6)">' + logMini() + '</g>') + '</g>';
      return svg(
        '<defs>' +
          '<linearGradient id="truckBed" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + W.dd + '"/><stop offset="1" stop-color="' + W.deep + '"/></linearGradient>' +
          '<linearGradient id="truckCab" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + W.d + '"/><stop offset="1" stop-color="' + W.dd + '"/></linearGradient>' +
        '</defs>' +
        '<ellipse cx="64" cy="72" rx="58" ry="3" fill="' + W.ink + '" opacity=".2"/>' +
        // cargo bed
        '<rect x="8" y="16" width="84" height="42" rx="5" fill="url(#truckBed)"/>' +
        '<rect x="8" y="16" width="84" height="6" rx="3" fill="' + W.amber + '"/>' +
        '<path d="M10 18 h80 M10 20.5 h78" stroke="' + W.ink + '" stroke-width="0.6" opacity=".35"/>' +
        // bed ribs / door lines
        '<path d="M20 22 v34 M36 22 v34 M52 22 v34 M68 22 v34 M84 22 v34" stroke="' + W.deep + '" stroke-width="1.2" opacity=".55"/>' +
        '<path d="M10 46 h80" stroke="' + W.deep + '" stroke-width="1.4" opacity=".6"/>' +
        '<rect x="8" y="50" width="84" height="8" rx="2" fill="' + W.deep + '"/>' +
        // hinges
        '<rect x="12" y="48" width="4" height="6" rx="1" fill="' + W.steelDark + '"/>' +
        '<rect x="86" y="48" width="4" height="6" rx="1" fill="' + W.steelDark + '"/>' +
        // cabin
        '<path d="M92 28 h20 l12 14 v16 h-32 z" fill="url(#truckCab)"/>' +
        '<path d="M92 28 h20 l12 14 h-32 z" fill="' + W.m + '" opacity=".25"/>' +
        // window
        '<rect x="98" y="32" width="12" height="10" rx="2" fill="' + W.cream + '" opacity=".9"/>' +
        '<path d="M99 33 h10" stroke="' + W.l + '" stroke-width="1.2" opacity=".7"/>' +
        '<rect x="98" y="32" width="5" height="10" rx="1" fill="' + W.l + '" opacity=".35"/>' +
        // mirror
        '<rect x="90" y="30" width="3" height="8" rx="1" fill="' + W.steel + '"/>' +
        // grille
        '<path d="M100 46 h18 M100 49 h18 M100 52 h18" stroke="' + W.ink + '" stroke-width="1" opacity=".6"/>' +
        '<rect x="100" y="44" width="18" height="10" rx="1" fill="none" stroke="' + W.steelDark + '" stroke-width="1"/>' +
        // headlight
        '<circle cx="8" cy="50" r="3.5" fill="#FFE7A8" stroke="' + W.ink + '" stroke-width="1"/>' +
        '<circle cx="8" cy="50" r="1.5" fill="#FFF" opacity=".8"/>' +
        // tail light
        '<rect x="90" y="44" width="3" height="6" rx="1" fill="' + W.rust + '"/>' +
        // wheels
        '<g class="wheel">' +
          '<circle cx="30" cy="60" r="9" fill="' + W.ink + '"/>' +
          '<circle cx="30" cy="60" r="6" fill="' + W.steelDark + '"/>' +
          '<circle cx="30" cy="60" r="3.2" fill="' + W.steel + '"/>' +
          '<circle cx="30" cy="60" r="1.2" fill="' + W.cream + '"/>' +
          '<path d="M30 52 v16 M22 60 h16 M24.4 54.4 l11.2 11.2 M35.6 54.4 l-11.2 11.2" stroke="' + W.steel + '" stroke-width="0.8" opacity=".7"/>' +
        '</g>' +
        '<g class="wheel">' +
          '<circle cx="96" cy="60" r="9" fill="' + W.ink + '"/>' +
          '<circle cx="96" cy="60" r="6" fill="' + W.steelDark + '"/>' +
          '<circle cx="96" cy="60" r="3.2" fill="' + W.steel + '"/>' +
          '<circle cx="96" cy="60" r="1.2" fill="' + W.cream + '"/>' +
          '<path d="M96 52 v16 M88 60 h16 M90.4 54.4 l11.2 11.2 M101.6 54.4 l-11.2 11.2" stroke="' + W.steel + '" stroke-width="0.8" opacity=".7"/>' +
        '</g>' +
        // mudflaps
        '<rect x="22" y="66" width="6" height="4" rx="1" fill="' + W.ink + '" opacity=".6"/>' +
        '<rect x="88" y="66" width="6" height="4" rx="1" fill="' + W.ink + '" opacity=".6"/>' +
        '<circle class="truck-anchor" cx="36" cy="38" r="1" fill="none"/>' +
        cargo +
      '',
      '0 0 128 76'
      );
    }

    function iconBin() {
      return svg(
        '<defs>' +
          '<linearGradient id="binMetal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="' + W.steelDark + '"/><stop offset=".5" stop-color="' + W.steel + '"/><stop offset="1" stop-color="' + W.steelDark + '"/></linearGradient>' +
        '</defs>' +
        '<ellipse cx="32" cy="60" rx="20" ry="3" fill="' + W.ink + '" opacity=".22"/>' +
        '<path d="M13 20 h38 l-4 36 h-30 z" fill="url(#binMetal)"/>' +
        '<path d="M15 22 h34 M14 28 h36 M13 34 h38 M13 40 h36 M13 46 h34 M13 52 h30" stroke="' + W.ink + '" stroke-width="0.6" opacity=".35"/>' +
        '<rect x="10" y="15" width="44" height="6" rx="2" fill="' + W.dd + '"/>' +
        '<rect x="10" y="15" width="44" height="2" rx="1" fill="' + W.steel + '" opacity=".6"/>' +
        // rivets
        '<g fill="' + W.steel + '" stroke="' + W.ink + '" stroke-width="0.6">' +
          '<circle cx="14" cy="18" r="1.4"/><circle cx="32" cy="18" r="1.4"/><circle cx="50" cy="18" r="1.4"/>' +
          '<circle cx="17" cy="26" r="1.2"/><circle cx="47" cy="26" r="1.2"/>' +
          '<circle cx="16" cy="38" r="1.2"/><circle cx="48" cy="38" r="1.2"/>' +
          '<circle cx="15" cy="50" r="1.2"/><circle cx="49" cy="50" r="1.2"/>' +
        '</g>' +
        // recycling logo
        '<g transform="translate(32 38)" fill="none" stroke="' + W.moss + '" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
          '<path d="M-6 -8 L0 -2 L6 -8"/>' +
          '<path d="M-8 2 L-2 -1 L-8 -4" transform="rotate(120)"/>' +
          '<path d="M-8 2 L-2 -1 L-8 -4" transform="rotate(240)"/>' +
        '</g>' +
        '<path d="M23 31 l18 18 M41 31 l-18 18" stroke="' + W.rust + '" stroke-width="3.5" stroke-linecap="round"/>' +
        '<path d="M18 24 v30 M46 24 v30" stroke="' + W.ink + '" stroke-width="1" opacity=".3"/>' +
      ''
      );
    }

    function iconTable() {
      return svg(
        '<defs>' +
          '<linearGradient id="tableTop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + W.m + '"/><stop offset="1" stop-color="' + W.d + '"/></linearGradient>' +
        '</defs>' +
        '<ellipse cx="80" cy="114" rx="70" ry="4" fill="' + W.ink + '" opacity=".2"/>' +
        // tabletop
        '<rect x="8" y="30" width="144" height="15" rx="7" fill="url(#tableTop)"/>' +
        '<rect x="8" y="30" width="144" height="4" rx="2" fill="' + W.l + '" opacity=".5"/>' +
        '<path d="M14 34 h132 M14 38 h128 M14 42 h124" stroke="' + W.dd + '" stroke-width="0.9" opacity=".45" stroke-linecap="round"/>' +
        '<path d="M12 44 h136" stroke="' + W.deep + '" stroke-width="1.2" opacity=".6"/>' +
        // legs turned
        '<rect x="24" y="45" width="11" height="58" rx="4" fill="' + W.dd + '"/>' +
        '<rect x="125" y="45" width="11" height="58" rx="4" fill="' + W.dd + '"/>' +
        '<rect x="55" y="45" width="9" height="54" rx="4" fill="' + W.deep + '"/>' +
        '<rect x="96" y="45" width="9" height="54" rx="4" fill="' + W.deep + '"/>' +
        '<path d="M26 48 v52 M33 48 v52" stroke="' + W.deep + '" stroke-width="0.8" opacity=".5"/>' +
        '<path d="M127 48 v52 M134 48 v52" stroke="' + W.deep + '" stroke-width="0.8" opacity=".5"/>' +
        // stretchers
        '<rect x="35" y="80" width="90" height="9" rx="3" fill="' + W.m + '"/>' +
        '<path d="M37 83 h86 M37 86 h82" stroke="' + W.dd + '" stroke-width="0.8" opacity=".5"/>' +
        // decorative leaf (more detailed)
        '<path d="M104 30 v-9" stroke="#5F7C40" stroke-width="2.2"/>' +
        '<path d="M104 24 q-9 -9 -16 -6 q4 10 16 6" fill="' + W.moss + '" stroke="' + W.ink + '" stroke-width="1.5"/>' +
        '<path d="M104 21 q9 -10 16 -7 q-4 10 -16 7" fill="' + W.moss + '" stroke="' + W.ink + '" stroke-width="1.5"/>' +
        '<path d="M96 22 q3 3 6 4 M108 19 q-3 4 -6 5" stroke="' + W.l + '" stroke-width="1" opacity=".6"/>' +
        '<rect x="96" y="28" width="16" height="6" rx="2" fill="' + W.rust + '" stroke="' + W.ink + '" stroke-width="1.5"/>' +
        '<circle cx="100" cy="31" r="1" fill="' + W.cream + '"/>' +
        '<circle cx="108" cy="31" r="1" fill="' + W.cream + '"/>' +
        '<path d="M28 47 v52 M132 47 v52" stroke="' + W.l + '" stroke-width="1.5" opacity=".4"/>' +
      '',
      '0 0 160 120'
      );
    }

    function iconPliers() {
      return svg(
        '<defs>' +
          '<linearGradient id="steelG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="' + W.steelDark + '"/><stop offset=".5" stop-color="' + W.steel + '"/><stop offset="1" stop-color="' + W.steelDark + '"/></linearGradient>' +
        '</defs>' +
        '<ellipse cx="24" cy="46" rx="16" ry="2" fill="' + W.ink + '" opacity=".18"/>' +
        // handles
        '<path d="M18 8 L24 22 M30 8 L24 22" stroke="' + W.steelDark + '" stroke-width="4.2" stroke-linecap="round"/>' +
        '<path d="M18 8 L24 22 M30 8 L24 22" stroke="url(#steelG)" stroke-width="2.6" stroke-linecap="round"/>' +
        // grip rubber
        '<path d="M17 9 q1.5 2 0 4 M19 12 q1.5 2 0 4 M29 9 q-1.5 2 0 4 M31 12 q-1.5 2 0 4" stroke="' + W.amber2 + '" stroke-width="1.2" opacity=".8"/>' +
        // jaws
        '<path d="M24 22 L16 39 M24 22 L32 39" stroke="' + W.amber2 + '" stroke-width="4.2" stroke-linecap="round"/>' +
        '<path d="M24 22 L16 39 M24 22 L32 39" stroke="' + W.steel + '" stroke-width="2.4" stroke-linecap="round"/>' +
        '<path d="M16 39 l-3 5 M32 39 l3 5" stroke="' + W.deep + '" stroke-width="4.2" stroke-linecap="round"/>' +
        '<path d="M16 39 l-3 5 M32 39 l3 5" stroke="' + W.dd + '" stroke-width="2.4" stroke-linecap="round"/>' +
        // pivot
        '<circle cx="24" cy="22" r="3.8" fill="' + W.steelDark + '" stroke="' + W.ink + '" stroke-width="1.5"/>' +
        '<circle cx="24" cy="22" r="1.4" fill="' + W.cream + '" opacity=".9"/>' +
        // jaw teeth
        '<path d="M17 30 l3 1 M19 33 l3 1 M21 36 l3 1" stroke="' + W.ink + '" stroke-width="0.8" opacity=".7"/>' +
        '<path d="M31 30 l-3 1 M29 33 l-3 1 M27 36 l-3 1" stroke="' + W.ink + '" stroke-width="0.8" opacity=".7"/>' +
      '',
      '0 0 48 48'
      );
    }

    function iconShears() {
      return svg(
        '<defs>' +
          '<linearGradient id="shearG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="' + W.steelDark + '"/><stop offset=".5" stop-color="' + W.steel + '"/><stop offset="1" stop-color="' + W.steelDark + '"/></linearGradient>' +
        '</defs>' +
        '<ellipse cx="24" cy="46" rx="16" ry="2" fill="' + W.ink + '" opacity=".18"/>' +
        // handles
        '<path d="M12 40 L23 19 M36 40 L25 19" stroke="' + W.steelDark + '" stroke-width="4.4" stroke-linecap="round"/>' +
        '<path d="M12 40 L23 19 M36 40 L25 19" stroke="url(#shearG)" stroke-width="2.6" stroke-linecap="round"/>' +
        // blades
        '<path d="M23 19 L17 8 M25 19 L31 8" stroke="' + W.steel + '" stroke-width="4" stroke-linecap="round"/>' +
        '<path d="M23 19 L17 8 M25 19 L31 8" stroke="' + W.l + '" stroke-width="1.4" opacity=".6" stroke-linecap="round"/>' +
        // grips
        '<path d="M11 41 q-5 4 0 7 M37 41 q5 4 0 7" stroke="' + W.rust + '" stroke-width="4.4" stroke-linecap="round"/>' +
        '<path d="M11 41 q-5 4 0 7 M37 41 q5 4 0 7" stroke="' + W.amber2 + '" stroke-width="2" stroke-linecap="round" opacity=".5"/>' +
        // pivot
        '<circle cx="24" cy="19" r="3.4" fill="' + W.amber2 + '" stroke="' + W.ink + '" stroke-width="1.5"/>' +
        '<circle cx="24" cy="19" r="1.2" fill="' + W.cream + '" opacity=".9"/>' +
        // blade serration
        '<path d="M18 10 l2 1 M20 12 l2 1 M29 10 l-2 1 M27 12 l-2 1" stroke="' + W.ink + '" stroke-width="0.8" opacity=".6"/>' +
      '',
      '0 0 48 48'
      );
    }

    function iconPeeler() {
      return svg(
        '<defs>' +
          '<linearGradient id="peelSteel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + W.steel + '"/><stop offset="1" stop-color="' + W.steelDark + '"/></linearGradient>' +
        '</defs>' +
        '<ellipse cx="24" cy="44" rx="16" ry="2" fill="' + W.ink + '" opacity=".18"/>' +
        '<rect x="4" y="20" width="10" height="8" rx="3" fill="' + W.dd + '"/>' +
        '<rect x="34" y="20" width="10" height="8" rx="3" fill="' + W.dd + '"/>' +
        '<path d="M6 21 h6 M6 24 h6 M6 27 h6" stroke="' + W.deep + '" stroke-width="0.7" opacity=".6"/>' +
        '<path d="M36 21 h6 M36 24 h6 M36 27 h6" stroke="' + W.deep + '" stroke-width="0.7" opacity=".6"/>' +
        '<path d="M14 24 q10 -9 20 0" stroke="url(#peelSteel)" stroke-width="4.2" fill="none"/>' +
        '<path d="M14 24 q10 -9 20 0" stroke="' + W.l + '" stroke-width="1.4" fill="none" opacity=".6"/>' +
        '<path d="M14 24 q10 4 20 0" stroke="' + W.steelDark + '" stroke-width="2" fill="none"/>' +
        // blade edge
        '<path d="M16 22 l16 -6" stroke="' + W.cream + '" stroke-width="0.8" opacity=".7"/>' +
        '<circle cx="9" cy="24" r="1.2" fill="' + W.cream + '" opacity=".8"/>' +
        '<circle cx="39" cy="24" r="1.2" fill="' + W.cream + '" opacity=".8"/>' +
      '',
      '0 0 48 48'
      );
    }

    function iconSander() {
      return svg(
        '<defs>' +
          '<linearGradient id="sanderG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + W.amber2 + '"/><stop offset="1" stop-color="' + W.rust + '"/></linearGradient>' +
        '</defs>' +
        '<ellipse cx="24" cy="46" rx="16" ry="2" fill="' + W.ink + '" opacity=".18"/>' +
        '<path d="M13 18 q11 -9 22 0" stroke="' + W.ink + '" stroke-width="5.2" fill="none" stroke-linecap="round"/>' +
        '<path d="M13 18 q11 -9 22 0" stroke="' + W.steelDark + '" stroke-width="3" fill="none" stroke-linecap="round"/>' +
        '<rect x="8" y="18" width="32" height="15" rx="6" fill="url(#sanderG)"/>' +
        '<rect x="8" y="18" width="32" height="4" rx="3" fill="' + W.l + '" opacity=".3"/>' +
        '<rect x="10" y="32" width="28" height="6" rx="2" fill="' + W.steelDark + '"/>' +
        '<rect x="10" y="32" width="28" height="2" rx="1" fill="' + W.steel + '" opacity=".5"/>' +
        '<circle cx="18" cy="25" r="3" fill="' + W.cream + '" stroke="' + W.ink + '" stroke-width="1"/>' +
        '<circle cx="18" cy="25" r="1.2" fill="' + W.steelDark + '"/>' +
        '<circle cx="30" cy="25" r="2" fill="' + W.cream + '" opacity=".7"/>' +
        '<path d="M12 38 h24" stroke="' + W.dd + '" stroke-width="2"/>' +
        '<path d="M14 40 h20" stroke="' + W.deep + '" stroke-width="1.2" opacity=".6"/>' +
        // grip texture
        '<path d="M12 20 v11 M16 20 v11 M20 20 v11 M24 20 v11 M28 20 v11 M32 20 v11 M36 20 v11" stroke="' + W.ink + '" stroke-width="0.6" opacity=".25"/>' +
      '',
      '0 0 48 48'
      );
    }

    function iconBrush() {
      return svg(
        '<defs>' +
          '<linearGradient id="brushHandle" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + W.dd + '"/><stop offset="1" stop-color="' + W.deep + '"/></linearGradient>' +
        '</defs>' +
        '<ellipse cx="24" cy="46" rx="14" ry="2" fill="' + W.ink + '" opacity=".18"/>' +
        '<rect x="19" y="5" width="10" height="16" rx="3" fill="url(#brushHandle)"/>' +
        '<rect x="19" y="5" width="10" height="3" rx="1.5" fill="' + W.l + '" opacity=".3"/>' +
        '<path d="M21 7 v12 M24 7 v12 M27 7 v12" stroke="' + W.deep + '" stroke-width="0.7" opacity=".6"/>' +
        '<rect x="15" y="20" width="18" height="8" rx="2" fill="' + W.steel + '"/>' +
        '<rect x="15" y="20" width="18" height="2" rx="1" fill="' + W.l + '" opacity=".4"/>' +
        '<path d="M17 22 v4 M21 22 v4 M25 22 v4 M29 22 v4 M32 22 v4" stroke="' + W.steelDark + '" stroke-width="0.7" opacity=".6"/>' +
        '<path d="M17 28 v11 M22 28 v12 M27 28 v11 M32 28 v9" stroke="' + W.amber + '" stroke-width="4" stroke-linecap="round"/>' +
        '<path d="M17 28 v11 M22 28 v12 M27 28 v11 M32 28 v9" stroke="' + W.amber2 + '" stroke-width="1.6" stroke-linecap="round" opacity=".6"/>' +
        // bristle tips
        '<circle cx="17" cy="39" r="0.9" fill="' + W.amber2 + '"/>' +
        '<circle cx="22" cy="40" r="0.9" fill="' + W.amber2 + '"/>' +
        '<circle cx="27" cy="39" r="0.9" fill="' + W.amber2 + '"/>' +
        '<circle cx="32" cy="37" r="0.9" fill="' + W.amber2 + '"/>' +
      '',
      '0 0 48 48'
      );
    }

    function iconPencil() {
      return svg(
        '<defs>' +
          '<linearGradient id="pencilG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="' + W.amber + '"/><stop offset="1" stop-color="' + W.amber2 + '"/></linearGradient>' +
        '</defs>' +
        '<ellipse cx="24" cy="46" rx="14" ry="2" fill="' + W.ink + '" opacity=".18"/>' +
        '<path d="M12 34 L32 7 l7 5 -20 27 -9 2 z" fill="url(#pencilG)"/>' +
        '<path d="M14 32 L33 9" stroke="' + W.l + '" stroke-width="1.2" opacity=".6"/>' +
        '<path d="M32 7 l7 5" stroke="' + W.ink + '" stroke-width="2"/>' +
        '<path d="M30 12 l6 4" stroke="' + W.ink + '" stroke-width="1.5" opacity=".6"/>' +
        '<path d="M28 17 l6 4" stroke="' + W.ink + '" stroke-width="1.2" opacity=".4"/>' +
        '<path d="M26 22 l6 4" stroke="' + W.ink + '" stroke-width="1.2" opacity=".4"/>' +
        '<path d="M12 34 l-2 7 8 -3" fill="' + W.cream + '" stroke="' + W.ink + '" stroke-width="1.5"/>' +
        '<path d="M11 37 l3 2" stroke="' + W.ink + '" stroke-width="1" opacity=".6"/>' +
        '<path d="M31 8 l2 -3" stroke="' + W.steelDark + '" stroke-width="2" stroke-linecap="round"/>' +
        '<circle cx="33" cy="5" r="1.2" fill="' + W.steel + '"/>' +
      '',
      '0 0 48 48'
      );
    }

    function iconDrill() {
      return svg(
        '<defs>' +
          '<linearGradient id="drillG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + W.amber2 + '"/><stop offset="1" stop-color="' + W.rust + '"/></linearGradient>' +
        '</defs>' +
        '<ellipse cx="24" cy="46" rx="14" ry="2" fill="' + W.ink + '" opacity=".18"/>' +
        '<rect x="6" y="14" width="24" height="14" rx="6" fill="url(#drillG)"/>' +
        '<rect x="6" y="14" width="24" height="4" rx="3" fill="' + W.l + '" opacity=".3"/>' +
        '<rect x="12" y="27" width="9" height="13" rx="4" fill="' + W.dd + '"/>' +
        '<rect x="12" y="27" width="9" height="3" rx="2" fill="' + W.steel + '" opacity=".4"/>' +
        '<path d="M30 21 h10 M40 19 l6 2 -6 2" stroke="' + W.steelDark + '" stroke-width="3" stroke-linecap="round"/>' +
        '<path d="M30 21 h10" stroke="' + W.steel + '" stroke-width="1.4" stroke-linecap="round" opacity=".6"/>' +
        // chuck
        '<rect x="28" y="18" width="4" height="6" rx="1" fill="' + W.steelDark + '"/>' +
        '<circle cx="14" cy="21" r="3" fill="' + W.cream + '" stroke="' + W.ink + '" stroke-width="1"/>' +
        '<circle cx="14" cy="21" r="1.2" fill="' + W.steelDark + '"/>' +
        // grip texture
        '<path d="M8 16 v10 M12 16 v10 M16 16 v10 M20 16 v10 M24 16 v10 M28 16 v10" stroke="' + W.ink + '" stroke-width="0.6" opacity=".25"/>' +
        '<path d="M10 33 h5" stroke="' + W.steel + '" stroke-width="2"/>' +
        '<rect x="11" y="36" width="7" height="2" rx="1" fill="' + W.steelDark + '"/>' +
      '',
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