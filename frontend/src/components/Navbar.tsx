'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingCartIcon, UserIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/contexts/AuthContext'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuth()

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-[#ff6b6b]"></span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-[#ff6b6b] font-semibold">
              Inicio
            </Link>
            <Link href="/productos" className="text-gray-700 hover:text-[#ff6b6b]">
              Productos
            </Link>
            <Link href="/carrito" className="text-gray-700 hover:text-[#ff6b6b]">
              <ShoppingCartIcon className="h-6 w-6" />
            </Link>
            {user ? (
              <>
                <button className="text-gray-700 hover:text-[#ff6b6b] flex items-center cursor-default" disabled>
                  <UserIcon className="h-6 w-6" />
                  <span className="ml-2">Hola, {user.username}</span>
                </button>
                <button
                  onClick={logout}
                  className="ml-4 text-gray-700 hover:text-red-600 border border-red-200 px-3 py-1 rounded transition-colors"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <Link href="/login" className="text-gray-700 hover:text-[#ff6b6b]">
                Iniciar Sesión
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-[#ff6b6b]"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              className="block px-3 py-2 text-gray-700 hover:text-[#ff6b6b] font-semibold"
            >
              Inicio
            </Link>
            <Link
              href="/productos"
              className="block px-3 py-2 text-gray-700 hover:text-[#ff6b6b]"
            >
              Productos
            </Link>
            <Link
              href="/carrito"
              className="block px-3 py-2 text-gray-700 hover:text-[#ff6b6b]"
            >
              Carrito
            </Link>
            {user ? (
              <>
                <button className="block px-3 py-2 text-gray-700 font-semibold flex items-center cursor-default" disabled>
                  <UserIcon className="h-6 w-6 mr-2" />
                  Hola, {user.username}
                </button>
                <button
                  onClick={logout}
                  className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 font-semibold"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="block px-3 py-2 text-gray-700 hover:text-[#ff6b6b]"
              >
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar 