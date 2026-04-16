import React from 'react';
import { useRental } from '../context/RentalContext';
import Filters from './Filters';
import CarCard from './CarCard';

const CarsPage = () => {
  const { filteredCars, filters, loading } = useRental();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-3xl p-6 h-80">
                <div className="h-48 bg-gray-200 rounded-2xl mb-6"></div>
                <div className="h-6 bg-gray-200 rounded mb-3 w-3/4"></div>
                <div className="flex gap-2 mb-6">
                  <div className="h-4 bg-gray-200 rounded-full w-16"></div>
                  <div className="h-4 bg-gray-200 rounded-full w-12"></div>
                </div>
                <div className="h-12 bg-gray-200 rounded-xl w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-80 lg:sticky lg:top-24 lg:h-fit self-start">
            <Filters />
          </aside>
          
          <main className="flex-1">
            <div className="mb-8">
              <div className="filters-header mb-6 p-4 bg-white rounded-2xl shadow-lg">
                {filters.pickupDate && filters.dropoffDate ? (
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      Active cars available {filters.pickupDate} - {filters.dropoffDate}
                    </h1>
                    <p className="text-lg text-gray-600">
                      {filteredCars.length} cars found for your search
                    </p>
                  </div>
                ) : (
                  <>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Cars for rent</h1>
                    <p className="text-xl text-gray-600">
                      {filteredCars.length} cars available
                    </p>
                  </>
                )}
              </div>
            </div>
            
            {filteredCars.length === 0 ? (
              <div className="text-center py-24">
                <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-4V7m8 10v5a1 1 0 01-1 1h-4a1 1 0 01-1-1v-5" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">No cars found</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Try adjusting your search or filters. There are plenty of cars available for rent.
                </p>
                <button className="bg-cwd-blue text-white px-8 py-3 rounded-2xl font-bold hover:bg-opacity-90 transition-all">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCars.map(car => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default CarsPage;

