import React, { useState } from 'react';
import { Camera, ChevronDown, Mail, MessageCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { useLang } from '../context/LangContext';

const FAQ = () => {
  const { t } = useLang();
  const [open, setOpen] = useState(null);

  const faqs = t('faqItems');

  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top_left,#e0f2fe,#f8fafc_45%,#fff7ed)] px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-orange-700">
              <Sparkles className="h-4 w-4" />
              {t('faqEyebrow')}
            </p>
            <h1 className="mt-5 text-5xl font-black tracking-tight text-slate-950 md:text-6xl">{t('faqTitle')}</h1>
          </div>
          <p className="text-lg leading-8 text-slate-600">{t('faqLead')}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.35fr_0.65fr]">
          <aside className="overflow-hidden rounded-[2rem] border border-white/80 bg-white/90 shadow-2xl backdrop-blur">
            <div className="relative min-h-56 p-6 text-white">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=85)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/35 to-transparent" />
              <div className="relative">
                <span className="inline-flex rounded-2xl bg-white/20 p-3 backdrop-blur">
                  <Sparkles className="h-7 w-7" />
                </span>
                <h2 className="mt-14 text-3xl font-black drop-shadow-xl">{t('contactDirectTitle')}</h2>
              </div>
            </div>
            <div className="space-y-3 p-6">
              <a href={`mailto:${t('projectEmail')}`} className="flex items-center gap-3 rounded-2xl bg-sky-50 p-4 text-sm font-black text-slate-800 transition hover:bg-sky-100">
                <Mail className="h-5 w-5 text-cwd-blue" />
                {t('projectEmail')}
              </a>
              <a href="https://wa.me/996700100100" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-2xl bg-emerald-50 p-4 text-sm font-black text-slate-800 transition hover:bg-emerald-100">
                <MessageCircle className="h-5 w-5 text-emerald-600" />
                {t('whatsapp')}: {t('projectWhatsapp')}
              </a>
              <a href="https://www.instagram.com/cwd.rental.kg" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-2xl bg-orange-50 p-4 text-sm font-black text-slate-800 transition hover:bg-orange-100">
                <Camera className="h-5 w-5 text-orange-600" />
                {t('instagram')}: {t('projectInstagram')}
              </a>
            </div>
          </aside>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={faq.q} className="overflow-hidden rounded-[1.5rem] border border-white/80 bg-white/90 shadow-lg backdrop-blur">
                <button
                  onClick={() => setOpen(open === idx ? null : idx)}
                  className="flex w-full items-center justify-between gap-4 p-6 text-left transition hover:bg-slate-50"
                >
                  <span className="flex items-start gap-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-sky-100 text-cwd-blue">
                      <ShieldCheck className="h-5 w-5" />
                    </span>
                    <span className="text-lg font-black text-slate-950">{faq.q}</span>
                  </span>
                  <ChevronDown className={`h-5 w-5 shrink-0 text-slate-500 transition ${open === idx ? 'rotate-180' : ''}`} />
                </button>
                {open === idx && (
                  <div className="border-t border-slate-100 bg-slate-50/70 px-6 py-5">
                    <p className="leading-8 text-slate-700">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;

