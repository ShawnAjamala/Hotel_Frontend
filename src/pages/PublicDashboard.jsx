import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ChevronRight, Star, Users, MapPin, BedDouble, UtensilsCrossed, Presentation, PartyPopper } from 'lucide-react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PublicDashboard = () => {
  const navigate = useNavigate();
  const [hotelData, setHotelData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    axios.get('https://final-capstone-2puq.onrender.com/')
      .then(res => setHotelData(res.data))
      .catch(() => {});
  }, []);

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };
    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  // PUBLIC ACCESS - anyone can view these pages
  const handleServiceClick = (path) => {
    navigate(path); // No login check - pages are open to everyone
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-stone-900 via-stone-800 to-amber-900 text-white py-32 px-8">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200')] bg-cover bg-center opacity-20" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-8">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-amber-200 text-sm">Welcome to luxury</span>
          </div>
          <h1 className="text-7xl font-bold mb-6 tracking-tight leading-tight">
            {hotelData?.hotel || 'Grand Horizon Hotel'}
          </h1>
          <p className="text-xl text-stone-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            {hotelData?.welcome || 'Discover luxury and comfort in the heart of the city.'}
          </p>
          <div className="flex gap-4 justify-center">
            {isLoggedIn ? (
              <button onClick={() => {
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                if (user.role === 'guest') navigate('/guest/dashboard');
                else if (user.role === 'staff') navigate('/staff/dashboard');
                else navigate('/admin/dashboard');
              }} className="bg-amber-600 text-white px-10 py-4 rounded-full font-semibold text-lg hover:bg-amber-500 transition flex items-center gap-2 shadow-xl shadow-amber-900/50">
                My Dashboard <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button onClick={() => navigate('/register')} className="bg-amber-600 text-white px-10 py-4 rounded-full font-semibold text-lg hover:bg-amber-500 transition flex items-center gap-2 shadow-xl shadow-amber-900/50">
                Start Your Journey <ArrowRight className="w-5 h-5" />
              </button>
            )}
            {!isLoggedIn && (
              <button onClick={() => navigate('/login')} className="border-2 border-white/50 text-white px-10 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition">
                Member Login
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto -mt-16 px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Star, title: 'Luxury Rooms', desc: 'Elegant suites with stunning views' },
            { icon: Users, title: 'Events & Dining', desc: 'World-class restaurant and venues' },
            { icon: MapPin, title: 'Prime Location', desc: 'Heart of the city, minutes from everything' },
          ].map((feature, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="bg-amber-100 w-14 h-14 rounded-xl flex items-center justify-center mb-5">
                <feature.icon className="w-7 h-7 text-amber-700" />
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-2">{feature.title}</h3>
              <p className="text-stone-500">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services - PUBLIC ACCESS CARDS */}
      <section className="max-w-6xl mx-auto py-24 px-8">
        <h2 className="text-4xl font-bold text-stone-800 text-center mb-16">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { icon: BedDouble, title: 'Rooms', desc: 'Browse our luxury rooms', path: '/guest/rooms' },
            { icon: UtensilsCrossed, title: 'Restaurant', desc: 'Explore our dining options', path: '/guest/restaurant' },
            { icon: Presentation, title: 'Conference', desc: 'View our meeting spaces', path: '/guest/conference' },
            { icon: PartyPopper, title: 'Events', desc: 'Discover our event venues', path: '/guest/events' },
          ].map((service, i) => (
            <div
              key={i}
              onClick={() => handleServiceClick(service.path)}
              className="bg-white border border-stone-200 rounded-2xl p-8 text-center cursor-pointer hover:border-amber-400 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <service.icon className="w-12 h-12 text-amber-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-stone-800 mb-1">{service.title}</h3>
              <p className="text-stone-500 text-sm">{service.desc}</p>
              <ChevronRight className="w-5 h-5 text-amber-600 mx-auto mt-4" />
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PublicDashboard;