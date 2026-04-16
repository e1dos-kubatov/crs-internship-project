import React, { useState } from 'react';
import { useLang } from '../context/LangContext';
import { useNavigate } from 'react-router-dom';

const CancelBooking = () => {
  const { t } = useLang();
  const navigate = useNavigate();
  const [bookingId, setBookingId] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const booking = bookings.find(b => b.id === parseInt(bookingId) && b.customer.name.toLowerCase().includes(lastName.toLowerCase()));
    if (booking) {
      const updatedBookings = bookings.filter(b => b !== booking);
      localStorage.setItem('bookings', JSON.stringify(updatedBookings));
      setSuccess(true);
    } else {
      setError('Бронирование не найдено');
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-2xl flex items-center justify-center">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Бронирование отменено</h2>
          <p className="text-gray-600 mb-8">Ваше бронирование успешно отменено.</p>
          <button
            onClick={() => navigate('/account')}
            className="w-full bg-cwd-blue text-white font-bold py-3 px-6 rounded-xl hover:bg-opacity-90 transition-all"
          >
            В личный кабинет
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Отменить бронирование</h1>
        <p className="text-gray-600 mb-8 text-center">Введите данные своего бронирования ниже, чтобы отменить его.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Номер вашего бронирования <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
              placeholder="Введите номер вашего бронирования"
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cwd-blue focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Фамилия <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Фамилия"
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cwd-blue focus:border-transparent"
              required
            />
          </div>

          {error && (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl">
              {error}
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/account')}
              className="flex-1 bg-gray-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-gray-600 transition-all"
            >
              Дом
            </button>
            <button
              type="submit"
              className="flex-1 bg-red-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-red-700 transition-all"
            >
              Отменить бронирование
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CancelBooking;

