import React from 'react';
import { ArrowRight, BookOpen, CalendarDays, Compass, MapPin, Mountain, Navigation, Snowflake, Waves } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLang } from '../context/LangContext';

const issykKulBeachHeroImage = 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Lake_Issyk-Kul,_Cholpon-Ata,_Kyrgyzstan_(6170033784).jpg?width=2200';
const beachImage = 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Lake_Issyk-Kul,_Cholpon-Ata,_Kyrgyzstan_(6169500283).jpg?width=1400';
const valleyImage = 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Karakol_Valley.jpg?width=1400';
const skiImage = 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Kyrgyzstan_Downhill_Skiing_(7208585660).jpg?width=1400';

const seasonIcons = [Waves, Mountain, Snowflake];
const seasonImages = [beachImage, valleyImage, skiImage];

const destinationLinks = [
  {
    map: 'https://www.google.com/maps/search/?api=1&query=Issyk-Kul+north+shore+Cholpon-Ata+Kyrgyzstan',
    info: 'https://en.wikipedia.org/wiki/Issyk-Kul',
  },
  {
    map: 'https://www.google.com/maps/search/?api=1&query=Issyk-Kul+south+shore+Kyrgyzstan',
    info: 'https://en.wikipedia.org/wiki/Issyk-Kul',
  },
  {
    map: 'https://www.google.com/maps/search/?api=1&query=Karakol+Jeti-Oguz+Kyrgyzstan',
    info: 'https://en.wikipedia.org/wiki/Jeti-%C3%96g%C3%BCz_Rocks',
  },
  {
    map: 'https://www.google.com/maps/search/?api=1&query=Ala-Archa+National+Park+Kyrgyzstan',
    info: 'https://en.wikipedia.org/wiki/Ala_Archa_National_Park',
  },
  {
    map: 'https://www.google.com/maps/search/?api=1&query=Song-Kul+Lake+Kyrgyzstan',
    info: 'https://en.wikipedia.org/wiki/Song-K%C3%B6l',
  },
  {
    map: 'https://www.google.com/maps/search/?api=1&query=Alay+Valley+Peak+Lenin+Kyrgyzstan',
    info: 'https://en.wikipedia.org/wiki/Alay_Valley',
  },
  {
    map: 'https://www.google.com/maps/search/?api=1&query=Kara-Koy+Osh+Region+Kyrgyzstan',
    info: 'https://en.wikipedia.org/wiki/Osh_Region',
  },
  {
    map: 'https://www.google.com/maps/search/?api=1&query=Arslanbob+Jalal-Abad+Kyrgyzstan',
    info: 'https://en.wikipedia.org/wiki/Arslanbob',
  },
  {
    map: 'https://www.google.com/maps/search/?api=1&query=Sary-Chelek+Kyrgyzstan',
    info: 'https://en.wikipedia.org/wiki/Sary-Chelek_Nature_Reserve',
  },
];

const photoCredits = [
  { label: 'Issyk-Kul beach', href: 'https://commons.wikimedia.org/wiki/File:Lake_Issyk-Kul,_Cholpon-Ata,_Kyrgyzstan_(6170033784).jpg' },
  { label: 'Issyk-Kul coast', href: 'https://commons.wikimedia.org/wiki/File:Lake_Issyk-Kul,_Cholpon-Ata,_Kyrgyzstan_(6169500283).jpg' },
  { label: 'Karakol Valley', href: 'https://commons.wikimedia.org/wiki/File:Karakol_Valley.jpg' },
  { label: 'Kyrgyzstan skiing', href: 'https://commons.wikimedia.org/wiki/File:Kyrgyzstan_Downhill_Skiing_(7208585660).jpg' },
];

