import React from 'react';
import logosvg from '../assets/svg/logo.svg';
import usersvg from '../assets/svg/user.svg';
import arrowsvg from '../assets/svg/arrow.svg';
import mailsvg from '../assets/svg/mail.svg';

const Signup = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">

      <div className="flex items-center gap-3 mb-4">
        <div className="bg-purple-500 rounded-xl p-2 shadow-md">
          <img src={logosvg} alt="Logo" className="w-10 h-10" />
        </div>
        <div>
          <h1 className="font-bold text-2xl">AutoTube</h1>
          <p className="text-base text-neutral-600">Your Learning Tracker</p>
        </div>
      </div>

      <p className="text-base text-neutral-700 mb-10">Transform your YouTube watching into structured learning</p>

      <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-10 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-2">Create Account</h1>
        <p className="text-center text-base text-neutral-500 mb-6">Start your learning journey</p>       

        <div className="mb-4">
          <label className="block text-base font-semibold mb-1" htmlFor="email">Full Name</label>
          <div className="flex items-center border rounded-xl px-3 py-2 gap-2">
            <img src={usersvg} alt="Email" className="w-4 h-4" />
            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              className="w-full bg-transparent outline-none text-base"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-base font-semibold mb-1" htmlFor="email">Email Address</label>
          <div className="flex items-center border rounded-xl px-3 py-2 gap-2">
            <img src={mailsvg} alt="Email" className="w-4 h-4" />
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full bg-transparent outline-none text-base"
            />
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-base font-semibold mb-1" htmlFor="password">Password</label>
          <div className="flex items-center border rounded-xl px-3 py-2">
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="w-full bg-transparent outline-none text-base"
            />
          </div>
        </div>

        <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl py-2 font-semibold hover:opacity-90 transition">
          Create Account
        </button>

        <p className="text-base text-center text-neutral-600 mt-4">
          Already have an account?{' '}
          <a href="/" className="text-blue-600 font-semibold hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;