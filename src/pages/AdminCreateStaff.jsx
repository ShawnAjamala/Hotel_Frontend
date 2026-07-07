import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Mail, User, Send, Copy, Check, X } from 'lucide-react';
import API from '../services/api';
import AdminNavbar from '../components/AdminNavbar';
import Footer from '../components/Footer';

const AdminCreateStaff = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    email: '',
    role: 'staff'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [createdUser, setCreatedUser] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    setCreatedUser(null);

    try {
      const token = localStorage.getItem('token');
      const res = await API.post('/admin/staff/create/', form, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess(res.data.message);
      setCreatedUser({
        username: res.data.username,
        email: res.data.email,
        password: res.data.password
      });
      setForm({ username: '', email: '', role: 'staff' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create staff account');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const clearSuccess = () => {
    setSuccess('');
    setCreatedUser(null);
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <AdminNavbar />

      <div className="flex items-center justify-center px-4 py-8 min-h-[calc(100vh-73px)]">
        <div className="bg-white rounded-3xl shadow-xl border border-stone-100 overflow-hidden w-full max-w-lg">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-700 to-amber-600 px-6 py-5 text-white">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0">
                <UserPlus className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Create Staff Account</h1>
                <p className="text-amber-100 text-xs">Staff will receive credentials via email</p>
              </div>
            </div>
          </div>

          <div className="px-6 py-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2.5 rounded-xl mb-4 text-sm flex items-center justify-between">
                <span>{error}</span>
                <button onClick={() => setError('')} className="text-red-400 hover:text-red-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {success && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl mb-4 text-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">✓ {success}</span>
                  <button onClick={clearSuccess} className="text-emerald-400 hover:text-emerald-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {createdUser && (
                  <div className="mt-2 bg-white rounded-lg p-3 text-stone-600 text-sm space-y-1.5 border border-stone-100">
                    <div className="flex justify-between items-center">
                      <span><span className="font-medium">Username:</span> {createdUser.username}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span><span className="font-medium">Email:</span> {createdUser.email}</span>
                    </div>
                    <div className="flex justify-between items-center bg-amber-50 p-2 rounded-lg border border-amber-200">
                      <span><span className="font-medium text-amber-700">Password:</span> <span className="font-mono text-xs">{createdUser.password}</span></span>
                      <button
                        onClick={() => copyToClipboard(createdUser.password)}
                        className="text-amber-600 hover:text-amber-800 transition flex items-center gap-1 text-xs px-2 py-1 bg-white rounded-lg"
                      >
                        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <p className="text-stone-400 text-xs mt-1">
                      Credentials sent to email. Staff must change password on first login.
                    </p>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm"
                    placeholder="Enter staff username"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm"
                    placeholder="staff@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Role
                </label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm bg-white"
                >
                  <option value="staff">Staff</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-700 text-white py-3 rounded-xl font-semibold hover:bg-amber-800 transition flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
              >
                {loading ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Create Staff Account
                  </>
                )}
              </button>
            </form>

            <div className="mt-3 text-center">
              <p className="text-xs text-stone-400">
                Staff will receive credentials via email and must change password on first login
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminCreateStaff;