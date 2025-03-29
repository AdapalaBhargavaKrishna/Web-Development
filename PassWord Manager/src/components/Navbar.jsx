import React from 'react'

const Navbar = () => {
    return (
        <nav className='bg-slate-800 text-white flex justify-between px-40 items-center'>
            <div className="logo font-bold text-white text-2xl">
                <span className="text-green-500">&lt;</span>
                Safe
                <span className="text-green-500">Pass&gt;</span>
            </div>

            <button className='text-white bg-green-500 my-5 rounded-full flex justify-around items-center'>
                <img className='invert w-8 p-1' src="icons/github.svg" alt="github" />
                <span className="font-bold pr-2">
                    GitHub
                </span>
            </button>
        </nav>
    )
}

export default Navbar
