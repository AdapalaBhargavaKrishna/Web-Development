import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  // Check if the current route is under /finance or /stocks
  const isFinanceRoute = location.pathname.startsWith('/finance');
  const isStocksRoute = location.pathname.startsWith('/stocks');

  // Links for Finance Route
  const financeLinks = [
    { name: 'Dashboard', path: '/finance/dashboard' },
    { name: 'Budgets', path: '/finance/budgets' },
    { name: 'Expenses', path: '/finance/expenses' },
    { name: 'News', path: '/finance/news' },
    { name: 'Home', path: '/' }
  ];

  // Links for Stocks Route
  const stocksLinks = [
    { name: 'Stock Overview', path: '/stocks/overview' },
    { name: 'News', path: '/stocks/news' },
    { name: 'Portfolio', path: '/stocks/portfolio' },
    { name: 'Home', path: '/' }
  ];

  // Links for the Default (Other) Routes
  const defaultLinks = [
    { name: 'Home', path: '/' },
    { name: 'Stocks', path: '/stocks' },
    { name: 'Finance', path: '/finance' },
    { name: 'About', path: '/about' }
  ];

  // Determine which set of links to display
  const links = isFinanceRoute ? financeLinks : isStocksRoute ? stocksLinks : defaultLinks;

  return (
    <nav className="flex justify-between items-center bg-transparent text-white p-4 w-full">
      <div className="flex items-center gap-2">
        <img src="/logo.svg" alt="Logo" className="w-10" />
        <h1 className="font-bold text-xl">Stock & Spend</h1>
      </div>

      <div className="block lg:hidden">
        <button onClick={toggleMenu} className="text-3xl">
          {isOpen ? 'X' : '☰'}
        </button>
      </div>

      <ul className={`flex gap-3 font-bold lg:flex-row lg:flex items-center transition-all duration-300 ${isOpen ? 'flex' : 'hidden'} lg:block`}>
        {links.map((link) => (
          <li key={link.name} className="cursor-pointer hover:text-[#38BDF8] hover:scale-105 transition-transform duration-200 p-2 rounded-2xl">
            <Link to={link.path}>{link.name}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
