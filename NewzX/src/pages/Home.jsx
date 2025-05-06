import React, { useState } from 'react';
import githublogo from '../assets/github.svg';
import linkedinlogo from '../assets/linkedin.svg';
import searchlogo from '../assets/search.svg';
import { motion } from 'framer-motion';

const Home = () => {

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
            staggerChildren={2}
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

          <button className='relative inline-flex h-12 md:w-1/3 w-4/5 items-center justify-center rounded-md bg-white px-6 font-medium text-gray-950'>
            <div className='flex items-center gap-2'>
              <img src={searchlogo} width={20} alt="" />
              <h1 className='font-semibold text-xl'>
                Search Now
              </h1>
            </div>
          </button>

        </div>


        <div>
          <div>
            <div>
              Latest News
            </div>

            <div>
              <div>
                India
              </div>
              <div>
                Sports
              </div>
              <div>
                Tech
              </div>
              <div>
                Entertainment
              </div>

            </div>
          </div>

          <div>
            Local
            <input type="text" placeholder='Enter State' />
          </div>

        </div>

      </div>
    </>
  );
};

export default Home;
