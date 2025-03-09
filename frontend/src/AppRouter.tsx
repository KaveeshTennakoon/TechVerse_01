import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import LandingPage from './LandingPage';

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/landing" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;