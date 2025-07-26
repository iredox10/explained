
// src/pages/AdminSeries.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { databases } from '../appwrite';
import { FiEdit, FiTrash2, FiPlusCircle } from 'react-icons/fi';

// --- Appwrite Configuration ---
const DATABASE_ID = '6885112e000227dd70e8';
const SERIES_COLLECTION_ID = '68854f880036d8a30a8d';

export default function AdminSeries() {
  const [seriesList, setSeriesList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeries = async () => {
      setLoading(true);
      try {
        const response = await databases.listDocuments(DATABASE_ID, SERIES_COLLECTION_ID);
        setSeriesList(response.documents);
      } catch (error) {
        console.error("Failed to fetch series:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSeries();
  }, []);

  const handleDelete = async (seriesId) => {
    if (window.confirm("Are you sure you want to delete this series?")) {
      try {
        await databases.deleteDocument(DATABASE_ID, SERIES_COLLECTION_ID, seriesId);
        setSeriesList(seriesList.filter(series => series.$id !== seriesId));
        alert("Series deleted successfully!");
      } catch (error) {
        console.error("Failed to delete series:", error);
        alert("Failed to delete series.");
      }
    }
  };

  if (loading) return <p>Loading series...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-3xl font-medium text-gray-700">Manage Series</h3>
        <Link
          to="/admin/series/new"
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          <FiPlusCircle className="mr-2" />
          Create New Series
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3 font-semibold">Series Title</th>
                <th className="p-3 font-semibold">No. of Articles</th>
                <th className="p-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {seriesList.map(series => (
                <tr key={series.$id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-3 font-medium text-gray-800">{series.title}</td>
                  <td className="p-3 text-gray-600">{series.articles.length}</td>
                  <td className="p-3 text-right">
                    <Link to={`/admin/series/${series.$id}`} className="text-blue-500 hover:text-blue-700 mr-4 inline-block">
                      <FiEdit size={18} />
                    </Link>
                    <button onClick={() => handleDelete(series.$id)} className="text-red-500 hover:text-red-700">
                      <FiTrash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
