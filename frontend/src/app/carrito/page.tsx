'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { iniciarPagoWebpay } from '@/services/webpayService'
import api from '@/config/api'
import { Dialog } from '@headlessui/react'

interface CartItem {
  id: number
  producto: {
    id: number
    nombre: string
    precio: number
    imagen: string
  }
  cantidad: number
}

interface Sucursal {
  id: number;
  nombre: string;
  direccion: string;
  ciudad: string;
  activa: boolean;
}

export default function CarritoPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [cancelMsg, setCancelMsg] = useState<string | null>(null)
  const [showSucursalSection, setShowSucursalSection] = useState(false)
  const [selectedSucursal, setSelectedSucursal] = useState<string | null>(null)
  const [showAllSucursales, setShowAllSucursales] = useState(false)
  const [sucursales, setSucursales] = useState<Sucursal[]>([])
  const [sucursalesLoading, setSucursalesLoading] = useState(false)
  const [sucursalesError, setSucursalesError] = useState<string | null>(null)

  useEffect(() => {
    if (searchParams.get('cancelado') === '1') {
      setCancelMsg('La compra fue cancelada.')
    }
    cargarCarrito()
  }, [])

  useEffect(() => {
    if (showSucursalSection) {
      setSucursalesLoading(true)
      setSucursalesError(null)
      api.get('/sucursales/disponibles/')
        .then(res => setSucursales(res.data))
        .catch(() => setSucursalesError('No hay sucursales disponibles para tu carrito.'))
        .finally(() => setSucursalesLoading(false))
    }
  }, [showSucursalSection])

  useEffect(() => {
    if (cancelMsg) {
      const timer = setTimeout(() => setCancelMsg(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [cancelMsg]);

  const cargarCarrito = async () => {
    try {
      const response = await api.get('/carritos/carrito/mi_carrito/')
      setCartItems(response.data.detalles || [])
    } catch (error) {
      console.error('Error al cargar el carrito:', error)
      toast.error('Error al cargar el carrito')
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (id: number, newQuantity: number) => {
    if (newQuantity < 1) return
    try {
      await api.patch(`/carritos/detalle-carrito/${id}/`, { cantidad: newQuantity })
      cargarCarrito()
    } catch (error) {
      toast.error('Error al actualizar la cantidad')
    }
  }

  const removeItem = async (id: number) => {
    try {
      await api.delete(`/carritos/detalle-carrito/${id}/`)
      cargarCarrito()
      toast.success('Producto eliminado del carrito')
    } catch (error) {
      toast.error('Error al eliminar el producto')
    }
  }

  const handlePayment = async () => {
    if (cartItems.length === 0) {
      toast.error('El carrito está vacío')
      return
    }

    try {
      await iniciarPagoWebpay()
    } catch (error) {
      toast.error('No se pudo iniciar el pago')
    }
  }

  const handleContinuePurchase = () => {
    if (cartItems.length === 0) {
      toast.error('El carrito está vacío')
      return
    }
    setShowSucursalSection(true)
  }

  const handleBackToCart = () => {
    setShowSucursalSection(false)
  }

  const handleGoToPay = async () => {
    if (!selectedSucursal) return;
    localStorage.setItem('sucursalSeleccionada', selectedSucursal);
    try {
      await iniciarPagoWebpay();
    } catch (error) {
      toast.error('No se pudo iniciar el pago');
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.producto.precio * item.cantidad,
    0
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-8">Cargando carrito...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center mb-8">Carrito de Compras</h1>
        {cancelMsg && (
          <div className="mb-4 text-center text-red-600 font-semibold bg-red-100 border border-red-300 rounded p-2">
            {cancelMsg === 'La compra fue cancelada.'
              ? 'El pago fue cancelado o no se completó. Puedes intentar nuevamente.'
              : cancelMsg}
          </div>
        )}

        {showSucursalSection ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Columna izquierda: Selección de sucursal */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow p-8">
                <h2 className="text-2xl font-bold mb-6">Selecciona una sucursal para retiro</h2>
                {sucursalesLoading ? (
                  <p className="text-gray-500">Cargando sucursales...</p>
                ) : sucursalesError ? (
                  <p className="text-red-500">{sucursalesError}</p>
                ) : sucursales.length === 0 ? (
                  <p className="text-gray-500">No hay sucursales disponibles para tu carrito.</p>
                ) : (
                  <form>
                    <div className="space-y-4">
                      {sucursales.map(sucursal => (
                        <label key={sucursal.id} className="flex items-center p-4 border rounded-lg cursor-pointer hover:border-[#ff6b6b] transition-all">
                          <input
                            type="radio"
                            name="sucursal"
                            className="form-radio h-5 w-5 text-[#ff6b6b] mr-4"
                            checked={selectedSucursal === String(sucursal.id)}
                            onChange={() => setSelectedSucursal(String(sucursal.id))}
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold">{sucursal.nombre}</span>
                              <span className="text-green-600 font-bold">Gratis</span>
                            </div>
                            <div className="text-gray-700 mt-1">{sucursal.direccion} ({sucursal.ciudad})</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </form>
                )}
                <div className="flex justify-between gap-4 mt-8">
                  <button onClick={handleBackToCart} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Volver al carrito</button>
                  <button
                    className={`px-4 py-2 rounded bg-[#ff6b6b] text-white ${selectedSucursal ? '' : 'opacity-50 cursor-not-allowed'}`}
                    disabled={!selectedSucursal}
                    onClick={handleGoToPay}
                  >
                    Ir a pagar
                  </button>
                </div>
              </div>
            </div>
            {/* Columna derecha: Resumen del pedido */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Resumen del Pedido</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">
                      {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(total)}
                    </span>
                  </div>
                  {/* Aquí puedes agregar descuentos si existen */}
                  {/* <div className="flex justify-between">
                    <span className="text-gray-600">Descuento</span>
                    <span className="font-semibold text-green-600">- $X</span>
                  </div> */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-lg font-bold text-[#ff6b6b]">
                        {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(total)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          cartItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">Tu carrito está vacío</p>
              <Link
                href="/productos"
                className="inline-block bg-[#ff6b6b] text-white px-6 py-2 rounded-md hover:bg-[#ff5252] transition-colors"
              >
                Ver Productos
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Lista de productos */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center p-4 border-b last:border-b-0"
                    >
                      <div className="relative h-24 w-24 flex-shrink-0">
                        <Image
                          src={
                            item.producto.imagen
                              ? item.producto.imagen.startsWith('http')
                                ? item.producto.imagen
                                : `/images/products/${item.producto.imagen.replace(/^(productos|products)[\\/]/, '')}`
                              : '/images/producto-default.jpg'
                          }
                          alt={item.producto.nombre}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {item.producto.nombre}
                        </h3>
                        <p className="text-gray-600">
                          {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(item.producto.precio)}
                        </p>
                        <div className="mt-2 flex items-center">
                          <button
                            onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            -
                          </button>
                          <span className="mx-2 w-8 text-center">
                            {item.cantidad}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="ml-4 text-red-500 hover:text-red-700"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                      <div className="ml-4 text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(item.producto.precio * item.cantidad)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resumen del pedido */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-4">Resumen del Pedido</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold">
                        {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(total)}
                      </span>
                    </div>
                    {/* Aquí puedes agregar descuentos si existen */}
                    {/* <div className="flex justify-between">
                      <span className="text-gray-600">Descuento</span>
                      <span className="font-semibold text-green-600">- $X</span>
                    </div> */}
                    <div className="border-t pt-4">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold">Total</span>
                        <span className="text-lg font-bold text-[#ff6b6b]">
                          {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(total)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleContinuePurchase}
                    className="w-full bg-[#ff6b6b] text-white py-3 rounded-md hover:bg-[#ff5252] transition-colors"
                  >
                    Continuar compra
                  </button>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  )
}
