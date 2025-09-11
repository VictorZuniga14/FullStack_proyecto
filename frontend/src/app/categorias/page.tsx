'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { categoryService, Category } from '@/services/categoryService'
import toast from 'react-hot-toast'

export default function CategoriasPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await categoryService.getCategories()
      setCategories(data)
    } catch (error) {
      console.error('Error loading categories:', error)
      setError('Error al cargar las categorías')
      toast.error('Error al cargar las categorías')
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center mb-8">Categorías</h1>
        
        {loading ? (
          <div className="text-center py-8">Cargando categorías...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">{error}</div>
        ) : categories.length === 0 ? (
          <div className="text-center py-8">No se encontraron categorías</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categorias/${category.slug}`}
                className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48">
                  <Image
                    src={`/images/categories/${category.slug}.jpg`}
                    alt={category.nombre}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {category.nombre}
                  </h3>
                  <p className="text-gray-600">{category.descripcion}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 