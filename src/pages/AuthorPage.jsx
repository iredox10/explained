import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { databases, storage } from '../appwrite';
import { Query } from 'appwrite';
import ArticleCard from '../components/ArticleCard';
import { DATABASE_ID, USERS_COLLECTION_ID, ARTICLES_COLLECTION_ID, AUTHOR_AVATAR_BUCKET_ID } from '../appwriteConst';
import { FiFacebook, FiTwitter, FiLinkedin } from 'react-icons/fi';

export default function AuthorPage() {
  const { authorSlug } = useParams();
  const [authorDetails, setAuthorDetails] = useState(null);
  const [authorArticles, setAuthorArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthorData = async () => {
      setLoading(true);
      try {
        // Find the author by their name (slug logic would be more complex in a real app)
        // For now, we assume the slug is the author's name, URL-encoded.
        const authorName = decodeURIComponent(authorSlug);

        const userResponse = await databases.listDocuments(
          DATABASE_ID,
          USERS_COLLECTION_ID,
          [Query.equal('name', authorName)]
        );

        if (userResponse.documents.length > 0) {
          const author = userResponse.documents[0];
          setAuthorDetails(author);

          // Fetch articles by this author
          const articlesResponse = await databases.listDocuments(
            DATABASE_ID,
            ARTICLES_COLLECTION_ID,
            [Query.equal('author', author.name)]
          );
          setAuthorArticles(articlesResponse.documents);
        } else {
          setAuthorDetails(null); // Author not found
        }
      } catch (error) {
        console.error("Failed to fetch author data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAuthorData();
  }, [authorSlug]);

  if (loading) return <p className="text-center p-12">Loading author profile...</p>;

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
        {authorDetails.imageUrl ? (
          <img
            src={storage.getFilePreview(AUTHOR_AVATAR_BUCKET_ID, authorDetails.imageUrl)}
            alt={authorDetails.name}
            className="w-32 h-32 rounded-full object-cover mb-4 md:mb-0 md:mr-8"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-4 md:mb-0 md:mr-8">
            <span className="text-4xl text-gray-500">{authorDetails.name.charAt(0)}</span>
          </div>
        )}
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight text-center md:text-left">
            {authorDetails.name}
          </h1>
          <p className="mt-2 text-lg text-slate-600 max-w-2xl text-center md:text-left">
            {authorDetails.bio}
          </p>
          {/* Social Media Links Section */}
          <div className="mt-4 flex justify-center md:justify-start space-x-4">
            {authorDetails.xUrl && (
              <a href={authorDetails.xUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-800">
                <FiTwitter size={24} />
              </a>
            )}
            {authorDetails.facebookUrl && (
              <a href={authorDetails.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600">
                <FiFacebook size={24} />
              </a>
            )}
            {authorDetails.linkedinUrl && (
              <a href={authorDetails.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-700">
                <FiLinkedin size={24} />
              </a>
            )}
          </div>
        </div>
      </header>

      <hr className="my-8" />

      <h2 className="text-3xl font-bold text-slate-900 mb-6">Articles by {authorDetails.name}</h2>

      {authorArticles.length > 0 ? (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {authorArticles.map(story => (
            <ArticleCard key={story.$id} story={{ ...story, id: story.$id }} />
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
