import React from 'react'
import logosvg from '../assets/svg/logo.svg'

const Navbar = () => {
  return (
    <nav className='fixed w-full bg-[#fefeff] p-1 flex items-center justify-around'>
        <div className='flex items-center gap-2 p-1'>
            <div className='bg-purple-400 rounded-lg'>
            <img src={logosvg} className='w-11 h-11 p-2 shadow-lg rounded-lg' alt="" />
            </div>
            <div>
                <h1 className='font-bold text-2xl'>Auto Track</h1>
                <p className='text-neutral-700 text-sm'>Your Learning Tracker</p>
            </div>
        </div>
        <div className='md:flex hidden'>
            <ul className='flex gap-8 ml-auto p-2'>
                <li><a href="/">Dashboard</a></li>
                <li><a href="/History">History</a></li>
                <li><a href="/Settings">Settings</a></li>
            </ul>
        </div>
    </nav>
  )
}

export default Navbar
