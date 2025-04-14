"use client"
import React, { useState, useRef, useEffect } from 'react'
import { useSession, signIn, signOut } from "next-auth/react"
import Link from 'next/link'

const Navbar = () => {
  const { data: session } = useSession()
  const [showdropdown, setShowdropdown] = useState(false)
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowdropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-gray-900 shadow-xl text-white">
  <div className="max-w-screen-xl mx-auto flex justify-between items-center px-4 py-3 md:py-0 md:h-16 w-full">
    {/* Logo */}
    <Link className="flex items-center gap-2 font-bold text-lg" href="/">
      <img className="invertImg w-10 h-10 object-contain" src="tea.gif" alt="Logo" />
      <span className="text-xl md:text-base">Get Me a Coffee!</span>
    </Link>

    {/* Account and Login */}
    <div className="relative flex items-center gap-4" ref={dropdownRef}>
      {session && (
        <>
          <button
            onClick={() => setShowdropdown(!showdropdown)}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 inline-flex items-center"
          >
            Account
            <svg className="w-2.5 h-2.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
            </svg>
          </button>

          <div className={`absolute right-0 top-full mt-2 w-44 bg-white rounded-lg shadow divide-y divide-gray-100 dark:bg-gray-700 z-50 ${showdropdown ? "block" : "hidden"}`}>
            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
              <li><Link href="/dashboard" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard</Link></li>
              <li><Link href={`/${session.user.name}`} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Your Page</Link></li>
              <li>
                <button onClick={() => signOut()} className="w-full text-left block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                  Sign out
                </button>
              </li>
            </ul>
          </div>
        </>
      )}
      {session ? (
        <button
          className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5"
          onClick={() => signOut()}
        >
          Logout
        </button>
      ) : (
        <Link href="/login">
          <button className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5">
            Login
          </button>
        </Link>
      )}
    </div>
  </div>
</nav>

  )
}

export default Navbar;