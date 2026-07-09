import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BedDouble, UtensilsCrossed, Presentation, PartyPopper, 
  ArrowRight, Calendar, DollarSign, TrendingUp, TrendingDown, 
  Clock, RefreshCw, Users, Building2, AlertCircle, CheckCircle,
  Wallet, CreditCard, Receipt, Bell
} from 'lucide-react';
import API from '../services/api';
import StaffNavbar from '../components/StaffNavbar';
import Footer from '../components/Footer';

const StaffDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [stats, setStats] = useState({
    total_gross_revenue: 0,
    total_refunds: 0,
    total_net_revenue: 0,
    pending_cancellations: 0,
    pending_refunds: 0,
    rooms: { total: 0, booked_today: 0, net_revenue: 0 },
    tables: { total: 0, booked_today: 0, net_revenue: 0 },
    conference: { total: 0, booked_today: 0, net_revenue: 0 },
    venues: { total: 0, booked_today: 0, net_revenue: 0 }
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const analyticsRes = await API.get('/staff/analytics/', { headers });
      setStats(analyticsRes.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <StaffNavbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900 text-white py-16 px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/90 to-transparent" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-400/5 rounded-full blur-2xl" />
        <div className="relative max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-amber-500/20 p-2 rounded-xl backdrop-blur-sm">
                  <Building2 className="w-5 h-5 text-amber-300" />
                </div>
                <span className="text-amber-200 text-sm font-medium tracking-wider uppercase">Staff Panel</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight">Welcome back, {user.username}</h1>
              <p className="text-amber-100/80 mt-2 text-lg">Here's your hotel performance overview</p>
            </div>
            <button
              onClick={fetchStats}
              disabled={loading}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 border border-white/10 hover:border-white/20"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-8 -mt-8 relative z-10 pb-16">
        
        {/* Revenue Overview Cards - 4 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {/* Gross Revenue */}
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
          
          {/* Total Refunds */}
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
          
          {/* Net Revenue */}
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
          
          {/* Pending Actions */}
          <div className="group bg-gradient-to-br from-stone-100/90 to-stone-200/50 rounded-2xl border border-stone-200/50 shadow-sm p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-stone-600/15 w-12 h-12 rounded-xl flex items-center justify-center group-hover:bg-stone-600/25 transition">
                <Bell className="w-6 h-6 text-stone-700" />
              </div>
              <span className="text-xs font-medium text-stone-700 bg-stone-200/50 px-3 py-1 rounded-full">Pending</span>
            </div>
            <p className="text-stone-600 text-sm font-medium mb-1">Pending Actions</p>
            {loading ? (
              <div className="animate-pulse w-32 h-8 bg-stone-200/30 rounded"></div>
            ) : (
              <div>
                <p className="text-2xl font-bold text-stone-800">
                  {stats.pending_cancellations + stats.pending_refunds}
                </p>
                <p className="text-xs text-stone-500 mt-0.5">
                  {stats.pending_cancellations} cancellations · {stats.pending_refunds} refunds
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Resource Overview Cards - 4 Cards */}
        <h2 className="text-2xl font-bold text-stone-800 mb-6 flex items-center gap-3">
          <div className="h-8 w-1.5 bg-gradient-to-b from-amber-600 to-amber-400 rounded-full"></div>
          Resource Overview
          {!loading && (
            <span className="text-sm font-normal text-stone-400 ml-2">
              {stats.rooms.total + stats.tables.total + stats.conference.total + stats.venues.total} total resources
            </span>
          )}
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {/* Rooms Card */}
          <div className="group bg-gradient-to-br from-blue-50/90 to-blue-100/50 rounded-2xl border border-blue-200/50 shadow-sm p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-blue-600/15 w-10 h-10 rounded-xl flex items-center justify-center group-hover:bg-blue-600/25 transition">
                <BedDouble className="w-5 h-5 text-blue-700" />
              </div>
              {loading ? (
                <div className="animate-pulse w-12 h-4 bg-stone-200/50 rounded"></div>
              ) : (
                <span className="text-xs font-medium text-stone-500 bg-white/60 px-2.5 py-1 rounded-full">
                  {stats.rooms.booked_today} booked today
                </span>
              )}
            </div>
            <p className="text-stone-600 text-sm font-medium">Rooms</p>
            {loading ? (
              <div className="animate-pulse w-16 h-7 bg-stone-200/50 rounded mt-1"></div>
            ) : (
              <div className="flex items-end gap-3 mt-1">
                <p className="text-2xl font-bold text-stone-800">{stats.rooms.total}</p>
                {stats.rooms.net_revenue > 0 && (
                  <p className="text-xs text-emerald-600 font-medium bg-emerald-200/50 px-2 py-0.5 rounded-full">
                    KES {stats.rooms.net_revenue.toLocaleString()}
                  </p>
                )}
              </div>
            )}
          </div>
          
          {/* Tables Card */}
          <div className="group bg-gradient-to-br from-emerald-50/90 to-emerald-100/50 rounded-2xl border border-emerald-200/50 shadow-sm p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-emerald-600/15 w-10 h-10 rounded-xl flex items-center justify-center group-hover:bg-emerald-600/25 transition">
                <UtensilsCrossed className="w-5 h-5 text-emerald-700" />
              </div>
              {loading ? (
                <div className="animate-pulse w-12 h-4 bg-stone-200/50 rounded"></div>
              ) : (
                <span className="text-xs font-medium text-stone-500 bg-white/60 px-2.5 py-1 rounded-full">
                  {stats.tables.booked_today} booked today
                </span>
              )}
            </div>
            <p className="text-stone-600 text-sm font-medium">Tables</p>
            {loading ? (
              <div className="animate-pulse w-16 h-7 bg-stone-200/50 rounded mt-1"></div>
            ) : (
              <div className="flex items-end gap-3 mt-1">
                <p className="text-2xl font-bold text-stone-800">{stats.tables.total}</p>
                {stats.tables.net_revenue > 0 && (
                  <p className="text-xs text-emerald-600 font-medium bg-emerald-200/50 px-2 py-0.5 rounded-full">
                    KES {stats.tables.net_revenue.toLocaleString()}
                  </p>
                )}
              </div>
            )}
          </div>
          
          {/* Conference Card */}
          <div className="group bg-gradient-to-br from-purple-50/90 to-purple-100/50 rounded-2xl border border-purple-200/50 shadow-sm p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-purple-600/15 w-10 h-10 rounded-xl flex items-center justify-center group-hover:bg-purple-600/25 transition">
                <Presentation className="w-5 h-5 text-purple-700" />
              </div>
              {loading ? (
                <div className="animate-pulse w-12 h-4 bg-stone-200/50 rounded"></div>
              ) : (
                <span className="text-xs font-medium text-stone-500 bg-white/60 px-2.5 py-1 rounded-full">
                  {stats.conference.booked_today} booked today
                </span>
              )}
            </div>
            <p className="text-stone-600 text-sm font-medium">Conference</p>
            {loading ? (
              <div className="animate-pulse w-16 h-7 bg-stone-200/50 rounded mt-1"></div>
            ) : (
              <div className="flex items-end gap-3 mt-1">
                <p className="text-2xl font-bold text-stone-800">{stats.conference.total}</p>
                {stats.conference.net_revenue > 0 && (
                  <p className="text-xs text-emerald-600 font-medium bg-emerald-200/50 px-2 py-0.5 rounded-full">
                    KES {stats.conference.net_revenue.toLocaleString()}
                  </p>
                )}
              </div>
            )}
          </div>
          
          {/* Venues Card */}
          <div className="group bg-gradient-to-br from-rose-50/90 to-rose-100/50 rounded-2xl border border-rose-200/50 shadow-sm p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-rose-600/15 w-10 h-10 rounded-xl flex items-center justify-center group-hover:bg-rose-600/25 transition">
                <PartyPopper className="w-5 h-5 text-rose-700" />
              </div>
              {loading ? (
                <div className="animate-pulse w-12 h-4 bg-stone-200/50 rounded"></div>
              ) : (
                <span className="text-xs font-medium text-stone-500 bg-white/60 px-2.5 py-1 rounded-full">
                  {stats.venues.booked_today} booked today
                </span>
              )}
            </div>
            <p className="text-stone-600 text-sm font-medium">Venues</p>
            {loading ? (
              <div className="animate-pulse w-16 h-7 bg-stone-200/50 rounded mt-1"></div>
            ) : (
              <div className="flex items-end gap-3 mt-1">
                <p className="text-2xl font-bold text-stone-800">{stats.venues.total}</p>
                {stats.venues.net_revenue > 0 && (
                  <p className="text-xs text-emerald-600 font-medium bg-emerald-200/50 px-2 py-0.5 rounded-full">
                    KES {stats.venues.net_revenue.toLocaleString()}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <h2 className="text-2xl font-bold text-stone-800 mb-6 flex items-center gap-3">
          <div className="h-8 w-1.5 bg-gradient-to-b from-amber-600 to-amber-400 rounded-full"></div>
          Quick Actions
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { icon: BedDouble, title: 'Add Room', link: '/staff/rooms/create', color: 'from-blue-50 to-blue-100/50', border: 'border-blue-200/50', iconColor: 'text-blue-700', hoverColor: 'hover:border-blue-300' },
            { icon: UtensilsCrossed, title: 'Add Table', link: '/staff/tables/create', color: 'from-emerald-50 to-emerald-100/50', border: 'border-emerald-200/50', iconColor: 'text-emerald-700', hoverColor: 'hover:border-emerald-300' },
            { icon: Presentation, title: 'Add Conference', link: '/staff/conference/create', color: 'from-purple-50 to-purple-100/50', border: 'border-purple-200/50', iconColor: 'text-purple-700', hoverColor: 'hover:border-purple-300' },
            { icon: PartyPopper, title: 'Add Venue', link: '/staff/venues/create', color: 'from-rose-50 to-rose-100/50', border: 'border-rose-200/50', iconColor: 'text-rose-700', hoverColor: 'hover:border-rose-300' },
          ].map((action, i) => (
            <button
              key={i}
              onClick={() => navigate(action.link)}
              className={`group flex items-center gap-4 bg-gradient-to-br ${action.color} border ${action.border} ${action.hoverColor} rounded-2xl p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
            >
              <div className="bg-white/80 w-12 h-12 rounded-xl flex items-center justify-center shadow-sm group-hover:bg-white transition">
                <action.icon className={`w-6 h-6 ${action.iconColor}`} />
              </div>
              <div className="text-left flex-1">
                <p className="font-semibold text-stone-800 text-sm">{action.title}</p>
                <div className="flex items-center gap-1 text-amber-600 text-xs font-medium">
                  Create <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* View All Bookings */}
        <button
          onClick={() => navigate('/staff/bookings')}
          className="w-full bg-gradient-to-r from-amber-800 to-amber-700 text-white rounded-2xl p-7 hover:from-amber-700 hover:to-amber-600 transition-all duration-300 flex items-center justify-between group shadow-lg hover:shadow-xl"
        >
          <div className="flex items-center gap-5">
            <div className="bg-white/10 p-3 rounded-xl group-hover:bg-white/20 transition">
              <Calendar className="w-7 h-7 text-amber-200" />
            </div>
            <div className="text-left">
              <h3 className="text-2xl font-bold">View All Bookings</h3>
              <p className="text-amber-100/80 text-sm">Manage room, table, conference, and venue reservations</p>
            </div>
          </div>
          <div className="bg-white/10 w-14 h-14 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-all duration-300 group-hover:scale-105">
            <ArrowRight className="w-7 h-7" />
          </div>
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default StaffDashboard;