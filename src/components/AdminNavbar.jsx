import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hotel, Users, UserCheck, Calendar, User, LogOut, Shield, Menu, X, LayoutDashboard } from 'lucide-react';

const AdminNavbar = () => {
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
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: UserCheck, label: 'Approvals', path: '/admin/staff/pending' },
    { icon: Calendar, label: 'Bookings', path: '/admin/bookings' },
  ];

  return (
    <>
      <nav className="flex items-center justify-between px-4 sm:px-8 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-stone-100">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/admin/dashboard')}>
          <div className="bg-amber-900 p-2 rounded-xl">
            <Hotel className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-stone-800 hidden sm:block">Grand Horizon</h1>
          <h1 className="text-xl font-bold text-stone-800 sm:hidden">GH</h1>
          <span className="text-xs bg-amber-900 text-amber-100 px-2 py-1 rounded-full font-medium hidden sm:inline-block">Admin</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <button onClick={() => navigate('/admin/dashboard')} className="flex items-center gap-2 text-stone-500 hover:text-amber-800 text-sm transition">
            <Hotel className="w-4 h-4" /> Home
          </button>
          <button onClick={() => navigate('/admin/users')} className="flex items-center gap-2 text-stone-500 hover:text-amber-800 text-sm transition">
            <Users className="w-4 h-4" /> Users
          </button>
          <button onClick={() => navigate('/admin/staff/pending')} className="flex items-center gap-2 text-stone-500 hover:text-amber-800 text-sm transition">
            <UserCheck className="w-4 h-4" /> Approvals
          </button>
          <button onClick={() => navigate('/admin/bookings')} className="flex items-center gap-2 text-amber-800 font-medium text-sm transition">
            <Calendar className="w-4 h-4" /> Bookings
          </button>
        </div>

        {/* Desktop Profile & Logout */}
        <div className="hidden md:flex items-center gap-4">
          <button onClick={() => navigate('/admin/profile')} className="bg-amber-100 w-10 h-10 rounded-full flex items-center justify-center hover:bg-amber-200 transition">
            <Shield className="w-5 h-5 text-amber-900" />
          </button>
          <button onClick={() => setShowLogout(true)} className="text-stone-400 hover:text-red-500 transition">
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Hamburger */}
        <div className="flex md:hidden items-center gap-3">
          <button onClick={() => navigate('/admin/profile')} className="bg-amber-100 w-9 h-9 rounded-full flex items-center justify-center hover:bg-amber-200 transition">
            <Shield className="w-4 h-4 text-amber-900" />
          </button>
          <button onClick={toggleMenu} className="p-2 text-stone-600 hover:text-amber-800 transition">
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
            const isBookings = link.label === 'Bookings';
            return (
              <button
                key={index}
                onClick={() => {
                  navigate(link.path);
                  closeMenu();
                }}
                className={`flex items-center gap-3 py-3 px-4 rounded-xl transition text-sm font-medium border-b border-stone-50 last:border-0 ${
                  isBookings 
                    ? 'text-amber-800 hover:bg-amber-50' 
                    : 'text-stone-600 hover:text-amber-800 hover:bg-amber-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isBookings ? 'text-amber-800' : ''}`} />
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

export default AdminNavbar;