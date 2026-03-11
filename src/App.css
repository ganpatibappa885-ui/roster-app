/* =========================================================
   ROSTER MANAGEMENT — DEEP TEAL EDITION
   Rich teal palette · Sora typography · Elevated depth
   ========================================================= */

@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  /* ── Deep Teal Palette ── */
  --teal-950: #012e2a;
  --teal-900: #014d45;
  --teal-800: #036b5f;
  --teal-700: #0a8a7a;
  --teal-600: #0fa898;
  --teal-500: #14b8a6;
  --teal-400: #2dd4bf;
  --teal-300: #5eead4;
  --teal-200: #99f6e4;
  --teal-100: #ccfbf1;
  --teal-50:  #f0fdfa;

  /* ── Surface Colors ── */
  --bg-app:      #f0fafa;
  --bg-card:     #ffffff;
  --bg-elevated: #f5fdfb;
  --bg-hover:    #e8faf7;
  --bg-sunken:   #e2f8f4;

  /* ── Borders ── */
  --border:        #c4ede6;
  --border-strong: #84d8cc;
  --border-focus:  var(--teal-400);

  /* ── Text ── */
  --text:        #0c2320;
  --text-muted:  #3d7068;
  --text-subtle: #6ba89e;
  --text-on-teal: #ffffff;

  /* ── Accent ── */
  --accent:       var(--teal-500);
  --accent-dark:  var(--teal-700);
  --accent-hover: var(--teal-600);
  --accent-soft:  var(--teal-100);
  --accent-glow:  rgba(20, 184, 166, 0.18);

  /* ── Semantic ── */
  --success:      #059669;
  --success-bg:   #d1fae5;
  --danger:       #dc2626;
  --danger-hover: #b91c1c;
  --danger-soft:  #fef2f2;
  --warning:      #0891b2;
  --warning-bg:   #cffafe;

  /* ── Spacing ── */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;

  /* ── Radii ── */
  --radius-xs: 6px;
  --radius-sm: 10px;
  --radius-md: 14px;
  --radius-lg: 20px;
  --radius-xl: 28px;

  /* ── Shadows ── */
  --shadow-xs: 0 1px 2px rgba(1, 46, 42, 0.06);
  --shadow-sm: 0 2px 8px rgba(1, 46, 42, 0.08), 0 1px 2px rgba(1, 46, 42, 0.04);
  --shadow-md: 0 4px 16px rgba(1, 46, 42, 0.10), 0 2px 4px rgba(1, 46, 42, 0.05);
  --shadow-lg: 0 8px 32px rgba(1, 46, 42, 0.12), 0 4px 8px rgba(1, 46, 42, 0.06);
  --shadow-xl: 0 20px 60px rgba(1, 46, 42, 0.16), 0 8px 16px rgba(1, 46, 42, 0.08);
  --shadow-teal: 0 4px 20px rgba(20, 184, 166, 0.25);
  --shadow-teal-lg: 0 8px 40px rgba(20, 184, 166, 0.30);

  /* ── Typography ── */
  --font-sans: 'Sora', -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --text-xs:   11px;
  --text-sm:   12px;
  --text-base: 13px;
  --text-md:   14px;
  --text-lg:   16px;
  --text-xl:   18px;
  --text-2xl:  22px;
  --text-3xl:  28px;
  --font-light:    300;
  --font-regular:  400;
  --font-medium:   500;
  --font-semibold: 600;
  --font-bold:     700;
  --font-extrabold:800;

  /* ── Transitions ── */
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-out:    cubic-bezier(0.16, 1, 0.3, 1);
  --t-fast: 120ms ease;
  --t-base: 200ms ease;
  --t-slow: 350ms var(--ease-out);
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { scroll-behavior: smooth; }

body {
  font-family: var(--font-sans);
  background: var(--bg-app);
  background-image:
    radial-gradient(ellipse 80% 50% at 50% -20%, rgba(20,184,166,0.08) 0%, transparent 60%);
  color: var(--text);
  min-height: 100vh;
  font-size: var(--text-base);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ════════════════════════════════════════
   APP SHELL
════════════════════════════════════════ */
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* ════════════════════════════════════════
   TOPBAR
════════════════════════════════════════ */
.topbar {
  background: linear-gradient(135deg, var(--teal-900) 0%, var(--teal-800) 50%, var(--teal-700) 100%);
  border-bottom: 1px solid rgba(255,255,255,0.08);
  padding: 0 var(--space-10);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-8);
  position: sticky;
  top: 0;
  z-index: 50;
  height: 64px;
  box-shadow: var(--shadow-teal-lg);
}

/* Subtle teal shimmer line at top */
.topbar::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--teal-400), var(--teal-300), var(--teal-400), transparent);
  opacity: 0.7;
}

.topbar-brand {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.brand-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--teal-300), var(--teal-400));
  box-shadow: 0 0 12px rgba(94, 234, 212, 0.6);
  flex-shrink: 0;
  animation: pulse-dot 3s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { box-shadow: 0 0 8px rgba(94, 234, 212, 0.5); }
  50%       { box-shadow: 0 0 20px rgba(94, 234, 212, 0.9); }
}

.brand-text { display: flex; flex-direction: column; }

.app-title {
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  color: #fff;
  letter-spacing: -0.03em;
  line-height: 1.2;
}

.app-subtitle {
  font-size: 10px;
  color: rgba(153, 246, 228, 0.8);
  font-weight: var(--font-medium);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-top: 1px;
}

.topbar-controls {
  display: flex;
  align-items: center;
  gap: var(--space-5);
}

.topbar-divider {
  width: 1px;
  height: 24px;
  background: rgba(255,255,255,0.15);
  flex-shrink: 0;
}

/* ── Week Picker ── */
.week-picker {
  display: flex;
  align-items: center;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: var(--radius-md);
  padding: 3px;
  backdrop-filter: blur(8px);
  gap: 0;
}

.week-picker-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  color: rgba(255,255,255,0.7);
  cursor: pointer;
  transition: all var(--t-fast);
}

.week-picker-btn:hover:not(:disabled) {
  background: rgba(255,255,255,0.15);
  color: #fff;
}

.week-picker-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.week-label {
  padding: 0 var(--space-4);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: #fff;
  min-width: 0;
  text-align: center;
  letter-spacing: -0.01em;
  white-space: nowrap;
}

/* ── Timezone Switcher ── */
.tz-picker {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.tz-label {
  font-size: 10px;
  font-weight: var(--font-semibold);
  color: rgba(153, 246, 228, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.tz-switcher {
  display: flex;
  gap: 2px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: var(--radius-sm);
  padding: 2px;
}

.tz-btn {
  padding: 5px 14px;
  border-radius: var(--radius-xs);
  border: none;
  background: transparent;
  color: rgba(255,255,255,0.6);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  cursor: pointer;
  transition: all var(--t-fast);
  letter-spacing: 0.02em;
}

.tz-btn.active {
  background: var(--teal-400);
  color: var(--teal-950);
  box-shadow: 0 2px 8px rgba(45, 212, 191, 0.4);
}

.tz-btn:hover:not(.active) {
  background: rgba(255,255,255,0.12);
  color: #fff;
}

/* ════════════════════════════════════════
   TAB NAV
════════════════════════════════════════ */
.tabnav {
  background: var(--bg-card);
  border-bottom: 1px solid var(--border);
  padding: 0 var(--space-10);
  display: flex;
  gap: 0;
  box-shadow: var(--shadow-xs);
}

.tabnav-btn {
  padding: var(--space-4) var(--space-5);
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all var(--t-base);
  white-space: nowrap;
  position: relative;
  letter-spacing: -0.01em;
}

.tabnav-btn:hover {
  color: var(--accent-hover);
  background: var(--teal-50);
}

.tabnav-btn.active {
  color: var(--accent-dark);
  border-bottom-color: var(--accent);
  font-weight: var(--font-semibold);
  background: linear-gradient(180deg, transparent 60%, rgba(20,184,166,0.04) 100%);
}

/* ════════════════════════════════════════
   MAIN CONTENT & PAGE STRUCTURE
════════════════════════════════════════ */
.main-content { flex: 1; }

.page-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-10) 80px;
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
  margin-bottom: var(--space-2);
}

.page-header-top { display: flex; align-items: flex-start; justify-content: space-between; width: 100%; gap: var(--space-4); }

.page-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--text);
  letter-spacing: -0.5px;
  line-height: 1.2;
}

