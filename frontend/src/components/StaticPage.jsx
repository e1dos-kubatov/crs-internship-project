import React from 'react';
import { CarFront, GraduationCap, Map, Mountain, Plane, ShieldCheck, Sparkles, UsersRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLang } from '../context/LangContext';

const staticContent = {
  en: {
    modifyBooking: { title: 'Modify Booking', content: 'Contact support to change your booking dates or details.' },
    cancelBooking: { title: 'Cancel Booking', content: 'Cancel up to 48 hours before pickup for full refund.' },
    aboutUs: { title: 'About Us', content: 'CWD is leading car rental in Central Asia since 2000.' },
    feedback: { title: 'Feedback', content: 'Share your experience to help us improve.' },
    destinations: { title: 'Destinations', content: 'Rent anywhere in Kazakhstan and Kyrgyzstan.' },
    fleet: { title: 'Fleet', content: '10+ brands, economy to luxury cars.' },
    policies: { title: 'Policies', content: 'Read our rental policies and insurance terms.' },
    privacy: { title: 'Privacy Policy', content: 'We protect your data per GDPR standards.' },
    legal: { title: 'Legal Notice', content: 'Legal information and company details.' },
    terms: { title: 'Terms and Conditions', content: 'Full rental agreement terms.' }
  },
  ru: {
    modifyBooking: { title: 'Изменить бронирование', content: 'Свяжитесь с поддержкой для изменения дат или деталей бронирования.' },
    cancelBooking: { title: 'Отменить бронирование', content: 'Отмена за 48 часов до получения - полный возврат.' },
    aboutUs: { title: 'О нас', content: 'CWD - ведущая аренда авто в Центральной Азии с 2000 года.' },
    feedback: { title: 'Обратная связь', content: 'Поделитесь опытом, чтобы мы улучшились.' },
    destinations: { title: 'Направления', content: 'Аренда везде в Казахстане и Кыргызстане.' },
    fleet: { title: 'Автопарк', content: '10+ брендов, от эконом до люкс.' },
    policies: { title: 'Политики', content: 'Политики аренды и страхование.' },
    privacy: { title: 'Политика конфиденциальности', content: 'Защищаем данные по стандартам GDPR.' },
    legal: { title: 'Юридическая информация', content: 'Юридическая информация и реквизиты компании.' },
    terms: { title: 'Условия и положения', content: 'Полные условия договора аренды.' }
  },
  kg: {
    modifyBooking: { title: 'Брондоону өзгөртүү', content: 'Брондун убактысын же деталдарын өзгөртүү үчүн колдоого кайрылыңыз.' },
    cancelBooking: { title: 'Брондоону жокко чыгаруу', content: 'Алып кетүүгө 48 саат калганда жокко чыгаруу - толук кайтаруу.' },
    aboutUs: { title: 'Биз жөнүндө', content: 'CWD 2026-жылдан бери Борбордук Азиянын лидер ижарасы.' },
    feedback: { title: 'Пикирлер', content: 'Бизди жакшыртуу үчүн тажрыйбаңызды бөлүшүңүз.' },
    destinations: { title: 'Жолдор', content: 'Кыргызстандын бардык жерлеринде ижара.' },
    fleet: { title: 'Автопарк', content: '10+ бренд, экономдон люкс.' },
    policies: { title: 'Саясаттар', content: 'Ижара саясаты жана камсыздандыруу.' },
    privacy: { title: 'Купуялык саясаты', content: 'GDPR стандарттары боюнча маалыматтарды коргойбуз.' },
    legal: { title: 'Юридикалык маалымат', content: 'Юридикалык маалымат жана компания деталдары.' },
    terms: { title: 'Шарттар жана эрежелер', content: 'Ижара келишиминин толук шарттары.' }
  }
};

const aboutImages = [
  'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
];

