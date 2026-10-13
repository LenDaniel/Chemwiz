import { ChemWizBrand } from '../ChemWizBrand.jsx';
import React, { useCallback, useEffect, useState } from 'react';
import { GlobalSearch } from '../search/GlobalSearch.jsx';
import { WizFab } from '../WizFab.jsx';

const NAV_ITEMS = [
  ['home', '⌂', 'HOME', 'Learn'],
  ['tools', '⚗', 'TOOLS', 'Utilities'],
  ['progress', '◔', 'STATS', 'Progress'],
  ['profile', '◉', 'PROFILE', 'Account'],
];

export function AppShell({
  t,
  tab,
  onSwitchTab,
  onBack,
  canGoBack,
  contentMode = 'default',
  user,
  onSearchSelect,
  wizContext,
  onOpenWiz,
  onLogout,
  children,
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const logout = async () => {
    if (loggingOut || !onLogout) return;
    setLoggingOut(true);
    try { await onLogout(); }
    finally { setLoggingOut(false); }
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        openSearch();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [openSearch]);

  const vars = {
    '--cw-bg': t.bg,
    '--cw-color-scheme': t.colorScheme || 'dark',
    '--cw-panel': t.panel,
    '--cw-panel-hi': t.panelHi,
    '--cw-text': t.text,
    '--cw-muted': t.textMuted,
    '--cw-dim': t.textDim,
    '--cw-border': t.border,
    '--cw-accent': t.accent,
  };

  return (
    <div className="cw-app-root" style={vars}>
      <a className="cw-skip-link" href="#cw-main-content">Skip to learning content</a>
      <div className="cw-desktop-frame">
        <aside className="cw-sidebar" aria-label="Primary navigation">
          <div className="cw-sidebar-brand">
            <ChemWizBrand />
          </div>

          <nav className="cw-sidebar-nav">
            {NAV_ITEMS.map(([key, icon, label, hint]) => (
              <button
                key={key}
                className={`cw-sidebar-link ${tab === key ? 'is-active' : ''}`}
                onClick={() => onSwitchTab(key)}
                type="button"
              >
                <span className="cw-sidebar-icon">{icon}</span>
                <span className="cw-sidebar-copy">
                  <strong>{label}</strong>
                  <small>{hint}</small>
                </span>
              </button>
            ))}
          </nav>

          {user && <button
            className="cw-sidebar-logout"
            type="button"
            onClick={logout}
            disabled={loggingOut}
            aria-label="Log out"
          >
            <span aria-hidden="true">↪</span>
            <span>{loggingOut ? 'Logging out…' : 'Log out'}</span>
          </button>}

          <button className="cw-sidebar-search" type="button" onClick={openSearch}>
            <span aria-hidden="true">⌕</span>
            <span>SEARCH CHEMWIZ</span>
            <kbd>Ctrl K</kbd>
          </button>

          <div className="cw-sidebar-footer">
            <a className="cw-home-link" href="/">‹ ChemWiz home</a>
            <div className="cw-sidebar-user">{user?.name || user?.email || 'ChemWiz learner'}</div>
          </div>
        </aside>

        <section className="cw-shell">
          <header className="cw-topbar">
            <div className="cw-mobile-brand">
            <ChemWizBrand />
            </div>

            <div className="cw-desktop-heading">
              <div className="cw-topbar-section">{NAV_ITEMS.find(([key]) => key === tab)?.[2] || 'CHEMWIZ'}</div>
              <div className="cw-topbar-subtitle">Responsive learning workspace</div>
            </div>

            <button className="cw-topbar-search" type="button" onClick={openSearch} aria-label="Search ChemWiz">
              <span aria-hidden="true">⌕</span>
              <span className="cw-topbar-search-copy">Search topics, sections, tests…</span>
              <kbd>Ctrl K</kbd>
            </button>

            {canGoBack && (
              <button className="cw-back-button" onClick={onBack} type="button">‹ BACK</button>
            )}
          </header>

          <main id="cw-main-content" tabIndex={-1} className={`cw-screen cw-content-${contentMode}`}>
            <div className="cw-screen-stage">{children}</div>
          </main>

          <nav className="cw-mobile-tabs" aria-label="Primary navigation">
            {NAV_ITEMS.map(([key, icon, label]) => (
              <button
                key={key}
                className={`cw-mobile-tab ${tab === key ? 'is-active' : ''}`}
                onClick={() => onSwitchTab(key)}
                type="button"
              >
                <span className="cw-mobile-tab-icon">{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </section>
      </div>

      <GlobalSearch
        t={t}
        open={searchOpen}
        onClose={closeSearch}
        onSelect={onSearchSelect}
      />

      <WizFab t={t} context={wizContext} onOpen={onOpenWiz} />
    </div>
  );
}
