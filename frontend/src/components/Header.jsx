import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../context/LangContext';
import { useAuth } from '../context/AuthContext';

const ChevronDown = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
  </svg>
);

const Header = () => {
  const { lang, setLang, t, langs } = useLang();
  const { user, logout } = useAuth();

  const navLinks = ['cars', 'offices', 'contact', 'faq'];

  return (
    <header className="w-full bg-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to={user ? '/' : '/login'} className="flex items-center gap-3">
          <img src="/logo.png" alt="CWD" className="h-12 w-12 object-contain" />
          <span className="text-3xl font-bold text-cwd-blue tracking-tighter">{t('logo')}</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <div className="relative group">
            <button className="flex items-center gap-2 border border-gray-300 px-4 py-1.5 rounded text-sm font-semibold transition-colors hover:bg-gray-50">
              <img src={`https://flagcdn.com/16x12/${lang === 'en' ? 'gb' : lang === 'ru' ? 'ru' : 'kg'}.png`} alt="" className="rounded-sm" /> 
              {langs[lang === 'en' ? 0 : lang === 'ru' ? 1 : 2]}
              <ChevronDown />
            </button>
            <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded shadow-xl hidden group-hover:block z-50">
              {langs.map((item, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setLang(['en','ru','kg'][idx])}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm font-medium"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{user.name} ({user.role})</span>
              {user.role === 'admin' && (
                <Link to="/admin" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700">
                  Admin
                </Link>
              )}
              {user.role === 'client' && (
                <Link to="/account" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700">
                  Личный кабинет
                </Link>
              )}
              <button 
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="bg-cwd-blue text-white px-6 py-2 rounded-lg font-bold hover:bg-opacity-90">
              Login
            </Link>
          )}
        </div>
      </div>

      {user && (
        <nav className="bg-cwd-blue text-white">
          <div className="container mx-auto px-4 flex justify-center space-x-10 py-4 text-sm font-bold">
            {navLinks.map((link) => (
              <Link 
                key={link} 
                to={`/${link}`}
                className="hover:opacity-80 transition-opacity uppercase tracking-wide"
              >
                {t(link)}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;


