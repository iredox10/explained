import React from 'react';
import { Link } from 'react-router-dom';
import { MOCK_DATA } from '../data/mockData';
import { FiEdit, FiTrash2, FiPlusCircle } from 'react-icons/fi';

export default function AdminTimelines() {
  const timelines = Object.values(MOCK_DATA.timelines);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-3xl font-medium text-gray-700">Manage Timelines</h3>
        <Link
          to="/admin/timelines/new"
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          <FiPlusCircle className="mr-2" />
          Create New Timeline
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3 font-semibold">Timeline Title</th>
                <th className="p-3 font-semibold">Category</th>
                <th className="p-3 font-semibold">No. of Events</th>
                <th className="p-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {timelines.map(timeline => (
                <tr key={timeline.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-3 font-medium text-gray-800">{timeline.title}</td>
                  <td className="p-3 text-gray-600">{timeline.category}</td>
                  <td className="p-3 text-gray-600">{timeline.events.length}</td>
                  <td className="p-3 text-right">
                    <button className="text-blue-500 hover:text-blue-700 mr-4">
                      <FiEdit size={18} />
                    </button>
                    <button className="text-red-500 hover:text-red-700">
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