.page-subtitle {
  font-size: var(--text-base);
  color: var(--text-muted);
  margin-top: var(--space-2);
  font-weight: var(--font-regular);
}

.header-actions { display: flex; gap: var(--space-2); align-items: center; flex-shrink: 0; }

/* ════════════════════════════════════════
   PAGE CARDS
════════════════════════════════════════ */
.page-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--t-base), border-color var(--t-base);
}

.page-card:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--border-strong);
}

.page-card.no-pad {
  padding: 0;
  overflow: hidden;
}

.section-title {
  font-size: 15px;
  font-weight: var(--font-semibold);
  color: var(--text);
  margin-top: var(--space-4);
  margin-bottom: var(--space-2);
  letter-spacing: -0.02em;
}

.card-section-title {
  font-size: var(--text-md);
  font-weight: var(--font-semibold);
  color: var(--text);
  margin-bottom: var(--space-3);
  letter-spacing: -0.02em;
}

.card-desc {
  font-size: var(--text-base);
  color: var(--text-muted);
  margin-bottom: var(--space-4);
  line-height: 1.6;
}

/* ════════════════════════════════════════
   DASHBOARD
════════════════════════════════════════ */
.dash-page { padding-top: var(--space-6); }

.dash-hero {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-8);
  padding: var(--space-8);
  background: linear-gradient(135deg, var(--teal-900) 0%, var(--teal-800) 60%, var(--teal-700) 100%);
  border: 1px solid var(--teal-700);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-teal-lg);
  position: relative;
  overflow: hidden;
}

/* Hero background geometric accent */
.dash-hero::before {
  content: '';
  position: absolute;
  top: -60px; right: -60px;
  width: 220px; height: 220px;
  border-radius: 50%;
  background: rgba(45, 212, 191, 0.08);
  pointer-events: none;
}
.dash-hero::after {
  content: '';
  position: absolute;
  bottom: -40px; left: 30%;
  width: 180px; height: 180px;
  border-radius: 50%;
  background: rgba(20, 184, 166, 0.06);
  pointer-events: none;
}

.dash-hero-main { flex: 1; min-width: 0; position: relative; z-index: 1; }

.dash-title {
  font-size: var(--text-3xl);
  font-weight: var(--font-extrabold);
  color: #fff;
  letter-spacing: -0.04em;
  line-height: 1.15;
}

.dash-subtitle {
  font-size: var(--text-base);
  color: rgba(153, 246, 228, 0.85);
  margin-top: var(--space-3);
  font-weight: var(--font-medium);
}

.dash-subtitle strong {
  color: var(--teal-300);
  font-weight: var(--font-semibold);
}

/* ── Stat Cards ── */
.dash-stats {
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.stat-card {
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: var(--radius-md);
  padding: var(--space-4) var(--space-5);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 90px;
  backdrop-filter: blur(8px);
  transition: all var(--t-base);
  cursor: default;
}

.stat-card:hover {
  background: rgba(255,255,255,0.15);
  border-color: rgba(255,255,255,0.25);
  transform: translateY(-1px);
}

.stat-num {
  font-size: 2rem;
  font-weight: var(--font-extrabold);
  color: #fff;
  letter-spacing: -0.04em;
  line-height: 1;
}

.stat-lbl {
  font-size: var(--text-xs);
  color: rgba(153, 246, 228, 0.75);
  font-weight: var(--font-medium);
  margin-top: var(--space-2);
  white-space: nowrap;
  letter-spacing: 0.02em;
}

/* colored stat borders and number accents */
.stat-card.stat-working { border-left: 2px solid #6ee7b7; }
.stat-card.stat-wo      { border-left: 2px solid var(--teal-300); }
.stat-card.stat-leave   { border-left: 2px solid #fca5a5; }
.stat-card.stat-oncall  { border-left: 2px solid #7dd3fc; }
.stat-card.stat-working .stat-num { color: #a7f3d0; }
.stat-card.stat-wo      .stat-num { color: var(--teal-200); }
.stat-card.stat-leave   .stat-num { color: #fca5a5; }
.stat-card.stat-oncall  .stat-num { color: #7dd3fc; }

/* ── Status Legend ── */
.status-legend {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-xs);
}

.legend-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 999px;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  border: 1px solid transparent;
  transition: all var(--t-fast);
  letter-spacing: 0.01em;
}

.legend-pill:hover {
  filter: brightness(0.96);
  transform: translateY(-1px);
  box-shadow: var(--shadow-xs);
}

.legend-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* ════════════════════════════════════════
   ROSTER GRID (DASHBOARD)
════════════════════════════════════════ */
.roster-grid-wrap {
  overflow-x: auto;
  border-radius: var(--radius-lg);
}

.roster-grid {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--text-base);
}

.roster-grid thead th {
  background: linear-gradient(180deg, var(--teal-800) 0%, var(--teal-900) 100%);
  color: rgba(255,255,255,0.95);
  padding: 14px 16px;
  text-align: left;
  font-weight: var(--font-semibold);
  font-size: var(--text-sm);
  letter-spacing: 0.03em;
  position: sticky;
  top: 0;
}

.roster-grid thead th:first-child { border-radius: var(--radius-lg) 0 0 0; }
.roster-grid thead th:last-child  { border-radius: 0 var(--radius-lg) 0 0; }

.col-eng   { min-width: 180px; }
.col-shift { min-width: 95px; }
.col-day   { min-width: 128px; text-align: center !important; }
.day-th-label { font-weight: var(--font-semibold); }
.day-th-date  { font-size: var(--text-xs); opacity: 0.75; margin-top: 3px; }
.weekend-hdr  { background: linear-gradient(180deg, var(--teal-950) 0%, #012520 100%) !important; }

.row-even { background: var(--bg-card); }
.row-odd  { background: var(--teal-50); }

.roster-grid tbody tr { transition: background var(--t-fast); }
.roster-grid tbody tr:hover { background: var(--accent-soft); }

.cell-name {
  padding: 13px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid var(--border);
}

.cell-shift {
  padding: 13px 16px;
  border-bottom: 1px solid var(--border);
  height: 58px;
  vertical-align: middle;
}

.cell-day {
  padding: 10px 12px;
  border-bottom: 1px solid var(--border);
  border-left: 1px solid var(--border);
  text-align: center;
  vertical-align: middle;
  height: 58px;
}

.cell-day:empty {
  padding: 0;
}

.weekend-cell { background: rgba(204, 251, 241, 0.2) !important; }

.eng-avatar-sm {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--teal-600), var(--teal-400));
  color: #fff;
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(20, 184, 166, 0.3);
  letter-spacing: 0;
}

.eng-name { font-weight: var(--font-semibold); font-size: var(--text-base); color: var(--text); letter-spacing: -0.01em; }
.eng-role { font-size: var(--text-xs); color: var(--text-subtle); margin-top: 2px; }
.eng-meta { font-size: var(--text-xs); color: var(--text-subtle); margin-top: 2px; }
.eng-info { display: flex; flex-direction: column; }

.shift-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  letter-spacing: 0.02em;
}

.shift-badge-sm {
  display: inline-block;
  padding: 3px 9px;
  border-radius: 999px;
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  margin-top: var(--space-2);
}

.day-status-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: var(--radius-xs);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  margin-bottom: 4px;
}

.oc-badge {
  background: var(--warning);
  color: #fff;
  padding: 1px 5px;
  border-radius: 4px;
  font-size: 9px;
  font-weight: var(--font-bold);
  letter-spacing: 0.03em;
}

.time-range { font-size: 10px; color: var(--text-muted); line-height: 1.5; font-family: var(--font-mono); }
.tz-note    { font-size: 9px; color: var(--text-subtle); }
.time-sep   { color: var(--border-strong); }
.entry-notes{ font-size: 11px; color: var(--accent-dark); margin-top: 4px; font-style: italic; }

/* ════════════════════════════════════════
   DAILY COVERAGE CARDS
════════════════════════════════════════ */
.day-summary-cards {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: var(--space-3);
}

.day-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: all var(--t-base);
}

.day-card:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--border-strong);
  transform: translateY(-2px);
}

