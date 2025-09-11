"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/config/api";

export default function CompraExitosaPage() {
  const router = useRouter();

  useEffect(() => {
    // Recuperar la sucursal seleccionada
    const sucursalSeleccionada = localStorage.getItem("sucursalSeleccionada");
    if (sucursalSeleccionada) {
      // Aquí podrías hacer un POST a /api/ventas/ventas/ si necesitas crear la venta aquí
      // await api.post('/api/ventas/ventas/', { sucursal: sucursalSeleccionada, ... })
      localStorage.removeItem("sucursalSeleccionada");
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-8">
      <div className="bg-white rounded-lg shadow p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">¡Compra exitosa!</h1>
        <p className="text-lg text-gray-700 mb-6">
          Tu pago fue procesado correctamente.<br />
          Pronto recibirás un correo con los detalles de tu compra y podrás retirar en la sucursal seleccionada.
        </p>
        <button
          className="bg-[#ff6b6b] text-white px-6 py-2 rounded-md hover:bg-[#ff5252] transition-colors"
          onClick={() => router.push("/mis-compras")}
        >
          Ver mis compras
        </button>
      </div>
    </div>
  );
} 