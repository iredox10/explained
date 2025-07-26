
// src/pages/AdminOrderManager.js
import React, { useState, useEffect } from 'react';
import { databases } from '../appwrite';
import { FiArrowUp, FiArrowDown, FiSave } from 'react-icons/fi';
import { DATABASE_ID, SERIES_COLLECTION_ID, LAYOUTS_COLLECTION_ID, ARTICLES_COLLECTION_ID } from '../appwriteConst.js'

// --- Appwrite Configuration ---
const EXPLAINERS_LAYOUT_DOC_ID = '6885517100250192eadd'; // The ID of the document you created

const ReorderableItem = ({ item, onMoveUp, onMoveDown, isFirst, isLast }) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
    <span className="text-gray-800">{item.title}</span>
    <div className="flex items-center">
      <button onClick={onMoveUp} disabled={isFirst} className="p-1 disabled:opacity-30 text-gray-600 hover:text-blue-600"><FiArrowUp /></button>
      <button onClick={onMoveDown} disabled={isLast} className="p-1 disabled:opacity-30 text-gray-600 hover:text-blue-600"><FiArrowDown /></button>
    </div>
  </div>
);

export default function AdminOrderManager() {
  const [layout, setLayout] = useState(null);
  const [allArticles, setAllArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [articlesResponse, layoutResponse] = await Promise.all([
          databases.listDocuments(DATABASE_ID, ARTICLES_COLLECTION_ID),
          databases.getDocument(DATABASE_ID, LAYOUTS_COLLECTION_ID, EXPLAINERS_LAYOUT_DOC_ID)
        ]);
        setAllArticles(articlesResponse.documents);
        setLayout({
          featuredStoryId: layoutResponse.featuredStoryId,
          articleIds: layoutResponse.articleIds,
        });
      } catch (err) {
        setError('Failed to load content order data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleMove = (direction, index) => {
    const list = [...layout.articleIds];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= list.length) return;
    [list[index], list[newIndex]] = [list[newIndex], list[index]];
    setLayout({ ...layout, articleIds: list });
  };

  const handleFeaturedChange = (e) => {
    setLayout({ ...layout, featuredStoryId: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await databases.updateDocument(
        DATABASE_ID,
        LAYOUTS_COLLECTION_ID,
        EXPLAINERS_LAYOUT_DOC_ID,
        {
          featuredStoryId: layout.featuredStoryId,
          articleIds: layout.articleIds,
        }
      );
      alert('Content order saved successfully!');
    } catch (err) {
      setError('Failed to save changes.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !layout) return <p>Loading content order...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const orderedArticles = layout.articleIds.map(id => allArticles.find(a => a.$id === id)).filter(Boolean);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-3xl font-medium text-gray-700">Content Order</h3>
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:bg-red-300"
        >
          <FiSave className="mr-2" />
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h4 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Explainers Page Layout</h4>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Featured Story</label>
          <select
            value={layout.featuredStoryId}
            onChange={handleFeaturedChange}
            className="shadow border rounded w-full md:w-1/2 py-2 px-3 text-gray-700"
          >
            {allArticles.map(article => (
              <option key={article.$id} value={article.$id}>{article.title}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Article Grid Order</label>
          <div className="space-y-2 p-4 bg-gray-100 rounded-lg border">
            {orderedArticles.map((article, index) => (
              <ReorderableItem
                key={article.$id}
                item={article}
                onMoveUp={() => handleMove('up', index)}
                onMoveDown={() => handleMove('down', index)}
                isFirst={index === 0}
                isLast={index === orderedArticles.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
