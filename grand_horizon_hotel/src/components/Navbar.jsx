import { useNavigate, useLocation } from 'react-router-dom';
import { Hotel } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isPublic = location.pathname === '/';
  const isAuth = location.pathname === '/login' || location.pathname === '/register';

  return (
    <nav className="flex items-center justify-between px-8 py-5 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-stone-100">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
        <div className="bg-amber-700 p-2 rounded-xl">
          <Hotel className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold text-stone-800 tracking-tight">Grand Horizon</h1>
      </div>

      <div className="flex items-center gap-6">
        {/* On Auth pages, show Home link */}
        {isAuth && (
          <button 
            onClick={() => navigate('/')} 
            className="text-stone-600 hover:text-amber-700 font-medium transition"
          >
            Home
          </button>
        )}

        {/* On Public dashboard, show Home + Sign In */}
        {isPublic && (
          <>
            <button 
              onClick={() => navigate('/')} 
              className="text-stone-600 hover:text-amber-700 font-medium transition"
            >
              Home
            </button>
            <button 
              onClick={() => navigate('/login')} 
              className="bg-amber-700 text-white px-5 py-2 rounded-full font-medium hover:bg-amber-800 transition"
            >
              Sign In
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;