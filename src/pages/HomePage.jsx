
// src/pages/HomePage.js
import React from 'react';
import ArticleCard from '../components/ArticleCard';
import { MOCK_DATA } from '../data/mockData';

export default function HomePage() {
  const { mainStory, topStories, secondaryStories } = MOCK_DATA.homepage;
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <ArticleCard story={mainStory} large={true} />
        </div>
        <div className="lg:col-span-2 space-y-8">
          {topStories.slice(0, 2).map((story) => (
            <ArticleCard key={story.id} story={story} />
          ))}
        </div>
      </section>

      <hr className="my-8 md:my-12 border-slate-200" />

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {topStories.map((story) => (
          <ArticleCard key={story.id} story={story} />
        ))}
      </section>

      <hr className="my-8 md:my-12 border-slate-200" />

      <section className="bg-slate-100 p-8 rounded-lg text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Understand the world.</h2>
        <p className="mt-2 text-slate-600 max-w-2xl mx-auto">Sign up for our newsletter to get the best of our journalism delivered to your inbox.</p>
        <form className="mt-6 max-w-lg mx-auto flex flex-col sm:flex-row gap-2">
          <input type="email" placeholder="Your email address" className="flex-grow px-4 py-3 rounded-md border border-slate-300 focus:ring-2 focus:ring-red-500 focus:outline-none" required />
          <button type="submit" className="bg-slate-800 text-white px-6 py-3 rounded-md font-semibold hover:bg-slate-900 transition-bg">Sign Up</button>
        </form>
      </section>

      <hr className="my-8 md:my-12 border-slate-200" />

      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">More Stories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {secondaryStories.map((story) => (
            <div key={story.id} className="group">
              <div className="overflow-hidden rounded-lg">
                <img src={story.imageUrl} alt={story.title} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <h3 className="font-bold text-lg mt-3 text-slate-800 group-hover:text-red-700 transition-colors">
                <a href={`/article/${story.id}`}>{story.title}</a>
              </h3>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
