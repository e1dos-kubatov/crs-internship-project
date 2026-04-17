import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { cars as fallbackCars } from '../data/cars';
import { carsApi, ordersApi, paymentsApi, rentalsApi } from '../api/client';
import { carFromApi, carToApi, paymentFromApi, rentalFromApi } from '../api/adapters';

const RentalContext = createContext();

export const useRental = () => useContext(RentalContext);

const normalizeFallbackCar = (car) => ({
  ...car,
  brand: car.model?.en?.split(' ')[0] || 'Car',
  modelName: car.model?.en || 'Model',
  year: car.year || 2024,
  vin: car.vin || `DEMO${String(car.id).padStart(8, '0')}`,
  pricePerDay: car.price,
  fuel: car.fuel || 'gas',
  transmission: (car.transmission || 'Auto').toLowerCase(),
  images: [car.img],
  available: true,
  status: 'APPROVED',
});

const RentalProvider = ({ children }) => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [filters, setFilters] = useState({
    price: [0, 500],
    transmission: [],
    fuel: [],
    sort: 'price-asc',
    location: '',
    pickupOffice: '',
    pickupDate: '',
    dropoffDate: '',
    query: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCar, setSelectedCar] = useState(null);
  const [booking, setBooking] = useState({
    dates: { pickup: null, dropoff: null },
    total: 0,
  });
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('favorites') || '[]'));

  const loadCars = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const apiCars = await carsApi.list();
      const mappedCars = apiCars.map(carFromApi);
      setCars(mappedCars);
      setFilteredCars(mappedCars);
    } catch (loadError) {
      const demoCars = fallbackCars.map(normalizeFallbackCar);
      setCars(demoCars);
      setFilteredCars(demoCars);
      setError(`${loadError.message}. Showing demo cars until the backend is running.`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCars();
  }, [loadCars]);

  const applyFilters = useCallback((carsList = cars) => {
    let result = [...carsList];

    result = result.filter((car) => car.price >= filters.price[0] && car.price <= filters.price[1]);

    if (filters.query) {
      const query = filters.query.toLowerCase();
      result = result.filter((car) => car.model.en.toLowerCase().includes(query) || car.description.toLowerCase().includes(query));
    }

    ['transmission', 'fuel'].forEach((type) => {
      if (filters[type].length > 0) {
        result = result.filter((car) => filters[type].includes(String(car[type]).toLowerCase()));
      }
    });

    if (filters.sort === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sort === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (filters.sort === 'newest') {
      result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    setFilteredCars(result);
  }, [cars, filters]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const toggleFavorite = (carId) => {
    setFavorites((prev) =>
      prev.includes(carId)
        ? prev.filter((id) => id !== carId)
        : [...prev, carId]
    );
  };

  const calculateTotal = () => {
    if (!selectedCar || !booking.dates.pickup || !booking.dates.dropoff) return 0;
    const days = Math.max(1, Math.ceil((new Date(booking.dates.dropoff) - new Date(booking.dates.pickup)) / (1000 * 60 * 60 * 24)));
    return days * selectedCar.price;
  };

  const createRental = useCallback(async ({ carId, startDate, endDate }) => {
    const rental = await rentalsApi.create({ carId, startDate, endDate });
    return rentalFromApi(rental);
  }, []);

  const getMyRentals = useCallback(async () => {
    const rentals = await rentalsApi.mine();
    return rentals.map(rentalFromApi);
  }, []);

  const getAllRentals = useCallback(async () => {
    const rentals = await rentalsApi.all();
    return rentals.map(rentalFromApi);
  }, []);

  const getRentalPayments = useCallback(async (rentalId) => {
    const payments = await paymentsApi.byRental(rentalId);
    return payments.map(paymentFromApi);
  }, []);

  const getMyCars = useCallback(async () => {
    const apiCars = await carsApi.mine();
    return apiCars.map(carFromApi);
  }, []);

  const getAdminCars = useCallback(async () => {
    const apiCars = await carsApi.adminList();
    return apiCars.map(carFromApi);
  }, []);

  const saveCar = useCallback(async (car, editingId = null) => {
    const payload = carToApi(car);
    const saved = editingId ? await carsApi.update(editingId, payload) : await carsApi.create(payload);
    await loadCars();
    return carFromApi(saved);
  }, [loadCars]);

  const createOrder = useCallback(async (car) => {
    const saved = await ordersApi.create(carToApi(car));
    await loadCars();
    return saved;
  }, [loadCars]);

  const deleteCar = useCallback(async (id) => {
    await carsApi.remove(id);
    await loadCars();
  }, [loadCars]);

  const value = {
    cars,
    setCars,
    filteredCars,
    filters,
    updateFilters,
    loading,
    error,
    selectedCar,
    setSelectedCar,
    booking,
    setBooking,
    calculateTotal,
    toggleFavorite,
    favorites,
    refreshCars: loadCars,
    createRental,
    getMyRentals,
    getAllRentals,
    getMyCars,
    getAdminCars,
    getRentalPayments,
    saveCar,
    createOrder,
    deleteCar,
  };

  return (
    <RentalContext.Provider value={value}>
      {children}
    </RentalContext.Provider>
  );
};

export default RentalProvider;
