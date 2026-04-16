import React from 'react';
import { useRental } from '../context/RentalContext';

const Filters = () => {
  const { filters, updateFilters, filteredCars } = useRental();

  const types = ['sedan', 'suv', 'hatchback'];
  const transmissions = ['auto', 'manual'];
  const fuels = ['gas', 'diesel', 'hybrid'];

  const clearFilters = () => {
    updateFilters({
      price: [0, 200],
      type: [],
      transmission: [],
      fuel: [],
      sort: 'price-asc',
      query: ''
    });
  };

  return (
    <div className="sticky top-24 h-fit space-y-6 rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-xl backdrop-blur md:p-8 lg:w-80">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-sm font-medium text-cwd-blue hover:text-blue-600"
        >
          Clear all
        </button>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Search</label>
        <input
          value={filters.query}
          onChange={(e) => updateFilters({ query: e.target.value })}
          placeholder="Toyota, BMW, SUV..."
          className="w-full rounded-2xl border border-slate-200 p-3 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Price per day</label>
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

      {/* Car Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Car Type</label>
        <div className="grid grid-cols-2 gap-2">
          {types.map(type => (
            <label key={type} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.type.includes(type)}
                onChange={(e) => {
                  const newTypes = e.target.checked
                    ? [...filters.type, type]
                    : filters.type.filter(t => t !== type);
                  updateFilters({ type: newTypes });
                }}
                className="rounded border-gray-300 text-cwd-blue focus:ring-cwd-blue"
              />
              <span className="text-sm capitalize">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Transmission */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Transmission</label>
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
              <span className="text-sm capitalize">{trans}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Fuel */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Fuel</label>
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
              <span className="text-sm capitalize">{fuel}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Sort by</label>
        <select
          value={filters.sort}
          onChange={(e) => updateFilters({ sort: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cwd-blue focus:border-cwd-blue"
        >
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="newest">Newest first</option>
        </select>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-900 font-medium">
          {filteredCars.length} cars found
        </p>
      </div>
    </div>
  );
};

export default Filters;

