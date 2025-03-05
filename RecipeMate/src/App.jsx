import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Home from './components/Home'

function App() {

  return (
    <div className='bg-blue-50'>
    <Navbar/>
    <Home/>
    </div>
  )
}

export default App
