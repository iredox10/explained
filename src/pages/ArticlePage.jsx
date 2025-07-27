import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { databases, storage } from '../appwrite';
import { Query } from 'appwrite';
import { FiChevronsRight, FiTwitter, FiFacebook, FiLinkedin, FiShare2 } from 'react-icons/fi';
import ArticleCard from '../components/ArticleCard';
import SeriesNavigator from '../components/SeriesNavigator';
import { DATABASE_ID, ARTICLES_COLLECTION_ID, USERS_COLLECTION_ID, IMAGE_BUCKET_ID, AUTHOR_AVATAR_BUCKET_ID } from '../appwriteConst';

export default function ArticlePage() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [authorDetails, setAuthorDetails] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState('');
  const [showMobileShare, setShowMobileShare] = useState(false);

  // Effect to show/hide mobile share bar on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowMobileShare(true);
      } else {
        setShowMobileShare(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchArticleData = async () => {
      setLoading(true);
      setError('');
      try {
        const articleDoc = await databases.getDocument(DATABASE_ID, ARTICLES_COLLECTION_ID, id);
        setArticle(articleDoc);

        const promises = [];
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

        if (articleDoc.relatedArticles && articleDoc.relatedArticles.length > 0) {
          articleDoc.relatedArticles.forEach(relatedId => {
            promises.push(databases.getDocument(DATABASE_ID, ARTICLES_COLLECTION_ID, relatedId));
          });
        }

        const results = await Promise.all(promises);
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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    }, () => {
      setCopySuccess('Failed');
    });
  };

  if (loading) return <div className="text-center p-12">Loading article...</div>;
  if (error) return <div className="text-center p-12 text-red-500">{error}</div>;
  if (!article) return null;

  const authorSlug = authorDetails ? encodeURIComponent(authorDetails.name.toLowerCase().replace(/\s+/g, '-')) : '';
  const shareUrl = window.location.href;
  const shareTitle = encodeURIComponent(article.title);

  return (
    <div className="bg-gray-50">
      {/* --- Immersive Hero Section --- */}
      <header className="relative h-[50vh] min-h-[350px] md:h-[60vh] md:min-h-[400px] text-white">
        <div className="absolute inset-0 bg-black">
          {article.imageUrl && (
            <img
              src={storage.getFilePreview(IMAGE_BUCKET_ID, article.imageUrl)}
              alt={article.title}
              className="w-full h-full object-cover opacity-50"
            />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        <div className="relative h-full flex flex-col justify-end p-4 md:p-12">
          <div className="max-w-4xl mx-auto w-full">
            <p className="text-sm font-semibold uppercase tracking-widest text-yellow-400">{article.category || 'Explainer'}</p>
            <h1 className="text-3xl md:text-6xl font-extrabold font-serif tracking-tight mt-2">{article.title}</h1>
            <p className="mt-4 text-base md:text-lg text-gray-300">
              By {authorDetails ? (
                <Link to={`/author/${authorSlug}`} className="font-semibold text-white hover:underline">
                  {article.author}
                </Link>
              ) : (
                <span className="font-semibold text-white">{article.author}</span>
              )}
            </p>
          </div>
        </div>
      </header>

      {/* --- Main Content Area --- */}
      <div className="relative bg-white py-8 md:py-16">
        <div className="max-w-4xl mx-auto px-4 md:px-8 grid grid-cols-12 gap-8">

          {/* --- Sticky Sidebar (Desktop Only) --- */}
          <aside className="hidden lg:block col-span-2">
            <div className="sticky top-24">
              {authorDetails && (
                <Link to={`/author/${authorSlug}`} className="flex flex-col items-center text-center group mb-6">
                  <img
                    src={authorDetails.imageUrl ? storage.getFilePreview(AUTHOR_AVATAR_BUCKET_ID, authorDetails.imageUrl) : `https://placehold.co/100x100/e2e8f0/334155?text=${authorDetails.name.charAt(0)}`}
                    alt={authorDetails.name}
                    className="w-16 h-16 rounded-full object-cover mb-2 transition-transform group-hover:scale-110"
                  />
                  <p className="text-sm font-semibold text-gray-800 group-hover:text-red-600">{authorDetails.name}</p>
                </Link>
              )}
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 text-center mb-3">Share</h4>
              <div className="flex flex-col items-center space-y-4">
                <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500" title="Share on X"><FiTwitter size={20} /></a>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-700" title="Share on Facebook"><FiFacebook size={20} /></a>
                <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${shareTitle}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-800" title="Share on LinkedIn"><FiLinkedin size={20} /></a>
                <button onClick={handleCopyLink} className="text-gray-400 hover:text-green-600" title="Copy Link"><FiShare2 size={20} /></button>
                {copySuccess && <span className="text-xs text-green-600">{copySuccess}</span>}
              </div>
            </div>
          </aside>

          {/* --- Article Content --- */}
          <main className="col-span-12 lg:col-span-8">
            <article>
              {article.seriesId && (<SeriesNavigator seriesId={article.seriesId} currentArticleId={id} />)}
              {article.keyTakeaways && article.keyTakeaways.length > 0 && (
                <div className="my-8 bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
                  <h3 className="text-xl font-bold text-yellow-900 mb-3">Key Takeaways</h3>
                  <ul className="space-y-2">
                    {article.keyTakeaways.map((takeaway, index) => (
                      <li key={index} className="flex items-start">
                        <FiChevronsRight className="text-yellow-600 mt-1 mr-2 flex-shrink-0" />
                        <span className="text-yellow-800">{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="prose prose-lg lg:prose-xl mt-8 text-slate-800 max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
            </article>
          </main>
        </div>
      </div>

      {/* --- Go Deeper Section --- */}
      {relatedArticles.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Go Deeper</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedArticles.map(relatedStory => (<ArticleCard key={relatedStory.$id} story={{ ...relatedStory, id: relatedStory.$id }} />))}
            </div>
          </div>
        </section>
      )}

      {/* --- Sticky Mobile Share Bar --- */}
      <div className={`lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg transform transition-transform duration-300 ${showMobileShare ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="flex justify-around items-center p-2">
          <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center text-gray-600 hover:text-blue-500">
            <FiTwitter size={22} />
            <span className="text-xs mt-1">X</span>
          </a>
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center text-gray-600 hover:text-blue-700">
            <FiFacebook size={22} />
            <span className="text-xs mt-1">Facebook</span>
          </a>
          <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${shareTitle}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center text-gray-600 hover:text-blue-800">
            <FiLinkedin size={22} />
            <span className="text-xs mt-1">LinkedIn</span>
          </a>
          <button onClick={handleCopyLink} className="flex flex-col items-center text-gray-600 hover:text-green-600">
            <FiShare2 size={22} />
            <span className="text-xs mt-1">{copySuccess || 'Copy'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
