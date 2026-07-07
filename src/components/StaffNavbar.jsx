import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Hotel, Calendar, User, LogOut, BedDouble, UtensilsCrossed, 
  Presentation, PartyPopper, Menu, X, LayoutDashboard, 
  AlertCircle, CreditCard 
} from 'lucide-react';

const StaffNavbar = () => {
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navLinks = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/staff/dashboard' },
    { icon: BedDouble, label: 'Rooms', path: '/staff/rooms/create' },
    { icon: UtensilsCrossed, label: 'Tables', path: '/staff/tables/create' },
    { icon: Presentation, label: 'Conference', path: '/staff/conference/create' },
    { icon: PartyPopper, label: 'Venues', path: '/staff/venues/create' },
    { icon: Calendar, label: 'Bookings', path: '/staff/bookings' },
    { icon: AlertCircle, label: 'Cancellations', path: '/staff/cancellations' },
  ];

  // Check if link is active (for highlighting)
  const isActive = (path) => {
    return window.location.pathname === path;
  };

  return (
    <>
      <nav className="flex items-center justify-between px-4 sm:px-8 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-stone-100 shadow-sm">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/staff/dashboard')}>
          <div className="bg-amber-700 p-2 rounded-xl hover:bg-amber-800 transition">
            <Hotel className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-stone-800 hidden sm:block">Grand Horizon</h1>
          <h1 className="text-xl font-bold text-stone-800 sm:hidden">GH</h1>
          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium hidden sm:inline-block">Staff</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-5">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            const isBookings = link.label === 'Bookings';
            const isCancellations = link.label === 'Cancellations';
            
            return (
              <button
                key={link.path}
                onClick={() => {
                  navigate(link.path);
                  closeMenu();
                }}
                className={`flex items-center gap-1.5 text-sm transition px-3 py-2 rounded-xl ${
                  active 
                    ? 'bg-amber-50 text-amber-700 font-medium' 
                    : isBookings || isCancellations
                    ? 'text-amber-600 hover:text-amber-800 hover:bg-amber-50'
                    : 'text-stone-500 hover:text-amber-700 hover:bg-stone-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-amber-700' : ''}`} />
                {link.label}
                {isCancellations && (
                  <span className="ml-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Desktop Profile & Logout */}
        <div className="hidden lg:flex items-center gap-4">
          <button 
            onClick={() => navigate('/staff/profile')} 
            className="bg-amber-100 w-10 h-10 rounded-full flex items-center justify-center hover:bg-amber-200 transition ring-2 ring-amber-100 hover:ring-amber-300"
          >
            <User className="w-5 h-5 text-amber-700" />
          </button>
          <button 
            onClick={() => setShowLogout(true)} 
            className="text-stone-400 hover:text-red-500 transition p-2 hover:bg-red-50 rounded-xl"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Hamburger */}
        <div className="flex lg:hidden items-center gap-3">
          <button 
            onClick={() => navigate('/staff/profile')} 
            className="bg-amber-100 w-9 h-9 rounded-full flex items-center justify-center hover:bg-amber-200 transition"
          >
            <User className="w-4 h-4 text-amber-700" />
          </button>
          <button 
            onClick={toggleMenu} 
            className="p-2 text-stone-600 hover:text-amber-700 transition hover:bg-amber-50 rounded-xl"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      <div 
        className={`lg:hidden fixed top-[73px] left-0 right-0 bg-white/98 backdrop-blur-md border-b border-stone-100 shadow-xl z-40 transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-[600px] opacity-100 visible' : 'max-h-0 opacity-0 invisible overflow-hidden'
        }`}
      >
        <div className="flex flex-col py-3 px-4">
          {navLinks.map((link, index) => {
            const Icon = link.icon;
            const isBookings = link.label === 'Bookings';
            const isCancellations = link.label === 'Cancellations';
            const active = isActive(link.path);
            
            return (
              <button
                key={index}
                onClick={() => {
                  navigate(link.path);
                  closeMenu();
                }}
                className={`flex items-center gap-3 py-3 px-4 rounded-xl transition text-sm font-medium border-b border-stone-50 last:border-0 ${
                  active 
                    ? 'bg-amber-50 text-amber-700' 
                    : isBookings || isCancellations
                    ? 'text-amber-600 hover:bg-amber-50'
                    : 'text-stone-600 hover:text-amber-700 hover:bg-amber-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-amber-700' : isBookings || isCancellations ? 'text-amber-500' : ''}`} />
                <span className="flex-1 text-left">{link.label}</span>
                {isCancellations && (
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                )}
                {active && (
                  <span className="w-1.5 h-8 bg-amber-500 rounded-full"></span>
                )}
              </button>
            );
          })}
          {/* Logout in mobile menu */}
          <button
            onClick={() => {
              closeMenu();
              setShowLogout(true);
            }}
            className="flex items-center gap-3 py-3 px-4 rounded-xl transition text-sm font-medium text-red-500 hover:bg-red-50 border-t border-stone-100 mt-2"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Logout Popup */}
      {showLogout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowLogout(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center animate-in fade-in zoom-in duration-200">
            <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogOut className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-lg font-bold text-stone-800 mb-2">Sign Out</h3>
            <p className="text-stone-500 mb-6">Are you sure you want to sign out?</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowLogout(false)} 
                className="flex-1 py-3 border border-stone-200 rounded-xl text-stone-600 font-medium hover:bg-stone-50 transition"
              >
                Stay
              </button>
              <button 
                onClick={handleLogout} 
                className="flex-1 py-3 bg-amber-700 text-white rounded-xl font-medium hover:bg-amber-800 transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StaffNavbar;