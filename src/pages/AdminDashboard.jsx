
// src/pages/AdminDashboard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { MOCK_DATA } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { FiPlusCircle, FiFileText, FiList, FiMove } from 'react-icons/fi';

// A reusable stat card component
const StatCard = ({ title, value }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h4 className="text-lg font-semibold text-gray-600">{title}</h4>
    <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
  </div>
);

// A reusable quick action button
const ActionButton = ({ to, icon, children }) => (
  <Link to={to} className="flex items-center p-4 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors">
    {icon}
    <span className="ml-3 font-semibold text-gray-700">{children}</span>
  </Link>
);

export default function AdminDashboard() {
  const { currentUser } = useAuth();

  // --- Data based on role ---
  const is_admin = currentUser.role === 'admin';

  const stats = {
    articles: is_admin
      ? Object.keys(MOCK_DATA.allArticles).length
      : Object.values(MOCK_DATA.allArticles).filter(a => a.author === currentUser.name).length,
    series: is_admin ? Object.keys(MOCK_DATA.series).length : null,
  };

  const recentArticles = Object.entries(MOCK_DATA.allArticles)
    .map(([id, article]) => ({ id, ...article }))
    .filter(article => is_admin || article.author === currentUser.name)
    .slice(0, 5); // Get the 5 most recent (in a real app, you'd sort by date)

  return (
    <div>
      {/* Header */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-3xl font-bold text-gray-800">Welcome back, {currentUser.name.split(' ')[0]}!</h3>
        <p className="text-gray-600 mt-1">Here's a snapshot of your content.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Quick Actions & Recent Articles */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Actions */}
          <div>
            <h4 className="text-xl font-bold text-gray-700 mb-4">Quick Actions</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ActionButton to="/admin/articles/new" icon={<FiPlusCircle className="text-green-500" size={24} />}>
                Create New Article
              </ActionButton>
              <ActionButton to="/admin/articles" icon={<FiFileText className="text-blue-500" size={24} />}>
                {is_admin ? 'Manage Articles' : 'Manage My Articles'}
              </ActionButton>
              {is_admin && (
                <>
                  <ActionButton to="/admin/series" icon={<FiList className="text-purple-500" size={24} />}>
                    Manage Series
                  </ActionButton>
                  <ActionButton to="/admin/ordering" icon={<FiMove className="text-yellow-500" size={24} />}>
                    Content Order
                  </ActionButton>
                </>
              )}
            </div>
          </div>

          {/* Recent Articles */}
          <div>
            <h4 className="text-xl font-bold text-gray-700 mb-4">Recent Articles</h4>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <ul className="divide-y divide-gray-200">
                {recentArticles.map(article => (
                  <li key={article.id} className="py-3 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-800">{article.title}</p>
                      <p className="text-sm text-gray-500">
                        {is_admin ? `by ${article.author}` : article.category}
                      </p>
                    </div>
                    <Link to={`/admin/articles/${article.id}`} className="text-sm font-semibold text-red-600 hover:underline">
                      Edit
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Stats */}
        <div className="lg:col-span-1 space-y-6">
          <h4 className="text-xl font-bold text-gray-700">Statistics</h4>
          <StatCard title={is_admin ? "Total Articles" : "Your Articles"} value={stats.articles} />
          {is_admin && <StatCard title="Total Series" value={stats.series} />}
        </div>
      </div>
    </div>
  );
}
