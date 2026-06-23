import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicDashboard from "./pages/PublicDashboard";
import Auth from "./pages/Auth";
import GuestDashboard from "./pages/GuestDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminApprovals from "./pages/AdminApprovals";
import AdminBookings from "./pages/AdminBookings";
import StaffRooms from "./pages/StaffRooms";
import GuestRooms from "./pages/GuestRooms";
import GuestBookRoom from "./pages/GuestBookRoom";
import GuestBookings from './pages/GuestBookings';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicDashboard />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
        <Route path="/guest/dashboard" element={<GuestDashboard />} />
        <Route path="/staff/dashboard" element={<StaffDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/staff/pending" element={<AdminApprovals />} />
        <Route path="/admin/bookings" element={<AdminBookings />} />
        <Route path="/staff/rooms/create" element={<StaffRooms />} />
        <Route path="/guest/rooms" element={<GuestRooms />} />
        <Route path="/guest/rooms/book/:roomId" element={<GuestBookRoom />} />
        <Route path="/guest/bookings" element={<GuestBookings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
