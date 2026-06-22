import { useNavigate } from 'react-router-dom';
import { Hotel, ArrowRight } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="flex items-center justify-between px-8 py-5 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-stone-100">
      {/* Logo */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
        <div className="bg-amber-700 p-2 rounded-xl">
          <Hotel className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold text-stone-800 tracking-tight">Grand Horizon</h1>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/login')} 
          className="text-stone-600 hover:text-stone-900 font-medium transition"
        >
          Sign In
        </button>
        <button 
          onClick={() => navigate('/register')} 
          className="bg-amber-700 text-white px-6 py-2.5 rounded-full font-medium hover:bg-amber-800 transition flex items-center gap-2"
        >
          Get Started <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;