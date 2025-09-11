"use client";

import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import api from '@/config/api'
import { useEffect, useState } from 'react'

interface Producto {
  id: number
  nombre: string
  descripcion: string
  precio: number
  imagen: string
  stock: number
  marca: string
  modelo: string
  categoria: {
    id: number
    nombre: string
  }
}

export default function Home() {
  const router = useRouter()

  const [products, setProducts] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true)
        const response = await api.get('/productos/productos/?page=1&page_size=4')
        setProducts(response.data.results || response.data)
      } catch (err) {
        setError('Error al cargar productos destacados')
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const agregarAlCarrito = async (productoId: number) => {
    console.log('Agregando al carrito', productoId, new Date().toISOString());
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

  const categories = [
    {
      id: 1,
      name: 'Teléfonos',
      slug: 'telefonos',
      description: 'Los mejores smartphones del mercado',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 2,
      name: 'Notebooks',
      slug: 'notebooks',
      description: 'Laptops de alta gama para trabajo y entretenimiento',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center bg-gradient-to-r from-[#232526] to-[#414345]">
        <div className="absolute top-8 left-8 flex items-center gap-4">
          <Image
            src="/images/logo.svg"
            alt="Logo Digitals"
            width={48}
            height={48}
          />
          <span className="text-3xl font-bold text-white tracking-wide">DIGITALS</span>
        </div>
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white drop-shadow-lg">
            La mejor tecnología al mejor precio
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Smartphones, laptops y accesorios de última generación
          </p>
          <Link
            href="/productos"
            className="btn-primary text-lg px-8 py-3 bg-[#ff6b6b] text-white rounded-lg shadow hover:bg-[#ff5252] transition-colors"
          >
            Ver Productos
          </Link>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Categorías Destacadas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categorias/${category.slug}`}
                className="card group bg-gray-100 rounded-lg shadow hover:shadow-lg transition-shadow"
              >
                <div className="relative h-64">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300 rounded-t-lg"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">{category.name}</h3>
                  <p className="text-gray-600">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Productos Destacados
          </h2>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Cargando productos...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <div key={product.id} className="group bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl hover:border-[#7c3aed] transition-all duration-300 flex flex-col overflow-hidden">
                  <div className="relative h-56 w-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <Image
                      src={product.imagen?.startsWith('http') ? product.imagen : `/images/products/${product.imagen?.replace(/^(productos|products)[\\/]/, '')}`}
                      alt={product.nombre}
                      fill
                      className="object-contain p-6 transition-transform duration-300 group-hover:scale-105"
                    />
                    {product.stock === 0 && (
                      <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded shadow">Sin stock</span>
                    )}
                  </div>
                  <div className="p-5 flex flex-col gap-2 flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{product.nombre}</h3>
                    <span className="text-xs text-gray-500 mb-1">{product.marca} {product.modelo}</span>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2 min-h-[40px]">{product.descripcion}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-2xl font-bold text-[#7c3aed]">
                        {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(product.precio)}
                      </span>
                      <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded font-semibold ml-2">Stock: {product.stock}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-gradient-to-r from-[#232526] to-[#414345] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Suscríbete a Nuestro Newsletter
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Recibe las mejores ofertas y novedades de tecnología directamente en tu correo
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <div className="flex-grow">
                <input
                  type="email"
                  placeholder="Tu correo electrónico"
                  className="w-full px-6 py-3 rounded-lg border-2 border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-[#ff6b6b] transition-colors"
                />
              </div>
              <button 
                type="submit" 
                className="bg-[#ff6b6b] text-white px-8 py-3 rounded-lg hover:bg-[#ff5252] transition-colors font-medium text-lg whitespace-nowrap"
              >
                Suscribirse
              </button>
            </form>
            <p className="text-sm text-gray-400 mt-4">
              Al suscribirte, aceptas recibir correos electrónicos con ofertas y novedades
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

