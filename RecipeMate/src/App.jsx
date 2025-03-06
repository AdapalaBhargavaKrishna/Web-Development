import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Search from './components/Search'

function App() {

  return (
    <div>
    <Navbar/>
    <Home/>
    <Search/>
    </div>
  )
}

export default App
