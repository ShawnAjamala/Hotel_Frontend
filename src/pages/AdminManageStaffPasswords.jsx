// src/pages/AdminManageStaffPasswords.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Lock, Eye, EyeOff, Save, X, Search, 
  Shield, User, Mail, Key, CheckCircle, XCircle,
  ArrowLeft
} from 'lucide-react';
import API from '../services/api';
import AdminNavbar from '../components/AdminNavbar';
import Footer from '../components/Footer';

const AdminManageStaffPasswords = () => {
  const navigate = useNavigate();
  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchStaff();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setFilteredStaff(staff.filter(s => 
        s.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    } else {
      setFilteredStaff(staff);
    }
  }, [searchTerm, staff]);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await API.get('/admin/staff/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStaff(res.data.staff || []);
      setFilteredStaff(res.data.staff || []);
    } catch (error) {
      console.error('Error fetching staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (staffMember) => {
    setSelectedStaff(staffMember);
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
    setShowSuccess(false);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStaff(null);
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
    setShowSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setShowSuccess(false);

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      await API.post(`/admin/users/${selectedStaff.id}/change-password/`, {
        new_password: newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess(`Password for ${selectedStaff.username} changed successfully!`);
      setShowSuccess(true);
      
      // Update staff list
      const updatedStaff = staff.map(s => 
        s.id === selectedStaff.id ? { ...s, must_change_password: true } : s
      );
      setStaff(updatedStaff);
      setFilteredStaff(updatedStaff);
      
      setTimeout(() => {
        handleCloseModal();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to change password');
    } finally {
      setSubmitting(false);
    }
  };

  const getRoleBadge = (role) => {
    if (role === 'admin') {
      return <span className="bg-purple-100 text-purple-700 px-2.5 py-0.5 rounded-full text-xs font-medium">Admin</span>;
    }
    return <span className="bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full text-xs font-medium">Staff</span>;
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <AdminNavbar />

      <section className="relative bg-gradient-to-br from-amber-900 to-amber-800 text-white py-14 px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/90 to-transparent" />
        <div className="relative max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500/20 p-3 rounded-xl">
              <Key className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Staff Password Management</h1>
              <p className="text-amber-100/80 mt-1">Manage and reset staff member passwords</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-8 -mt-6 relative z-10 pb-16">
        {/* Search and Stats */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-amber-100 w-10 h-10 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <p className="text-sm text-stone-500">Total Staff</p>
                <p className="text-2xl font-bold text-stone-800">{staff.length}</p>
              </div>
            </div>
            
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Search staff by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm"
              />
            </div>
          </div>
        </div>

        {/* Staff List */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin w-10 h-10 border-4 border-amber-700 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-stone-500">Loading staff...</p>
          </div>
        ) : filteredStaff.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
            <Users className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-stone-600 mb-2">No Staff Found</h3>
            <p className="text-stone-400">
              {searchTerm ? 'No staff match your search criteria.' : 'No staff members have been created yet.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredStaff.map((member) => (
              <div key={member.id} className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 hover:shadow-md transition group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-amber-100 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-amber-700" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-stone-800 truncate">{member.username}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      {getRoleBadge(member.role)}
                      {member.must_change_password && (
                        <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full text-[10px] font-medium">
                          Needs Change
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-stone-500 mb-4">
                  <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{member.email}</span>
                </div>

                <button
                  onClick={() => handleOpenModal(member)}
                  className="w-full flex items-center justify-center gap-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl py-2.5 text-sm font-medium hover:bg-amber-100 transition group-hover:border-amber-300"
                >
                  <Lock className="w-4 h-4" />
                  Reset Password
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleCloseModal} />
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full mx-auto overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-amber-700 to-amber-600 px-6 py-5 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center">
                    <Lock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Reset Password</h3>
                    <p className="text-amber-100 text-sm">{selectedStaff.username}</p>
                  </div>
                </div>
                <button onClick={handleCloseModal} className="text-white/70 hover:text-white transition">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {showSuccess ? (
                <div className="text-center py-6">
                  <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h4 className="text-lg font-bold text-stone-800 mb-2">Password Reset!</h4>
                  <p className="text-sm text-stone-500">{success}</p>
                  <p className="text-xs text-stone-400 mt-2">Staff will be prompted to change on next login</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2.5 rounded-xl mb-4 text-sm flex items-center gap-2">
                      <XCircle className="w-4 h-4 flex-shrink-0" />
                      {error}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1.5">
                        New Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full pl-10 pr-10 py-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm"
                          placeholder="Enter new password (min 6 chars)"
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
                      <p className="text-xs text-stone-400 mt-1.5">Must be at least 6 characters</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1.5">
                        Confirm Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm"
                          placeholder="Confirm new password"
                          required
                        />
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                      <p className="text-xs text-amber-700">
                        <span className="font-medium">Note:</span> Staff will be required to change their password on next login.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="flex-1 py-2.5 border border-stone-200 rounded-xl text-stone-600 font-medium hover:bg-stone-50 transition text-sm"
                      disabled={submitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 py-2.5 bg-amber-700 text-white rounded-xl font-medium hover:bg-amber-800 transition disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                          Resetting...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Reset Password
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AdminManageStaffPasswords;