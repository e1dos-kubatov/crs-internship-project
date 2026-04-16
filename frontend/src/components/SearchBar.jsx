import React, { useState } from 'react';
import { useLang } from '../context/LangContext';
import { useRental } from '../context/RentalContext';

const SearchBar = () => {
  const { t } = useLang();
  const { updateFilters } = useRental();
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [dropoffDate, setDropoffDate] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    updateFilters({ 
      location,
      pickupDate,
      dropoffDate
    });
    navigate('/cars');
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 md:p-12 max-w-6xl mx-auto">
      <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('location')}</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Bishkek Airport, City Center..."
            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cwd-blue focus:border-cwd-blue"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('pickupDate')}</label>
          <input
            type="date"
            value={pickupDate}
            onChange={(e) => setPickupDate(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cwd-blue focus:border-cwd-blue"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('dropoffDate')}</label>
          <input
            type="date"
            value={dropoffDate}
            onChange={(e) => setDropoffDate(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cwd-blue focus:border-cwd-blue"
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cwd-blue to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            {t('searchCars')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;

