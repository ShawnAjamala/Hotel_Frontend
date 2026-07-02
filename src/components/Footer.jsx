import { useNavigate } from 'react-router-dom';
import { Hotel, BedDouble, UtensilsCrossed, Presentation, PartyPopper, Calendar, User, Users, UserCheck, Mail, Phone, MapPin, Shield } from 'lucide-react';

const Footer = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.role || 'guest';
  const token = localStorage.getItem('token');

  const isGuest = role === 'guest';
  const isStaff = role === 'staff';
  const isAdmin = role === 'admin';

  // Dynamic dashboard link
  const dashboardLink = isStaff ? '/staff/dashboard' : isAdmin ? '/admin/dashboard' : '/guest/dashboard';

  return (
    <footer className="bg-gradient-to-br from-amber-900 to-amber-800 text-white">
      <div className="max-w-7xl mx-auto px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 p-2 rounded-xl">
                <Hotel className="w-6 h-6 text-amber-200" />
              </div>
              <h2 className="text-xl font-bold tracking-tight">Grand Horizon</h2>
            </div>
            <p className="text-amber-200/60 text-sm leading-relaxed">
              Where luxury meets comfort. Experience world-class hospitality in the heart of the city.
            </p>
          </div>

          {/* Services — shown to everyone */}
          <div>
            <h3 className="font-semibold text-amber-200 mb-4 text-sm uppercase tracking-wider">Services</h3>
            <ul className="space-y-3">
              {isGuest && (
                <>
                  <li><button onClick={() => navigate('/guest/rooms')} className="flex items-center gap-2 text-amber-100/60 hover:text-white text-sm transition"><BedDouble className="w-4 h-4" /> Rooms & Suites</button></li>
                  <li><button onClick={() => navigate('/guest/restaurant')} className="flex items-center gap-2 text-amber-100/60 hover:text-white text-sm transition"><UtensilsCrossed className="w-4 h-4" /> Fine Dining</button></li>
                  <li><button onClick={() => navigate('/guest/conference')} className="flex items-center gap-2 text-amber-100/60 hover:text-white text-sm transition"><Presentation className="w-4 h-4" /> Conference</button></li>
                  <li><button onClick={() => navigate('/guest/events')} className="flex items-center gap-2 text-amber-100/60 hover:text-white text-sm transition"><PartyPopper className="w-4 h-4" /> Events</button></li>
                </>
              )}
              {isStaff && (
                <>
                  <li><button onClick={() => navigate('/staff/rooms/create')} className="flex items-center gap-2 text-amber-100/60 hover:text-white text-sm transition"><BedDouble className="w-4 h-4" /> Manage Rooms</button></li>
                  <li><button onClick={() => navigate('/staff/tables/create')} className="flex items-center gap-2 text-amber-100/60 hover:text-white text-sm transition"><UtensilsCrossed className="w-4 h-4" /> Manage Tables</button></li>
                  <li><button onClick={() => navigate('/staff/conference/create')} className="flex items-center gap-2 text-amber-100/60 hover:text-white text-sm transition"><Presentation className="w-4 h-4" /> Conference Rooms</button></li>
                  <li><button onClick={() => navigate('/staff/venues/create')} className="flex items-center gap-2 text-amber-100/60 hover:text-white text-sm transition"><PartyPopper className="w-4 h-4" /> Event Venues</button></li>
                </>
              )}
              {isAdmin && (
                <>
                  <li><button onClick={() => navigate('/admin/users')} className="flex items-center gap-2 text-amber-100/60 hover:text-white text-sm transition"><Users className="w-4 h-4" /> Manage Users</button></li>
                  <li><button onClick={() => navigate('/admin/staff/pending')} className="flex items-center gap-2 text-amber-100/60 hover:text-white text-sm transition"><UserCheck className="w-4 h-4" /> Approvals</button></li>
                  <li><button onClick={() => navigate('/admin/bookings')} className="flex items-center gap-2 text-amber-100/60 hover:text-white text-sm transition"><Calendar className="w-4 h-4" /> All Bookings</button></li>
                </>
              )}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-amber-200 mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-3">
              {token ? (
                <>
                  <li><button onClick={() => navigate(dashboardLink)} className="flex items-center gap-2 text-amber-100/60 hover:text-white text-sm transition"><User className="w-4 h-4" /> Dashboard</button></li>
                  {isGuest && (
                    <>
                      <li><button onClick={() => navigate('/guest/bookings')} className="flex items-center gap-2 text-amber-100/60 hover:text-white text-sm transition"><Calendar className="w-4 h-4" /> My Bookings</button></li>
                      <li><button onClick={() => navigate('/guest/profile')} className="flex items-center gap-2 text-amber-100/60 hover:text-white text-sm transition"><User className="w-4 h-4" /> Profile</button></li>
                    </>
                  )}
                  {(isStaff || isAdmin) && (
                    <>
                      <li><button onClick={() => navigate(isStaff ? '/staff/bookings' : '/admin/bookings')} className="flex items-center gap-2 text-amber-100/60 hover:text-white text-sm transition"><Calendar className="w-4 h-4" /> Bookings</button></li>
                      <li><button onClick={() => navigate(isStaff ? '/staff/profile' : '/admin/profile')} className="flex items-center gap-2 text-amber-100/60 hover:text-white text-sm transition"><Shield className="w-4 h-4" /> Profile</button></li>
                    </>
                  )}
                </>
              ) : (
                <>
                  <li><button onClick={() => navigate('/login')} className="flex items-center gap-2 text-amber-100/60 hover:text-white text-sm transition"><User className="w-4 h-4" /> Sign In</button></li>
                  <li><button onClick={() => navigate('/register')} className="flex items-center gap-2 text-amber-100/60 hover:text-white text-sm transition"><User className="w-4 h-4" /> Register</button></li>
                </>
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-amber-200 mb-4 text-sm uppercase tracking-wider">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-amber-100/60 text-sm">
                <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>123 Grand Avenue, Nairobi</span>
              </li>
              <li className="flex items-center gap-3 text-amber-100/60 text-sm">
                <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>+254 700 000 000</span>
              </li>
              <li className="flex items-center gap-3 text-amber-100/60 text-sm">
                <Mail className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>info@grandhorizon.com</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-amber-700/50">
        <div className="max-w-7xl mx-auto px-8 py-5 text-center">
          <p className="text-amber-200/40 text-sm">© 2026 Grand Horizon Hotel. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;