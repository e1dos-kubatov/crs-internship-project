import React, { useEffect, useState } from 'react';
import { ArrowRight, BadgeCheck, CarFront, ClipboardList, LogOut, ShieldCheck, Sparkles, UsersRound } from 'lucide-react';
import { Link, NavLink, Route, Routes } from 'react-router-dom';
import { adminApi, carsApi, rentalsApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import ManageCars from './ManageCars';
import AdminBookings from './AdminBookings';
import AdminUsers from './AdminUsers';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { t } = useLang();
  const [stats, setStats] = useState({ cars: 0, bookings: 0, users: 0 });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [cars, bookings, users] = await Promise.all([
          carsApi.adminList(),
          rentalsApi.all(),
          adminApi.users(),
        ]);
        setStats({ cars: cars.length, bookings: bookings.length, users: users.length });
      } catch {
        setStats((prev) => prev);
      }
    };
    loadStats();
  }, []);

  const cards = [
    { label: t('cars'), value: stats.cars, icon: CarFront, className: 'from-orange-500 to-rose-700', to: '/admin/cars', cta: t('reviewCars') },
    { label: t('rentals'), value: stats.bookings, icon: ClipboardList, className: 'from-cwd-blue to-sky-900', to: '/admin/bookings', cta: t('reviewRentals') },
    { label: t('users'), value: stats.users, icon: UsersRound, className: 'from-emerald-500 to-teal-900', to: '/admin/users', cta: t('reviewUsers') },
  ];

  const controls = [
    { title: t('fleetControl'), text: t('fleetControlText'), icon: CarFront, to: '/admin/cars' },
    { title: t('rentalHistory'), text: t('rentalControlText'), icon: ClipboardList, to: '/admin/bookings' },
    { title: t('backendUsers'), text: t('userControlText'), icon: UsersRound, to: '/admin/users' },
  ];

  const navClass = ({ isActive }) => `rounded-2xl px-5 py-3 text-sm font-black transition ${isActive ? 'bg-slate-950 text-white shadow-lg' : 'bg-white/70 text-slate-600 hover:bg-white hover:text-slate-950'}`;

  return (
    <div className="min-h-screen bg-transparent">
      <header className="relative overflow-hidden border-b border-white/70 bg-slate-950 text-white shadow-xl">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1600&q=85)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-orange-950/75" />
        <div className="relative mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-4 py-10 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-orange-100 backdrop-blur">
              <BadgeCheck className="h-4 w-4" />
              {t('verifiedAdmin')}
            </p>
            <h1 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">{t('controlCenter')}</h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-200">{t('adminDashboardLead')}</p>
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
          <NavLink to="/admin/cars" className={navClass}>
            {t('cars')} ({stats.cars})
          </NavLink>
          <NavLink to="/admin/bookings" className={navClass}>
            {t('rentals')} ({stats.bookings})
          </NavLink>
          <NavLink to="/admin/users" className={navClass}>
            {t('users')} ({stats.users})
          </NavLink>
        </div>
      </nav>

      <main>
        <div className="mx-auto max-w-7xl py-8 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/cars" element={<ManageCars />} />
            <Route path="/bookings" element={<AdminBookings />} />
            <Route path="/users" element={<AdminUsers />} />
            <Route path="/" element={
              <div className="px-4 sm:px-0">
                <div className="mx-auto mb-8 grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-3">
                  {cards.map((card) => {
                    const Icon = card.icon;
                    return (
                      <Link key={card.label} to={card.to} className={`group rounded-[1.35rem] bg-gradient-to-br ${card.className} p-4 text-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl`}>
                        <Icon className="mb-4 h-6 w-6 text-white/90" />
                        <dt className="text-[11px] font-black uppercase tracking-[0.22em] text-white/70">{card.label}</dt>
                        <dd className="mt-1.5 text-3xl font-black">{card.value}</dd>
                        <span className="mt-3 inline-flex items-center gap-2 text-[11px] font-black text-white/80 transition group-hover:text-white">
                          {card.cta}
                          <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </Link>
                    );
                  })}
                </div>

                <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                  <section className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-xl backdrop-blur">
                    <p className="text-sm font-black uppercase tracking-[0.25em] text-orange-600">{t('adminOverview')}</p>
                    <h2 className="mt-2 text-3xl font-black text-slate-950">{t('commandShortcuts')}</h2>
                    <div className="mt-6 grid gap-4">
                      {controls.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link key={item.title} to={item.to} className="group flex items-start gap-4 rounded-3xl bg-slate-50 p-5 transition hover:bg-sky-50">
                            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-cwd-blue shadow-sm">
                              <Icon className="h-6 w-6" />
                            </span>
                            <span className="flex-1">
                              <span className="block text-lg font-black text-slate-950">{item.title}</span>
                              <span className="mt-1 block text-sm leading-6 text-slate-600">{item.text}</span>
                            </span>
                            <ArrowRight className="mt-2 h-5 w-5 text-slate-300 transition group-hover:text-cwd-blue" />
                          </Link>
                        );
                      })}
                    </div>
                  </section>

                  <aside className="space-y-5">
                    <div className="rounded-[2rem] bg-slate-950 p-7 text-white shadow-xl">
                      <ShieldCheck className="mb-5 h-9 w-9 text-orange-300" />
                      <h3 className="text-2xl font-black">{t('platformHealth')}</h3>
                      <p className="mt-3 leading-7 text-slate-300">{t('platformHealthText')}</p>
                    </div>
                    <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 shadow-xl backdrop-blur">
                      <div className="relative min-h-52 p-6 text-white">
                        <div
                          className="absolute inset-0 bg-cover bg-center"
                          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=85)' }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent" />
                        <div className="relative flex min-h-40 flex-col justify-end">
                          <Sparkles className="mb-3 h-8 w-8 text-orange-200" />
                          <p className="text-2xl font-black">{t('adminWorkspace')}</p>
                        </div>
                      </div>
                    </div>
                  </aside>
                </div>
              </div>
            } />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
