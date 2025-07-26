
// src/pages/AuthorDashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { databases } from '../appwrite';
import { useAuth } from '../context/AuthContext';
import { Query } from 'appwrite';
import { FiPlusCircle, FiFileText } from 'react-icons/fi';
import { DATABASE_ID, ARTICLES_COLLECTION_ID } from '../appwriteConst';

// Reusable components from AdminDashboard
const StatCard = ({ title, value }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h4 className="text-lg font-semibold text-gray-600">{title}</h4>
    <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
  </div>
);

const ActionButton = ({ to, icon, children }) => (
  <Link to={to} className="flex items-center p-4 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors">
    {icon}
    <span className="ml-3 font-semibold text-gray-700">{children}</span>
  </Link>
);

export default function AuthorDashboard() {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({ articles: 0 });
  const [recentArticles, setRecentArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthorData = async () => {
      if (!currentUser) return;
      setLoading(true);
      try {
        const response = await databases.listDocuments(
          DATABASE_ID,
          ARTICLES_COLLECTION_ID,
          [
            Query.equal('author', currentUser.name),
            Query.orderDesc('$createdAt'), // Order by creation date
            Query.limit(5) // Get the 5 most recent
          ]
        );
        setRecentArticles(response.documents);
        setStats({ articles: response.total });
      } catch (error) {
        console.error("Failed to fetch author data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAuthorData();
  }, [currentUser]);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div>
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-3xl font-bold text-gray-800">Welcome back, {currentUser.name.split(' ')[0]}!</h3>
        <p className="text-gray-600 mt-1">This is your personal dashboard. Let's get writing.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Quick Actions & Recent Articles */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h4 className="text-xl font-bold text-gray-700 mb-4">Quick Actions</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ActionButton to="/author/articles/new" icon={<FiPlusCircle className="text-green-500" size={24} />}>
                Create New Article
              </ActionButton>
              <ActionButton to="/author/articles" icon={<FiFileText className="text-blue-500" size={24} />}>
                Manage My Articles
              </ActionButton>
            </div>
          </div>

          <div>
            <h4 className="text-xl font-bold text-gray-700 mb-4">Your Recent Articles</h4>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <ul className="divide-y divide-gray-200">
                {recentArticles.length > 0 ? recentArticles.map(article => (
                  <li key={article.$id} className="py-3 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-800">{article.title}</p>
                      <p className="text-sm text-gray-500">{article.category}</p>
                    </div>
                    <Link to={`/author/articles/${article.$id}`} className="text-sm font-semibold text-red-600 hover:underline">
                      Edit
                    </Link>
                  </li>
                )) : <p className="text-center text-gray-500 py-4">You haven't written any articles yet.</p>}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Stats */}
        <div className="lg:col-span-1 space-y-6">
          <h4 className="text-xl font-bold text-gray-700">Statistics</h4>
          <StatCard title="Your Articles" value={stats.articles} />
          <StatCard title="Total Views" value="Coming Soon" />
        </div>
      </div>
    </div>
  );
}
