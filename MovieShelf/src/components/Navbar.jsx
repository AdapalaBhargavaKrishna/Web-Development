import React from 'react'

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center bg-transparent text-white p-4 w-full">
        <h1 className="font-bold text-xl">Movie Shelf</h1>

      <ul className="flex gap-3 font-bold items-center transition-all duration-300">
          <li className="cursor-pointer hover:text-[#38BDF8] hover:scale-105 transition-transform duration-200 p-2 rounded-2xl">Home</li>
          <li className="cursor-pointer hover:text-[#38BDF8] hover:scale-105 transition-transform duration-200 p-2 rounded-2xl">Watchlist</li>
          <li className="cursor-pointer hover:text-[#38BDF8] hover:scale-105 transition-transform duration-200 p-2 rounded-2xl">Logout</li>
      </ul>
    </nav>
  )
}

export default Navbar
