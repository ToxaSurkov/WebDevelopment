import CatalogLayout from '../../catalog-shared/react/CatalogLayout.jsx';

const links = [
  { href: './', title: 'Каталог', page: 'catalog' },
  { href: './stats.html', title: 'Статистика', page: 'stats' },
  { href: './about.html', title: 'О проекте', page: 'about' },
];

export default function SiteLayout({ children, current }) {
  const navigation = links.map(({ href, title, page }) => (
    <a key={page} href={href} className={page === current ? 'nav active' : 'nav'}
      aria-current={page === current ? 'page' : undefined}>{title}</a>
  ));
  return (
    <CatalogLayout variant="React MPA · отдельные HTML-страницы" navigation={navigation}>
      {children}
    </CatalogLayout>
  );
}
