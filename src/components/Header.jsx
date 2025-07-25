
// src/components/Header.js
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiSearch, FiMenu, FiX } from 'react-icons/fi';

const NavLink = ({ children, to, className = '' }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link to={to} className={`${className} text-sm font-medium transition-colors ${isActive ? 'text-red-600' : 'text-slate-700 hover:text-slate-900'}`}>
      {children}
    </Link>
  );
};

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden mr-4 p-2">
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
            <div className="hidden md:flex items-center space-x-6">
              <NavLink to="/explainers">Explainers</NavLink>
              <NavLink to="/government">Government</NavLink>
              <NavLink to="/economy">Economy</NavLink>
              <NavLink to="/concepts">Key Concepts</NavLink>
            </div>
          </div>
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link to="/" className="text-3xl font-extrabold text-slate-900 tracking-tighter">EXPLAINED.</Link>
          </div>
          <div className="flex items-center space-x-4">
            {/* Add a prominent Start Here button */}
            <NavLink to="/start-here" className="hidden sm:block bg-yellow-400 text-slate-900 px-4 py-2 rounded-md hover:bg-yellow-500">
              Start Here
            </NavLink>
            <button className="p-2 hover:text-red-600 transition-colors">
              <FiSearch size={22} />
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200" onClick={() => setIsMenuOpen(false)}>
          <div className="flex flex-col space-y-4 p-4">
            <NavLink to="/start-here" className="text-lg font-bold text-red-600">Start Here</NavLink>
            <hr />
            <NavLink to="/explainers">Explainers</NavLink>
            <NavLink to="/government">Government</NavLink>
            <NavLink to="/economy">Economy</NavLink>
            <NavLink to="/concepts">Key Concepts</NavLink>
          </div>
        </div>
      )}
    </header>
  );
}
