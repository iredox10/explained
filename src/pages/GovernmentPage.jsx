import React from 'react';
import { MOCK_DATA } from '../data/mockData';
import ArticleCard from '../components/ArticleCard';

export default function GovernmentPage() {
  // Helper logic to find all articles with the 'How Government Works' category
  const getGovernmentArticles = () => {
    const allStories = [
      MOCK_DATA.homepage.mainStory,
      ...MOCK_DATA.homepage.topStories,
      ...MOCK_DATA.homepage.secondaryStories,
      MOCK_DATA.explainersPage.featuredStory,
      ...MOCK_DATA.explainersPage.articles,
    ];

    return allStories.filter(story => story && story.category === 'How Government Works');
  };

  const governmentArticles = getGovernmentArticles();

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">How Government Works</h1>
        <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">
          Understanding the structures, roles, and processes that shape our nation.
        </p>
      </div>

      {governmentArticles.length > 0 ? (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {governmentArticles.map(story => (
            <ArticleCard key={story.id} story={story} />
          ))}
        </section>
      ) : (
        <div className="text-center text-slate-500">
          <p>No articles found in this category yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
