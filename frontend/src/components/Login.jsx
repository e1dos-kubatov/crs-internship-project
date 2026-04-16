import React, { useMemo, useState } from 'react';
import { GitBranch, KeyRound, Mail, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login, loginWithOAuth } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const oauthMessage = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('oauth') === 'error' ? params.get('message') || 'OAuth login failed' : '';
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const result = await login(email, password);
    setSubmitting(false);

    if (result.success) {
      navigate(result.user.role === 'admin' ? '/admin' : '/account');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4 py-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(251,146,60,0.28),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(14,165,233,0.25),transparent_30%),linear-gradient(135deg,#0f172a,#1e293b_50%,#431407)]" />
      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/20 bg-white/90 shadow-2xl backdrop-blur lg:grid-cols-[1.1fr_0.9fr]">
        <section className="hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="mb-10 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-orange-100">
              <ShieldCheck className="h-4 w-4" />
              JWT, OAuth2 and Spring Security connected
            </div>
            <h1 className="text-5xl font-black leading-tight tracking-tight">
              Rent, list, approve and manage cars from one elegant workspace.
            </h1>
          </div>
          <div className="grid grid-cols-3 gap-3 text-sm text-slate-300">
            <div className="rounded-2xl bg-white/10 p-4">
              <strong className="block text-2xl text-white">8081</strong>
              Backend API
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <strong className="block text-2xl text-white">5173</strong>
              React app
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <strong className="block text-2xl text-white">PARTNER</strong>
              Default user
            </div>
          </div>
        </section>

        <section className="p-8 sm:p-12">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-orange-600">Welcome back</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950">Sign in</h2>
            <p className="mt-3 text-slate-600">Use your backend account, or continue with OAuth2 when Google/GitHub credentials are configured.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Email</span>
              <span className="relative block">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-12 py-4 text-slate-900 shadow-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                  placeholder="admin@carrental.com"
                  required
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Password</span>
              <span className="relative block">
                <KeyRound className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-12 py-4 text-slate-900 shadow-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                  placeholder="Your password"
                  required
                />
              </span>
            </label>

            {(error || oauthMessage) && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error || oauthMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-2xl bg-slate-950 px-6 py-4 font-black text-white shadow-xl shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
            <span className="h-px flex-1 bg-slate-200" />
            OAuth2
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => loginWithOAuth('github')}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 font-bold text-slate-800 shadow-sm transition hover:border-slate-400"
            >
              <GitBranch className="h-5 w-5" />
              GitHub
            </button>
            <button
              type="button"
              onClick={() => loginWithOAuth('google')}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 font-bold text-slate-800 shadow-sm transition hover:border-slate-400"
            >
              G
              Google
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-slate-600">
            No account yet?{' '}
            <button onClick={() => navigate('/register')} className="font-black text-orange-600 hover:text-orange-700">
              Create a partner account
            </button>
          </p>
        </section>
      </div>
    </div>
  );
};

export default Login;
