import React, { useContext, useEffect, useState } from 'react';
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import API from '../api'
import { UserContext } from '../data/UserContext';
import logosvg from '../assets/svg/logo.svg';
import googlelogo from '../assets/svg/google.svg';
import arrowsvg from '../assets/svg/arrow.svg';
import mailsvg from '../assets/svg/mail.svg';


const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [form , setForm] = useState({email: '', password: ''})

  useEffect(() => {
    setUser(null);
    localStorage.removeItem("autotube-user");
  }, [])
  

  const handleSignin = async (e) => {
    e.preventDefault()
    try {
      const res = await API.post('/user/login', form)
      alert(res.data.msg)
      console.log(res.data.user)
      setUser({
        _id: res.data.user._id,
        name: res.data.user.name,
        email: res.data.user.email 
      })
      navigate('/Dashboard')
    } catch (err) {
      console.log(err)
      alert(err.response?.data?.msg || "Signup Failed")
    }
  }

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const res = await API.post('/user/firebase-login', {
        name: user.displayName,
        email: user.email
      })
      console.log("User Info:", res.data.user);
      setUser({
        _id: res.data.user._id,
        name: res.data.user.name,
        email: res.data.user.email 
      })
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

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
        <h1 className="text-2xl font-bold text-center mb-2">Welcome Back</h1>
        <p className="text-center text-base text-neutral-500 mb-6">Continue your learning journey</p>

        <button
          onClick={handleLogin}
          className="group relative flex items-center justify-center gap-2 w-full h-12 border rounded-xl bg-neutral-50 font-medium text-neutral-900 hover:bg-gray-100 transition">
          <img src={googlelogo} alt="Google" className="w-5 h-5" />
          <span>Continue with Google</span>
          <img src={arrowsvg} alt="Arrow" className="absolute right-4 opacity-0 group-hover:opacity-100 transition" />
        </button>

        <div className="flex items-center my-5">
          <div className="flex-grow h-px bg-neutral-300" />
          <span className="mx-3 text-xs font-semibold text-neutral-500">OR</span>
          <div className="flex-grow h-px bg-neutral-300" />
        </div>

        <div className="mb-4">
          <label className="block text-base font-semibold mb-1" htmlFor="email">Email Address</label>
          <div className="flex items-center border rounded-xl px-3 py-2 gap-2">
            <img src={mailsvg} alt="Email" className="w-4 h-4" />
            <input
              type="email"
              id="email"
              onChange={(e) => setForm({...form, email: e.target.value})}
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
              onChange={(e) => setForm({...form, password: e.target.value})}
              placeholder="Enter your password"
              className="w-full bg-transparent outline-none text-base"
            />
          </div>
        </div>

        <button 
        onClick={handleSignin}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl py-2 font-semibold hover:opacity-90 transition">
          Sign In
        </button>

        <p className="text-base text-center text-neutral-600 mt-4">
          Don’t have an account?{' '}
          <a href="/Signup" className="text-blue-600 font-semibold hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
