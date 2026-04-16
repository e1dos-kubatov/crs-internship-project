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
    <div className="sticky top-24 h-fit space-y-6 rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-xl backdrop-blur md:p-8 lg:w-80">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">{t('filters')}</h3>
        <button
          onClick={clearFilters}
          className="text-sm font-medium text-cwd-blue hover:text-blue-600"
        >
          {t('clearAll')}
        </button>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">{t('search')}</label>
        <input
          value={filters.query}
          onChange={(e) => updateFilters({ query: e.target.value })}
          placeholder="Toyota, BMW, SUV..."
          className="w-full rounded-2xl border border-slate-200 p-3 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">{t('pricePerDay')}</label>
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
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cwd-blue"
          />
          <input
            type="range"
            min="0"
            max="500"
            value={filters.price[0]}
            onChange={(e) => updateFilters({ price: [Number(e.target.value), filters.price[1]] })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cwd-blue"
          />
        </div>
      </div>

      {/* Transmission */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">{t('transmission')}</label>
        <div className="space-y-2">
          {transmissions.map(trans => (
            <label key={trans} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.transmission.includes(trans)}
                onChange={(e) => {
                  const newTrans = e.target.checked
                    ? [...filters.transmission, trans]
                    : filters.transmission.filter(t => t !== trans);
                  updateFilters({ transmission: newTrans });
                }}
                className="rounded border-gray-300 text-cwd-blue focus:ring-cwd-blue"
              />
              <span className="text-sm capitalize">{t(trans)}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Fuel */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">{t('fuel')}</label>
        <div className="space-y-2">
          {fuels.map(fuel => (
            <label key={fuel} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.fuel.includes(fuel)}
                onChange={(e) => {
                  const nextFuel = e.target.checked
                    ? [...filters.fuel, fuel]
                    : filters.fuel.filter(item => item !== fuel);
                  updateFilters({ fuel: nextFuel });
                }}
                className="rounded border-gray-300 text-cwd-blue focus:ring-cwd-blue"
              />
              <span className="text-sm capitalize">{t(fuel)}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">{t('sortBy')}</label>
        <select
          value={filters.sort}
          onChange={(e) => updateFilters({ sort: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cwd-blue focus:border-cwd-blue"
        >
          <option value="price-asc">{t('lowToHigh')}</option>
          <option value="price-desc">{t('highToLow')}</option>
          <option value="newest">{t('newestFirst')}</option>
        </select>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-900 font-medium">
          {filteredCars.length} {t('carsFound')}
        </p>
      </div>
    </div>
  );
};

export default Filters;

