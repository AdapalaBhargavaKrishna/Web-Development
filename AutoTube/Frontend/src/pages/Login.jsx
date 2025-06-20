import React, { useContext, useEffect, useState } from 'react';
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import API from '../api';
import { UserContext } from '../data/UserContext';
import logosvg from '../assets/svg/logo.svg';
import googlelogo from '../assets/svg/google.svg';
import arrowsvg from '../assets/svg/arrow.svg';
import mailsvg from '../assets/svg/mail.svg';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [form, setForm] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setUser(null);
    localStorage.removeItem("autotube-user");
    toast.success("Session cleared. Please login again.", {
      position: "top-center",
      icon: '🔒',
    });
  }, []);

  const handleSignin = async (e) => {
    e.preventDefault();
    
    if (!form.email || !form.password) {
      toast.error("Please fill in all fields", {
        position: "top-center",
        icon: '⚠️',
      });
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading("Authenticating...", {
      position: "top-center",
    });

    try {
      const res = await API.post('/user/login', form);
      toast.success(`Welcome back!`, {
        id: loadingToast,
        position: "top-center",
        icon: '👋',
      });

      setUser({
        _id: res.data.user._id,
        name: res.data.user.name,
        email: res.data.user.email,
        createdAt: res.data.user.createdAt,
        updatedAt: res.data.user.updatedAt
      });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.msg || "Login failed. Please check your credentials.",
        { 
          id: loadingToast,
          position: "top-center",
          duration: 4000,
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    const loadingToast = toast.loading("Connecting with Google...", {
      position: "top-center",
    });

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const res = await API.post('/user/firebase-login', {
        name: user.displayName,
        email: user.email
      });

      toast.success(`Welcome, ${user.displayName.split(' ')[0]}!`, {
        id: loadingToast,
        position: "top-center",
        icon: '🎉',
      });

      setUser({
        _id: res.data.user._id,
        name: res.data.user.name,
        email: res.data.user.email,
        createdAt: res.data.user.createdAt,
        updatedAt: res.data.user.updatedAt
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Google login failed:", error);
      toast.error("Google login failed. Please try again.", {
        id: loadingToast,
        position: "top-center",
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants (unchanged)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const buttonHover = {
    scale: 1.02,
    transition: { type: "spring", stiffness: 400, damping: 10 }
  };

  const buttonTap = {
    scale: 0.98,
    transition: { type: "spring", stiffness: 400, damping: 10 }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 px-4"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        {/* Logo and Title */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center gap-4 mb-8"
        >
          <motion.div
            whileHover={{ rotate: 5, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl p-3 shadow-lg"
          >
            <img src={logosvg} alt="Logo" className="w-12 h-12" />
          </motion.div>
          <div>
            <motion.h1
              className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              AutoTube
            </motion.h1>
            <motion.p
              className="text-lg text-neutral-600"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              Your Learning Tracker
            </motion.p>
          </div>
        </motion.div>

        {/* Tagline */}
        <motion.p
          variants={itemVariants}
          className="text-center text-neutral-700 mb-10 text-lg font-medium"
        >
          Transform your YouTube watching into structured learning
        </motion.p>

        {/* Login Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="p-8 sm:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h1 className="text-2xl font-bold text-center mb-2">Welcome Back</h1>
              <p className="text-center text-neutral-500 mb-6">Continue your learning journey</p>
            </motion.div>

            {/* Google Login Button */}
            <motion.button
              variants={itemVariants}
              whileHover={buttonHover}
              whileTap={buttonTap}
              onClick={handleLogin}
              disabled={isLoading}
              className="group relative flex items-center justify-center gap-3 w-full h-12 border rounded-xl bg-neutral-50 font-medium text-neutral-900 hover:bg-gray-100 transition mb-4"
            >
              <motion.img
                src={googlelogo}
                alt="Google"
                className="w-5 h-5"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 1 }}
              />
              <span>{isLoading ? "Signing in..." : "Continue with Google"}</span>
              <motion.img
                src={arrowsvg}
                alt="Arrow"
                className="absolute right-4 opacity-0 group-hover:opacity-100 transition"
                initial={{ x: -10 }}
                animate={{ x: 0 }}
                transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.5 }}
              />
            </motion.button>

            {/* Divider */}
            <motion.div
              className="flex items-center my-5"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex-grow h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />
              <span className="mx-3 text-xs font-semibold text-neutral-500">OR</span>
              <div className="flex-grow h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />
            </motion.div>

            {/* Email Input */}
            <motion.div
              variants={itemVariants}
              className="mb-4"
            >
              <label className="block text-base font-semibold mb-1" htmlFor="email">Email Address</label>
              <motion.div
                className="flex items-center border rounded-xl px-3 py-2 gap-2 hover:border-purple-400 focus-within:border-purple-500 transition"
                whileHover={{ scale: 1.01 }}
              >
                <img src={mailsvg} alt="Email" className="w-4 h-4" />
                <input
                  type="email"
                  id="email"
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Enter your email"
                  className="w-full bg-transparent outline-none text-base"
                />
              </motion.div>
            </motion.div>

            {/* Password Input */}
            <motion.div
              variants={itemVariants}
              className="mb-5"
            >
              <label className="block text-base font-semibold mb-1" htmlFor="password">Password</label>
              <motion.div
                className="flex items-center border rounded-xl px-3 py-2 hover:border-purple-400 focus-within:border-purple-500 transition"
                whileHover={{ scale: 1.01 }}
              >
                <input
                  type="password"
                  id="password"
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Enter your password"
                  className="w-full bg-transparent outline-none text-base"
                />
              </motion.div>
            </motion.div>

            {/* Sign In Button */}
            <motion.button
              variants={itemVariants}
              whileHover={buttonHover}
              whileTap={buttonTap}
              onClick={handleSignin}
              disabled={isLoading}
              className="relative w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl py-3 font-semibold hover:opacity-90 transition overflow-hidden"
            >
              {isLoading ? (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center gap-2"
                >
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="block w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                  Signing in...
                </motion.span>
              ) : (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Sign In
                </motion.span>
              )}
            </motion.button>
            {isLoading && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }} // show after 2 seconds
                className="text-sm text-center mt-4 text-red-500"
              >
                If this is taking too long, please refresh and try again.
              </motion.p>
            )}

            {/* Sign Up Link */}
            <motion.p
              variants={itemVariants}
              className="text-center text-neutral-600 mt-6"
            >
              Don't have an account?{' '}
              <motion.a
                href="/signup"
                className="text-blue-600 font-semibold hover:underline"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign up
              </motion.a>
            </motion.p>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Login;