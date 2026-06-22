import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BedDouble, UtensilsCrossed, Presentation, PartyPopper, ArrowRight, Sparkles, Star } from 'lucide-react';
import GuestNavbar from '../components/GuestNavbar';
import Footer from '../components/Footer';

const GuestDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const services = [
    { icon: BedDouble, title: 'Rooms', desc: 'Browse luxury rooms & suites', link: '/guest/rooms', color: 'from-blue-600 to-blue-800' },
    { icon: UtensilsCrossed, title: 'Dining', desc: 'Reserve a table', link: '/guest/restaurant', color: 'from-orange-600 to-red-700' },
    { icon: Presentation, title: 'Conference', desc: 'Book meeting spaces', link: '/guest/conference', color: 'from-purple-600 to-indigo-800' },
    { icon: PartyPopper, title: 'Events', desc: 'Plan your celebration', link: '/guest/events', color: 'from-pink-600 to-rose-800' },
  ];

  return (
    <div className="min-h-screen bg-stone-50">
      <GuestNavbar />

      {/* Welcome Hero */}
      <section className="bg-gradient-to-br from-amber-700 to-amber-900 text-white py-20 px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-amber-300" />
            <span className="text-amber-200 text-sm">Welcome back</span>
          </div>
          <h1 className="text-5xl font-bold mb-3">Hello, {user.username || 'Guest'}</h1>
          <p className="text-amber-100 text-lg">What would you like to book today?</p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-6xl mx-auto -mt-12 px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <div
              key={i}
              onClick={() => navigate(service.link)}
              className="bg-white rounded-2xl shadow-lg p-8 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className={`bg-gradient-to-br ${service.color} w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition`}>
                <service.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-stone-800 mb-1">{service.title}</h3>
              <p className="text-stone-500 text-sm mb-4">{service.desc}</p>
              <div className="flex items-center gap-2 text-amber-600 text-sm font-medium">
                Book Now <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Stats */}
      <section className="max-w-6xl mx-auto py-20 px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Star, title: 'Luxury Experience', desc: 'World-class amenities and service' },
            { icon: BedDouble, title: '50+ Rooms', desc: 'From singles to presidential suites' },
            { icon: Sparkles, title: 'Best Rates', desc: 'Guaranteed best prices online' },
          ].map((stat, i) => (
            <div key={i} className="text-center p-8">
              <div className="bg-amber-100 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-7 h-7 text-amber-700" />
              </div>
              <h3 className="font-bold text-stone-800 mb-1">{stat.title}</h3>
              <p className="text-stone-500 text-sm">{stat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default GuestDashboard;