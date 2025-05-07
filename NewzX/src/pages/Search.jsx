import React, { useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useNavigate } from 'react-router-dom';
import githublogo from '../assets/github.svg';
import linkedinlogo from '../assets/linkedin.svg';
import backlogo from '../assets/back.svg';
import searchlogo from '../assets/searchw.svg';
import { Filter, X } from 'lucide-react';
import { motion } from 'framer-motion';

const Search = () => {
  const apiKey = import.meta.env.VITE_GNEWS_API_KEY;
  const [searchQuery, setSearchQuery] = useState('');
  const [newsData, setNewsData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showFilter, setShowFilter] = useState(false)
  const [recentSearches, setRecentSearches] = useState([])
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  dayjs.extend(relativeTime);
  dayjs.extend(utc);
  dayjs.extend(timezone);

  const categories = [
    'All', 'World', 'India', 'Business',
    'Technology', 'Entertainment', 'Sports',
    'Science', 'Health'
  ];

  const goToHome = () => {
    navigate('/');
  }

  const fetchNews = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setNewsData([]);

    try {
      let url = '';

      if (selectedCategory === 'India') {
        url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(searchQuery)}&lang=en&country=in&apikey=${apiKey}`;
      }
      else if (selectedCategory === 'All') {
        url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(searchQuery)}&lang=en&apikey=${apiKey}`;
      }
      else {
        url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(searchQuery)}&lang=en&topic=${selectedCategory.toLowerCase()}&apikey=${apiKey}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.articles && data.articles.length > 0) {
        setNewsData(data.articles);
      }

    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#000000] text-white min-h-screen">
      <nav className="flex items-center justify-between md:justify-around bg-transparent text-white w-full p-5">
        <motion.div
          initial={{ opacity: 0, x: -1000 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          onClick={() => goToHome()}
          className="cursor-pointer flex items-center gap-2">
          <img src={backlogo} className="mt-1" alt="Back" />
          <h1 className="md:text-2xl text-xl font-bold">Back to Home</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 1000 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex items-center">
          <a href="https://www.linkedin.com/in/bhargavakrishnaadapala/">
            <button className="group active:scale-95 relative inline-flex h-12 items-center justify-center overflow-hidden rounded-2xl md:px-6 px-2 font-medium text-white transition-colors focus:outline-none">
              <span className="translate-x-0 opacity-100 transition group-hover:-translate-x-[150%] group-hover:opacity-0">LinkedIn</span>
              <span className="absolute translate-x-[150%] opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100">
                <img src={linkedinlogo} alt="LinkedIn" />
              </span>
            </button>
          </a>
          <a href="https://github.com/AdapalaBhargavaKrishna/Web-Development/tree/main/MovieShelf">
            <button className="group active:scale-95 relative inline-flex h-12 items-center justify-center overflow-hidden rounded-2xl px-4 md:px-6 font-medium text-white transition-colors focus:outline-none">
              <span className="translate-x-0 opacity-100 transition group-hover:-translate-x-[150%] group-hover:opacity-0">GitHub</span>
              <span className="absolute translate-x-[150%] opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100">
                <img src={githublogo} alt="GitHub" />
              </span>
            </button>
          </a>
        </motion.div>
      </nav>

      <div className="flex flex-col items-center justify-center mt-10">
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full max-w-3xl">
          <div className="relative">
            <div
              className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <img
                src={searchlogo} alt="Search" className="w-5 h-5" />
            </div>

            <div className="absolute top-0 flex w-full justify-center">
              <div className="h-[1px] animate-border-width rounded-full bg-gradient-to-r from-[rgba(17,17,17,0)] via-white to-[rgba(17,17,17,0)] transition-all duration-1000" />
            </div>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (searchQuery.trim() !== '' && !recentSearches.includes(searchQuery.trim())) {
                    setRecentSearches([searchQuery.trim(), ...recentSearches]);
                  }
                  fetchNews();
                }
              }}
              className="block h-12 w-full rounded-md border placeholder:text-gray-500 border-gray-800 bg-black px-12 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 focus:ring-offset-gray-50"
              placeholder="Search for news, topics, sources..."
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  if (searchQuery.trim() !== '' && !recentSearches.includes(searchQuery.trim())) {
                    setRecentSearches([searchQuery.trim(), ...recentSearches]);
                  }
                  setSearchQuery('');
                }}
                className="absolute inset-y-0 right-10 flex items-center pr-2 text-gray-400 hover:text-white"
              >
                <X onClick={() => setNewsData([])} className="w-5 h-5" />
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowFilter(!showFilter)}
              className="absolute inset-y-0 right-4 flex items-center"
            >
              <Filter className={`w-5 h-5 transition-colors duration-200 hover:text-[#9d4fe6] ${showFilter ? 'text-[#9d4fe6]' : 'text-white'}`} />
            </button>

          </div>
        </motion.div>

        {recentSearches.length > 0 && (
          <div className='flex flex-col w-[95%] md:w-[44%] items-center justify-center'>

            <h1 className='text-gray-400 text-left mt-2 w-full'>Recent Searches</h1>
            <ul className='flex justify-start items-center overflow-auto gap-2 w-full'>
              {recentSearches.map((item, index) => (
                <li key={index}>
                  <span className='recent cursor-pointer hover:text-[#9d4fe6]' onClick={() => setSearchQuery(item)}>
                    {item}
                  </span>
                </li>
              ))}

            </ul>

          </div>
        )}

        {showFilter && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='w-[95%] md:w-[44%] bg-[#080a0e] rounded-xl p-4 mt-5'>
            <h1 className='text-lg font-semibold mb-2'>Filter by category</h1>

            {categories.map(category => (
              <button
                key={category}
                className={`ml-2 px-3 p-1 border border-gray-700 rounded-3xl mt-2 ${selectedCategory === category ? 'bg-[#9d4fe6] text-white' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}</button>
            ))}
          </motion.div>
        )}

      </div>

      {loading && (
        <div className='flex flex-col items-center justify-center mt-40 md:mt-20 p-10 w-full'>
        <div className="loader">
      <div className="circle"></div>
      <div className="circle"></div>
      <div className="circle"></div>
      <div className="circle"></div>
    </div>
        </div>

      )}

      {newsData.length !== 0 && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className='flex flex-col items-center mt-10'>
          <div className='flex flex-col items-center w-full md:w-[65%]'>
            <div className='p-5 bg-[#080a0e] shadow-2xl rounded-2xl m-3 gap-2 min-h-96 max-h-[80vh] overflow-y-auto'>
              <h1 className="newsheadings"
              >Search Results</h1>

              {newsData.map((news, index) => (
                <div>
                  <div className='flex flex-col items-center rounded-xl p-2 my-4 md:flex-row cursor-pointer'>
                    <div className='md:w-2/5 flex flex-col items-center'>
                      <img src={news.image} className='md:w-[20vw] w-[90%] rounded-2xl object-contain' alt="" />
                      <h1 className='text-left text-sm text-gray-400'>Source: {news.source.name}</h1>
                    </div>
                    <div className='md:w-3/5 flex flex-col gap-2'>
                      <h1 className='md:text-2xl text-xl font-bold text-center md:text-left'>{news.title}</h1>
                      <h3 className='text-gray-300 text-xs'>{news.description}</h3>
                      <p className='text-sm'>{news.content?.split('[')[0].trim() + " Read More"}</p>
                      <div className='flex justify-between items-center px-2 mt-4'>
                        <div>
                          <h1 className='text-gray-400 text-sm'>Published: {dayjs(news.publishedAt).fromNow()}</h1>
                          <h2 className='text-gray-400 text-xs'>({dayjs.utc(news.publishedAt).tz('Asia/Kolkata').format('MMMM D, YYYY h:mm A')})</h2>
                        </div>
                        <a href={news.url} className='text-blue-500'><span className='inline-flex h-8 animate-background-shine cursor-pointer items-center justify-center rounded-full border border-gray-800 bg-[linear-gradient(110deg,#000,45%,#4D4B4B,55%,#000)] bg-[length:250%_100%] px-3 py-1 text-xs font-medium text-gray-300'>Read More</span></a>
                      </div>
                    </div>
                  </div>
                  <hr className='border border-gray-800' />
                </div>
              ))}

            </div>
          </div>
        </motion.div>
      )}



    </div>
  );
};

export default Search;