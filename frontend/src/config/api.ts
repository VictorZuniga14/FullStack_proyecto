import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token de autenticación antes de cada petición
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores en la respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Función para iniciar el pago Webpay y redirigir al usuario
export async function iniciarPagoWebpay() {
  try {
    const response = await api.post('/pagos/iniciar_pago_webpay/');
    const { url } = response.data;
    window.location.href = url;  // Redirigir a Webpay
  } catch (error) {
    console.error('Error al iniciar el pago:', error.response?.data || error.message);
    alert('Error al iniciar el pago. Por favor intenta nuevamente.');
  }
}

export default api;
