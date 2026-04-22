import { useEffect, useRef, useState } from 'react'
import ProjectReadme from '../components/ProjectReadme'
import { projects } from '../data/projects'

function getProjectOffset(index, activeIndex, total) {
  const forward = (index - activeIndex + total) % total
  const backward = (activeIndex - index + total) % total

  if (forward === 0) return 0
  if (forward === 1) return 1
  if (backward === 1) return -1

  return 2
}

function getCardPresentation(offset, viewportWidth) {
  if (offset === 0) {
    return {
      translateX: '0rem',
      rotate: '0deg',
      scale: 1,
      opacity: 1,
      zIndex: 30,
      pointerEvents: 'auto',
    }
  }

  if (viewportWidth < 640) {
    return {
      translateX: offset < 0 ? '-5rem' : '5rem',
      rotate: '0deg',
      scale: 0.94,
      opacity: 0,
      zIndex: 0,
      pointerEvents: 'none',
    }
  }

  if (viewportWidth < 1024) {
    return {
      translateX: offset < 0 ? '-11rem' : '11rem',
      rotate: offset < 0 ? '-7deg' : '7deg',
      scale: 0.88,
      opacity: 0.56,
      zIndex: 20,
      pointerEvents: 'auto',
    }
  }

  return {
    translateX: offset < 0 ? '-18rem' : '18rem',
    rotate: offset < 0 ? '-9deg' : '9deg',
    scale: 0.84,
    opacity: 0.52,
    zIndex: 20,
    pointerEvents: 'auto',
  }
}

