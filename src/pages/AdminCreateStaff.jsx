import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Mail, User, Send, ArrowLeft, Key, Copy, Check, Users } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <AdminNavbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10">
        {/* Back Button */}
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center gap-2 text-stone-500 hover:text-amber-700 text-sm mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <div className="bg-white rounded-3xl shadow-lg border border-stone-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-700 to-amber-600 px-6 py-6 text-white">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Create Staff Account</h1>
                <p className="text-amber-100 text-sm">Staff will receive credentials via email</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl mb-4 text-sm">
                <p className="font-medium mb-1">✓ {success}</p>
                {createdUser && (
                  <div className="mt-2 bg-white rounded-lg p-4 text-stone-600 text-sm space-y-2 border border-stone-100">
                    <div className="flex justify-between items-center">
                      <span><span className="font-medium">Username:</span> {createdUser.username}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span><span className="font-medium">Email:</span> {createdUser.email}</span>
                    </div>
                    <div className="flex justify-between items-center bg-amber-50 p-2 rounded-lg border border-amber-200">
                      <span><span className="font-medium text-amber-700">Password:</span> <span className="font-mono">{createdUser.password}</span></span>
                      <button
                        onClick={() => copyToClipboard(createdUser.password)}
                        className="text-amber-600 hover:text-amber-800 transition flex items-center gap-1 text-xs"
                      >
                        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <p className="text-stone-400 text-xs mt-1">
                      Credentials sent to their email. Staff will be prompted to change password on first login.
                    </p>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm"
                    placeholder="Enter staff username"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm"
                    placeholder="staff@example.com"
                    required
                  />
                </div>
                <p className="text-xs text-stone-400 mt-1.5 ml-1">
                  Staff will receive login credentials at this email
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  Role
                </label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm bg-white"
                >
                  <option value="staff">Staff</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-700 text-white py-3.5 rounded-xl font-semibold hover:bg-amber-800 transition flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
              >
                {loading ? (
                  'Creating...'
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Create Staff Account
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-xs text-stone-400">
                Staff will receive an email with their login credentials
              </p>
              <p className="text-xs text-amber-600 mt-1">
                They will be required to change password on first login
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