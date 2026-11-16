export default function SiteLayout({ children, current }) {
  const links = [ ['/', 'Каталог'], ['/stats.html', 'Статистика'], ['/about.html', 'О проекте'] ];
  return <div className="page">
    <nav className="site-nav" aria-label="Разделы сайта">
      <div className="site-nav-inner"><div className="brand">Research Atlas</div>
        <div className="nav-links">
          {links.map(([href, label]) => <a className={current === href ? 'active' : ''}
            href={href} key={href}>{label}</a>)}
        </div>
      </div>
    </nav>
    <header className="hero"><div className="eyebrow">REACT MPA · ТРИ HTML-ДОКУМЕНТА</div>
      <h1>Каталог исследований</h1>
      <p>Три React-страницы. Каждый переход — загрузка другого HTML-документа с сервера.</p>
      <span className="hero-tag">MPA: / · /stats.html · /about.html</span>
    </header>
    {children}
    <footer>Лекция 02 · React + Vite · MPA</footer>
  </div>;
}
