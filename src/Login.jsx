import { useState, useEffect } from 'react'
import { auth } from './firebase'
import { sendSignInLinkToEmail, onAuthStateChanged } from 'firebase/auth'

const actionCodeSettings = {
  url: 'https://blr-carpool.vercel.app/app',
  handleCodeInApp: true,
}

function Login() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) window.location.href = '/app'
    })
    return unsubscribe
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings)
      window.localStorage.setItem('emailForSignIn', email)
      setSent(true)
    } catch (err) {
  setError(err.message)
}
    }
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📧</div>
        <p style={{ fontWeight: '700', color: '#1a1a2e', fontSize: '1rem', marginBottom: '0.5rem' }}>
          Check your email!
        </p>
        <p style={{ color: '#888', fontSize: '0.88rem', lineHeight: '1.6' }}>
          We sent a magic link to <strong>{email}</strong>. Click it to sign in — no password needed.
        </p>
        <p style={{ color: '#aaa', fontSize: '0.8rem', marginTop: '1rem' }}>
          Didn't get it? Check your spam folder.
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Branding */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>✈️</div>
        <h2 style={{
          fontFamily: 'Sora, sans-serif', fontSize: '1.4rem',
          fontWeight: 800, color: '#1a1a2e', marginBottom: '0.3rem'
        }}>BLR Carpool</h2>
        <p style={{ color: '#888', fontSize: '0.88rem' }}>
          Share a cab from Bangalore Airport
        </p>
      </div>

      <div className="card">
        <p style={{ fontWeight: '700', color: '#1a1a2e', fontSize: '1rem', marginBottom: '0.25rem' }}>
          Sign in to continue
        </p>
        <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
          We'll send a magic link to your email — no password needed.
        </p>
        <form onSubmit={handleSubmit} style={{ all: 'unset', display: 'block' }}>
          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="e.g. priya@gmail.com"
            required
          />
          {error && <p className="error-text">{error}</p>}
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Sending...' : 'Send Magic Link →'}
          </button>
        </form>
        <p style={{ fontSize: '0.78rem', color: '#aaa', marginTop: '1rem', textAlign: 'center' }}>
          By signing in you agree to our <a href="/" style={{ color: '#5b6af0' }}>terms of use</a>
        </p>
      </div>

      <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.82rem', color: '#aaa' }}>
        New here? <a href="/" style={{ color: '#5b6af0', fontWeight: 600 }}>Learn how it works →</a>
      </p>
    </div>
  )
}

export default Login