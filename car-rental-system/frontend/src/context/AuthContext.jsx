import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { api, parseApiError } from '../lib/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      api.get('/auth/me')
        .then(res => {
          setUser(res.data.data)
        })
        .catch(() => {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password, partnerAccess = false) => {
    try {
      const res = await api.post('/auth/login', { email, password, partnerAccess })
      const token = res.data.data.token
      localStorage.setItem('token', token)
      const userData = await api.get('/auth/me')
      setUser(userData.data.data)
      toast.success('Login successful!')
      return { success: true }
    } catch (error) {
      toast.error(parseApiError(error, 'Login failed'))
      return { success: false }
    }
  }

  const loginWithToken = async (token) => {
    try {
      localStorage.setItem('token', token)
      const userData = await api.get('/auth/me')
      setUser(userData.data.data)
      return { success: true }
    } catch (error) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      return { success: false }
    }
  }

  const register = async (name, email, password) => {
    try {
      const res = await api.post('/auth/register', { name, email, password })
      const token = res.data.data.token
      localStorage.setItem('token', token)
      const userData = await api.get('/auth/me')
      setUser(userData.data.data)
      toast.success('Registration successful!')
      return { success: true }
    } catch (error) {
      toast.error(parseApiError(error, 'Registration failed'))
      return { success: false }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    toast.success('Logged out successfully')
    navigate('/')
  }

  const value = {
    user,
    login,
    loginWithToken,
    register,
    logout,
    loading,
    isAdmin: user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_SUPERADMIN',
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider

