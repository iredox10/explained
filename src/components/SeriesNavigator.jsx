import React from 'react';
import { Link } from 'react-router-dom';
import { MOCK_DATA } from '../data/mockData';
import { FiCheckCircle, FiCircle } from 'react-icons/fi';

export default function SeriesNavigator({ seriesId, currentArticleId }) {
  const series = MOCK_DATA.series[seriesId];

  if (!series) {
    return null;
  }

  return (
    <div className="bg-slate-100 border border-slate-200 rounded-lg p-6 my-8">
      <p className="text-sm font-semibold text-slate-500">Part of a Series</p>
      <h3 className="text-xl font-bold text-slate-800 mt-1">{series.title}</h3>
      <ul className="mt-4 space-y-3">
        {series.articles.map((articleInfo, index) => {
          const article = MOCK_DATA.allArticles[articleInfo.id];
          const isCurrent = articleInfo.id === currentArticleId;

          return (
            <li key={articleInfo.id}>
              <Link
                to={`/article/${articleInfo.id}`}
                className={`flex items-center p-3 rounded-md transition-colors ${isCurrent ? 'bg-red-100 text-red-800' : 'hover:bg-slate-200'}`}
              >
                {isCurrent ? (
                  <FiCheckCircle className="text-red-600 mr-4 flex-shrink-0" size={20} />
                ) : (
                  <FiCircle className="text-slate-400 mr-4 flex-shrink-0" size={20} />
                )}

                <div className="flex flex-col">
                  <span className={`font-semibold ${isCurrent ? 'text-red-800' : 'text-slate-700'}`}>
                    Part {index + 1}: {article.title}
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
