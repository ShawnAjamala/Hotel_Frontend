import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ChevronRight, Star, Users, MapPin, BedDouble, UtensilsCrossed, Presentation, PartyPopper, Hotel, Calendar, CheckCircle } from 'lucide-react';
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

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };
    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleServiceClick = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-stone-900 via-stone-800 to-amber-900 text-white min-h-[85vh] flex items-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200')] bg-cover bg-center opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/95 via-stone-900/80 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-8 py-20 w-full">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 backdrop-blur-sm border border-amber-400/30 px-5 py-2.5 rounded-full mb-8">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-amber-200 text-sm font-medium tracking-wider">Welcome to Grand Horizon</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              {hotelData?.hotel || 'Grand Horizon Hotel'}
              <span className="block text-amber-400 text-3xl md:text-4xl mt-2">Luxury Redefined</span>
            </h1>
            
            <p className="text-xl text-stone-300 mb-10 max-w-2xl leading-relaxed">
              {hotelData?.welcome || 'Experience world-class hospitality with stunning views, exquisite dining, and unforgettable moments.'}
            </p>
            
            <div className="flex flex-wrap gap-4">
              {isLoggedIn ? (
                <button 
                  onClick={() => {
                    const user = JSON.parse(localStorage.getItem('user') || '{}');
                    if (user.role === 'guest') navigate('/guest/dashboard');
                    else if (user.role === 'staff') navigate('/staff/dashboard');
                    else navigate('/admin/dashboard');
                  }} 
                  className="group bg-amber-600 hover:bg-amber-500 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 flex items-center gap-3 shadow-2xl shadow-amber-900/50 hover:shadow-amber-600/30 hover:-translate-y-0.5"
                >
                  <Hotel className="w-5 h-5" />
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <button 
                  onClick={() => navigate('/register')} 
                  className="group bg-amber-600 hover:bg-amber-500 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 flex items-center gap-3 shadow-2xl shadow-amber-900/50 hover:shadow-amber-600/30 hover:-translate-y-0.5"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-8 mt-12 pt-8 border-t border-white/10">
              <div className="flex items-center gap-2 text-stone-400">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-sm">Secure Booking</span>
              </div>
              <div className="flex items-center gap-2 text-stone-400">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-sm">Best Price Guarantee</span>
              </div>
              <div className="flex items-center gap-2 text-stone-400">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-sm">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto -mt-12 px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { 
              icon: Star, 
              title: 'Luxury Rooms', 
              desc: 'Elegant suites with stunning views and premium amenities',
              color: 'from-amber-50 to-orange-50',
              border: 'border-amber-200/50'
            },
            { 
              icon: Users, 
              title: 'Events & Dining', 
              desc: 'World-class restaurant and versatile event venues',
              color: 'from-emerald-50 to-teal-50',
              border: 'border-emerald-200/50'
            },
            { 
              icon: MapPin, 
              title: 'Prime Location', 
              desc: 'Heart of the city, minutes from everything that matters',
              color: 'from-blue-50 to-indigo-50',
              border: 'border-blue-200/50'
            },
          ].map((feature, i) => (
            <div 
              key={i} 
              className={`bg-gradient-to-br ${feature.color} border ${feature.border} rounded-2xl shadow-sm p-8 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group`}
            >
              <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center mb-5 shadow-sm group-hover:shadow-md transition">
                <feature.icon className="w-7 h-7 text-amber-700" />
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-2">{feature.title}</h3>
              <p className="text-stone-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className="max-w-7xl mx-auto py-24 px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-100 px-4 py-2 rounded-full mb-4">
            <Calendar className="w-4 h-4 text-amber-700" />
            <span className="text-sm font-medium text-amber-700">Our Services</span>
          </div>
          <h2 className="text-4xl font-bold text-stone-800 mb-4">Explore Our Offerings</h2>
          <p className="text-stone-500 max-w-2xl mx-auto">Discover the perfect space for your stay, dining, meetings, and celebrations</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { 
              icon: BedDouble, 
              title: 'Rooms', 
              desc: 'Browse our luxury rooms', 
              path: '/guest/rooms',
              color: 'from-blue-50 to-blue-100/50',
              iconBg: 'bg-blue-100',
              iconColor: 'text-blue-700'
            },
            { 
              icon: UtensilsCrossed, 
              title: 'Restaurant', 
              desc: 'Explore our dining options', 
              path: '/guest/restaurant',
              color: 'from-emerald-50 to-emerald-100/50',
              iconBg: 'bg-emerald-100',
              iconColor: 'text-emerald-700'
            },
            { 
              icon: Presentation, 
              title: 'Conference', 
              desc: 'View our meeting spaces', 
              path: '/guest/conference',
              color: 'from-purple-50 to-purple-100/50',
              iconBg: 'bg-purple-100',
              iconColor: 'text-purple-700'
            },
            { 
              icon: PartyPopper, 
              title: 'Events', 
              desc: 'Discover our event venues', 
              path: '/guest/events',
              color: 'from-rose-50 to-rose-100/50',
              iconBg: 'bg-rose-100',
              iconColor: 'text-rose-700'
            },
          ].map((service, i) => (
            <div
              key={i}
              onClick={() => handleServiceClick(service.path)}
              className={`group bg-gradient-to-br ${service.color} border border-stone-100 rounded-2xl p-8 text-center cursor-pointer hover:shadow-xl hover:-translate-y-2 transition-all duration-300`}
            >
              <div className={`${service.iconBg} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <service.icon className={`w-8 h-8 ${service.iconColor}`} />
              </div>
              <h3 className="text-lg font-bold text-stone-800 mb-1">{service.title}</h3>
              <p className="text-stone-500 text-sm">{service.desc}</p>
              <div className="mt-4 flex items-center justify-center gap-1 text-amber-600 font-medium text-sm opacity-0 group-hover:opacity-100 transition-all duration-300">
                Explore <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-gradient-to-r from-amber-800 to-amber-700 py-20 px-8">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200')] bg-cover bg-center opacity-10" />
        <div className="relative max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to Experience Luxury?</h2>
          <p className="text-amber-100/80 text-lg mb-8 max-w-2xl mx-auto">
            Book your stay today and discover why Grand Horizon is the preferred choice for discerning travelers.
          </p>
          {isLoggedIn ? (
            <button 
              onClick={() => {
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                if (user.role === 'guest') navigate('/guest/dashboard');
                else if (user.role === 'staff') navigate('/staff/dashboard');
                else navigate('/admin/dashboard');
              }}
              className="group bg-white text-amber-800 hover:bg-amber-50 px-10 py-4 rounded-full font-semibold text-lg transition-all duration-300 flex items-center gap-3 mx-auto shadow-2xl shadow-amber-900/30 hover:-translate-y-0.5"
            >
              <Hotel className="w-5 h-5" />
              Go to Dashboard
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <button 
              onClick={() => navigate('/register')}
              className="group bg-white text-amber-800 hover:bg-amber-50 px-10 py-4 rounded-full font-semibold text-lg transition-all duration-300 flex items-center gap-3 mx-auto shadow-2xl shadow-amber-900/30 hover:-translate-y-0.5"
            >
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PublicDashboard;