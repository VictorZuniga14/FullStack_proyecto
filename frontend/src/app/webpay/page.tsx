'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import api from '@/config/api'
import { useAuth } from '@/contexts/AuthContext'

interface WebpayResponse {
  url: string
  token: string
}

export default function WebpayPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // TODO: Cambia esto por el valor real de tu carrito (por ejemplo, un contexto carrito o prop)
  const carritoTotal = 1000 // <- Aquí pon el total real

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    initWebpay()
  }, [user, router])

  const initWebpay = async () => {
    try {
      setLoading(true)
      setError(null)

      if (!carritoTotal || carritoTotal <= 0) {
        throw new Error('El total del carrito no es válido')
      }

      const response = await api.post<WebpayResponse>('/webpay/create/')

      if (response.data.url && response.data.token) {
        window.location.href = `${response.data.url}?token_ws=${response.data.token}`
      } else {
        throw new Error('No se pudo inicializar el pago')
      }
    } catch (error: any) {
      console.error('Error al inicializar Webpay:', error)
      setError(error.message || 'Error al procesar el pago. Por favor, intente nuevamente.')
      toast.error('Error al procesar el pago')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-8">
            <h1 className="text-2xl font-bold mb-4">Procesando pago...</h1>
            <p className="text-gray-600">Por favor espere mientras lo redirigimos a Webpay</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-8">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => router.push('/carrito')}
              className="bg-[#ff6b6b] text-white px-6 py-2 rounded-md hover:bg-[#ff5252] transition-colors"
            >
              Volver al Carrito
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
