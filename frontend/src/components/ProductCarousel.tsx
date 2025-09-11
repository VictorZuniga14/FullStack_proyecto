import Image from 'next/image'
import { useState } from 'react'

const demoProducts = [
  {
    id: 1,
    name: 'AMD Ryzen 7 7800X3D',
    price: 589990,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
    offer: 26,
  },
  {
    id: 2,
    name: 'XPG SPECTRIX D35G DDR4 16GB',
    price: 38990,
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
    offer: 35,
  },
  {
    id: 3,
    name: 'Gigabyte B650M GAMING WIFI',
    price: 139990,
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80',
    offer: 39,
  },
  {
    id: 4,
    name: 'ADATA Legend 860 1TB M.2',
    price: 59990,
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80',
    offer: 33,
  },
  {
    id: 5,
    name: 'Monitor Xiaomi G34WQi 34"',
    price: 279990,
    image: 'https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=600&q=80',
    offer: 22,
  },
  {
    id: 6,
    name: 'Gabinete Gamer XYZ HORIZON',
    price: 39990,
    image: 'https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=600&q=80',
    offer: 38,
  },
]

export default function ProductCarousel({ products = demoProducts }) {
  const [start, setStart] = useState(0)
  const visible = 4
  const end = start + visible
  const canPrev = start > 0
  const canNext = end < products.length

  const handlePrev = () => {
    if (canPrev) setStart(start - 1)
  }
  const handleNext = () => {
    if (canNext) setStart(start + 1)
  }

  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Ofertas destacadas</h2>
        <div className="flex gap-2">
          <button onClick={handlePrev} disabled={!canPrev} className={`px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 ${!canPrev && 'opacity-50 cursor-not-allowed'}`}>{'<'}</button>
          <button onClick={handleNext} disabled={!canNext} className={`px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 ${!canNext && 'opacity-50 cursor-not-allowed'}`}>{'>'}</button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.slice(start, end).map(product => (
          <div key={product.id} className="relative bg-white rounded-xl shadow-lg p-4 flex flex-col items-center group border border-gray-100 hover:border-[#7c3aed] transition-all">
            <div className="absolute top-2 left-2 bg-[#7c3aed] text-white text-xs font-bold px-2 py-1 rounded z-10 shadow">{product.offer}% dcto.</div>
            <div className="relative w-full h-40 mb-4">
              <Image src={product.image} alt={product.name} fill className="object-contain rounded-lg" />
            </div>
            <h3 className="text-lg font-semibold text-center mb-1 line-clamp-2">{product.name}</h3>
            <div className="text-xl font-bold text-[#7c3aed] mb-2">${product.price.toLocaleString()}</div>
            <button className="mt-auto bg-[#7c3aed] text-white px-4 py-2 rounded-lg hover:bg-[#a78bfa] transition-colors font-medium">Ver producto</button>
          </div>
        ))}
      </div>
    </div>
  )
} 