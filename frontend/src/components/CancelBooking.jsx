import React, { useState } from 'react';
import { CheckCircle2, LifeBuoy, Mail, MessageCircle, Search, ShieldCheck, XCircle } from 'lucide-react';
import { paymentsApi, rentalsApi } from '../api/client';
import { paymentFromApi } from '../api/adapters';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import { useRental } from '../context/RentalContext';

const CancelBooking = () => {
  const { user } = useAuth();
  const { getMyRentals } = useRental();
  const { t } = useLang();
  const [bookingId, setBookingId] = useState('');
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCancel = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setStatus('');

    try {
      if (user.role === 'admin') {
        await rentalsApi.updateStatus(bookingId, 'CANCELLED');
        setStatus(t('rentalCancelled'));
      } else {
        const rentals = await getMyRentals();
        const rental = rentals.find((item) => String(item.id) === String(bookingId));
        if (!rental) {
          setError(t('rentalNotFound'));
        } else {
          const payments = (await paymentsApi.byRental(rental.id)).map(paymentFromApi);
          const refundablePayment = payments.find((payment) => payment.status === 'succeeded' || payment.status === 'partially_refunded');
          if (refundablePayment) {
            await paymentsApi.refund(refundablePayment.id, {
              amount: rental.total,
              reason: reason || t('customerCancellationReason'),
            });
            setStatus(t('refundCreated'));
          } else {
            setStatus(t('rentalFoundContactSupport'));
          }
        }
      }
    } catch (cancelError) {
      setError(cancelError.message);
    } finally {
      setLoading(false);
    }
  };

  const steps = [t('cancelStepOne'), t('cancelStepTwo'), t('cancelStepThree')];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#fff7ed,#f8fafc_42%,#e0f2fe)] px-4 py-16">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="overflow-hidden rounded-[2.5rem] bg-slate-950 text-white shadow-2xl">
          <div className="relative min-h-[26rem] p-8">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-65"
              style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/10" />
            <div className="relative flex h-full min-h-[22rem] flex-col justify-end">
              <span className="mb-5 grid h-16 w-16 place-items-center rounded-3xl bg-white/15 backdrop-blur">
                <LifeBuoy className="h-8 w-8 text-sky-200" />
              </span>
              <p className="text-sm font-black uppercase tracking-[0.3em] text-red-200">{t('rentalSupport')}</p>
              <h1 className="mt-3 text-4xl font-black leading-tight md:text-5xl">{t('cancelRental')}</h1>
              <p className="mt-4 leading-8 text-slate-200">{t('saferCancelText')}</p>
            </div>
          </div>

          <div className="grid gap-3 p-6">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center gap-4 rounded-3xl bg-white/10 p-4 backdrop-blur">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white text-slate-950 text-sm font-black">
                  {index + 1}
                </span>
                <p className="font-bold text-slate-100">{step}</p>
              </div>
            ))}
          </div>
        </aside>

        <section className="rounded-[2.5rem] border border-white/80 bg-white/90 p-6 shadow-2xl backdrop-blur md:p-8">
          <div className="mb-8 text-center">
            <XCircle className="mx-auto mb-4 h-16 w-16 text-red-600" />
            <p className="text-sm font-black uppercase tracking-[0.25em] text-red-600">{t('supportWorkflow')}</p>
            <h2 className="mt-3 text-4xl font-black text-slate-950">{t('saferCancelTitle')}</h2>
            <p className="mx-auto mt-4 max-w-2xl leading-8 text-slate-600">{t('cancelRentalLead')}</p>
          </div>

          <form onSubmit={handleCancel} className="space-y-5 rounded-[2rem] bg-slate-50 p-5 md:p-6">
            <label className="block">
              <span className="mb-2 block text-sm font-black text-slate-700">{t('rentalId')}</span>
              <input
                type="number"
                value={bookingId}
                onChange={(e) => setBookingId(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-lg font-bold outline-none transition focus:border-red-400 focus:ring-4 focus:ring-red-100"
                placeholder={t('enterRentalId')}
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-black text-slate-700">{t('refundReason')}</span>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="min-h-28 w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm font-bold outline-none transition focus:border-red-400 focus:ring-4 focus:ring-red-100"
                placeholder={t('refundReasonPlaceholder')}
              />
            </label>

            {error && (
              <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
                {error}
              </div>
            )}
            {status && (
              <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                {status}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-red-600 to-slate-950 px-6 py-4 font-black text-white shadow-xl shadow-red-900/20 transition hover:-translate-y-0.5 disabled:opacity-70"
            >
              <Search className="h-5 w-5" />
              {loading ? t('checking') : user.role === 'admin' ? t('cancelRental') : t('findMyRental')}
            </button>
          </form>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm">
              <ShieldCheck className="mb-4 h-7 w-7 text-cwd-blue" />
              <h3 className="text-xl font-black text-slate-950">{t('accountSecurity')}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{t('accountSecurityText')}</p>
            </div>
            <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm">
              <MessageCircle className="mb-4 h-7 w-7 text-emerald-600" />
              <h3 className="text-xl font-black text-slate-950">{t('directSupport')}</h3>
              <div className="mt-3 space-y-2 text-sm font-bold text-slate-600">
                <p className="flex items-center gap-2"><Mail className="h-4 w-4" /> {t('projectEmail')}</p>
                <p>{t('whatsapp')}: {t('projectWhatsapp')}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CancelBooking;
