export default function PublicationCard({ publication }) {
  return (
    <article className="card">
      <div className="card-meta"><span>{publication.year}</span><span>{publication.topic}</span></div>
      <h3>{publication.title}</h3>
      <p>{publication.description}</p>
      <p className="authors">{publication.authors}</p>
    </article>
  );
}
