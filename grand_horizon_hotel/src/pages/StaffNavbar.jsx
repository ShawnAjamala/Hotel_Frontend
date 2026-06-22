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
    <nav className="flex items-center justify-between px-8 py-4 bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/staff/dashboard')}>
        <div className="bg-amber-600 p-2 rounded-xl">
          <Hotel className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-tight">Grand Horizon <span className="text-amber-400 text-sm font-normal">Staff</span></h1>
      </div>

      {/* Create Links */}
      <div className="flex items-center gap-6">
        <button onClick={() => navigate('/staff/rooms/create')} className="flex items-center gap-2 text-stone-300 hover:text-white transition">
          <PlusCircle className="w-4 h-4" /> <BedDouble className="w-4 h-4" /> Room
        </button>
        <button onClick={() => navigate('/staff/tables/create')} className="flex items-center gap-2 text-stone-300 hover:text-white transition">
          <PlusCircle className="w-4 h-4" /> <UtensilsCrossed className="w-4 h-4" /> Table
        </button>
        <button onClick={() => navigate('/staff/conference/create')} className="flex items-center gap-2 text-stone-300 hover:text-white transition">
          <PlusCircle className="w-4 h-4" /> <Presentation className="w-4 h-4" /> Conference
        </button>
        <button onClick={() => navigate('/staff/venues/create')} className="flex items-center gap-2 text-stone-300 hover:text-white transition">
          <PlusCircle className="w-4 h-4" /> <PartyPopper className="w-4 h-4" /> Venue
        </button>
        <button onClick={() => navigate('/staff/bookings')} className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition font-medium">
          <Calendar className="w-4 h-4" /> All Bookings
        </button>
      </div>

      {/* Profile + Logout */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/staff/profile')} className="bg-slate-700 w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-600 transition">
          <User className="w-5 h-5 text-amber-400" />
        </button>
        <button onClick={handleLogout} className="text-stone-400 hover:text-red-400 transition">
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
};

export default StaffNavbar;