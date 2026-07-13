import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicDashboard from "./pages/PublicDashboard";
import Auth from "./pages/Auth";
import GuestDashboard from "./pages/GuestDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ChangePassword from './pages/ChangePassword';
import AdminUsers from "./pages/AdminUsers";
import AdminApprovals from "./pages/AdminApprovals";
import AdminAnalytics from './pages/AdminAnalytics';
import AdminBookings from "./pages/AdminBookings";
import AdminManageStaffPasswords from './pages/AdminManageStaffPasswords';
import AdminCreateStaff from "./pages/AdminCreateStaff";
import StaffRooms from "./pages/StaffRooms";
import StaffTables from "./pages/StaffTables";
import StaffConference from "./pages/StaffConference";
import StaffVenues from "./pages/StaffVenues";
import StaffBookings from "./pages/StaffBookings";
import StaffCancellationRequests from "./pages/StaffCancellationRequests";
import GuestRooms from "./pages/GuestRooms";
import GuestBookRoom from "./pages/GuestBookRoom";
import GuestTables from "./pages/GuestTables";
import GuestBookTable from "./pages/GuestBookTable";
import GuestConference from "./pages/GuestConference";
import GuestBookConference from "./pages/GuestBookConference";
import GuestVenues from "./pages/GuestVenues";
import GuestBookVenue from "./pages/GuestBookVenue";
import GuestBookings from "./pages/GuestBookings";
import GuestCancellation from "./pages/GuestCancellation";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<PublicDashboard />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />

        {/* Dashboards */}
        <Route path="/guest/dashboard" element={<GuestDashboard />} />
        <Route path="/staff/dashboard" element={<StaffDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Admin */}
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/staff/pending" element={<AdminApprovals />} />
        <Route path="/admin/bookings" element={<AdminBookings />} />
        <Route path="/admin/staff/create" element={<AdminCreateStaff />} />
        <Route path="/admin/staff/passwords" element={<AdminManageStaffPasswords />} />
        <Route path="/admin/refund-analytics" element={<AdminAnalytics />} />

        {/* Staff Management */}
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/staff/rooms/create" element={<StaffRooms />} />
        <Route path="/staff/tables/create" element={<StaffTables />} />
        <Route path="/staff/conference/create" element={<StaffConference />} />
        <Route path="/staff/venues/create" element={<StaffVenues />} />
        <Route path="/staff/bookings" element={<StaffBookings />} />
        <Route path="/staff/cancellations" element={<StaffCancellationRequests />} />

        {/* Guest Browse & Book */}
        <Route path="/guest/rooms" element={<GuestRooms />} />
        <Route path="/guest/rooms/book/:roomId" element={<GuestBookRoom />} />
        <Route path="/guest/restaurant" element={<GuestTables />} />
        <Route path="/guest/tables/book/:tableId" element={<GuestBookTable />} />
        <Route path="/guest/conference" element={<GuestConference />} />
        <Route path="/guest/conference/book/:roomId" element={<GuestBookConference />} />
        <Route path="/guest/events" element={<GuestVenues />} />
        <Route path="/guest/venues/book/:venueId" element={<GuestBookVenue />} />

        {/* Guest Bookings & Profile */}
        <Route path="/guest/bookings" element={<GuestBookings />} />
        <Route path="/guest/cancellation" element={<GuestCancellation />} />
        <Route path="/guest/profile" element={<Profile />} />
        <Route path="/staff/profile" element={<Profile />} />
        <Route path="/admin/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;