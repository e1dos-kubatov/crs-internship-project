import React, { useState } from 'react';
import { Car, ChevronDown, LayoutDashboard, LogOut, Menu, Sparkles } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';

const Header = () => {
  const { user, logout } = useAuth();
  const { lang, setLang, t, languages } = useLang();
  const [languageOpen, setLanguageOpen] = useState(false);
  const currentLanguage = languages.find((language) => language.code === lang) || languages[0];
  const otherLanguages = languages.filter((language) => language.code !== lang);
  const navLinks = [
    { to: '/about', label: t('about') },
    { to: '/cars', label: t('cars') },
    { to: '/offices', label: t('offices') },
    { to: '/contact', label: t('contact') },
    { to: '/faq', label: t('faq') },
  ];

  const changeLanguage = (code) => {
    setLang(code);
    setLanguageOpen(false);
  };

  const renderLanguageMenu = (dark = false) => (
    <div className="relative">
      <button
        type="button"
        onClick={() => setLanguageOpen((open) => !open)}
        className={`inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-black shadow-sm transition ${dark ? 'border-white/15 bg-white/10 text-white hover:bg-white/15' : 'border-slate-200 bg-white text-slate-900 hover:border-sky-200 hover:bg-sky-50'}`}
        title={t('language')}
      >
        <span className="text-sm">{currentLanguage.short}</span>
        <ChevronDown className={`h-4 w-4 transition ${languageOpen ? 'rotate-180' : ''}`} />
      </button>

      {languageOpen && (
        <div className={`absolute right-0 top-full z-50 mt-2 w-32 rounded-2xl border p-2 shadow-2xl ${dark ? 'border-sky-100 bg-white text-slate-900' : 'border-slate-200 bg-white text-slate-900'}`}>
          {otherLanguages.map((language) => (
            <button
              key={language.code}
              type="button"
              onClick={() => changeLanguage(language.code)}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-black transition hover:bg-sky-50"
            >
              <span>{language.short}</span>
              <span className="text-[0.65rem] text-slate-400">{t(language.labelKey)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );

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

        <nav className="hidden items-center gap-1 rounded-full border border-sky-100 bg-white/75 p-1 shadow-lg shadow-sky-900/5 backdrop-blur lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `rounded-full px-4 py-2 text-sm font-black tracking-wide transition ${isActive ? 'bg-gradient-to-r from-cwd-blue to-sky-500 text-white shadow-md shadow-sky-900/20' : 'text-slate-700 hover:bg-sky-50 hover:text-cwd-blue'}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            {renderLanguageMenu()}
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
              <Link to="/login" className="rounded-2xl bg-gradient-to-r from-slate-950 via-cwd-blue to-slate-900 px-6 py-3 text-sm font-black text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:shadow-xl">
                {t('login')}
              </Link>
              <Link to="/register" className="hidden rounded-2xl bg-gradient-to-r from-amber-100 via-orange-100 to-rose-100 px-6 py-3 text-sm font-black text-orange-900 shadow-lg shadow-orange-900/10 ring-1 ring-orange-200/80 transition hover:-translate-y-0.5 hover:shadow-xl sm:block">
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
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 text-sm font-bold sm:px-6 lg:px-8">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={({ isActive }) => `whitespace-nowrap rounded-full px-3 py-1 transition ${isActive ? 'bg-white text-cwd-blue' : 'hover:bg-white/10'}`}>
              {link.label}
            </NavLink>
          ))}
          <div className="ml-auto">
            {renderLanguageMenu(true)}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
