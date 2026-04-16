import React, { useEffect, useState } from 'react';
import { CarFront, ClipboardList, LogOut, UsersRound } from 'lucide-react';
import { Link, Route, Routes } from 'react-router-dom';
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

  return (
    <div className="min-h-screen bg-transparent">
      <header className="border-b border-white/70 bg-white/80 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-6 sm:px-6 lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-600">{t('adminWorkspace')}</p>
            <h1 className="mt-2 text-3xl font-black text-slate-950">{t('controlCenter')}</h1>
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
          <Link to="/admin/cars" className="border-b-2 border-cwd-blue py-4 text-base font-black text-slate-950">
            {t('cars')} ({stats.cars})
          </Link>
          <Link to="/admin/bookings" className="border-b-2 border-transparent py-4 text-base font-bold text-slate-600 hover:text-slate-950">
            {t('rentals')} ({stats.bookings})
          </Link>
          <Link to="/admin/users" className="border-b-2 border-transparent py-4 text-base font-bold text-slate-600 hover:text-slate-950">
            {t('users')} ({stats.users})
          </Link>
        </div>
      </nav>

      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/cars" element={<ManageCars />} />
            <Route path="/bookings" element={<AdminBookings />} />
            <Route path="/users" element={<AdminUsers />} />
            <Route path="/" element={
              <div className="px-4 py-6 sm:px-0">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div className="rounded-[2rem] bg-white/85 p-6 shadow-xl backdrop-blur">
                    <CarFront className="mb-4 h-8 w-8 text-orange-600" />
                    <dt className="text-sm font-bold text-slate-500">{t('cars')}</dt>
                    <dd className="mt-2 text-4xl font-black text-slate-950">{stats.cars}</dd>
                  </div>
                  <div className="rounded-[2rem] bg-white/85 p-6 shadow-xl backdrop-blur">
                    <ClipboardList className="mb-4 h-8 w-8 text-sky-700" />
                    <dt className="text-sm font-bold text-slate-500">{t('rentals')}</dt>
                    <dd className="mt-2 text-4xl font-black text-slate-950">{stats.bookings}</dd>
                  </div>
                  <div className="rounded-[2rem] bg-white/85 p-6 shadow-xl backdrop-blur">
                    <UsersRound className="mb-4 h-8 w-8 text-emerald-600" />
                    <dt className="text-sm font-bold text-slate-500">{t('users')}</dt>
                    <dd className="mt-2 text-4xl font-black text-slate-950">{stats.users}</dd>
                  </div>
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
