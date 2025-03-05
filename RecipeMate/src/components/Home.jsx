import React from 'react';

const Home = () => {
  return (
    <div id="Home" className="relative w-full h-screen">
      {/* Background Video */}
      <div id="video" className="absolute inset-0 w-full h-full">
        <video
          src="/videos/cooking.mp4"
          autoPlay
          loop
          muted
          className="w-full h-full object-cover"
        />
      </div>

      {/* Title and Content */}
      <div
        id="Title"
        className="absolute inset-0 flex flex-col items-center text-white text-center 
                   justify-center gap-6 px-4"
      >
        {/* Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-9xl font-extrabold">
          RecipeMate
        </h1>

        {/* Tagline */}
        <p className="text-lg sm:text-2xl md:text-3xl font-bold">
          Discover, Cook, and Enjoy – Your Ultimate Recipe Companion!
        </p>

        {/* Button */}
        <button className="px-6 py-3 sm:px-8 sm:py-4 text-lg sm:text-xl font-semibold 
                          bg-red-500 rounded-lg shadow-lg hover:bg-red-600 transition-all">
          Find Recipes 🍳
        </button>
      </div>

      {/* Down Arrow (for scrolling hint) */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <span className="text-white text-2xl sm:text-3xl">↓</span>
      </div>
    </div>
  );
};

export default Home;
