
// src/pages/ExplainersPage.js
import React, { useState, useEffect } from 'react';
import { databases, storage } from '../appwrite';
import { Query } from 'appwrite';
import { Link } from 'react-router-dom';
import ArticleCard from '../components/ArticleCard';
import { DATABASE_ID, ARTICLES_COLLECTION_ID, LAYOUTS_COLLECTION_ID, IMAGE_BUCKET_ID } from '../appwriteConst';

export default function ExplainersPage() {
  const [featuredStory, setFeaturedStory] = useState(null);
  const [topExplainers, setTopExplainers] = useState([]);
  const [otherExplainers, setOtherExplainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPageData = async () => {
      setLoading(true);
      setError('');
      try {
        // 1. Fetch the layout document for the explainers page
        const layoutResponse = await databases.listDocuments(
          DATABASE_ID,
          LAYOUTS_COLLECTION_ID,
          [Query.equal('pageName', 'explainersPage')]
        );

        if (layoutResponse.documents.length === 0) {
          throw new Error("Explainers page layout not found in the database.");
        }
        const layout = layoutResponse.documents[0];
        const { featuredStoryId, articleIds } = layout;

        // 2. Create a clean list of all unique article IDs needed
        const allIds = [...new Set([featuredStoryId, ...articleIds])].filter(Boolean);

        if (allIds.length === 0) {
          setLoading(false);
          return;
        }

        // 3. Fetch all required articles
        const articlePromises = allIds.map(id =>
          databases.getDocument(DATABASE_ID, ARTICLES_COLLECTION_ID, id)
        );
        const fetchedArticles = await Promise.all(articlePromises);

        // 4. Map the fetched articles back to their respective sections
        const articlesMap = new Map(fetchedArticles.map(doc => [doc.$id, doc]));

        setFeaturedStory(articlesMap.get(featuredStoryId));

        const remainingArticles = articleIds
          .filter(id => id !== featuredStoryId)
          .map(id => articlesMap.get(id))
          .filter(Boolean);

        setTopExplainers(remainingArticles.slice(0, 2));
        setOtherExplainers(remainingArticles.slice(2));

      } catch (err) {
        setError('Failed to load explainers page content. Please check your layout document in Appwrite.');
        console.error("Failed to fetch explainers page data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPageData();
  }, []);

  if (loading) return <div className="text-center p-12">Loading...</div>;
  if (error) return <div className="text-center p-12 text-red-500">{error}</div>;

  return (
    <div className="bg-white">
      {/* --- Hero Section --- */}
      {featuredStory && (
        <Link to={`/article/${featuredStory.$id}`} className="block group relative bg-slate-900 text-white">
          <div className="absolute inset-0">
            <img
              src={storage.getFilePreview(IMAGE_BUCKET_ID, featuredStory.imageUrl)}
              alt={featuredStory.title}
              className="w-full h-full object-cover opacity-40 group-hover:opacity-30 transition-opacity"
            />
          </div>
          <div className="relative container mx-auto px-4 py-16 md:py-24 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-yellow-400">{featuredStory.category}</p>
            <h1 className="text-4xl md:text-6xl font-extrabold font-serif mt-4 max-w-4xl mx-auto">
              {featuredStory.title}
            </h1>
            <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">{featuredStory.excerpt}</p>
            <span className="mt-6 inline-block font-semibold text-white border-b-2 border-yellow-400 group-hover:bg-yellow-400 group-hover:text-slate-900 transition-colors px-2 py-1">
              Read the explainer
            </span>
          </div>
        </Link>
      )}

      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* --- Top Explainers Section --- */}
        {topExplainers.length > 0 && (
          <>
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Top Explainers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {topExplainers.map(story => (
                <ArticleCard key={story.$id} story={{ ...story, id: story.$id }} />
              ))}
            </div>
            <hr className="my-12 md:my-16 border-slate-200" />
          </>
        )}

        {/* --- More Explainers Grid --- */}
        {otherExplainers.length > 0 && (
          <>
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">More Explainers</h2>
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherExplainers.map(story => (
                <ArticleCard key={story.$id} story={{ ...story, id: story.$id }} />
              ))}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
