
// src/pages/NewsPage.js
import React, { useState, useEffect } from 'react';
import { databases } from '../appwrite';
import { Query } from 'appwrite';
import ArticleCard from '../components/ArticleCard';
import { DATABASE_ID, ARTICLES_COLLECTION_ID, LAYOUTS_COLLECTION_ID } from '../appwriteConst';

export default function NewsPage() {
  const [featuredStory, setFeaturedStory] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPageData = async () => {
      setLoading(true);
      setError('');
      try {
        // 1. Fetch the layout document for the news page
        const layoutResponse = await databases.listDocuments(
          DATABASE_ID,
          LAYOUTS_COLLECTION_ID,
          [Query.equal('pageName', 'newsPage')]
        );

        if (layoutResponse.documents.length === 0) {
          throw new Error("News page layout not found in the database.");
        }
        const layout = layoutResponse.documents[0];
        const { featuredStoryId, articleIds } = layout;

        // 2. Fetch all required articles based on the layout
        const articlePromises = [
          databases.getDocument(DATABASE_ID, ARTICLES_COLLECTION_ID, featuredStoryId),
          ...articleIds.map(id => databases.getDocument(DATABASE_ID, ARTICLES_COLLECTION_ID, id))
        ];

        const [featuredDoc, ...articleDocs] = await Promise.all(articlePromises);

        setFeaturedStory(featuredDoc);
        setArticles(articleDocs);

      } catch (err) {
        setError('Failed to load news page content. Please check your Appwrite configuration.');
        console.error("Failed to fetch news page data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPageData();
  }, []);

  if (loading) return <div className="text-center p-12">Loading news...</div>;
  if (error) return <div className="text-center p-12 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">News</h1>
        <p className="mt-3 text-lg text-slate-600">The latest updates and stories from around the world.</p>
      </div>

      {featuredStory && (
        <section className="mb-12">
          <ArticleCard story={{ ...featuredStory, id: featuredStory.$id }} large={true} />
        </section>
      )}

      <hr className="my-8 md:my-12 border-slate-200" />

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map(story => (
          <ArticleCard key={story.$id} story={{ ...story, id: story.$id }} />
        ))}
      </section>
    </div>
  );
}
