import React from 'react';
import { useLang } from '../context/LangContext';
import { useBooking } from './BookingContext';

const BookingSummary = () => {
  const { t } = useLang();
  const { searchResults, booking, calcPrice } = useBooking();

  if (searchResults.length === 0) return null;

  return (
    <section className="container mx-auto bg-transparent px-4 py-20">
      <h2 className="mb-8 text-center text-3xl font-black text-slate-950">{t('total')} Summary</h2>
      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
        <div className="rounded-[2rem] bg-white/85 p-6 shadow-xl backdrop-blur">
          <h3 className="mb-4 text-xl font-black">Booking details</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>Pickup: Bishkek Airport - {booking.pickupDate} {booking.pickupTime}</li>
            <li>Dropoff: Bishkek City - {booking.dropoffDate} {booking.dropoffTime}</li>
            <li>Days: {booking.days}</li>
          </ul>
        </div>
        <div className="rounded-[2rem] bg-white/85 p-6 shadow-xl backdrop-blur">
          <h3 className="mb-4 text-xl font-black">Available cars ({searchResults.length})</h3>
          <div className="space-y-3">
            {searchResults.map((car) => (
              <div key={car.id} className="flex items-center justify-between rounded-2xl bg-slate-50 p-3">
                <span>{car.model.en}</span>
                <span className="font-black">${calcPrice(car.price)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingSummary;
