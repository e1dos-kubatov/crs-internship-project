import React, { useState } from 'react';
import { Building2, Clock, Info, MapPin, Navigation, Phone, Plane, Sparkles, X } from 'lucide-react';
import { offices } from '../data/offices';
import { useLang } from '../context/LangContext';

const mapsUrl = (office) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(office.mapQuery || office.address.en)}`;

const OfficeIcon = ({ type }) => {
  const Icon = type === 'Airport' ? Plane : Building2;
  return <Icon className="h-6 w-6" />;
};

const serviceCopy = {
  'Airport pickup': {
    ru: { label: 'Встреча в аэропорту', detail: 'Команда встретит вас в зоне прилета и передаст авто сразу после посадки рейса.' },
    kg: { label: 'Аэропорттон алуу', detail: 'Команда сизди учуп келүү зонасында тосуп алып, рейстен кийин унааны өткөрүп берет.' },
  },
  'Late-night returns': {
    ru: { label: 'Поздний возврат', detail: 'Возвращайте авто вне обычного графика по брони, удобно для ранних и поздних рейсов.' },
    kg: { label: 'Түнкү кайтаруу', detail: 'Эрте же кеч рейстер үчүн автоону алдын ала макулдашуу менен графиктен тышкары кайтарса болот.' },
  },
  'Flight arrival support': {
    ru: { label: 'Поддержка по рейсу', detail: 'Сообщите номер рейса и время получения, чтобы офис учел возможные задержки.' },
    kg: { label: 'Рейс боюнча колдоо', detail: 'Рейс номериңизди жана алуу убактысын бериңиз, офис кечигүүлөрдү эске алат.' },
  },
  'Regional transfers': {
    ru: { label: 'Региональные поездки', detail: 'Удобно для маршрутов из Оша в южные регионы с гибким планом получения.' },
    kg: { label: 'Аймактык сапарлар', detail: 'Оштон түштүк аймактарга бара турган маршруттар үчүн ыңгайлуу.' },
  },
  'Return assistance': {
    ru: { label: 'Помощь при возврате', detail: 'Сотрудники объяснят время возврата, топливо и осмотр авто перед завершением аренды.' },
    kg: { label: 'Кайтаруу боюнча жардам', detail: 'Кызматкерлер кайтаруу убактысын, май эрежесин жана текшерүүнү түшүндүрөт.' },
  },
  'City pickup': {
    ru: { label: 'Получение в городе', detail: 'Заберите авто в городском офисе, удобно для отелей, офисов и центра города.' },
    kg: { label: 'Шаардан алуу', detail: 'Унааны шаардык офистен алыңыз, мейманкана жана борбор үчүн ыңгайлуу.' },
  },
  'Contract support': {
    ru: { label: 'Помощь с договором', detail: 'Команда объяснит условия аренды, депозит, страховку и правила возврата.' },
    kg: { label: 'Келишим боюнча жардам', detail: 'Команда ижара шарттарын, депозитти, камсыздандырууну жана кайтаруу эрежелерин түшүндүрөт.' },
  },
  'Corporate rentals': {
    ru: { label: 'Корпоративная аренда', detail: 'Поддержка бизнес-аренд, повторных бронирований и поездок для компаний.' },
    kg: { label: 'Корпоративдик ижара', detail: 'Компаниялар үчүн бизнес ижара, кайталап брондоо жана сапарларды колдоо.' },
  },
  'Lake region pickup': {
    ru: { label: 'Получение у озера', detail: 'Получение рядом с Иссык-Кулем для летних маршрутов и курортов.' },
    kg: { label: 'Көл аймагынан алуу', detail: 'Ысык-Көлдүн жанында жайкы маршруттар жана курорттор үчүн алуу.' },
  },
  'Tour route cars': {
    ru: { label: 'Авто для туров', detail: 'Подберите авто для длинных туристических маршрутов и красивых поездок.' },
    kg: { label: 'Тур маршрут авто', detail: 'Узак туристтик маршруттар жана кооз жолдор үчүн ылайыктуу авто тандаңыз.' },
  },
  'Seasonal airport support': {
    ru: { label: 'Сезонная поддержка', detail: 'Работа офиса зависит от сезонных рейсов, поэтому бронь рекомендуется заранее.' },
    kg: { label: 'Сезондук колдоо', detail: 'Офистин иши сезондук рейстерге байланыштуу, алдын ала брондоо сунушталат.' },
  },
  'Mountain route cars': {
    ru: { label: 'Авто для гор', detail: 'Рекомендуемые авто для маршрутов вокруг Каракола, ущелий и горных дорог.' },
    kg: { label: 'Тоолуу жол авто', detail: 'Каракол, өрөөндөр жана тоо жолдору үчүн сунушталган автоолор.' },
  },
  'Ski season pickup': {
    ru: { label: 'Горнолыжный сезон', detail: 'Зимнее получение для путешественников, которые едут к горнолыжным базам и гостевым домам.' },
    kg: { label: 'Лыжа сезону', detail: 'Лыжа базаларына жана конок үйлөрүнө бара тургандар үчүн кышкы алуу.' },
  },
  'Adventure travel support': {
    ru: { label: 'Поддержка приключений', detail: 'Сотрудники помогут подтвердить, подходит ли авто вашему маршруту.' },
    kg: { label: 'Саякат колдоосу', detail: 'Кызматкерлер авто маршрутуңузга ылайыктуубу текшерүүгө жардам берет.' },
  },
  'South region trips': {
    ru: { label: 'Поездки по югу', detail: 'Подходит для маршрутов вокруг Оша, горных дорог и соседних регионов.' },
    kg: { label: 'Түштүк сапарлары', detail: 'Ош аймагы, тоолуу жолдор жана жакынкы региондор үчүн ылайыктуу.' },
  },
  'Flexible returns': {
    ru: { label: 'Гибкий возврат', detail: 'Условия возврата можно обсудить при получении для удобного расписания поездки.' },
    kg: { label: 'Ийкемдүү кайтаруу', detail: 'Сапардын убактысына ылайык кайтарууну алуу учурунда макулдашса болот.' },
  },
  'Regional routes': {
    ru: { label: 'Региональные маршруты', detail: 'Удобно для поездок по Джалал-Абадской области и соединительным дорогам.' },
    kg: { label: 'Аймактык маршруттар', detail: 'Жалал-Абад облусу жана байланыш жолдору боюнча сапарлар үчүн ыңгайлуу.' },
  },
  'Long-term rentals': {
    ru: { label: 'Долгосрочная аренда', detail: 'Обсудите недельную или более длительную аренду с командой офиса.' },
    kg: { label: 'Узак мөөнөттүү ижара', detail: 'Бир жума же андан узак ижараны офис командасы менен сүйлөшүңүз.' },
  },
};

const localized = (value, lang) => value?.[lang] || value?.en || value || '';

const Offices = () => {
  const { lang, t } = useLang();
  const [selectedOffice, setSelectedOffice] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  const serviceLabel = (service) => serviceCopy[service]?.[lang]?.label || service;
  const serviceDetail = (office, service) => serviceCopy[service]?.[lang]?.detail || office.serviceDetails?.[service] || t('officeServiceFallback');
  const officeTypeLabel = (office) => office.type === 'Airport' ? t('airportOffice') : t('cityOffice');

  const openOffice = (office) => {
    setSelectedOffice(office);
    setSelectedService(office.services[0]);
  };

  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top_left,#fff7ed,#f8fafc_44%,#e0f2fe)] px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <p className="text-sm font-black uppercase tracking-[0.4em] text-cwd-blue">{t('officesNetwork')}</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">{t('offices')}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
            {t('officesLead')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {offices.map((office) => (
            <article
              key={office.id}
              className="group overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 shadow-xl backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="relative overflow-hidden p-5 text-white">
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-80 transition duration-300 group-hover:scale-105 group-hover:opacity-90"
                  style={{ backgroundImage: `url(${office.imageUrl})` }}
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${office.accent} opacity-55`} />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-white/5" />
                <div className="relative mb-8 flex items-start justify-between gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/20 shadow-lg backdrop-blur">
                    <OfficeIcon type={office.type} />
                  </div>
                  <span className="rounded-full bg-white/20 px-3 py-2 text-xs font-black tracking-widest shadow-lg backdrop-blur">
                    {office.code}
                  </span>
                </div>
                <p className="relative text-xs font-black uppercase tracking-[0.25em] text-white/85 drop-shadow">{officeTypeLabel(office)}</p>
                <h3 className="relative mt-3 min-h-16 text-2xl font-black leading-tight drop-shadow-xl">{localized(office.name, lang)}</h3>
              </div>

              <div className="space-y-4 p-5">
                <div className="flex gap-3 text-slate-600">
                  <MapPin className="mt-1 h-5 w-5 shrink-0 text-cwd-blue" />
                  <p className="text-sm leading-6">{localized(office.address, lang)}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400">{t('city')}</p>
                    <p className="mt-1 font-black text-slate-950">{localized(office.cityName, lang) || office.city}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400">{t('code')}</p>
                    <p className="mt-1 font-black text-slate-950">{office.code}</p>
                  </div>
                </div>
                <button
                  onClick={() => openOffice(office)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-xs font-black uppercase tracking-widest text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  <Sparkles className="h-4 w-4" />
                  {t('viewDetails')}
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {selectedOffice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur">
          <div className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] bg-white shadow-2xl">
            <div className="relative overflow-hidden p-6 text-white">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-80"
                style={{ backgroundImage: `url(${selectedOffice.imageUrl})` }}
              />
              <div className={`absolute inset-0 bg-gradient-to-br ${selectedOffice.accent} opacity-55`} />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-white/5" />
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-white/85 drop-shadow">{officeTypeLabel(selectedOffice)}</p>
                  <h2 className="mt-3 text-3xl font-black leading-tight drop-shadow-xl">{localized(selectedOffice.name, lang)}</h2>
                </div>
                <button onClick={() => setSelectedOffice(null)} className="rounded-2xl bg-white/15 p-3 backdrop-blur hover:bg-white/25">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="space-y-5 p-6">
              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-3xl bg-slate-50 p-4">
                  <MapPin className="mb-3 h-5 w-5 text-cwd-blue" />
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400">{t('address')}</p>
                  <p className="mt-2 text-sm font-bold leading-6 text-slate-800">{localized(selectedOffice.address, lang)}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <Clock className="mb-3 h-5 w-5 text-orange-600" />
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400">{t('workingHours')}</p>
                  <p className="mt-2 text-sm font-bold leading-6 text-slate-800">{localized(selectedOffice.hoursText, lang) || selectedOffice.hours}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <Phone className="mb-3 h-5 w-5 text-emerald-600" />
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400">{t('contact')}</p>
                  <p className="mt-2 text-sm font-bold leading-6 text-slate-800">{selectedOffice.phone}</p>
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-xl font-black text-slate-950">{t('availableServices')}</h3>
                <div className="flex flex-wrap gap-3">
                  {selectedOffice.services.map((service) => (
                    <button
                      key={service}
                      onClick={() => setSelectedService(service)}
                      className={`rounded-full px-4 py-2 text-sm font-black transition ${selectedService === service ? 'bg-cwd-blue text-white shadow-lg' : 'bg-sky-100 text-sky-800 hover:bg-sky-200'}`}
                    >
                      {serviceLabel(service)}
                    </button>
                  ))}
                </div>
                {selectedService && (
                  <div className="mt-4 rounded-3xl border border-sky-100 bg-sky-50/80 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-black text-cwd-blue">
                      <Info className="h-4 w-4" />
                      {serviceLabel(selectedService)}
                    </div>
                    <p className="text-sm leading-6 text-slate-700">
                      {serviceDetail(selectedOffice, selectedService)}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex">
                <a
                  href={mapsUrl(selectedOffice)}
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r ${selectedOffice.accent} px-6 py-4 font-black uppercase tracking-widest text-white shadow-lg transition hover:-translate-y-0.5`}
                >
                  <Navigation className="h-5 w-5" />
                  {t('directions')}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Offices;
