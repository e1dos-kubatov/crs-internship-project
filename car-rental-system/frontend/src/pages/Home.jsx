import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CarFront, CalendarDays, ShieldCheck, Star, Sparkles, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { api, parseApiError } from '../lib/api'

const Home = () => {
  const { user } = useAuth()
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await api.get('/cars')
        setCars(res.data?.data || [])
      } catch (error) {
        toast.error(parseApiError(error, 'Unable to load marketplace data'))
      } finally {
        setLoading(false)
      }
    }

    fetchCars()
  }, [])

  const featuredCars = useMemo(
    () => [...cars].sort((a, b) => Number(a.pricePerDay) - Number(b.pricePerDay)).slice(0, 6),
    [cars]
  )

  const marketStats = useMemo(() => {
    const minPrice = cars.length ? Math.min(...cars.map((car) => Number(car.pricePerDay))) : 0
    const maxPrice = cars.length ? Math.max(...cars.map((car) => Number(car.pricePerDay))) : 0
    return { inventory: cars.length, minPrice, maxPrice }
  }, [cars])

  const searchHref = query.trim() ? `/cars?search=${encodeURIComponent(query.trim())}` : '/cars'

  return (
    <div className="bg-[#f8fafc]">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#0ea5e920,transparent_40%),radial-gradient(circle_at_80%_0%,#1d4ed830,transparent_35%),linear-gradient(120deg,#0f172a,#1e293b)]" />
        <div className="absolute -top-10 -right-10 w-72 h-72 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-10 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 text-white">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="inline-flex items-center gap-2 text-sm px-3 py-1 rounded-full bg-white/10 border border-white/20 mb-5">
                <Sparkles className="w-4 h-4 text-cyan-300" />
                Premium Car Rental Marketplace
              </p>

              <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
                Drive Extraordinary
                <span className="block text-cyan-300">Cars in Dubai</span>
              </h1>
              <p className="text-lg text-slate-200 max-w-xl mb-8">
                Live inventory from our Spring Boot platform. Real prices, real availability, and instant booking
                confirmation through your account dashboard.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search brand or model..."
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                  />
                </div>
                <Link
                  to={searchHref}
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-900 font-semibold transition"
                >
                  Search Cars
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="bg-white/10 rounded-xl px-4 py-3 border border-white/20">
                  <p className="text-slate-300">Inventory</p>
                  <p className="text-2xl font-bold">{loading ? '...' : marketStats.inventory}</p>
                </div>
                <div className="bg-white/10 rounded-xl px-4 py-3 border border-white/20">
                  <p className="text-slate-300">From</p>
                  <p className="text-2xl font-bold">${loading ? '...' : marketStats.minPrice.toFixed(0)}</p>
                </div>
                <div className="bg-white/10 rounded-xl px-4 py-3 border border-white/20">
                  <p className="text-slate-300">Top tier</p>
                  <p className="text-2xl font-bold">${loading ? '...' : marketStats.maxPrice.toFixed(0)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-7">
              <h2 className="text-2xl font-bold mb-6">Why renters trust this platform</h2>
              <div className="space-y-4 text-slate-100">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-cyan-300 mt-1" />
                  <div>
                    <p className="font-semibold">Secure auth + JWT sessions</p>
                    <p className="text-sm text-slate-300">Google and GitHub OAuth2 with backend token validation.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CalendarDays className="w-5 h-5 text-cyan-300 mt-1" />
                  <div>
                    <p className="font-semibold">Real-time booking logic</p>
                    <p className="text-sm text-slate-300">Date overlap checks and availability validation in Spring service layer.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-cyan-300 mt-1" />
                  <div>
                    <p className="font-semibold">Database-backed records</p>
                    <p className="text-sm text-slate-300">Cars and rentals persist in PostgreSQL and are visible in pgAdmin.</p>
                  </div>
                </div>
              </div>

              <div className="mt-7">
                {!user ? (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link to="/register" className="btn-primary flex-1 text-center">Create Account</Link>
                    <Link to="/login" className="btn-secondary flex-1 text-center">Sign In</Link>
                  </div>
                ) : (
                  <Link to="/dashboard" className="btn-primary w-full text-center inline-block">
                    Open My Dashboard
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Featured inventory</h2>
              <p className="text-slate-600 mt-2">Loaded directly from `/api/cars`</p>
            </div>
            <Link to="/cars" className="text-blue-700 font-semibold hover:text-blue-800">View all</Link>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-64 bg-white border rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {featuredCars.map((car) => (
                <Link key={car.id} to={`/cars/${car.id}`} className="group">
                  <article className="bg-white border rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                    <div className="h-44 bg-gradient-to-br from-slate-100 to-blue-100 rounded-t-2xl flex items-center justify-center">
                      <CarFront className="w-20 h-20 text-blue-600" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{car.brand} {car.model}</h3>
                      <p className="text-slate-500 text-sm mb-4">Year {car.year} • VIN ending {car.vin?.slice(-6)}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-2xl font-bold text-blue-700">${Number(car.pricePerDay).toFixed(0)}</p>
                        <span className="text-sm px-2 py-1 rounded-full bg-emerald-100 text-emerald-800">Available</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home
