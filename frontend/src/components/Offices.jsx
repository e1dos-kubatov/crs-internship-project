import React from 'react';
import { useLang } from '../context/LangContext';
import { offices } from '../data/offices';

const Offices = () => {
  const { t } = useLang();

  return (
    <section className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-extrabold mb-12 text-center tracking-tight">{t('offices')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {offices.map(office => (
          <div key={office.id} className="bg-white border border-gray-200 rounded-xl p-8 shadow-lg hover:shadow-xl transition">
            <h3 className="text-2xl font-bold mb-4">{office.name.en}</h3>
            <p className="text-gray-600 mb-6">{office.address.en}</p>
            <button className="bg-cwd-blue text-white px-6 py-2 rounded-lg font-bold uppercase text-sm tracking-widest hover:bg-opacity-90 transition">
              Directions
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Offices;