.day-card-weekend {
  border-color: var(--teal-200);
  background: linear-gradient(180deg, var(--teal-50) 0%, var(--bg-card) 100%);
}

.day-card-header {
  padding: var(--space-3) var(--space-4);
  background: linear-gradient(135deg, var(--teal-800), var(--teal-900));
  border-bottom: 1px solid var(--border);
}

.day-card-name { font-size: var(--text-base); font-weight: var(--font-bold); color: #fff; display: block; }
.day-card-date { font-size: 10px; color: var(--teal-200); margin-top: 2px; opacity: 0.85; }

.day-card-body { padding: var(--space-3) var(--space-4); display: flex; flex-direction: column; gap: 6px; }

.day-count-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  padding: 2px 0;
}

.day-count-num {
  min-width: 24px;
  height: 24px;
  border-radius: var(--radius-xs);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
}

/* ════════════════════════════════════════
   ROSTER EDITOR
════════════════════════════════════════ */
.editor-toolbar {
  padding: var(--space-4) var(--space-5);
  border-bottom: 1px solid var(--border);
  background: var(--bg-elevated);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.editor-legend { display: flex; flex-wrap: wrap; gap: var(--space-2); }

.search-input {
  padding: 9px 14px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-family: var(--font-sans);
  font-size: var(--text-base);
  outline: none;
  color: var(--text);
  background: var(--bg-card);
  min-width: 200px;
  height: 38px;
  transition: border-color var(--t-fast), box-shadow var(--t-fast);
}

.search-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

.editor-grid-wrap { overflow-x: auto; border-radius: var(--radius-lg); }
.editor-grid      { width: 100%; border-collapse: collapse; font-size: var(--text-base); }

.col-eng-hdr {
  padding: 14px 16px;
  background: linear-gradient(180deg, var(--teal-800) 0%, var(--teal-900) 100%);
  color: rgba(255,255,255,0.95);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  min-width: 160px;
  position: sticky;
  top: 0;
  letter-spacing: 0.02em;
}

.col-day-hdr {
  padding: 14px 12px;
  background: linear-gradient(180deg, var(--teal-800) 0%, var(--teal-900) 100%);
  color: rgba(255,255,255,0.95);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  text-align: center;
  min-width: 115px;
  position: sticky;
  top: 0;
  letter-spacing: 0.02em;
}

.day-date-small { font-size: var(--text-xs); opacity: 0.75; margin-top: 3px; }

.cell-eng-name {
  padding: 13px 16px;
  border-bottom: 1px solid var(--border);
  vertical-align: middle;
}

.cell-editable {
  padding: 10px 12px;
  border-bottom: 1px solid var(--border);
  border-left: 1px solid var(--border);
  text-align: center;
  cursor: pointer;
  vertical-align: middle;
  transition: background var(--t-fast);
}

.cell-editable:hover { background: var(--accent-soft); }

.cell-active {
  background: rgba(94, 234, 212, 0.15) !important;
  outline: 2px solid var(--teal-400);
  outline-offset: -2px;
}

.edit-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: var(--radius-xs);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  margin-bottom: 4px;
}

.oc-dot  { font-size: 9px; font-weight: var(--font-bold); margin-left: 2px; }
.edit-time { font-size: 10px; color: var(--text-muted); font-family: var(--font-mono); }
.arrow   { color: var(--border-strong); }

/* ════════════════════════════════════════
   SIDE PANEL (EDIT DRAWER)
════════════════════════════════════════ */
@keyframes overlayFadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes panelSlideIn {
  from { transform: translateX(100%); opacity: 0; }
  to   { transform: translateX(0);    opacity: 1; }
}

.edit-panel-overlay {
  position: fixed; inset: 0; z-index: 200;
  background: rgba(1, 46, 42, 0.45);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  display: flex; align-items: stretch; justify-content: flex-end;
  animation: overlayFadeIn var(--t-base) ease forwards;
}

.edit-panel {
  background: var(--bg-card);
  width: 420px; max-width: 90vw; height: 100vh;
  overflow-y: auto;
  padding: var(--space-6);
  display: flex; flex-direction: column; gap: var(--space-5);
  box-shadow: var(--shadow-xl);
  border-left: 3px solid var(--teal-400);
  animation: panelSlideIn 0.28s var(--ease-out) forwards;
}

.panel-header { display: flex; align-items: flex-start; justify-content: space-between; gap: var(--space-4); }
.panel-header h3 { font-size: var(--text-xl); font-weight: var(--font-bold); color: var(--text); letter-spacing: -0.03em; }
.panel-sub { font-size: var(--text-base); color: var(--text-muted); margin-top: var(--space-2); }

.close-btn {
  width: 34px; height: 34px; border: 1px solid var(--border);
  background: var(--bg-elevated); border-radius: var(--radius-xs);
  cursor: pointer; font-size: 14px; color: var(--text-muted);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  transition: all var(--t-fast);
}
.close-btn:hover { background: var(--bg-sunken); color: var(--text); border-color: var(--border-strong); }

.panel-section { display: flex; flex-direction: column; gap: var(--space-2); }

.panel-label {
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  color: var(--text-subtle);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.status-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-2); }

.status-option {
  padding: 9px 12px; border-radius: var(--radius-sm); border: 1.5px solid;
  font-family: var(--font-sans); font-size: var(--text-base); text-align: left;
  cursor: pointer; transition: all var(--t-fast); font-weight: var(--font-medium);
}
.status-option:hover { transform: translateY(-1px); box-shadow: var(--shadow-xs); }

.shift-options { display: flex; gap: var(--space-2); flex-wrap: wrap; }
.shift-option {
  padding: 7px 13px; border-radius: var(--radius-xs); border: 1.5px solid;
  font-family: var(--font-sans); font-size: var(--text-base); font-weight: var(--font-medium);
  cursor: pointer; transition: all var(--t-fast);
}
.shift-option:hover { transform: translateY(-1px); box-shadow: var(--shadow-xs); }

.time-row   { display: flex; align-items: center; gap: var(--space-3); }
.time-field { display: flex; flex-direction: column; gap: var(--space-2); flex: 1; }
.time-field label { font-size: var(--text-xs); color: var(--text-muted); font-weight: var(--font-medium); }
.time-field select {
  padding: 9px 12px; border: 1px solid var(--border); border-radius: var(--radius-sm);
  font-family: var(--font-sans); font-size: var(--text-base); outline: none;
  color: var(--text); background: var(--bg-card);
  transition: border-color var(--t-fast), box-shadow var(--t-fast);
}
.time-field select:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

.time-arrow { color: var(--text-subtle); font-size: 16px; flex-shrink: 0; margin-top: 22px; }
.tz-convert-note { font-size: var(--text-xs); color: var(--accent-dark); margin-top: var(--space-2); font-weight: var(--font-medium); }

.toggle-btn {
  padding: 11px 16px; border-radius: var(--radius-sm); border: 1.5px solid var(--border);
  background: var(--bg-elevated); color: var(--text-muted);
  font-family: var(--font-sans); font-size: var(--text-base); font-weight: var(--font-medium);
  cursor: pointer; transition: all var(--t-base); width: 100%; text-align: left;
}
.toggle-btn:hover { background: var(--bg-hover); border-color: var(--border-strong); }
.toggle-btn.toggle-on {
  background: var(--warning-bg); border-color: var(--warning);
  color: var(--warning); font-weight: var(--font-semibold);
}

