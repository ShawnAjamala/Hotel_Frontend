import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hotel, LogIn, Eye, EyeOff } from 'lucide-react';
import API from '../services/api';
import Navbar from '../components/Navbar';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ==================== CONNECT TO BACKEND: Login ====================
  // POST /api/auth/login/ — returns JWT tokens + user object
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await API.post('/auth/login/', form);
      const { tokens, user } = res.data;

      // Store token in localStorage for persistent auth
      localStorage.setItem('token', tokens.access);
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect based on role
      if (user.role === 'guest') navigate('/guest/dashboard');
      else if (user.role === 'staff') navigate('/staff/dashboard');
      else if (user.role === 'admin') navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      
      <div className="flex items-center justify-center py-20 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="bg-amber-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Hotel className="w-8 h-8 text-amber-700" />
            </div>
            <h2 className="text-2xl font-bold text-stone-800">Welcome Back</h2>
            <p className="text-stone-500 mt-1">Sign in to your account</p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Username</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-700 text-white py-3 rounded-xl font-semibold hover:bg-amber-800 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : (
                <>Sign In <LogIn className="w-5 h-5" /></>
              )}
            </button>
          </form>

          {/* Register Link */}
          <p className="text-center text-stone-500 mt-6">
            Don't have an account?{' '}
            <button onClick={() => navigate('/register')} className="text-amber-700 font-medium hover:underline">
              Create one
            </button>
          </p>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-stone-100 rounded-xl text-xs text-stone-500">
            <p className="font-semibold mb-2">Demo Credentials:</p>
            <p>Guest: guest1 / guest123</p>
            <p>Staff: staff1 / 111111</p>
            <p>Admin: admin1 / 000000</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;