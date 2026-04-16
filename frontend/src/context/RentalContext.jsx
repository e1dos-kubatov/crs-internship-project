import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cars as rawCars } from '../data/cars';

const RentalContext = createContext();

export const useRental = () => useContext(RentalContext);

const RentalProvider = ({ children }) => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [filters, setFilters] = useState({
    price: [0, 200],
    type: [],
    transmission: [],
    fuel: [],
    sort: 'price-asc',
    location: '',
    pickupOffice: '',
    pickupDate: '',
    dropoffDate: ''
  });
  const [loading, setLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState(null);
  const [booking, setBooking] = useState({
    dates: { pickup: null, dropoff: null },
    total: 0
  });
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const savedCars = JSON.parse(localStorage.getItem('cars') || '[]');
    if (savedCars.length > 0) {
      setCars(savedCars);
      setFilteredCars(savedCars);
    } else {
      import('../data/cars').then(module => {
        const rawCars = module.cars;
        setCars(rawCars);
        setFilteredCars(rawCars);
        localStorage.setItem('cars', JSON.stringify(rawCars));
      });
    }
    setLoading(false);
  }, []);

  const applyFilters = useCallback((carsList = cars) => {
    let result = [...carsList];

    // Price filter
    result = result.filter(car => car.price >= filters.price[0] && car.price <= filters.price[1]);
    
    // Type, transmission, fuel filters
    ['type', 'transmission', 'fuel'].forEach(type => {
      if (filters[type].length > 0) {
        result = result.filter(car => filters[type].includes(car[type]));
      }
    });

    // Search dates - calculate days for display, assume all cars active/available
    if (filters.pickupDate && filters.dropoffDate) {
      const days = Math.ceil((new Date(filters.dropoffDate) - new Date(filters.pickupDate)) / (1000 * 60 * 60 * 24));
      console.log(`Search ${days} days: ${filters.pickupDate} to ${filters.dropoffDate}`);
    }

    // Sort
    if (filters.sort === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sort === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    }

    setFilteredCars(result);
  }, [cars, filters]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const toggleFavorite = (carId) => {
    setFavorites(prev => 
      prev.includes(carId) 
        ? prev.filter(id => id !== carId)
        : [...prev, carId]
    );
  };

  const calculateTotal = () => {
    if (!selectedCar || !booking.dates.pickup || !booking.dates.dropoff) return 0;
    const days = Math.ceil((new Date(booking.dates.dropoff) - new Date(booking.dates.pickup)) / (1000 * 60 * 60 * 24));
    return days * selectedCar.price;
  };

  useEffect(() => {
    localStorage.setItem('cars', JSON.stringify(cars));
  }, [cars]);

  const value = {
    cars, setCars, filteredCars, filters, updateFilters, loading, selectedCar, setSelectedCar,
    booking, setBooking, calculateTotal, toggleFavorite, favorites
  };

  return (
    <RentalContext.Provider value={value}>
      {children}
    </RentalContext.Provider>
  );
};

export default RentalProvider;

