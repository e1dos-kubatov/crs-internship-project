import React, { useCallback, useEffect, useState } from 'react';
import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import { rentalsApi } from '../api/client';
import { rentalFromApi } from '../api/adapters';
import { useRental } from '../context/RentalContext';

const statusStyles = {
  active: 'bg-emerald-100 text-emerald-700',
  completed: 'bg-sky-100 text-sky-700',
  cancelled: 'bg-red-100 text-red-700',
};

const AdminBookings = () => {
  const { getAllRentals } = useRental();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadBookings = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setBookings(await getAllRentals());
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, [getAllRentals]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const updateStatus = async (id, status) => {
    setError('');
    try {
      const updated = rentalFromApi(await rentalsApi.updateStatus(id, status));
      setBookings((prev) => prev.map((booking) => booking.id === id ? updated : booking));
    } catch (updateError) {
      setError(updateError.message);
    }
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-600">Admin control</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">Rental history</h1>
        </div>
        <button onClick={loadBookings} className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 font-bold text-white">
          <RotateCcw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {error && <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>}

      <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 shadow-xl backdrop-blur">
        {loading ? (
          <p className="p-8 text-slate-500">Loading rentals...</p>
        ) : bookings.length === 0 ? (
          <p className="p-8 text-slate-500">No backend rentals yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-black uppercase tracking-wider text-slate-500">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-black uppercase tracking-wider text-slate-500">Car</th>
                  <th className="px-6 py-3 text-left text-xs font-black uppercase tracking-wider text-slate-500">User</th>
                  <th className="px-6 py-3 text-left text-xs font-black uppercase tracking-wider text-slate-500">Dates</th>
                  <th className="px-6 py-3 text-left text-xs font-black uppercase tracking-wider text-slate-500">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-black uppercase tracking-wider text-slate-500">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-black uppercase tracking-wider text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4 text-sm font-black text-slate-950">{booking.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{booking.car}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{booking.userEmail}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{booking.pickup} - {booking.dropoff}</td>
                    <td className="px-6 py-4 text-sm font-black text-slate-950">${booking.total}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-black uppercase ${statusStyles[booking.status] || 'bg-slate-100 text-slate-700'}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => updateStatus(booking.id, 'COMPLETED')} className="rounded-xl bg-emerald-600 p-2 text-white" title="Complete">
                          <CheckCircle2 className="h-4 w-4" />
                        </button>
                        <button onClick={() => updateStatus(booking.id, 'CANCELLED')} className="rounded-xl bg-red-600 p-2 text-white" title="Cancel">
                          <XCircle className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;
