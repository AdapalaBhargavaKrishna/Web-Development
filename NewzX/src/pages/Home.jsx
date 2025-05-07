import React, { useEffect, useState } from 'react';
import githublogo from '../assets/github.svg';
import linkedinlogo from '../assets/linkedin.svg';
import searchlogo from '../assets/search.svg';
import arrowlogo from '../assets/arrow.svg';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

const Home = () => {
  const apiKey = import.meta.env.VITE_GNEWS_API_KEY;
  const [localLoading, setLocalLoading] = useState(true)
  const navigate = useNavigate()

  dayjs.extend(relativeTime);

  useEffect(() => {
    console.log(dayjs("2025-05-07T01:14:51Z").fromNow())

  }, [])

  const goToSearch = () => {
    navigate('/search')
  }


  return (
    <>
      <div className='bg-[#000000] text-white min-h-screen'>
        <nav className="flex items-center justify-between md:justify-around bg-transparent text-white w-full p-4 md:p-5">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className='text-2xl font-bold'>NewzX</motion.div>
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <a href="https://www.linkedin.com/in/bhargavakrishnaadapala/">
              <button className="group active:scale-95 relative inline-flex h-12 items-center justify-center overflow-hidden rounded-2xl px-6 font-medium text-white transition-colors focus:outline-none">
                <div className="translate-x-0 opacity-100 transition group-hover:-translate-x-[150%] group-hover:opacity-0">LinkedIn</div>
                <div className="absolute translate-x-[150%] opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100">
                  <img src={linkedinlogo} alt="LinkedIn" />
                </div>
              </button>
            </a>
            <a href="https://github.com/AdapalaBhargavaKrishna/Web-Development/tree/main/MovieShelf">
              <button className="group active:scale-95 relative inline-flex h-12 items-center justify-center overflow-hidden rounded-2xl md:px-6 px-2 font-medium text-white transition-colors focus:outline-none">
                <div className="translate-x-0 opacity-100 transition group-hover:-translate-x-[150%] group-hover:opacity-0">GitHub</div>
                <div className="absolute translate-x-[150%] opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100">
                  <img src={githublogo} alt="GitHub" />
                </div>
              </button>
            </a>
          </motion.div>
        </nav>

        <div className='flex flex-col items-center'>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[2rem] text-center md:text-6xl font-bold mt-10 mb-5 md:m-10 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-300 to-white"
          >
            Discover News That Matters <span className="text-purple-500">Now</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className='text-lg md:text-xl text-gray-300 mb-8 p-3 md:max-w-4xl text-center'>Your gateway to breaking news, in-depth analysis, and stories that shape our world. Stay informed with the latest headlines from around the globe.
          </motion.p>

          <button
          onClick={() => goToSearch()}
          className='relative inline-flex h-12 md:w-1/3 w-4/5 items-center justify-center rounded-md bg-white px-6 font-medium text-gray-950'>
            <div className='flex items-center gap-2'>
              <img src={searchlogo} width={20} alt="" />
              <h1 className='font-semibold text-xl'>
                Search Now
              </h1>
            </div>
          </button>

        </div>


        <div className='flex flex-col md:flex-row justify-around mt-10 '>
          <div className='flex flex-col w-full md:w-[70%]'>
            <div className='p-5 bg-[#080a0e] shadow-2xl rounded-2xl m-3 gap-2 min-h-96 max-h-[80vh] overflow-y-auto'>
              <h1 
              onClick={() => goToSearch()}
              className="newsheadings">
                Latest News
                </h1>
              <hr className="border border-gray-500" />
              <div className='flex flex-col bg-[#0e1014] rounded-xl p-2 my-4 md:flex-row cursor-pointer'>
                <div className='md:w-2/5 flex flex-col items-center'>
                  <img src="https://www.hindustantimes.com/ht-img/img/2025/05/07/1600x900/Pakistan_travel_advisory_1746580370197_1746580370490.jpg" className='md:w-[25vw] w-[90%] rounded-2xl object-contain' alt="" />
                  <h1 className='text-center text-sm text-gray-400'>Source: Hindustan Times</h1>
                </div>
                <div className='md:w-3/5 flex flex-col gap-2'>
                  <h1 className='md:text-2xl text-xl font-bold text-center md:text-left'>Pakistan travel advisory: Airlines issue alerts after India's strikes - here's a list</h1>
                  <h3 className='text-gray-300 text-xs'>Several airlines, including Air India and Qatar Airways, issued a travel advisory for Pakistan after India's Operation Sindoor strikes | World News</h3>
                  <p className='text-sm'>Several airlines, including Air India and Qatar Airways, issued a travel advisory for Pakistan after India's Operation Sindoor strikes on nine terror sites overnight on Tuesday. Airlines urged passengers to check updates before travel. Several airlin...</p>
                  <div className='flex justify-between items-center px-2 mt-4'>
                    <div>
                      <h1 className='text-gray-400 text-sm'>Published: {dayjs("2025-05-07T01:14:51Z").fromNow()}</h1>
                      <h2 className='text-gray-400 text-xs'>(May 7, 2025, 06:44:51 AM)</h2>
                    </div>
                    <a href="https://www.hindustantimes.com/world-news/pakistan-travel-advisory-airlines-issue-alerts-after-indias-strikes-heres-a-list-101674658037019.html" className='text-blue-500'><span className='inline-flex h-8 animate-background-shine cursor-pointer items-center justify-center rounded-full border border-gray-800 bg-[linear-gradient(110deg,#000,45%,#4D4B4B,55%,#000)] bg-[length:250%_100%] px-3 py-1 text-xs font-medium text-gray-300'>Read More</span></a>
                  </div>


                </div>
              </div>
              
            </div>
          </div>

          <div className='w-full md:w-[30%]'>
            <div className='m-3 bg-[#080a0e] rounded-2xl min-h-80 p-4 max-h-[80vh]'>
              <h1 
              onClick={() => goToSearch()}
              className='newsheadings'>
                Local News
                </h1>
              <hr className='my-2 border border-gray-500' />

              <div className='flex text-center items-center justify-between md:mt-10 mt-5'>
                <p>Search Your City:</p>
                <div className="relative md:w-[70%]">
                  <input
                    className='border-1 block h-12 w-full rounded-md border border-double border-slate-800 border-transparent bg-[linear-gradient(#000,#000),linear-gradient(to_right,#334454,#334454)]	bg-origin-border px-3 py-2 text-slate-200 transition-all duration-500 [background-clip:padding-box,_border-box] placeholder:text-slate-500 focus:bg-[linear-gradient(#000,#000),linear-gradient(to_right,#c7d2fe,#8678f9)] focus:outline-none'
                    placeholder='Search Here'
                  />
                  <img className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 cursor-pointer" src={arrowlogo} alt="Continue" />

                </div>
              </div>

              {localLoading &&

                <div className='flex flex-col items-center justify-center mt-28'>
                  <span className='inline-flex animate-background-opacity bg-[linear-gradient(110deg,#939393,45%,#1e293b,55%,#939393)] bg-[length:250%_100%] bg-clip-text text-xl text-transparent'>
                    Search News Appears Here
                  </span>
                </div>

              }

            </div>
          </div>

        </div>
        <div className='grid md:grid-cols-3 grid-col-1'>
          <div style={newstopics} className='gap-2 overflow-y-auto'>
            <h1 onClick={() => goToSearch()} className='newsheadings'>India</h1>
            <hr className="border border-gray-500" />
            <div className='rounded-xl'>
              <div className='flex p-2 mt-2'>
                <div className='w-3/5'>
                  <h1 className='text-lg font-bold'>Pakistan travel advisory: Airlines issue alerts after India's strikes - here's a list</h1>
                </div>
                <div className='w-2/5 flex flex-col items-end'>
                  <img src="https://www.hindustantimes.com/ht-img/img/2025/05/07/1600x900/Pakistan_travel_advisory_1746580370197_1746580370490.jpg"
                    className='w-32 object-covers rounded-lg mr-2' alt="" />
                  <h1 className='text-center text-sm text-gray-400'>Source: Hindustan Times</h1>
                </div>
              </div>
              <div className='flex items-center justify-between px-2 mt-0'>
                <div>
                  <h1 className='text-gray-400'>Published: {dayjs("2025-05-07T01:14:51Z").fromNow()}</h1>
                  <h2 className='text-gray-400 text-xs'>(May 7, 2025, 06:44:51 AM)</h2>
                </div>
                <a href="https://www.hindustantimes.com/world-news/pakistan-travel-advisory-airlines-issue-alerts-after-indias-strikes-heres-a-list-101674658037019.html" className='text-blue-500'><span className='inline-flex h-8 animate-background-shine cursor-pointer items-center justify-center rounded-full border border-gray-800 bg-[linear-gradient(110deg,#000,45%,#4D4B4B,55%,#000)] bg-[length:250%_100%] px-3 py-1 text-xs font-medium text-gray-300'>Read More</span></a>
              </div>
              <hr className='mt-2 border border-gray-800' />
            </div>
          </div>
          <div style={newstopics}>
            <h1 onClick={() => goToSearch()} className='newsheadings'>Sports</h1>
            <hr className="border border-gray-500" />
            <div className='rounded-xl'>
              <div className='flex p-2 mt-2'>
                <div className='w-3/5'>
                  <h1 className='text-lg font-bold'>Pakistan travel advisory: Airlines issue alerts after India's strikes - here's a list</h1>
                </div>
                <div className='w-2/5 flex flex-col items-end'>
                  <img src="https://www.hindustantimes.com/ht-img/img/2025/05/07/1600x900/Pakistan_travel_advisory_1746580370197_1746580370490.jpg"
                    className='w-32 object-covers rounded-lg mr-2' alt="" />
                  <h1 className='text-center text-sm text-gray-400'>Source: Hindustan Times</h1>
                </div>
              </div>
              <div className='flex items-center justify-between px-2 mt-0'>
                <div>
                  <h1 className='text-gray-400'>Published: {dayjs("2025-05-07T01:14:51Z").fromNow()}</h1>
                  <h2 className='text-gray-400 text-xs'>(May 7, 2025, 06:44:51 AM)</h2>
                </div>
                <a href="https://www.hindustantimes.com/world-news/pakistan-travel-advisory-airlines-issue-alerts-after-indias-strikes-heres-a-list-101674658037019.html" className='text-blue-500'><span className='inline-flex h-8 animate-background-shine cursor-pointer items-center justify-center rounded-full border border-gray-800 bg-[linear-gradient(110deg,#000,45%,#4D4B4B,55%,#000)] bg-[length:250%_100%] px-3 py-1 text-xs font-medium text-gray-300'>Read More</span></a>
              </div>
              <hr className='mt-2 border border-gray-800' />
            </div>
          </div>
          <div style={newstopics}>
            <h1 onClick={() => goToSearch()} className="newsheadings">Tech</h1>
            <hr className="border border-gray-500" />
            <div className='rounded-xl'>
              <div className='flex p-2 mt-2'>
                <div className='w-3/5'>
                  <h1 className='text-lg font-bold'>Pakistan travel advisory: Airlines issue alerts after India's strikes - here's a list</h1>
                </div>
                <div className='w-2/5 flex flex-col items-end'>
                  <img src="https://www.hindustantimes.com/ht-img/img/2025/05/07/1600x900/Pakistan_travel_advisory_1746580370197_1746580370490.jpg"
                    className='w-32 object-covers rounded-lg mr-2' alt="" />
                  <h1 className='text-center text-sm text-gray-400'>Source: Hindustan Times</h1>
                </div>
              </div>
              <div className='flex items-center justify-between px-2 mt-0'>
                <div>
                  <h1 className='text-gray-400'>Published: {dayjs("2025-05-07T01:14:51Z").fromNow()}</h1>
                  <h2 className='text-gray-400 text-xs'>(May 7, 2025, 06:44:51 AM)</h2>
                </div>
                <a href="https://www.hindustantimes.com/world-news/pakistan-travel-advisory-airlines-issue-alerts-after-indias-strikes-heres-a-list-101674658037019.html" className='text-blue-500'><span className='inline-flex h-8 animate-background-shine cursor-pointer items-center justify-center rounded-full border border-gray-800 bg-[linear-gradient(110deg,#000,45%,#4D4B4B,55%,#000)] bg-[length:250%_100%] px-3 py-1 text-xs font-medium text-gray-300'>Read More</span></a>
              </div>
              <hr className='mt-2 border border-gray-800' />
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

const newstopics = {
  padding: '2.5rem',
  backgroundColor: '#080a0e',
  borderRadius: '1rem',
  margin: '0.75rem',
  maxHeight: '40rem'
};


export default Home;
