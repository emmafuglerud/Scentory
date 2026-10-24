import { useEffect, useRef, useState } from 'react'
import ScentoryApp from './components/ScentoryApp'
import './App.css'

// A decorative perfume bottle drawn with CSS; no image download needed.
function PerfumeBottle() {
  return (
    <div className="bottle-scene" aria-hidden="true">
      <span className="sparkle sparkle-one">✧</span>
      <span className="sparkle sparkle-two">✧</span>
      <div className="bottle-cap" />
      <div className="bottle-neck" />
      <div className="bottle">
        <div className="bottle-label"><span>S</span><small>EAU DE SCENTORY</small></div>
      </div>
      <div className="bottle-shadow" />
    </div>
  )
}

function App() {
  // Demo navigation only. Refreshing the page returns to login.
  const [screen, setScreen] = useState('login')
  const headingRef = useRef(null)
  const isSignUp = screen === 'signup'

  useEffect(() => {
    headingRef.current?.focus()
  }, [screen])

  function enterDemo(event) {
    event.preventDefault()
    // Clear inputs without reading, storing, or sending their values.
    event.currentTarget.reset()
    setScreen('home')
  }

  if (screen === 'home') {
    return <ScentoryApp onLogOut={() => setScreen('login')} />
  }

  return (
    <main className="app-shell">
      <div className="welcome-card">
        <aside className="brand-panel" aria-label="Scentory">
          <div className="wordmark">Scentory<span aria-hidden="true">✧</span></div>
          <div className="brand-story">
            <p className="eyebrow">A LITTLE SCENT. A LITTLE MAGIC.</p>
            <p className="brand-title">A scent that feels{' '}<br />like <em>you.</em></p>
            <PerfumeBottle />
            <p className="brand-caption">Your next chapter, bottled.</p>
          </div>
          <p className="brand-footer">MADE FOR YOUR SCENT STORY</p>
        </aside>

        <section className="content-panel" aria-labelledby="screen-title">
          <div className="form-content">
            <div className="flower-mark" aria-hidden="true">✧</div>
            <p className="eyebrow">{isSignUp ? 'BEGIN SOMETHING BEAUTIFUL' : 'WELCOME TO YOUR SCENT STORY'}</p>
            <h1 id="screen-title" ref={headingRef} tabIndex={-1}>{isSignUp ? 'Make yourself at home' : 'Meet Scentory'}</h1>
            <p className="intro">Discover your next signature scent</p>
            {/* These forms only switch screens. They never create an account. */}
            <form onSubmit={enterDemo} noValidate key={screen}>
              <label htmlFor="email">Email address</label>
              <input id="email" type="email" placeholder="you@example.com" autoComplete="off" />
              <label htmlFor="password">Password</label>
              <input id="password" type="password" placeholder="Enter your password" autoComplete="off" />
              <button className="primary-button" type="submit">{isSignUp ? 'Sign up' : 'Log in'} <span aria-hidden="true">↗</span></button>
            </form>
            <p className="switch-screen">
              {isSignUp ? 'Already have an account?' : 'New to Scentory?'}{' '}
              <button className="text-button" onClick={() => setScreen(isSignUp ? 'login' : 'signup')}>{isSignUp ? 'Log in' : 'Sign up'}</button>
            </p>
            <p className="demo-note">A university project · Demo only<br />No account is created. Use made-up details or leave fields empty.</p>
          </div>
          <p className="content-footer">FIND A SCENT. FEEL A LITTLE MORE YOU.</p>
        </section>
      </div>
    </main>
  )
}

export default App
