const ABOUT_FEATURES = [
  {
    id: '01',
    title: 'Frontend systems',
    description:
      'Responsive React interfaces built with clean structure and usability in mind.',
  },
  {
    id: '02',
    title: 'Backend architecture',
    description:
      'FastAPI services and database-backed workflows designed for practical apps.',
  },
  {
    id: '03',
    title: 'ML integration',
    description:
      'Prediction-focused features built with Python, Pandas, NumPy, and Scikit-learn.',
  },
]

function About() {
  return (
    <section className="content-section" id="about">
      <div className="grid w-full items-start gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-14 xl:gap-20">
        <div
          className="flex h-full flex-col justify-center gap-4 lg:order-1 lg:max-w-[32rem] xl:max-w-[35rem]"
          data-reveal
        >
          {ABOUT_FEATURES.map((feature) => (
            <article
              key={feature.id}
              className="rounded-[28px] border border-[var(--line)] bg-[rgba(16,17,20,0.92)] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_18px_50px_rgba(0,0,0,0.32)] backdrop-blur-sm transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-[var(--line-strong)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_22px_56px_rgba(0,0,0,0.38)] sm:p-7"
            >
              <div className="mb-3 flex items-center gap-3">
                <span className="font-mono text-[0.72rem] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                  {feature.id}
                </span>
                <div className="h-px flex-1 bg-[var(--line)]" />
              </div>

              <h3 className="max-w-[13ch] text-[1.22rem] font-semibold tracking-[-0.03em] text-[var(--text)] text-balance sm:text-[1.32rem]">
                {feature.title}
              </h3>
              <p className="mt-3 max-w-[30ch] text-[0.96rem] leading-7 text-[var(--text-soft)] text-pretty">
                {feature.description}
              </p>
            </article>
          ))}
        </div>

        <div
          className="flex h-full flex-col justify-center lg:order-2 lg:min-h-[36rem] lg:pl-2 xl:pl-6"
          data-reveal
        >
          <div className="max-w-[44rem]">
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.22em] text-[var(--text-muted)]">
              About
            </p>
            <h2 className="mt-4 max-w-[14ch] text-[clamp(2.55rem,4.2vw,4.3rem)] font-semibold leading-[0.95] tracking-[-0.055em] text-[var(--text)] lg:max-w-none">
              Building Real-World Systems
            </h2>
            <p className="mt-6 max-w-[39rem] text-[1.05rem] leading-8 text-[var(--text-soft)] text-pretty sm:text-[1.12rem]">
              I design and develop scalable full-stack applications using React,
              FastAPI, and Python, focusing on performance, clean architecture,
              and real-world impact.
            </p>

            <div className="mt-8 grid gap-6 border-t border-[var(--line)] pt-8 sm:mt-10 sm:gap-7 sm:pt-10">
              <p className="max-w-[38rem] text-[0.98rem] leading-8 text-[var(--text-soft)] text-pretty sm:text-[1.02rem]">
                I enjoy creating applications that combine clean user interfaces
                with strong backend systems and practical machine learning
                workflows. My focus is on building products that are useful,
                scalable, and easy to use.
              </p>
              <p className="max-w-[38rem] text-[0.98rem] leading-8 text-[var(--text-soft)] text-pretty sm:text-[1.02rem]">
                I work with React for frontend development, FastAPI for backend
                APIs, and Python libraries like Pandas, NumPy, and Scikit-learn
                for data processing and predictive systems. I like solving
                real-world problems by building complete applications end to end.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