const AboutPage = ({ t }) => {
  const stats = t('aboutStats');
  const highlights = t('aboutHighlights');

  return (
    <section className="overflow-hidden bg-[radial-gradient(circle_at_top_left,#fff7ed,#f8fafc_42%,#e0f2fe)] px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-orange-700">
              <GraduationCap className="h-4 w-4" />
              {t('aboutEyebrow')}
            </p>
            <h1 className="mt-6 max-w-4xl text-5xl font-black leading-tight tracking-tight text-slate-950 md:text-7xl">
              {t('aboutTitle')}
            </h1>
            <p className="mt-6 max-w-3xl text-xl leading-9 text-slate-600">
              {t('aboutLead')}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/cars" className="rounded-2xl bg-slate-950 px-6 py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl transition hover:-translate-y-0.5">
                {t('fleet')}
              </Link>
              <Link to="/contact" className="rounded-2xl bg-white px-6 py-4 text-sm font-black uppercase tracking-widest text-slate-950 shadow-xl transition hover:-translate-y-0.5">
                {t('contact')}
              </Link>
            </div>
          </div>

          <div className="relative min-h-[34rem]">
            <div className="absolute left-0 top-10 w-72 rotate-[-6deg] overflow-hidden rounded-[2rem] shadow-2xl">
              <img src={aboutImages[0]} alt="Kyrgyzstan tourism road" className="h-80 w-full object-cover" />
            </div>
            <div className="absolute right-0 top-0 w-72 rotate-[7deg] overflow-hidden rounded-[2rem] shadow-2xl">
              <img src={aboutImages[1]} alt="Issyk-Kul tourism" className="h-72 w-full object-cover" />
            </div>
            <div className="absolute bottom-0 left-24 w-80 overflow-hidden rounded-[2rem] border-8 border-white shadow-2xl">
              <img src={aboutImages[2]} alt="Mountain fleet route" className="h-64 w-full object-cover" />
            </div>
            <div className="absolute left-6 top-0 rounded-3xl bg-white/90 p-4 shadow-xl backdrop-blur">
              <Plane className="h-7 w-7 text-sky-700" />
            </div>
            <div className="absolute right-10 bottom-16 rounded-3xl bg-orange-500 p-4 text-white shadow-xl">
              <CarFront className="h-7 w-7" />
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-4">
          {stats.map((item) => (
            <div key={item.label} className="rounded-[2rem] border border-white/80 bg-white/85 p-6 shadow-xl backdrop-blur">
              <p className="text-4xl font-black text-cwd-blue">{item.value}</p>
              <p className="mt-2 text-sm font-bold uppercase tracking-widest text-slate-500">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          <article className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-2xl">
            <Sparkles className="mb-5 h-9 w-9 text-orange-300" />
            <h2 className="text-3xl font-black">{t('aboutStoryTitle')}</h2>
            <p className="mt-4 leading-8 text-slate-300">{t('aboutStoryText')}</p>
          </article>
          <article className="rounded-[2rem] border border-white/80 bg-white/90 p-8 shadow-2xl">
            <Mountain className="mb-5 h-9 w-9 text-emerald-600" />
            <h2 className="text-3xl font-black text-slate-950">{t('aboutTourismTitle')}</h2>
            <p className="mt-4 leading-8 text-slate-600">{t('aboutTourismText')}</p>
          </article>
          <article className="rounded-[2rem] border border-white/80 bg-white/90 p-8 shadow-2xl">
            <ShieldCheck className="mb-5 h-9 w-9 text-sky-700" />
            <h2 className="text-3xl font-black text-slate-950">{t('aboutFleetTitle')}</h2>
            <p className="mt-4 leading-8 text-slate-600">{t('aboutFleetText')}</p>
          </article>
        </div>

        <div className="mt-14 rounded-[2rem] border border-white/80 bg-white/85 p-6 shadow-xl backdrop-blur md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <Map className="h-7 w-7 text-cwd-blue" />
            <h2 className="text-3xl font-black text-slate-950">{t('availableServices')}</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {highlights.map((item) => (
              <div key={item} className="flex items-start gap-4 rounded-3xl bg-slate-50 p-5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-orange-100 text-orange-700">
                  <UsersRound className="h-5 w-5" />
                </span>
                <p className="font-bold leading-7 text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const StaticPage = ({ page }) => {
  const { lang, t } = useLang();

  if (page === 'aboutUs') {
    return <AboutPage t={t} />;
  }

  const pageContent = staticContent[lang]?.[page] || staticContent.en[page];
  if (!pageContent) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-r from-red-400 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl transform rotate-12">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            {t('pageNotFound')}
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-md mx-auto leading-relaxed">
            {t('pageNotFoundText')}
          </p>
          <div className="space-y-4">
            <a href="/" className="block w-full bg-cwd-blue text-white font-bold py-4 px-8 rounded-xl text-lg hover:bg-opacity-90 shadow-lg transform hover:-translate-y-1 transition-all duration-200">
              {t('home')}
            </a>
            <div className="grid grid-cols-2 gap-4">
              <a href="/cars" className="bg-white border-2 border-gray-200 text-gray-900 font-bold py-3 px-6 rounded-lg hover:bg-gray-50 shadow-md transition-all duration-200 text-sm">
                {t('cars')}
              </a>
              <a href="/login" className="bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 shadow-md transition-all duration-200 text-sm">
                {t('login')}
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-20 max-w-4xl">
      <h1 className="text-4xl font-extrabold mb-8 tracking-tight">{pageContent.title}</h1>
      <div className="prose prose-lg max-w-none">
        <p className="text-lg leading-relaxed mb-8">{pageContent.content}</p>
        <p className="text-gray-600">{t('contactSupportDetails')}</p>
      </div>
    </section>
  );
};

export default StaticPage;


