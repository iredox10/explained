
// src/components/ArticleCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { storage } from '../appwrite'; // Import storage

// --- Appwrite Configuration ---
const IMAGE_BUCKET_ID = '6885418f0020cc88b27f'; // Add your Bucket ID here

export default function ArticleCard({ story, large = false }) {
  // Helper to get image URL. If it's an Appwrite ID, get preview. Otherwise, use placeholder.
  const getImageUrl = (imageId) => {
    if (!imageId) {
      return 'https://placehold.co/600x400/e2e8f0/334155?text=No+Image';
    }
    // Check if it's a placeholder URL or an Appwrite ID
    if (imageId.startsWith('http')) {
      return imageId;
    }
    return storage.getFilePreview(IMAGE_BUCKET_ID, imageId);
  };

  return (
    <div className="group flex flex-col">
      <div className="overflow-hidden rounded-lg">
        <Link to={`/article/${story.id}`}>
          <img
            src={getImageUrl(story.imageUrl)}
            alt={story.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
      </div>
      <div className="mt-4">
        {story.category && <p className="text-sm font-semibold text-red-600">{story.category}</p>}
        <h3 className={`font-bold mt-1 ${large ? 'text-2xl md:text-3xl' : 'text-xl'} text-slate-900 group-hover:text-red-700 transition-colors`}>
          <Link to={`/article/${story.id}`}>{story.title}</Link>
        </h3>
        {story.excerpt && <p className="text-slate-600 mt-2">{story.excerpt}</p>}
        {story.author && <p className="text-sm text-slate-500 mt-2 font-medium">By {story.author}</p>}
      </div>
    </div>
  );
}
