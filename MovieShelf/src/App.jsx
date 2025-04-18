import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from "./pages/About";
import Layout from './components/Layout';
import Watchlist from "./pages/Watchlist";
import Login from "./pages/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />  {/* No Layout here */}
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