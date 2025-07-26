
// src/layouts/AuthorLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import AuthorSidebar from '../components/AuthorSidebar';

export default function AuthorLayout() {
  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <AuthorSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
