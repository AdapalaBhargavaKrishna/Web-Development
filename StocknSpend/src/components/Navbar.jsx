import React from 'react'

const Navbar = () => {
  return (
    <nav className='flex justify-between items-center bg-gray-950 text-white p-4'>
      <div className='flex items-center gap-2'>
        <img src="/logo.svg" alt="" />
        <h1 className='font-bold text-xl'>Stock & Spend</h1>
      </div>
        <ul className='flex gap-3 font-bold'>
        <li className="cursor-pointer hover:text-[#38BDF8] hover:scale-105 transition-transform duration-200 p-2 rounded-2xl">Home</li>
        <li className="cursor-pointer hover:text-[#38BDF8] hover:scale-105 transition-transform duration-200 p-2 rounded-2xl">Stocks</li>
        <li className="cursor-pointer hover:text-[#38BDF8] hover:scale-105 transition-transform duration-200 p-2 rounded-2xl">Finance</li>
        <li className="cursor-pointer hover:text-[#38BDF8] hover:scale-105 transition-transform duration-200 p-2 rounded-2xl">About</li>
        </ul>
    </nav>
  )
}

export default Navbar
