import React from 'react';
import { useLang } from '../context/LangContext';
import { useBooking } from './BookingContext';
import { cars } from '../data/cars';

const BookingSummary = () => {
  const { t } = useLang();
  const { searchResults, booking, calcPrice } = useBooking();

  if (searchResults.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-20 bg-gray-50">
      <h2 className="text-3xl font-extrabold mb-8 text-center">{t('total')} Summary</h2>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="font-bold text-xl mb-4">Booking Details</h3>
          <ul className="space-y-2 text-sm">
            <li>Pickup: Bishkek Airport • {booking.pickupDate} {booking.pickupTime}</li>
            <li>Dropoff: Bishkek City • {booking.dropoffDate} {booking.dropoffTime}</li>
            <li>Days: {booking.days}</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-xl mb-4">Available Cars ({searchResults.length})</h3>
          <div className="space-y-3">
            {searchResults.map(car => (
              <div key={car.id} className="flex justify-between items-center p-3 bg-white rounded-lg">
                <span>{car.model.en}</span>
                <span>${calcPrice(car.price)}</span>
              </div>
            ))}
          </div>
          <button className="mt-6 w-full bg-green-600 text-white py-4 rounded-lg font-bold uppercase tracking-widest hover:bg-green-700 transition">
            {t('reserve')}
          </button>
        </div>
      </div>
    </section>
  );
};

export default BookingSummary;

