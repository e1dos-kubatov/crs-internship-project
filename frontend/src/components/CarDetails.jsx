import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRental } from '../context/RentalContext';
import { useLang } from '../context/LangContext';
import HeartIcon from './icons/HeartIcon';
import BookingModal from './BookingModal';

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cars, selectedCar, setSelectedCar, calculateTotal, favorites, toggleFavorite } = useRental();
  const { t } = useLang();
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const car = cars.find(c => c.id === parseInt(id));
    if (car) {
      setSelectedCar(car);
      setLoading(false);
    } else {
      navigate('/cars');
    }
  }, [id, cars, setSelectedCar, navigate]);

  if (loading || !selectedCar) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const isFavorite = favorites.includes(selectedCar.id);
  const images = [
    selectedCar.img,
    'https://images.unsplash.com/photo-1494976380-595b160b4c89?w=800',
    'https://images.unsplash.com/photo-1545156534-ef7f3b606a5d?w=800'
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <button
          onClick={() => navigate('/cars')}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 mb-8"
        >
          ← Back to cars
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Images */}
          <div>
            <div className="relative group">
              <img
                src={images[0]}
                alt={selectedCar.model.en}
                className="w-full h-96 object-cover rounded-3xl shadow-2xl group-hover:shadow-3xl transition-all"
              />
              <button
                onClick={() => toggleFavorite(selectedCar.id)}
                className="absolute top-4 right-4 p-3 bg-white/90 hover:bg-white rounded-2xl shadow-lg transition-all"
              >
                <HeartIcon className={`w-6 h-6 ${isFavorite ? 'fill-red-500 stroke-red-500' : 'stroke-gray-600'}`} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-6">
              {images.slice(1).map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt="Car"
                  className="h-24 object-cover rounded-xl cursor-pointer hover:shadow-md transition-shadow"
                />
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">{selectedCar.model.en}</h1>
              <p className="text-xl text-cwd-blue font-bold mt-2">${selectedCar.price}/day</p>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="font-bold text-lg mb-4">Specs</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Seats:</span>
                    <span>{selectedCar.seats}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transmission:</span>
                    <span>{(selectedCar.transmission || '').toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fuel:</span>
                    <span>{(selectedCar.fuel || '').toUpperCase()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-blue-600 to-cwd-blue text-white p-8 rounded-3xl shadow-2xl">
              <h3 className="text-2xl font-bold mb-4">Ready to book?</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-lg">
                  <span>Total (1 day):</span>
                  <span>${selectedCar.price}</span>
                </div>
              </div>
              <button
                onClick={() => setOpenModal(true)}
                className="w-full bg-white text-blue-600 font-bold py-4 px-8 rounded-2xl text-lg hover:bg-gray-50 shadow-xl hover:shadow-2xl transition-all mt-6"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {openModal && (
        <BookingModal car={selectedCar} onClose={() => setOpenModal(false)} />
      )}
    </div>
  );
};

export default CarDetails;


