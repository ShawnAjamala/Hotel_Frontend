import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hotel, Calendar, User, LogOut, BedDouble, UtensilsCrossed, Presentation, PartyPopper } from 'lucide-react';

const StaffNavbar = () => {
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <>
      <nav className="flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-stone-100">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/staff/dashboard')}>
          <div className="bg-amber-700 p-2 rounded-xl"><Hotel className="w-6 h-6 text-white" /></div>
          <h1 className="text-xl font-bold text-stone-800">Grand Horizon</h1>
          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">Staff</span>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/staff/dashboard')} className="flex items-center gap-1.5 text-stone-500 hover:text-amber-700 text-sm"><Hotel className="w-4 h-4" /> Home</button>
          <button onClick={() => navigate('/staff/rooms/create')} className="flex items-center gap-1.5 text-stone-500 hover:text-amber-700 text-sm"><BedDouble className="w-4 h-4" /> Rooms</button>
          <button onClick={() => navigate('/staff/tables/create')} className="flex items-center gap-1.5 text-stone-500 hover:text-amber-700 text-sm"><UtensilsCrossed className="w-4 h-4" /> Tables</button>
          <button onClick={() => navigate('/staff/conference/create')} className="flex items-center gap-1.5 text-stone-500 hover:text-amber-700 text-sm"><Presentation className="w-4 h-4" /> Conference</button>
          <button onClick={() => navigate('/staff/venues/create')} className="flex items-center gap-1.5 text-stone-500 hover:text-amber-700 text-sm"><PartyPopper className="w-4 h-4" /> Venues</button>
          <button onClick={() => navigate('/staff/bookings')} className="flex items-center gap-1.5 text-amber-700 font-medium text-sm"><Calendar className="w-4 h-4" /> Bookings</button>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/staff/profile')} className="bg-amber-100 w-10 h-10 rounded-full flex items-center justify-center hover:bg-amber-200 transition">
            <User className="w-5 h-5 text-amber-700" />
          </button>
          <button onClick={() => setShowLogout(true)} className="text-stone-400 hover:text-red-500 transition">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </nav>

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

export default StaffNavbar;