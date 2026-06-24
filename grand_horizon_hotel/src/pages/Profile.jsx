import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Save, Shield, Camera, CheckCircle, Clock } from 'lucide-react';
import API from '../services/api';
import GuestNavbar from '../components/GuestNavbar';
import StaffNavbar from '../components/StaffNavbar';
import AdminNavbar from '../components/AdminNavbar';

const Profile = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.role || 'guest';

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };
  const initials = user.username ? user.username.substring(0, 2).toUpperCase() : '??';
  const joined = user.date_joined ? new Date(user.date_joined).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage(''); setError(''); setLoading(true);
    try {
      await API.post('/profile/update-password/', { current_password: currentPassword, new_password: newPassword }, { headers });
      setMessage('Password updated successfully!');
      setCurrentPassword(''); setNewPassword('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update password.');
    }
    setLoading(false);
  };

  const Navbar = role === 'staff' ? StaffNavbar : role === 'admin' ? AdminNavbar : GuestNavbar;
  const dashboardLink = role === 'staff' ? '/staff/dashboard' : role === 'admin' ? '/admin/dashboard' : '/guest/dashboard';

  const roleBadge = {
    guest: { icon: Shield, color: 'bg-amber-100 text-amber-700', label: 'Guest' },
    staff: { icon: CheckCircle, color: 'bg-blue-100 text-blue-700', label: 'Staff' },
    admin: { icon: Shield, color: 'bg-amber-900 text-amber-100', label: 'Administrator' },
  }[role];

  const RoleIcon = roleBadge.icon;

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <Navbar />
      <div className="max-w-2xl mx-auto px-8 py-10">
        <button onClick={() => navigate(dashboardLink)} className="flex items-center gap-2 text-stone-500 hover:text-amber-700 mb-8 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        {/* Profile Info Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden mb-8">
          {/* Banner */}
          <div className="bg-gradient-to-r from-amber-700 to-amber-600 h-24" />
          {/* Avatar */}
          <div className="flex justify-center -mt-12 mb-4">
            <div className="w-24 h-24 rounded-full bg-amber-100 border-4 border-white flex items-center justify-center shadow-md">
              <span className="text-4xl font-bold text-amber-700">{initials}</span>
            </div>
          </div>
          {/* Details */}
          <div className="text-center px-8 pb-8">
            <h2 className="text-2xl font-bold text-stone-800">{user.username}</h2>
            <div className={`inline-flex items-center gap-1.5 ${roleBadge.color} px-3 py-1 rounded-full text-xs font-medium mt-2`}>
              <RoleIcon className="w-3.5 h-3.5" /> {roleBadge.label}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 text-left">
              <div className="bg-stone-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-stone-400 text-xs mb-1"><Mail className="w-3.5 h-3.5" /> Email</div>
                <p className="text-stone-700 font-medium text-sm">{user.email || 'N/A'}</p>
              </div>
              <div className="bg-stone-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-stone-400 text-xs mb-1"><Clock className="w-3.5 h-3.5" /> Member Since</div>
                <p className="text-stone-700 font-medium text-sm">{joined}</p>
              </div>
              <div className="bg-stone-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-stone-400 text-xs mb-1"><Shield className="w-3.5 h-3.5" /> Role</div>
                <p className="text-stone-700 font-medium text-sm capitalize">{roleBadge.label}</p>
              </div>
              <div className="bg-stone-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-stone-400 text-xs mb-1"><CheckCircle className="w-3.5 h-3.5" /> Status</div>
                <p className="text-emerald-600 font-medium text-sm">Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password — only for guest */}
        {role === 'guest' && (
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8">
            <h3 className="text-lg font-bold text-stone-800 mb-6 flex items-center gap-2">
              <Lock className="w-5 h-5 text-amber-700" /> Change Password
            </h3>

            {message && <div className="bg-emerald-50 text-emerald-600 px-4 py-3 rounded-xl mb-4 text-sm">{message}</div>}
            {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">{error}</div>}

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Current Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input type={showCurrent ? 'text' : 'password'} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full pl-11 pr-12 py-3 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500" placeholder="Enter current password" required />
                  <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                    {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input type={showNew ? 'text' : 'password'} value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full pl-11 pr-12 py-3 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500" placeholder="Enter new password" required />
                  <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                    {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-amber-700 text-white py-3 rounded-xl font-medium hover:bg-amber-800 transition flex items-center justify-center gap-2 disabled:opacity-50">
                <Save className="w-4 h-4" /> {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;