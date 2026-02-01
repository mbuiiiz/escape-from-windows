import { useState } from 'react'
import { supabase } from '../lib/supabase'
import './WindowsXPLogin.css'

interface WindowsXPLoginProps {
  onLoginSuccess?: () => void
}

export default function WindowsXPLogin({ onLoginSuccess }: WindowsXPLoginProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        setMessage('Login successful! Welcome back.')
        if (onLoginSuccess) onLoginSuccess()
      }
    } catch (error: any) {
      setError(error.message || 'Invalid username or password')
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username || email.split('@')[0],
          },
        },
      })

      if (error) throw error

      if (data.user) {
        setMessage('Account created! Please check your email to verify your account.')
        // Auto switch to login after 3 seconds
        setTimeout(() => {
          setIsLogin(true)
          setMessage(null)
        }, 3000)
      }
    } catch (error: any) {
      setError(error.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="xp-login-container">
      <div className="xp-login-background">
        <div className="xp-login-box">
          <div className="xp-login-header">
            <div className="xp-logo">
              <svg viewBox="0 0 88 88" className="windows-logo">
                <rect x="0" y="0" width="40" height="40" fill="#F25022"/>
                <rect x="48" y="0" width="40" height="40" fill="#7FBA00"/>
                <rect x="0" y="48" width="40" height="40" fill="#00A4EF"/>
                <rect x="48" y="48" width="40" height="40" fill="#FFB900"/>
              </svg>
            </div>
            <h1 className="xp-title">
              {isLogin ? 'To begin, click your user name' : 'Create a new account'}
            </h1>
          </div>

          <div className="xp-login-content">
            <form onSubmit={isLogin ? handleLogin : handleSignup}>
              {!isLogin && (
                <div className="xp-form-group">
                  <div className="xp-user-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                  <input
                    type="text"
                    className="xp-input"
                    placeholder="Username (optional)"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              )}

              <div className="xp-form-group">
                <div className="xp-user-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </div>
                <input
                  type="email"
                  className="xp-input"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="xp-form-group">
                <div className="xp-password-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                  </svg>
                </div>
                <input
                  type="password"
                  className="xp-input"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              {error && <div className="xp-error-message">{error}</div>}
              {message && <div className="xp-success-message">{message}</div>}

              <button
                type="submit"
                className="xp-submit-button"
                disabled={loading}
              >
                {loading ? (
                  <span className="xp-loading">
                    <span className="xp-spinner"></span>
                    {isLogin ? 'Logging in...' : 'Creating account...'}
                  </span>
                ) : (
                  <span className="xp-button-content">
                    <svg className="xp-arrow" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                    </svg>
                    {isLogin ? 'Log On' : 'Sign Up'}
                  </span>
                )}
              </button>
            </form>

            <div className="xp-switch-mode">
              <button
                onClick={() => {
                  setIsLogin(!isLogin)
                  setError(null)
                  setMessage(null)
                }}
                className="xp-link-button"
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
              </button>
            </div>
          </div>

          <div className="xp-login-footer">
            <div className="xp-footer-links">
              <button className="xp-footer-button">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"/>
                </svg>
                Help
              </button>
              <button className="xp-footer-button">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                </svg>
                Turn Off Computer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}