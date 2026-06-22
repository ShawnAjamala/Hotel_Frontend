import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicDashboard from './pages/PublicDashboard';
import Auth from './pages/Auth';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicDashboard />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;