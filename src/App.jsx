
// src/App.js
import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import HomePage from './pages/HomePage';
import ExplainersPage from './pages/ExplainersPage';
import ArticlePage from './pages/ArticlePage';
import TimelineExplainerPage from './pages/TimelineExplainerPage';
import StartHerePage from './pages/StartHerePage';
import GovernmentPage from './pages/GovernmentPage';
import LoginPage from './pages/LoginPage';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminArticles from './pages/AdminArticles';
import AdminArticleForm from './pages/AdminArticleForm';
import AdminSeries from './pages/AdminSeries';
import AdminSeriesForm from './pages/AdminSeriesForm';
import AdminTimelines from './pages/AdminTimelines';
import AdminTimelineForm from './pages/AdminTimelineForm';
import AdminOrderManager from './pages/AdminOrderManager';
import AuthorLayout from './layouts/AuthorLayout';
import AuthorDashboard from './pages/AuthorDashboard'; // Import new page

// --- Layout Components ---
const PublicLayout = () => (
  <div className="bg-slate-50 min-h-screen font-sans flex flex-col">
    <Header />
    <main className="flex-grow"><Outlet /></main>
    <Footer />
  </div>
);

// --- Main App Router ---
export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Site Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/explainers" element={<ExplainersPage />} />
          <Route path="/article/:id" element={<ArticlePage />} />
          <Route path="/timeline/:id" element={<TimelineExplainerPage />} />
          <Route path="/start-here" element={<StartHerePage />} />
          <Route path="/government" element={<GovernmentPage />} />
          <Route path="/economy" element={<div className="text-center p-12"><h1>The Economy Explained</h1><p>Content coming soon!</p></div>} />
          <Route path="/concepts" element={<div className="text-center p-12"><h1>Key Concepts</h1><p>Content coming soon!</p></div>} />
        </Route>

        {/* Standalone Login Page */}
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />

        {/* Admin Section */}
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="articles" element={<AdminArticles />} />
          <Route path="articles/:id" element={<AdminArticleForm />} />
          <Route path="series" element={<AdminSeries />} />
          <Route path="series/:id" element={<AdminSeriesForm />} />
          <Route path="timelines" element={<AdminTimelines />} />
          <Route path="timelines/:id" element={<AdminTimelineForm />} />
          <Route path="ordering" element={<AdminOrderManager />} />
        </Route>

        {/* Author Section */}
        <Route path="/author" element={<ProtectedRoute><AuthorLayout /></ProtectedRoute>}>
          <Route index element={<AuthorDashboard />} />
          {/* Authors can reuse the AdminArticles and AdminArticleForm components */}
          <Route path="articles" element={<AdminArticles />} />
          <Route path="articles/:id" element={<AdminArticleForm />} />
        </Route>

        {/* Catch-all 404 Not Found Page */}
        <Route path="*" element={<div className="text-center p-12"><h1>404</h1><p>Page Not Found</p></div>} />
      </Routes>
    </AuthProvider>
  );
}
