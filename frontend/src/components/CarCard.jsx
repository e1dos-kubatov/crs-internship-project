import React from 'react';
import { useRental } from '../context/RentalContext';
import { Link } from 'react-router-dom';
import HeartIcon from './icons/HeartIcon';

const CarCard = ({ car }) => {
  const { toggleFavorite, favorites } = useRental();
  const isFavorite = favorites.includes(car.id);

  const specs = [
    `${car.seats} seats`,
    car.transmission,
    car.fuel
  ];

  return (
    <div className="group flex min-h-[27rem] flex-col overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 shadow-xl backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
      <div className="relative h-52 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
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
        <div className="absolute bottom-4 left-4 bg-slate-950/75 text-white px-3 py-1 rounded-full text-xs font-bold">
          {car.available ? 'Available' : car.status}
        </div>
      </div>
      
      <div className="p-7 flex flex-col flex-1">
        <div className="mb-3">
          <h3 className="text-xl font-black text-slate-950 mb-1 line-clamp-1">{car.model.en}</h3>
          <div className="flex flex-wrap gap-1 text-xs text-gray-500">
            {specs.map((spec, idx) => (
              <span key={idx} className="px-2 py-1 bg-gray-100 rounded-full">
                {spec}
              </span>
            ))}
          </div>
        </div>
        
        <div className="mt-auto grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
          <div className="text-2xl font-black text-cwd-blue">
            ${car.price}
            <span className="text-lg font-normal text-gray-500">/day</span>
          </div>
          <Link
            to={`/cars/${car.id}`}
            className="inline-flex min-w-32 items-center justify-center rounded-xl bg-cwd-blue px-5 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-opacity-90 hover:shadow-xl"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CarCard;

