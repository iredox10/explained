import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-800 text-slate-300 mt-12">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          <div className="col-span-2 lg:col-span-2">
            <Link to="/" className="text-3xl font-extrabold text-white tracking-tighter">EXPLAINED.</Link>
            <p className="mt-4 text-sm text-slate-400">Making complex topics simple.</p>
          </div>
          <div className="col-span-1">
            <h4 className="font-bold text-white mb-4">Sections</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/explainers" className="hover:text-white">Explainers</Link></li>
              <li><Link to="/government" className="hover:text-white">Government</Link></li>
              <li><Link to="/economy" className="hover:text-white">Economy</Link></li>
              <li><Link to="/concepts" className="hover:text-white">Key Concepts</Link></li>
            </ul>
          </div>
          <div className="col-span-1">
            <h4 className="font-bold text-white mb-4">About</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="#" className="hover:text-white">About Us</Link></li>
              <li><Link to="#" className="hover:text-white">Contact</Link></li>
              <li><Link to="#" className="hover:text-white">Jobs</Link></li>
              <li><Link to="#" className="hover:text-white">Ethics</Link></li>
            </ul>
          </div>
          <div className="col-span-2 lg:col-span-2">
            <h4 className="font-bold text-white mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-white">Twitter</a>
              <a href="#" className="text-slate-400 hover:text-white">Facebook</a>
              <a href="#" className="text-slate-400 hover:text-white">Instagram</a>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-700 pt-8 text-center text-sm text-slate-400">
          <p>&copy; 2025 Explained Media. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
