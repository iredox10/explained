import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_DATA } from '../data/mockData';
import { FiChevronsRight } from 'react-icons/fi'; // Icon for takeaways
import ArticleCard from '../components/ArticleCard'; // Needed for the "Go Deeper" section

export default function ArticlePage() {
  const { id } = useParams();
  const article = MOCK_DATA.allArticles[id];

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold">Article not found</h1>
        <Link to="/" className="text-red-600 hover:underline mt-4 inline-block">Back to Home</Link>
      </div>
    );
  }

  // Find the full article objects for the "Go Deeper" section
  const relatedArticleObjects = article.relatedArticles
    ? article.relatedArticles.map(relatedId => {
      // This helper logic finds the full article details from all mock data lists.
      // A real API would make this much cleaner.
      const allStories = [
        ...MOCK_DATA.homepage.topStories,
        ...MOCK_DATA.homepage.secondaryStories,
        ...MOCK_DATA.explainersPage.articles,
        MOCK_DATA.homepage.mainStory,
        MOCK_DATA.explainersPage.featuredStory
      ];
      const story = allStories.find(s => s.id === relatedId);
      // We also need to add the full content to the card if it exists
      if (story) {
        return { ...story, ...MOCK_DATA.allArticles[relatedId] };
      }
      return null;
    }).filter(Boolean) // Filter out any null/undefined results
    : [];


  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
      <article>
        <p className="text-sm font-semibold text-red-600">{article.category || 'Explainer'}</p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mt-2">{article.title}</h1>
        <p className="mt-4 text-lg text-slate-600">By {article.author}</p>

        {/* Key Takeaways Section */}
        {article.keyTakeaways && (
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

        {/* Main Article Content */}
        <div className="prose lg:prose-xl mt-8 text-slate-800">
          <p>{article.content}</p>
        </div>
      </article>

      {/* Go Deeper Section */}
      {relatedArticleObjects.length > 0 && (
        <section className="mt-16 pt-8 border-t border-slate-200">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Go Deeper</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {relatedArticleObjects.map(relatedStory => (
              <ArticleCard key={relatedStory.id} story={relatedStory} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
