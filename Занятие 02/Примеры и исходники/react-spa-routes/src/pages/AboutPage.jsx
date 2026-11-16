export default function AboutPage() {
   return <main><section className="info-panel">
     <h2>О каталоге</h2>
     <p>Это учебный сайт Research Atlas. Три раздела — «Каталог», «Статистика» и «О проекте» — используют одни и те же данные.</p>
     <p>Откройте <strong>DevTools → Network</strong>, включите фильтр <strong>Doc</strong> и переходите между разделами.</p>
     <p>В React SPA переход меняет экран без запроса нового HTML-документа. В React MPA переход открывает другой HTML-документ, даже несмотря на то, что каждый экран построен на React.</p>
   </section></main>;
}
