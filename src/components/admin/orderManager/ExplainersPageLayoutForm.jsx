
// src/components/admin/orderManager/ExplainersPageLayoutForm.js
import React from 'react';
import DraggableArticleList from './DraggableArticleList';

export default function ExplainersPageLayoutForm({ layoutData, allArticles, onSelectChange }) {
  const getArticleList = (ids) => {
    if (!ids) return [];
    return ids.map(id => allArticles.find(a => a.$id === id)).filter(Boolean);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">Featured Story</label>
        <select name="featuredStoryId" value={layoutData.featuredStoryId} onChange={onSelectChange} className="shadow border rounded w-full py-2 px-3 text-gray-700">
          <option value="">-- Select Featured Story --</option>
          {allArticles.map(article => <option key={article.$id} value={article.$id}>{article.title}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">Article Grid (Drag to Reorder)</label>
        <DraggableArticleList listId="articleIds" articles={getArticleList(layoutData.articleIds)} />
      </div>
    </div>
  );
}
