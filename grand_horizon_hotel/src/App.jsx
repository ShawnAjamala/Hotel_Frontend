import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicDashboard from './pages/PublicDashboard';
import Auth from './pages/Auth';
import GuestDashboard from './pages/GuestDashboard';
import StaffDashboard from './pages/StaffDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicDashboard />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
        <Route path="/guest/dashboard" element={<GuestDashboard />} />
        <Route path="/staff/dashboard" element={<StaffDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;