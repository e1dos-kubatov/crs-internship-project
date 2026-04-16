import React, { useEffect, useState } from 'react';
import { CalendarClock, CarFront, DollarSign, LogOut } from 'lucide-react';
import { Link, Route, Routes } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import { useRental } from '../context/RentalContext';
import ManageCars from './ManageCars';

const ClientDashboard = () => {
  const { user, logout } = useAuth();
  const { getMyRentals } = useRental();
  const { t } = useLang();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        setBookings(await getMyRentals());
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [getMyRentals]);

  const total = bookings.reduce((sum, booking) => sum + Number(booking.total || 0), 0);

  return (
    <div className="min-h-screen bg-transparent">
      <header className="border-b border-white/70 bg-white/80 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-6 sm:px-6 lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-sky-700">{t('partnerDashboard')}</p>
            <h1 className="mt-2 text-3xl font-black text-slate-950">{t('myAccount')}</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-600">{t('hi')}, {user.name}</span>
            <button onClick={logout} className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-4 py-2 font-bold text-white transition hover:bg-red-700">
              <LogOut className="h-4 w-4" />
              {t('logout')}
            </button>
          </div>
        </div>
      </header>

      <nav className="border-b border-white/70 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl gap-6 overflow-x-auto px-4 sm:px-6 lg:px-8">
          <Link to="/account" className="border-b-2 border-cwd-blue py-4 text-base font-black text-slate-950">
            {t('profile')}
          </Link>
          <Link to="/account/bookings" className="border-b-2 border-transparent py-4 text-base font-bold text-slate-600 hover:text-slate-950">
            {t('myRentals')} ({bookings.length})
          </Link>
          <Link to="/account/cars" className="border-b-2 border-transparent py-4 text-base font-bold text-orange-700 hover:text-orange-800">
            {t('addCar')}
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {error && <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>}
        <Routes>
          <Route path="/bookings" element={
            <div className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-xl backdrop-blur">
              <h2 className="mb-6 text-2xl font-black text-slate-950">{t('backendRentals')}</h2>
              {loading ? (
                <p className="text-slate-500">{t('loadingRentals')}</p>
              ) : bookings.length === 0 ? (
                <p className="text-slate-500">{t('noRentals')}</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider text-slate-500">{t('car')}</th>
                        <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider text-slate-500">{t('dates')}</th>
                        <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider text-slate-500">{t('total')}</th>
                        <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider text-slate-500">{t('status')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {bookings.map((booking) => (
                        <tr key={booking.id}>
                          <td className="px-4 py-4 text-sm font-bold text-slate-950">{booking.car}</td>
                          <td className="px-4 py-4 text-sm text-slate-700">{booking.pickup} - {booking.dropoff}</td>
                          <td className="px-4 py-4 text-sm font-black text-slate-950">${booking.total}</td>
                          <td className="px-4 py-4">
                            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black uppercase text-emerald-700">{booking.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          } />
          <Route path="/cars" element={<ManageCars />} />
          <Route path="/" element={
            <div>
              <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="rounded-[2rem] bg-white/85 p-6 shadow-xl backdrop-blur">
                  <CalendarClock className="mb-4 h-7 w-7 text-orange-600" />
                  <dt className="text-sm font-bold text-slate-500">{t('rentals')}</dt>
                  <dd className="mt-2 text-4xl font-black text-slate-950">{bookings.length}</dd>
                </div>
                <div className="rounded-[2rem] bg-white/85 p-6 shadow-xl backdrop-blur">
                  <CarFront className="mb-4 h-7 w-7 text-sky-700" />
                  <dt className="text-sm font-bold text-slate-500">{t('activeRentals')}</dt>
                  <dd className="mt-2 text-4xl font-black text-slate-950">{bookings.filter((booking) => booking.status === 'active').length}</dd>
                </div>
                <div className="rounded-[2rem] bg-white/85 p-6 shadow-xl backdrop-blur">
                  <DollarSign className="mb-4 h-7 w-7 text-emerald-600" />
                  <dt className="text-sm font-bold text-slate-500">{t('totalSpend')}</dt>
                  <dd className="mt-2 text-4xl font-black text-slate-950">${total}</dd>
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-xl backdrop-blur">
                <h3 className="mb-5 text-2xl font-black text-slate-950">{t('profile')}</h3>
                <div className="grid gap-4 text-slate-700 sm:grid-cols-2">
                  <p><strong>{t('name')}:</strong> {user.name}</p>
                  <p><strong>{t('email')}:</strong> {user.email || t('notSet')}</p>
                  <p><strong>{t('role')}:</strong> {user.role}</p>
                  <p><strong>{t('provider')}:</strong> {user.provider || 'LOCAL'}</p>
                </div>
              </div>
            </div>
          } />
        </Routes>
      </main>
    </div>
  );
};

export default ClientDashboard;
