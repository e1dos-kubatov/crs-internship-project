import React, { useCallback, useEffect, useState } from 'react';
import { Check, Pencil, Plus, RefreshCcw, Trash2, X } from 'lucide-react';
import { carsApi } from '../api/client';
import { carFromApi } from '../api/adapters';
import { useAuth } from '../context/AuthContext';
import { useRental } from '../context/RentalContext';

const emptyCar = {
  brand: '',
  modelName: '',
  year: new Date().getFullYear(),
  vin: '',
  price: '',
  transmission: 'auto',
  fuel: 'gas',
  images: ['', '', ''],
  description: '',
};

const statusBadge = {
  APPROVED: 'bg-emerald-100 text-emerald-700',
  PENDING: 'bg-amber-100 text-amber-700',
  REJECTED: 'bg-red-100 text-red-700',
};

const ManageCars = () => {
  const { user } = useAuth();
  const { getMyCars, getAdminCars, saveCar, createOrder, deleteCar } = useRental();
  const [cars, setCars] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newCar, setNewCar] = useState(emptyCar);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === 'admin';

  const loadCars = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setCars(isAdmin ? await getAdminCars() : await getMyCars());
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, [getAdminCars, getMyCars, isAdmin]);

  useEffect(() => {
    loadCars();
  }, [loadCars]);

  const resetForm = () => {
    setNewCar(emptyCar);
    setEditingId(null);
    setShowForm(false);
  };

  const updateField = (field, value) => setNewCar((prev) => ({ ...prev, [field]: value }));

  const updateImage = (index, value) => {
    setNewCar((prev) => {
      const images = [...(prev.images || ['', '', ''])];
      images[index] = value;
      return { ...prev, images };
    });
  };

  const handleImageUpload = (index, file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => updateImage(index, reader.result);
    reader.readAsDataURL(file);
  };

  const validate = () => {
    if (!newCar.brand || !newCar.modelName || !newCar.vin) return 'Brand, model, and VIN are required';
    if (String(newCar.vin).replaceAll(' ', '').length < 11) return 'VIN must be at least 11 characters';
    if (Number(newCar.price) <= 0) return 'Price must be greater than zero';
    return '';
  };

  const submitCar = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setNotice('');
    try {
      if (editingId) {
        await saveCar(newCar, editingId);
        setNotice('Car updated. Partner edits return to pending approval.');
      } else if (isAdmin) {
        await saveCar(newCar);
        setNotice('Admin car created and approved immediately.');
      } else {
        await createOrder(newCar);
        setNotice('Car submitted to admin for approval.');
      }
      resetForm();
      await loadCars();
    } catch (submitError) {
      setError(submitError.message);
    }
  };

  const editCar = (car) => {
    setEditingId(car.id);
    setNewCar({
      brand: car.brand,
      modelName: car.modelName,
      year: car.year,
      vin: car.vin,
      price: car.price,
      transmission: car.transmission || 'auto',
      fuel: car.fuel || 'gas',
      images: car.images || [car.img || '', '', ''],
      description: car.description,
    });
    setShowForm(true);
  };

  const removeCar = async (id) => {
    if (!confirm('Delete this car from the backend?')) return;
    setError('');
    try {
      await deleteCar(id);
      setCars((prev) => prev.filter((car) => car.id !== id));
      setNotice('Car deleted.');
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  const decideCar = async (id, decision) => {
    setError('');
    try {
      const updated = carFromApi(await carsApi.decide(id, { decision, adminNote: decision === 'APPROVE' ? 'Approved from React admin dashboard' : 'Rejected from React admin dashboard' }));
      setCars((prev) => prev.map((car) => car.id === id ? updated : car));
      setNotice(`Car ${decision.toLowerCase()}d.`);
    } catch (decisionError) {
      setError(decisionError.message);
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-600">{isAdmin ? 'Admin fleet' : 'Partner garage'}</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">Manage cars</h1>
          <p className="mt-2 text-slate-600">{isAdmin ? 'Approve, reject, edit, or create cars.' : 'Submit your cars for admin approval and manage your listings.'}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={loadCars} className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 font-bold text-slate-800 shadow">
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </button>
          <button
            onClick={() => {
              setShowForm((prev) => !prev);
              setEditingId(null);
              setNewCar(emptyCar);
            }}
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 font-black text-white shadow-xl"
          >
            <Plus className="h-4 w-4" />
            {showForm ? 'Close form' : 'Add car'}
          </button>
        </div>
      </div>

      {error && <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>}
      {notice && <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{notice}</div>}

      {showForm && (
        <div className="mb-8 rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-xl backdrop-blur md:p-8">
          <h2 className="mb-6 text-2xl font-black text-slate-950">{editingId ? 'Edit car' : isAdmin ? 'Create approved car' : 'Submit partner car'}</h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <input placeholder="Brand" value={newCar.brand} onChange={(e) => updateField('brand', e.target.value)} className="rounded-2xl border border-slate-200 p-4 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100" />
            <input placeholder="Model" value={newCar.modelName} onChange={(e) => updateField('modelName', e.target.value)} className="rounded-2xl border border-slate-200 p-4 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100" />
            <input type="number" placeholder="Year" value={newCar.year} onChange={(e) => updateField('year', e.target.value)} className="rounded-2xl border border-slate-200 p-4 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100" />
            <input placeholder="VIN, 11-17 chars" value={newCar.vin} onChange={(e) => updateField('vin', e.target.value)} className="rounded-2xl border border-slate-200 p-4 uppercase outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100" />
            <input type="number" placeholder="Price per day" value={newCar.price} onChange={(e) => updateField('price', e.target.value)} className="rounded-2xl border border-slate-200 p-4 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100" />
            <select value={newCar.transmission} onChange={(e) => updateField('transmission', e.target.value)} className="rounded-2xl border border-slate-200 p-4 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100">
              <option value="auto">Auto</option>
              <option value="manual">Manual</option>
            </select>
            <select value={newCar.fuel} onChange={(e) => updateField('fuel', e.target.value)} className="rounded-2xl border border-slate-200 p-4 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100">
              <option value="gas">Gas</option>
              <option value="diesel">Diesel</option>
              <option value="hybrid">Hybrid</option>
            </select>
            <div className="md:col-span-2">
              <p className="mb-3 text-sm font-bold text-slate-700">Car images, up to 3 from your device</p>
              <div className="grid gap-4 md:grid-cols-3">
                {[0, 1, 2].map((index) => (
                  <div key={index} className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-3">
                    {newCar.images?.[index] ? (
                      <img src={newCar.images[index]} alt={`Car upload ${index + 1}`} className="mb-3 h-32 w-full rounded-xl object-cover" />
                    ) : (
                      <div className="mb-3 grid h-32 place-items-center rounded-xl bg-slate-100 text-sm font-bold text-slate-400">
                        Image {index + 1}
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(index, e.target.files?.[0])}
                      className="w-full text-xs text-slate-600 file:mr-2 file:rounded-full file:border-0 file:bg-cwd-blue file:px-3 file:py-2 file:text-xs file:font-bold file:text-white"
                    />
                    {newCar.images?.[index] && (
                      <button type="button" onClick={() => updateImage(index, '')} className="mt-2 text-xs font-bold text-red-600 hover:text-red-700">
                        Remove image
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <textarea placeholder="Description" value={newCar.description} onChange={(e) => updateField('description', e.target.value)} className="min-h-28 rounded-2xl border border-slate-200 p-4 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 md:col-span-2" />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={submitCar} className="rounded-2xl bg-emerald-600 px-6 py-3 font-black text-white hover:bg-emerald-700">
              {editingId ? 'Update car' : isAdmin ? 'Create car' : 'Send for approval'}
            </button>
            <button type="button" onClick={resetForm} className="rounded-2xl bg-slate-200 px-6 py-3 font-black text-slate-800 hover:bg-slate-300">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <p className="text-slate-500">Loading cars...</p>
        ) : cars.length === 0 ? (
          <div className="rounded-[2rem] bg-white/85 p-8 text-slate-600 shadow-xl">No cars yet. Add your first car to start.</div>
        ) : cars.map((car) => (
          <div key={car.id} className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 shadow-xl backdrop-blur">
            <img src={car.img} alt={car.model.en} className="h-52 w-full object-cover" />
            <div className="p-6">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black text-slate-950">{car.model.en}</h3>
                  <p className="text-sm text-slate-500">VIN {car.vin}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-black uppercase ${statusBadge[car.status] || 'bg-slate-100 text-slate-700'}`}>
                  {car.status}
                </span>
              </div>
              <p className="mb-5 line-clamp-2 text-sm text-slate-600">{car.description}</p>
              <div className="mb-5 flex items-center justify-between">
                <span className="font-bold text-slate-500">{car.year}</span>
                <strong className="text-2xl text-cwd-blue">${car.price}/day</strong>
              </div>
              <div className="mb-5 flex flex-wrap gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold capitalize text-slate-700">{car.transmission}</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold capitalize text-slate-700">{car.fuel}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => editCar(car)} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-700 px-4 py-3 font-bold text-white">
                  <Pencil className="h-4 w-4" />
                  Edit
                </button>
                <button onClick={() => removeCar(car.id)} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3 font-bold text-white">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
                {isAdmin && car.status !== 'APPROVED' && (
                  <button onClick={() => decideCar(car.id, 'APPROVE')} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 font-bold text-white">
                    <Check className="h-4 w-4" />
                    Approve
                  </button>
                )}
                {isAdmin && car.status !== 'REJECTED' && (
                  <button onClick={() => decideCar(car.id, 'REJECT')} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-800 px-4 py-3 font-bold text-white">
                    <X className="h-4 w-4" />
                    Reject
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageCars;
