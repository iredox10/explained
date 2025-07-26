import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import ExplainersPage from './pages/ExplainersPage';
import ArticlePage from './pages/ArticlePage';
import TimelineExplainerPage from './pages/TimelineExplainerPage';
import StartHerePage from './pages/StartHerePage';
import GovernmentPage from './pages/GovernmentPage';
import AuthorPage from './pages/AuthorPage'; // Import new page
import LoginPage from './pages/LoginPage';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminArticles from './pages/AdminArticles';
import AdminArticleForm from './pages/AdminArticleForm';
import AdminSeries from './pages/AdminSeries';
import AdminSeriesForm from './pages/AdminSeriesForm';
import AdminTimelines from './pages/AdminTimelines';
import AdminTimelineForm from './pages/AdminTimelineForm';

// Public-facing layout component
const MainLayout = ({ children }) => (
  <div className="bg-slate-50 min-h-screen font-sans">
    <Header />
    <main>{children}</main>
    <Footer />
  </div>
);

// Main App Router
export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="articles" element={<AdminArticles />} />
          <Route path="articles/:id" element={<AdminArticleForm />} />
          <Route path="series" element={<AdminSeries />} />
          <Route path="series/:id" element={<AdminSeriesForm />} />
          <Route path="timelines" element={<AdminTimelines />} />
          <Route path="timelines/:id" element={<AdminTimelineForm />} />
        </Route>

        <Route
          path="/*"
          element={
            <MainLayout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/explainers" element={<ExplainersPage />} />
                <Route path="/article/:id" element={<ArticlePage />} />
                <Route path="/timeline/:id" element={<TimelineExplainerPage />} />
                <Route path="/start-here" element={<StartHerePage />} />
                <Route path="/government" element={<GovernmentPage />} />
                <Route path="/author/:authorSlug" element={<AuthorPage />} /> {/* New author route */}
                <Route path="/economy" element={<div className="text-center p-12"><h1>The Economy Explained</h1><p>Content coming soon!</p></div>} />
                <Route path="/concepts" element={<div className="text-center p-12"><h1>Key Concepts</h1><p>Content coming soon!</p></div>} />
                <Route path="*" element={
                  <div className="text-center p-12">
                    <h1 className="text-3xl font-bold">404</h1>
                    <p className="text-lg mt-2">Page Not Found</p>
                  </div>
                } />
              </Routes>
            </MainLayout>
          }
        />
      </Routes>
    </AuthProvider>
  );
}
