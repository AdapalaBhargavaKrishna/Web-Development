import React from 'react';
import githublogo from '../assets/github.svg';
import linkedinlogo from '../assets/linkedin.svg';
import googlelogo from '../assets/google.svg';
import arrowsvg from '../assets/arrow.svg';
import { auth } from '../firebase/firebase';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
  
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('Logged in as:', user.displayName);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/home');
    } catch (error) {
      console.error('Error during Google login:', error);
    }
  };

  return (
    <>
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

      <nav className="flex justify-end bg-transparent text-white w-full p-5 md:pr-52">
        <a href="https://www.linkedin.com/in/bhargava-krishna-adapala">
          <button className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-2xl bg-transparent px-6 font-medium text-neutral-200 duration-500">
            <div className="translate-x-0 opacity-100 transition group-hover:-translate-x-[150%] group-hover:opacity-0">Linked In</div>
            <div className="absolute translate-x-[150%] opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100">
              <img src={linkedinlogo} alt="" />
            </div>
          </button>
        </a>
        <a href="https://github.com/AdapalaBhargavaKrishna/Web-Development/tree/main/MovieShelf">
          <button className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-2xl bg-transparent px-6 font-medium text-neutral-200 duration-500">
            <div className="translate-x-0 opacity-100 transition group-hover:-translate-x-[150%] group-hover:opacity-0">Github</div>
            <div className="absolute translate-x-[150%] opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100">
              <img src={githublogo} alt="" />
            </div>
          </button>
        </a>
      </nav>

      <div className="flex flex-col justify-center items-center text-white md:mt-20 mt-28 gap-4">
        <h3 className='font-bold md:text-4xl text-2xl'>Welcome To</h3>
        <h1 className='font-bold md:text-8xl text-4xl'>Movie Shelf</h1>
        <p className='md:font-bold md:px-0 px-5 text-center'>Your personal space to explore, save & track your favorite movies.</p>
      </div>

      <div className="flex items-center justify-center md:mt-10 m-20">
        <button onClick={() => handleGoogleLogin()} className="group relative inline-flex h-12 items-center justify-center border overflow-hidden rounded-2xl bg-neutral-950 px-6 font-medium text-neutral-200 duration-500">
          <div className="relative inline-flex -translate-x-0 items-center transition group-hover:-translate-x-6">
            <div className="absolute translate-x-0 opacity-100 transition group-hover:-translate-x-6 group-hover:opacity-0">
              <img src={googlelogo} width={20} height={20} alt="Google Logo" />
            </div>
            <span className="pl-6">Continue with Google</span>
            <div className="absolute right-0 translate-x-12 opacity-0 transition group-hover:translate-x-6 group-hover:opacity-100">
              <img src={arrowsvg} alt="Arrow" />
            </div>
          </div>
        </button>
      </div>
    </>
  );
}

export default Login;
