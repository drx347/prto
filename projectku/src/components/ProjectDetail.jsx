export default function ProjectDetail({ project }) {
  return (
    <article className="card">
      <div className="cardBody">
        <h3 className="h3">{project.title}</h3>
        <p className="muted">{project.description}</p>
        {project.showcase?.length ? (
          <ul className="cardShowcase" aria-label="Showcase">
            {project.showcase.slice(0, 4).map((item) => (
              <li key={item} className="cardShowcaseItem muted">
                {item}
              </li>
            ))}
          </ul>
        ) : null}
        <div className="tagRow" aria-label="Tags">
          {project.tags.map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className="cardFooter">
        {project.links?.map((l) => (
          <a key={l.href} className="pillLink" href={l.href} target="_blank" rel="noreferrer">
            {l.label} <span aria-hidden="true">↗</span>
          </a>
        ))}
      </div>
    </article>
  );
}
