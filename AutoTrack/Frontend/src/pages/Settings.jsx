import React, { useContext, useEffect, useState } from 'react'
import { useUser, UserContext } from '../data/UserContext'
import API from '../api'
import Navbar from '../components/Navbar'
import usersvg from '../assets/svg/user.svg'
import malesvg from '../assets/svg/man.svg'
import passwordsvg from '../assets/svg/password.svg'
import deletesvg from '../assets/svg/delete.svg'
import booksvg from '../assets/svg/closedbook.svg'
import dangersvg from '../assets/svg/danger.svg'
import femalesvg from '../assets/svg/woman.svg'
import shieldsvg from '../assets/svg/shield.svg'
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { user } = useUser();
  const navigate = useNavigate()
  const { setUser } = useContext(UserContext);
  const [changePassword, setChangePassword] = useState(false)
  const [clearData, setclearData] = useState(false)
  const [deleteAccount, setDeleteAccount] = useState(false)
  const [lastUpdatedPass, setLastUpdatedPass] = useState('')
  const [memberSince, setMemberSince] = useState('')
  const [oldPass, setOldPass] = useState('')
  const [deleteEmail, setDeleteEmail] = useState('')
  const [newPass, setNewPass] = useState('')
  const [gender, setGender] = useState("Male")
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    if (!user || !user.name) {
      navigate("/");
    }
  }, [user]);

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  }

  const handleChangePass = async () => {

    if (!oldPass || !newPass) {
      alert("Please fill both the password fields.");
      return;
    }

    try {
      const res = await API.put(`user/${user._id}/change-pass`, {
        oldPassword: oldPass,
        newPassword: newPass,
      })

      if (res.data.success) {
        alert("Password changed successfully!");
        setLastUpdatedPass(new Date(res.data.updateDate).toLocaleDateString())
        setMemberSince(new Date(res.data.createDate).toLocaleDateString())
        setChangePassword(false);
        setOldPass('');
        setNewPass('');
      } else {
        alert(res.data.message || "Failed to change password.");
      }

    } catch (error) {
      console.error("Failed to change password", error)

    }
  }

  const handleClear = async () => {
    try {
      const res = await API.delete(`user/${user._id}/clear`)
      const updatedUser = { ...user, history: [] };
      setUser(updatedUser)
      setclearData(false)
    } catch (error) {
      console.error("Failed to clear data:", error);
    }
  }

  const handleDeleteAccount = async () => {
    try {
      const res = await API.delete((`user/${user._id}/delete`))

      if (res.data.success) {
        alert("Account deleted successfully.");
        setUser(null)
        localStorage.clear();
        setDeleteAccount(false)
        navigate('/');
      }
    }catch (error) {
      console.error("Failed to delete account:", error);
    }
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
                <p>Member since <span>{memberSince}</span></p>
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
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
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
              <p className='text-sm text-neutral-500'>Last changed {lastUpdatedPass}</p>
            </div>
            <button onClick={() => setChangePassword(true)} className='px-4 py-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors'>
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
            <button onClick={() => setclearData(true)} className='px-4 py-2 text-red-500 border border-red-500 rounded-lg transition-colors'>
              Clear Data
            </button>
          </div>

          <div className='flex w-full rounded-xl items-center justify-between p-2 mt-5'>
            <div>
              <h1 className='font-semibold text-base text-amber-900'>Delete Account</h1>
              <p className='text-sm text-red-500'>Permanently delete your account and all associated data</p>
            </div>
            <button onClick={() => setDeleteAccount(true)} className='px-4 py-2 text-white bg-red-500 rounded-lg transition-colors'>
              Delete Account
            </button>
          </div>
        </div>

        <div className='p-10'></div>

      </div>
      {changePassword &&
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md">
            <div className='flex gap-2 items-center justify-center mb-4'>
              <img src={passwordsvg} alt="" className='rounded-xl bg-amber-100 p-2' />
              <h1 className='font-semibold text-xl'>Change Password</h1>
            </div>

            <div className="mb-4">
              <label className="block font-medium mb-1" htmlFor="oldPassword">Old Password</label>
              <input
                type="password"
                id="oldPassword"
                placeholder="Enter your old password"
                onChange={(e) => setOldPass(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 outline-none"
              />
            </div>

            <div className="mb-6">
              <label className="block font-medium mb-1" htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                placeholder="Enter your new password"
                onChange={(e) => setNewPass(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 outline-none"
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setChangePassword(false)}
                className="px-4 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePass}
                className="px-4 py-2 rounded-lg border hover:border-blue-400 bg-blue-200 text-blue-900"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      }

      {clearData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl p-6 w-[90%] max-w-md border border-red-100">
            <div className='flex flex-col items-center text-center mb-6'>
              <div className='rounded-xl bg-red-100 p-3 mb-3'>
                <img
                  src={deletesvg}
                  alt="Warning"
                  className='w-8 h-8 text-red-500'
                />
              </div>
              <h1 className='font-bold text-2xl text-gray-800 mb-1'>Clear Data</h1>
              <p className='text-gray-600'>Are you sure you want to clear all data? This action cannot be undone.</p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setclearData(false)}
                className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleClear}
                className="px-5 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors duration-200 font-medium shadow-sm"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-md border border-red-200">
            <div className='flex flex-col items-center text-center mb-5'>
              <div className='rounded-full bg-red-100 p-3 mb-4'>
                <img
                  src={dangersvg}
                  alt="Warning"
                  className='w-8 h-8 text-red-600'
                />
              </div>
              <h1 className='font-bold text-2xl text-gray-800 mb-2'>Delete Account</h1>
              <p className='text-gray-600 mb-4'>This will permanently delete your account and all associated data.</p>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">
                To confirm, type <span className="font-mono font-bold text-red-600">{user.email}</span> below:
              </p>
              <input
                type="email"
                placeholder="Enter your email"
                onChange={(e) => setDeleteEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none transition-all"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteAccount(false)}
                className="px-5 py-2.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-5 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors duration-200 font-medium shadow-sm disabled:opacity-50"
                disabled={deleteEmail !== user.email}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Settings