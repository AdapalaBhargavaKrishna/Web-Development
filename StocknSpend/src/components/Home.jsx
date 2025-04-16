import React, { useEffect } from 'react';
import gsap from 'gsap';
import { Link } from 'react-router-dom';

const Home = () => {

  useEffect(() => {
    gsap.fromTo('.animate-heads', { opacity: 0, y: -100 }, { opacity: 1, y: 0, stagger: 0.2, duration: 1 });
    gsap.fromTo('.animate-slide', { x: -200 }, { x: 0, duration: 1, ease: 'power3.out' });
    gsap.fromTo('.animate-rotate', { scale: 0.5 }, { scale: 1, duration: 1, ease: 'power3.out' });
  }, []);

  return (
    <>
      <div className="flex justify-around items-center p-5 mt-20">

        <div className="text-white">
          <h3 className="font-bold text-5xl mb-4 animate-heads">Welcome To</h3>
          <h1 className="font-extrabold text-9xl mb-6 animate-heads">Stock & Spend</h1>
          <p className="text-lg mb-8 text-gray-400 animate-heads">Track your stocks & manage your personal finance — All in One!</p>

          <div className="flex gap-5">

            <Link to="/stocks" className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-3xl bg-[#38BDF8] px-6 font-medium text-neutral-200 animate-slide">
              <span>Explore Stock</span>
              <div className="ml-1 transition duration-300 group-hover:rotate-[360deg]">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                  <path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                </svg>
              </div>
            </Link>

            <Link to="/finance" className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-3xl border border-[#38BDF8] text-[#38BDF8] px-6 font-medium animate-slide">
              <span>Finance Tracker</span>
              <div className="w-0 translate-x-[100%] pl-0 opacity-0 transition-all duration-200 group-hover:w-5 group-hover:translate-x-0 group-hover:pl-1 group-hover:opacity-100">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                  <path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                </svg>
              </div>
            </Link>

          </div>
        </div>

        <div className="hidden md:block animate-rotate">
          <img src="/homebg.png" alt="" className="bg-transparent w-[500px] animate-pulse" />
        </div>
      </div>

    </>
  );
};

export default Home;
