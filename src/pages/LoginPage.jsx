
// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(''); // Password isn't used in mock, but is essential for real apps
  const [error, setError] = useState('');

  // Redirect to the page the user was trying to access, or to the admin dashboard
  const from = location.state?.from?.pathname || "/admin";

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const success = login(username, password);

    if (success) {
      navigate(from, { replace: true });
    } else {
      setError('Invalid username. Try "admin" or "author".');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-slate-900">EXPLAINED.</h1>
        <h2 className="text-xl font-bold text-center text-gray-700">Admin & Author Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="text-sm font-bold text-gray-600 block">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-bold text-gray-600 block">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
          {error && <p className="text-sm text-center text-red-500">{error}</p>}
          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-slate-800 hover:bg-slate-900 text-white rounded-md font-semibold transition-colors"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
