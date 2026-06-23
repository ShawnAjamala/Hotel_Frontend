import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserCheck, UserX, Shield, ArrowRight, Star, TrendingUp, DollarSign, BookOpen } from 'lucide-react';
import API from '../services/api';
import AdminNavbar from '../components/AdminNavbar';
import Footer from '../components/Footer';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState({ guests: 0, staff: 0, pending: 0, admins: 0 });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    // ==================== CONNECT TO BACKEND: Admin Analytics ====================
    // GET /api/admin/analytics/ — returns total revenue, bookings, monthly trends
    API.get('/admin/analytics/', { headers })
      .then(res => setAnalytics(res.data))
      .catch(() => {});

    // ==================== CONNECT TO BACKEND: List All Users ====================
    // GET /api/admin/users/ — returns all users with roles and approval status
    API.get('/admin/users/', { headers })
      .then(res => {
        const all = res.data.users || [];
        setUsers({
          guests: all.filter(u => u.role === 'guest').length,
          staff: all.filter(u => u.role === 'staff' && u.is_approved).length,
          pending: all.filter(u => u.role === 'staff' && !u.is_approved).length,
          admins: all.filter(u => u.role === 'admin').length,
        });
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <AdminNavbar />

      {/* Brown Header */}
      <div className="bg-amber-900 text-white">
        <div className="max-w-7xl mx-auto px-8 py-10">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-amber-300" />
            <span className="text-amber-200 text-sm font-medium">Admin Panel</span>
          </div>
          <h1 className="text-4xl font-bold">Welcome back, {user.username}</h1>
          <p className="text-amber-100 mt-2 text-lg">Manage users and oversee hotel operations.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* ==================== USER STATS (from /api/admin/users/) ==================== */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-emerald-100 w-12 h-12 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-emerald-700" />
              </div>
              <span className="text-xs text-emerald-600 font-medium">Active</span>
            </div>
            <p className="text-stone-500 text-sm mb-1">Total Guests</p>
            <p className="text-3xl font-bold text-stone-800">{users.guests}</p>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-blue-700" />
              </div>
              <span className="text-xs text-blue-600 font-medium">Approved</span>
            </div>
            <p className="text-stone-500 text-sm mb-1">Staff Members</p>
            <p className="text-3xl font-bold text-stone-800">{users.staff}</p>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-amber-100 w-12 h-12 rounded-xl flex items-center justify-center">
                <UserX className="w-6 h-6 text-amber-700" />
              </div>
              <span className="text-xs text-amber-600 font-medium">Pending</span>
            </div>
            <p className="text-stone-500 text-sm mb-1">Pending Approval</p>
            <p className="text-3xl font-bold text-stone-800">{users.pending}</p>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 w-12 h-12 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-purple-700" />
              </div>
            </div>
            <p className="text-stone-500 text-sm mb-1">Administrators</p>
            <p className="text-3xl font-bold text-stone-800">{users.admins}</p>
          </div>
        </div>

        {/* ==================== REVENUE + BOOKINGS (from /api/admin/analytics/) ==================== */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white rounded-2xl border border-stone-200 p-6 hover:shadow-lg transition">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-amber-100 w-12 h-12 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-amber-700" />
                </div>
                <TrendingUp className="w-5 h-5 text-emerald-500" />
              </div>
              <p className="text-stone-500 text-sm mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-stone-800">KES {analytics.total_revenue || 0}</p>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 p-6 hover:shadow-lg transition">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-amber-100 w-12 h-12 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-amber-700" />
                </div>
              </div>
              <p className="text-stone-500 text-sm mb-1">Total Bookings</p>
              <p className="text-3xl font-bold text-stone-800">
                {(analytics.rooms?.booked_today || 0) + (analytics.tables?.booked_today || 0) + (analytics.conference?.booked_today || 0) + (analytics.venues?.booked_this_month || 0)}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 p-6 hover:shadow-lg transition">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-amber-100 w-12 h-12 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-amber-700" />
                </div>
              </div>
              <p className="text-stone-500 text-sm mb-1">Total Users</p>
              <p className="text-3xl font-bold text-stone-800">
                {users.guests + users.staff + users.pending + users.admins}
              </p>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <h2 className="text-2xl font-bold text-stone-800 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {/* ==================== NAVIGATES TO: /admin/users ==================== */}
          <button onClick={() => navigate('/admin/users')} className="flex items-center gap-4 bg-white border border-stone-200 rounded-2xl p-5 hover:border-amber-400 hover:shadow-lg transition group">
            <div className="bg-amber-100 w-12 h-12 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-amber-700" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-stone-800">Manage Users</p>
              <div className="flex items-center gap-1 text-amber-600 text-sm">View all <ArrowRight className="w-3 h-3" /></div>
            </div>
          </button>
          {/* ==================== NAVIGATES TO: /admin/staff/pending ==================== */}
          <button onClick={() => navigate('/admin/staff/pending')} className="flex items-center gap-4 bg-white border border-stone-200 rounded-2xl p-5 hover:border-amber-400 hover:shadow-lg transition group">
            <div className="bg-amber-100 w-12 h-12 rounded-xl flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-amber-700" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-stone-800">Approve Staff</p>
              <div className="flex items-center gap-1 text-amber-600 text-sm">Review <ArrowRight className="w-3 h-3" /></div>
            </div>
          </button>
          {/* ==================== NAVIGATES TO: /admin/bookings ==================== */}
          <button onClick={() => navigate('/admin/bookings')} className="flex items-center gap-4 bg-white border border-stone-200 rounded-2xl p-5 hover:border-amber-400 hover:shadow-lg transition group">
            <div className="bg-amber-100 w-12 h-12 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-amber-700" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-stone-800">All Bookings</p>
              <div className="flex items-center gap-1 text-amber-600 text-sm">View <ArrowRight className="w-3 h-3" /></div>
            </div>
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;