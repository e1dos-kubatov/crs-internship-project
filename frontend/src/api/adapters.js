const carImages = [
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1545156534-ef7f3b606a5d?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=900&q=80',
];

const normalizeText = (value) => String(value || '').trim();

export const normalizeRole = (role) => {
  const normalized = String(role || '').replace('ROLE_', '').toLowerCase();
  if (normalized === 'superadmin') return 'admin';
  if (normalized === 'administrator') return 'admin';
  if (normalized === 'partner') return 'partner';
  if (normalized === 'admin') return 'admin';
  return normalized || 'partner';
};

export const normalizeUser = (user) => ({
  ...user,
  role: normalizeRole(user?.role),
});

export const carFromApi = (car) => {
  const brand = normalizeText(car.brand);
  const model = normalizeText(car.model);
  const name = `${brand} ${model}`.trim() || 'Rental car';
  const index = Number(car.id || 0) % carImages.length;

  return {
    ...car,
    id: car.id,
    brand,
    modelName: model,
    model: { en: name, ru: name, kg: name },
    year: car.year,
    vin: car.vin,
    price: Number(car.pricePerDay || car.price || 0),
    pricePerDay: Number(car.pricePerDay || car.price || 0),
    description: car.description || 'Comfortable city-ready rental car with verified owner details.',
    transmission: car.transmission || 'Auto',
    fuel: car.fuel || 'gas',
    type: car.type || 'sedan',
    seats: car.seats || 5,
    img: car.img || carImages[index],
    available: Boolean(car.available),
    status: car.status || 'APPROVED',
  };
};

export const carToApi = (car) => ({
  brand: car.brand?.trim() || car.model?.en?.split(' ')[0] || 'Car',
  model: car.modelName?.trim() || car.model?.en?.trim() || 'Model',
  year: Number(car.year || new Date().getFullYear()),
  vin: String(car.vin || '').trim().toUpperCase(),
  pricePerDay: Number(car.price || car.pricePerDay || 0),
  description: car.description || '',
});

export const rentalFromApi = (rental) => ({
  ...rental,
  car: `${rental.carBrand || ''} ${rental.carModel || ''}`.trim() || `Car #${rental.carId}`,
  pickup: rental.startDate,
  dropoff: rental.endDate,
  total: Number(rental.totalPrice || 0),
  status: String(rental.status || '').toLowerCase(),
});

export const orderFromApi = (order) => ({
  ...order,
  car: `${order.brand || ''} ${order.model || ''}`.trim() || `Order #${order.id}`,
  price: Number(order.pricePerDay || 0),
  status: String(order.status || '').toLowerCase(),
});
