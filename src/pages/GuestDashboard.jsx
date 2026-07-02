import { useNavigate } from 'react-router-dom';
import { BedDouble, UtensilsCrossed, Presentation, PartyPopper, ArrowRight, Sparkles, Star, Crown } from 'lucide-react';
import GuestNavbar from '../components/GuestNavbar';
import Footer from '../components/Footer';

const GuestDashboard = () => {
  const navigate = useNavigate();
  // Get user info stored from login/register
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Service cards — each navigates to a booking page
  const services = [
    { 
      icon: BedDouble, 
      title: 'Rooms & Suites', 
      desc: 'Luxury accommodations with stunning views',
      link: '/guest/rooms',
      bg: 'bg-gradient-to-br from-emerald-900 to-teal-700',
      iconBg: 'bg-emerald-500/20',
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600'
    },
    { 
      icon: UtensilsCrossed, 
      title: 'Fine Dining', 
      desc: 'World-class culinary experiences',
      link: '/guest/restaurant',
      bg: 'bg-gradient-to-br from-amber-900 to-orange-800',
      iconBg: 'bg-amber-500/20',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600'
    },
    { 
      icon: Presentation, 
      title: 'Conference', 
      desc: 'Modern spaces for business & events',
      link: '/guest/conference',
      bg: 'bg-gradient-to-br from-slate-800 to-indigo-900',
      iconBg: 'bg-indigo-500/20',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600'
    },
    { 
      icon: PartyPopper, 
      title: 'Events & Venues', 
      desc: 'Celebrate life\'s special moments',
      link: '/guest/events',
      bg: 'bg-gradient-to-br from-rose-900 to-pink-800',
      iconBg: 'bg-pink-500/20',
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600'
    },
  ];

  return (
    <div className="min-h-screen bg-stone-100 font-sans">
      {/* ==================== NAVBAR (Frontend component) ==================== */}
      <GuestNavbar />

      {/* ==================== WELCOME HERO (Reads user from localStorage) ==================== */}
      <section className="relative bg-stone-900 text-white py-24 px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200')] bg-cover bg-center opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/90 to-transparent" />
        <div className="relative max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 backdrop-blur-sm border border-amber-500/30 px-4 py-2 rounded-full mb-6">
            <Crown className="w-4 h-4 text-amber-400" />
            <span className="text-amber-300 text-sm tracking-wider uppercase">Welcome Back</span>
          </div>
          <h1 className="text-6xl font-serif font-bold mb-4 tracking-tight">
            Good Evening, <span className="text-amber-400">{user.username || 'Guest'}</span>
          </h1>
          <p className="text-xl text-stone-300 max-w-xl leading-relaxed">
            Your gateway to exceptional hospitality. What experience shall we curate for you today?
          </p>
        </div>
      </section>

      {/* ==================== SERVICES (Navigates to booking pages — no backend call) ==================== */}
      <section className="max-w-7xl mx-auto -mt-16 px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <div
              key={i}
              onClick={() => navigate(service.link)}
              className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer"
            >
              <div className="h-36 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                />
                <div className={`absolute inset-0 ${service.bg} opacity-40 group-hover:opacity-30 transition`} />
              </div>
              
              <div className="relative p-6">
                <div className={`${service.iconBg} w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition`}>
                  <service.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-stone-800 mb-1 font-serif">{service.title}</h3>
                <p className="text-stone-500 text-sm mb-4">{service.desc}</p>
                <div className="flex items-center gap-2 text-amber-700 text-sm font-medium group-hover:gap-3 transition-all">
                  Explore <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== FEATURES (Static content — no backend call) ==================== */}
      <section className="max-w-7xl mx-auto py-24 px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold text-stone-800 mb-4">The Grand Horizon Experience</h2>
          <p className="text-stone-500 max-w-xl mx-auto">Where every detail is crafted for your comfort and pleasure</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Star, title: '5-Star Service', desc: 'Attentive staff dedicated to exceeding your expectations' },
            { icon: Crown, title: 'Premium Amenities', desc: 'World-class facilities from spa to infinity pool' },
            { icon: Sparkles, title: 'Curated Experiences', desc: 'Bespoke dining, tours, and cultural immersions' },
          ].map((feature, i) => (
            <div key={i} className="text-center p-10 bg-white rounded-3xl shadow-sm hover:shadow-md transition">
              <div className="bg-amber-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <feature.icon className="w-8 h-8 text-amber-700" />
              </div>
              <h3 className="font-serif font-bold text-stone-800 text-lg mb-2">{feature.title}</h3>
              <p className="text-stone-500 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== FOOTER (Frontend component) ==================== */}
      <Footer />
    </div>
  );
};

export default GuestDashboard;