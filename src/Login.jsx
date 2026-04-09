import { useEffect } from 'react'
import { auth } from './firebase'
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth'

function Login() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) window.location.href = '/app'
    })
    return unsubscribe
  }, [])

  async function handleGoogleSignIn() {
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
    } catch (err) {
      console.error(err)
      alert('Sign in failed. Please try again.')
    }
  }

  return (
    <div>
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

      <div className="card" style={{ textAlign: 'center' }}>
        <p style={{ fontWeight: '700', color: '#1a1a2e', fontSize: '1rem', marginBottom: '0.25rem' }}>
          Sign in to continue
        </p>
        <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          One tap to get started — no password needed.
        </p>

        <button
          onClick={handleGoogleSignIn}
          style={{
            width: '100%', padding: '0.85rem',
            background: 'white', border: '1.5px solid #e8eaf2',
            borderRadius: '12px', fontSize: '0.95rem', fontWeight: 600,
            cursor: 'pointer', fontFamily: 'Segoe UI, sans-serif',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '0.75rem', color: '#1a1a2e',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            transition: 'box-shadow 0.2s'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
            <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
            <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
            <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
          </svg>
          Continue with Google
        </button>

        <p style={{ fontSize: '0.78rem', color: '#aaa', marginTop: '1rem' }}>
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