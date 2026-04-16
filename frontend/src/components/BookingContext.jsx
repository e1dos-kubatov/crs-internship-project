import React, { createContext, useContext, useState } from 'react';
import { locations } from '../data/cars';
import { TIME_SLOTS } from '../Constants';

const BookingContext = createContext();

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) throw new Error('useBooking must be used within BookingProvider');
  return context;
};

export const BookingProvider = ({ children }) => {
  const [booking, setBooking] = useState({
    pickup: locations[0].id,
    dropoff: locations[1].id,
    pickupDate: '',
    pickupTime: TIME_SLOTS[0],
    dropoffDate: '',
    dropoffTime: TIME_SLOTS[10],
    carClass: 'economy',
    days: 0,
    totalPrice: 0
  });
  const [searchResults, setSearchResults] = useState([]);

  const calculateDays = (pickup, dropoff) => {
    if (!pickup || !dropoff) return 0;
    const p = new Date(pickup + 'T' + booking.pickupTime);
    const d = new Date(dropoff + 'T' + booking.dropoffTime);
    return Math.max(1, Math.ceil((d - p) / (1000 * 60 * 60 * 24)));
  };

  const updateBooking = (updates) => {
    setBooking(prev => ({ ...prev, ...updates }));
  };

  const searchCars = (carsList) => {
    const days = calculateDays(booking.pickupDate, booking.dropoffDate);
    setBooking(prev => ({ ...prev, days }));
    // Fake filter
    const results = carsList.filter(car => car.price <= 150);
    setSearchResults(results);
  };

  const calcPrice = (carPrice) => booking.days * carPrice;

  return (
    <BookingContext.Provider value={{ booking, updateBooking, searchCars, searchResults, calcPrice, TIME_SLOTS, locations }}>
      {children}
    </BookingContext.Provider>
  );
};

