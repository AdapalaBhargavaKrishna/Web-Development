import './App.css'
import Navbar from './components/Navbar'
import Layout from './components/Layout'
import Home from './components/Home'
import Stocks from './components/Stocks'
import Finance from './components/Finance'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <Layout>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stocks" element={<Stocks />} />
          <Route path="/finance" element={<Finance />} />
          {/* Add more routes as you create more components! */}
        </Routes>
      </Layout>
    </Router>
  )
}

export default App;
