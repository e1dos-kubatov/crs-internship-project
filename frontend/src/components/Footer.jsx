import React from 'react';
import { Camera, Mail, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLang } from '../context/LangContext';

const FooterChevron = () => (
    <svg className="h-3 w-3 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
    </svg>
);

const Footer = () => {
  const { t } = useLang();

  const data = [
    { title: 'corporate', links: ['modify', 'cancelBookingFooter'] },
    { title: 'help', links: ['about', 'contact', 'feedback'] },
    { title: 'other', links: ['destinations', 'fleet', 'offices'] },
    { title: 'policies', links: ['privacy', 'legal', 'terms'] }
  ];

  const linkRoutes = {
    modify: '/modify-booking',
    cancelBookingFooter: '/cancel-booking',
    about: '/about',
    contact: '/contact',
    feedback: '/feedback',
    destinations: '/destinations',
    fleet: '/cars',
    offices: '/offices',
    privacy: '/privacy',
    legal: '/legal',
    terms: '/terms'
  };

  return (
      <footer className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#022c22_0%,#0f172a_52%,#111827_100%)]" />
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-400 via-emerald-400 to-cyan-400" />
        <div className="container relative mx-auto px-4 pb-8 pt-14">
          <div className="mb-12 flex flex-col justify-between gap-5 border-b border-white/10 pb-8 lg:flex-row lg:items-center">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <img src="/cwd-logo.svg" alt={t('logoAlt')} className="h-14 w-auto rounded-lg bg-white shadow-xl shadow-black/20" />
              <div>
                <p className="text-sm font-black uppercase text-emerald-200">{t('tagline')}</p>
                <p className="mt-1 max-w-xl text-sm font-semibold leading-6 text-slate-300">{t('cwdMeaning')}</p>
              </div>
            </div>
          </div>

          <div className="mb-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_1.25fr]">
            {data.map((col, idx) => (
                <div key={idx}>
                  <h5 className="mb-6 text-lg font-black tracking-tight text-white">{t(col.title)}</h5>
                  <ul className="space-y-4">
                    {col.links.map((linkKey) => (
                        <li key={linkKey} className="group">
                          <Link to={linkRoutes[linkKey]} className="flex items-center justify-between border-b border-white/10 pb-3 transition-all hover:border-emerald-300 hover:text-emerald-100">
                            <span className="text-sm font-semibold text-slate-200 group-hover:text-white">{t(linkKey)}</span>
                            <FooterChevron />
                          </Link>
                        </li>
                    ))}
                  </ul>
                </div>
            ))}
            <div className="rounded-lg border border-white/10 bg-white/10 p-6 shadow-2xl shadow-black/20 backdrop-blur">
              <h5 className="mb-6 text-lg font-black tracking-tight">{t('footerContactTitle')}</h5>
              <div className="space-y-4 text-sm font-bold text-slate-100">
                <a href={`mailto:${t('projectEmail')}`} className="flex items-center gap-3 transition hover:text-white">
                  <Mail className="h-5 w-5 text-orange-300" />
                  {t('projectEmail')}
                </a>
                <a href="https://wa.me/996700100100" target="_blank" rel="noreferrer" className="flex items-center gap-3 transition hover:text-white">
                  <MessageCircle className="h-5 w-5 text-emerald-300" />
                  {t('projectWhatsapp')}
                </a>
                <a href="https://www.instagram.com/cwd.rental.kg" target="_blank" rel="noreferrer" className="flex items-center gap-3 transition hover:text-white">
                  <Camera className="h-5 w-5 text-pink-300" />
                  {t('projectInstagram')}
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-[10px] uppercase tracking-widest text-slate-400">
            {t('copyright')}
          </div>
        </div>
      </footer>
  );
};

export default Footer;
