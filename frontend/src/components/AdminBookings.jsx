import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const savedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    setBookings(savedBookings);
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Бронирования</h1>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Автомобиль</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Клиент</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Даты</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Сумма</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map((booking, index) => (
              <tr key={booking.id || index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.car?.model?.en || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.customer?.name || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {booking.dates?.pickup} - {booking.dates?.dropoff}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">${booking.total}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    booking.status === 'approved' ? 'bg-green-100 text-green-800' :
                    booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.status === 'pending' ? 'Ожидает' : booking.status === 'approved' ? 'Подтверждено' : 'Отклонено'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  {booking.status === 'pending' && (
                    <>
                      <button
                        onClick={() => {
                          const updated = bookings.map(b => b.id === booking.id ? {...b, status: 'approved'} : b);
                          localStorage.setItem('bookings', JSON.stringify(updated));
                          setBookings(updated);
                        }}
                        className="bg-green-600 text-white px-4 py-1 rounded-lg hover:bg-green-700 text-xs font-bold"
                      >
                        Подтвердить
                      </button>
                      <button
                        onClick={() => {
                          const updated = bookings.map(b => b.id === booking.id ? {...b, status: 'rejected'} : b);
                          localStorage.setItem('bookings', JSON.stringify(updated));
                          setBookings(updated);
                        }}
                        className="bg-red-600 text-white px-4 py-1 rounded-lg hover:bg-red-700 text-xs font-bold"
                      >
                        Отклонить
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {bookings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Нет бронирований</p>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;

