
// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ArticleCard from '../components/ArticleCard';
import { databases } from '../appwrite';
import { Query } from 'appwrite';
import { DATABASE_ID, ARTICLES_COLLECTION_ID, LAYOUTS_COLLECTION_ID } from '../appwriteConst';

export default function HomePage() {
  const [mainStory, setMainStory] = useState(null);
  const [topStories, setTopStories] = useState([]);
  const [secondaryStories, setSecondaryStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHomepageData = async () => {
      setLoading(true);
      setError('');
      try {
        // 1. Fetch the homepage layout document
        const layoutResponse = await databases.listDocuments(
          DATABASE_ID,
          LAYOUTS_COLLECTION_ID,
          [Query.equal('pageName', 'homepage')]
        );

        if (layoutResponse.documents.length === 0) {
          throw new Error("Homepage layout not found in the database.");
        }
        const layout = layoutResponse.documents[0];
        const { mainStoryId, topStoryIds, secondaryStoryIds } = layout;

        // 2. Create a clean list of all unique article IDs, filtering out any missing ones
        const allIds = [...new Set([mainStoryId, ...topStoryIds, ...secondaryStoryIds])].filter(Boolean);

        if (allIds.length === 0) {
          setLoading(false);
          return; // Nothing to fetch
        }

        // 3. Fetch all required articles
        const articlePromises = allIds.map(id =>
          databases.getDocument(DATABASE_ID, ARTICLES_COLLECTION_ID, id)
        );
        const fetchedArticles = await Promise.all(articlePromises);

        // 4. Map the fetched articles back to their respective sections
        const articlesMap = new Map(fetchedArticles.map(doc => [doc.$id, doc]));

        setMainStory(articlesMap.get(mainStoryId));
        setTopStories(topStoryIds.map(id => articlesMap.get(id)).filter(Boolean));
        setSecondaryStories(secondaryStoryIds.map(id => articlesMap.get(id)).filter(Boolean));

      } catch (err) {
        setError('Failed to fetch homepage data. Please check your layout document in Appwrite.');
        console.error("Failed to fetch homepage data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomepageData();
  }, []);

  if (loading) return <p className="text-center p-12">Loading homepage...</p>;
  if (error) return <p className="text-center p-12 text-red-500">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {mainStory && (
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <ArticleCard story={{ ...mainStory, id: mainStory.$id }} large={true} />
          </div>
          <div className="lg:col-span-2 space-y-8">
            {topStories.slice(0, 2).map((story) => (
              <ArticleCard key={story.$id} story={{ ...story, id: story.$id }} />
            ))}
          </div>
        </section>
      )}

      <hr className="my-8 md:my-12 border-slate-200" />

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {topStories.map((story) => (
          <ArticleCard key={story.$id} story={{ ...story, id: story.$id }} />
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
        {/* FIX: Replaced the buggy section with the ArticleCard component for consistency */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {secondaryStories.map((story) => (
            <ArticleCard key={story.$id} story={{ ...story, id: story.$id }} />
          ))}
        </div>
      </section>
    </div>
  );
}
