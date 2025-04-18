import React from 'react';

const About = () => {
  return (
    <div className="flex flex-col justify-center items-center mt-20 text-white px-4">
      <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#b2a8fd] via-[#8678f9] to-[#c7d2fe] bg-clip-text text-transparent mb-8">
        About This App
      </h1>

      <div className="max-w-3xl text-center bg-gray-900 p-8 rounded-3xl border border-gray-800 shadow-lg">
        <p className="text-lg text-slate-400 mb-4">
          🎬 <span className="text-white font-semibold">Your Personal Movie Watchlist</span> —
          built to help you save, manage, and explore your favorite movies effortlessly.
        </p>

        <p className="text-slate-400 mb-4">
          Powered by the <a href="https://www.omdbapi.com/" target="_blank" rel="noopener noreferrer" className="text-[#8678f9] underline">OMDb API</a>,
          this app fetches real-time movie details so you can focus on building the ultimate watchlist.
        </p>

        <p className="text-slate-400 mb-4">
          💾 Authenticated and secured using <span className="text-white font-semibold">Firebase</span> for a smooth and personal experience.
        </p>

        <p className="text-slate-400 mb-4">
          Designed and developed by <span className="text-white font-semibold">Bhargava</span> with ❤️ and
          <span className="text-white font-semibold"> React & TailwindCSS</span>.
        </p>

        <p className="text-slate-400 mt-6">
          ✨ Explore, Save, and Rewatch — because great movies deserve more than one look.
        </p>
      </div>
    </div>
  );
};

export default About;
