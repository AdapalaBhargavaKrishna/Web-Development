import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import videosvg from '../assets/svg/video.svg'
import completesvg from '../assets/svg/complete.svg'
import streaksvg from '../assets/svg/fire.svg'


const History = () => {

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Navbar item={"History"} />
      <div className='bg-[#f4f9ff] min-h-screen flex flex-col items-center'>
        <div className='text-center pt-10 space-y-1'>
          <h1 className='font-bold text-4xl'>Learning History</h1>
          <p className='text-base text-neutral-500'>Track your learning journey and revisit your favorite videos</p>
        </div>

        <div className='flex items-center justify-between max-w-7xl w-full mt-7'>

          <div className='bg-white rounded-xl flex items-center justify-start gap-4 px-10 pr-40 py-5'>
            <img src={videosvg} className='bg-blue-200 p-2 rounded-xl' alt="" />
            <div>
              <h1 className='font-bold text-2xl'>4</h1>
              <p>Videos Processed</p>
            </div>
          </div>
          <div className='bg-white rounded-xl flex items-center justify-start gap-4 px-10 pr-40 py-5'>
            <img src={completesvg} className='bg-green-100 p-2 rounded-xl w-10 h-10' alt="" />
            <div>
              <h1 className='font-bold text-2xl'>4</h1>
              <p>Completed</p>
            </div>
          </div>
          <div className='bg-white rounded-xl flex items-center justify-start gap-4 px-10 pr-40 py-5'>
            <img src={streaksvg} className='bg-gradient-to-r from-orange-100 to-red-100 p-1 rounded-xl w-10 h-10' alt="" />
            <div>
              <h1 className='font-bold text-2xl'>4</h1>
              <p>Streak</p>
            </div>
          </div>

        </div>

        <div className='mt-7 max-w-7xl w-full p-5 bg-white rounded-xl relative'>

          <button id="dropdownDefaultButton" data-dropdown-toggle="dropdown" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">Dropdown button <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
          </svg>
          </button>

          <div id="dropdown" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700">
            <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
              <li>
                <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard</a>
              </li>
              <li>
                <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Settings</a>
              </li>
              <li>
                <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Earnings</a>
              </li>
              <li>
                <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Sign out</a>
              </li>
            </ul>
          </div>

        </div>
      </div>

    </>
  )
}

export default History
