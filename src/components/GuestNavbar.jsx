import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hotel, BedDouble, UtensilsCrossed, Presentation, PartyPopper, Calendar, User, LogOut, Menu, X, LayoutDashboard } from 'lucide-react';

const GuestNavbar = () => {
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
    { icon: LayoutDashboard, label: 'Dashboard', path: '/guest/dashboard' },
    { icon: BedDouble, label: 'Rooms', path: '/guest/rooms' },
    { icon: UtensilsCrossed, label: 'Dining', path: '/guest/restaurant' },
    { icon: Presentation, label: 'Conference', path: '/guest/conference' },
    { icon: PartyPopper, label: 'Events', path: '/guest/events' },
    { icon: Calendar, label: 'My Bookings', path: '/guest/bookings' },
  ];

  return (
    <>
      <nav className="flex items-center justify-between px-4 sm:px-8 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-stone-100">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/guest/dashboard')}>
          <div className="bg-amber-700 p-2 rounded-xl">
            <Hotel className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-stone-800 hidden sm:block">Grand Horizon</h1>
          <h1 className="text-xl font-bold text-stone-800 sm:hidden">GH</h1>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <button onClick={() => navigate('/guest/dashboard')} className="flex items-center gap-2 text-stone-500 hover:text-amber-700 text-sm transition">
            <Hotel className="w-4 h-4" /> Home
          </button>
          <button onClick={() => navigate('/guest/rooms')} className="flex items-center gap-2 text-stone-500 hover:text-amber-700 text-sm transition">
            <BedDouble className="w-4 h-4" /> Rooms
          </button>
          <button onClick={() => navigate('/guest/restaurant')} className="flex items-center gap-2 text-stone-500 hover:text-amber-700 text-sm transition">
            <UtensilsCrossed className="w-4 h-4" /> Dining
          </button>
          <button onClick={() => navigate('/guest/conference')} className="flex items-center gap-2 text-stone-500 hover:text-amber-700 text-sm transition">
            <Presentation className="w-4 h-4" /> Conference
          </button>
          <button onClick={() => navigate('/guest/events')} className="flex items-center gap-2 text-stone-500 hover:text-amber-700 text-sm transition">
            <PartyPopper className="w-4 h-4" /> Events
          </button>
          <button onClick={() => navigate('/guest/bookings')} className="flex items-center gap-2 text-amber-700 font-medium text-sm transition">
            <Calendar className="w-4 h-4" /> My Bookings
          </button>
        </div>

        {/* Desktop Profile & Logout */}
        <div className="hidden md:flex items-center gap-4">
          <button onClick={() => navigate('/guest/profile')} className="bg-amber-100 w-10 h-10 rounded-full flex items-center justify-center hover:bg-amber-200 transition">
            <User className="w-5 h-5 text-amber-700" />
          </button>
          <button onClick={() => setShowLogout(true)} className="text-stone-400 hover:text-red-500 transition">
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Hamburger */}
        <div className="flex md:hidden items-center gap-3">
          <button onClick={() => navigate('/guest/profile')} className="bg-amber-100 w-9 h-9 rounded-full flex items-center justify-center hover:bg-amber-200 transition">
            <User className="w-4 h-4 text-amber-700" />
          </button>
          <button onClick={toggleMenu} className="p-2 text-stone-600 hover:text-amber-700 transition">
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      <div 
        className={`md:hidden fixed top-[73px] left-0 right-0 bg-white/95 backdrop-blur-md border-b border-stone-100 shadow-lg z-40 transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-[500px] opacity-100 visible' : 'max-h-0 opacity-0 invisible overflow-hidden'
        }`}
      >
        <div className="flex flex-col py-4 px-6">
          {navLinks.map((link, index) => {
            const Icon = link.icon;
            const isBookings = link.label === 'My Bookings';
            return (
              <button
                key={index}
                onClick={() => {
                  navigate(link.path);
                  closeMenu();
                }}
                className={`flex items-center gap-3 py-3 px-4 rounded-xl transition text-sm font-medium border-b border-stone-50 last:border-0 ${
                  isBookings 
                    ? 'text-amber-700 hover:bg-amber-50' 
                    : 'text-stone-600 hover:text-amber-700 hover:bg-amber-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isBookings ? 'text-amber-700' : ''}`} />
                {link.label}
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
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center">
            <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogOut className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-lg font-bold text-stone-800 mb-2">Sign Out</h3>
            <p className="text-stone-500 mb-6">Are you sure you want to sign out?</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogout(false)} className="flex-1 py-3 border border-stone-200 rounded-xl text-stone-600 font-medium hover:bg-stone-50">Stay</button>
              <button onClick={handleLogout} className="flex-1 py-3 bg-amber-700 text-white rounded-xl font-medium hover:bg-amber-800">Sign Out</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GuestNavbar;