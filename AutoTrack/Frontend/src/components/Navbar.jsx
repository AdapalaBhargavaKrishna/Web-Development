import React from 'react'
import logosvg from '../assets/svg/logo.svg'
import homesvg from '../assets/svg/home.svg'
import settingssvg from '../assets/svg/settings.svg'
import historysvg from '../assets/svg/historyw.svg'

const Navbar = ({ item }) => {

    const links = [
        { name: "Dashboard", svg: homesvg,path: "/Dashboard" },
        { name: "History", svg: historysvg , path: "/History" },
        { name: "Settings", svg: settingssvg, path: "/Settings" }
    ];

    return (
        <nav className=' w-full bg-[#fefeff] p-1 flex items-center justify-around'>
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
                    {links.map((link, index) => (
                        <li key={index} className={`text-lg flex items-center gap-2 ${item === link.name ? 'bg-blue-100 text-blue-500 rounded-xl font-semibold' : 'text-neutral-700 font-semibold'} p-2 hover:text-blue-500 transition duration-200`}>
                            <img src={link.svg} className='w-5 h-5' alt="" />
                            <a href={link.path}>{link.name}</a>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    )
}

export default Navbar
