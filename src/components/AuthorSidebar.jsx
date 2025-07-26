
// src/components/AuthorSidebar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiGrid, FiFileText } from 'react-icons/fi';

const AuthorNavLink = ({ to, icon, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`flex items-center px-4 py-2 mt-2 transition-colors duration-300 transform rounded-md ${isActive ? 'bg-gray-700 text-gray-200' : 'text-gray-500 hover:bg-gray-700 hover:text-gray-200'}`}
    >
      {icon}
      <span className="mx-4 font-medium">{children}</span>
    </Link>
  );
};

export default function AuthorSidebar() {
  return (
    <div className="hidden md:flex flex-col w-64 bg-gray-800">
      <div className="flex items-center justify-center h-16 bg-gray-900">
        <span className="text-white font-bold uppercase text-lg">Author Dashboard</span>
      </div>
      <div className="flex flex-col flex-1 overflow-y-auto">
        <nav className="flex-1 px-2 py-4 bg-gray-800">
          <AuthorNavLink to="/author" icon={<FiGrid className="h-6 w-6" />}>Dashboard</AuthorNavLink>
          <AuthorNavLink to="/author/articles" icon={<FiFileText className="h-6 w-6" />}>My Articles</AuthorNavLink>
        </nav>
      </div>
    </div>
  );
}
