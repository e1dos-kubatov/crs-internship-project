import React from 'react';
import { useLang } from '../context/LangContext';
import { useBooking } from './BookingContext';
import { cars } from '../data/cars';

const CarsList = () => {
  const { t } = useLang();
  const { searchResults, calcPrice } = useBooking();

  const availableCars = searchResults.length > 0 ? searchResults : cars;

  return (
    <section className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-extrabold mb-12 text-center tracking-tight">{t('cars')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {availableCars.map((car) => (
          <div key={car.id} className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all group">
            <img src={car.img} alt={car.model.en} className="w-full h-64 object-cover group-hover:scale-105 transition-transform" />
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2">{car.model.en}</h3> {/* Simplified, can use t later */}
              <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                <div>{t('price')} ${car.price}</div>
                <div>{t('transmission')}</div>
                <div>{car.seats} {t('seats')}</div>
              </div>
              <div className="text-3xl font-bold text-cwd-blue mb-4">
                ${calcPrice(car.price)} total
              </div>
              <button className="w-full bg-cwd-blue text-white py-3 rounded-lg font-bold uppercase tracking-widest hover:bg-opacity-90 transition">
                {t('select')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CarsList;

