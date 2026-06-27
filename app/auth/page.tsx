'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

type Mode = 'register' | 'login'

function AuthForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const prefilledName = searchParams.get('name') || ''

  const [mode, setMode] = useState<Mode>('register')

  const [fullName, setFullName] = useState(prefilledName)
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (prefilledName) {
      setFullName(prefilledName)
    }
  }, [prefilledName])

  const emailError =
    email && (!email.includes('@') || !email.split('@')[1]?.includes('.'))
      ? 'Enter a valid email address'
      : undefined

  const phoneError =
    phoneNumber &&
    (
      !['080', '070', '090', '081', '091'].some((p) => phoneNumber.startsWith(p)) ||
      phoneNumber.length !== 11
    )
      ? 'Enter a valid 11-digit Nigerian number'
      : undefined

  const nameError =
    fullName
      ? (!fullName.includes(' ') || fullName.trim().split(/\s+/).some(p => p.length < 2))
        ? 'Enter your full name (first and last name)'
        : undefined
      : undefined

  const isRegisterValid =
    !!fullName &&
    !!email &&
    !!phoneNumber &&
    password.length >= 8 &&
    !nameError &&
    !emailError &&
    !phoneError

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, phoneNumber, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Registration failed.')
        return
      }

      setMode('login')
      setError(null)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password.')
        return
      }

      router.push('/home')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-6 pt-20 bg-surface">
      <div className="max-w-sm w-full flex flex-col">
        <div className="flex flex-col gap-1 mb-6 text-center shrink-0">
          {mode === 'register' ? (
            <>
              <h1 className="text-2xl font-bold text-ink">Create your account</h1>
              <p className="text-sm font-medium text-ink-muted">
                {prefilledName
                  ? 'Almost there! Just a few more details.'
                  : 'Start building your reputation'}
              </p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-ink">Welcome back</h1>
              <p className="text-sm font-medium text-ink-muted">Sign in to your account</p>
            </>
          )}
        </div>

        <div className="flex mb-8 bg-primary-50 rounded-lg p-1 shrink-0">
          <button
            onClick={() => { setMode('register'); setError(null) }}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-md transition-colors ${
              mode === 'register'
                ? 'bg-white text-primary shadow-sm'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            Create Account
          </button>
          <button
            onClick={() => { setMode('login'); setError(null) }}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-md transition-colors ${
              mode === 'login'
                ? 'bg-white text-primary shadow-sm'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            Sign In
          </button>
        </div>

        <form
          onSubmit={mode === 'register' ? handleRegister : handleLogin}
          className="flex flex-col gap-5 flex-1"
        >
          <div className={mode === 'register' ? '' : 'hidden'}>
            <Input
              label="Full Name"
              name="fullName"
              placeholder="Your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              error={nameError}
            />
          </div>

          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            error={mode === 'register' ? emailError : undefined}
          />

          <div className={mode === 'register' ? '' : 'hidden'}>
            <Input
              label="Phone Number"
              name="phoneNumber"
              type="tel"
              placeholder="08012345678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              error={phoneError}
            />
          </div>

          <Input
            label="Password"
            name="password"
            type="password"
            placeholder={mode === 'register' ? 'At least 8 characters' : 'Enter your password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            hint={mode === 'register' ? 'Minimum 8 characters' : undefined}
          />

          {error && (
            <p className="text-sm font-semibold text-error text-center">{error}</p>
          )}

          <Button type="submit" loading={loading} fullWidth disabled={mode === 'register' && !isRegisterValid}>
            {mode === 'register' ? 'Create Account' : 'Sign In'}
          </Button>

          <p className="text-sm font-medium text-center text-ink-muted">
            {mode === 'register' ? (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-primary font-medium hover:underline"
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                No account yet?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-primary font-medium hover:underline"
                >
                  Create one
                </button>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense>
      <AuthForm />
    </Suspense>
  )
}