.notes-input {
  padding: 11px 14px; border: 1px solid var(--border); border-radius: var(--radius-sm);
  font-family: var(--font-sans); font-size: var(--text-base); outline: none;
  resize: vertical; color: var(--text); width: 100%; min-height: 80px;
  transition: border-color var(--t-fast), box-shadow var(--t-fast);
  background: var(--bg-card);
}
.notes-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

.done-btn {
  padding: 12px; border-radius: var(--radius-sm); border: none;
  background: linear-gradient(135deg, var(--teal-600), var(--teal-700));
  color: #fff; font-family: var(--font-sans);
  font-size: var(--text-md); font-weight: var(--font-semibold);
  cursor: pointer; transition: all var(--t-base); margin-top: var(--space-2);
  box-shadow: 0 4px 12px rgba(20, 184, 166, 0.3);
  letter-spacing: -0.01em;
}
.done-btn:hover {
  background: linear-gradient(135deg, var(--teal-700), var(--teal-800));
  box-shadow: var(--shadow-teal);
  transform: translateY(-1px);
}

/* ════════════════════════════════════════
   BUTTONS
════════════════════════════════════════ */
.btn-primary {
  padding: 9px 20px; border-radius: var(--radius-sm); border: none;
  background: linear-gradient(135deg, var(--teal-600), var(--teal-700));
  color: #fff; font-family: var(--font-sans);
  font-size: var(--text-base); font-weight: var(--font-semibold);
  cursor: pointer; transition: all var(--t-base);
  box-shadow: 0 2px 8px rgba(20, 184, 166, 0.25);
  letter-spacing: -0.01em;
}
.btn-primary:hover {
  background: linear-gradient(135deg, var(--teal-700), var(--teal-800));
  box-shadow: var(--shadow-teal);
  transform: translateY(-1px);
}
.btn-primary:disabled { opacity: 0.45; cursor: not-allowed; transform: none; box-shadow: none; }

.btn-secondary {
  padding: 9px 20px; border-radius: var(--radius-sm);
  border: 1px solid var(--border-strong);
  background: var(--bg-card); color: var(--text-muted);
  font-family: var(--font-sans); font-size: var(--text-base); font-weight: var(--font-medium);
  cursor: pointer; transition: all var(--t-base);
}
.btn-secondary:hover { background: var(--bg-hover); border-color: var(--accent); color: var(--accent-dark); }

.btn-danger {
  padding: 9px 20px; border-radius: var(--radius-sm); border: none;
  background: var(--danger); color: #fff;
  font-family: var(--font-sans); font-size: var(--text-base); font-weight: var(--font-semibold);
  cursor: pointer; transition: all var(--t-base);
}
.btn-danger:hover { background: var(--danger-hover); transform: translateY(-1px); }

.btn-danger-sm {
  padding: 7px 13px; border-radius: var(--radius-xs); border: 1px solid #fca5a5;
  background: var(--danger-soft); color: var(--danger);
  font-family: var(--font-sans); font-size: var(--text-sm); font-weight: var(--font-semibold);
  cursor: pointer; transition: all var(--t-fast);
}
.btn-danger-sm:hover { background: #fee2e2; }

.btn-edit-sm {
  padding: 5px 11px; border-radius: var(--radius-xs);
  border: 1px solid var(--border-strong);
  background: var(--teal-50); color: var(--teal-700);
  font-family: var(--font-sans); font-size: var(--text-sm); font-weight: var(--font-medium);
  cursor: pointer; transition: all var(--t-fast);
}
.btn-edit-sm:hover { background: var(--teal-100); border-color: var(--teal-400); }

.btn-remove-sm {
  padding: 5px 11px; border-radius: var(--radius-xs); border: 1px solid #fca5a5;
  background: var(--danger-soft); color: var(--danger);
  font-family: var(--font-sans); font-size: var(--text-sm); font-weight: var(--font-medium);
  cursor: pointer; transition: all var(--t-fast);
}
.btn-remove-sm:hover { background: #fee2e2; }

.btn-save-sm {
  padding: 5px 13px; border-radius: var(--radius-xs); border: none;
  background: linear-gradient(135deg, var(--teal-600), var(--teal-700));
  color: #fff; font-family: var(--font-sans);
  font-size: var(--text-sm); font-weight: var(--font-semibold);
  cursor: pointer; transition: all var(--t-fast);
}
.btn-save-sm:hover { background: var(--teal-800); }

.btn-cancel-sm {
  padding: 5px 13px; border-radius: var(--radius-xs); border: 1px solid var(--border);
  background: var(--bg-elevated); color: var(--text-muted);
  font-family: var(--font-sans); font-size: var(--text-sm); font-weight: var(--font-medium);
  cursor: pointer; transition: all var(--t-fast);
}
.btn-cancel-sm:hover { background: var(--bg-hover); }

/* ════════════════════════════════════════
   TEAM PAGE
════════════════════════════════════════ */
.team-page { padding-top: var(--space-6); }

.team-hero {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-6);
  padding: var(--space-6) var(--space-8);
  background: linear-gradient(135deg, var(--teal-900) 0%, var(--teal-800) 100%);
  border: 1px solid var(--teal-700);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-teal);
  position: relative;
  overflow: hidden;
}

.team-hero::before {
  content: '';
  position: absolute;
  top: -50px; right: -50px;
  width: 160px; height: 160px;
  border-radius: 50%;
  background: rgba(45, 212, 191, 0.07);
  pointer-events: none;
}

.team-hero-main { flex: 1; position: relative; z-index: 1; }
.team-title { font-size: var(--text-2xl); font-weight: var(--font-extrabold); color: #fff; letter-spacing: -0.04em; }
.team-subtitle { font-size: var(--text-base); color: rgba(153, 246, 228, 0.8); margin-top: var(--space-2); }

.team-actions-grid { display: grid; grid-template-columns: 1fr 1.5fr; gap: var(--space-5); }
@media (max-width: 900px) { .team-actions-grid { grid-template-columns: 1fr; } }

.team-card { padding: var(--space-6); border-left: 3px solid var(--teal-400); }

.team-card-icon {
  width: 40px; height: 40px;
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, var(--teal-100), var(--teal-50));
  color: var(--teal-700);
  border-radius: var(--radius-sm);
  margin-bottom: var(--space-4);
  box-shadow: var(--shadow-xs);
}

.team-card-title { font-size: var(--text-md); font-weight: var(--font-semibold); color: var(--text); margin-bottom: var(--space-2); letter-spacing: -0.02em; }
.team-card-desc  { font-size: var(--text-base); color: var(--text-muted); margin-bottom: var(--space-4); line-height: 1.6; }
.team-card .week-label-input { width: 100%; max-width: none; }
.team-card-add .add-form { display: flex; gap: var(--space-3); flex-wrap: wrap; }

.team-table-card  { overflow: hidden; }
.team-table-card .eng-list-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
.team-table-card .eng-list { overflow-x: auto; }

.team-table-header {
  display: flex; align-items: center; gap: var(--space-3);
  padding: var(--space-4) var(--space-6);
  background: linear-gradient(180deg, var(--teal-800) 0%, var(--teal-900) 100%);
  color: rgba(255,255,255,0.95);
}

.team-table-title { font-size: var(--text-md); font-weight: var(--font-semibold); letter-spacing: -0.02em; }
.team-table-count {
  background: rgba(255,255,255,0.15); padding: 3px 11px;
  border-radius: 999px; font-size: var(--text-sm); font-weight: var(--font-bold);
}

.week-label-row { display: flex; align-items: center; gap: var(--space-4); flex-wrap: wrap; }

.week-label-input {
  padding: 9px 14px; height: 38px;
  border: 1px solid var(--border); border-radius: var(--radius-sm);
  font-family: var(--font-sans); font-size: var(--text-base); outline: none; color: var(--text);
  transition: border-color var(--t-fast), box-shadow var(--t-fast);
  background: var(--bg-card);
}
.week-label-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

