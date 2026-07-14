import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, TrendingDown, Wallet, Bell, Users, 
  BedDouble, UtensilsCrossed, Presentation, PartyPopper,
  DollarSign, Calendar, Clock, Receipt, UserCheck,
  ArrowRight, BarChart3, Landmark, Building2, 
  CreditCard, XCircle, CheckCircle
} from 'lucide-react';
import API from '../services/api';
import AdminNavbar from '../components/AdminNavbar';
import Footer from '../components/Footer';

const AdminAnalytics = () => {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        const res = await API.get('/admin/analytics/', { headers });
        setAnalytics(res.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalytics();
  }, []);

  // Format currency
  const formatCurrency = (amount) => {
    return `KES ${(amount || 0).toLocaleString()}`;
  };

  const stats = analytics || {
    total_gross_revenue: 0,
    total_refunds: 0,
    total_net_revenue: 0,
    pending_cancellations: 0,
    pending_refunds: 0,
    refunds_by_staff: [],
    rooms: { total: 0, booked_today: 0 },
    tables: { total: 0, booked_today: 0 },
    conference: { total: 0, booked_today: 0 },
    venues: { total: 0, booked_today: 0 },
    users: { guests: 0, staff: 0, pending: 0, admins: 0 }
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
                <BarChart3 className="w-5 h-5 text-amber-300" />
              </div>
              <span className="text-amber-200 text-sm font-medium tracking-wider uppercase">Analytics</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight">Revenue & Refund Analytics</h1>
            <p className="text-amber-100/80 mt-2 text-lg">Complete financial overview of hotel operations</p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-8 -mt-8 relative z-10 pb-16">

        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin w-12 h-12 border-4 border-amber-700 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-stone-500">Loading analytics data...</p>
          </div>
        ) : (
          <>
            {/* Revenue Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              {/* Gross Revenue */}
              <div className="group bg-gradient-to-br from-emerald-50/90 to-emerald-100/50 rounded-2xl border border-emerald-200/50 shadow-sm p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-emerald-600/15 w-12 h-12 rounded-xl flex items-center justify-center group-hover:bg-emerald-600/25 transition">
                    <TrendingUp className="w-6 h-6 text-emerald-700" />
                  </div>
                  <span className="text-xs font-medium text-emerald-700 bg-emerald-200/50 px-3 py-1 rounded-full">All Time</span>
                </div>
                <p className="text-stone-600 text-sm font-medium mb-1">Gross Revenue</p>
                <p className="text-2xl font-bold text-stone-800">{formatCurrency(stats.total_gross_revenue)}</p>
              </div>

              {/* Total Refunds */}
              <div className="group bg-gradient-to-br from-rose-50/90 to-rose-100/50 rounded-2xl border border-rose-200/50 shadow-sm p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-rose-600/15 w-12 h-12 rounded-xl flex items-center justify-center group-hover:bg-rose-600/25 transition">
                    <Receipt className="w-6 h-6 text-rose-700" />
                  </div>
                  <span className="text-xs font-medium text-rose-700 bg-rose-200/50 px-3 py-1 rounded-full">Refunds</span>
                </div>
                <p className="text-stone-600 text-sm font-medium mb-1">Total Refunds</p>
                <p className="text-2xl font-bold text-rose-700">{formatCurrency(stats.total_refunds)}</p>
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
                <p className="text-2xl font-bold text-amber-800">{formatCurrency(stats.total_net_revenue)}</p>
              </div>

              {/* Pending Actions */}
              <div className="group bg-gradient-to-br from-purple-50/90 to-purple-100/50 rounded-2xl border border-purple-200/50 shadow-sm p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-purple-600/15 w-12 h-12 rounded-xl flex items-center justify-center group-hover:bg-purple-600/25 transition">
                    <Bell className="w-6 h-6 text-purple-700" />
                  </div>
                  <span className="text-xs font-medium text-purple-700 bg-purple-200/50 px-3 py-1 rounded-full">Pending</span>
                </div>
                <p className="text-stone-600 text-sm font-medium mb-1">Pending Actions</p>
                <p className="text-2xl font-bold text-purple-700">
                  {stats.pending_cancellations + stats.pending_refunds}
                </p>
                <p className="text-xs text-stone-500 mt-1">
                  {stats.pending_cancellations} cancellations · {stats.pending_refunds} refunds
                </p>
              </div>
            </div>

            {/* Refunds by Staff - Detailed */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-stone-800 mb-6 flex items-center gap-3">
                <div className="h-8 w-1.5 bg-gradient-to-b from-amber-600 to-amber-400 rounded-full"></div>
                Refunds Processed by Staff
                <span className="text-sm font-normal text-stone-400 ml-2">
                  {stats.refunds_by_staff?.length || 0} staff members
                </span>
              </h2>

              <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                {stats.refunds_by_staff && stats.refunds_by_staff.length > 0 ? (
                  <div className="divide-y divide-stone-100">
                    {stats.refunds_by_staff.map((staff, index) => (
                      <div key={index} className="flex items-center justify-between px-6 py-4 hover:bg-stone-50 transition">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            index === 0 ? 'bg-amber-100' : 'bg-stone-100'
                          }`}>
                            {index === 0 ? (
                              <span className="text-sm font-bold text-amber-700">🏆</span>
                            ) : (
                              <UserCheck className="w-5 h-5 text-stone-500" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-stone-800">
                              {staff.processed_by__username || 'Unknown Staff'}
                              {index === 0 && (
                                <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Top</span>
                              )}
                            </p>
                            <p className="text-xs text-stone-400">
                              {staff.refund_count} refund{staff.refund_count !== 1 ? 's' : ''} processed
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-rose-600">{formatCurrency(staff.total_refunds)}</p>
                          <p className="text-xs text-stone-400">Total refunded</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Receipt className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                    <p className="text-stone-500">No refunds have been processed yet.</p>
                    <p className="text-xs text-stone-400 mt-1">Refunds will appear here once approved and processed.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Refund Status Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4 hover:shadow-lg transition">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-100 w-10 h-10 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-400">Pending Refunds</p>
                    <p className="text-xl font-bold text-amber-600">{stats.pending_refunds || 0}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4 hover:shadow-lg transition">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-100 w-10 h-10 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-400">Completed Refunds</p>
                    <p className="text-xl font-bold text-emerald-600">
                      {stats.refunds_by_staff?.reduce((sum, s) => sum + s.refund_count, 0) || 0}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4 hover:shadow-lg transition">
                <div className="flex items-center gap-3">
                  <div className="bg-rose-100 w-10 h-10 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-rose-600" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-400">Total Refund Amount</p>
                    <p className="text-xl font-bold text-rose-600">{formatCurrency(stats.total_refunds)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Resource Overview */}
            <h2 className="text-2xl font-bold text-stone-800 mb-6 flex items-center gap-3">
              <div className="h-8 w-1.5 bg-gradient-to-b from-amber-600 to-amber-400 rounded-full"></div>
              Resource Overview
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
              {[
                { icon: BedDouble, label: 'Rooms', total: stats.rooms.total, booked: stats.rooms.booked_today, color: 'from-blue-50 to-blue-100/50', border: 'border-blue-200/50', iconColor: 'text-blue-700', iconBg: 'bg-blue-600/20' },
                { icon: UtensilsCrossed, label: 'Tables', total: stats.tables.total, booked: stats.tables.booked_today, color: 'from-emerald-50 to-emerald-100/50', border: 'border-emerald-200/50', iconColor: 'text-emerald-700', iconBg: 'bg-emerald-600/20' },
                { icon: Presentation, label: 'Conference', total: stats.conference.total, booked: stats.conference.booked_today, color: 'from-purple-50 to-purple-100/50', border: 'border-purple-200/50', iconColor: 'text-purple-700', iconBg: 'bg-purple-600/20' },
                { icon: PartyPopper, label: 'Venues', total: stats.venues.total, booked: stats.venues.booked_today, color: 'from-rose-50 to-rose-100/50', border: 'border-rose-200/50', iconColor: 'text-rose-700', iconBg: 'bg-rose-600/20' },
              ].map((item, i) => (
                <div key={i} className={`bg-gradient-to-br ${item.color} rounded-2xl border ${item.border} shadow-sm p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`${item.iconBg} w-10 h-10 rounded-xl flex items-center justify-center`}>
                      <item.icon className={`w-5 h-5 ${item.iconColor}`} />
                    </div>
                    <span className="text-xs font-medium text-stone-500 bg-white/60 px-2.5 py-1 rounded-full">
                      {item.booked} booked today
                    </span>
                  </div>
                  <p className="text-stone-600 text-sm font-medium">{item.label}</p>
                  <p className="text-2xl font-bold text-stone-800">{item.total}</p>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <h2 className="text-2xl font-bold text-stone-800 mb-6 flex items-center gap-3">
              <div className="h-8 w-1.5 bg-gradient-to-b from-amber-600 to-amber-400 rounded-full"></div>
              Quick Actions
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Users, title: 'Manage Users', link: '/admin/users', color: 'from-blue-50 to-blue-100/50', border: 'border-blue-200/50', iconColor: 'text-blue-700' },
                { icon: UserCheck, title: 'Approve Staff', link: '/admin/staff/pending', color: 'from-emerald-50 to-emerald-100/50', border: 'border-emerald-200/50', iconColor: 'text-emerald-700' },
                { icon: Receipt, title: 'View Refunds', link: '/admin/bookings', color: 'from-rose-50 to-rose-100/50', border: 'border-rose-200/50', iconColor: 'text-rose-700' },
                { icon: Calendar, title: 'All Bookings', link: '/admin/bookings', color: 'from-purple-50 to-purple-100/50', border: 'border-purple-200/50', iconColor: 'text-purple-700' },
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
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default AdminAnalytics;