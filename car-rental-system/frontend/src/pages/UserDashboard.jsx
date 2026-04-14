import { useEffect, useMemo, useState } from 'react'
import { Calendar, Receipt, User, CarFront, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { api, parseApiError } from '../lib/api'

const UserDashboard = () => {
  const { user, logout } = useAuth()
  const [rentals, setRentals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const res = await api.get('/rentals/my-rentals')
        setRentals(res.data?.data || [])
      } catch (error) {
        toast.error(parseApiError(error, 'Failed to load rentals'))
      } finally {
        setLoading(false)
      }
    }

    fetchRentals()
  }, [])

  const stats = useMemo(() => {
    const totalSpent = rentals.reduce((sum, rental) => sum + Number(rental.totalPrice || 0), 0)
    const active = rentals.filter((rental) => rental.status === 'ACTIVE').length
    return { totalSpent, active, totalRentals: rentals.length }
  }, [rentals])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow-xl rounded-3xl p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}</h1>
                <p className="text-gray-600">Track current rentals and spending at a glance.</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border rounded-2xl p-6">
            <p className="text-sm text-gray-500">Total rentals</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalRentals}</p>
          </div>
          <div className="bg-white border rounded-2xl p-6">
            <p className="text-sm text-gray-500">Active rentals</p>
            <p className="text-3xl font-bold text-emerald-600">{stats.active}</p>
          </div>
          <div className="bg-white border rounded-2xl p-6">
            <p className="text-sm text-gray-500">Total spent</p>
            <p className="text-3xl font-bold text-blue-600">${stats.totalSpent.toFixed(0)}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white shadow-xl rounded-3xl p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-blue-600" />
              Rental timeline
            </h2>

            {rentals.length === 0 ? (
              <div className="text-center py-14 border rounded-2xl bg-gray-50">
                <CarFront className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No rentals yet</h3>
                <Link to="/cars" className="btn-primary inline-flex items-center mt-2">
                  Browse Cars
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {rentals.map((rental) => (
                  <div key={rental.id} className="border rounded-2xl p-5 hover:shadow-sm transition">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{rental.carBrand} {rental.carModel}</h3>
                        <p className="text-sm text-gray-500">
                          {rental.startDate} to {rental.endDate}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                          {rental.status}
                        </span>
                        <span className="text-xl font-bold text-emerald-600">${Number(rental.totalPrice).toFixed(0)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white shadow-xl rounded-3xl p-8">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                Next step
              </h3>
              <p className="text-gray-600 mb-5">Explore current inventory and reserve your next car in minutes.</p>
              <Link to="/cars" className="btn-primary inline-flex w-full justify-center">Find available cars</Link>
            </div>

            <div className="bg-gradient-to-br from-indigo-500 to-blue-600 text-white rounded-3xl p-8">
              <h3 className="text-xl font-bold mb-2">Billing & receipts</h3>
              <p className="opacity-90 mb-5">All completed rentals include receipts in your rental history.</p>
              <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl">
                <Receipt className="w-4 h-4" />
                <span>Always available</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
