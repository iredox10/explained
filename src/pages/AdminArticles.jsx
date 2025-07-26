
// src/pages/AdminArticles.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { databases } from '../appwrite';
import { FiEdit, FiTrash2, FiPlusCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { Query } from 'appwrite';

// --- Appwrite Configuration ---
const DATABASE_ID = '6885112e000227dd70e8';
const ARTICLES_COLLECTION_ID = '68853dd5002eaf879e95';

export default function AdminArticles() {
  const { currentUser } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        let queries = [];
        // If the user is an author, only fetch their articles
        if (currentUser.role === 'author') {
          queries.push(Query.equal('author', currentUser.name));
        }

        const response = await databases.listDocuments(
          DATABASE_ID,
          ARTICLES_COLLECTION_ID,
          queries
        );
        setArticles(response.documents);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [currentUser]);

  const handleDelete = async (articleId) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      try {
        await databases.deleteDocument(DATABASE_ID, ARTICLES_COLLECTION_ID, articleId);
        setArticles(articles.filter(article => article.$id !== articleId));
        alert("Article deleted successfully!");
      } catch (error) {
        console.error("Failed to delete article:", error);
        alert("Failed to delete article.");
      }
    }
  };

  if (loading) return <p>Loading articles...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-3xl font-medium text-gray-700">
          {currentUser.role === 'admin' ? 'Manage All Articles' : 'Your Articles'}
        </h3>
        <Link
          to="/admin/articles/new"
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          <FiPlusCircle className="mr-2" />
          Create New Article
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3 font-semibold">Title</th>
                {currentUser.role === 'admin' && <th className="p-3 font-semibold">Author</th>}
                <th className="p-3 font-semibold">Category</th>
                <th className="p-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map(article => (
                <tr key={article.$id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-3 font-medium text-gray-800">{article.title}</td>
                  {currentUser.role === 'admin' && <td className="p-3 text-gray-600">{article.author}</td>}
                  <td className="p-3">
                    <span className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">
                      {article.category || 'N/A'}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <Link to={`/admin/articles/${article.$id}`} className="text-blue-500 hover:text-blue-700 mr-4 inline-block">
                      <FiEdit size={18} />
                    </Link>
                    <button onClick={() => handleDelete(article.$id)} className="text-red-500 hover:text-red-700">
                      <FiTrash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
