import React from 'react';
import { useRental } from '../context/RentalContext';
import { useLang } from '../context/LangContext';

const Filters = () => {
  const { filters, updateFilters, filteredCars } = useRental();
  const { t } = useLang();

  const transmissions = ['auto', 'manual'];
  const fuels = ['gas', 'diesel', 'hybrid'];

  const clearFilters = () => {
    updateFilters({
      price: [0, 500],
      transmission: [],
      fuel: [],
      sort: 'price-asc',
      query: ''
    });
  };

  return (
    <div className="sticky top-24 h-fit space-y-6 rounded-[2rem] border border-sky-100/30 bg-white/90 p-6 shadow-2xl shadow-sky-950/20 backdrop-blur md:p-8 lg:w-80">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black text-slate-950">{t('filters')}</h3>
        <button
          onClick={clearFilters}
          className="rounded-full bg-sky-50 px-3 py-1 text-xs font-black text-cwd-blue transition hover:bg-sky-100"
        >
          {t('clearAll')}
        </button>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-black text-slate-700 mb-3">{t('search')}</label>
        <input
          value={filters.query}
          onChange={(e) => updateFilters({ query: e.target.value })}
          placeholder="Toyota, BMW, SUV..."
          className="w-full rounded-2xl border border-sky-100 bg-slate-50 p-3 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
        />
      </div>

      <div>
        <label className="block text-sm font-black text-slate-700 mb-3">{t('pricePerDay')}</label>
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-500">
            <span>${filters.price[0]}</span>
            <span>${filters.price[1]}</span>
          </div>
          <input
            type="range"
            min="0"
            max="500"
            value={filters.price[1]}
            onChange={(e) => updateFilters({ price: [filters.price[0], Number(e.target.value)] })}
            className="w-full h-2 bg-sky-100 rounded-lg appearance-none cursor-pointer accent-cwd-blue"
          />
          <input
            type="range"
            min="0"
            max="500"
            value={filters.price[0]}
            onChange={(e) => updateFilters({ price: [Number(e.target.value), filters.price[1]] })}
            className="w-full h-2 bg-sky-100 rounded-lg appearance-none cursor-pointer accent-cwd-blue"
          />
        </div>
      </div>

      {/* Transmission */}
      <div>
        <label className="block text-sm font-black text-slate-700 mb-3">{t('transmission')}</label>
        <div className="space-y-2">
          {transmissions.map(trans => (
            <label key={trans} className="flex items-center space-x-2 p-2 rounded-xl hover:bg-sky-50 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.transmission.includes(trans)}
                onChange={(e) => {
                  const newTrans = e.target.checked
                    ? [...filters.transmission, trans]
                    : filters.transmission.filter(t => t !== trans);
                  updateFilters({ transmission: newTrans });
                }}
                className="rounded border-sky-200 text-cwd-blue focus:ring-cwd-blue"
              />
              <span className="text-sm font-bold capitalize text-slate-700">{t(trans)}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Fuel */}
      <div>
        <label className="block text-sm font-black text-slate-700 mb-3">{t('fuel')}</label>
        <div className="space-y-2">
          {fuels.map(fuel => (
            <label key={fuel} className="flex items-center space-x-2 p-2 rounded-xl hover:bg-sky-50 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.fuel.includes(fuel)}
                onChange={(e) => {
                  const nextFuel = e.target.checked
                    ? [...filters.fuel, fuel]
                    : filters.fuel.filter(item => item !== fuel);
                  updateFilters({ fuel: nextFuel });
                }}
                className="rounded border-sky-200 text-cwd-blue focus:ring-cwd-blue"
              />
              <span className="text-sm font-bold capitalize text-slate-700">{t(fuel)}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <label className="block text-sm font-black text-slate-700 mb-3">{t('sortBy')}</label>
        <select
          value={filters.sort}
          onChange={(e) => updateFilters({ sort: e.target.value })}
          className="w-full rounded-2xl border border-sky-100 bg-slate-50 p-3 font-bold text-slate-700 focus:border-cwd-blue focus:ring-2 focus:ring-sky-100"
        >
          <option value="price-asc">{t('lowToHigh')}</option>
          <option value="price-desc">{t('highToLow')}</option>
          <option value="newest">{t('newestFirst')}</option>
        </select>
      </div>

      <div className="rounded-2xl border border-sky-100 bg-gradient-to-r from-sky-50 to-white p-4">
        <p className="text-sm text-slate-900 font-black">
          {filteredCars.length} {t('carsFound')}
        </p>
      </div>
    </div>
  );
};

export default Filters;

