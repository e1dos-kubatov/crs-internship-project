import React from 'react';
import { CarFront, Gauge, ShieldCheck, Sparkles } from 'lucide-react';
import { useRental } from '../context/RentalContext';
import { useLang } from '../context/LangContext';
import Filters from './Filters';
import CarCard from './CarCard';

const CarsPage = () => {
  const { filteredCars, filters, loading, error, updateFilters } = useRental();
  const { t } = useLang();
  const approvedCarsText = t('approvedCarsAvailable', { count: filteredCars.length });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-3xl p-6 h-80">
                <div className="h-48 bg-gray-200 rounded-2xl mb-6"></div>
                <div className="h-6 bg-gray-200 rounded mb-3 w-3/4"></div>
                <div className="flex gap-2 mb-6">
                  <div className="h-4 bg-gray-200 rounded-full w-16"></div>
                  <div className="h-4 bg-gray-200 rounded-full w-12"></div>
                </div>
                <div className="h-12 bg-gray-200 rounded-xl w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#071426] py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(14,165,233,0.32),transparent_28%),radial-gradient(circle_at_85%_18%,rgba(59,130,246,0.22),transparent_30%),linear-gradient(135deg,#071426,#0f2a44_48%,#e0f2fe)]" />
      <div className="absolute inset-x-0 top-0 h-80 bg-[linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:44px_44px] opacity-35" />
      <div className="absolute right-[-8rem] top-24 h-80 w-80 rounded-full border border-sky-200/20 bg-sky-300/10 blur-3xl" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="relative mb-8 overflow-hidden rounded-[2.2rem] border border-sky-100/20 bg-white/10 p-5 text-white shadow-2xl shadow-sky-950/30 backdrop-blur md:p-7">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-35"
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-cwd-blue/75 to-sky-400/20" />
          <div className="relative grid gap-8 lg:grid-cols-[1fr_0.75fr] lg:items-end">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-sky-200/25 bg-sky-100/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.32em] text-sky-100 backdrop-blur">
                <Sparkles className="h-4 w-4" />
                {t('liveFleet')}
              </p>
              <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight md:text-5xl">{t('carsForRent')}</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-sky-50/85">
                {approvedCarsText}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {[
                { icon: CarFront, label: t('available'), value: filteredCars.length },
                { icon: Gauge, label: t('transmission'), value: 'Auto / Manual' },
                { icon: ShieldCheck, label: t('fuel'), value: 'Gas / Diesel / Hybrid' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur">
                    <Icon className="mb-2 h-5 w-5 text-sky-200" />
                    <p className="text-[0.65rem] font-black uppercase tracking-[0.25em] text-sky-100/70">{item.label}</p>
                    <p className="mt-1 text-base font-black">{item.value}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-80 lg:sticky lg:top-24 lg:h-fit self-start">
            <Filters />
          </aside>
          
          <main className="flex-1">
            <div className="mb-8">
              <div className="filters-header mb-6 rounded-[2rem] border border-sky-100/80 bg-white/90 p-8 shadow-xl shadow-sky-950/10 backdrop-blur">
                {filters.pickupDate && filters.dropoffDate ? (
                  <div>
                    <h1 className="text-3xl font-black text-slate-950 mb-2">
                      {t('available')} {filters.pickupDate} - {filters.dropoffDate}
                    </h1>
                    <p className="text-lg text-slate-600">
                      {filteredCars.length} {t('carsFound')}
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-sm font-bold uppercase tracking-[0.25em] text-cwd-blue">{t('liveFleet')}</p>
                    <h2 className="mt-2 text-3xl font-black text-slate-950 mb-2">{t('cars')}</h2>
                    <p className="text-lg text-slate-600">
                      {approvedCarsText}
                    </p>
                  </>
                )}
                {error && (
                  <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
                    {error}
                  </div>
                )}
              </div>
            </div>
            
            {filteredCars.length === 0 ? (
              <div className="text-center py-24">
                <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-4V7m8 10v5a1 1 0 01-1 1h-4a1 1 0 01-1-1v-5" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('noCarsFound')}</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  {t('noCarsText')}
                </p>
                <button
                  onClick={() => updateFilters({ price: [0, 500], transmission: [], fuel: [], sort: 'price-asc', query: '' })}
                  className="bg-cwd-blue text-white px-8 py-3 rounded-2xl font-bold hover:bg-opacity-90 transition-all"
                >
                  {t('clearFilters')}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {filteredCars.map(car => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default CarsPage;

