
// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, logout } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // The login function now returns the user object
      const user = await login(email, password);

      // Redirect based on user role
      if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else if (user.role === 'author') {
        navigate('/author', { replace: true });
      } else {
        // Fallback for unknown roles
        navigate('/', { replace: true });
      }

    } catch (err) {
      setError('Failed to log in. Please check your email and password.');
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-slate-900">EXPLAINED.</h1>
        <h2 className="text-xl font-bold text-center text-gray-700">Admin & Author Login</h2>
        <button onClick={() => logout()}>logout</button>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="text-sm font-bold text-gray-600 block">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              disabled={loading}
              className="w-full py-2 px-4 bg-slate-800 hover:bg-slate-900 text-white rounded-md font-semibold transition-colors disabled:bg-slate-400"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
