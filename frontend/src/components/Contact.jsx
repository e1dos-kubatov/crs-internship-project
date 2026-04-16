import React, { useState } from 'react';
import { useLang } from '../context/LangContext';

const Contact = () => {
  const { t } = useLang();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Message sent! (Demo)');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-extrabold mb-12 text-center tracking-tight">{t('contact')}</h1>
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold mb-2">{t('name')}</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cwd-blue" required />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">{t('email')}</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cwd-blue" required />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">{t('message')}</label>
            <textarea rows="5" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cwd-blue" required />
          </div>
          <button type="submit" className="w-full bg-cwd-blue text-white py-4 rounded-lg font-bold text-lg uppercase tracking-widest hover:shadow-lg transition">
            {t('send')}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;

