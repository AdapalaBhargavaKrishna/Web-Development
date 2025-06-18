import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useUser } from '../data/UserContext'
import videosvg from '../assets/svg/video.svg'
import completesvg from '../assets/svg/complete.svg'
import streaksvg from '../assets/svg/fire.svg'
import searchsvg from '../assets/svg/search.svg'
import calendersvg from '../assets/svg/calender.svg'
import usersvg from '../assets/svg/user.svg'
import deletesvg from '../assets/svg/delete.svg'
import { useNavigate } from 'react-router-dom'

const History = () => {
  const { user ,setUser } = useUser();
  const navigate = useNavigate()

  useEffect(() => {
    if (!user || !user.name) {
      navigate("/");
    }
  }, [user]);

  const handleClear = () => {
    const updatedHistory = {...user, history : []}
    setUser(updatedHistory);
  }

  return (
    <>
      <Navbar item={"History"} />
      <div className='bg-[#f4f9ff] min-h-screen flex flex-col items-center'>
        <div className='text-center pt-10 space-y-1'>
          <h1 className='font-bold text-4xl'>Learning History</h1>
          <p className='text-base text-neutral-500'>Track your learning journey and revisit your favorite videos</p>
        </div>

        <div className='flex items-center justify-between max-w-6xl w-full mt-7'>

          <div className='bg-white rounded-xl flex items-center justify-start gap-4 px-10 pr-28 py-5 shadow-lg'>
            <img src={videosvg} className='bg-blue-200 p-2 rounded-xl' alt="" />
            <div>
              <h1 className='font-bold text-2xl'>{user?.history?.length || 0}</h1>
              <p>Videos Processed</p>
            </div>
          </div>
          <div className='bg-white rounded-xl flex items-center justify-start gap-4 px-10 pr-40 py-5 shadow-lg'>
            <img src={completesvg} className='bg-green-100 p-2 rounded-xl w-10 h-10' alt="" />
            <div>
              <h1 className='font-bold text-2xl'>4</h1>
              <p>Completed</p>
            </div>
          </div>
          <div className='bg-white rounded-xl flex items-center justify-start gap-4 px-10 pr-40 py-5 shadow-lg'>
            <img src={streaksvg} className='bg-gradient-to-r from-orange-100 to-red-100 p-1 rounded-xl w-10 h-10' alt="" />
            <div>
              <h1 className='font-bold text-2xl'>{user?.history?.length || 0}</h1>
              <p>My Streak</p>
            </div>
          </div>

        </div>

        <div className='mt-7 max-w-6xl w-full p-7 bg-white rounded-xl relative flex flex-wrap items-center justify-between gap-4 shadow-lg'>

          <div className={`flex items-center gap-2 border border-neutral-300 rounded-xl px-3 py-2 w-full ${user?.history?.length === 0 ? 'md:w-[68%]' : 'md:w-[59%]'
            } shadow-sm bg-white`}>
            <img src={searchsvg} className='w-5 h-5' alt="Search" />
            <input
              type="text"
              placeholder='Search videos...'
              className='outline-none w-full text-sm placeholder:text-gray-500 bg-transparent'
            />
          </div>


          <div className="flex gap-7 items-center">

            <select
              className="bg-white border border-gray-300 text-gray-800 text-sm rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-300"
            >
              <option value="all">All Videos</option>
              <option value="completed">Completed</option>
              <option value="ongoing">Ongoing</option>
            </select>

            <select
              className="bg-white border border-gray-300 text-gray-800 text-sm rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-300"
            >
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest First</option>
              <option value="longest">Longest First</option>
            </select>

            {user?.history?.length > 0 &&

              <button 
              className='flex hover:bg-red-100 p-2 rounded-lg'
              onClick={handleClear}
              >
                <img src={deletesvg} alt="" />
                <span className='text-red-500'>Clear All</span>
              </button>

            }

          </div>

        </div>

        {user?.history?.length === 0 &&

          <div className='flex flex-col items-center justify-between max-w-6xl w-full mt-7 bg-white rounded-xl p-20 space-y-2 shadow-lg'>
            <img src={calendersvg} alt="" />
            <h1 className='font-semibold text-xl text-neutral-500'>No Learning History</h1>
            <p className='text-base text-neutral-500'>Start by analyzing your first YouTube video</p>
          </div>
        }

        {user?.history?.length > 0 && user?.history?.map((video, index) =>  (
          <div key={index}>
            <div className="relative max-w-6xl w-full mt-7 bg-white rounded-2xl shadow-lg p-6 hover:bg-gray-50 transition-colors">

              <img
                src={completesvg}
                className="absolute top-4 right-4 w-6 h-6"
                alt="Completed"
              />

              <div className="flex space-x-4">

                <div className="flex-shrink-0">
                  <img
                    src={video.thumbnail}
                    className="w-28 h-20 object-cover rounded-xl"
                    alt="Thumbnail"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-base md:text-lg font-medium text-gray-900 line-clamp-2 mb-2">
                    {video.title}
                  </h3>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <img src={usersvg} className="w-4 h-4" alt="User icon" />
                      <span>{video.author}</span>
                    </span>
                    <span>{video.date}</span>
                    <span>{video.time}</span>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    This video covers key concepts related to Match The Voice To The Person. The main topics discussed include important principles, practical applications, and actionable insights...
                  </p>

                  <div className="flex gap-3 flex-wrap">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      5 key points
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      3 flashcards
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </>
  )
}

export default History
