
// src/pages/ArticlePage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { databases, storage } from '../appwrite'; // Import storage
import { Query } from 'appwrite';
import { FiChevronsRight } from 'react-icons/fi';
import ArticleCard from '../components/ArticleCard';
import SeriesNavigator from '../components/SeriesNavigator';
import { DATABASE_ID, ARTICLES_COLLECTION_ID, USERS_COLLECTION_ID, IMAGE_BUCKET_ID } from '../appwriteConst'; // Import IMAGE_BUCKET_ID

export default function ArticlePage() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [authorDetails, setAuthorDetails] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticleData = async () => {
      setLoading(true);
      setError('');
      try {
        // 1. Fetch the main article document first.
        const articleDoc = await databases.getDocument(DATABASE_ID, ARTICLES_COLLECTION_ID, id);
        setArticle(articleDoc);

        // 2. Prepare all subsequent data fetches to run in parallel.
        const promises = [];

        // Promise to fetch the author's details
        if (articleDoc.author) {
          promises.push(
            databases.listDocuments(
              DATABASE_ID,
              USERS_COLLECTION_ID,
              [Query.equal('name', articleDoc.author)]
            )
          );
        } else {
          promises.push(Promise.resolve(null));
        }

        // Promises to fetch all related articles
        if (articleDoc.relatedArticles && articleDoc.relatedArticles.length > 0) {
          articleDoc.relatedArticles.forEach(relatedId => {
            promises.push(databases.getDocument(DATABASE_ID, ARTICLES_COLLECTION_ID, relatedId));
          });
        }

        // 3. Execute all promises at the same time.
        const results = await Promise.all(promises);

        // 4. Process the results
        const authorResponse = results[0];
        if (authorResponse && authorResponse.documents.length > 0) {
          setAuthorDetails(authorResponse.documents[0]);
        }

        const fetchedRelated = results.slice(1);
        setRelatedArticles(fetchedRelated);

      } catch (err) {
        setError('Article not found or failed to load.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticleData();
  }, [id]);

  if (loading) return <div className="text-center p-12">Loading article...</div>;
  if (error) return <div className="text-center p-12 text-red-500">{error}</div>;
  if (!article) return null;

  const authorSlug = authorDetails ? encodeURIComponent(authorDetails.name.toLowerCase().replace(/\s+/g, '-')) : '';

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
      <article>
        <p className="text-sm font-semibold text-red-600">{article.category || 'Explainer'}</p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mt-2">{article.title}</h1>
        <p className="mt-4 text-lg text-slate-600">
          By {authorDetails ? (
            <Link to={`/author/${authorSlug}`} className="font-semibold text-slate-800 hover:underline">
              {article.author}
            </Link>
          ) : (
            <span className="font-semibold text-slate-800">{article.author}</span>
          )}
        </p>

        {/* --- ADDED FEATURED IMAGE --- */}
        {article.imageUrl && (
          <div className="my-8">
            <img
              src={storage.getFilePreview(IMAGE_BUCKET_ID, article.imageUrl)}
              alt={article.title}
              className="w-full h-auto object-cover rounded-lg shadow-lg"
            />
          </div>
        )}

        {article.seriesId && (
          <SeriesNavigator seriesId={article.seriesId} currentArticleId={id} />
        )}

        {article.keyTakeaways && article.keyTakeaways.length > 0 && (
          <div className="my-8 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
            <h3 className="text-xl font-bold text-blue-900 mb-3">Key Takeaways</h3>
            <ul className="space-y-2">
              {article.keyTakeaways.map((takeaway, index) => (
                <li key={index} className="flex items-start">
                  <FiChevronsRight className="text-blue-600 mt-1 mr-2 flex-shrink-0" />
                  <span className="text-blue-800">{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div
          className="prose lg:prose-xl mt-8 text-slate-800"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </article>

      {relatedArticles.length > 0 && (
        <section className="mt-16 pt-8 border-t border-slate-200">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Go Deeper</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {relatedArticles.map(relatedStory => (
              <ArticleCard key={relatedStory.$id} story={{ ...relatedStory, id: relatedStory.$id }} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
