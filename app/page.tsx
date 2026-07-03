'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

type View = 'hero' | 'register' | 'login'

export default function OnboardingPage() {
  const router = useRouter()
  const [view, setView] = useState<View>('hero')

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName,
          email,
          phoneNumber,
          password,
        }),
      })

      let data = null

      try {
        data = await res.json()
      } catch (err) {
        console.error('Could not parse API response as JSON.')
        console.error(err)
      }

      console.log('Registration Response Status:', res.status)
      console.log('Registration Response Body:', data)

      if (!res.ok) {
        setError(data?.error || `Request failed (${res.status})`)
        return
      }

      setView('login')
      setError(null)
    } catch (err) {
      console.error('Registration request failed:')
      console.error(err)

      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Something went wrong.')
      }
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

  if (view !== 'hero') {
    return (
      <div className="min-h-screen flex flex-col items-center px-6 pt-20" style={{ backgroundColor: '#F0FDF4' }}>
        <div className="max-w-sm w-full flex flex-col">
          <div className="flex flex-col gap-1 mb-6 text-center shrink-0">
            {view === 'register' ? (
              <>
                <h1 className="text-2xl font-bold text-ink">Create your account</h1>
                <p className="text-sm font-medium text-ink-muted">Start building your reputation</p>
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
              onClick={() => { setView('register'); setError(null); setLoading(false) }}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-md transition-colors ${
                view === 'register'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              Create Account
            </button>
            <button
              onClick={() => { setView('login'); setError(null); setLoading(false) }}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-md transition-colors ${
                view === 'login'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              Sign In
            </button>
          </div>

          <form
            onSubmit={view === 'register' ? handleRegister : handleLogin}
            className="flex flex-col gap-5 flex-1"
          >
            <div className={view === 'register' ? '' : 'hidden'}>
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
              error={view === 'register' ? emailError : undefined}
            />

            <div className={view === 'register' ? '' : 'hidden'}>
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
              placeholder={view === 'register' ? 'At least 8 characters' : 'Enter your password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              hint={view === 'register' ? 'Minimum 8 characters' : undefined}
            />

            {error && (
              <p className="text-sm font-semibold text-error text-center">{error}</p>
            )}

            <Button type="submit" loading={loading} fullWidth disabled={view === 'register' && !isRegisterValid}>
              {view === 'register' ? 'Create Account' : 'Sign In'}
            </Button>

            <p className="text-sm font-medium text-center text-ink-muted">
              {view === 'register' ? (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setView('login')}
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
                    onClick={() => setView('register')}
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

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-8"
      style={{ backgroundColor: '#F0FDF4' }}
    >
      <div className="max-w-sm w-full flex flex-col items-center gap-8">
        <div className="relative w-full">
          <div className="relative w-full aspect-[3/4] overflow-hidden">
            <Image
              src="/images/onboarding-hero.png"
              alt="PledgePay — Promises made. Goals met."
              fill
              className="object-cover object-top"
              priority
              sizes="(max-width: 640px) 100vw, 400px"
            />
            <div
              className="absolute top-0 left-0 right-0 h-28"
              style={{
                background: 'linear-gradient(to bottom, #F0FDF4 0%, transparent 100%)',
              }}
            />
            <div
              className="absolute bottom-0 left-0 right-0 h-28"
              style={{
                background: 'linear-gradient(to top, #F0FDF4 0%, transparent 100%)',
              }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <p className="text-sm text-ink-muted text-center leading-relaxed max-w-[280px] mx-auto">
            Accountability without harassment — track financial commitments with people you trust.
          </p>
          <button
            onClick={() => setView('register')}
            className="w-full bg-primary text-white text-sm font-medium h-12 rounded-lg inline-flex items-center justify-center hover:bg-primary-800 active:scale-[0.98] transition-all duration-200 shadow-md"
          >
            Get Started
          </button>
          <button
            onClick={() => setView('login')}
            className="w-full bg-white border border-primary text-primary text-sm font-medium h-12 rounded-lg inline-flex items-center justify-center hover:bg-primary-50 active:scale-[0.98] transition-all duration-200"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  )
}
