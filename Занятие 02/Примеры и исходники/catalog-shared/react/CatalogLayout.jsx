export default function CatalogLayout({ variant, navigation, children }) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">P</span>
          <div><strong>Учебный каталог</strong><small>{variant}</small></div>
        </div>
        <nav aria-label="Разделы каталога">{navigation}</nav>
      </header>
      <main className="main-content">{children}</main>
      <footer>Курс по веб-разработке · Занятие 2</footer>
    </div>
  );
}
