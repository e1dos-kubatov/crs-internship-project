import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRental } from '../context/RentalContext';
import ManageCars from './ManageCars';
import AdminBookings from './AdminBookings';
import AdminUsers from './AdminUsers';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { cars } = useRental();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Панель администратора</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Привет, {user.name}</span>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold transition-colors"
              >
                Выход
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <Link to="/admin/cars" className="text-lg font-medium text-gray-900 py-4 px-1 border-b-2 border-cwd-blue">
              Автомобили ({cars.length})
            </Link>
            <Link to="/admin/bookings" className="text-lg font-medium text-gray-700 hover:text-gray-900 py-4 px-1 border-b-2 border-transparent">
              Бронирования ({JSON.parse(localStorage.getItem('bookings') || '[]').length})
            </Link>
            <Link to="/admin/users" className="text-lg font-medium text-gray-700 hover:text-gray-900 py-4 px-1 border-b-2 border-transparent">
              Пользователи ({JSON.parse(localStorage.getItem('users') || '[]').length})
            </Link>
          </div>
        </div>
      </nav>

      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/cars" element={<ManageCars />} />
            <Route path="/" element={
              <div className="px-4 py-6 sm:px-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white overflow-hidden shadow rounded-lg p-6">
                    <dt className="text-sm font-medium text-gray-500 mb-2">Автомобили</dt>
                    <dd className="text-3xl font-bold text-gray-900">{cars.length}</dd>
                  </div>
                  <div className="bg-white overflow-hidden shadow rounded-lg p-6">
                    <dt className="text-sm font-medium text-gray-500 mb-2">Бронирования</dt>
                    <dd className="text-3xl font-bold text-gray-900">{JSON.parse(localStorage.getItem('bookings') || '[]').length}</dd>
                  </div>
                  <div className="bg-white overflow-hidden shadow rounded-lg p-6">
                    <dt className="text-sm font-medium text-gray-500 mb-2">Пользователи</dt>
                    <dd className="text-3xl font-bold text-gray-900">{JSON.parse(localStorage.getItem('users') || '[]').length || 1}</dd>
                  </div>
                </div>
              </div>
            } />
<Route path="/bookings" element={<AdminBookings />} />
            <Route path="/users" element={<AdminUsers />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;


