import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck, Sparkles } from 'lucide-react';
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
          <aside className="rounded-[2rem] bg-slate-950 p-7 text-white shadow-2xl">
            <HelpCircle className="mb-5 h-10 w-10 text-sky-300" />
            <h2 className="text-2xl font-black">{t('contactDirectTitle')}</h2>
            <div className="mt-6 space-y-3 text-sm font-bold text-slate-300">
              <p>{t('projectEmail')}</p>
              <p>{t('whatsapp')}: {t('projectWhatsapp')}</p>
              <p>{t('instagram')}: {t('projectInstagram')}</p>
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

