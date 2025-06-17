import React, { useState, useRef, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { useUser, UserContext } from '../data/UserContext'
import logosvg from '../assets/svg/logo.svg'
import homesvg from '../assets/svg/home.svg'
import settingssvg from '../assets/svg/settings.svg'
import historysvg from '../assets/svg/historyw.svg'
import userlogo from '../assets/svg/user.svg';

const Navbar = ({ item }) => {
    const { user } = useUser();
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const links = [
        { name: "Dashboard", svg: homesvg, path: "/Dashboard" },
        { name: "History", svg: historysvg, path: "/History" },
        { name: "Settings", svg: settingssvg, path: "/Settings" }
    ];

    const handleSignOut = async () => {
        await signOut(auth);
        localStorage.removeItem("autotube-user");
        setUser(null);
        navigate('/')
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className=' w-full bg-[#fefeff] p-1 flex items-center justify-around'>
            <div className='flex items-center gap-2 p-1'>
                <div className='bg-purple-400 rounded-lg'>
                    <img src={logosvg} className='w-11 h-11 p-2 shadow-lg rounded-lg' alt="" />
                </div>
                <div>
                    <h1 className='font-bold text-2xl'>AutoTube</h1>
                    <p className='text-neutral-700 text-sm'>Your Learning Tracker</p>
                </div>
            </div>
            <div className='md:flex hidden items-center gap-4'>
                <ul className='flex gap-8 ml-auto p-2'>
                    {links.map((link, index) => (
                        <li key={index} className={`text-lg flex items-center gap-2 ${item === link.name ? 'bg-blue-100 text-blue-500' : 'text-neutral-700'} font-semibold py-2 px-4 hover:bg-neutral-100 rounded-lg transition duration-200`}>
                            <img src={link.svg} className='w-5 h-5' alt="" />
                            <Link to={link.path}>{link.name}</Link>
                        </li>
                    ))}
                </ul>

                <div className="relative" ref={dropdownRef}>

                    <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="group flex h-10 w-10 select-none items-center justify-center rounded-lg bg-white leading-8 text-zinc-950 shadow-[0_-1px_0_0px_#d4d4d8_inset,0_0_0_1px_#f4f4f5_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-50 hover:via-zinc-900 hover:to-zinc-800 active:shadow-[-1px_0px_1px_0px_#e4e4e7_inset,1px_0px_1px_0px_#e4e4e7_inset,0px_0.125rem_1px_0px_#d4d4d8_inset]" aria-label="Change language"><span className="flex items-center group-active:[transform:translate3d(0,1px,0)]"> <img src={userlogo} alt="User" className="w-10 h-10 rounded-xl p-2" /></span></button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-xl z-50 p-4 text-left">
                            <div className="mb-3">
                                <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                            <button
                                onClick={handleSignOut}
                                className="w-full mt-2 bg-red-100 hover:bg-red-200 text-red-600 font-semibold px-3 py-1 rounded-md text-sm transition"
                            >
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>

        </nav>
    )
}

export default Navbar
