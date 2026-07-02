// src/components/Navbar.jsx
import { useNavigate } from 'react-router-dom';
import { Hotel, BedDouble, UtensilsCrossed, Presentation, PartyPopper, LogIn, UserPlus } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-stone-100">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
        <div className="bg-amber-700 p-2 rounded-xl">
          <Hotel className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold text-stone-800">Grand Horizon</h1>
      </div>
      
      <div className="flex items-center gap-6">
        <button onClick={() => navigate('/guest/rooms')} className="flex items-center gap-2 text-stone-500 hover:text-amber-700 text-sm">
          <BedDouble className="w-4 h-4" /> Rooms
        </button>
        <button onClick={() => navigate('/guest/restaurant')} className="flex items-center gap-2 text-stone-500 hover:text-amber-700 text-sm">
          <UtensilsCrossed className="w-4 h-4" /> Dining
        </button>
        <button onClick={() => navigate('/guest/conference')} className="flex items-center gap-2 text-stone-500 hover:text-amber-700 text-sm">
          <Presentation className="w-4 h-4" /> Conference
        </button>
        <button onClick={() => navigate('/guest/events')} className="flex items-center gap-2 text-stone-500 hover:text-amber-700 text-sm">
          <PartyPopper className="w-4 h-4" /> Events
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/login')} className="flex items-center gap-2 px-4 py-2 text-amber-700 border border-amber-200 rounded-xl text-sm font-medium hover:bg-amber-50 transition">
          <LogIn className="w-4 h-4" /> Login
        </button>
        <button onClick={() => navigate('/register')} className="flex items-center gap-2 px-4 py-2 bg-amber-700 text-white rounded-xl text-sm font-medium hover:bg-amber-800 transition">
          <UserPlus className="w-4 h-4" /> Register
        </button>
      </div>
    </nav>
  );
};

export default Navbar;