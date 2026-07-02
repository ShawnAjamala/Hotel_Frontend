import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BedDouble, UtensilsCrossed, Presentation, PartyPopper, 
  ArrowRight, Calendar, Building2 
} from 'lucide-react';
import API from '../services/api';
import StaffNavbar from '../components/StaffNavbar';
import Footer from '../components/Footer';

const StaffDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [stats, setStats] = useState({
    rooms: 0,
    tables: 0,
    conference: 0,
    venues: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      // Fetch all resources in parallel
      const [roomsRes, tablesRes, conferenceRes, venuesRes] = await Promise.all([
        API.get('/rooms/', { headers }),
        API.get('/tables/', { headers }),
        API.get('/conference/', { headers }),
        API.get('/venues/', { headers })
      ]);

      setStats({
        rooms: roomsRes.data.length || 0,
        tables: tablesRes.data.length || 0,
        conference: conferenceRes.data.length || 0,
        venues: venuesRes.data.length || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <StaffNavbar />

      <section className="relative bg-gradient-to-br from-amber-900 to-amber-800 text-white py-14 px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/90 to-transparent" />
        <div className="relative max-w-7xl mx-auto">
          <div>
            <h1 className="text-4xl font-bold">Welcome back, {user.username}</h1>
            <p className="text-amber-100/80 mt-2 text-lg">Manage your hotel resources and bookings.</p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-8 -mt-6 relative z-10 pb-16">
        
        {/* Resource Count Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-10">
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 hover:shadow-md transition">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center">
                <BedDouble className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-stone-500 text-sm">Total Rooms</p>
                <p className="text-2xl font-bold text-stone-800">
                  {loading ? '...' : stats.rooms}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 hover:shadow-md transition">
            <div className="flex items-center gap-4">
              <div className="bg-emerald-100 w-12 h-12 rounded-xl flex items-center justify-center">
                <UtensilsCrossed className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-stone-500 text-sm">Total Tables</p>
                <p className="text-2xl font-bold text-stone-800">
                  {loading ? '...' : stats.tables}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 hover:shadow-md transition">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 w-12 h-12 rounded-xl flex items-center justify-center">
                <Presentation className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-stone-500 text-sm">Total Conference</p>
                <p className="text-2xl font-bold text-stone-800">
                  {loading ? '...' : stats.conference}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 hover:shadow-md transition">
            <div className="flex items-center gap-4">
              <div className="bg-rose-100 w-12 h-12 rounded-xl flex items-center justify-center">
                <PartyPopper className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <p className="text-stone-500 text-sm">Total Venues</p>
                <p className="text-2xl font-bold text-stone-800">
                  {loading ? '...' : stats.venues}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links - Manage Resources */}
        <h2 className="text-2xl font-bold text-stone-800 mb-6">Manage Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          {[
            { icon: BedDouble, title: 'Rooms', link: '/staff/rooms/create', color: 'from-blue-50 to-blue-100', desc: 'Add & manage rooms' },
            { icon: UtensilsCrossed, title: 'Tables', link: '/staff/tables/create', color: 'from-emerald-50 to-emerald-100', desc: 'Add & manage tables' },
            { icon: Presentation, title: 'Conference', link: '/staff/conference/create', color: 'from-purple-50 to-purple-100', desc: 'Add & manage conference' },
            { icon: PartyPopper, title: 'Venues', link: '/staff/venues/create', color: 'from-rose-50 to-rose-100', desc: 'Add & manage venues' },
          ].map((action, i) => (
            <button
              key={i}
              onClick={() => navigate(action.link)}
              className={`flex flex-col items-start gap-2 bg-gradient-to-br ${action.color} border border-stone-100 shadow-sm rounded-2xl p-5 hover:shadow-md transition group`}
            >
              <div className="flex items-center justify-between w-full">
                <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center shadow-sm">
                  <action.icon className="w-6 h-6 text-amber-700" />
                </div>
                <ArrowRight className="w-5 h-5 text-amber-600 opacity-0 group-hover:opacity-100 transition" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-stone-800 text-lg">{action.title}</p>
                <p className="text-stone-500 text-sm">{action.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* View All Bookings */}
        <button
          onClick={() => navigate('/staff/bookings')}
          className="w-full bg-amber-800 text-white rounded-2xl p-8 hover:bg-amber-700 transition flex items-center justify-between group shadow-lg"
        >
          <div className="flex items-center gap-4">
            <Calendar className="w-8 h-8 text-amber-300" />
            <div className="text-left">
              <h3 className="text-2xl font-bold mb-1">View All Bookings</h3>
              <p className="text-amber-100">Manage room, table, conference, and venue reservations</p>
            </div>
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