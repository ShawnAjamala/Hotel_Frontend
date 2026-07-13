import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, UserCheck, UserX, Shield, ArrowRight, Star, 
  TrendingUp, DollarSign, BookOpen, Calendar, Clock,
  Wallet, TrendingDown, Receipt, Bell, RefreshCw
} from 'lucide-react';
import API from '../services/api';
import AdminNavbar from '../components/AdminNavbar';
import Footer from '../components/Footer';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState({ guests: 0, staff: 0, pending: 0, admins: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      API.get('/admin/analytics/', { headers }),
      API.get('/admin/users/', { headers })
    ])
      .then(([analyticsRes, usersRes]) => {
        setAnalytics(analyticsRes.data);
        const all = usersRes.data.users || [];
        setUsers({
          guests: all.filter(u => u.role === 'guest').length,
          staff: all.filter(u => u.role === 'staff' && u.is_approved).length,
          pending: all.filter(u => u.role === 'staff' && !u.is_approved).length,
          admins: all.filter(u => u.role === 'admin').length,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = analytics || {
    total_gross_revenue: 0,
    total_refunds: 0,
    total_net_revenue: 0,
    pending_cancellations: 0,
    pending_refunds: 0,
    rooms: { total: 0, booked_today: 0, net_revenue: 0 },
    tables: { total: 0, booked_today: 0, net_revenue: 0 },
    conference: { total: 0, booked_today: 0, net_revenue: 0 },
    venues: { total: 0, booked_today: 0, net_revenue: 0 }
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <AdminNavbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900 text-white py-16 px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/90 to-transparent" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-amber-500/20 p-2 rounded-xl backdrop-blur-sm">
                <Shield className="w-5 h-5 text-amber-300" />
              </div>
              <span className="text-amber-200 text-sm font-medium tracking-wider uppercase">Admin Panel</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight">Welcome back, {user.username}</h1>
            <p className="text-amber-100/80 mt-2 text-lg">Manage users and oversee hotel operations.</p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-8 -mt-8 relative z-10 pb-16">
        
        {/* Revenue Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="group bg-gradient-to-br from-amber-50/90 to-amber-100/50 rounded-2xl border border-amber-200/50 shadow-sm p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-amber-600/15 w-12 h-12 rounded-xl flex items-center justify-center group-hover:bg-amber-600/25 transition">
                <TrendingUp className="w-6 h-6 text-amber-700" />
              </div>
              <span className="text-xs font-medium text-amber-700 bg-amber-200/50 px-3 py-1 rounded-full">Gross</span>
            </div>
            <p className="text-stone-600 text-sm font-medium mb-1">Gross Revenue</p>
            {loading ? (
              <div className="animate-pulse w-32 h-8 bg-amber-200/30 rounded"></div>
            ) : (
              <p className="text-2xl font-bold text-stone-800">KES {stats.total_gross_revenue.toLocaleString()}</p>
            )}
          </div>
          
          <div className="group bg-gradient-to-br from-rose-50/90 to-rose-100/50 rounded-2xl border border-rose-200/50 shadow-sm p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-rose-600/15 w-12 h-12 rounded-xl flex items-center justify-center group-hover:bg-rose-600/25 transition">
                <TrendingDown className="w-6 h-6 text-rose-700" />
              </div>
              <span className="text-xs font-medium text-rose-700 bg-rose-200/50 px-3 py-1 rounded-full">Refunds</span>
            </div>
            <p className="text-stone-600 text-sm font-medium mb-1">Total Refunds</p>
            {loading ? (
              <div className="animate-pulse w-32 h-8 bg-rose-200/30 rounded"></div>
            ) : (
              <p className="text-2xl font-bold text-rose-700">KES {stats.total_refunds.toLocaleString()}</p>
            )}
          </div>
          
          <div className="group bg-gradient-to-br from-amber-100/70 to-amber-200/40 rounded-2xl border border-amber-300/40 shadow-sm p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-amber-700/15 w-12 h-12 rounded-xl flex items-center justify-center group-hover:bg-amber-700/25 transition">
                <Wallet className="w-6 h-6 text-amber-800" />
              </div>
              <span className="text-xs font-medium text-amber-800 bg-amber-300/50 px-3 py-1 rounded-full">Net</span>
            </div>
            <p className="text-stone-600 text-sm font-medium mb-1">Net Revenue</p>
            {loading ? (
              <div className="animate-pulse w-32 h-8 bg-amber-200/30 rounded"></div>
            ) : (
              <p className="text-2xl font-bold text-amber-800">KES {stats.total_net_revenue.toLocaleString()}</p>
            )}
          </div>
          
          <div className="group bg-gradient-to-br from-purple-50/90 to-purple-100/50 rounded-2xl border border-purple-200/50 shadow-sm p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-purple-600/15 w-12 h-12 rounded-xl flex items-center justify-center group-hover:bg-purple-600/25 transition">
                <Bell className="w-6 h-6 text-purple-700" />
              </div>
              <span className="text-xs font-medium text-purple-700 bg-purple-200/50 px-3 py-1 rounded-full">Pending</span>
            </div>
            <p className="text-stone-600 text-sm font-medium mb-1">Pending Actions</p>
            {loading ? (
              <div className="animate-pulse w-32 h-8 bg-purple-200/30 rounded"></div>
            ) : (
              <div>
                <p className="text-2xl font-bold text-purple-700">
                  {stats.pending_cancellations + stats.pending_refunds}
                </p>
                <p className="text-xs text-stone-500 mt-0.5">
                  {stats.pending_cancellations} cancellations · {stats.pending_refunds} refunds
                </p>
              </div>
            )}
          </div>
        </div>

        {/* User Stats */}
        <h2 className="text-2xl font-bold text-stone-800 mb-6 flex items-center gap-3">
          <div className="h-8 w-1.5 bg-gradient-to-b from-amber-600 to-amber-400 rounded-full"></div>
          User Overview
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <div className="group bg-gradient-to-br from-emerald-50/90 to-emerald-100/50 rounded-2xl border border-emerald-200/50 shadow-sm p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-emerald-600/15 w-10 h-10 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-emerald-700" />
              </div>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-200/50 px-2.5 py-1 rounded-full">Active</span>
            </div>
            <p className="text-stone-600 text-sm font-medium">Guests</p>
            <p className="text-2xl font-bold text-stone-800">{users.guests}</p>
          </div>

          <div className="group bg-gradient-to-br from-blue-50/90 to-blue-100/50 rounded-2xl border border-blue-200/50 shadow-sm p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-600/15 w-10 h-10 rounded-xl flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-blue-700" />
              </div>
              <span className="text-xs font-medium text-blue-600 bg-blue-200/50 px-2.5 py-1 rounded-full">Approved</span>
            </div>
            <p className="text-stone-600 text-sm font-medium">Staff</p>
            <p className="text-2xl font-bold text-stone-800">{users.staff}</p>
          </div>

          <div className="group bg-gradient-to-br from-amber-50/90 to-amber-100/50 rounded-2xl border border-amber-200/50 shadow-sm p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-amber-600/15 w-10 h-10 rounded-xl flex items-center justify-center">
                <UserX className="w-5 h-5 text-amber-700" />
              </div>
              <span className="text-xs font-medium text-amber-600 bg-amber-200/50 px-2.5 py-1 rounded-full">Pending</span>
            </div>
            <p className="text-stone-600 text-sm font-medium">Pending Approval</p>
            <p className="text-2xl font-bold text-amber-700">{users.pending}</p>
          </div>

          <div className="group bg-gradient-to-br from-purple-50/90 to-purple-100/50 rounded-2xl border border-purple-200/50 shadow-sm p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-purple-600/15 w-10 h-10 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-700" />
              </div>
            </div>
            <p className="text-stone-600 text-sm font-medium">Admins</p>
            <p className="text-2xl font-bold text-stone-800">{users.admins}</p>
          </div>
        </div>

        {/* Resource Overview Cards */}
        <h2 className="text-2xl font-bold text-stone-800 mb-6 flex items-center gap-3">
          <div className="h-8 w-1.5 bg-gradient-to-b from-amber-600 to-amber-400 rounded-full"></div>
          Resource Overview
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {[
            { icon: 'BedDouble', label: 'Rooms', total: stats.rooms.total, booked: stats.rooms.booked_today, revenue: stats.rooms.net_revenue, color: 'from-blue-50 to-blue-100/50', border: 'border-blue-200/50', iconColor: 'text-blue-700', iconBg: 'bg-blue-600/20' },
            { icon: 'UtensilsCrossed', label: 'Tables', total: stats.tables.total, booked: stats.tables.booked_today, revenue: stats.tables.net_revenue, color: 'from-emerald-50 to-emerald-100/50', border: 'border-emerald-200/50', iconColor: 'text-emerald-700', iconBg: 'bg-emerald-600/20' },
            { icon: 'Presentation', label: 'Conference', total: stats.conference.total, booked: stats.conference.booked_today, revenue: stats.conference.net_revenue, color: 'from-purple-50 to-purple-100/50', border: 'border-purple-200/50', iconColor: 'text-purple-700', iconBg: 'bg-purple-600/20' },
            { icon: 'PartyPopper', label: 'Venues', total: stats.venues.total, booked: stats.venues.booked_today, revenue: stats.venues.net_revenue, color: 'from-rose-50 to-rose-100/50', border: 'border-rose-200/50', iconColor: 'text-rose-700', iconBg: 'bg-rose-600/20' },
          ].map((item, i) => {
            const Icon = require('lucide-react')[item.icon];
            return (
              <div key={i} className={`bg-gradient-to-br ${item.color} rounded-2xl border ${item.border} shadow-sm p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
                <div className="flex items-center justify-between mb-3">
                  <div className={`${item.iconBg} w-10 h-10 rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${item.iconColor}`} />
                  </div>
                  {!loading && (
                    <span className="text-xs font-medium text-stone-500 bg-white/60 px-2.5 py-1 rounded-full">
                      {item.booked} booked today
                    </span>
                  )}
                </div>
                <p className="text-stone-600 text-sm font-medium">{item.label}</p>
                <div className="flex items-end gap-3 mt-1">
                  <p className="text-2xl font-bold text-stone-800">{item.total}</p>
                  {item.revenue > 0 && (
                    <p className="text-xs text-emerald-600 font-medium bg-emerald-200/50 px-2 py-0.5 rounded-full">
                      KES {item.revenue.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <h2 className="text-2xl font-bold text-stone-800 mb-6 flex items-center gap-3">
          <div className="h-8 w-1.5 bg-gradient-to-b from-amber-600 to-amber-400 rounded-full"></div>
          Quick Actions
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { icon: Users, title: 'Manage Users', link: '/admin/users', color: 'from-blue-50 to-blue-100/50', border: 'border-blue-200/50', iconColor: 'text-blue-700' },
            { icon: UserCheck, title: 'Approve Staff', link: '/admin/staff/pending', color: 'from-emerald-50 to-emerald-100/50', border: 'border-emerald-200/50', iconColor: 'text-emerald-700' },
            { icon: UserPlus, title: 'Create Staff', link: '/admin/staff/create', color: 'from-amber-50 to-amber-100/50', border: 'border-amber-200/50', iconColor: 'text-amber-700' },
            { icon: BookOpen, title: 'All Bookings', link: '/admin/bookings', color: 'from-purple-50 to-purple-100/50', border: 'border-purple-200/50', iconColor: 'text-purple-700' },
          ].map((action, i) => (
            <button
              key={i}
              onClick={() => navigate(action.link)}
              className={`group flex items-center gap-4 bg-gradient-to-br ${action.color} border ${action.border} rounded-2xl p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
            >
              <div className="bg-white/80 w-12 h-12 rounded-xl flex items-center justify-center shadow-sm group-hover:bg-white transition">
                <action.icon className={`w-6 h-6 ${action.iconColor}`} />
              </div>
              <div className="text-left flex-1">
                <p className="font-semibold text-stone-800 text-sm">{action.title}</p>
                <div className="flex items-center gap-1 text-amber-600 text-xs font-medium">
                  Go <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;