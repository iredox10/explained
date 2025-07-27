// src/components/admin/orderManager/HomepageLayoutForm.js
import React from 'react';
import DraggableArticleList from './DraggableArticleList';

export default function HomepageLayoutForm({ layoutData, allArticles, onSelectChange }) {

  // Calculate which articles are available to be added
  const topStoryIds = new Set(layoutData.topStoryIds || []);
  const secondaryStoryIds = new Set(layoutData.secondaryStoryIds || []);
  const availableArticles = allArticles.filter(
    article => !topStoryIds.has(article.$id) && !secondaryStoryIds.has(article.$id)
  );

  // Get the full article objects for the lists
  const topStories = (layoutData.topStoryIds || []).map(id => allArticles.find(a => a.$id === id)).filter(Boolean);
  const secondaryStories = (layoutData.secondaryStoryIds || []).map(id => allArticles.find(a => a.$id === id)).filter(Boolean);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">Main Story</label>
        <select name="mainStoryId" value={layoutData.mainStoryId} onChange={onSelectChange} className="shadow border rounded w-full py-2 px-3 text-gray-700">
          <option value="">-- Select Main Story --</option>
          {allArticles.map(article => <option key={article.$id} value={article.$id}>{article.title}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Layout Dropzones */}
        <div className="space-y-4">
          <DraggableArticleList listId="topStoryIds" title="Top Stories" articles={topStories} />
          <DraggableArticleList listId="secondaryStoryIds" title="Secondary Stories" articles={secondaryStories} />
        </div>
        {/* Right Column: Available Articles */}
        <div>
          <DraggableArticleList listId="available" title="Available Articles" articles={availableArticles} />
        </div>
      </div>
    </div>
  );
}
