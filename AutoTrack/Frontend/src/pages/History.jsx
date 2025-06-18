import React, { useEffect, useState } from 'react'
import API from '../api'
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

  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('recent')
  const [clearData, setClearData] = useState(false)


  const { user, setUser } = useUser();
  const navigate = useNavigate()

  useEffect(() => {
    if (!user || !user.name) {
      navigate("/");
    }
  }, [user]);

  const handleClear = async () => {
    try {
      const res = await API.delete(`user/${user._id}/clear`)
      const updatedUser = { ...user, history: [] };
      setUser(updatedUser)
      setClearData(false)
    } catch (error) {
      console.error("Failed to clear history:", error);
    }
  }

  const getDateObj = (dateStr, timeStr) => new Date(`${dateStr} ${timeStr}`);

  const filteredVideos = user?.history
    ?.filter(video => video.title.toLowerCase().includes(searchTerm.toLowerCase()))
    ?.filter(video => {
      if (filter === 'completed') return video.isCompleted;
      if (filter === 'ongoing') return !video.isCompleted;
      return true;
    })
    ?.sort((a, b) => {
      const dateA = getDateObj(a.date, a.time)
      const dateB = getDateObj(b.date, b.time)

      if (sort === 'recent') return dateB - dateA;
      if (sort === 'oldest') return dateA - dateB;
      if (sort === 'alphabetical') return a.title.localeCompare(b.title);
      return 0;
    })


  return (
    <>
      <Navbar item={"History"} />
      <div className='bg-[#f4f9ff] min-h-screen flex flex-col items-center'>
        <div className='text-center pt-10 space-y-1'>
          <h1 className='font-bold text-4xl'>Learning History</h1>
          <p className='text-base text-neutral-500'>Track your learning journey and revisit your favorite videos</p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-7 max-w-6xl w-full'>
          {[
            { icon: videosvg, title: 'Videos Processed', value: user?.history?.length || 0, bg: 'bg-blue-100' },
            { icon: completesvg, title: 'Completed', value: user?.history?.filter(v => v.isCompleted).length, bg: 'bg-green-100' },
            { icon: streaksvg, title: 'My Streak', value: user?.history?.length || 0, bg: 'bg-gradient-to-r from-orange-100 to-red-100' },
          ].map((card, i) => (
            <div key={i} className='bg-white p-6 rounded-2xl shadow-md flex items-center gap-4'>
              <img src={card.icon} className={`${card.bg} w-12 h-12 p-2 rounded-xl`} alt="" />
              <div>
                <h2 className='text-2xl font-bold'>{card.value}</h2>
                <p className='text-sm text-gray-500'>{card.title}</p>
              </div>
            </div>
          ))}
        </div>


        <div className='mt-7 max-w-6xl w-full bg-white rounded-xl shadow-md p-5 flex flex-wrap items-center gap-4 justify-between'>
          <div className='flex items-center gap-2 border border-gray-300 rounded-xl px-3 py-2 flex-grow min-w-[200px]'>
            <img src={searchsvg} className='w-4 h-4' alt="Search" />
            <input
              type="text"
              placeholder='Search videos...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
              className='outline-none text-sm w-full bg-transparent placeholder:text-gray-500' />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className='text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm'>
            <option value="all">All Videos</option>
            <option value="completed">Completed</option>
            <option value="ongoing">Ongoing</option>
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className='text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm'>
            <option value="recent">Most Recent</option>
            <option value="oldest">Oldest First</option>
            <option value="alphabetical">A → Z</option>
          </select>

          {user?.history?.length > 0 && (
            <button onClick={() => setClearData(true)} className='flex items-center gap-1 text-red-500 hover:bg-red-100 px-3 py-2 rounded-lg transition'>
              <img src={deletesvg} alt="" className='w-4 h-4' />
              Clear All
            </button>
          )}
        </div>


        {user?.history?.length === 0 &&

          <div className='flex flex-col items-center justify-between max-w-6xl w-full mt-7 bg-white rounded-xl p-20 space-y-2 shadow-lg'>
            <img src={calendersvg} alt="" />
            <h1 className='font-semibold text-xl text-neutral-500'>No Learning History</h1>
            <p className='text-base text-neutral-500'>Start by analyzing your first YouTube video</p>
          </div>
        }

        {filteredVideos?.length > 0 && filteredVideos.map((video, index) => (
          <div key={index} className="relative max-w-6xl w-full mt-6 bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <img src={completesvg} className={`${video.isCompleted ? '' : 'hidden'} absolute top-5 right-5 w-6 h-6`} alt="Complete" />

            <div className="flex gap-5">
              <img src={video.thumbnail} alt="Thumbnail" className="w-32 h-20 rounded-xl object-cover" />

              <div className="flex flex-col justify-between w-full">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 mb-1">{video.title}</h3>
                  <div className="text-sm text-gray-500 flex flex-wrap gap-3 mb-2">
                    <span className="flex items-center gap-1"><img src={usersvg} className="w-4 h-4" /> {video.author}</span>
                    <span>{video.date}</span>
                    <span>{video.time}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">This video covers key concepts like Match The Voice... practical applications, and actionable insights.</p>

                <div className="flex gap-3 text-xs font-medium">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">5 key points</span>
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">3 flashcards</span>
                </div>
              </div>
            </div>
          </div>

        ))}

        {user?.history?.length > 0 && filteredVideos?.length === 0 && (
          <div className='mt-10 text-gray-500'>No matching videos found.</div>
        )}

      </div>

      {clearData && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                <div className="bg-white rounded-lg shadow-xl p-6 w-[90%] max-w-md border border-red-100">
                  <div className='flex flex-col items-center text-center mb-6'>
                    <div className='rounded-xl bg-red-100 p-3 mb-3'>
                      <img
                        src={deletesvg}
                        alt="Warning"
                        className='w-8 h-8 text-red-500'
                      />
                    </div>
                    <h1 className='font-bold text-2xl text-gray-800 mb-1'>Clear Data</h1>
                    <p className='text-gray-600'>Are you sure you want to clear all data? This action cannot be undone.</p>
                  </div>
      
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setClearData(false)}
                      className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleClear}
                      className="px-5 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors duration-200 font-medium shadow-sm"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            )}
    </>
  )
}

export default History
