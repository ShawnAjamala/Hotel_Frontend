import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hotel, User, Mail, Lock, Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import API from '../services/api';
import Navbar from '../components/Navbar';

const Auth = () => {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'guest' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [adminExists, setAdminExists] = useState(false);

  // Check if admin already exists
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await API.get('/admin/admins/');
        setAdminExists(res.data.total > 0);
      } catch {
        // If endpoint fails, assume admin exists
        setAdminExists(true);
      }
    };
    checkAdmin();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setForm({ username: '', email: '', password: '', role: 'guest' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Registration validation
    if (!isLogin) {
      if (form.password.length < 6) {
        setError('Password must be at least 6 characters long');
        setLoading(false);
        return;
      }

      if (!form.email) {
        setError('Email is required');
        setLoading(false);
        return;
      }
    }

    try {
      let res;
      if (isLogin) {
        res = await API.post('/auth/login/', { username: form.username, password: form.password });
      } else {
        res = await API.post('/auth/register/', { 
          username: form.username, 
          email: form.email, 
          password: form.password, 
          role: form.role 
        });
      }

      const { tokens, user } = res.data;
      localStorage.setItem('token', tokens.access);
      localStorage.setItem('user', JSON.stringify(user));

      if (user.role === 'guest') navigate('/guest/dashboard');
      else if (user.role === 'staff') navigate('/staff/dashboard');
      else if (user.role === 'admin') navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="bg-white rounded-3xl shadow-xl border border-stone-100 overflow-hidden w-full max-w-sm">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-700 to-amber-600 px-6 py-6 text-center text-white">
            <div className="bg-white/20 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Hotel className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-xl font-bold">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            <p className="text-amber-100 text-sm mt-1">
              {isLogin ? 'Sign in to continue' : 'Join Grand Horizon Hotel'}
            </p>
          </div>

          {/* Form */}
          <div className="px-6 py-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2.5 rounded-xl mb-4 text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm text-stone-700"
                    placeholder="Username"
                    required
                  />
                </div>
              </div>

              {!isLogin && (
                <div>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm text-stone-700"
                      placeholder="Email"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm text-stone-700"
                    placeholder="Password (min 6 characters)"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {!isLogin && (
                  <p className="text-xs text-stone-400 mt-1.5 ml-1">
                    Password must be at least 6 characters
                  </p>
                )}
              </div>

              {!isLogin && (
                <div>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm text-stone-700 bg-white"
                  >
                    <option value="guest">Guest</option>
                    {!adminExists && (
                      <>
                        <option value="staff">Staff</option>
                        <option value="admin">Admin</option>
                      </>
                    )}
                  </select>
                  {adminExists && (
                    <p className="text-xs text-amber-600 mt-1.5 ml-1">
                      Staff and Admin accounts can only be created by administrators
                    </p>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-700 text-white py-3 rounded-xl font-semibold hover:bg-amber-800 transition flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
              >
                {loading ? 'Please wait...' : (
                  isLogin ? (
                    <>Sign In <LogIn className="w-4 h-4" /></>
                  ) : (
                    <>Create Account <UserPlus className="w-4 h-4" /></>
                  )
                )}
              </button>
            </form>

            <p className="text-center text-stone-400 text-sm mt-4">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button onClick={toggleMode} className="text-amber-700 font-medium hover:underline">
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;