
// src/pages/AdminTimelineForm.js
import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

export default function AdminTimelineForm() {
  const { id } = useParams();
  const isEditing = id !== 'new';

  const [timelineData, setTimelineData] = useState({
    title: '',
    category: '',
    description: '',
    events: [{ date: '', title: '', description: '' }],
  });

  const handleTimelineChange = (e) => {
    setTimelineData({ ...timelineData, [e.target.name]: e.target.value });
  };

  const handleEventChange = (index, e) => {
    const newEvents = [...timelineData.events];
    newEvents[index][e.target.name] = e.target.value;
    setTimelineData({ ...timelineData, events: newEvents });
  };

  const addEvent = () => {
    setTimelineData({
      ...timelineData,
      events: [...timelineData.events, { date: '', title: '', description: '' }],
    });
  };

  const removeEvent = (index) => {
    const newEvents = timelineData.events.filter((_, i) => i !== index);
    setTimelineData({ ...timelineData, events: newEvents });
  };

  return (
    <div>
      <h3 className="text-3xl font-medium text-gray-700 mb-6">
        {isEditing ? 'Edit Timeline' : 'Create New Timeline'}
      </h3>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">Timeline Title</label>
              <input id="title" name="title" type="text" onChange={handleTimelineChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">Category</label>
              <input id="category" name="category" type="text" onChange={handleTimelineChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">Description</label>
              <textarea id="description" name="description" rows="3" onChange={handleTimelineChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"></textarea>
            </div>
          </div>

          <hr className="my-6" />

          <div>
            <h4 className="text-xl font-bold text-gray-800 mb-4">Timeline Events</h4>
            <div className="space-y-4">
              {timelineData.events.map((event, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-8 gap-4 items-center bg-gray-50 p-4 rounded-lg">
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 text-sm font-bold mb-1">Date</label>
                    <input name="date" value={event.date} onChange={(e) => handleEventChange(index, e)} className="shadow-sm border rounded w-full py-2 px-3" />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-gray-700 text-sm font-bold mb-1">Event Title</label>
                    <input name="title" value={event.title} onChange={(e) => handleEventChange(index, e)} className="shadow-sm border rounded w-full py-2 px-3" />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-gray-700 text-sm font-bold mb-1">Event Description</label>
                    <input name="description" value={event.description} onChange={(e) => handleEventChange(index, e)} className="shadow-sm border rounded w-full py-2 px-3" />
                  </div>
                  <button type="button" onClick={() => removeEvent(index)} className="text-red-500 hover:text-red-700 self-end mb-1">
                    <FiTrash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addEvent} className="flex items-center mt-4 text-blue-600 hover:text-blue-800 font-semibold">
              <FiPlus className="mr-2" />
              Add Event
            </button>
          </div>

          <div className="flex items-center justify-end mt-8 pt-6 border-t border-gray-200">
            <Link to="/admin/timelines" className="text-gray-600 hover:text-gray-800 mr-4">
              Cancel
            </Link>
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Save Timeline
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
