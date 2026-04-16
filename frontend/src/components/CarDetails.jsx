import React, { useEffect, useState } from 'react';
import { ArrowLeft, CalendarCheck, Fuel, Gauge, UsersRound } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRental } from '../context/RentalContext';
import HeartIcon from './icons/HeartIcon';
import BookingModal from './BookingModal';

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cars, loading: carsLoading, selectedCar, setSelectedCar, favorites, toggleFavorite } = useRental();
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (carsLoading) return;
    const car = cars.find((candidate) => candidate.id === Number(id));
    if (car) {
      setSelectedCar(car);
    } else {
      navigate('/cars');
    }
  }, [id, cars, carsLoading, setSelectedCar, navigate]);

  if (carsLoading || !selectedCar) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const isFavorite = favorites.includes(selectedCar.id);
  const images = selectedCar.images?.length ? selectedCar.images : [
    selectedCar.img,
    'https://images.unsplash.com/photo-1494976380-595b160b4c89?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1545156534-ef7f3b606a5d?auto=format&fit=crop&w=800&q=80',
  ];

  return (
    <div className="min-h-screen bg-transparent py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/cars')}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-4 py-2 text-sm font-bold text-slate-700 shadow-sm backdrop-blur transition hover:bg-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to cars
        </button>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <div className="relative overflow-hidden rounded-[2rem] shadow-2xl">
              <img
                src={images[0]}
                alt={selectedCar.model.en}
                className="h-[30rem] w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 to-transparent p-6 text-white">
                <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-200">{selectedCar.status}</p>
                <h1 className="mt-2 text-4xl font-black">{selectedCar.model.en}</h1>
              </div>
              <button
                onClick={() => toggleFavorite(selectedCar.id)}
                className="absolute right-4 top-4 rounded-2xl bg-white/90 p-3 shadow-lg transition hover:bg-white"
              >
                <HeartIcon className={`w-6 h-6 ${isFavorite ? 'fill-red-500 stroke-red-500' : 'stroke-gray-600'}`} />
              </button>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {images.slice(1).map((img, idx) => (
                <img key={idx} src={img} alt="Car detail" className="h-32 w-full rounded-3xl object-cover shadow-lg" />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-xl backdrop-blur">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.25em] text-sky-700">Verified fleet</p>
                  <h2 className="mt-3 text-4xl font-black text-slate-950">{selectedCar.model.en}</h2>
                </div>
                <div className="rounded-3xl bg-slate-950 px-5 py-4 text-right text-white">
                  <p className="text-3xl font-black">${selectedCar.price}</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-300">per day</p>
                </div>
              </div>
              <p className="mt-6 text-lg leading-8 text-slate-600">{selectedCar.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-3xl bg-white/85 p-5 shadow-lg backdrop-blur">
                <UsersRound className="mb-3 h-6 w-6 text-orange-600" />
                <p className="text-sm text-slate-500">Seats</p>
                <strong className="text-xl text-slate-950">{selectedCar.seats}</strong>
              </div>
              <div className="rounded-3xl bg-white/85 p-5 shadow-lg backdrop-blur">
                <Gauge className="mb-3 h-6 w-6 text-sky-700" />
                <p className="text-sm text-slate-500">Transmission</p>
                <strong className="text-xl text-slate-950">{selectedCar.transmission}</strong>
              </div>
              <div className="rounded-3xl bg-white/85 p-5 shadow-lg backdrop-blur">
                <Fuel className="mb-3 h-6 w-6 text-emerald-600" />
                <p className="text-sm text-slate-500">Fuel</p>
                <strong className="text-xl text-slate-950">{selectedCar.fuel}</strong>
              </div>
              <div className="rounded-3xl bg-white/85 p-5 shadow-lg backdrop-blur">
                <CalendarCheck className="mb-3 h-6 w-6 text-amber-600" />
                <p className="text-sm text-slate-500">Year</p>
                <strong className="text-xl text-slate-950">{selectedCar.year}</strong>
              </div>
            </div>

            <div className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-sky-950 to-orange-900 p-8 text-white shadow-2xl">
              <h3 className="text-3xl font-black">Ready to book?</h3>
              <p className="mt-3 text-slate-200">Pick your dates and the rental will be created through `/api/rentals`.</p>
              <button
                onClick={() => setOpenModal(true)}
                className="mt-6 w-full rounded-2xl bg-white px-8 py-4 text-lg font-black text-slate-950 shadow-xl transition hover:-translate-y-0.5 hover:bg-orange-50"
              >
                Book now
              </button>
            </div>
          </div>
        </div>
      </div>

      {openModal && <BookingModal car={selectedCar} onClose={() => setOpenModal(false)} />}
    </div>
  );
};

export default CarDetails;
