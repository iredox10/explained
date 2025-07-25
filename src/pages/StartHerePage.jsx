import React from 'react';
import { Link } from 'react-router-dom';
import { MOCK_DATA } from '../data/mockData';
import { FiArrowRight } from 'react-icons/fi';

export default function StartHerePage() {
  const { title, description, articles } = MOCK_DATA.startHerePage;

  return (
    <div className="bg-slate-800 text-white">
      <div className="container mx-auto px-4 py-16 md:py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{title}</h1>
        <p className="mt-4 text-lg md:text-xl text-slate-300 max-w-3xl mx-auto">{description}</p>
      </div>

      <div className="bg-slate-50 text-slate-900">
        <div className="container mx-auto px-4 py-12 md:py-16 max-w-4xl">
          <div className="space-y-8">
            {articles.map((article, index) => {
              // Find the full article details from the mock data
              const articleDetails = MOCK_DATA.allArticles[article.id];
              if (!articleDetails) return null;

              return (
                <Link
                  key={article.id}
                  to={`/article/${article.id}`}
                  className="group block p-6 rounded-lg bg-white border border-slate-200 hover:shadow-lg hover:border-red-500 transition-all duration-300"
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-slate-100 rounded-lg w-16 h-16 flex items-center justify-center">
                      <span className="text-2xl font-bold text-slate-500">0{index + 1}</span>
                    </div>
                    <div className="ml-6 flex-grow">
                      <h3 className="text-xl font-bold text-slate-800 group-hover:text-red-700">{articleDetails.title}</h3>
                      <p className="mt-1 text-slate-600">{article.description}</p>
                    </div>
                    <FiArrowRight className="ml-4 text-slate-400 group-hover:text-red-600 transition-transform group-hover:translate-x-1" size={24} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
