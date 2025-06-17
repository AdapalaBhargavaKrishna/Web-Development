import React, { useContext, useState } from 'react'
import { useUser, UserContext } from '../data/UserContext'
import Navbar from '../components/Navbar'
import usersvg from '../assets/svg/user.svg'
import malesvg from '../assets/svg/man.svg'
import booksvg from '../assets/svg/closedbook.svg'
import femalesvg from '../assets/svg/woman.svg'
import shieldsvg from '../assets/svg/shield.svg'
import savesvg from '../assets/svg/save.svg'

const Settings = () => {
  const { user } = useUser();
  const { setUser } = useContext(UserContext);

  const [gender, setGender] = useState("Male")
  const [enabled, setEnabled] = useState(true);

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  }

  return (
    <>
      <Navbar item={"Settings"} />
      <div className='bg-[#f4f9ff] min-h-screen flex flex-col items-center w-full'>
        <h1 className='bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent text-center text-2xl sm:text-3xl md:text-[3.1rem] pb-4 pt-10 leading-snug font-bold'>Settings</h1>
        <p className='text-center text-base text-neutral-800'>Customize your AutoTrack experience and manage your account</p>

        <div className='bg-white max-w-4xl w-full p-7 rounded-xl shadow-md mt-10'>
          <div className='flex gap-2 items-center'>
            <img src={usersvg} alt="" className='rounded-xl bg-blue-100 p-2' />
            <h1 className='font-semibold text-xl'>Profile Information</h1>
          </div>

          <div className='my-7 text-center flex flex-col items-center'>
            <div className='flex gap-4 items-center'>
              <img src={gender === "Male" ? malesvg : femalesvg} alt="" className='w-10 h-10' />
              <div>

                <h1 className='font-bold text-xl'>{user.name}</h1>
                <p>Member since <span>6/17/2025</span></p>
              </div>
            </div>
          </div>

          <div className='flex justify-between items-center mt-4'>
            <div className="mb-4">
              <label className="block text-base font-semibold mb-1" htmlFor="name">Full Name*</label>
              <div className="flex items-center border rounded-xl px-3 py-2 w-96">
                <input
                  type="name"
                  id="name"
                  required
                  placeholder="Enter your full name"
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  defaultValue={user.name}
                  className="w-full bg-transparent outline-none text-base"
                />
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-base font-semibold mb-1" htmlFor="email">Email*</label>
              <div className="flex items-center border rounded-xl px-3 py-2 w-96">
                <input
                  type="email"
                  required
                  id="email"
                  placeholder="Enter your email"
                  onChange={(e) => setUser({...user, email: e.target.value})}
                  defaultValue={user.email}
                  className="w-full bg-transparent outline-none text-base"
                />
              </div>
            </div>
          </div>

          <div className='flex justify-between items-center mt-4'>
            <div className="mb-4">
              <label className="block text-base font-semibold mb-1" htmlFor="location">Location</label>
              <div className="flex items-center border rounded-xl px-3 py-2 w-96">
                <input
                  type="text"
                  id="location"
                  placeholder="City, Country"
                  className="w-full bg-transparent outline-none text-base"
                />
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-base font-semibold mb-1" htmlFor="gender">Gender</label>

              <select className='flex items-center border rounded-xl px-3 py-2 w-96' value={gender} onChange={handleGenderChange}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>

            </div>
          </div>

        </div>

        <div className='bg-white max-w-4xl w-full p-7 rounded-xl shadow-md mt-10'>
          <div className='flex gap-2 items-center'>
            <img src={booksvg} alt="" className='rounded-xl bg-purple-100 p-2' />
            <h1 className='font-semibold text-xl'>Learning Preferences</h1>
          </div>

          <div className='flex justify-between items-center mt-4'>

            <div className="mb-5">
              <label className="block text-base font-semibold mb-1" htmlFor="summarylength">Summary Length</label>

              <select className='flex items-center border rounded-xl px-3 py-2 w-96'>
                <option value="Short">Short (1-2 paragraphs)</option>
                <option value="Medium">Medium (3-4 paragraphs)</option>
                <option value="Detailed">Detailed (5+ paragraphs)</option>
              </select>

            </div>

            <div className="mb-5">
              <label className="block text-base font-semibold mb-1" htmlFor="theme">Theme</label>

              <select className='flex items-center border rounded-xl px-3 py-2 w-96'>
                <option value="Lignt">Light</option>
                <option value="Dark">Dark</option>
              </select>
            </div>
          </div>

          <div className='flex w-full rounded-xl items-center justify-between p-4 bg-neutral-50'>
            <div>
              <h1 className='font-semibold text-base'>Auto-generate Flashcards</h1>
              <p className='text-sm text-neutral-500'>Automatically create flashcards from video content</p>
            </div>
            <button
              type="button"
              onClick={() => setEnabled(!enabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${enabled ? 'bg-blue-600' : 'bg-gray-300'
                }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
              />
            </button>
          </div>

        </div>

        <div className='bg-white max-w-4xl w-full p-7 rounded-xl shadow-md mt-10'>
          <div className='flex gap-2 items-center'>
            <img src={shieldsvg} alt="" className='rounded-xl bg-orange-100 p-2' />
            <h1 className='font-semibold text-xl'>Account Privacy</h1>
          </div>

          <div className='flex w-full rounded-xl items-center justify-between p-4 bg-neutral-50 mt-5'>
            <div>
              <h1 className='font-semibold text-base'>Password</h1>
              <p className='text-sm text-neutral-500'>Last changed 6/12/2025</p>
            </div>
            <button className='px-4 py-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors'>
              Change Password
            </button>
          </div>

        </div>

        <div className='bg-red-50 max-w-4xl w-full p-7 rounded-xl shadow-lg mt-10'>
          <h1 className='font-semibold text-lg text-amber-900'>Danger Zone</h1>

          <div className='flex w-full rounded-xl items-center justify-between p-2 mt-5'>
            <div>
              <h1 className='font-semibold text-base text-amber-900'>Clear All Learning Data</h1>
              <p className='text-sm text-red-500'>This will permanently delete all your videos and progress</p>
            </div>
            <button className='px-4 py-2 text-red-500 border border-red-500 rounded-lg transition-colors'>
              Clear Data
            </button>
          </div>

          <div className='flex w-full rounded-xl items-center justify-between p-2 mt-5'>
            <div>
              <h1 className='font-semibold text-base text-amber-900'>Delete Account</h1>
              <p className='text-sm text-red-500'>Permanently delete your account and all associated data</p>
            </div>
            <button className='px-4 py-2 text-white bg-red-500 rounded-lg transition-colors'>
              Delete Account
            </button>
          </div>
        </div>
        <div className='p-10'>
          <button className='flex bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md hover:scale-105 transition duration-200 py-[0.70rem] px-8 rounded-xl items-center gap-2'>
            <img src={savesvg} className='w-7 h-7' alt="" />
            <span className='font-semibold text-lg'>Save All Changes</span>
          </button>
        </div>

      </div>
    </>
  )
}

export default Settings