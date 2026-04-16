import React from 'react';
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

const StaticPage = ({ page }) => {
  const { lang } = useLang();

  const pageContent = staticContent[lang][page];
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
            Страница не найдена
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-md mx-auto leading-relaxed">
            К сожалению, запрашиваемая страница не существует.
          </p>
          <div className="space-y-4">
            <a href="/" className="block w-full bg-cwd-blue text-white font-bold py-4 px-8 rounded-xl text-lg hover:bg-opacity-90 shadow-lg transform hover:-translate-y-1 transition-all duration-200">
              На главную
            </a>
            <div className="grid grid-cols-2 gap-4">
              <a href="/cars" className="bg-white border-2 border-gray-200 text-gray-900 font-bold py-3 px-6 rounded-lg hover:bg-gray-50 shadow-md transition-all duration-200 text-sm">
                Автомобили
              </a>
              <a href="/login" className="bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 shadow-md transition-all duration-200 text-sm">
                Войти
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
        <p className="text-gray-600">For more details, contact our support team.</p>
      </div>
    </section>
  );
};

export default StaticPage;