function Projects() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [detailsHeight, setDetailsHeight] = useState(0)
  const [comingSoonProject, setComingSoonProject] = useState(null)
  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window === 'undefined' ? 1440 : window.innerWidth,
  )
  const detailsRef = useRef(null)
  const detailsContentRef = useRef(null)
  const wasDetailsOpenRef = useRef(false)

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const detailsProject = isDetailsOpen ? projects[activeIndex] : null

  const nextProject = () => {
    setActiveIndex((currentIndex) => (currentIndex + 1) % projects.length)
  }

  const previousProject = () => {
    setActiveIndex((currentIndex) =>
      currentIndex === 0 ? projects.length - 1 : currentIndex - 1,
    )
  }

  const openProjectDetails = (index) => {
    setActiveIndex(index)
    setComingSoonProject(null)
    setIsDetailsOpen((currentValue) => (index === activeIndex ? !currentValue : true))
  }

  const openProjectLink = (index) => {
    const href = projects[index]?.links?.[0]?.href

    if (href && href !== '#') {
      setComingSoonProject(null)
      window.open(href, '_blank', 'noopener,noreferrer')
      return
    }

    setActiveIndex(index)
    setComingSoonProject(projects[index])
  }

  useEffect(() => {
    const wasDetailsOpen = wasDetailsOpenRef.current

    if (isDetailsOpen && !wasDetailsOpen && detailsRef.current) {
      detailsRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }

    wasDetailsOpenRef.current = isDetailsOpen
  }, [isDetailsOpen])

  useEffect(() => {
    if (!isDetailsOpen || !detailsContentRef.current) {
      setDetailsHeight(0)
      return undefined
    }

    const updateHeight = () => {
      if (!detailsContentRef.current) {
        return
      }

      setDetailsHeight(detailsContentRef.current.scrollHeight)
    }

    updateHeight()

    const observer = new ResizeObserver(() => {
      updateHeight()
    })

    observer.observe(detailsContentRef.current)
    window.addEventListener('resize', updateHeight)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateHeight)
    }
  }, [activeIndex, isDetailsOpen])

  return (
    <section className="content-section !justify-start" id="projects">
      <div className="mx-auto flex min-h-[calc(100svh-72px-112px)] w-full max-w-[84rem] flex-col gap-10 xl:gap-12">
        <div className="max-w-[52rem]" data-reveal>
          <p className="font-mono text-[0.72rem] uppercase tracking-[0.22em] text-[var(--text-muted)]">
            Projects
          </p>
          <h2 className="mt-4 max-w-[12ch] text-[clamp(2.8rem,4.8vw,4.9rem)] font-semibold leading-[0.94] tracking-[-0.06em] text-[var(--text)]">
            Featured Projects
          </h2>
          
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-6 xl:gap-8" data-reveal>
          <div className="relative flex h-[28rem] w-full items-center justify-center overflow-hidden sm:h-[30rem] lg:h-[32rem] xl:h-[34rem]">
            {projects.map((project, index) => {
              const offset = getProjectOffset(index, activeIndex, projects.length)
              const isActive = offset === 0
              const presentation = getCardPresentation(offset, viewportWidth)
              const showCard = offset === 0 || offset === -1 || offset === 1

              if (!showCard) {
                return null
              }

              return (
                <div
                  key={project.id}
                  className={`absolute left-1/2 top-1/2 text-left transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isActive
                      ? 'h-[27rem] w-[min(88vw,28rem)] sm:h-[28rem] sm:w-[24rem] lg:h-[30rem] lg:w-[26rem] xl:h-[31rem] xl:w-[28rem]'
                      : 'h-[23rem] w-[min(70vw,20rem)] sm:h-[24rem] sm:w-[18rem] lg:h-[26rem] lg:w-[20rem]'
                  }`}
                  style={{
                    transform: `translate(-50%, -50%) translateX(${presentation.translateX}) scale(${presentation.scale}) rotate(${presentation.rotate})`,
                    opacity: presentation.opacity,
                    zIndex: presentation.zIndex,
                    pointerEvents: presentation.pointerEvents,
                  }}
                  onClick={() => setActiveIndex(index)}
                >
                  <article
                    className={`relative flex h-full flex-col justify-end overflow-hidden rounded-[2rem] border border-white/10 bg-[#090b10] shadow-[0_20px_60px_rgba(0,0,0,0.42)] ${
                      isActive ? 'ring-1 ring-white/8' : ''
                    }`}
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        background:
                          project.cover.image
                            ? `linear-gradient(180deg, rgba(5,7,10,0.02) 0%, rgba(5,7,10,0.16) 38%, rgba(5,7,10,0.92) 100%), url(${project.cover.image}) center/cover no-repeat`
                            : `linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02)), ${project.cover.theme}`,
                      }}
                    />

                    {!project.cover.image ? (
                      <div className="absolute inset-x-0 top-0 flex h-[48%] items-center justify-center">
                        <div className="rounded-[1.75rem] border border-white/10 bg-white/5 px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                          <p className="font-mono text-[0.68rem] uppercase tracking-[0.24em] text-white/58">
                            {project.cover.eyebrow}
                          </p>
                          <p className="mt-3 text-[1.8rem] font-semibold leading-none tracking-[-0.05em] text-white">
                            ML
                          </p>
                        </div>
                      </div>
                    ) : null}

                    <div className="relative z-10 flex h-full flex-col justify-end p-4 sm:p-5">
                      <div className="rounded-[1.7rem] border border-white/10 bg-[linear-gradient(180deg,rgba(8,10,14,0.16),rgba(8,10,14,0.82))] p-4 backdrop-blur-md sm:p-5">
                        <h3
                          className={`text-white ${
                            isActive
                              ? 'text-[2rem] leading-[0.92] tracking-[-0.06em] sm:text-[2.3rem]'
                              : 'text-[1.5rem] leading-[0.96] tracking-[-0.05em]'
                          } font-semibold`}
                        >
                          {project.title}
                        </h3>

                        <div className="mt-5 flex flex-wrap gap-3">
                          <button
                            type="button"
                            className="inline-flex min-h-[46px] items-center justify-center rounded-full bg-white px-5 text-[0.92rem] font-semibold text-[#0a0c10] transition-transform duration-200 hover:-translate-y-0.5"
                            onClick={(event) => {
                              event.stopPropagation()
                              openProjectLink(index)
                            }}
                          >
                            Open
                          </button>
                          <button
                            type="button"
                            className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-white/14 bg-white/8 px-5 text-[0.92rem] font-semibold text-white transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-white/12"
                            onClick={(event) => {
                              event.stopPropagation()
                              openProjectDetails(index)
                            }}
                          >
                            Project Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                </div>
              )
            })}
          </div>

          <div className="flex items-center justify-center gap-4 sm:gap-5">
            <button
              type="button"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-[var(--text)] transition-[transform,border-color,background-color] duration-200 hover:-translate-y-0.5 hover:border-white/18 hover:bg-white/[0.06]"
              onClick={previousProject}
              aria-label="Previous project"
            >
              <span aria-hidden="true">←</span>
            </button>

            <div className="flex items-center gap-2 sm:gap-3">
              {projects.map((project, index) => (
                <button
                  key={project.id}
                  type="button"
                  className={`h-2.5 rounded-full transition-all duration-200 ${
                    index === activeIndex ? 'w-8 bg-white' : 'w-2.5 bg-white/24'
                  }`}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Show ${project.title}`}
                />
              ))}
            </div>

            <button
              type="button"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-[var(--text)] transition-[transform,border-color,background-color] duration-200 hover:-translate-y-0.5 hover:border-white/18 hover:bg-white/[0.06]"
              onClick={nextProject}
              aria-label="Next project"
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>

          <div
            className={`project-status-card-shell ${
              comingSoonProject ? 'is-visible' : ''
            }`}
            aria-hidden={!comingSoonProject}
          >
            {comingSoonProject ? (
              <div className="project-status-card" role="status" aria-live="polite">
                <div>
                  <p className="project-status-card__eyebrow">Live Preview</p>
                  <h3>{comingSoonProject.title}</h3>
                  <p className="project-status-card__text">
                    This project doesn&apos;t have a public app link yet. A live demo is
                    coming soon.
                  </p>
                </div>

                <button
                  type="button"
                  className="project-status-card__close"
                  onClick={() => setComingSoonProject(null)}
                >
                  Close
                </button>
              </div>
            ) : null}
          </div>

          <div
            ref={detailsRef}
            className={`w-full overflow-hidden transition-[max-height,opacity,transform,margin] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              detailsProject
                ? 'mt-4 translate-y-0 opacity-100'
                : 'mt-0 translate-y-4 opacity-0'
            }`}
            style={{ maxHeight: detailsProject ? `${detailsHeight}px` : '0px' }}
            aria-hidden={!detailsProject}
          >
            {detailsProject ? (
              <div ref={detailsContentRef} className="project-details-shell">
                <div className="project-details-hero">
                  <div>
                    <p className="project-details-hero__eyebrow">{detailsProject.cover.eyebrow}</p>
                    <h3>{detailsProject.title}</h3>
                    <p>{detailsProject.summary}</p>
                  </div>

                  <div className="project-details-hero__meta">
                    <span>{detailsProject.stack.join(' • ')}</span>
                    <button
                      type="button"
                      className="project-details-shell__close"
                      onClick={() => setIsDetailsOpen(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>

                <div className="project-readme-panel">
                  <div className="project-readme-panel__header">
                    <div className="project-readme-panel__repo">
                      <span className="project-readme-panel__dot" aria-hidden="true" />
                      <span>{detailsProject.title.toLowerCase().replace(/\s+/g, '-')}</span>
                    </div>
                    <div className="project-readme-panel__file">README.md</div>
                  </div>

                  <ProjectReadme project={detailsProject} />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Projects
