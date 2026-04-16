import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../context/LangContext';

const FooterChevron = () => (
  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
  </svg>
);

const Footer = () => {
  const { t } = useLang();

  const data = [
    { title: 'corporate', links: ['modify', 'cancel'] },
    { title: 'help', links: ['about', 'contact', 'feedback'] },
    { title: 'other', links: ['destinations', 'fleet', 'offices'] },
    { title: 'policies', links: ['privacy', 'legal', 'terms'] }
  ];

  const linkRoutes = {
    modify: '/modify-booking',
    cancel: '/cancel-booking',
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
    <footer className="bg-cwd-blue text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {data.map((col, idx) => (
            <div key={idx}>
              <h5 className="font-black text-lg mb-8 tracking-tight">{t(col.title)}</h5>
              <ul className="space-y-4">
                {col.links.map((linkKey) => (
                  <li key={linkKey} className="group">
                    <Link to={linkRoutes[linkKey]} className="flex justify-between items-center border-b border-blue-900 pb-3 hover:opacity-70 transition-all">
                      <span className="text-sm font-medium">{t(linkKey)}</span>
                      <FooterChevron />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="text-center text-[10px] text-blue-300 uppercase tracking-widest border-t border-blue-900 pt-8">
          {t('copyright')}
        </div>
      </div>
    </footer>
  );
};

export default Footer;

