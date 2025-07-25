
// src/pages/NewsPage.js
import React from 'react';
import { MOCK_DATA } from '../data/mockData';
import ArticleCard from '../components/ArticleCard';
// Import icons from react-icons
import { FiUser, FiCalendar } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function NewsPage() {
  const { featuredStory, articles } = MOCK_DATA.newsPage;
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">News</h1>
        <p className="mt-3 text-lg text-slate-600">The latest updates and stories from around the world.</p>
      </div>

      <section className="mb-12">
        <div className="group grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="overflow-hidden rounded-lg">
            <Link to={`/article/${featuredStory.id}`}>
              <img src={featuredStory.imageUrl} alt={featuredStory.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </Link>
          </div>
          <div>
            <p className="text-sm font-semibold text-red-600">{featuredStory.category}</p>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 text-slate-900 group-hover:text-red-700 transition-colors">
              <Link to={`/article/${featuredStory.id}`}>{featuredStory.title}</Link>
            </h2>
            <p className="text-slate-600 mt-4 text-lg">{featuredStory.excerpt}</p>
            <div className="flex items-center space-x-4 text-sm text-slate-500 mt-4">
              {/* Use react-icons */}
              <div className="flex items-center space-x-2"><FiUser size={14} /><span>By {featuredStory.author}</span></div>
              <div className="flex items-center space-x-2"><FiCalendar size={14} /><span>{featuredStory.date}</span></div>
            </div>
          </div>
        </div>
      </section>

      <hr className="my-8 md:my-12 border-slate-200" />

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map(story => (
          <ArticleCard key={story.id} story={story} />
        ))}
      </section>
    </div>
  );
}
