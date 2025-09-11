'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import api from '@/config/api'
import toast from 'react-hot-toast'
import { ShoppingCartIcon } from '@heroicons/react/24/outline'

interface Producto {
  id: number
  nombre: string
  descripcion: string
  precio: number
  imagen: string
  stock: number
  categoria: {
    id: number
    nombre: string
  }
  marca: string
  modelo: string
}

interface PaginatedResponse {
  count: number
  next: string | null
  previous: string | null
  results: Producto[]
}

interface Categoria {
  id: number
  nombre: string
}

const sliderImages = [
  // Placa madre potente (GPU)
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
  // Nueva imagen: placa madre y RAM
  'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80',
  // Fondo tech abstracto (para variedad visual)
  'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&w=1200&q=80',
]

// Rango de precios fijos
const priceRanges = [
  { label: 'Hasta $100.000', min: 0, max: 100000 },
  { label: '$100.001 - $300.000', min: 100001, max: 300000 },
  { label: '$300.001 - $600.000', min: 300001, max: 600000 },
  { label: '$600.001 - $1.000.000', min: 600001, max: 1000000 },
  { label: 'Más de $1.000.000', min: 1000001, max: 99999999 },
]

export default function ProductosPage() {
  const router = useRouter()
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number | null>(null)
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null)
  const [sliderIndex, setSliderIndex] = useState(0)
  const [orderBy, setOrderBy] = useState<string>('relevancia')

  useEffect(() => {
    // Obtener categorías para el filtro
    async function fetchCategorias() {
      try {
        const res = await api.get('/categorias/categorias/')
        setCategorias(res.data.results || res.data)
      } catch (e) {
        setCategorias([])
      }
    }
    fetchCategorias()
  }, [])

  useEffect(() => {
    async function fetchProductos() {
      try {
        setLoading(true)
        let url = '/productos/productos/?'
        if (categoriaSeleccionada) url += `categoria=${categoriaSeleccionada}&`
        if (selectedPriceRange !== null) {
          url += `precio_min=${priceRanges[selectedPriceRange].min}&precio_max=${priceRanges[selectedPriceRange].max}&`
        }
        if (orderBy === 'precio_asc') url += 'ordering=precio&'
        if (orderBy === 'precio_desc') url += 'ordering=-precio&'
        url += `page=${currentPage}`
        const response = await api.get<PaginatedResponse>(url)
        if (response.data && Array.isArray(response.data.results)) {
          setProductos(response.data.results)
          setTotalProducts(response.data.count)
          setTotalPages(Math.ceil(response.data.count / 12))
        } else {
          setProductos([])
          setError('La respuesta de la API no contiene productos válidos.')
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error al cargar los productos')
        toast.error(err.response?.data?.message || 'Error al cargar los productos')
        setProductos([])
      } finally {
        setLoading(false)
      }
    }
    fetchProductos()
  }, [currentPage, categoriaSeleccionada, selectedPriceRange, orderBy])

  // Slider auto
  useEffect(() => {
    const interval = setInterval(() => {
      setSliderIndex((prev) => (prev + 1) % sliderImages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const agregarAlCarrito = async (productoId: number) => {
    try {
      const data = {
        producto_id: productoId,
        cantidad: 1
      };
      const response = await api.post('/carritos/detalle-carrito/', data);
      if (response.status === 201 || response.status === 200) {
        toast.success('Producto agregado al carrito');
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error('Debes iniciar sesión para agregar productos al carrito');
        router.push('/login');
      } else if (error.response?.status === 400) {
        toast.error(error.response.data?.message || 'Error en los datos enviados');
      } else {
        toast.error(error.response?.data?.message || 'Error al agregar al carrito');
      }
    }
  };

  // Handler para filtro de precio
  const handlePriceRangeChange = (idx: number) => {
    if (selectedPriceRange === idx) {
      setSelectedPriceRange(null)
    } else {
      setSelectedPriceRange(idx)
      setOrderBy('precio_asc') // Ordenar automáticamente por precio ascendente
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {sliderImages.length > 0 && (
          <div className="mb-8 relative rounded-lg overflow-hidden shadow-lg h-48 sm:h-64">
            <Image
              src={sliderImages[sliderIndex]}
              alt="Banner"
              fill
              className="object-cover w-full h-full"
              priority
            />
            {/* Badge de oferta */}
            <div className="absolute top-4 left-4 bg-[#7c3aed] text-white px-4 py-2 rounded-lg shadow-lg text-lg font-bold z-10">
              ¡Upgrade!
            </div>
            {/* Texto grande */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10">
              <h2 className="text-4xl sm:text-5xl font-extrabold text-white drop-shadow-lg mb-2">Hasta 60% dcto.</h2>
              <p className="text-lg sm:text-xl text-white/90 font-semibold drop-shadow">Ofertas en tecnología y gaming</p>
            </div>
            {/* Badge de cuotas */}
            <div className="absolute bottom-4 left-4 bg-white/80 text-[#7c3aed] px-3 py-1 rounded-lg font-semibold shadow z-10">
              Hasta 24 cuotas sin interés
            </div>
            {/* Flechas */}
            <div className="absolute inset-0 flex justify-between items-center px-2 z-20">
              <button onClick={() => setSliderIndex((sliderIndex - 1 + sliderImages.length) % sliderImages.length)} className="bg-white/70 rounded-full p-2 shadow hover:bg-white">
                &#8592;
              </button>
              <button onClick={() => setSliderIndex((sliderIndex + 1) % sliderImages.length)} className="bg-white/70 rounded-full p-2 shadow hover:bg-white">
                &#8594;
              </button>
            </div>
          </div>
        )}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filtros laterales */}
          <aside className="w-full lg:w-64 bg-white rounded-lg shadow p-6 mb-6 lg:mb-0">
            <h2 className="text-lg font-semibold mb-4">Filtrar</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <select
                value={categoriaSeleccionada ?? ''}
                onChange={e => setCategoriaSeleccionada(e.target.value ? Number(e.target.value) : null)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ff6b6b] focus:ring-[#ff6b6b]"
              >
                <option value="">Todas</option>
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
              <div className="flex flex-col gap-2">
                {priceRanges.map((range, idx) => (
                  <label key={idx} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedPriceRange === idx}
                      onChange={() => handlePriceRangeChange(idx)}
                      className="form-checkbox h-4 w-4 text-[#ff6b6b]"
                    />
                    <span>{range.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <button
              onClick={() => { setCategoriaSeleccionada(null); setSelectedPriceRange(null); setOrderBy('relevancia'); }}
              className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              Limpiar filtros
            </button>
          </aside>
          {/* Main content */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
              <h1 className="text-2xl font-bold">Productos</h1>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Ordenar por:</span>
                <select
                  className="rounded-md border-gray-300 focus:border-[#ff6b6b] focus:ring-[#ff6b6b]"
                  value={orderBy}
                  onChange={e => setOrderBy(e.target.value)}
                >
                  <option value="relevancia">Relevancia</option>
                  <option value="precio_asc">Precio: Menor a mayor</option>
                  <option value="precio_desc">Precio: Mayor a menor</option>
                </select>
              </div>
            </div>
            {/* Grid de productos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.isArray(productos) && productos.map((product) => (
                <div key={product.id} className="group bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl hover:border-[#7c3aed] transition-all duration-300 flex flex-col overflow-hidden min-h-[300px]">
                  <Link href={`/productos/${product.id}`} className="flex-1 flex flex-col" tabIndex={-1}>
                    <div className="relative h-48 w-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                      <Image
                        src={product.imagen?.startsWith('http') ? product.imagen : `/images/products/${product.imagen?.replace(/^(productos|products)[\\/]/, '')}`}
                        alt={product.nombre}
                        fill
                        className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                      />
                      {product.stock === 0 && (
                        <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded shadow">Sin stock</span>
                      )}
                    </div>
                    <div className="p-5 flex flex-col gap-2 flex-1 justify-between">
                      <h2 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2 text-center">{product.nombre}</h2>
                      <span className="text-xs text-gray-500 mb-1 text-center">{product.marca} {product.modelo}</span>
                      <p className="text-gray-600 text-sm mb-2 min-h-[32px] text-center break-words whitespace-pre-line line-clamp-2">{product.descripcion}</p>
                      <div className="flex items-center justify-center gap-4 mt-auto">
                        <span className="text-2xl font-bold text-[#7c3aed]">
                          {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(product.precio)}
                        </span>
                        <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded font-semibold">Stock: {product.stock}</span>
                      </div>
                    </div>
                  </Link>
                  <button
                    onClick={(e) => { e.preventDefault(); agregarAlCarrito(product.id); }}
                    className="m-4 bg-[#7c3aed] text-white px-6 py-2 rounded-lg hover:bg-[#a78bfa] transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                    disabled={product.stock === 0}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437m0 0L7.5 15.75A2.25 2.25 0 009.664 18h7.086a2.25 2.25 0 002.164-1.75l1.5-7.5A1.125 1.125 0 0019.314 7.5H6.272m-1.166-2.228L4.5 3m0 0L3.75 5.25m.75-2.25h16.5" />
                    </svg>
                    Agregar al Carrito
                  </button>
                </div>
              ))}
            </div>
            {(!Array.isArray(productos) || productos.length === 0) && (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">
                  {selectedPriceRange !== null
                    ? 'No hay productos con estos precios'
                    : 'No hay productos disponibles'}
                </p>
              </div>
            )}
            {/* Paginación */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center space-x-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === 1
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-[#ff6b6b] text-white hover:bg-[#ff5252]'
                  }`}
                >
                  Anterior
                </button>
                <span className="text-gray-600">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === totalPages
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-[#ff6b6b] text-white hover:bg-[#ff5252]'
                  }`}
                >
                  Siguiente
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
