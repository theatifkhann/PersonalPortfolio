import SectionTitle from '../components/SectionTitle'
import { experience, recognitions } from '../data/experience'

function Experience() {
  return (
    <section className="content-section" id="experience">
      <div className="feature-columns">
        <div className="feature-column" data-reveal>
          <SectionTitle
            eyebrow="Experience"
            title="Working experience"
            description="A structured view of product and frontend work across teams."
          />

          <div className="feature-list">
            {experience.map((item) => (
              <article className="feature-list__item" key={`${item.company}-${item.period}`}>
                <span className="feature-list__mark">{item.mark}</span>
                <div>
                  <h3>
                    {item.role} at <strong>{item.company}</strong>
                  </h3>
                  <p>{item.period}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="feature-column" data-reveal>
          <SectionTitle
            eyebrow="Recognition"
            title="Awards & Recognition"
            description="Social proof presented in the same calm, list-based rhythm."
          />

          <div className="feature-list">
            {recognitions.map((item) => (
              <article className="feature-list__item" key={`${item.title}-${item.period}`}>
                <span className="feature-list__mark">{item.mark}</span>
                <div>
                  <h3>
                    {item.title} at <strong>{item.source}</strong>
                  </h3>
                  <p>{item.period}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Experience