.week-label-hint { font-size: var(--text-sm); color: var(--text-subtle); }

.add-form { display: flex; gap: var(--space-3); flex-wrap: wrap; align-items: flex-end; }

.form-input, .form-select {
  padding: 9px 14px; height: 38px;
  border: 1px solid var(--border); border-radius: var(--radius-sm);
  font-family: var(--font-sans); font-size: var(--text-base);
  outline: none; color: var(--text); min-width: 140px;
  transition: border-color var(--t-fast), box-shadow var(--t-fast);
  background: var(--bg-card);
}
.form-input:focus, .form-select:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

.form-input-sm, .form-select-sm {
  padding: 7px 11px;
  border: 1px solid var(--border); border-radius: var(--radius-xs);
  font-family: var(--font-sans); font-size: var(--text-sm); outline: none; color: var(--text);
  transition: border-color var(--t-fast), box-shadow var(--t-fast);
  background: var(--bg-card);
}
.form-input-sm:focus, .form-select-sm:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 2px var(--accent-glow);
}

.eng-list { display: flex; flex-direction: column; min-width: 480px; }

.eng-list-header {
  display: grid; grid-template-columns: 1fr 110px 150px;
  gap: var(--space-4); padding: var(--space-3) var(--space-6);
  background: var(--bg-elevated); border-bottom: 1px solid var(--border);
  font-size: var(--text-xs); font-weight: var(--font-bold); color: var(--text-subtle);
  text-transform: uppercase; letter-spacing: 0.08em;
}

.eng-list-row {
  display: grid; grid-template-columns: 1fr 110px 150px;
  gap: var(--space-4); align-items: center;
  padding: var(--space-4) var(--space-6);
  border-bottom: 1px solid var(--border);
  transition: background var(--t-fast);
}
.eng-list-row:last-child { border-bottom: none; }
.eng-list-row:hover { background: var(--teal-50); }
.eng-list-row.eng-row-even { background: var(--bg-card); }
.eng-list-row.eng-row-odd  { background: rgba(240, 253, 250, 0.7); }
.eng-list-row.eng-row-even:hover, .eng-list-row.eng-row-odd:hover { background: var(--teal-50); }

.eng-col-name    { grid-column: 1; }
.eng-col-shift   { grid-column: 2; }
.eng-col-actions { grid-column: 3; text-align: right; }

.eng-cell-member  { display: flex; align-items: center; gap: var(--space-3); min-width: 0; }
.eng-cell-shift   { min-width: 0; }
.eng-cell-actions { display: flex; justify-content: flex-end; gap: var(--space-2); }

.eng-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  background: linear-gradient(135deg, var(--teal-600), var(--teal-400));
  color: #fff; font-size: var(--text-md); font-weight: var(--font-bold);
  flex-shrink: 0; display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 8px rgba(20, 184, 166, 0.28);
}

.eng-edit-form {
  display: flex; gap: var(--space-2); flex-wrap: wrap; flex: 1; min-width: 0;
}

.eng-list-row .eng-info { display: flex; flex-direction: column; gap: 2px; }
.eng-list-row .eng-name { font-weight: var(--font-semibold); font-size: var(--text-base); letter-spacing: -0.01em; }
.eng-list-row .eng-meta { font-size: var(--text-xs); color: var(--text-subtle); }

/* ════════════════════════════════════════
   MODAL
════════════════════════════════════════ */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(1, 46, 42, 0.5);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  z-index: 300; display: flex; align-items: center; justify-content: center;
}

.modal-box {
  background: var(--bg-card); border-radius: var(--radius-lg);
  padding: var(--space-8); width: 420px; max-width: 90vw;
  box-shadow: var(--shadow-xl);
  border-top: 3px solid var(--teal-400);
}

.modal-box h3 { font-size: var(--text-xl); font-weight: var(--font-bold); margin-bottom: var(--space-3); letter-spacing: -0.03em; }
.modal-box p  { font-size: var(--text-base); color: var(--text-muted); line-height: 1.7; margin-bottom: var(--space-6); }
.modal-actions { display: flex; gap: var(--space-3); }

/* ════════════════════════════════════════
   EXPORT / REPORTS
════════════════════════════════════════ */
.export-options      { margin-bottom: var(--space-5); display: flex; flex-direction: column; gap: var(--space-4); }
.export-option-group { display: flex; flex-direction: column; gap: var(--space-2); }
.export-tz           { align-self: flex-start; }
.export-btn          { align-self: flex-start; padding: 12px 28px; font-size: var(--text-md); }

.summary-table-wrap { overflow-x: auto; border-radius: var(--radius-lg); }

.summary-table { width: 100%; border-collapse: collapse; font-size: var(--text-base); }

.summary-table thead th {
  background: linear-gradient(180deg, var(--teal-800) 0%, var(--teal-900) 100%);
  color: rgba(255,255,255,0.95);
  padding: 14px 16px; text-align: left;
  font-size: var(--text-sm); font-weight: var(--font-semibold); letter-spacing: 0.02em;
}
.summary-table thead th:first-child { border-radius: var(--radius-lg) 0 0 0; }
.summary-table thead th:last-child  { border-radius: 0 var(--radius-lg) 0 0; }
.summary-table tbody tr { transition: background var(--t-fast); }
.summary-table tbody tr:hover { background: var(--teal-50); }

.summary-eng-name { padding: 12px 16px; display: flex; align-items: center; gap: var(--space-2); font-weight: var(--font-semibold); }
.summary-count    { padding: 12px 16px; text-align: center; }

.count-pill {
  padding: 3px 9px; border-radius: 999px;
  font-size: var(--text-xs); font-weight: var(--font-bold); display: inline-block;
}
.count-zero { color: var(--border-strong); font-size: var(--text-base); }

/* ════════════════════════════════════════
   SCROLLBAR
════════════════════════════════════════ */
::-webkit-scrollbar       { width: 5px; height: 5px; }
::-webkit-scrollbar-track { background: var(--bg-elevated); }
::-webkit-scrollbar-thumb { background: var(--teal-300); border-radius: 99px; }
::-webkit-scrollbar-thumb:hover { background: var(--teal-400); }

/* ════════════════════════════════════════
   SELECTION
════════════════════════════════════════ */
::selection { background: var(--teal-200); color: var(--teal-900); }

/* ════════════════════════════════════════
   PUBLISHING CENTER
════════════════════════════════════════ */
.pub-page { padding-top: var(--space-6); }

.pub-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-6);
  padding: var(--space-6) var(--space-8);
  background: linear-gradient(135deg, var(--teal-900) 0%, var(--teal-800) 100%);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-teal);
  position: relative;
  overflow: hidden;
}
.pub-hero::before {
  content: '';
  position: absolute; top: -50px; right: -50px;
  width: 160px; height: 160px; border-radius: 50%;
  background: rgba(45,212,191,0.07); pointer-events: none;
}
.pub-hero-main { flex: 1; position: relative; z-index: 1; }
.pub-title    { font-size: var(--text-2xl); font-weight: var(--font-extrabold); color: #fff; letter-spacing: -0.04em; }
.pub-subtitle { font-size: var(--text-base); color: rgba(153,246,228,0.8); margin-top: var(--space-2); }
.pub-hero-week {
  background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
  border-radius: var(--radius-md); padding: var(--space-3) var(--space-5);
  color: #fff; font-size: var(--text-sm); font-weight: var(--font-semibold);
  backdrop-filter: blur(8px); flex-shrink: 0; max-width: 220px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

.pub-section-title {
  display: flex; align-items: center; gap: var(--space-3);
  font-size: 15px; font-weight: var(--font-bold); color: var(--text);
  letter-spacing: -0.02em; margin-bottom: var(--space-3);
}
.pub-section-icon {
  width: 28px; height: 28px; border-radius: var(--radius-xs);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}

/* ── Analytics Cards ── */
.pub-analytics-grid {
  display: grid; grid-template-columns: repeat(5, 1fr); gap: var(--space-3);
}
@media (max-width: 900px) { .pub-analytics-grid { grid-template-columns: repeat(3, 1fr); } }

.pub-analytics-card {
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: var(--radius-md); padding: var(--space-5);
  display: flex; flex-direction: column; align-items: flex-start; gap: var(--space-2);
  box-shadow: var(--shadow-sm); transition: all var(--t-base);
}
.pub-analytics-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); border-color: var(--border-strong); }
.pub-analytics-icon {
  width: 36px; height: 36px; border-radius: var(--radius-sm);
  display: flex; align-items: center; justify-content: center;
  margin-bottom: var(--space-1);
}
.pub-analytics-num { font-size: 2rem; font-weight: var(--font-extrabold); letter-spacing: -0.04em; line-height: 1; }
.pub-analytics-lbl { font-size: var(--text-xs); color: var(--text-subtle); font-weight: var(--font-medium); letter-spacing: 0.02em; }

