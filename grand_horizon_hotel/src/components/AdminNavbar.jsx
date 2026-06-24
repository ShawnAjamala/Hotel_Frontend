import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hotel, Users, UserCheck, Calendar, User, LogOut, Shield } from 'lucide-react';

const AdminNavbar = () => {
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
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/admin/dashboard')}>
          <div className="bg-amber-900 p-2 rounded-xl"><Hotel className="w-6 h-6 text-white" /></div>
          <h1 className="text-xl font-bold text-stone-800">Grand Horizon</h1>
          <span className="text-xs bg-amber-900 text-amber-100 px-2 py-1 rounded-full font-medium">Admin</span>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/admin/dashboard')} className="flex items-center gap-2 text-stone-500 hover:text-amber-800 text-sm"><Hotel className="w-4 h-4" /> Home</button>
          <button onClick={() => navigate('/admin/users')} className="flex items-center gap-2 text-stone-500 hover:text-amber-800 text-sm"><Users className="w-4 h-4" /> Users</button>
          <button onClick={() => navigate('/admin/staff/pending')} className="flex items-center gap-2 text-stone-500 hover:text-amber-800 text-sm"><UserCheck className="w-4 h-4" /> Approvals</button>
          <button onClick={() => navigate('/admin/bookings')} className="flex items-center gap-2 text-stone-500 hover:text-amber-800 text-sm"><Calendar className="w-4 h-4" /> Bookings</button>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin/profile')} className="bg-amber-100 w-10 h-10 rounded-full flex items-center justify-center hover:bg-amber-200 transition">
            <Shield className="w-5 h-5 text-amber-900" />
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

export default AdminNavbar;