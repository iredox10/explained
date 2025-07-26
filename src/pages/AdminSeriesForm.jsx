
// src/pages/AdminSeriesForm.js
import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MOCK_DATA } from '../data/mockData';

export default function AdminSeriesForm() {
  const { id } = useParams();
  const isEditing = id !== 'new';

  const [seriesData, setSeriesData] = useState({
    title: '',
    articles: [],
  });

  // --- Data for dropdowns ---
  const allArticleOptions = Object.entries(MOCK_DATA.allArticles).map(([articleId, article]) => ({ id: articleId, title: article.title }));

  const handleMultiSelectChange = (e) => {
    const options = [...e.target.selectedOptions];
    const values = options.map(option => ({ id: option.value })); // Store as object {id: '...'}
    setSeriesData(prev => ({ ...prev, articles: values }));
  };

  return (
    <div>
      <h3 className="text-3xl font-medium text-gray-700 mb-6">
        {isEditing ? 'Edit Series' : 'Create New Series'}
      </h3>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
              Series Title
            </label>
            <input
              id="title"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter series title"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="articles">
              Articles in this Series (select in order)
            </label>
            <select
              id="articles"
              multiple
              value={seriesData.articles.map(a => a.id)} // Select based on id
              onChange={handleMultiSelectChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 h-64"
            >
              {allArticleOptions.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.title}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Hold Ctrl (or Cmd on Mac) to select multiple articles.</p>
          </div>
          <div className="flex items-center justify-end">
            <Link to="/admin/series" className="text-gray-600 hover:text-gray-800 mr-4">
              Cancel
            </Link>
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Save Series
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
