
// src/components/AdminSidebar.js
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiGrid, FiFileText, FiGitMerge, FiList, FiMove, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const AdminNavLink = ({ to, icon, children }) => {
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

export default function AdminSidebar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <div className="hidden md:flex flex-col w-64 bg-gray-800">
      <div className="flex items-center justify-center h-16 bg-gray-900">
        <span className="text-white font-bold uppercase text-lg">
          {currentUser.role === 'admin' ? 'Admin Panel' : 'Author Dashboard'}
        </span>
      </div>
      <div className="flex flex-col flex-1 justify-between overflow-y-auto">
        <nav className="flex-1 px-2 py-4 bg-gray-800">
          <AdminNavLink to="/admin" icon={<FiGrid className="h-6 w-6" />}>Dashboard</AdminNavLink>
          <AdminNavLink to="/admin/articles" icon={<FiFileText className="h-6 w-6" />}>
            {currentUser.role === 'admin' ? 'Articles' : 'My Articles'}
          </AdminNavLink>

          {currentUser.role === 'admin' && (
            <>
              <AdminNavLink to="/admin/series" icon={<FiList className="h-6 w-6" />}>Series</AdminNavLink>
              <AdminNavLink to="/admin/timelines" icon={<FiGitMerge className="h-6 w-6" />}>Timelines</AdminNavLink>
              <AdminNavLink to="/admin/ordering" icon={<FiMove className="h-6 w-6" />}>Content Order</AdminNavLink>
            </>
          )}
        </nav>
        <div className="px-2 py-4">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 mt-2 text-gray-500 hover:bg-gray-700 hover:text-gray-200 rounded-md"
          >
            <FiLogOut className="h-6 w-6" />
            <span className="mx-4 font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
