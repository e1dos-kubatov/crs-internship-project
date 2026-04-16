import React, { useState } from 'react';
import { Search, XCircle } from 'lucide-react';
import { rentalsApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import { useRental } from '../context/RentalContext';

const CancelBooking = () => {
  const { user } = useAuth();
  const { getMyRentals } = useRental();
  const { t } = useLang();
  const [bookingId, setBookingId] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCancel = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setStatus('');

    try {
      if (user.role === 'admin') {
        await rentalsApi.updateStatus(bookingId, 'CANCELLED');
        setStatus(t('rentalCancelled'));
      } else {
        const rentals = await getMyRentals();
        const rental = rentals.find((item) => String(item.id) === String(bookingId));
        if (!rental) {
          setError(t('rentalNotFound'));
        } else {
          setStatus(t('rentalFoundContactSupport'));
        }
      }
    } catch (cancelError) {
      setError(cancelError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent px-4 py-16">
      <div className="mx-auto max-w-xl rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-xl backdrop-blur">
        <div className="mb-8 text-center">
          <XCircle className="mx-auto mb-4 h-14 w-14 text-red-600" />
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-600">{t('rentalSupport')}</p>
          <h1 className="mt-3 text-3xl font-black text-slate-950">{t('cancelRental')}</h1>
          <p className="mt-3 text-slate-600">{t('cancelRentalLead')}</p>
        </div>

        <form onSubmit={handleCancel} className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">{t('rentalId')}</span>
            <input
              type="number"
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 p-4 outline-none focus:border-red-400 focus:ring-4 focus:ring-red-100"
              placeholder={t('enterRentalId')}
              required
            />
          </label>

          {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>}
          {status && <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{status}</div>}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-6 py-4 font-black text-white transition hover:bg-red-700 disabled:opacity-70"
          >
            <Search className="h-5 w-5" />
            {loading ? t('checking') : user.role === 'admin' ? t('cancelRental') : t('findMyRental')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CancelBooking;
