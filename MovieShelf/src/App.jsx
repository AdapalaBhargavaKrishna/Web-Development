import React, { useState, useEffect } from "react";
import { Toaster } from 'sonner';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from "./pages/About";
import Layout from './components/Layout';
import Watchlist from "./pages/Watchlist";
import Login from "./pages/Login";

function App() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
    
  }, []);

  return (
    <Router>
      <Toaster
        className="custom-toast"
        position={windowWidth < 768 ? 'top-center' : 'bottom-right'}  
      />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="*" element={
          <Layout>
            <Navbar />
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/watchlist" element={<Watchlist />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </Layout>
        }/>
      </Routes>
    </Router>
  );
}

export default App;