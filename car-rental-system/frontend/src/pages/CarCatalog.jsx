import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CarFront, Filter, Search, ArrowUpDown, Gauge } from 'lucide-react'
import toast from 'react-hot-toast'
import { api, parseApiError } from '../lib/api'

const CarCatalog = () => {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [brandFilter, setBrandFilter] = useState('')
  const [sortBy, setSortBy] = useState('price-asc')

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await api.get('/cars')
        setCars(res.data?.data || [])
      } catch (error) {
        toast.error(parseApiError(error, 'Failed to load cars'))
      } finally {
        setLoading(false)
      }
    }

    fetchCars()
  }, [])

  const brands = useMemo(
    () => [...new Set(cars.map((car) => car.brand).filter(Boolean))].sort(),
    [cars]
  )

  const filteredCars = useMemo(() => {
    const term = search.trim().toLowerCase()
    let data = cars.filter((car) => {
      const matchesSearch =
        !term ||
        `${car.brand} ${car.model}`.toLowerCase().includes(term) ||
        String(car.year || '').includes(term)
      const matchesBrand = !brandFilter || car.brand === brandFilter
      return matchesSearch && matchesBrand
    })

    switch (sortBy) {
      case 'price-desc':
        data = [...data].sort((a, b) => Number(b.pricePerDay) - Number(a.pricePerDay))
        break
      case 'year-desc':
        data = [...data].sort((a, b) => Number(b.year) - Number(a.year))
        break
      case 'brand-asc':
        data = [...data].sort((a, b) => `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`))
        break
      default:
        data = [...data].sort((a, b) => Number(a.pricePerDay) - Number(b.pricePerDay))
        break
    }

    return data
  }, [cars, search, brandFilter, sortBy])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Fleet Marketplace</h1>
          <p className="text-gray-600 text-lg">Compare prices, filter by brand, and reserve instantly.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border rounded-2xl p-5">
            <p className="text-sm text-gray-500">Available now</p>
            <p className="text-3xl font-bold text-gray-900">{cars.length}</p>
          </div>
          <div className="bg-white border rounded-2xl p-5">
            <p className="text-sm text-gray-500">Lowest daily price</p>
            <p className="text-3xl font-bold text-blue-600">
              ${cars.length ? Math.min(...cars.map((car) => Number(car.pricePerDay))).toFixed(0) : '0'}
            </p>
          </div>
          <div className="bg-white border rounded-2xl p-5">
            <p className="text-sm text-gray-500">Brands</p>
            <p className="text-3xl font-bold text-gray-900">{brands.length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by brand, model, year..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={brandFilter}
              onChange={(event) => setBrandFilter(event.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All brands</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="year-desc">Newest first</option>
              <option value="brand-asc">Brand A-Z</option>
            </select>
          </div>
        </div>

        {filteredCars.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border">
            <CarFront className="w-20 h-20 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No cars match your filters</h3>
            <button
              onClick={() => {
                setSearch('')
                setBrandFilter('')
                setSortBy('price-asc')
              }}
              className="btn-primary mt-4"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCars.map((car) => (
              <Link key={car.id} to={`/cars/${car.id}`} className="group">
                <article className="bg-white rounded-2xl border shadow-sm hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                  <div className="h-44 rounded-t-2xl bg-gradient-to-br from-slate-100 to-blue-100 flex items-center justify-center">
                    <CarFront className="w-20 h-20 text-blue-600" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h2 className="text-xl font-bold text-gray-900">{car.brand} {car.model}</h2>
                      <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">Available</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-500 gap-2 mb-4">
                      <Gauge className="w-4 h-4" />
                      <span>{car.year}</span>
                      <span>• VIN {car.vin?.slice(-6)}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500">Per day</p>
                        <p className="text-2xl font-bold text-blue-600">${Number(car.pricePerDay).toFixed(0)}</p>
                      </div>
                      <span className="text-sm text-gray-500">View details</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CarCatalog