/* ── Daily Coverage ── */
.pub-daily-grid {
  display: grid; grid-template-columns: repeat(7, 1fr); gap: var(--space-3);
}
@media (max-width: 1100px) { .pub-daily-grid { grid-template-columns: repeat(4, 1fr); } }

.pub-day-card {
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: var(--radius-md); overflow: hidden;
  box-shadow: var(--shadow-sm); transition: all var(--t-base);
}
.pub-day-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
.pub-day-weekend  { border-color: var(--teal-200); background: linear-gradient(180deg, var(--teal-50) 0%, var(--bg-card) 100%); }

.pub-day-header {
  padding: var(--space-3) var(--space-4);
  background: linear-gradient(135deg, var(--teal-800), var(--teal-900));
  display: flex; flex-direction: column;
}
.pub-day-name { font-size: var(--text-base); font-weight: var(--font-bold); color: #fff; }
.pub-day-date { font-size: 10px; color: var(--teal-200); margin-top: 2px; }

.pub-day-bar-wrap {
  padding: var(--space-3) var(--space-4) 0;
  display: flex; align-items: center; gap: var(--space-2);
}
.pub-day-bar {
  flex: 1; height: 5px; border-radius: 99px;
  background: var(--border); overflow: hidden;
}
.pub-day-bar-fill { height: 100%; border-radius: 99px; transition: width 0.6s var(--ease-out); }
.pub-day-pct { font-size: var(--text-xs); font-weight: var(--font-bold); min-width: 32px; text-align: right; }

.pub-day-stats { padding: var(--space-3) var(--space-4) var(--space-4); display: flex; flex-direction: column; gap: 4px; }
.pub-day-stat  {
  display: flex; justify-content: space-between; align-items: center;
  font-size: var(--text-xs); padding: 2px 0;
}
.pub-day-stat strong { font-weight: var(--font-bold); color: var(--text); }

/* ── Two column layout ── */
.pub-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-5); }
@media (max-width: 900px) { .pub-two-col { grid-template-columns: 1fr; } }

/* ── Shift Distribution ── */
.pub-shift-card { display: flex; flex-direction: column; gap: 0; padding: 0; overflow: hidden; }
.pub-shift-row {
  display: flex; align-items: flex-start; gap: var(--space-4);
  padding: var(--space-4) var(--space-5); border-bottom: 1px solid var(--border);
  transition: background var(--t-fast);
}
.pub-shift-row:last-child { border-bottom: none; }
.pub-shift-row:hover { background: var(--teal-50); }
.pub-shift-left { display: flex; flex-direction: column; gap: var(--space-2); min-width: 110px; }
.pub-shift-count { font-size: var(--text-xs); color: var(--text-subtle); font-weight: var(--font-medium); }
.pub-shift-names { display: flex; flex-wrap: wrap; gap: var(--space-2); flex: 1; align-items: flex-start; }
.pub-name-chip {
  background: var(--teal-50); border: 1px solid var(--teal-200);
  color: var(--teal-700); padding: 3px 9px;
  border-radius: 999px; font-size: var(--text-xs); font-weight: var(--font-medium);
}
.pub-empty { font-size: var(--text-xs); color: var(--text-subtle); font-style: italic; }

/* ── Leave Report ── */
.pub-leave-card  { padding: 0; overflow: hidden; }
.pub-leave-list  { display: flex; flex-direction: column; }
.pub-leave-row {
  display: flex; align-items: center; gap: var(--space-3);
  padding: var(--space-3) var(--space-5); border-bottom: 1px solid var(--border);
  transition: background var(--t-fast);
}
.pub-leave-row:last-child { border-bottom: none; }
.pub-leave-row:hover { background: var(--bg-elevated); }
.pub-leave-info { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; }
.pub-leave-name { font-size: var(--text-base); font-weight: var(--font-semibold); color: var(--text); }
.pub-leave-day  { font-size: var(--text-xs); color: var(--text-subtle); }

/* ── On Call ── */
.pub-oncall-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: var(--space-3);
}
.pub-oncall-card {
  background: var(--bg-elevated); border: 1px solid var(--border);
  border-radius: var(--radius-md); padding: var(--space-4);
  display: flex; flex-direction: column; gap: var(--space-3);
  transition: all var(--t-fast);
}
.pub-oncall-card:hover { border-color: var(--teal-300); background: var(--teal-50); }
.pub-oncall-day { display: flex; flex-direction: column; gap: 2px; }
.pub-oncall-day-name { font-size: var(--text-base); font-weight: var(--font-bold); color: var(--text); }
.pub-oncall-day-date { font-size: var(--text-xs); color: var(--text-subtle); }
.pub-oncall-engineers { display: flex; flex-direction: column; gap: var(--space-2); }
.pub-oncall-eng {
  display: flex; align-items: center; gap: var(--space-2);
  font-size: var(--text-sm); font-weight: var(--font-medium); color: var(--text);
}

/* ── PDF Card ── */
.pub-pdf-card { display: flex; flex-direction: column; gap: var(--space-4); }
.pub-pdf-options { display: flex; flex-direction: column; gap: var(--space-2); }
.pub-checkbox-row {
  display: flex; align-items: center; gap: var(--space-3);
  font-size: var(--text-base); color: var(--text-muted);
  cursor: pointer; padding: var(--space-2) 0;
}
.pub-checkbox-row input[type="checkbox"] {
  width: 16px; height: 16px; accent-color: var(--accent); cursor: pointer;
}
.pub-tz-row {
  display: flex; align-items: center; gap: var(--space-3);
  padding: var(--space-3) 0; border-top: 1px solid var(--border);
}
.pub-pdf-btn {
  display: flex; align-items: center; gap: var(--space-2);
  padding: 12px 24px; border-radius: var(--radius-sm); border: none;
  background: linear-gradient(135deg, var(--teal-600), var(--teal-700));
  color: #fff; font-family: var(--font-sans);
  font-size: var(--text-md); font-weight: var(--font-semibold);
  cursor: pointer; transition: all var(--t-base);
  box-shadow: 0 4px 12px rgba(20,184,166,0.3); align-self: flex-start;
}
.pub-pdf-btn:hover { background: linear-gradient(135deg, var(--teal-700), var(--teal-800)); transform: translateY(-1px); box-shadow: var(--shadow-teal); }
.pub-pdf-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

/* ── Share Card ── */
.pub-share-card { display: flex; flex-direction: column; gap: var(--space-4); }
.pub-share-btn {
  display: flex; align-items: center; gap: var(--space-2);
  padding: 12px 24px; border-radius: var(--radius-sm); border: 2px dashed var(--border-strong);
  background: var(--bg-elevated); color: var(--teal-700);
  font-family: var(--font-sans); font-size: var(--text-md); font-weight: var(--font-semibold);
  cursor: pointer; transition: all var(--t-base); align-self: flex-start;
}
.pub-share-btn:hover { border-color: var(--accent); background: var(--teal-50); }

