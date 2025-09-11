// webpayService.ts
import api from '@/config/api'

export const iniciarPagoWebpay = async () => {
  try {
    const response = await api.post('/pagos/iniciar/')
    const { url, token } = response.data
    window.location.href = `${url}?token_ws=${token}`
  } catch (error) {
    console.error('Error al iniciar Webpay:', error)
    throw error
  }
}
