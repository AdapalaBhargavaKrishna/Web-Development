import React from 'react'

const Navbar = () => {
  return (
    <div id="navbar" className='flex intems-center justify-between m-2 p-5 bg-blue-200 rounded-xl'>
        <div id="head">
            <h1 className="bold text-xl">Recipe Mate</h1>
        </div>
        <div id="themes" className=" flex justify-around items-center gap-5">
                <a href="#">Home</a>
                <a href="#">Search</a>
                <button className=''>Dark mode</button>
        </div>
    </div>
  )
}

export default Navbar