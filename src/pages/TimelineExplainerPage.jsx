import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_DATA } from '../data/mockData';
import { FiGitCommit } from 'react-icons/fi';

export default function TimelineExplainerPage() {
  const { id } = useParams();
  const timeline = MOCK_DATA.timelines[id];

  if (!timeline) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold">Timeline not found</h1>
        <Link to="/" className="text-red-600 hover:underline mt-4 inline-block">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
      <div className="text-center mb-12">
        <p className="text-sm font-semibold text-red-600">{timeline.category}</p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mt-2">{timeline.title}</h1>
        <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">{timeline.description}</p>
      </div>

      {/* Timeline Container */}
      <div className="relative">
        {/* The vertical line */}
        <div className="absolute left-4 md:left-1/2 w-0.5 h-full bg-slate-300" aria-hidden="true"></div>

        {/* Timeline Events */}
        <div className="space-y-12">
          {timeline.events.map((event, index) => (
            <div key={index} className="relative flex items-start">
              {/* Dot on the line */}
              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 bg-white">
                <div className="w-5 h-5 bg-red-500 rounded-full border-4 border-white"></div>
              </div>

              {/* Event Content */}
              <div className="w-full pl-12 md:pl-0 md:w-1/2 md:pr-8 text-right">
                {/* Show date on the left for medium screens and up */}
                <p className="hidden md:block text-lg font-bold text-red-600">{event.date}</p>
              </div>
              <div className="w-full pl-12 md:pl-8 md:w-1/2">
                {/* Show date above content for small screens */}
                <p className="md:hidden text-lg font-bold text-red-600 mb-1">{event.date}</p>
                <h3 className="text-xl font-bold text-slate-800">{event.title}</h3>
                <p className="mt-1 text-slate-600">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
