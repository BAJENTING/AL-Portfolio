'use client'

import { useState } from 'react'
import { login } from '@/app/auth/actions'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await login(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <main className="auth-container" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 20px 20px'
    }}>
      <div className="auth-card" style={{
        background: 'var(--charcoal)',
        padding: '40px',
        borderRadius: '8px',
        width: '100%',
        maxWidth: '400px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h1 style={{ marginBottom: '10px', color: 'var(--white)' }}>Admin Login</h1>
        <p style={{ color: 'var(--text-dim)', marginBottom: '30px' }}>Exclusive access for Anthony Leuterio Realty administrators</p>
        
        <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor="email" style={{ color: 'var(--text-mid)', fontSize: '14px' }}>Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="admin@example.com"
              style={{
                background: 'var(--black)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '12px',
                borderRadius: '4px',
                color: 'var(--white)',
                fontFamily: 'inherit'
              }}
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor="password" style={{ color: 'var(--text-mid)', fontSize: '14px' }}>Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              style={{
                background: 'var(--black)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '12px',
                borderRadius: '4px',
                color: 'var(--white)',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {error && (
            <div style={{ color: 'var(--red)', fontSize: '14px', marginTop: '5px' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-red"
            style={{
              padding: '14px',
              marginTop: '10px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              width: '100%',
              border: 'none'
            }}
          >
            {loading ? 'Authenticating...' : 'Login as Admin'}
          </button>
        </form>
      </div>
    </main>
  )
}
