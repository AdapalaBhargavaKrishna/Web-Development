import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebase';
import userlogo from '../assets/user.svg';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const [userName, setUserName] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  const dropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
  
    if (storedUser) {
      setUserName(storedUser.displayName);
      setUserEmail(storedUser.isGuest ? null : storedUser.email);
    } else {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          setUserName(user.displayName || user.email.split('@')[0]);
          setUserEmail(user.email);
        } else {
          setUserName(null);
          setUserEmail(null);
        }
      });
      return () => unsubscribe();
    }
  }, []);
  

  const links = [
    { name: 'Home', path: '/home' },
    { name: 'Watch List', path: '/watchlist' },
    { name: 'About', path: '/about' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target)) {
        setIsMobileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate('/');
      toast.warning("Signned Out");
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="flex justify-between items-center bg-transparent text-white p-4 w-full">
      <Link to="/home" className="font-bold text-xl hover:text-gray-300 transition-colors">
        Movie Shelf
      </Link>

      <div className="hidden md:flex items-center gap-6">
        <div className='flex items-center gap-2 cursor-pointer'>
          <h2 className='text-center inline-flex bg-gradient-to-r from-[#b2a8fd] via-[#8678f9] to-[#c7d2fe] bg-[200%_auto] bg-clip-text text-base font-bold text-transparent'>Welcome</h2>
          <span className='bg-[linear-gradient(110deg,#939393,45%,#1e293b,55%,#939393)] bg-[length:250%_100%] bg-clip-text text-base text-transparent'>{userName}</span>
        </div>

        {userEmail ? (
          <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-2 hover:text-gray-300 transition-colors"> <img src={userlogo} alt="User profile" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#00000a] rounded-xl shadow-lg py-1 z-50">
                <ul>
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.path}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-[#0a0a23]"
                        onClick={() => setIsMobileDropdownOpen(false)}
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-[#0a0a23]"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/"
            className='relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-50'>
            <span className='absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]' />
            <span className='inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-gray-950 px-8 py-1 text-sm font-medium text-gray-50 backdrop-blur-3xl'>
              Sign In
            </span>
          </Link>

        )}
      </div>

      <div className="md:hidden relative" ref={mobileDropdownRef}>
        <button onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)} className="text-white p-2 rounded-md focus:outline-none">
          <img src={userlogo} alt="Menu" className="w-6 h-6" />
        </button>

        {isMobileDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#00000a] rounded-xl shadow-lg py-1 z-50">
            {userEmail && (
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{userName}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{userEmail}</p>
              </div>
            )}

            <ul>
              {links.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-[#0a0a23]"
                    onClick={() => setIsMobileDropdownOpen(false)}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {userEmail ? (
              <button
                onClick={() => {
                  handleSignOut();
                  setIsMobileDropdownOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-[#0a0a23]"
              >
                Sign Out
              </button>
            ) : (
              <Link
                to="/"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                onClick={() => setIsMobileDropdownOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;