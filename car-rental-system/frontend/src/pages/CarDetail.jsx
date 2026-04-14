import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CarFront, Calendar, DollarSign, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import { api, parseApiError } from '../lib/api'

const CarDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await api.get(`/cars/${id}`)
        setCar(res.data?.data || null)
      } catch (error) {
        toast.error(parseApiError(error, 'Failed to load car'))
      } finally {
        setLoading(false)
      }
    }

    fetchCar()
  }, [id])

  const totalPrice = useMemo(() => {
    if (!car || !startDate || !endDate) return 0
    const from = new Date(startDate)
    const to = new Date(endDate)
    const days = Math.floor((to - from) / (1000 * 60 * 60 * 24)) + 1
    if (days <= 0) return 0
    return Number(car.pricePerDay) * days
  }, [car, startDate, endDate])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!car) {
    return (
      <div className="py-20 px-4">
        <div className="max-w-4xl mx-auto bg-white border rounded-2xl p-10 text-center">
          <h2 className="text-2xl font-bold mb-2">Car not found</h2>
          <Link className="btn-primary" to="/cars">Back to catalog</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <Link to="/cars" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-8">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to catalog
        </Link>

        <div className="grid lg:grid-cols-2 gap-10">
          <div className="bg-gradient-to-br from-slate-100 to-blue-100 rounded-3xl p-8 flex items-center justify-center min-h-[380px]">
            <CarFront className="w-40 h-40 text-blue-600" />
          </div>

          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{car.brand} {car.model}</h1>
            <p className="text-gray-600 mb-6">Year {car.year} • VIN {car.vin}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white border rounded-xl p-4">
                <div className="text-sm text-gray-500 mb-1">Daily price</div>
                <div className="text-3xl font-bold text-blue-600 flex items-center gap-2">
                  <DollarSign className="w-6 h-6" />
                  {Number(car.pricePerDay).toFixed(0)}
                </div>
              </div>
              <div className="bg-white border rounded-xl p-4">
                <div className="text-sm text-gray-500 mb-1">Availability</div>
                <div className="text-lg font-semibold text-green-700 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" />
                  {car.available ? 'Available now' : 'Not available'}
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4">Plan your booking</h3>

              <div className="grid md:grid-cols-2 gap-4 mb-5">
                <label className="text-sm">
                  <span className="text-gray-600">Start date</span>
                  <div className="relative mt-1">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="date"
                      className="w-full pl-10 pr-3 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={startDate}
                      onChange={(event) => setStartDate(event.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </label>

                <label className="text-sm">
                  <span className="text-gray-600">End date</span>
                  <div className="relative mt-1">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="date"
                      className="w-full pl-10 pr-3 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={endDate}
                      onChange={(event) => setEndDate(event.target.value)}
                      min={startDate || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </label>
              </div>

              <div className="flex items-center justify-between border-t pt-4 mb-5">
                <span className="text-gray-600">Estimated total</span>
                <span className="text-2xl font-bold text-blue-600">${totalPrice.toFixed(0)}</span>
              </div>

              <button
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold py-3 rounded-xl hover:from-emerald-700 hover:to-emerald-800 disabled:opacity-50"
                onClick={() => {
                  if (!startDate || !endDate) {
                    toast.error('Select start and end dates')
                    return
                  }
                  navigate(`/booking/${car.id}?startDate=${startDate}&endDate=${endDate}`)
                }}
                disabled={!car.available}
              >
                Continue to booking
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarDetail
