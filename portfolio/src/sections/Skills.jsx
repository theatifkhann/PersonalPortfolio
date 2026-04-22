import { skillGroups } from '../data/skills'

function Skills() {
  return (
    <section className="content-section" id="skills">
      <div className="flex w-full flex-col gap-10 xl:gap-12">
        <div
          className="flex max-w-[42rem] flex-col justify-center"
          data-reveal
        >
          <p className="font-mono text-[0.72rem] uppercase tracking-[0.22em] text-[var(--text-muted)]">
            Skills
          </p>
          <h2 className="mt-4 max-w-[12ch] text-[clamp(2.7rem,4.8vw,4.6rem)] font-semibold leading-[0.95] tracking-[-0.055em] text-[var(--text)]">
            Engineering Skillset
          </h2>
          <p className="mt-6 max-w-[44rem] text-[1.02rem] leading-8 text-[var(--text-soft)] sm:text-[1.08rem]">
            A combination of frontend, backend, and data-driven technologies
            used to build scalable, real-world applications.
          </p>
        </div>

        <div
          className="grid gap-4 sm:gap-5 lg:grid-cols-2"
          data-reveal
        >
          {skillGroups.map((group) => (
            <article
              className="flex min-h-[280px] flex-col rounded-[28px] border border-[var(--line)] bg-[rgba(16,17,20,0.92)] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_18px_50px_rgba(0,0,0,0.32)] backdrop-blur-sm transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-[var(--line-strong)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_22px_56px_rgba(0,0,0,0.38)] sm:p-7"
              key={group.title}
            >
              <div>
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  {group.id}
                </p>
                <h3 className="mt-3 text-[1.22rem] font-semibold tracking-[-0.03em] text-[var(--text)] sm:text-[1.34rem]">
                  {group.title}
                </h3>
                <p className="mt-3 max-w-[38ch] text-[0.95rem] leading-7 text-[var(--text-soft)]">
                  {group.description}
                </p>
              </div>

              <ul className="mt-auto flex flex-wrap gap-2.5 pt-8">
                {group.items.map((item) => (
                  <li
                    className="rounded-full border border-[var(--line)] bg-[var(--surface-soft)] px-3.5 py-2 text-[0.8rem] font-medium text-[var(--text-soft)] transition-colors duration-200 hover:border-[var(--line-strong)] hover:text-[var(--text)]"
                    key={item}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Skills
