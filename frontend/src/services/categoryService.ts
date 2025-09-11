import api from '@/config/api'

export interface Category {
  id: number
  nombre: string
  descripcion: string
  slug: string
}

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    try {
      const response = await api.get('/categorias/')
      return Array.isArray(response.data) ? response.data : []
    } catch (error) {
      console.error('Error fetching categories:', error)
      return []
    }
  },

  async getCategory(id: number): Promise<Category> {
    const response = await api.get(`/categorias/${id}/`)
    return response.data
  }
} 