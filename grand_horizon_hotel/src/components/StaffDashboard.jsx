import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BedDouble, UtensilsCrossed, Presentation, PartyPopper, TrendingUp, CalendarCheck, DollarSign, ArrowRight, Crown } from 'lucide-react';
import API from '../services/api';
import StaffNavbar from '../components/StaffNavbar';
import Footer from '../components/Footer';

const StaffDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    API.get('/staff/analytics/')
      .then(res => setAnalytics(res.data))
      .catch(() => {});
  }, []);

  const quickActions = [
    { icon: BedDouble, title: 'Add Room', desc: 'Create a new room listing', link: '/staff/rooms/create', color: 'from-emerald-600 to-teal-700' },
    { icon: UtensilsCrossed, title: 'Add Table', desc: 'Add restaurant table', link: '/staff/tables/create', color: 'from-amber-600 to-orange-700' },
    { icon: Presentation, title: 'Add Conference', desc: 'Create meeting space', link: '/staff/conference/create', color: 'from-indigo-600 to-purple-700' },
    { icon: PartyPopper, title: 'Add Venue', desc: 'Add event venue', link: '/staff/venues/create', color: 'from-pink-600 to-rose-700' },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      <StaffNavbar />

      {/* Header */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 px-4 py-2 rounded-full mb-4">
            <Crown className="w-4 h-4 text-amber-400" />
            <span className="text-amber-300 text-sm">Staff Panel</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">Welcome back, {user.username || 'Staff'}</h1>
          <p className="text-slate-400">Manage hotel resources and bookings</p>
        </div>
      </section>

      {/* Stats */}
      {analytics && (
        <section className="max-w-7xl mx-auto -mt-10 px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: TrendingUp, label: 'Total Revenue', value: `KES ${analytics.total_revenue || 0}`, color: 'bg-emerald-500' },
              { icon: CalendarCheck, label: 'Rooms Booked Today', value: analytics.rooms?.booked_today || 0, color: 'bg-blue-500' },
              { icon: BedDouble, label: 'Total Rooms', value: analytics.rooms?.total || 0, color: 'bg-amber-500' },
              { icon: DollarSign, label: 'Services', value: '4 Active', color: 'bg-purple-500' },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4">
                <div className={`${stat.color} w-12 h-12 rounded-xl flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-stone-500 text-xs">{stat.label}</p>
                  <p className="text-xl font-bold text-stone-800">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Quick Actions */}
      <section className="max-w-7xl mx-auto py-16 px-8">
        <h2 className="text-2xl font-bold text-stone-800 mb-8">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {quickActions.map((action, i) => (
            <div
              key={i}
              onClick={() => navigate(action.link)}
              className="bg-white rounded-2xl shadow-sm p-8 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group border border-stone-100"
            >
              <div className={`bg-gradient-to-br ${action.color} w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition`}>
                <action.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-stone-800 mb-1">{action.title}</h3>
              <p className="text-stone-500 text-sm mb-4">{action.desc}</p>
              <div className="flex items-center gap-2 text-slate-600 text-sm font-medium group-hover:gap-3 transition-all">
                Go <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* View All Bookings */}
      <section className="max-w-7xl mx-auto pb-20 px-8">
        <div
          onClick={() => navigate('/staff/bookings')}
          className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-3xl p-10 cursor-pointer hover:from-amber-500 hover:to-amber-600 transition shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">View All Bookings</h3>
              <p className="text-amber-100">Manage room, table, conference, and venue reservations</p>
            </div>
            <ArrowRight className="w-10 h-10 text-white" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default StaffDashboard;