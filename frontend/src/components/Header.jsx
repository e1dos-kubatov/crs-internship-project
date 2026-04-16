import React from 'react';
import { Car, LayoutDashboard, LogOut, Menu, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';

const Header = () => {
  const { user, logout } = useAuth();
  const { lang, setLang, t, languages } = useLang();
  const navLinks = [
    { to: '/about', label: t('about') },
    { to: '/cars', label: t('cars') },
    { to: '/offices', label: t('offices') },
    { to: '/contact', label: t('contact') },
    { to: '/faq', label: t('faq') },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/70 bg-white/80 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-orange-500 to-sky-700 text-white shadow-lg">
            <Car className="h-6 w-6" />
          </span>
          <span>
            <span className="block text-2xl font-black tracking-tight text-slate-950">{t('logo')}</span>
            <span className="hidden text-xs font-bold uppercase tracking-[0.25em] text-slate-500 sm:block">{t('tagline')}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-2 rounded-full bg-slate-100/80 p-1 lg:flex">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} className="rounded-full px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-white hover:text-slate-950">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden flex-col rounded-2xl border border-slate-200 bg-white/90 p-1 shadow-sm sm:flex">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => setLang(language.code)}
                className={`rounded-xl px-3 py-1.5 text-xs font-black transition ${lang === language.code ? 'bg-slate-950 text-white shadow' : 'text-slate-600 hover:bg-slate-100'}`}
                title={t(language.labelKey)}
              >
                {language.short}
              </button>
            ))}
          </div>
          {user ? (
            <>
              <Link
                to={user.role === 'admin' ? '/admin' : '/account'}
                className="hidden items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-800 sm:inline-flex"
              >
                <LayoutDashboard className="h-4 w-4" />
                {user.role === 'admin' ? t('admin') : t('account')}
              </Link>
              <Link
                to={user.role === 'admin' ? '/admin/cars' : '/account/cars'}
                className="hidden items-center gap-2 rounded-2xl bg-orange-100 px-4 py-2 text-sm font-bold text-orange-800 transition hover:bg-orange-200 md:inline-flex"
              >
                <Sparkles className="h-4 w-4" />
                {t('addCar')}
              </Link>
              <span className="hidden max-w-36 truncate text-sm font-bold text-slate-700 sm:block">{user.name}</span>
              <button onClick={logout} className="rounded-2xl bg-red-600 p-3 text-white transition hover:bg-red-700" title={t('logout')}>
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800">
                {t('login')}
              </Link>
              <Link to="/register" className="hidden rounded-2xl bg-orange-100 px-5 py-3 text-sm font-black text-orange-800 transition hover:bg-orange-200 sm:block">
                {t('register')}
              </Link>
            </>
          )}
          <button className="rounded-2xl bg-slate-100 p-3 text-slate-700 lg:hidden" title="Menu">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      <nav className="border-t border-white/70 bg-slate-950 text-white lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-4 overflow-x-auto px-4 py-3 text-sm font-bold sm:px-6 lg:px-8">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} className="whitespace-nowrap rounded-full px-3 py-1 hover:bg-white/10">
              {link.label}
            </Link>
          ))}
          <div className="ml-auto flex flex-col rounded-2xl bg-white/10 p-1">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => setLang(language.code)}
                className={`whitespace-nowrap rounded-xl px-3 py-1 text-xs ${lang === language.code ? 'bg-white text-slate-950' : 'hover:bg-white/10'}`}
              >
                {language.short}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
