"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import api from "@/config/api";

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  stock: number;
  marca: string;
  modelo: string;
  categoria: {
    id: number;
    nombre: string;
  };
}

// Función para dividir la descripción en puntos
function parseBulletPoints(text: string) {
  return text
    .split(/\n|•|-/)
    .map(line => line.trim())
    .filter(line => line.length > 0);
}

// Simulación de especificaciones (puedes reemplazar por datos reales del producto si los tienes)
const especificaciones = [
  { label: 'Plazo de disponibilidad de servicio técnico', value: '7 días' },
  { label: 'Requiere IMEI', value: 'Sí' },
  { label: 'Generación', value: '5G' },
  { label: 'Tamaño de la pantalla', value: '6' },
  { label: 'Proveedor de servicio/compañía', value: 'Libre de fábrica' },
  { label: 'Incluye', value: 'Celular y cable lightning.' },
  { label: 'Sistema operativo', value: 'iOS' },
];

export default function DetalleProductoPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    async function fetchProducto() {
      try {
        setLoading(true);
        const res = await api.get(`/productos/productos/${params.id}/`);
        setProducto(res.data);
      } catch (err: any) {
        setError("Producto no encontrado");
      } finally {
        setLoading(false);
      }
    }
    fetchProducto();
  }, [params.id]);

  const agregarAlCarrito = async () => {
    try {
      await api.post("/carritos/detalle-carrito/", {
        producto_id: producto?.id,
        cantidad,
      });
      toast.success("Producto agregado al carrito");
    } catch (err) {
      toast.error("Error al agregar al carrito");
    }
  };

  if (loading) return <div className="text-center py-16">Cargando producto...</div>;
  if (error || !producto) return <div className="text-center py-16 text-red-600">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 bg-white rounded-2xl shadow-2xl mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="flex flex-col items-center">
          <div className="relative w-full h-80 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
            <Image
              src={
                producto.imagen
                  ? producto.imagen.startsWith('http')
                    ? producto.imagen
                    : `/images/products/${producto.imagen.replace(/^(productos|products)[\\/]/, '')}`
                  : "/images/producto-default.jpg"
              }
              alt={producto.nombre}
              fill
              className="object-contain p-8 rounded-xl"
            />
            {producto.stock === 0 && (
              <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded shadow">Sin stock</span>
            )}
          </div>
          <div className="mt-4 text-sm text-gray-500 text-center">
            <span className="font-semibold">Marca:</span> {producto.marca} <br />
            <span className="font-semibold">Modelo:</span> {producto.modelo}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">{producto.nombre}</h1>
          <div className="mb-2">
            <h2 className="text-lg font-bold mb-1 text-gray-800">Descripción</h2>
            {producto.descripcion && parseBulletPoints(producto.descripcion).length > 1 ? (
              <ul className="list-disc pl-6 space-y-1 text-gray-700 text-base">
                {parseBulletPoints(producto.descripcion).map((punto, idx) => (
                  <li key={idx} className="leading-relaxed">{punto}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-700 text-base">{producto.descripcion}</p>
            )}
          </div>
          <div className="flex items-center gap-4 mb-2">
            <span className="text-3xl font-bold text-[#7c3aed]">
              {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(producto.precio)}
            </span>
            <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded font-semibold">Stock: {producto.stock}</span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <label htmlFor="cantidad" className="text-gray-700 font-medium">Cantidad:</label>
            <input
              id="cantidad"
              type="number"
              min={1}
              max={producto.stock}
              value={cantidad}
              onChange={e => setCantidad(Number(e.target.value))}
              className="w-20 border rounded px-3 py-2 text-center"
              disabled={producto.stock === 0}
            />
          </div>
          <button
            onClick={agregarAlCarrito}
            className="bg-[#7c3aed] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#a78bfa] transition-colors w-full text-lg flex items-center justify-center gap-2 disabled:opacity-50"
            disabled={producto.stock === 0}
          >
            {producto.stock === 0 ? "Sin stock" : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437m0 0L7.5 15.75A2.25 2.25 0 009.664 18h7.086a2.25 2.25 0 002.164-1.75l1.5-7.5A1.125 1.125 0 0019.314 7.5H6.272m-1.166-2.228L4.5 3m0 0L3.75 5.25m.75-2.25h16.5" />
                </svg>
                Agregar al Carrito
              </>
            )}
          </button>
          <Link href="/productos" className="text-[#7c3aed] hover:underline block text-center mt-2">&larr; Volver a productos</Link>
        </div>
      </div>
    </div>
  );
} 