.pub-link-result { display: flex; flex-direction: column; gap: var(--space-3); }
.pub-link-label { font-size: var(--text-xs); font-weight: var(--font-bold); color: var(--text-subtle); text-transform: uppercase; letter-spacing: 0.08em; }
.pub-link-box {
  background: var(--bg-elevated); border: 1px solid var(--border-strong);
  border-radius: var(--radius-sm); padding: var(--space-3) var(--space-4);
  display: flex; align-items: center; overflow: hidden;
}
.pub-link-url {
  font-family: var(--font-mono); font-size: var(--text-sm); color: var(--teal-700);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1;
}
.pub-link-actions { display: flex; gap: var(--space-2); flex-wrap: wrap; }
.pub-link-actions .btn-primary, .pub-link-actions .btn-secondary {
  display: flex; align-items: center; gap: var(--space-2);
}
.pub-link-note { font-size: var(--text-xs); color: var(--text-subtle); font-style: italic; }

.pub-empty-state {
  padding: var(--space-8); text-align: center;
  color: var(--text-subtle); font-size: var(--text-base); font-style: italic;
}

/* ════════════════════════════════════════
   READ-ONLY VIEW PAGE
════════════════════════════════════════ */
.view-page {
  min-height: 100vh;
  background: var(--bg-app);
  background-image: radial-gradient(ellipse 80% 50% at 50% -20%, rgba(20,184,166,0.08) 0%, transparent 60%);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
}

