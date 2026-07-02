import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Save, Shield, CheckCircle } from 'lucide-react';
import API from '../services/api';
import GuestNavbar from '../components/GuestNavbar';
import StaffNavbar from '../components/StaffNavbar';
import AdminNavbar from '../components/AdminNavbar';

const Profile = () => {
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

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage(''); setError(''); setLoading(true);
    try {
      await API.post('/profile/update-password/', { current_password: currentPassword, new_password: newPassword }, { headers });
      setMessage('Password updated!');
      setCurrentPassword(''); setNewPassword('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed.');
    }
    setLoading(false);
  };

  const Navbar = role === 'staff' ? StaffNavbar : role === 'admin' ? AdminNavbar : GuestNavbar;

  const roleConfig = {
    guest: { icon: Shield, bg: 'bg-amber-100', text: 'text-amber-700', label: 'Guest' },
    staff: { icon: CheckCircle, bg: 'bg-blue-100', text: 'text-blue-700', label: 'Staff' },
    admin: { icon: Shield, bg: 'bg-amber-900', text: 'text-amber-100', label: 'Administrator' },
  }[role];

  const RoleIcon = roleConfig.icon;

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className={`grid gap-8 ${role === 'guest' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 max-w-md mx-auto'}`}>
          
          {/* Profile Card */}
          <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden h-fit">
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 h-24" />
            <div className="flex justify-center -mt-12 mb-4">
              <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center">
                  <span className="text-4xl font-bold text-amber-700">{initials}</span>
                </div>
              </div>
            </div>
            <div className="text-center px-6 pb-6">
              <h2 className="text-xl font-bold text-stone-800">{user.username}</h2>
              <div className={`inline-flex items-center gap-1.5 ${roleConfig.bg} ${roleConfig.text} px-3 py-1 rounded-full text-xs font-medium mt-2`}>
                <RoleIcon className="w-3 h-3" /> {roleConfig.label}
              </div>
              <div className="mt-4 flex items-center justify-center gap-2 text-stone-500 text-sm">
                <Mail className="w-4 h-4" />
                <span>{user.email || 'No email'}</span>
              </div>

              {/* Staff/Admin extra info */}
              {role !== 'guest' && (
                <div className="mt-6 pt-6 border-t border-stone-100">
                  <p className="text-stone-400 text-xs">
                    Password changes are managed by the system administrator.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Password Form — Guest only */}
          {role === 'guest' && (
            <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8 h-fit">
              <h3 className="text-lg font-bold text-stone-800 mb-5 flex items-center gap-2">
                <div className="bg-amber-100 w-10 h-10 rounded-xl flex items-center justify-center">
                  <Lock className="w-5 h-5 text-amber-700" />
                </div>
                Change Password
              </h3>

              {message && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2 rounded-2xl mb-4 text-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" /> {message}
                </div>
              )}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-2xl mb-4 text-sm">{error}</div>
              )}

              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-600 mb-1">Current Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input type={showCurrent ? 'text' : 'password'} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full pl-10 pr-10 py-3 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 text-sm" placeholder="Current password" required />
                    <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400">
                      {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-600 mb-1">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input type={showNew ? 'text' : 'password'} value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full pl-10 pr-10 py-3 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 text-sm" placeholder="New password" required />
                    <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400">
                      {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-amber-700 text-white py-3 rounded-xl font-medium hover:bg-amber-800 transition flex items-center justify-center gap-2 disabled:opacity-50 text-sm">
                  <Save className="w-4 h-4" /> {loading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Profile;