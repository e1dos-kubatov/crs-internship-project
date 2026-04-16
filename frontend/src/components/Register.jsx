import React, { useState } from 'react';
import { ArrowLeft, Mail, Phone, UserRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setSubmitting(true);
    setError('');
    const result = await register(formData.name, formData.email, formData.password);
    setSubmitting(false);

    if (result.success) {
      navigate('/account');
    } else {
      setError(result.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#fff7ed,#f8fafc_45%,#e0f2fe)] px-4 py-16">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-2xl backdrop-blur sm:p-12">
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="mb-8 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </button>

        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-sky-700">Partner access</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950">Create your account</h2>
          <p className="mt-3 text-slate-600">
            New users are created as PARTNER, so they can book cars and submit cars for admin approval.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Full name</span>
              <span className="relative block">
                <UserRound className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-12 py-4 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                  placeholder="Kanat Kamilov"
                  required
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Email</span>
              <span className="relative block">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-12 py-4 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                  placeholder="partner@mail.com"
                  required
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Phone</span>
              <span className="relative block">
                <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-12 py-4 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                  placeholder="+996..."
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Password</span>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => updateField('password', e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-4 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Confirm password</span>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => updateField('confirmPassword', e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-4 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                required
              />
            </label>
          </div>

          {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-2xl bg-gradient-to-r from-sky-700 to-slate-950 px-6 py-4 font-black text-white shadow-xl shadow-sky-900/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
