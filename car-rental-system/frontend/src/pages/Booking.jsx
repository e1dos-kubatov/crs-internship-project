import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Calendar, CarFront, CreditCard } from 'lucide-react'
import toast from 'react-hot-toast'
import { api, parseApiError } from '../lib/api'

const Booking = () => {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [car, setCar] = useState(null)
  const [startDate, setStartDate] = useState(searchParams.get('startDate') || '')
  const [endDate, setEndDate] = useState(searchParams.get('endDate') || '')
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await api.get(`/cars/${id}`)
        setCar(res.data?.data || null)
      } catch (error) {
        toast.error(parseApiError(error, 'Failed to load booking data'))
      } finally {
        setLoading(false)
      }
    }
    fetchCar()
  }, [id])

  const totalDays = useMemo(() => {
    if (!startDate || !endDate) return 0
    const days = Math.floor((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1
    return days > 0 ? days : 0
  }, [startDate, endDate])

  const totalPrice = useMemo(
    () => totalDays * Number(car?.pricePerDay || 0),
    [totalDays, car]
  )

  const handleBook = async () => {
    if (!startDate || !endDate) {
      toast.error('Please select dates')
      return
    }

    if (totalDays <= 0) {
      toast.error('End date must be after start date')
      return
    }

    setBooking(true)
    try {
      await api.post('/rentals', {
        carId: Number(id),
        startDate,
        endDate,
      })
      toast.success('Booking confirmed')
      navigate('/dashboard')
    } catch (error) {
      toast.error(parseApiError(error, 'Booking failed'))
    } finally {
      setBooking(false)
    }
  }

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
        <div className="max-w-3xl mx-auto bg-white border rounded-2xl p-10 text-center">
          <h2 className="text-2xl font-bold mb-3">Unable to create booking</h2>
          <Link className="btn-primary" to="/cars">Return to catalog</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back
        </button>

        <div className="bg-white shadow-2xl rounded-3xl overflow-hidden">
          <div className="p-10">
            <div className="flex items-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mr-5">
                <CarFront className="w-9 h-9 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{car.brand} {car.model}</h1>
                <p className="text-gray-600">Year {car.year}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-10">
              <div>
                <h3 className="text-xl font-bold mb-4">Rental period</h3>
                <div className="space-y-4">
                  <label className="block">
                    <span className="text-sm text-gray-600">Start date</span>
                    <div className="relative mt-1">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="date"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={startDate}
                        onChange={(event) => setStartDate(event.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </label>
                  <label className="block">
                    <span className="text-sm text-gray-600">End date</span>
                    <div className="relative mt-1">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="date"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={endDate}
                        onChange={(event) => setEndDate(event.target.value)}
                        min={startDate || new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </label>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border">
                <h4 className="font-semibold text-gray-900 mb-4">Payment summary</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price per day</span>
                    <span className="font-semibold">${Number(car.pricePerDay).toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Days</span>
                    <span className="font-semibold">{totalDays}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-emerald-600">${totalPrice.toFixed(0)}</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleBook}
              disabled={booking || totalDays <= 0}
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:from-emerald-700 hover:to-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <CreditCard className="w-5 h-5" />
              {booking ? 'Creating booking...' : 'Confirm booking'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Booking