const TourismSeasonGuide = () => {
  const { t } = useLang();
  const seasonCards = t('tourismSeasonCards');
  const bestPlaces = t('tourismBestPlaces');
  const tripNotes = t('tourismTripNotes');

  return (
    <section className="overflow-hidden bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div className="flex flex-col justify-center">
          <p className="mb-4 inline-flex w-fit items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2 text-xs font-black uppercase text-emerald-800 ring-1 ring-emerald-200">
            <Compass className="h-4 w-4" />
            {t('tourismEyebrow')}
          </p>
          <h2 className="text-4xl font-black leading-tight text-slate-950 md:text-5xl">
            {t('tourismTitle')}
          </h2>
          <p className="mt-5 max-w-2xl text-lg font-medium leading-8 text-slate-600">
            {t('tourismLead')}
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {t('tourismTags').map((item) => (
              <span key={item} className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm font-black text-slate-800">
                {item}
              </span>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/cars" className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-6 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-slate-800">
              {t('tourismFindCar')}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/offices" className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-black text-slate-900 transition hover:-translate-y-0.5 hover:border-emerald-500 hover:text-emerald-800">
              {t('tourismChooseOffice')}
            </Link>
          </div>
        </div>

        <div className="relative min-h-[430px]">
          <img
            src={issykKulBeachHeroImage}
            alt={t('tourismHeroImageAlt')}
            className="absolute inset-0 h-full w-full rounded-lg object-cover"
          />
          <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-slate-950/70 via-slate-950/15 to-transparent" />
          <div className="absolute bottom-5 left-5 right-5 rounded-lg bg-white/90 p-5 shadow-2xl backdrop-blur">
            <div className="flex flex-wrap items-center gap-3 text-sm font-black text-slate-900">
              <span className="inline-flex items-center gap-2 rounded-lg bg-cyan-50 px-3 py-2 text-cyan-800">
                <MapPin className="h-4 w-4" />
                {t('tourismLoopLabel')}
              </span>
              <span className="inline-flex items-center gap-2 rounded-lg bg-orange-50 px-3 py-2 text-orange-800">
                <CalendarDays className="h-4 w-4" />
                {t('tourismLoopDuration')}
              </span>
            </div>
            <p className="mt-4 text-sm font-semibold leading-6 text-slate-600">
              {t('tourismLoopText')}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-slate-950 py-12 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-black uppercase text-cyan-300">{t('tourismSeasonEyebrow')}</p>
              <h3 className="mt-2 text-3xl font-black md:text-4xl">{t('tourismSeasonTitle')}</h3>
            </div>
            <p className="max-w-xl text-sm font-semibold leading-6 text-slate-300">
              {t('tourismSeasonLead')}
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {seasonCards.map((card, index) => {
              const Icon = seasonIcons[index] || Compass;

              return (
                <article key={card.title} className="overflow-hidden rounded-lg bg-white text-slate-950 shadow-2xl shadow-black/20">
                <img src={seasonImages[index]} alt={card.title} className="h-48 w-full object-cover" />
                  <div className="p-6">
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <span className="grid h-11 w-11 place-items-center rounded-lg bg-cyan-50 text-cyan-800">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-black text-slate-600">{card.time}</span>
                    </div>
                    <h4 className="text-xl font-black">{card.title}</h4>
                    <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">{card.text}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {card.places.map((place) => (
                        <span key={place} className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-800">
                          {place}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_0.8fr] lg:px-8">
        <div>
          <p className="text-sm font-black uppercase text-orange-700">{t('tourismBestPlacesEyebrow')}</p>
          <h3 className="mt-2 text-3xl font-black text-slate-950 md:text-4xl">{t('tourismBestPlacesTitle')}</h3>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {bestPlaces.map((place, index) => {
              const links = destinationLinks[index];

              return (
                <article key={place.name} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <h4 className="text-lg font-black text-slate-950">{place.name}</h4>
                    <span className="rounded-lg bg-orange-50 px-3 py-1 text-xs font-black text-orange-800">{place.tag}</span>
                  </div>
                  <p className="text-sm font-semibold leading-6 text-slate-600">{place.detail}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <a href={links.map} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-cyan-50 px-3 py-2 text-xs font-black text-cyan-800 transition hover:bg-cyan-100">
                      <Navigation className="h-4 w-4" />
                      {t('tourismDirections')}
                    </a>
                    <a href={links.info} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-xs font-black text-slate-800 transition hover:bg-slate-200">
                      <BookOpen className="h-4 w-4" />
                      {t('tourismWikipedia')}
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <aside className="self-start rounded-lg bg-gradient-to-br from-cyan-50 via-white to-orange-50 p-6 ring-1 ring-slate-200">
          <p className="text-sm font-black uppercase text-slate-500">{t('tourismBeforeRoad')}</p>
          <h4 className="mt-2 text-2xl font-black text-slate-950">{t('tourismNotesTitle')}</h4>
          <ul className="mt-6 space-y-4">
            {tripNotes.map((note) => (
              <li key={note} className="flex gap-3 text-sm font-semibold leading-6 text-slate-700">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-600" />
                {note}
              </li>
            ))}
          </ul>
          <div className="mt-8 rounded-lg bg-slate-950 p-5 text-white">
            <p className="text-sm font-black uppercase text-cyan-300">{t('tourismCarMatchTitle')}</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-200">
              {t('tourismCarMatchText')}
            </p>
          </div>
        </aside>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-8 text-xs font-semibold text-slate-500 sm:px-6 lg:px-8">
        {t('tourismPhotoSources')}{' '}
        {photoCredits.map((credit, index) => (
          <React.Fragment key={credit.href}>
            <a href={credit.href} target="_blank" rel="noreferrer" className="underline decoration-slate-300 underline-offset-4 hover:text-slate-900">
              {credit.label}
            </a>
            {index < photoCredits.length - 1 ? ', ' : '.'}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};

export default TourismSeasonGuide;
