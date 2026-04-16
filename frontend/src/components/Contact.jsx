import React, { useState } from 'react';
import { Camera, Clock, Mail, MessageCircle, Send, Sparkles } from 'lucide-react';
import { useLang } from '../context/LangContext';

const Contact = () => {
  const { t } = useLang();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(t('messageSent'));
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top_left,#fff7ed,#f8fafc_42%,#e0f2fe)] px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-3xl">
          <p className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-sky-800">
            <Sparkles className="h-4 w-4" />
            {t('contactEyebrow')}
          </p>
          <h1 className="mt-5 text-5xl font-black tracking-tight text-slate-950 md:text-6xl">{t('contactTitle')}</h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">{t('contactLead')}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="space-y-5">
            <div className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-2xl">
              <h2 className="text-2xl font-black">{t('contactDirectTitle')}</h2>
              <div className="mt-6 space-y-4">
                <a href={`mailto:${t('projectEmail')}`} className="flex items-center gap-4 rounded-3xl bg-white/10 p-4 transition hover:bg-white/15">
                  <Mail className="h-6 w-6 text-orange-300" />
                  <span className="font-bold">{t('projectEmail')}</span>
                </a>
                <a href="https://wa.me/996700100100" target="_blank" rel="noreferrer" className="flex items-center gap-4 rounded-3xl bg-white/10 p-4 transition hover:bg-white/15">
                  <MessageCircle className="h-6 w-6 text-emerald-300" />
                  <span className="font-bold">{t('whatsapp')}: {t('projectWhatsapp')}</span>
                </a>
                <a href="https://www.instagram.com/cwd.rental.kg" target="_blank" rel="noreferrer" className="flex items-center gap-4 rounded-3xl bg-white/10 p-4 transition hover:bg-white/15">
                  <Camera className="h-6 w-6 text-pink-300" />
                  <span className="font-bold">{t('instagram')}: {t('projectInstagram')}</span>
                </a>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/80 bg-white/90 p-7 shadow-xl backdrop-blur">
              <Clock className="mb-4 h-8 w-8 text-cwd-blue" />
              <p className="text-sm font-black uppercase tracking-[0.25em] text-slate-400">{t('officeHours')}</p>
              <p className="mt-2 text-xl font-black text-slate-950">{t('officeHoursValue')}</p>
            </div>
          </aside>

          <form onSubmit={handleSubmit} className="rounded-[2rem] border border-white/80 bg-white/90 p-6 shadow-2xl backdrop-blur md:p-8">
            <h2 className="mb-6 text-3xl font-black text-slate-950">{t('contactFormTitle')}</h2>
            <div className="grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">{t('yourName')}</span>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full rounded-2xl border border-slate-200 bg-white p-4 outline-none transition focus:border-cwd-blue focus:ring-4 focus:ring-sky-100" required />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">{t('yourEmail')}</span>
                <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full rounded-2xl border border-slate-200 bg-white p-4 outline-none transition focus:border-cwd-blue focus:ring-4 focus:ring-sky-100" required />
              </label>
              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-bold text-slate-700">{t('yourMessage')}</span>
                <textarea rows="7" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} placeholder={t('messagePlaceholder')} className="w-full rounded-2xl border border-slate-200 bg-white p-4 outline-none transition focus:border-cwd-blue focus:ring-4 focus:ring-sky-100" required />
              </label>
            </div>
            <button type="submit" className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-slate-950 to-cwd-blue px-6 py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl transition hover:-translate-y-0.5">
              <Send className="h-5 w-5" />
              {t('sendMessage')}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;

