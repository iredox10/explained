import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center py-4 px-6 bg-white border-b-2 border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Welcome, Admin!</h2>
          <a href="/" className="text-sm font-semibold text-red-600 hover:underline">View Live Site</a>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Outlet /> {/* This is where the nested admin routes will render */}
        </main>
      </div>
    </div>
  );
}
