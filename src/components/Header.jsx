
// src/components/Header.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiSearch, FiMenu, FiX } from 'react-icons/fi';

const NavLink = ({ children, to, className = '' }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link to={to} className={`${className} text-sm font-semibold transition-colors ${isActive ? 'text-red-600' : 'text-slate-700 hover:text-red-600'}`}>
      {children}
    </Link>
  );
};

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Close mobile menu on route change
  const location = useLocation();
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // In a real app, you would navigate to a search results page
      // navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      alert(`Searching for: ${searchQuery}`);
      setSearchQuery('');
    }
  };

  return (
    <header
      className="bg-white/90 md:backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Left Side: Logo & Main Navigation */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-extrabold text-slate-900 tracking-tighter">EXPLAINED.</Link>
            <div className="hidden lg:flex items-center space-x-6">
              {/* "Explainers" is now a direct link */}
              <NavLink to="/explainers">Explainers</NavLink>
              <NavLink to="/government">Government</NavLink>
              <NavLink to="/economy">Economy</NavLink>
            </div>
          </div>

          {/* Center: Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search explainers..."
                  className="w-full bg-slate-100 border border-transparent rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </form>
          </div>

          {/* Right Side: CTA and Mobile Menu Button */}
          <div className="flex items-center space-x-2">
            <NavLink to="/start-here" className="hidden sm:block bg-yellow-400 text-slate-900 px-4 py-2 rounded-full hover:bg-yellow-500 transition-colors">
              Start Here
            </NavLink>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2">
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* --- Full-Screen Mobile Menu --- */}
      <div className={`fixed inset-0 bg-white z-50 transform transition-transform duration-300 lg:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center h-16 px-4 border-b">
          <Link to="/" className="text-2xl font-extrabold text-slate-900 tracking-tighter">EXPLAINED.</Link>
          <button onClick={() => setIsMenuOpen(false)} className="p-2">
            <FiX size={24} />
          </button>
        </div>
        <div className="p-4 border-b">
          <form onSubmit={handleSearchSubmit} className="w-full">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search explainers..."
                className="w-full bg-slate-100 border border-slate-200 rounded-full pl-10 pr-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </form>
        </div>
        <nav className="flex flex-col p-8 space-y-6 text-xl">
          <NavLink to="/explainers">Explainers</NavLink>
          <NavLink to="/government">Government</NavLink>
          <NavLink to="/economy">Economy</NavLink>
          <NavLink to="/concepts">Key Concepts</NavLink>
          <hr />
          <NavLink to="/start-here" className="text-red-600">Start Here</NavLink>
        </nav>
      </div>
    </header>
  );
}
