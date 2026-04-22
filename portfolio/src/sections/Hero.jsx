import { useEffect, useState } from 'react'
import SocialIcon from '../components/SocialIcon'
import HeroMissileViewer from '../components/HeroMissileViewer'
import { HERO_STATS, SITE_CONFIG, SOCIAL_LINKS } from '../utils/constants'

const HERO_PROJECTS = [
  {
    id: 'air-defense',
    mode: 'model',
    label: 'Integrated Air Defense Platform',
    title: 'Air Defense System',
    description:
      'Track incoming threats, visualize the Fateh interceptor in 3D, and step into a live command view built for rapid response.',
    viewHref: '#projects',
  },
  {
    id: 'chat-app',
    label: 'Realtime Communication Layer',
    title: 'Personal Mobile Chat App',
    description:
      'A mobile-first chat experience focused on realtime messaging, clean interaction, and dependable backend communication.',
    image: '/images/hero/personal-chat-cover.png',
    viewHref: '#projects',
  },
  {
    id: 'online-crime-reporting',
    label: 'Secure Reporting Portal',
    title: 'Online Crime Reporting System',
    description:
      'A MERN stack-based platform for digital complaint filing, structured reporting flows, and safer access to online case submission.',
    image: '/images/hero/online-crime-reporting-system-cover.png',
    viewHref: '#projects',
  },
  {
    id: 'expense-tracker',
    label: 'Financial Intelligence Workspace',
    title: 'Expense Tracker',
    description:
      'Upload statements, organize transactions, and turn raw banking data into clean insights through one streamlined dashboard.',
    image: '/images/hero/expense-tracker-cover.png',
    viewHref: '#projects',
  },
  {
    id: 'news-impact',
    label: 'ML Signal Engine',
    title: 'News Impact Predictor',
    description:
      'A prediction-focused workflow that turns news data into impact signals using machine learning, structured features, and trend-aware analysis.',
    image: '/images/hero/news-impact-cover.png',
    viewHref: '#projects',
  },
]

function Hero() {
  const [activeSlide, setActiveSlide] = useState(0)
  const [isCarouselPaused, setIsCarouselPaused] = useState(false)

  useEffect(() => {
    if (isCarouselPaused) {
      return undefined
    }

    const intervalId = window.setInterval(() => {
      setActiveSlide((currentSlide) => (currentSlide + 1) % HERO_PROJECTS.length)
    }, 5000)

    return () => window.clearInterval(intervalId)
  }, [isCarouselPaused])

  const nextSlide = () => {
    setActiveSlide((currentSlide) => (currentSlide + 1) % HERO_PROJECTS.length)
  }

  const previousSlide = () => {
    setActiveSlide((currentSlide) =>
      currentSlide === 0 ? HERO_PROJECTS.length - 1 : currentSlide - 1,
    )
  }

  return (
    <section className="hero-section" id="hero">
      <div className="hero-section__grid">
        <div className="hero-section__copy" data-reveal>
          <p className="hero-section__eyebrow">{SITE_CONFIG.status}</p>
          <h1>{SITE_CONFIG.title}</h1>
          <p className="hero-section__intro-role">{SITE_CONFIG.role}</p>
          <p className="hero-section__intro-text">{SITE_CONFIG.intro}</p>

          <div className="hero-section__actions">
            <a className="button button--dark" href="#contact">
              Talk with me
            </a>
            <a className="button button--light" href="#projects">
              See my work
            </a>
          </div>

          <div className="hero-section__footer">
            <div className="hero-social-rail" aria-label="Social links">
              {SOCIAL_LINKS.map((link) => (
                <a key={link.id} href={link.href} aria-label={link.label}>
                  <SocialIcon id={link.id} />
                </a>
              ))}
            </div>
            <ul className="hero-section__stats" aria-label="Key highlights">
              {HERO_STATS.map((stat) => (
                <li key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="hero-section__canvas-pane" data-reveal>
          <div
            className="hero-canvas-shell hero-canvas-carousel"
            aria-label="Project carousel"
            onMouseEnter={() => setIsCarouselPaused(true)}
            onMouseLeave={() => setIsCarouselPaused(false)}
            onFocusCapture={() => setIsCarouselPaused(true)}
            onBlurCapture={() => setIsCarouselPaused(false)}
          >
            {HERO_PROJECTS.map((project, index) => (
              <article
                key={project.id}
                className={`hero-carousel__slide ${project.mode === 'model' ? 'hero-carousel__slide--model' : ''} ${index === activeSlide ? 'is-active' : ''}`}
                style={
                  project.image
                    ? {
                        backgroundImage: `linear-gradient(90deg, rgba(5, 7, 10, 0.88) 0%, rgba(5, 7, 10, 0.65) 36%, rgba(5, 7, 10, 0.18) 74%), url(${project.image})`,
                      }
                    : undefined
                }
                aria-hidden={index === activeSlide ? 'false' : 'true'}
              >
                {project.mode === 'model' ? (
                  <>
                    <div className="hero-carousel__stars" aria-hidden="true" />
                    <div className="hero-carousel__model-stage">
                      <HeroMissileViewer
                        onPointerDown={() => setIsCarouselPaused(true)}
                        onPointerUp={() => setIsCarouselPaused(true)}
                      />
                    </div>
                  </>
                ) : null}

                <div className="hero-carousel__content">
                  <p className="hero-carousel__eyebrow">{project.label}</p>
                  <h2 className="hero-carousel__title">{project.title}</h2>
                  <p className="hero-carousel__description">{project.description}</p>

                  <div className="hero-carousel__actions">
                    <a className="hero-carousel__button hero-carousel__button--primary" href={project.viewHref}>
                      View Project
                    </a>
                  </div>
                </div>
              </article>
            ))}

            <div className="hero-carousel__controls">
              <div className="hero-carousel__nav">
                <button type="button" onClick={previousSlide} aria-label="Previous project">
                  <span aria-hidden="true">←</span>
                </button>
                <button type="button" onClick={nextSlide} aria-label="Next project">
                  <span aria-hidden="true">→</span>
                </button>
              </div>

              <div className="hero-carousel__dots" aria-label="Project slides">
                {HERO_PROJECTS.map((project, index) => (
                  <button
                    key={project.id}
                    type="button"
                    className={index === activeSlide ? 'is-active' : undefined}
                    onClick={() => setActiveSlide(index)}
                    aria-label={`Show ${project.title}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
