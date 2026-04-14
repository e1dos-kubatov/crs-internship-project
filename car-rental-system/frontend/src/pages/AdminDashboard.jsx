import { useState, useEffect } from 'react'
import { Users, BarChart3, CarFront, Calendar, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const AdminDashboard = () => {
  const { user } = useAuth()
  const [stats] = useState({
    totalUsers: 1248,
    totalCars: 356,
    totalBookings: 2894,
    totalRevenue: 124560
  })
  const [recentLogs, setRecentLogs] = useState([])

  useEffect(() => {
    // Mock data
    setRecentLogs([
      { action: 'BAN_USER', userId: 45, timestamp: '2 min ago', details: 'Spam activity' },
      { action: 'DELETE_CAR', userId: 23, timestamp: '1 hour ago', details: 'Car ID 156' },
      { action: 'APPROVE_ORDER', userId: 67, timestamp: '3 hours ago', details: 'Partner order #89' }
    ])
  }, [])

  return (
    <div className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-xl text-gray-600 mt-2">Welcome back, {user?.name}</p>
          </div>
          <div className="flex items-center mt-4 lg:mt-0">
            <button className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors mr-4">
              Generate Report
            </button>
            <button className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-xl transition-colors">
              Export Data
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mr-4">
                <Users className="w-7 h-7 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mr-4">
                <CarFront className="w-7 h-7 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Cars</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalCars}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mr-4">
                <Calendar className="w-7 h-7 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Bookings</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mr-4">
                <BarChart3 className="w-7 h-7 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-3xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Users Table */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-xl rounded-3xl p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold">Users Management</h3>
                <Link to="/admin/users" className="btn-primary px-6 py-2.5">
                  View All
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* Mock rows */}
                    <tr>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-3">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <span className="font-medium text-gray-900">John Doe</span>
                        </div>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-sm text-gray-900">john@example.com</td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full">
                          Customer
                        </span>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                        <button className="text-red-600 hover:text-red-900">Ban</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Recent Audit Logs */}
          <div>
            <div className="bg-white shadow-xl rounded-3xl p-8 sticky top-24">
              <div className="flex items-center mb-8">
                <h3 className="text-2xl font-bold mr-3">Recent Activity</h3>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div className="space-y-4">
                {recentLogs.map((log, i) => (
                  <div key={i} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0 mt-2"></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-gray-900">{log.action}</span>
                        <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full font-medium">
                          User #{log.userId}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{log.details}</p>
                      <p className="text-xs text-gray-500 mt-1">{log.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/admin/logs" className="block mt-8 text-center text-indigo-600 hover:text-indigo-700 font-medium pt-4 border-t">
                View all logs →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

