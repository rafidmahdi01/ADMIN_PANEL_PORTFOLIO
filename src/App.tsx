import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PublicationsEditor from './pages/PublicationsEditor';
import AwardsEditor from './pages/AwardsEditor';
import PresentationsEditor from './pages/PresentationsEditor';
import ResearchProjectsEditor from './pages/ResearchProjectsEditor';
import SupervisionEditor from './pages/SupervisionEditor';
import EvaluationEditor from './pages/EvaluationEditor';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated
    const authStatus = localStorage.getItem('adminAuth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    localStorage.setItem('adminAuth', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard onLogout={handleLogout} />} />
        <Route path="/publications" element={<PublicationsEditor onLogout={handleLogout} />} />
        <Route path="/awards" element={<AwardsEditor onLogout={handleLogout} />} />
        <Route path="/presentations" element={<PresentationsEditor onLogout={handleLogout} />} />
        <Route path="/research-projects" element={<ResearchProjectsEditor onLogout={handleLogout} />} />
        <Route path="/supervision" element={<SupervisionEditor onLogout={handleLogout} />} />
        <Route path="/evaluation" element={<EvaluationEditor onLogout={handleLogout} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
