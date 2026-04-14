import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LogOut, User, Car, Shield } from 'lucide-react'

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth()

  return (
    <nav className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Car className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">CarRental</span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link to="/cars" className="text-gray-600 hover:text-blue-600 font-medium hidden md:block">
              Cars
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-blue-600 font-medium hidden md:block">
              Contact
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-blue-600 font-medium hidden md:block">
              About
            </Link>

            {user ? (
              <div className="flex items-center space-x-2">
                {isAdmin && (
                  <Link to="/admin" className="p-2 text-gray-600 hover:text-blue-600 rounded-lg">
                    <Shield className="w-5 h-5" />
                  </Link>
                )}
                <Link to="/dashboard" className="p-2 text-gray-600 hover:text-blue-600 rounded-lg">
                  <User className="w-5 h-5" />
                </Link>
                <button onClick={logout} className="p-2 text-gray-600 hover:text-red-600 rounded-lg">
                  <LogOut className="w-5 h-5" />
                </button>
                <span className="font-medium text-gray-900 hidden md:block">{user.name}</span>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-secondary hidden md:block">
                  Login
                </Link>
                <Link to="/register" className="btn-primary hidden md:block">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

