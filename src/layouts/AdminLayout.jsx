import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { useAuth } from '../context/AuthContext'; // Import the auth hook

export default function AdminLayout() {
  const { currentUser, switchUser } = useAuth(); // Get user data from context

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center py-4 px-6 bg-white border-b-2 border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Welcome, {currentUser.name}!</h2>
            <p className="text-sm text-gray-500">Role: {currentUser.role}</p>
          </div>
          {/* Demo buttons to switch user roles */}
          <div>
            <span className="text-sm mr-2">Switch View:</span>
            <button onClick={() => switchUser('admin')} className={`px-3 py-1 text-sm rounded-md mr-2 ${currentUser.role === 'admin' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}>Admin</button>
            <button onClick={() => switchUser('author')} className={`px-3 py-1 text-sm rounded-md ${currentUser.role === 'author' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}>Author</button>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Outlet /> {/* This is where the nested admin/author routes will render */}
        </main>
      </div>
    </div>
  );
}
