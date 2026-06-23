import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BedDouble, UtensilsCrossed, Presentation, PartyPopper, DollarSign, ArrowRight, Building2, Users, BookOpen, Star } from 'lucide-react';
import API from '../services/api'; // <-- Shared Axios instance pointing to Render backend
import StaffNavbar from '../components/StaffNavbar';
import Footer from '../components/Footer';

const StaffDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [analytics, setAnalytics] = useState(null);

  // ==================== CONNECT TO BACKEND: Staff Analytics ====================
  // GET https://final-capstone-2puq.onrender.com/api/staff/analytics/
  // Returns: total_revenue, rooms { total, booked_today, revenue }, tables, conference, venues
  useEffect(() => {
    const token = localStorage.getItem('token');
    API.get('/staff/analytics/', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setAnalytics(res.data))
      .catch(err => console.log('Analytics error:', err));
  }, []);

  // Default values if backend hasn't responded yet
  const data = analytics || {
    total_revenue: 0,
    rooms: { total: 0, booked_today: 0, revenue: 0 },
    tables: { total: 0, booked_today: 0, revenue: 0 },
    conference: { total: 0, booked_today: 0, revenue: 0 },
    venues: { total: 0, booked_this_month: 0, revenue: 0 },
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <StaffNavbar />

      {/* Brown Header Banner */}
      <div className="bg-amber-800 text-white">
        <div className="max-w-7xl mx-auto px-8 py-10">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5 text-amber-300" />
            <span className="text-amber-200 text-sm font-medium">Staff Panel</span>
          </div>
          <h1 className="text-4xl font-bold">Welcome back, {user.username}</h1>
          <p className="text-amber-100 mt-2 text-lg">Here's your hotel overview for today.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">

        {/* ==================== ANALYTICS CARDS (data from /api/staff/analytics/) ==================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Total Revenue */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-amber-100 w-12 h-12 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-amber-700" />
              </div>
            </div>
            <p className="text-stone-500 text-sm mb-1">Total Revenue</p>
            <p className="text-3xl font-bold text-stone-800">KES {data.total_revenue}</p>
          </div>

          {/* Total Bookings Today */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-amber-100 w-12 h-12 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-amber-700" />
              </div>
            </div>
            <p className="text-stone-500 text-sm mb-1">Total Bookings</p>
            <p className="text-3xl font-bold text-stone-800">
              {(data.rooms?.booked_today || 0) + (data.tables?.booked_today || 0) + (data.conference?.booked_today || 0) + (data.venues?.booked_this_month || 0)}
            </p>
          </div>

          {/* Total Resources */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-amber-100 w-12 h-12 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-amber-700" />
              </div>
            </div>
            <p className="text-stone-500 text-sm mb-1">Total Resources</p>
            <p className="text-3xl font-bold text-stone-800">
              {(data.rooms?.total || 0) + (data.tables?.total || 0) + (data.conference?.total || 0) + (data.venues?.total || 0)}
            </p>
          </div>

          {/* Active Services */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-amber-100 w-12 h-12 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-amber-700" />
              </div>
            </div>
            <p className="text-stone-500 text-sm mb-1">Active Services</p>
            <p className="text-3xl font-bold text-stone-800">4</p>
          </div>
        </div>

        {/* ==================== RESOURCE BREAKDOWN (from /api/staff/analytics/) ==================== */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-12">
          {[
            { icon: BedDouble, label: 'Rooms', total: data.rooms?.total || 0, booked: data.rooms?.booked_today || 0, revenue: data.rooms?.revenue || 0 },
            { icon: UtensilsCrossed, label: 'Tables', total: data.tables?.total || 0, booked: data.tables?.booked_today || 0, revenue: data.tables?.revenue || 0 },
            { icon: Presentation, label: 'Conference', total: data.conference?.total || 0, booked: data.conference?.booked_today || 0, revenue: data.conference?.revenue || 0 },
            { icon: PartyPopper, label: 'Venues', total: data.venues?.total || 0, booked: data.venues?.booked_this_month || 0, revenue: data.venues?.revenue || 0 },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-2xl border border-stone-200 p-6 hover:shadow-lg transition">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-amber-100 w-10 h-10 rounded-lg flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-amber-700" />
                </div>
                <span className="font-semibold text-stone-800">{item.label}</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-stone-500">Total</span><span className="font-semibold text-stone-800">{item.total}</span></div>
                <div className="flex justify-between"><span className="text-stone-500">Booked Today</span><span className="font-semibold text-stone-800">{item.booked}</span></div>
                <div className="flex justify-between"><span className="text-stone-500">Revenue</span><span className="font-semibold text-emerald-600">KES {item.revenue}</span></div>
              </div>
            </div>
          ))}
        </div>

        {/* ==================== QUICK ACTIONS (Frontend navigation only) ==================== */}
        <h2 className="text-2xl font-bold text-stone-800 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          {[
            { icon: BedDouble, title: 'Add Room', link: '/staff/rooms/create' },
            { icon: UtensilsCrossed, title: 'Add Table', link: '/staff/tables/create' },
            { icon: Presentation, title: 'Add Conference', link: '/staff/conference/create' },
            { icon: PartyPopper, title: 'Add Venue', link: '/staff/venues/create' },
          ].map((action, i) => (
            <button key={i} onClick={() => navigate(action.link)} className="flex items-center gap-4 bg-white border border-stone-200 rounded-2xl p-5 hover:border-amber-400 hover:shadow-lg transition group">
              <div className="bg-amber-100 w-12 h-12 rounded-xl flex items-center justify-center">
                <action.icon className="w-6 h-6 text-amber-700" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-stone-800">{action.title}</p>
                <div className="flex items-center gap-1 text-amber-600 text-sm">Create <ArrowRight className="w-3 h-3" /></div>
              </div>
            </button>
          ))}
        </div>

        {/* ==================== NAVIGATE TO: All Bookings ==================== */}
        <button onClick={() => navigate('/staff/bookings')} className="w-full bg-amber-800 text-white rounded-2xl p-8 hover:bg-amber-700 transition flex items-center justify-between group">
          <div className="text-left">
            <h3 className="text-2xl font-bold mb-1">View All Bookings</h3>
            <p className="text-amber-100">Manage room, table, conference, and venue reservations</p>
          </div>
          <div className="bg-white/10 w-14 h-14 rounded-full flex items-center justify-center group-hover:bg-white/20 transition">
            <ArrowRight className="w-7 h-7" />
          </div>
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default StaffDashboard;