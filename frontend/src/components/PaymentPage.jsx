import React, { useEffect, useMemo, useState } from 'react';
import { BadgeCheck, CreditCard, LockKeyhole, ReceiptText, RefreshCw, ShieldCheck } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { paymentsApi, rentalsApi } from '../api/client';
import { paymentFromApi, rentalFromApi } from '../api/adapters';
import { useLang } from '../context/LangContext';

const PaymentPage = () => {
  const { rentalId } = useParams();
  const navigate = useNavigate();
  const { t } = useLang();
  const [rental, setRental] = useState(null);
  const [payments, setPayments] = useState([]);
  const [provider, setProvider] = useState('DEMO');
  const [method, setMethod] = useState('card');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const latestPayment = payments[0];
  const alreadyPaid = ['succeeded', 'refunded', 'partially_refunded'].includes(latestPayment?.status);

  const demoToken = useMemo(() => `tok_demo_${rentalId || 'rental'}`, [rentalId]);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [rentals, rentalPayments] = await Promise.all([
        rentalsApi.mine(),
        paymentsApi.byRental(rentalId),
      ]);
      const mappedRental = rentals.map(rentalFromApi).find((item) => String(item.id) === String(rentalId));
      if (!mappedRental) {
        setError(t('paymentRentalNotFound'));
      }
      setRental(mappedRental);
      setPayments(rentalPayments.map(paymentFromApi).sort((a, b) => b.id - a.id));
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rentalId]);

  const handlePay = async (event) => {
    event.preventDefault();
    if (!rental || alreadyPaid) return;

    setSubmitting(true);
    setMessage('');
    setError('');
    try {
      const intent = await paymentsApi.createIntent({
        rentalId: rental.id,
        provider,
        paymentMethod: method,
        currency: 'USD',
      });
      const confirmed = await paymentsApi.confirm(intent.id, { paymentToken: demoToken });
      const mapped = paymentFromApi(confirmed);
      setPayments((prev) => [mapped, ...prev.filter((payment) => payment.id !== mapped.id)]);
      setMessage(t('paymentSuccess'));
    } catch (paymentError) {
      setError(paymentError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#ecfeff,#f8fafc_45%,#fff7ed)] px-4 py-12">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="overflow-hidden rounded-lg bg-slate-950 text-white shadow-2xl">
          <div className="relative min-h-[28rem] p-8">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-60"
              style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=85)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/10" />
            <div className="relative flex h-full min-h-[24rem] flex-col justify-end">
              <span className="mb-5 grid h-16 w-16 place-items-center rounded-lg bg-white/15 backdrop-blur">
                <LockKeyhole className="h-8 w-8 text-emerald-200" />
              </span>
              <p className="text-sm font-black uppercase tracking-[0.3em] text-emerald-200">{t('securePayment')}</p>
              <h1 className="mt-3 text-4xl font-black leading-tight md:text-5xl">{t('paymentTitle')}</h1>
              <p className="mt-4 leading-8 text-slate-200">{t('paymentLead')}</p>
            </div>
          </div>
        </aside>

        <section className="rounded-lg border border-white/80 bg-white/95 p-6 shadow-2xl backdrop-blur md:p-8">
          {loading ? (
            <p className="font-bold text-slate-500">{t('loading')}</p>
          ) : (
            <>
              <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.25em] text-cwd-blue">{t('bookingDetails')}</p>
                  <h2 className="mt-2 text-3xl font-black text-slate-950">{rental?.car || t('notSet')}</h2>
                  <p className="mt-2 text-sm font-semibold text-slate-500">
                    {rental?.pickup} - {rental?.dropoff}
                  </p>
                </div>
                <div className="rounded-lg bg-emerald-50 px-5 py-4 text-right">
                  <p className="text-xs font-black uppercase text-emerald-700">{t('amountDue')}</p>
                  <p className="text-3xl font-black text-emerald-900">${rental?.total || 0}</p>
                </div>
              </div>

              <form onSubmit={handlePay} className="space-y-5 rounded-lg bg-slate-50 p-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-black text-slate-700">{t('paymentProvider')}</span>
                    <select value={provider} onChange={(event) => setProvider(event.target.value)} className="w-full rounded-lg border border-slate-200 bg-white p-4 font-bold outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100">
                      <option value="DEMO">Demo provider</option>
                      <option value="STRIPE">Stripe-ready</option>
                      <option value="PAYPAL">PayPal-ready</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-black text-slate-700">{t('paymentMethod')}</span>
                    <select value={method} onChange={(event) => setMethod(event.target.value)} className="w-full rounded-lg border border-slate-200 bg-white p-4 font-bold outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100">
                      <option value="card">{t('card')}</option>
                      <option value="paypal">PayPal</option>
                      <option value="wallet">{t('digitalWallet')}</option>
                    </select>
                  </label>
                </div>

                <div className="rounded-lg border border-dashed border-emerald-300 bg-white p-5">
                  <div className="flex items-start gap-4">
                    <CreditCard className="mt-1 h-7 w-7 text-emerald-700" />
                    <div>
                      <h3 className="text-lg font-black text-slate-950">{t('tokenizedPaymentBox')}</h3>
                      <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{t('tokenizedPaymentText')}</p>
                      <p className="mt-3 rounded-lg bg-slate-950 px-3 py-2 text-xs font-black text-white">{demoToken}</p>
                    </div>
                  </div>
                </div>

                {latestPayment && (
                  <div className="flex items-center justify-between rounded-lg bg-white px-4 py-3 text-sm font-bold text-slate-700">
                    <span className="inline-flex items-center gap-2">
                      <ReceiptText className="h-4 w-4 text-cwd-blue" />
                      {t('paymentStatus')}
                    </span>
                    <span className="rounded-lg bg-cyan-50 px-3 py-1 text-xs font-black uppercase text-cyan-800">{latestPayment.status}</span>
                  </div>
                )}

                {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</div>}
                {message && <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">{message}</div>}

                <button
                  type="submit"
                  disabled={submitting || alreadyPaid || !rental}
                  className="inline-flex w-full items-center justify-center gap-3 rounded-lg bg-gradient-to-r from-emerald-600 to-sky-700 px-6 py-4 font-black text-white shadow-xl shadow-sky-900/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? <RefreshCw className="h-5 w-5 animate-spin" /> : <ShieldCheck className="h-5 w-5" />}
                  {alreadyPaid ? t('paymentAlreadyPaid') : t('payNow')}
                </button>

                <Link to="/account/bookings" className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-800">
                  <BadgeCheck className="h-4 w-4" />
                  {t('viewMyRentals')}
                </Link>
              </form>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default PaymentPage;
