import { useNavigate } from 'react-router-dom';
import { Hotel, PlusCircle, Calendar, User, LogOut, BedDouble, UtensilsCrossed, Presentation, PartyPopper } from 'lucide-react';

const StaffNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-stone-100">
      {/* Logo */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/staff/dashboard')}>
        <div className="bg-amber-700 p-2 rounded-xl">
          <Hotel className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold text-stone-800 tracking-tight">Grand Horizon</h1>
        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">Staff</span>
      </div>

      {/* Links */}
      <div className="flex items-center gap-6">
        <button onClick={() => navigate('/staff/rooms/create')} className="flex items-center gap-1.5 text-stone-500 hover:text-amber-700 transition text-sm font-medium">
          <PlusCircle className="w-4 h-4" /> <BedDouble className="w-4 h-4" /> Room
        </button>
        <button onClick={() => navigate('/staff/tables/create')} className="flex items-center gap-1.5 text-stone-500 hover:text-amber-700 transition text-sm font-medium">
          <PlusCircle className="w-4 h-4" /> <UtensilsCrossed className="w-4 h-4" /> Table
        </button>
        <button onClick={() => navigate('/staff/conference/create')} className="flex items-center gap-1.5 text-stone-500 hover:text-amber-700 transition text-sm font-medium">
          <PlusCircle className="w-4 h-4" /> <Presentation className="w-4 h-4" /> Conference
        </button>
        <button onClick={() => navigate('/staff/venues/create')} className="flex items-center gap-1.5 text-stone-500 hover:text-amber-700 transition text-sm font-medium">
          <PlusCircle className="w-4 h-4" /> <PartyPopper className="w-4 h-4" /> Venue
        </button>
        <button onClick={() => navigate('/staff/bookings')} className="flex items-center gap-2 text-amber-700 font-medium text-sm">
          <Calendar className="w-4 h-4" /> All Bookings
        </button>
      </div>

      {/* Profile */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/staff/profile')} className="bg-amber-100 w-10 h-10 rounded-full flex items-center justify-center hover:bg-amber-200 transition">
          <User className="w-5 h-5 text-amber-700" />
        </button>
        <button onClick={handleLogout} className="text-stone-400 hover:text-red-500 transition">
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
};

export default StaffNavbar;