import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import githublogo from '../assets/github.svg';
import linkedinlogo from '../assets/linkedin.svg';

const Search = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <>
      <div className='bg-[#000000] text-white min-h-screen'>
        <nav className="flex items-center justify-between md:justify-around bg-transparent text-white w-full p-5">
          <div className='text-2xl font-bold'>NewzX</div>
          <div>
            <a href="https://www.linkedin.com/in/bhargavakrishnaadapala/">
              <button className="group active:scale-95 relative inline-flex h-12 items-center justify-center overflow-hidden rounded-2xl px-6 font-medium text-white transition-colors focus:outline-none">
                <div className="translate-x-0 opacity-100 transition group-hover:-translate-x-[150%] group-hover:opacity-0">LinkedIn</div>
                <div className="absolute translate-x-[150%] opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100">
                  <img src={linkedinlogo} alt="LinkedIn" />
                </div>
              </button>
            </a>
            <a href="https://github.com/AdapalaBhargavaKrishna/Web-Development/tree/main/MovieShelf">
              <button className="group active:scale-95 relative inline-flex h-12 items-center justify-center overflow-hidden rounded-2xl px-6 font-medium text-white transition-colors focus:outline-none">
                <div className="translate-x-0 opacity-100 transition group-hover:-translate-x-[150%] group-hover:opacity-0">GitHub</div>
                <div className="absolute translate-x-[150%] opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100">
                  <img src={githublogo} alt="GitHub" />
                </div>
              </button>
            </a>
          </div>
        </nav>

        <div className='flex flex-col items-center justify-center pt-10'>
          <h1 className='text-3xl font-bold text-center mt-10'>Welcome to NewzX</h1>
          <p className='text-center mt-5 text-lg'>Your one-stop destination for the latest news and updates.</p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className='w-full max-w-md px-6 mt-8 relative'>
            <div className='absolute top-0 flex w-full justify-center'>
              <div className='h-[1px] animate-border-width rounded-full bg-gradient-to-r from-[rgba(17,17,17,0)] via-white to-[rgba(17,17,17,0)] transition-all duration-1000' />
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className='block h-12 w-full rounded-md border border-gray-800 bg-transparent px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 focus:ring-offset-gray-50'
              placeholder='Search Here'
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default Search;