.view-header {
  background: linear-gradient(135deg, var(--teal-900) 0%, var(--teal-800) 100%);
  border-bottom: 1px solid rgba(255,255,255,0.08);
  box-shadow: var(--shadow-teal-lg);
  position: sticky; top: 0; z-index: 50;
}
.view-header-inner {
  max-width: 1440px; margin: 0 auto;
  padding: var(--space-5) var(--space-10);
  display: flex; align-items: center; gap: var(--space-8);
}
.view-brand { display: flex; align-items: center; gap: var(--space-3); flex-shrink: 0; }
.view-brand-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: linear-gradient(135deg, var(--teal-300), var(--teal-400));
  box-shadow: 0 0 12px rgba(94,234,212,0.6);
}
.view-brand-name { font-size: var(--text-base); font-weight: var(--font-bold); color: #fff; }
.view-readonly-badge {
  background: rgba(239,68,68,0.2); border: 1px solid rgba(239,68,68,0.4);
  color: #fca5a5; padding: 2px 8px; border-radius: 999px;
  font-size: var(--text-xs); font-weight: var(--font-semibold); letter-spacing: 0.04em;
}
.view-meta { flex: 1; }
.view-title    { font-size: var(--text-xl); font-weight: var(--font-extrabold); color: #fff; letter-spacing: -0.03em; }
.view-subtitle { font-size: var(--text-sm); color: rgba(153,246,228,0.85); margin-top: 2px; }
.view-snapshot-note { font-size: var(--text-xs); color: rgba(153,246,228,0.6); white-space: nowrap; flex-shrink: 0; }

.view-main { padding: var(--space-8) 0 80px; }
.view-container { max-width: 1440px; margin: 0 auto; padding: 0 var(--space-10); display: flex; flex-direction: column; gap: var(--space-6); }

/* Stats row */
.view-stats-row {
  display: flex; gap: var(--space-3); flex-wrap: wrap;
}
.view-stat {
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: var(--radius-md); padding: var(--space-4) var(--space-6);
  display: flex; flex-direction: column; align-items: flex-start;
  box-shadow: var(--shadow-sm); min-width: 100px;
}
.view-stat-num { font-size: 1.75rem; font-weight: var(--font-extrabold); color: var(--text); letter-spacing: -0.04em; line-height: 1; }
.view-stat-lbl { font-size: var(--text-xs); color: var(--text-subtle); font-weight: var(--font-medium); margin-top: var(--space-2); }

/* Table */
.view-card  { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); box-shadow: var(--shadow-md); }
.view-table-wrap { overflow-x: auto; border-radius: var(--radius-lg); }
.view-table { width: 100%; border-collapse: collapse; font-size: var(--text-base); }

.view-table thead th {
  background: linear-gradient(180deg, var(--teal-800) 0%, var(--teal-900) 100%);
  color: rgba(255,255,255,0.95); padding: 13px 14px;
  font-size: var(--text-sm); font-weight: var(--font-semibold); letter-spacing: 0.02em;
  text-align: left; position: sticky; top: 0;
}
.view-th-eng   { min-width: 170px; }
.view-th-shift { min-width: 90px; }
.view-th-day   { min-width: 120px; text-align: center !important; }
.view-day-date { font-size: var(--text-xs); opacity: 0.75; margin-top: 3px; }
.view-weekend-hdr { background: linear-gradient(180deg, var(--teal-950) 0%, #012520 100%) !important; }

.view-row-even { background: var(--bg-card); }
.view-row-odd  { background: var(--teal-50); }
.view-table tbody tr { transition: background var(--t-fast); }
.view-table tbody tr:hover { background: var(--accent-soft); }

.view-cell-eng {
  padding: 12px 14px; border-bottom: 1px solid var(--border);
  display: flex; align-items: center; gap: var(--space-3); vertical-align: middle;
}
.view-cell-shift { padding: 12px 14px; border-bottom: 1px solid var(--border); vertical-align: middle; }
.view-cell-day  {
  padding: 10px 12px; border-bottom: 1px solid var(--border);
  border-left: 1px solid var(--border); text-align: center; vertical-align: middle;
}
.view-weekend-cell { background: rgba(204,251,241,0.2) !important; }

.view-avatar {
  width: 30px; height: 30px; border-radius: 50%;
  background: linear-gradient(135deg, var(--teal-600), var(--teal-400));
  color: #fff; font-size: var(--text-sm); font-weight: var(--font-bold);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(20,184,166,0.3);
}
.view-eng-name { font-weight: var(--font-semibold); font-size: var(--text-base); color: var(--text); }
.view-eng-role { font-size: var(--text-xs); color: var(--text-subtle); }
.view-shift-badge {
  display: inline-block; padding: 4px 10px; border-radius: 999px;
  font-size: var(--text-xs); font-weight: var(--font-semibold);
}
.view-status-chip {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 4px 9px; border-radius: var(--radius-xs);
  font-size: var(--text-xs); font-weight: var(--font-semibold); margin-bottom: 3px;
}
.view-oc {
  background: #0891b2; color: #fff; padding: 1px 4px;
  border-radius: 3px; font-size: 9px; font-weight: var(--font-bold);
}
.view-time  { font-size: 10px; color: var(--text-muted); font-family: var(--font-mono); }
.view-notes { font-size: 10px; color: var(--accent-dark); margin-top: 3px; font-style: italic; }

.view-legend {
  display: flex; flex-wrap: wrap; gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: var(--radius-md); box-shadow: var(--shadow-xs);
}
.view-legend-pill {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 4px 11px; border-radius: 999px;
  font-size: var(--text-xs); font-weight: var(--font-medium);
}
.view-legend-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

.view-footer {
  text-align: center; font-size: var(--text-xs); color: var(--text-subtle);
  padding: var(--space-4); border-top: 1px solid var(--border);
  background: var(--bg-card); border-radius: var(--radius-md);
}

/* Error page */
.view-error-page {
  min-height: 100vh; display: flex; align-items: center; justify-content: center;
  background: var(--bg-app); font-family: var(--font-sans);
}
.view-error-box {
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: var(--radius-xl); padding: var(--space-12);
  text-align: center; max-width: 420px; box-shadow: var(--shadow-xl);
}
.view-error-icon {
  width: 56px; height: 56px; border-radius: 50%;
  background: #fee2e2; color: #dc2626;
  font-size: 24px; font-weight: var(--font-extrabold);
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto var(--space-5);
}
.view-error-box h2 { font-size: var(--text-xl); font-weight: var(--font-bold); color: var(--text); margin-bottom: var(--space-3); }
.view-error-box p  { font-size: var(--text-base); color: var(--text-muted); line-height: 1.7; }

/* ── View page timezone switcher ── */
.view-tz-block {
  display: flex; align-items: center; gap: 10px; flex-shrink: 0;
}
.view-tz-label {
  font-size: 10px; font-weight: 600; color: rgba(153,246,228,0.7);
  text-transform: uppercase; letter-spacing: 0.1em;
}
.view-tz-switcher {
  display: flex; gap: 2px;
  background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15);
  border-radius: 10px; padding: 2px;
}
.view-tz-btn {
  padding: 5px 13px; border-radius: 8px; border: none;
  background: transparent; color: rgba(255,255,255,0.6);
  font-size: 12px; font-weight: 600; cursor: pointer;
  transition: all 120ms ease; letter-spacing: 0.02em; font-family: var(--font-sans);
}
.view-tz-btn.active {
  background: var(--teal-400); color: var(--teal-950);
  box-shadow: 0 2px 8px rgba(45,212,191,0.4);
}
.view-tz-btn:hover:not(.active) { background: rgba(255,255,255,0.12); color: #fff; }
.view-tz-name { font-size: 10px; color: rgba(153,246,228,0.6); white-space: nowrap; }

/* View stats timezone info */
.view-stat-tz {
  display: flex; flex-direction: column; justify-content: center;
  background: linear-gradient(135deg, var(--teal-50), var(--bg-card));
  border: 1px solid var(--teal-200); border-radius: 12px;
  padding: 12px 20px; box-shadow: var(--shadow-xs);
}
.view-stat-tz-label { font-size: 10px; color: var(--text-subtle); font-weight: 500; text-transform: uppercase; letter-spacing: 0.06em; }
.view-stat-tz-val   { font-size: 13px; font-weight: 700; color: var(--teal-700); margin-top: 4px; letter-spacing: -0.01em; }




/* ════════════════════════════════════════
   MOBILE BOTTOM NAV
════════════════════════════════════════ */
.mobile-bottomnav { display: none; }

/* ════════════════════════════════════════
   TABLET (≤ 1024px)
════════════════════════════════════════ */
@media (max-width: 1024px) {
  .topbar { padding: 0 var(--space-5); }
  .app-subtitle { display: none; }
  .week-label { font-size: var(--text-sm); max-width: 180px; }
  .pub-analytics-grid { grid-template-columns: repeat(2, 1fr) !important; }
  .pub-daily-grid     { grid-template-columns: repeat(3, 1fr) !important; }
}

/* ════════════════════════════════════════
   MOBILE (≤ 768px)
════════════════════════════════════════ */
@media (max-width: 768px) {

  /* ── Topbar ── */
  .topbar {
    padding: 0 var(--space-3) !important;
    height: 52px !important;
    gap: var(--space-2) !important;
  }
  .topbar-brand    { display: none !important; }
  .topbar-controls { flex: 1; justify-content: space-between; gap: var(--space-2) !important; }
  .topbar-divider  { display: none !important; }
  .tz-label        { display: none !important; }
  .tz-btn          { padding: 4px 10px !important; font-size: 11px !important; }
  .week-label      { font-size: 12px !important; white-space: nowrap; }
  .week-picker-btn { width: 28px !important; height: 28px !important; }

  /* ── Hide desktop tab nav, show bottom nav ── */
  .tabnav { display: none !important; }

  .mobile-bottomnav {
    display: flex !important;
    position: fixed;
    bottom: 0; left: 0; right: 0;
    height: 60px;
    background: var(--teal-900);
    border-top: 1px solid rgba(255,255,255,0.1);
    box-shadow: 0 -4px 20px rgba(0,0,0,0.25);
    z-index: 9999;
    padding: 0 var(--space-1);
    padding-bottom: env(safe-area-inset-bottom);
  }
  .mobile-nav-btn {
    flex: 1;
    display: flex !important;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3px;
    background: none;
    border: none;
    cursor: pointer;
    color: rgba(153,246,228,0.45);
    font-size: 10px;
    font-weight: 600;
    font-family: var(--font-sans);
    padding: var(--space-2) var(--space-1);
    border-radius: var(--radius-md);
    transition: all 0.15s;
    -webkit-tap-highlight-color: transparent;
  }
  .mobile-nav-btn.active {
    color: var(--teal-300);
    background: rgba(255,255,255,0.1);
  }

  /* ── Padding for fixed bottom nav ── */
  .main-content { padding-bottom: 68px !important; }

  /* ── Dashboard hero ── */
  .dash-hero {
    flex-direction: column !important;
    gap: var(--space-4) !important;
    padding: var(--space-5) !important;
  }
  .dash-title    { font-size: var(--text-xl) !important; }
  .dash-subtitle { font-size: var(--text-sm) !important; }
  .dash-stats    { width: 100% !important; display: grid !important; grid-template-columns: repeat(3, 1fr) !important; gap: var(--space-2) !important; }
  .stat-card     { padding: var(--space-3) !important; }
  .stat-num      { font-size: 1.5rem !important; }

  /* ── Day cards horizontal scroll ── */
  .day-summary-cards {
    display: flex !important;
    overflow-x: auto !important;
    gap: var(--space-3) !important;
    padding-bottom: var(--space-2) !important;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    grid-template-columns: unset !important;
  }
  .day-card { min-width: 220px !important; scroll-snap-align: start; flex-shrink: 0; }

  /* ── Tables horizontal scroll ── */
  .roster-grid-wrap,
  .editor-grid-wrap,
  .summary-table-wrap { overflow-x: auto !important; -webkit-overflow-scrolling: touch; }
  .roster-grid, .editor-grid { min-width: 680px; }
  .summary-table              { min-width: 580px; }

  /* ── TEAM PAGE FIX — allow horizontal scroll on eng list ── */
  .team-table-card,
  .page-card.no-pad.team-table-card { overflow: visible !important; }
  .team-table-card .eng-list { overflow-x: auto !important; -webkit-overflow-scrolling: touch; }
  .eng-list-row,
  .eng-list-header { grid-template-columns: 1fr 100px 130px !important; padding: var(--space-3) var(--space-4) !important; }

  /* ── Publishing hero — stack & fix overflow ── */
  .pub-hero { flex-direction: column !important; align-items: flex-start !important; gap: var(--space-3) !important; padding: var(--space-5) !important; overflow: hidden !important; }
  .pub-hero-week { white-space: normal !important; font-size: var(--text-xs) !important; padding: var(--space-2) var(--space-3) !important; max-width: 100% !important; word-break: break-word; }
  .pub-title    { font-size: var(--text-xl) !important; }
  .pub-subtitle { font-size: var(--text-sm) !important; }

  .pub-analytics-grid { grid-template-columns: repeat(2, 1fr) !important; gap: var(--space-3) !important; }
  .pub-daily-grid     { grid-template-columns: repeat(2, 1fr) !important; }
  .pub-two-col        { grid-template-columns: 1fr !important; }
  .pub-link-actions   { flex-wrap: wrap !important; }
  .pub-link-actions .btn-primary,
  .pub-link-actions .btn-secondary { flex: 1; justify-content: center !important; }

  /* ── Editor ── */
  .editor-toolbar { flex-wrap: wrap !important; padding: var(--space-3) !important; gap: var(--space-2) !important; }
  .editor-legend  { display: none !important; }

  /* ── General ── */
  .page-card      { padding: var(--space-4) !important; border-radius: var(--radius-md) !important; }
  .page-container { padding: var(--space-4) !important; }
  .team-actions-grid { grid-template-columns: 1fr !important; }
}

/* ════════════════════════════════════════
   SMALL MOBILE (≤ 480px)
════════════════════════════════════════ */
@media (max-width: 480px) {
  .dash-stats { grid-template-columns: repeat(2, 1fr) !important; }
  .stat-num   { font-size: 1.3rem !important; }
  .pub-analytics-grid { grid-template-columns: repeat(2, 1fr) !important; }

}