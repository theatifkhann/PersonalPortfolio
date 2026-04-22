import { useEffect, useState } from 'react'
import AdminResumePage from './components/AdminResumePage'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import { useScrollAnimation } from './hooks/useScrollAnimation'
import About from './sections/About'
import Contact from './sections/Contact'
import Hero from './sections/Hero'
import Projects from './sections/Projects'
import Skills from './sections/Skills'

function getAppMode() {
  if (typeof window === 'undefined') {
    return 'portfolio'
  }

  const searchParams = new URLSearchParams(window.location.search)
  return searchParams.get('admin') === 'resume' ? 'admin-resume' : 'portfolio'
}

function App() {
  const [appMode, setAppMode] = useState(() => getAppMode())
  const [adminEntrySecretKey, setAdminEntrySecretKey] = useState('')

  useScrollAnimation()

  useEffect(() => {
    document.documentElement.dataset.theme = 'dark'
  }, [])

  useEffect(() => {
    const syncAppMode = () => {
      setAppMode(getAppMode())
    }

    window.addEventListener('popstate', syncAppMode)

    return () => {
      window.removeEventListener('popstate', syncAppMode)
    }
  }, [])

  useEffect(() => {
    if (appMode === 'admin-resume' && adminEntrySecretKey) {
      setAdminEntrySecretKey('')
    }
  }, [appMode, adminEntrySecretKey])

  function handleOpenResumeSettings(secretKey) {
    window.history.pushState({}, '', '?admin=resume')
    setAdminEntrySecretKey(secretKey)
    setAppMode('admin-resume')
  }

  if (appMode === 'admin-resume') {
    return (
      <AdminResumePage
        initialSecretKey={adminEntrySecretKey}
      />
    )
  }

  return (
    <div className="site-shell">
      <Navbar />

      <main className="site-main">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>

      <Footer onOpenResumeSettings={handleOpenResumeSettings} />
    </div>
  )
}

export default App
