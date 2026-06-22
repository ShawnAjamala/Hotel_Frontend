import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hotel, User, Mail, Lock, Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import API from '../services/api'; // <-- Import the shared API instance
import Navbar from '../components/Navbar';

const Auth = () => {
  const navigate = useNavigate();

  // Toggle between 'login' and 'register' views
  const [isLogin, setIsLogin] = useState(true);

  // Form state — shared by both login and register
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'guest',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle all input changes with one function
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Toggle between login and register — clears error
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setForm({ username: '', email: '', password: '', role: 'guest' });
  };

  // ==================== SUBMIT: Login or Register ====================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let res;

      if (isLogin) {
        // ========== LOGIN ==========
        // POST /api/auth/login/
        // Sends: { username, password }
        // Returns: { tokens: { access, refresh }, user: { id, username, email, role } }
        res = await API.post('/auth/login/', {
          username: form.username,
          password: form.password,
        });
      } else {
        // ========== REGISTER ==========
        // POST /api/auth/register/
        // Sends: { username, email, password, role }
        // Returns: { tokens: { access, refresh }, user: { id, username, email, role } }
        res = await API.post('/auth/register/', {
          username: form.username,
          email: form.email,
          password: form.password,
          role: form.role,
        });
      }

      const { tokens, user } = res.data;

      // Store token so user stays logged in after page refresh
      localStorage.setItem('token', tokens.access);
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect to the correct dashboard based on role
      if (user.role === 'guest') navigate('/guest/dashboard');
      else if (user.role === 'staff') navigate('/staff/dashboard');
      else if (user.role === 'admin') navigate('/admin/dashboard');

    } catch (err) {
      // Show backend error message if available
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
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
            <h2 className="text-2xl font-bold text-stone-800">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-stone-500 mt-1">
              {isLogin ? 'Sign in to your account' : 'Join Grand Horizon Hotel'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username — required for both login and register */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            {/* Email — only shown during registration */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                    placeholder="Enter your email"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            {/* Password — required for both */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
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

            {/* Role selector — only during registration */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Account Type</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition bg-white"
                >
                  <option value="guest">Guest</option>
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-700 text-white py-3 rounded-xl font-semibold hover:bg-amber-800 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Please wait...' : (
                isLogin ? (
                  <>Sign In <LogIn className="w-5 h-5" /></>
                ) : (
                  <>Create Account <UserPlus className="w-5 h-5" /></>
                )
              )}
            </button>
          </form>

          {/* Toggle between Login and Register */}
          <p className="text-center text-stone-500 mt-6">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button onClick={toggleMode} className="text-amber-700 font-medium hover:underline">
              {isLogin ? 'Create one' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;