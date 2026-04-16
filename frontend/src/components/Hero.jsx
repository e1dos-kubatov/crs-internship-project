import React from 'react';
import { useLang } from '../context/LangContext';
import { useRental } from '../context/RentalContext';
import { useNavigate } from 'react-router-dom';
import { useBooking } from './BookingContext';
import { offices as locations } from '../data/offices';
import BookingSummary from './BookingSummary';

const Hero = () => {
  const { lang, t } = useLang();
  const { booking, updateBooking, TIME_SLOTS: slots } = useBooking();
  const { updateFilters } = useRental();
  const navigate = useNavigate();
  
  const handleSearch = (e) => {
    e.preventDefault();
    // Update rental filters with booking
    updateFilters({
      pickupOffice: booking.pickup,
      dropoffOffice: booking.dropoff,
      pickupDate: booking.pickupDate,
      dropoffDate: booking.dropoffDate
    });
    navigate('/cars');
  };

  const today = new Date().toISOString().split('T')[0]; 

  return (
    <>
      <section className="relative min-h-[720px] flex flex-col items-center pt-24 pb-12 px-4">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80"
            alt="Cars" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/85 via-slate-900/55 to-orange-950/60"></div>
        </div>

        <h1 className="relative z-10 text-white text-4xl md:text-6xl font-black mb-12 text-center tracking-tight max-w-5xl leading-tight">
          {t('heroTitle')}
        </h1>

        <form onSubmit={handleSearch} className="relative z-10 w-full max-w-6xl rounded-[2rem] border border-white/15 bg-slate-950/80 p-8 text-white shadow-2xl backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-4">
                <span className="bg-orange-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">1</span>
                <div className="flex-1">
                  <label className="block text-xs uppercase text-gray-300 font-bold mb-1">{t('pickup')}</label>
                  <select 
                    value={booking.pickup} 
                    onChange={(e) => updateBooking({ pickup: e.target.value })}
                    className="w-full bg-white text-gray-800 p-3 pr-10 appearance-none rounded text-sm font-medium focus:ring-2 focus:ring-cwd-blue outline-none"
                  >
                    {locations.map(loc => <option key={loc.id} value={loc.id}>{loc.name[lang] || loc.name.en}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="bg-sky-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">2</span>
                <div className="flex-1">
                  <label className="block text-xs uppercase text-gray-300 font-bold mb-1">{t('dropoff')}</label>
                  <select 
                    value={booking.dropoff} 
                    onChange={(e) => updateBooking({ dropoff: e.target.value })}
                    className="w-full bg-white text-gray-800 p-3 pr-10 appearance-none rounded text-sm font-medium focus:ring-2 focus:ring-cwd-blue outline-none"
                  >
                    {locations.map(loc => <option key={loc.id} value={loc.id}>{loc.name[lang] || loc.name.en}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6 lg:border-l lg:border-gray-700 lg:pl-6">
              <div>
                <label className="block text-xs uppercase text-gray-300 font-bold mb-2">{t('pickupDate')}</label>
                <input 
                  type="date" 
                  min={today} 
                  value={booking.pickupDate} 
                  onChange={(e) => updateBooking({ pickupDate: e.target.value })}
                  className="w-full bg-white text-black p-4 rounded text-sm font-bold focus:ring-2 focus:ring-cwd-blue border border-gray-300" 
                  required 
                />
              </div>
              <div>
                <label className="block text-white text-xs uppercase font-bold mb-2">{t('pickupTime')}</label>
                <select 
                  value={booking.pickupTime}
                  onChange={(e) => updateBooking({ pickupTime: e.target.value })}
                  className="w-full bg-white text-black p-3 rounded text-sm font-bold focus:ring-2 focus:ring-cwd-blue border border-gray-300"
                >
                  {slots.map(time => <option key={time} value={time}>{time}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-white text-xs uppercase font-bold mb-2">{t('dropoffDate')}</label>
                <input 
                  type="date" 
                  min={booking.pickupDate || today} 
                  value={booking.dropoffDate} 
                  onChange={(e) => updateBooking({ dropoffDate: e.target.value })}
                  className="w-full bg-white text-black p-4 rounded text-sm font-bold focus:ring-2 focus:ring-cwd-blue border border-gray-300" 
                  required 
                />
              </div>
              <div>
                <label className="block text-white text-xs uppercase font-bold mb-2">{t('dropoffTime')}</label>
                <select 
                  value={booking.dropoffTime}
                  onChange={(e) => updateBooking({ dropoffTime: e.target.value })}
                  className="w-full bg-white text-black p-3 rounded text-sm font-bold focus:ring-2 focus:ring-cwd-blue border border-gray-300"
                >
                  {slots.map(time => <option key={time} value={time}>{time}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-700 flex flex-col md:flex-row justify-end items-center gap-4">
            <button type="submit" className="rounded-2xl bg-gradient-to-r from-orange-500 to-sky-700 px-12 py-4 text-sm font-black uppercase tracking-widest shadow-xl transition-all hover:-translate-y-0.5">
              {t('searchCars')}
            </button>
          </div>
        </form>
      </section>
      <BookingSummary />
    </>
  );
};

export default Hero;

