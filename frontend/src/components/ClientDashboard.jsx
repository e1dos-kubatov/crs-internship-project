import React, { useEffect, useState } from 'react';
import { ArrowRight, BadgeCheck, CalendarClock, CarFront, DollarSign, LifeBuoy, LogOut, MapPin, ShieldCheck, Sparkles, UserRound } from 'lucide-react';
import { Link, NavLink, Route, Routes } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import { useRental } from '../context/RentalContext';
import { paymentsApi } from '../api/client';
import { paymentFromApi } from '../api/adapters';
import ManageCars from './ManageCars';
import ProfilePhoto from './ProfilePhoto';

const ClientDashboard = () => {
  const { user, logout } = useAuth();
  const { getMyRentals } = useRental();
  const { t } = useLang();
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [loadedBookings, loadedPayments] = await Promise.all([
          getMyRentals(),
          paymentsApi.mine(),
        ]);
        setBookings(loadedBookings);
        setPayments(loadedPayments.map(paymentFromApi));
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [getMyRentals]);

  const total = bookings.reduce((sum, booking) => sum + Number(booking.total || 0), 0);
  const activeRentals = bookings.filter((booking) => String(booking.status || '').toLowerCase() === 'active').length;
  const latestRental = bookings[0];
  const paymentByRentalId = payments.reduce((map, payment) => {
    map[String(payment.rentalId)] = payment;
    return map;
  }, {});

  const statCards = [
    { label: t('rentals'), value: bookings.length, icon: CalendarClock, className: 'from-orange-500 to-rose-700' },
    { label: t('activeRentals'), value: activeRentals, icon: CarFront, className: 'from-cwd-blue to-sky-900' },
    { label: t('totalSpend'), value: `$${total}`, icon: DollarSign, className: 'from-emerald-500 to-teal-900' },
  ];

  const profileItems = [
    { label: t('name'), value: user.name, icon: UserRound },
    { label: t('email'), value: user.email || t('notSet'), icon: BadgeCheck },
    { label: t('role'), value: user.role, icon: ShieldCheck },
    { label: t('provider'), value: user.provider || 'LOCAL', icon: Sparkles },
  ];

  const navClass = ({ isActive }) => `rounded-2xl px-5 py-3 text-sm font-black transition ${isActive ? 'bg-slate-950 text-white shadow-lg' : 'bg-white/70 text-slate-600 hover:bg-white hover:text-slate-950'}`;

  return (
    <div className="min-h-screen bg-transparent">
      <header className="relative overflow-hidden border-b border-white/70 bg-slate-950 text-white shadow-xl">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=85)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-cwd-blue/70" />
        <div className="relative mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-4 py-10 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-sky-100 backdrop-blur">
              <BadgeCheck className="h-4 w-4" />
              {t('verifiedPartner')}
            </p>
            <h1 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">{t('myAccount')}</h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-200">{t('dashboardLead')}</p>
          </div>
          <div className="rounded-[2rem] bg-white/10 p-5 text-right backdrop-blur">
            <span className="block text-sm font-bold text-slate-200">{t('hi')}, {user.name}</span>
            <button onClick={logout} className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-red-600 px-5 py-3 font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-red-700">
              <LogOut className="h-4 w-4" />
              {t('logout')}
            </button>
          </div>
        </div>
      </header>

      <nav className="border-b border-white/70 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl gap-3 overflow-x-auto px-4 py-4 sm:px-6 lg:px-8">
          <NavLink end to="/account" className={navClass}>
            {t('profile')}
          </NavLink>
          <NavLink to="/account/bookings" className={navClass}>
            {t('myRentals')} ({bookings.length})
          </NavLink>
          <NavLink to="/account/cars" className={navClass}>
            {t('addCar')}
          </NavLink>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {error && <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>}
        <Routes>
          <Route path="/bookings" element={
            <div className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-xl backdrop-blur md:p-8">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.25em] text-cwd-blue">{t('recentActivity')}</p>
                  <h2 className="mt-2 text-3xl font-black text-slate-950">{t('backendRentals')}</h2>
                </div>
                <Link to="/cars" className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white">
                  {t('planTrip')}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              {loading ? (
                <p className="text-slate-500">{t('loadingRentals')}</p>
              ) : bookings.length === 0 ? (
                <div className="rounded-[2rem] bg-slate-50 p-8 text-center">
                  <CarFront className="mx-auto mb-4 h-12 w-12 text-slate-300" />
                  <p className="text-slate-500">{t('noRentals')}</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider text-slate-500">{t('car')}</th>
                        <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider text-slate-500">{t('dates')}</th>
                        <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider text-slate-500">{t('total')}</th>
                        <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider text-slate-500">{t('status')}</th>
                        <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider text-slate-500">{t('payment')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {bookings.map((booking) => {
                        const payment = paymentByRentalId[String(booking.id)];
                        const paid = ['succeeded', 'refunded', 'partially_refunded'].includes(payment?.status);

                        return (
                          <tr key={booking.id}>
                            <td className="px-4 py-4 text-sm font-bold text-slate-950">{booking.car}</td>
                            <td className="px-4 py-4 text-sm text-slate-700">{booking.pickup} - {booking.dropoff}</td>
                            <td className="px-4 py-4 text-sm font-black text-slate-950">${booking.total}</td>
                            <td className="px-4 py-4">
                              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black uppercase text-emerald-700">{booking.status}</span>
                            </td>
                            <td className="px-4 py-4">
                              {paid ? (
                                <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-black uppercase text-cyan-700">{payment.status}</span>
                              ) : (
                                <Link to={`/payment/${booking.id}`} className="rounded-lg bg-slate-950 px-3 py-2 text-xs font-black text-white">
                                  {t('payNow')}
                                </Link>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          } />
          <Route path="/cars" element={<ManageCars />} />
          <Route path="/" element={
            <div>
              <div className="mx-auto mb-8 grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-3">
                {statCards.map((card) => {
                  const Icon = card.icon;
                  return (
                    <div key={card.label} className={`rounded-[1.35rem] bg-gradient-to-br ${card.className} p-4 text-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl`}>
                      <Icon className="mb-4 h-6 w-6 text-white/90" />
                      <dt className="text-[11px] font-black uppercase tracking-[0.22em] text-white/70">{card.label}</dt>
                      <dd className="mt-1.5 text-3xl font-black">{card.value}</dd>
                    </div>
                  );
                })}
              </div>

              <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-xl backdrop-blur">
                  <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:items-center">
                    <ProfilePhoto user={user} />
                    <div>
                      <p className="text-sm font-black uppercase tracking-[0.25em] text-slate-400">{t('profileDetails')}</p>
                      <h3 className="text-3xl font-black text-slate-950">{t('profile')}</h3>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {profileItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.label} className="rounded-3xl bg-slate-50 p-5">
                          <Icon className="mb-3 h-5 w-5 text-cwd-blue" />
                          <p className="text-xs font-black uppercase tracking-widest text-slate-400">{item.label}</p>
                          <p className="mt-2 break-words font-black text-slate-800">{item.value}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <aside className="space-y-5">
                  <div className="rounded-[2rem] bg-slate-950 p-7 text-white shadow-xl">
                    <ShieldCheck className="mb-5 h-9 w-9 text-sky-300" />
                    <h3 className="text-2xl font-black">{t('accountSecurity')}</h3>
                    <p className="mt-3 leading-7 text-slate-300">{t('accountSecurityText')}</p>
                  </div>
                  <div className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-xl backdrop-blur">
                    <h3 className="mb-4 text-xl font-black text-slate-950">{t('quickActions')}</h3>
                    <div className="grid gap-3">
                      <Link to="/cars" className="flex items-center justify-between rounded-2xl bg-orange-50 px-4 py-3 font-black text-orange-800">
                        {t('planTrip')} <CarFront className="h-4 w-4" />
                      </Link>
                      <Link to="/offices" className="flex items-center justify-between rounded-2xl bg-sky-50 px-4 py-3 font-black text-cwd-blue">
                        {t('exploreOffices')} <MapPin className="h-4 w-4" />
                      </Link>
                      <Link to="/cancel-booking" className="flex items-center justify-between rounded-2xl bg-red-50 px-4 py-3 font-black text-red-700">
                        {t('cancelHelp')} <LifeBuoy className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                  <div className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-xl backdrop-blur">
                    <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">{t('recentActivity')}</p>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {latestRental ? `${latestRental.car} · ${latestRental.pickup} - ${latestRental.dropoff}` : t('noActivity')}
                    </p>
                  </div>
                </aside>
              </div>
            </div>
          } />
        </Routes>
      </main>
    </div>
  );
};

export default ClientDashboard;
