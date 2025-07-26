import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_DATA } from '../data/mockData';
import ArticleCard from '../components/ArticleCard';

export default function AuthorPage() {
  const { authorSlug } = useParams();

  // Find the author details using the slug from the URL
  const authorDetails = Object.values(MOCK_DATA.authors).find(
    author => author.slug === authorSlug
  );

  // Find all articles written by this author
  const authorArticles = Object.entries(MOCK_DATA.allArticles)
    .map(([id, article]) => ({ id, ...article }))
    .filter(article => article.author === authorDetails?.name);

  if (!authorDetails) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold">Author not found</h1>
        <Link to="/" className="text-red-600 hover:underline mt-4 inline-block">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <header className="flex flex-col md:flex-row items-center mb-12">
        <img
          src={authorDetails.imageUrl}
          alt={authorDetails.name}
          className="w-32 h-32 rounded-full object-cover mb-4 md:mb-0 md:mr-8"
        />
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight text-center md:text-left">
            {authorDetails.name}
          </h1>
          <p className="mt-2 text-lg text-slate-600 max-w-2xl text-center md:text-left">
            {authorDetails.bio}
          </p>
        </div>
      </header>

      <hr className="my-8" />

      <h2 className="text-3xl font-bold text-slate-900 mb-6">Articles by {authorDetails.name}</h2>

      {authorArticles.length > 0 ? (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {authorArticles.map(story => (
            <ArticleCard key={story.id} story={story} />
          ))}
        </section>
      ) : (
        <div className="text-center text-slate-500">
          <p>No articles found for this author yet.</p>
        </div>
      )}
    </div>
  );
}
