import React, { useState, useEffect } from 'react';
import { useRental } from '../context/RentalContext';
import { useAuth } from '../context/AuthContext';
import CarCard from './CarCard';

const ManageCars = () => {
  const { cars, setCars, filteredCars, updateFilters } = useRental();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [newCar, setNewCar] = useState({
    model: { en: '', ru: '', kg: '' },
    price: '',
    transmission: 'Auto',
    seats: 5,
    img: '',
    type: 'sedan',
    fuel: 'gas'
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const addCar = () => {
    if (newCar.price < 10 || newCar.price > 500) {
      setError('Цена должна быть от 10 до 500');
      return;
    }
    const id = Date.now();
    const car = { id, ...newCar };
    setCars(prev => [car, ...prev]);
    setNewCar({
      model: { en: '', ru: '', kg: '' },
      price: '',
      transmission: 'Auto',
      seats: 5,
      img: '',
      type: 'sedan',
      fuel: 'gas'
    });
    setShowForm(false);
    setError('');
  };

  const deleteCar = (id) => {
    if (confirm('Удалить машину?')) {
      setCars(prev => prev.filter(car => car.id !== id));
    }
  };

  const editCar = (car) => {
    setEditingId(car.id);
    setNewCar(car);
    setShowForm(true);
  };

  const updateCar = () => {
    if (newCar.price < 10 || newCar.price > 500) {
      setError('Цена должна быть от 10 до 500');
      return;
    }
    setCars(prev => prev.map(car => car.id === editingId ? newCar : car));
    setNewCar({
      model: { en: '', ru: '', kg: '' },
      price: '',
      transmission: 'Auto',
      seats: 5,
      img: '',
      type: 'sedan',
      fuel: 'gas'
    });
    setEditingId(null);
    setShowForm(false);
    setError('');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Управление автомобилями</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            updateFilters({});
          }}
          className="bg-cwd-blue text-white px-6 py-2 rounded-lg font-bold hover:bg-opacity-90"
        >
          {showForm ? 'Отмена' : 'Добавить машину'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-6">{editingId ? 'Редактировать' : 'Новая машина'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              placeholder="English model"
              value={newCar.model.en}
              onChange={(e) => setNewCar({...newCar, model: {...newCar.model, en: e.target.value}})}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cwd-blue"
            />
            <input
              placeholder="Русское название"
              value={newCar.model.ru}
              onChange={(e) => setNewCar({...newCar, model: {...newCar.model, ru: e.target.value}})}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cwd-blue"
            />
            <input
              placeholder="Кыргызча аталышы"
              value={newCar.model.kg}
              onChange={(e) => setNewCar({...newCar, model: {...newCar.model, kg: e.target.value}})}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cwd-blue"
            />
            <input
              type="number"
              placeholder="Цена/день"
              value={newCar.price}
              onChange={(e) => setNewCar({...newCar, price: e.target.value})}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cwd-blue"
            />
            <input
              type="url"
              placeholder="Image URL or upload file"
              value={newCar.img}
              onChange={(e) => setNewCar({...newCar, img: e.target.value})}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cwd-blue"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const url = URL.createObjectURL(file);
                  setNewCar({...newCar, img: url});
                }
              }}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cwd-blue file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cwd-blue file:text-white hover:file:bg-opacity-90"
            />
            <select
              value={newCar.transmission}
              onChange={(e) => setNewCar({...newCar, transmission: e.target.value})}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cwd-blue"
            >
              <option>Auto</option>
              <option>Manual</option>
            </select>
            <input
              type="number"
              placeholder="Seats"
              value={newCar.seats}
              onChange={(e) => setNewCar({...newCar, seats: parseInt(e.target.value)})}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cwd-blue"
            />
          </div>
          {error && <div className="text-red-600 mt-4">{error}</div>}
          <div className="mt-6 space-x-3">
            <button
              type="button"
              onClick={editingId ? updateCar : addCar}
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700"
            >
              {editingId ? 'Обновить' : 'Добавить'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-600"
            >
              Отмена
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map(car => (
          <div key={car.id} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all">
            <img src={car.img} alt={car.model.en} className="w-full h-48 object-cover rounded-xl mb-4" />
            <h3 className="text-xl font-bold mb-2">{car.model.en}</h3>
            <p className="text-cwd-blue font-bold text-lg mb-4">${car.price}/day</p>
            <div className="flex gap-2 mb-4">
              <span className="px-2 py-1 bg-gray-100 text-xs rounded-full">{car.transmission}</span>
              <span className="px-2 py-1 bg-gray-100 text-xs rounded-full">{car.seats} seats</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => editCar(car)}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-bold hover:bg-blue-700 transition"
              >
                Редактировать
              </button>
              <button
                onClick={() => deleteCar(car.id)}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-bold hover:bg-red-700 transition"
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageCars;

