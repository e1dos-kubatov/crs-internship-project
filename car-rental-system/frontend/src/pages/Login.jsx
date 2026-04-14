import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock, UserPlus, Github, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [partnerAccess, setPartnerAccess] = useState(false)
  const [searchParams] = useSearchParams()
  const [submitting, setSubmitting] = useState(false)
  const { login, loginWithToken } = useAuth()
  const backendUrl = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:8081').replace(/\/$/, '')

  useEffect(() => {
    const token = searchParams.get('token')
    const oauthStatus = searchParams.get('oauth')
    const message = searchParams.get('message')

    if (!token && oauthStatus !== 'error') {
      return
    }

    if (oauthStatus === 'error') {
      toast.error(message || 'OAuth2 login failed')
      return
    }

    if (token) {
      loginWithToken(token).then((result) => {
        if (result.success) {
          toast.success('OAuth2 login successful!')
          window.location.href = '/'
        } else {
          toast.error('OAuth2 login failed')
        }
      })
    }
  }, [loginWithToken, searchParams])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    const result = await login(email, password, partnerAccess)
    setSubmitting(false)
    if (result.success) {
      window.location.href = '/'
    }
  }

  return (
    <section className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#0ea5e920,transparent_40%),radial-gradient(circle_at_80%_0%,#1d4ed830,transparent_35%),linear-gradient(120deg,#0f172a,#1e293b)]" />
      <div className="absolute -top-10 -right-10 w-72 h-72 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="absolute -bottom-20 -left-10 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl" />

      <div className="relative min-h-screen flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="bg-white/95 backdrop-blur-md border border-white/70 rounded-3xl shadow-2xl p-8">
            <p className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700 mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Secure Access
            </p>

            <h1 className="text-3xl font-bold text-slate-900 mb-1">Welcome Back</h1>
            <p className="text-slate-600 mb-6">Sign in to manage bookings, rentals, and partner actions.</p>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <label className="block">
                <span className="text-sm text-slate-600">Email address</span>
                <div className="mt-1 relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </label>

              <label className="block">
                <span className="text-sm text-slate-600">Password</span>
                <div className="mt-1 relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </label>

              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={partnerAccess}
                  onChange={(event) => setPartnerAccess(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600"
                />
                Partner access on this login
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-60 transition"
              >
                {submitting ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs text-slate-500">or continue with</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <div className="space-y-3">
              <a
                href={`${backendUrl}/oauth2/authorization/google`}
                className="w-full text-center block py-3 px-4 border border-slate-300 text-sm font-medium rounded-xl text-slate-700 bg-white hover:bg-slate-50 transition"
              >
                Continue with Google
              </a>
              <a
                href={`${backendUrl}/oauth2/authorization/github`}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-800 text-sm font-medium rounded-xl text-white bg-gray-900 hover:bg-black transition"
              >
                <Github className="w-4 h-4" />
                Continue with GitHub
              </a>
            </div>

            <div className="mt-6 text-center">
              <Link to="/register" className="inline-flex items-center text-blue-700 hover:text-blue-800 font-medium">
                <UserPlus className="w-4 h-4 mr-1" />
                Create new account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Login
