import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import CarCatalog from './pages/CarCatalog'
import CarDetail from './pages/CarDetail'
import Booking from './pages/Booking'
import UserDashboard from './pages/UserDashboard'
import AdminDashboard from './pages/AdminDashboard'
import Contact from './pages/Contact'
import About from './pages/About'
import ProtectedRoute from './routes/ProtectedRoute'
import AuthProvider from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cars" element={<CarCatalog />} />
            <Route path="/cars/:id" element={<CarDetail />} />
            <Route path="/booking/:id" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <footer className="bg-white border-t mt-20">
          <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-gray-500">&copy; 2024 Car Rental System. All rights reserved.</p>
          </div>
        </footer>
        <Toaster />
      </div>
    </AuthProvider>
  )
}

export default App

