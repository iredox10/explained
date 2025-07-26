
// src/pages/AdminDashboard.js
import React from 'react';
import { MOCK_DATA } from '../data/mockData';

export default function AdminDashboard() {
  const articleCount = Object.keys(MOCK_DATA.allArticles).length;
  const seriesCount = Object.keys(MOCK_DATA.series).length;
  const timelineCount = Object.keys(MOCK_DATA.timelines).length;

  return (
    <div>
      <h3 className="text-3xl font-medium text-gray-700">Dashboard</h3>
      <div className="mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-xl font-bold text-gray-800">Total Articles</h4>
            <p className="text-3xl font-semibold text-gray-700 mt-2">{articleCount}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-xl font-bold text-gray-800">Total Series</h4>
            <p className="text-3xl font-semibold text-gray-700 mt-2">{seriesCount}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-xl font-bold text-gray-800">Total Timelines</h4>
            <p className="text-3xl font-semibold text-gray-700 mt-2">{timelineCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
