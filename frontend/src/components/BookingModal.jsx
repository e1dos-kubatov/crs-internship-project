import React, { useState, useEffect } from 'react';
import { useRental } from '../context/RentalContext';

const BookingModal = ({ car, onClose }) => {
  const { booking, setBooking, calculateTotal } = useRental();
  const [pickupDate, setPickupDate] = useState('');
  const [dropoffDate, setDropoffDate] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setPickupDate(today);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDropoffDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  const days = pickupDate && dropoffDate ? Math.ceil((new Date(dropoffDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24)) : 1;
  const total = car.price * days;

  const handleSubmit = (e) => {
    e.preventDefault();
    const bookingData = {
      id: Date.now(),
      carId: car.id,
      car: car.model.en,
      dates: { pickup: pickupDate, dropoff: dropoffDate },
      customer: { name, phone },
      total,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setBooking(bookingData);
    
    // Save to global bookings
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    bookings.push(bookingData);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-12 max-w-md w-full text-center shadow-2xl animate-pulse">
          <div className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Booking Confirmed!</h3>
          <p className="text-gray-600 mb-8">Total: ${total}</p>
          <p className="text-sm text-gray-500">Check your email for confirmation</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 md:p-12 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Book {car.model.en}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <img src={car.img} alt={car.model.en} className="w-full h-48 object-cover rounded-2xl mb-4" />
          </div>
          
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Pickup Date</label>
            <input
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cwd-blue focus:border-transparent"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Dropoff Date</label>
            <input
              type="date"
              value={dropoffDate}
              onChange={(e) => setDropoffDate(e.target.value)}
              min={pickupDate || new Date().toISOString().split('T')[0]}
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cwd-blue focus:border-transparent"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cwd-blue focus:border-transparent"
              placeholder="John Doe"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cwd-blue focus:border-transparent"
              placeholder="+996..."
              required
            />
          </div>

          <div className="pt-4 border-t border-gray-200 space-y-3">
            <div className="flex justify-between text-lg font-bold">
              <span>Total ({days} days):</span>
              <span>${total}</span>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-8 rounded-2xl text-lg shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1"
            >
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;

