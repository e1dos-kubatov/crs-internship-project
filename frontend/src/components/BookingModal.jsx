import React, { useEffect, useState } from 'react';
import { CalendarDays, CheckCircle2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRental } from '../context/RentalContext';

const BookingModal = ({ car, onClose }) => {
  const { user } = useAuth();
  const { setBooking, createRental } = useRental();
  const navigate = useNavigate();
  const [pickupDate, setPickupDate] = useState('');
  const [dropoffDate, setDropoffDate] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setPickupDate(today);
    setDropoffDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  const days = pickupDate && dropoffDate
    ? Math.max(1, Math.ceil((new Date(dropoffDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24)) + 1)
    : 1;
  const total = car.price * days;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const rental = await createRental({
        carId: car.id,
        startDate: pickupDate,
        endDate: dropoffDate,
      });
      setBooking({
        ...rental,
        dates: { pickup: pickupDate, dropoff: dropoffDate },
        total,
      });
      setSubmitted(true);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur">
        <div className="w-full max-w-md rounded-[2rem] bg-white p-10 text-center shadow-2xl">
          <CheckCircle2 className="mx-auto mb-5 h-20 w-20 text-emerald-500" />
          <h3 className="text-3xl font-black text-slate-950">Rental created</h3>
          <p className="mt-3 text-slate-600">Your booking is now saved in the Spring Boot backend.</p>
          <p className="mt-5 rounded-2xl bg-emerald-50 px-4 py-3 text-lg font-black text-emerald-700">${total}</p>
          <button
            onClick={() => {
              onClose();
              navigate('/account/bookings');
            }}
            className="mt-6 w-full rounded-2xl bg-slate-950 px-6 py-4 font-black text-white"
          >
            View my rentals
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[2rem] bg-white p-6 shadow-2xl md:p-8">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-600">Backend rental</p>
            <h2 className="mt-2 text-3xl font-black text-slate-950">Book {car.model.en}</h2>
          </div>
          <button onClick={onClose} className="rounded-2xl bg-slate-100 p-3 text-slate-700 transition hover:bg-slate-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <img src={car.img} alt={car.model.en} className="h-52 w-full rounded-3xl object-cover" />

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Pickup date</span>
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full rounded-2xl border border-slate-200 p-4 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Dropoff date</span>
              <input
                type="date"
                value={dropoffDate}
                onChange={(e) => setDropoffDate(e.target.value)}
                min={pickupDate || new Date().toISOString().split('T')[0]}
                className="w-full rounded-2xl border border-slate-200 p-4 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                required
              />
            </label>
          </div>

          <div className="rounded-3xl bg-slate-50 p-5">
            <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-600">
              <CalendarDays className="h-4 w-4" />
              {days} rental days
            </div>
            <div className="flex items-end justify-between">
              <span className="text-slate-500">${car.price}/day</span>
              <strong className="text-3xl text-slate-950">${total}</strong>
            </div>
          </div>

          {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-sky-700 px-6 py-4 font-black text-white shadow-xl shadow-sky-900/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? 'Creating rental...' : user ? 'Confirm booking' : 'Login to book'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
