import React, { createContext, useContext, useState, useEffect } from 'react';

const LangContext = createContext();

export const useLang = () => {
  const context = useContext(LangContext);
  if (!context) throw new Error('useLang must be used within LangProvider');
  return context;
};

const translations = {
  en: {
    // Header
    lang: ['English', 'Русский', 'Кыргызча'],
    nav: ['Cars', 'Booking', 'Offices', 'Contact', 'FAQ'],
    logo: 'CWD Car rental',
    // Hero
    title: 'Stay On The Road With CWD For A Privileged Rental Experience',
    pickup: 'Pick Up Office',
    dropoff: 'Drop Off Office',
    pickupDate: 'Pick Up Date',
    dropoffDate: 'Drop Off Date',
    searchCars: 'Search Cars',
    // Footer
    corporate: 'Corporate',
    modify: 'Modify Booking',
    cancel: 'Cancel Booking',
    help: 'How Can We Help?',
    about: 'About Us',
    contact: 'Contact',
    feedback: 'Feedback',
    other: 'Other',
    destinations: 'Destinations',
    fleet: 'Fleet',
    offices: 'Offices',
    policies: 'Policies',
    privacy: 'Privacy Policy',
    legal: 'Legal Notice',
    terms: 'Terms and Conditions',
    copyright: '© 2026 CWD Car Rental. All Rights Reserved.',
    // Cars
    cars: 'Available Cars',
    model: 'Model',
    price: 'Price/Day',
    transmission: 'Transmission',
    seats: 'Seats',
    select: 'Select',
    // Booking
    total: 'Total',
    reserve: 'Reserve Now',
    // Contact
    send: 'Send Message',
    name: 'Name',
    email: 'Email',
    message: 'Message',
    // FAQ
    faq: 'FAQ',
    howHelp: 'How can we help you?',
    // Common
    rentFor: (days) => `Rent for ${days} days`
  },
  ru: {
    lang: ['English', 'Русский', 'Кыргызча'],
    nav: ['Автомобили', 'Бронирование', 'Офисы', 'Контакты', 'ЧаВо'],
    logo: 'CWD Car rental',
    title: 'Оставайтесь на дороге с CWD для привилегированного опыта аренды',
    pickup: 'Офис получения',
    dropoff: 'Офис возврата',
    pickupDate: 'Дата получения',
    dropoffDate: 'Дата возврата',
    searchCars: 'Поиск автомобилей',
    corporate: 'Корпоративные',
    modify: 'Изменить бронирование',
    cancel: 'Отменить бронирование',
    help: 'Как мы можем помочь?',
    about: 'О нас',
    contact: 'Контакты',
    feedback: 'Обратная связь',
    other: 'Другое',
    destinations: 'Направления',
    fleet: 'Автопарк',
    offices: 'Офисы',
    policies: 'Политика конфиденциальности',
    privacy: 'Политика конфиденциальности',
    legal: 'Юридическая информация',
    terms: 'Условия и положения',
    copyright: '© 2026 CWD Аренда автомобилей. Все права защищены.',
    cars: 'Доступные автомобили',
    model: 'Модель',
    price: 'Цена/день',
    transmission: 'Трансмиссия',
    seats: 'Мест',
    select: 'Выбрать',
    total: 'Итого',
    reserve: 'Забронировать сейчас',
    send: 'Отправить сообщение',
    name: 'Имя',
    email: 'Email',
    message: 'Сообщение',
    faq: 'ЧаВо',
    howHelp: 'Как мы можем вам помочь?',
    rentFor: (days) => `Аренда на ${days} дней`
  },
  kg: {
    lang: ['English', 'Русский', 'Кыргызча'],
    nav: ['Унаалар', 'Брондоо', 'Контакты', 'Байланыш', 'КөпБС'],
    logo: 'CWD Car rental',
    title: 'Аренданын артыкчылыктуу тажрыйбасы үчүн CWD менен жолдо болуңуз',
    pickup: 'Кабыл алуу кеңсеси .',
    dropoff: 'Кайтаруу кеңсеси',
    pickupDate: 'Дата алган',
    dropoffDate: 'Кайтаруу датасы',
    searchCars: 'Унааларды издөө',
    corporate: 'Корпоративдик',
    modify: 'Брондоону  өзгөртүү',
    cancel: 'Брондоону жокко чыгаруу',
    help: 'Биз кантип жардам бере алабыз?',
    about: 'Биз жөнүндө',
    contact: 'Байланыш',
    feedback: 'Пикирлер',
    other: 'Башка',
    destinations: 'Багыттар',
    fleet: 'Автопарк',
    offices: 'Кеңсе',
    policies: 'Купуялык саясаты',
    privacy: 'Купуялык саясаты',
    legal: 'Юридикалык маалымат',
    terms: 'Шарттар жана эрежелер',
    copyright: '© 2026 CWD Унаа ижарасы. Бардык укуктар корголгон.',
    cars: 'Жеткиликтүү унаалар',
    model: 'Модель',
    price: 'Баасы/күн',
    transmission: 'Трансмиссия',
    seats: 'Орундар',
    select: 'Тандаңыз',
    total: 'Жалпы',
    reserve: 'Азыр брондоо',
    send: 'Билдирүү жөнөтүү',
    name: 'Аты',
    email: 'Email',
    message: 'Билдирүү',
    faq: 'КБС',
    howHelp: 'Биз сизге кантип жардам беребиз?',
    rentFor: (days) => `${days} күн ижаралоо`
  }
};

export const LangProvider = ({ children }) => {
  const [lang, setLang] = useState('en');
  useEffect(() => {
    const saved = localStorage.getItem('lang') || 'en';
    setLang(saved);
  }, []);
  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  const t = (key, params) => {
    let str = translations[lang][key] || key;
    if (params && typeof str === 'function') str = str(params);
    return str;
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t, langs: translations[lang].lang }}>
      {children}
    </LangContext.Provider>
  );
};

