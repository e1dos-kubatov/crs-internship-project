import React from 'react';
import { useLang } from '../context/LangContext';
import { useRental } from '../context/RentalContext';
import { useNavigate } from 'react-router-dom';
import { useBooking } from './BookingContext';
import { cars } from '../data/cars';
import { offices as locations } from '../data/offices';
import BookingSummary from './BookingSummary';
import { TIME_SLOTS } from '../Constants';

const ChevronIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
  </svg>
);

const Hero = () => {
  const { t } = useLang();
  const { booking, updateBooking, searchCars, TIME_SLOTS: slots } = useBooking(); 
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
      <section className="relative min-h-[700px] flex flex-col items-center pt-24 pb-12 px-4">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80" 
            alt="Cars" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        <h1 className="relative z-10 text-white text-3xl md:text-5xl font-extrabold mb-12 text-center tracking-tight max-w-4xl leading-tight">
          {t('title')}
        </h1>

        <form onSubmit={handleSearch} className="bg-cwd-gray-dark/95 backdrop-blur-sm text-white p-8 w-full max-w-6xl shadow-2xl rounded-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-4">
                <span className="bg-cwd-gray-light text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">1</span>
                <div className="flex-1">
                  <label className="block text-xs uppercase text-gray-300 font-bold mb-1">{t('pickup')}</label>
                  <select 
                    value={booking.pickup} 
                    onChange={(e) => updateBooking({ pickup: e.target.value })}
                    className="w-full bg-white text-gray-800 p-3 pr-10 appearance-none rounded text-sm font-medium focus:ring-2 focus:ring-cwd-blue outline-none"
                  >
                    {locations.map(loc => <option key={loc.id} value={loc.id}>{loc.name.en}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="bg-cwd-gray-light text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">2</span>
                <div className="flex-1">
                  <label className="block text-xs uppercase text-gray-300 font-bold mb-1">{t('dropoff')}</label>
                  <select 
                    value={booking.dropoff} 
                    onChange={(e) => updateBooking({ dropoff: e.target.value })}
                    className="w-full bg-white text-gray-800 p-3 pr-10 appearance-none rounded text-sm font-medium focus:ring-2 focus:ring-cwd-blue outline-none"
                  >
                    {locations.map(loc => <option key={loc.id} value={loc.id}>{loc.name.en}</option>)}
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

          <div className="mt-8 pt-6 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
            <button type="button" className="text-xs font-black flex items-center gap-2 hover:text-gray-300 transition-colors uppercase tracking-widest">
              Worldwide Discount <ChevronIcon />
            </button>
            <button type="submit" className="bg-cwd-blue px-12 py-4 text-sm font-black hover:bg-opacity-90 transition-all uppercase tracking-widest rounded">
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

