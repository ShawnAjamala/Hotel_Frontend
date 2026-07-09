import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hotel, User, Mail, Lock, Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import API from '../services/api';
import Navbar from '../components/Navbar';

const Auth = () => {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if user is already logged in - ONLY ONCE on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (token && user.role) {
      if (user.must_change_password) {
        navigate('/change-password');
        return;
      }
      
      if (user.role === 'guest') navigate('/guest/dashboard');
      else if (user.role === 'staff') navigate('/staff/dashboard');
      else if (user.role === 'admin') navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setForm({ username: '', email: '', password: '' });
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
        res = await API.post('/auth/login/', { 
          username: form.username, 
          password: form.password 
        });
      } else {
        res = await API.post('/auth/register/', { 
          username: form.username, 
          email: form.email, 
          password: form.password,
          role: 'guest'
        });
      }

      if (!res.data) {
        setError('Invalid response from server');
        setLoading(false);
        return;
      }

      const { tokens, user } = res.data;
      
      localStorage.setItem('token', tokens.access);
      localStorage.setItem('user', JSON.stringify(user));

      if (user.must_change_password) {
        navigate('/change-password');
        return;
      }

      if (user.role === 'guest') {
        navigate('/guest/dashboard');
      } else if (user.role === 'staff') {
        navigate('/staff/dashboard');
      } else if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        setError('Unknown user role');
        setLoading(false);
      }
    } catch (err) {
      if (err.response) {
        const errorMsg = err.response.data?.error || 
                        err.response.data?.message || 
                        err.response.data?.detail ||
                        'Something went wrong. Please try again.';
        setError(errorMsg);
      } else if (err.request) {
        setError('No response from server. Please check your connection.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="bg-white rounded-3xl shadow-xl border border-stone-100 overflow-hidden w-full max-w-sm">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-700 to-amber-600 px-6 py-5 text-center text-white">
            <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-2">
              <Hotel className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            <p className="text-amber-100 text-sm mt-0.5">
              {isLogin ? 'Sign in to continue' : 'Join Grand Horizon Hotel'}
            </p>
          </div>

          {/* Form */}
          <div className="px-6 py-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-xl mb-3 text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-2.5">
              <div>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm text-stone-700"
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
                      className="w-full pl-10 pr-3 py-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm text-stone-700"
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
                    className="w-full pl-10 pr-10 py-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm text-stone-700"
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
                  <p className="text-xs text-stone-400 mt-1 ml-1">
                    Password must be at least 6 characters
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-700 text-white py-2.5 rounded-xl font-semibold hover:bg-amber-800 transition flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
              >
                {loading ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    Please wait...
                  </>
                ) : (
                  isLogin ? (
                    <>Sign In <LogIn className="w-4 h-4" /></>
                  ) : (
                    <>Create Account <UserPlus className="w-4 h-4" /></>
                  )
                )}
              </button>
            </form>

            <p className="text-center text-stone-400 text-sm mt-3">
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