function ProjectCard({ project }) {
  return (
    <article className="project-card" data-reveal>
      <div
        className="project-card__preview"
        style={{ background: project.preview.gradient }}
        aria-hidden="true"
      >
        <span>{project.preview.eyebrow}</span>
        <h3>{project.preview.headline}</h3>
      </div>

      <div className="project-card__body">
        <div className="project-card__meta">
          <p className="project-card__label">Featured Project</p>
          <h3>{project.title}</h3>
        </div>

        <p>{project.summary}</p>
        <p className="project-card__impact">{project.impact}</p>

        <ul className="tag-list" aria-label={`${project.title} technology stack`}>
          {project.stack.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <div className="project-card__links">
          {project.links.map((link) => (
            <a key={link.label} href={link.href}>
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </article>
  )
}

export default ProjectCard
