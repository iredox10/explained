import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ExplainersPage from './pages/ExplainersPage';
import ArticlePage from './pages/ArticlePage';
import TimelineExplainerPage from './pages/TimelineExplainerPage';
import StartHerePage from './pages/StartHerePage';
import GovernmentPage from './pages/GovernmentPage';

// Placeholder pages for the remaining categories
const EconomyPage = () => <div className="text-center p-12"><h1>The Economy Explained</h1><p>Content coming soon!</p></div>;
const ConceptsPage = () => <div className="text-center p-12"><h1>Key Concepts</h1><p>Content coming soon!</p></div>;

export default function App() {
  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/explainers" element={<ExplainersPage />} />
          <Route path="/article/:id" element={<ArticlePage />} />
          <Route path="/timeline/:id" element={<TimelineExplainerPage />} />
          <Route path="/start-here" element={<StartHerePage />} />

          {/* Use the real GovernmentPage component */}
          <Route path="/government" element={<GovernmentPage />} />

          <Route path="/economy" element={<EconomyPage />} />
          <Route path="/concepts" element={<ConceptsPage />} />

          <Route path="*" element={
            <div className="text-center p-12">
              <h1 className="text-3xl font-bold">404</h1>
              <p className="text-lg mt-2">Page Not Found</p>
            </div>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
