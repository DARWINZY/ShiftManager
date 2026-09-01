// ─────────────────────────────────────────────
// icons.js — SVG icon set (inline, no dependency)
// ─────────────────────────────────────────────

const Icons = {
  // size default: 16px, stroke: currentColor
  _svg(paths, size) {
    size = size || 16;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
  },

  // ── Status ──
  checkCircle(s) { return this._svg('<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>', s); },
  thermometer(s) { return this._svg('<path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/>', s); },
  fileText(s) { return this._svg('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>', s); },
  school(s) { return this._svg('<path d="M2 22V6l10-4 10 4v16"/><path d="M6 12v5"/><path d="M18 12v5"/><path d="M2 10h20"/><rect x="9" y="14" width="6" height="8"/>', s); },
  plusCircle(s) { return this._svg('<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>', s); },

  // ── UI ──
  camera(s) { return this._svg('<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>', s); },
  search(s) { return this._svg('<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>', s); },
  logOut(s) { return this._svg('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>', s); },
  arrowRight(s) { return this._svg('<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>', s); },
  chevronLeft(s) { return this._svg('<polyline points="15 18 9 12 15 6"/>', s); },
  chevronRight(s) { return this._svg('<polyline points="9 18 15 12 9 6"/>', s); },
  x(s) { return this._svg('<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>', s); },
  clock(s) { return this._svg('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>', s); },
  calendar(s) { return this._svg('<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>', s); },

  // ── Messages ──
  circleCheck(s) { return this._svg('<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>', s); },
  alertCircle(s) { return this._svg('<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>', s); },
  alertTriangle(s) { return this._svg('<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>', s); },
};
