import { useNavigate } from 'react-router-dom';
import { Hotel, BedDouble, UtensilsCrossed, Presentation, PartyPopper, Calendar, User, LogOut } from 'lucide-react';

const GuestNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-sm sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/guest/dashboard')}>
        <div className="bg-amber-700 p-2 rounded-xl">
          <Hotel className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold text-stone-800">Grand Horizon</h1>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center gap-8">
        <button onClick={() => navigate('/guest/rooms')} className="flex items-center gap-2 text-stone-600 hover:text-amber-700 transition">
          <BedDouble className="w-4 h-4" /> Rooms
        </button>
        <button onClick={() => navigate('/guest/restaurant')} className="flex items-center gap-2 text-stone-600 hover:text-amber-700 transition">
          <UtensilsCrossed className="w-4 h-4" /> Dining
        </button>
        <button onClick={() => navigate('/guest/conference')} className="flex items-center gap-2 text-stone-600 hover:text-amber-700 transition">
          <Presentation className="w-4 h-4" /> Conference
        </button>
        <button onClick={() => navigate('/guest/events')} className="flex items-center gap-2 text-stone-600 hover:text-amber-700 transition">
          <PartyPopper className="w-4 h-4" /> Events
        </button>
        <button onClick={() => navigate('/guest/bookings')} className="flex items-center gap-2 text-stone-600 hover:text-amber-700 transition">
          <Calendar className="w-4 h-4" /> My Bookings
        </button>
      </div>

      {/* Profile + Logout */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/guest/profile')} className="bg-amber-100 w-10 h-10 rounded-full flex items-center justify-center hover:bg-amber-200 transition">
          <User className="w-5 h-5 text-amber-700" />
        </button>
        <button onClick={handleLogout} className="text-stone-400 hover:text-red-500 transition">
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
};

export default GuestNavbar;