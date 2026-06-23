import { useNavigate } from 'react-router-dom';
import { Hotel, Users, UserCheck, Calendar, User, LogOut, Shield } from 'lucide-react';

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-stone-100">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/admin/dashboard')}>
        <div className="bg-amber-900 p-2 rounded-xl">
          <Hotel className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold text-stone-800 tracking-tight">Grand Horizon</h1>
        <span className="text-xs bg-amber-900 text-amber-100 px-2 py-1 rounded-full font-medium">Admin</span>
      </div>

      <div className="flex items-center gap-6">
        <button onClick={() => navigate('/admin/users')} className="flex items-center gap-2 text-stone-500 hover:text-amber-800 transition text-sm font-medium">
          <Users className="w-4 h-4" /> Users
        </button>
        <button onClick={() => navigate('/admin/staff/pending')} className="flex items-center gap-2 text-stone-500 hover:text-amber-800 transition text-sm font-medium">
          <UserCheck className="w-4 h-4" /> Approvals
        </button>
        <button onClick={() => navigate('/admin/bookings')} className="flex items-center gap-2 text-stone-500 hover:text-amber-800 transition text-sm font-medium">
          <Calendar className="w-4 h-4" /> Bookings
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/admin/profile')} className="bg-amber-100 w-10 h-10 rounded-full flex items-center justify-center hover:bg-amber-200 transition">
          <Shield className="w-5 h-5 text-amber-900" />
        </button>
        <button onClick={handleLogout} className="text-stone-400 hover:text-red-500 transition">
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;