import React, { useMemo, useState } from 'react';
import { KeyRound, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import { useNavigate } from 'react-router-dom';

const GoogleLogo = () => (
  <svg className="h-5 w-5" viewBox="0 0 48 48" aria-hidden="true">
    <path
      fill="#EA4335"
      d="M24 9.5c3.2 0 6.1 1.1 8.4 3.2l6.3-6.3C34.9 2.9 29.8 1 24 1 14.7 1 6.7 6.3 2.8 14l7.4 5.7C12 13.6 17.5 9.5 24 9.5z"
    />
    <path
      fill="#4285F4"
      d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.6h12.6c-.5 2.8-2.2 5.2-4.7 6.8l7.2 5.6c4.2-3.9 7.4-9.7 7.4-16.5z"
    />
    <path
      fill="#FBBC05"
      d="M10.2 28.3A14.5 14.5 0 0 1 10.2 19.7L2.8 14a23 23 0 0 0 0 20l7.4-5.7z"
    />
    <path
      fill="#34A853"
      d="M24 47c5.8 0 10.7-1.9 15.1-6l-7.2-5.6c-2 1.3-4.5 2.1-7.9 2.1-6.5 0-12-4.1-13.8-9.8L2.8 34C6.7 41.7 14.7 47 24 47z"
    />
  </svg>
);

const Login = () => {
  const { login, loginWithOAuth } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const oauthMessage = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('oauth') === 'error' ? params.get('message') || t('oauthLoginFailed') : '';
  }, [t]);

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
        <section className="relative hidden overflow-hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-70"
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1300&q=85)' }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(251,146,60,0.45),transparent_28%),linear-gradient(135deg,rgba(2,6,23,0.94),rgba(2,6,23,0.78)_48%,rgba(14,116,144,0.58))]" />
          <div className="absolute bottom-8 right-8 h-40 w-40 rounded-full border border-white/20 bg-white/10 blur-sm" />
          <div className="relative">
            <p className="mb-6 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.3em] text-orange-100 backdrop-blur">
              CWD access
            </p>
            <h1 className="max-w-lg text-5xl font-black leading-tight tracking-tight">
              {t('loginSideTitle')}
            </h1>
          </div>
          <p className="relative max-w-lg rounded-3xl border border-white/15 bg-white/10 p-5 text-lg leading-8 text-slate-100 shadow-2xl backdrop-blur">
            {t('loginSideText')}
          </p>
        </section>

        <section className="p-8 sm:p-12">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-orange-600">{t('welcomeBack')}</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950">{t('signIn')}</h2>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">{t('email')}</span>
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
              <span className="mb-2 block text-sm font-semibold text-slate-700">{t('password')}</span>
              <span className="relative block">
                <KeyRound className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-12 py-4 text-slate-900 shadow-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                  placeholder={t('passwordPlaceholder')}
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
              {submitting ? t('signingIn') : t('signIn')}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
            <span className="h-px flex-1 bg-slate-200" />
            OAuth2
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <div className="grid gap-3">
            <button
              type="button"
              onClick={() => loginWithOAuth('google')}
              className="inline-flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 font-bold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-lg"
            >
              <GoogleLogo />
              Google
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-slate-600">
            {t('noAccount')}{' '}
            <button onClick={() => navigate('/register')} className="font-black text-orange-600 hover:text-orange-700">
              {t('createPartnerAccount')}
            </button>
          </p>
        </section>
      </div>
    </div>
  );
};

export default Login;
