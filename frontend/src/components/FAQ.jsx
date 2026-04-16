import React, { useState } from 'react';
import { useLang } from '../context/LangContext';

const FAQ = () => {
  const { t } = useLang();
  const [open, setOpen] = useState(null);

  const faqs = [
    { q: 'How do I book a car?', a: 'Fill the form on home page and select car.' },
    { q: 'What payment methods?', a: 'Credit card on pickup.' },
    { q: 'Can I change booking?', a: 'Yes, contact support.' }
  ];

  return (
    <section className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-extrabold mb-12 text-center tracking-tight">{t('faq')}</h1>
      <div className="max-w-4xl mx-auto space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden">
            <button 
              onClick={() => setOpen(open === idx ? null : idx)}
              className="w-full p-6 text-left font-bold hover:bg-gray-50 transition"
            >
              {faq.q}
            </button>
            {open === idx && (
              <div className="p-6 bg-gray-50">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;

