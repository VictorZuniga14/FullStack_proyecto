'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import api from '@/config/api'
import { useRouter } from 'next/navigation'

interface User {
  id: number
  username: string
  nombre: string
  apellido: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (username: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<any>
  logout: () => void
}

interface RegisterData {
  username: string
  password: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Verificar si hay un token al cargar la página
    const token = localStorage.getItem('token')
    if (token) {
      api.get('/auth/me/')
        .then(response => {
          setUser(response.data)
        })
        .catch(() => {
          localStorage.removeItem('token')
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (username: string, password: string) => {
    try {
      const response = await api.post('/auth/login/', { username, password })
      const { access, refresh } = response.data
      localStorage.setItem('token', access)
      localStorage.setItem('refreshToken', refresh)
      // Obtener el usuario autenticado
      const me = await api.get('/auth/me/')
      setUser(me.data)
      router.push('/')
    } catch (error) {
      throw error
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      const response = await api.post('/auth/register/', userData)
      if (response.data.user) {
        // Si el registro fue exitoso, intentamos iniciar sesión automáticamente
        await login(userData.username, userData.password)
      }
      return response.data
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error)
      }
      throw new Error('Error al registrar el usuario')
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    setUser(null)
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 