import React, { useState } from 'react';
import { toast } from 'sonner';
import githublogo from '../assets/github.svg';
import linkedinlogo from '../assets/linkedin.svg';
import googlelogo from '../assets/google.svg';
import arrowlogo from '../assets/arrow.svg';
import userlogo from '../assets/user.svg';
import { auth } from '../firebase/firebase';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [showInput, setShowInput] = useState(false);
  const [guestName, setGuestName] = useState('');
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

  const handleGuestLogin = () => {
    if (guestName.trim() !== "") {
      const guestUser = {
        displayName: guestName.trim(),
        isGuest: true
      };

      localStorage.setItem('user', JSON.stringify(guestUser));
      navigate('/home');
    } else {
      toast.warning('Name is required to enter as Guest!');
    }
  };

  return (
    <>
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

      <nav className="flex justify-end bg-transparent text-white w-full p-5 md:pr-52">
        <a href="https://www.linkedin.com/in/bhargavakrishnaadapala/">

          <button className="group active:scale-95 animate-background-shine relative inline-flex h-12 items-center justify-center overflow-hidden rounded-2xl bg-[linear-gradient(110deg,transparent,45%,#1e2631,55%,transparent)] bg-[length:200%_100%] px-6 font-medium text-white transition-colors focus:outline-none">
          <div className="translate-x-0 opacity-100 transition group-hover:-translate-x-[150%] group-hover:opacity-0">Linked In</div>
            <div className="absolute translate-x-[150%] opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100">
              <img src={linkedinlogo} alt="" />
            </div>
          </button>
        </a>
        <a href="https://github.com/AdapalaBhargavaKrishna/Web-Development/tree/main/MovieShelf">
        <button className="group active:scale-95 animate-background-shine relative inline-flex h-12 items-center justify-center overflow-hidden rounded-2xl bg-[linear-gradient(110deg,transparent,45%,#1e2631,55%,transparent)] bg-[length:200%_100%] px-6 font-medium text-white transition-colors focus:outline-none">
        <div className="translate-x-0 opacity-100 transition group-hover:-translate-x-[150%] group-hover:opacity-0">Github</div>
            <div className="absolute translate-x-[150%] opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100">
              <img src={githublogo} alt="" />
            </div>
          </button>
        </a>
      </nav>

      <div className="flex flex-col justify-center items-center text-white md:mt-20 mt-28 gap-4">
        <h3 className='cursor-pointer text-center inline-flex bg-gradient-to-r from-[#b2a8fd] via-[#8678f9] to-[#c7d2fe] bg-[200%_auto] bg-clip-text text-transparent font-bold md:text-4xl text-2xl'>Welcome To</h3>
        <h1 className='cursor-pointer animate-background-shine text-center inline-flex bg-gradient-to-r from-[#b2a8fd] via-[#8678f9] to-[#c8c0ff] bg-[200%_auto] bg-clip-text text-transparent font-bold md:text-8xl text-4xl'>Movie Shelf</h1>
        <p className='cursor-pointer inline-flex bg-[linear-gradient(110deg,#939393,45%,#1e293b,55%,#939393)] bg-[length:250%_100%] bg-clip-text md:text-lg text-base text-transparent md:font-bold md:px-0 px-5 text-center'>Your personal space to explore, save & track your favorite movies.</p>
      </div>

      <div className="flex flex-col items-center justify-center gap-5 mt-20 m-20">
        <button onClick={() => handleGoogleLogin()} className="group active:scale-95 relative inline-flex h-12 items-center justify-center border overflow-hidden rounded-2xl bg-neutral-950 px-[1.55rem] font-medium text-neutral-200 duration-500">
          <div className="relative inline-flex -translate-x-0 items-center transition group-hover:-translate-x-6">
            <div className="absolute translate-x-0 opacity-100 transition group-hover:-translate-x-6 group-hover:opacity-0">
              <img src={googlelogo} width={20} height={20} alt="Google Logo" />
            </div>
            <span className="pl-6">Continue with Google</span>
            <div className="absolute right-0 translate-x-12 opacity-0 transition group-hover:translate-x-6 group-hover:opacity-100">
              <img src={arrowlogo} alt="Arrow" />
            </div>
          </div>
        </button>

        <button onClick={() => setShowInput(!showInput)}
          className="group border active:scale-95 animate-background-shine relative inline-flex h-12 items-center justify-center overflow-hidden rounded-2xl bg-[linear-gradient(135deg,transparent,45%,#1e2631,55%,transparent)] bg-[length:200%_100%] px-8 font-medium text-gray-400 transition-colors focus:outline-none">
          <div className="translate-y-0 opacity-100 transition group-hover:-translate-y-[150%] group-hover:opacity-0">No gmail? No problem!</div>
          <div className="absolute flex gap-2 items-center justify-center translate-y-[150%] opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
            <img src={userlogo} alt="" />
            <span>Sign in as Guest!</span>
          </div>
        </button>

        {showInput && (
          <div className="relative">
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleGuestLogin();
                }
              }}
              placeholder="Enter your name"
              className='border-1 block h-12 w-full rounded-md border border-double border-slate-800 border-transparent bg-[linear-gradient(#000,#000),linear-gradient(to_right,#334454,#334454)]	bg-origin-border px-3 py-2 text-slate-200 transition-all duration-500 [background-clip:padding-box,_border-box] placeholder:text-slate-500 focus:bg-[linear-gradient(#000,#000),linear-gradient(to_right,#c7d2fe,#8678f9)] focus:outline-none'
            />
            <img onClick={handleGuestLogin} className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 cursor-pointer" src={arrowlogo} alt="Continue" />
          </div>
        )}
      </div>
    </>
  );
};

export default Login;
