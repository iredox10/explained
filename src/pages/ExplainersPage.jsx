import React, { useState, useEffect } from 'react';
import { databases } from '../appwrite';
import { Query } from 'appwrite';
import ArticleCard from '../components/ArticleCard';
import { DATABASE_ID, ARTICLES_COLLECTION_ID, LAYOUTS_COLLECTION_ID } from '../appwriteConst';

export default function ExplainersPage() {
  const [featuredStory, setFeaturedStory] = useState(null);
  const [articles, setArticles] = useState([]);
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

        // 2. Create a clean list of all unique article IDs needed, filtering out any missing ones
        const allIds = [...new Set([featuredStoryId, ...articleIds])].filter(Boolean);

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

        setFeaturedStory(articlesMap.get(featuredStoryId));
        setArticles(articleIds.map(id => articlesMap.get(id)).filter(Boolean));

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
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Explainers</h1>
        <p className="mt-3 text-lg text-slate-600">Breaking down complex topics on government and society.</p>
      </div>

      {featuredStory && (
        <section className="mb-12">
          {/* Using ArticleCard ensures the image URL is handled correctly */}
          <ArticleCard story={{ ...featuredStory, id: featuredStory.$id }} large={true} />
        </section>
      )}

      <hr className="my-8 md:my-12 border-slate-200" />

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Using ArticleCard here also ensures correct image handling */}
        {articles.map(story => (
          <ArticleCard key={story.$id} story={{ ...story, id: story.$id }} />
        ))}
      </section>
    </div>
  );
}
