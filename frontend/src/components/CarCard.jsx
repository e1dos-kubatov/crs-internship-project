import React from 'react';
import { useRental } from '../context/RentalContext';
import { Link } from 'react-router-dom';
import HeartIcon from './icons/HeartIcon';
import { useLang } from '../context/LangContext';

const CarCard = ({ car }) => {
  const { toggleFavorite, favorites } = useRental();
  const { t } = useLang();
  const isFavorite = favorites.includes(car.id);

  const specs = [
    `${car.seats} ${t('seats')}`,
    t(car.transmission),
    t(car.fuel)
  ];

  return (
    <div className="group flex min-h-[27rem] flex-col overflow-hidden rounded-[2rem] border border-sky-100/80 bg-white/95 shadow-xl shadow-sky-950/10 backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:border-sky-200 hover:shadow-2xl">
      <div className="relative h-52 overflow-hidden bg-gradient-to-br from-sky-50 to-slate-100">
        <img 
          src={car.img} 
          alt={car.model.en}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={() => toggleFavorite(car.id)}
          className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all group-hover:scale-110"
        >
<HeartIcon className={`w-5 h-5 ${isFavorite ? 'fill-red-500 stroke-red-500' : 'stroke-gray-600'}`} />
        </button>
        <div className="absolute bottom-4 left-4 bg-cwd-blue/90 text-white px-3 py-1 rounded-full text-xs font-black shadow-lg shadow-sky-950/20">
          {car.available ? t('available') : car.status}
        </div>
      </div>
      
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3">
          <h3 className="text-xl font-black text-slate-950 mb-1 line-clamp-1">{car.model.en}</h3>
          <div className="flex flex-wrap gap-1 text-xs text-gray-500">
            {specs.map((spec, idx) => (
              <span key={idx} className="px-2 py-1 bg-sky-50 text-slate-600 rounded-full">
                {spec}
              </span>
            ))}
          </div>
        </div>
        
        <div className="mt-auto grid gap-4">
          <div className="min-w-0 text-2xl font-black text-cwd-blue">
            <span>${car.price}</span>
            <span className="ml-1 text-base font-normal leading-6 text-gray-500">/ {t('pricePerDay').toLowerCase()}</span>
          </div>
          <Link
            to={`/cars/${car.id}`}
            className="inline-flex w-full items-center justify-center whitespace-nowrap rounded-xl bg-gradient-to-r from-cwd-blue to-sky-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-sky-900/20 transition-all hover:-translate-y-0.5 hover:shadow-xl"
          >
            {t('viewDetails')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CarCard;

