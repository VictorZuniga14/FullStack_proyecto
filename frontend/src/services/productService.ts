import api from '@/config/api'

export interface Product {
  id: number
  nombre: string
  descripcion: string
  precio: number
  stock: number
  imagen: string
  marca: string
  modelo: string
  especificaciones: Record<string, any>
  categoria: {
    id: number
    nombre: string
  }
}

export const productService = {
  async getProducts(params?: {
    categoria?: number
    marca?: string
    search?: string
    ordering?: string
  }): Promise<Product[]> {
    try {
      const response = await api.get('/productos/', { params })
      return Array.isArray(response.data) ? response.data : []
    } catch (error) {
      console.error('Error fetching products:', error)
      return []
    }
  },

  async getProduct(id: number): Promise<Product> {
    const response = await api.get(`/productos/${id}/`)
    return response.data
  },

  async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    const response = await api.post('/productos/', product)
    return response.data
  },

  async updateProduct(id: number, product: Partial<Product>): Promise<Product> {
    const response = await api.patch(`/productos/${id}/`, product)
    return response.data
  },

  async deleteProduct(id: number): Promise<void> {
    await api.delete(`/productos/${id}/`)
  }
} 