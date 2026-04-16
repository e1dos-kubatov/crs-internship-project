import React from 'react';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ClientDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Fake bookings data
  const bookings = [
    {
      id: 1,
      car: 'Toyota Camry',
      pickup: '2024-10-01',
      dropoff: '2024-10-05',
      total: '150$',
      status: 'Завершено'
    },
    {
      id: 2,
      car: 'Honda Civic',
      pickup: '2024-10-10',
      dropoff: '2024-10-12',
      total: '80$',
      status: 'Активно'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Личный кабинет</h1>
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
            <Link to="/account" className="text-lg font-medium text-gray-900 py-4 px-1 border-b-2 border-cwd-blue">
              Профиль
            </Link>
            <Link to="/account/bookings" className="text-lg font-medium text-gray-700 hover:text-gray-900 py-4 px-1 border-b-2 border-transparent">
              Мои бронирования ({bookings.length})
            </Link>
            <Link to="/cancel-booking" className="text-lg font-medium text-red-600 hover:text-red-700 py-4 px-1 border-b-2 border-transparent font-bold">
              Отменить бронирование
            </Link>
          </div>
        </div>
      </nav>

      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/bookings" element={
              <div className="px-4 py-6 sm:px-0">
                <div className="flow-root">
                  <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead>
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Автомобиль</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Даты</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Стоимость</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {bookings.map((booking) => (
                            <tr key={booking.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.car}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {booking.pickup} - {booking.dropoff}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.total}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  {booking.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            } />
            <Route path="/" element={
              <div className="px-4 py-6 sm:px-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white overflow-hidden shadow rounded-lg p-6">
                    <dt className="text-sm font-medium text-gray-500 mb-2">Бронирования</dt>
                    <dd className="text-3xl font-bold text-gray-900">{bookings.length}</dd>
                  </div>
                  <div className="bg-white overflow-hidden shadow rounded-lg p-6">
                    <dt className="text-sm font-medium text-gray-500 mb-2">Автомобилей арендованно</dt>
                    <dd className="text-3xl font-bold text-gray-900">2</dd>
                  </div>
                  <div className="bg-white overflow-hidden shadow rounded-lg p-6">
                    <dt className="text-sm font-medium text-gray-500 mb-2">Общая сумма</dt>
                    <dd className="text-3xl font-bold text-gray-900">230$</dd>
                  </div>
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Информация профиля</h3>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <p><strong>Имя:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email || 'Не указан'}</p>
                    <p><strong>Телефон:</strong> {user.phone || 'Не указан'}</p>
                    <p><strong>Дата регистрации:</strong> {user.registered ? new Date(user.registered).toLocaleDateString('ru-RU') : 'Недавно'}</p>
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

export default ClientDashboard;

