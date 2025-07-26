
// src/pages/AdminSeriesForm.js
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { databases } from '../appwrite';
import { useAuth } from '../context/AuthContext';
import { ID, Permission, Role } from 'appwrite';

// --- Appwrite Configuration ---
const DATABASE_ID = '6885112e000227dd70e8';
const SERIES_COLLECTION_ID = '68854f880036d8a30a8d';
const ARTICLES_COLLECTION_ID = '68853dd5002eaf879e95';

export default function AdminSeriesForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const isEditing = id !== 'new';

  const [seriesData, setSeriesData] = useState({
    title: '',
    articles: [], // Will store an array of article IDs
  });
  const [allArticleOptions, setAllArticleOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all articles to populate the dropdown
        const articlesResponse = await databases.listDocuments(DATABASE_ID, ARTICLES_COLLECTION_ID);
        setAllArticleOptions(articlesResponse.documents.map(doc => ({ id: doc.$id, title: doc.title })));

        // If editing, fetch the specific series data
        if (isEditing) {
          const seriesDoc = await databases.getDocument(DATABASE_ID, SERIES_COLLECTION_ID, id);
          setSeriesData({
            title: seriesDoc.title,
            articles: seriesDoc.articles || [],
          });
        }
      } catch (err) {
        setError('Failed to load data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isEditing]);

  const handleChange = (e) => {
    setSeriesData({ ...seriesData, [e.target.name]: e.target.value });
  };

  const handleMultiSelectChange = (e) => {
    const options = [...e.target.selectedOptions];
    const values = options.map(option => option.value);
    setSeriesData(prev => ({ ...prev, articles: values }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isEditing) {
        await databases.updateDocument(DATABASE_ID, SERIES_COLLECTION_ID, id, seriesData);
        alert('Series updated successfully!');
      } else {
        await databases.createDocument(
          DATABASE_ID,
          SERIES_COLLECTION_ID,
          ID.unique(),
          seriesData,
          [
            Permission.read(Role.any()),
            Permission.update(Role.users()), // Any authenticated user can update
            Permission.delete(Role.users()), // Any authenticated user can delete
          ]
        );
        alert('Series created successfully!');
      }
      navigate('/admin/series');
    } catch (err) {
      setError('Failed to save series.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !seriesData.title) return <p>Loading form...</p>;

  return (
    <div>
      <h3 className="text-3xl font-medium text-gray-700 mb-6">
        {isEditing ? `Editing: ${seriesData.title}` : 'Create New Series'}
      </h3>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
              Series Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={seriesData.title}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="articles">
              Articles in this Series (select in order)
            </label>
            <select
              id="articles"
              multiple
              value={seriesData.articles}
              onChange={handleMultiSelectChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 h-64"
            >
              {allArticleOptions.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.title}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Hold Ctrl (or Cmd on Mac) to select multiple articles.</p>
          </div>
          {error && <p className="text-sm text-center text-red-500 mt-4">{error}</p>}
          <div className="flex items-center justify-end mt-6 pt-6 border-t">
            <Link to="/admin/series" className="text-gray-600 hover:text-gray-800 mr-4">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:bg-red-300"
            >
              {loading ? 'Saving...' : 'Save Series'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
