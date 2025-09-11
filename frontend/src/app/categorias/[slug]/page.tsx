'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { categoryService, Category } from '@/services/categoryService'
import { productService, Product } from '@/services/productService'
import toast from 'react-hot-toast'

export default function CategoriaPage() {
  const params = useParams()
  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (params.slug) {
      loadCategoryAndProducts(params.slug as string)
    }
  }, [params.slug])

  const loadCategoryAndProducts = async (slug: string) => {
    try {
      setLoading(true)
      setError(null)

      // Obtener la categoría
      const categories = await categoryService.getCategories()
      const foundCategory = categories.find(cat => cat.slug === slug)
      
      if (!foundCategory) {
        throw new Error('Categoría no encontrada')
      }
      
      setCategory(foundCategory)

      // Obtener los productos de la categoría
      const data = await productService.getProducts({ categoria: foundCategory.id })
      setProducts(data)
    } catch (error) {
      console.error('Error loading category and products:', error)
      setError('Error al cargar la categoría y sus productos')
      toast.error('Error al cargar la categoría y sus productos')
    } finally {
      setLoading(false)
    }
  }

  if (!category && !loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-8 text-red-600">
            Categoría no encontrada
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-8">Cargando...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">{error}</div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-center mb-4">
                {category?.nombre}
              </h1>
              <p className="text-gray-600 text-center max-w-2xl mx-auto">
                {category?.descripcion}
              </p>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-8">
                No hay productos en esta categoría
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="relative h-48">
                      <Image
                        src={
                          product.imagen
                            ? product.imagen.startsWith('http')
                              ? product.imagen
                              : `/images/products/${product.imagen.replace(/^(productos|products)[\\/]/, '')}`
                            : '/images/producto-default.jpg'
                        }
                        alt={product.nombre}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {product.nombre}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {product.marca} - {product.modelo}
                      </p>
                      <p className="mt-2 text-gray-600 line-clamp-2">
                        {product.descripcion}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xl font-bold text-[#ff6b6b]">
                          ${product.precio.toLocaleString()}
                        </span>
                        <button
                          className="bg-[#ff6b6b] text-white px-4 py-2 rounded-md hover:bg-[#ff5252] transition-colors"
                          onClick={() => toast.success('Producto agregado al carrito')}
                        >
                          Agregar al carrito
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
} 