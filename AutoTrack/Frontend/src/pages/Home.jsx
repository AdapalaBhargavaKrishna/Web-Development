import React from 'react'
import youtubelogo from '../assets/svg/youtube.svg'
import magicsvg from '../assets/svg/arrow.svg'

const Home = () => {
  return (
    <div className='bg-[#f4f9ff] min-h-screen'>
      <div className='flex flex-col items-center max-w-4xl mx-auto text-center px-4 sm:px-6 md:px-14 pt-28'>
        <h1 className='text-2xl sm:text-3xl md:text-[3.1rem] font-bold leading-snug'>
          Transform YouTube into Learning
        </h1>

        <p className='text-neutral-700 text-sm sm:text-base md:text-lg my-3 mx-auto max-w-2xl'>
          Paste any YouTube URL to get AI-powered summaries, flashcards, and track your learning journey
        </p>

        <div className='flex flex-col sm:flex-row items-center justify-center gap-3 mt-10 bg-white p-4 rounded-xl w-full max-w-2xl shadow-md transition duration-200 hover:shadow-lg'>

          <img src={youtubelogo} className='w-10 h-10' alt="YouTube Logo" />

          <input
            type="text"
            placeholder='Paste YouTube URL here'
            className='w-full sm:w-[70%] p-2 rounded-lg bg-white border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-100 transition duration-200'
          />

          <button className='flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm whitespace-nowrap'>
            <img src={magicsvg} className='w-4 h-4' alt="Magic Icon" />
            <p>Analyze</p>
          </button>

        </div>
      </div>
    </div>
  )
}

export default Home
