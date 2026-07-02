import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCheck, UserX, Shield, Clock, CheckCircle } from 'lucide-react';
import API from '../services/api';
import AdminNavbar from '../components/AdminNavbar';
import Footer from '../components/Footer';

const AdminApprovals = () => {
  const navigate = useNavigate();
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);

  const fetchStaff = () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    API.get('/admin/staff/', { headers }).then(res => {
      const staff = res.data.staff || [];
      setPending(staff.filter(s => !s.is_approved));
      setApproved(staff.filter(s => s.is_approved));
    });
  };

  useEffect(() => { fetchStaff(); }, []);

  const handleApprove = async (userId) => {
    const token = localStorage.getItem('token');
    await API.post('/admin/staff/approve/', { user_id: userId }, { headers: { Authorization: `Bearer ${token}` } });
    fetchStaff();
  };

  const handleUnapprove = async (userId) => {
    const token = localStorage.getItem('token');
    await API.post('/admin/staff/unapprove/', { user_id: userId }, { headers: { Authorization: `Bearer ${token}` } });
    fetchStaff();
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <AdminNavbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-900 to-amber-800 text-white py-14 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <UserCheck className="w-5 h-5 text-amber-300" />
            <span className="text-amber-200 text-sm font-medium uppercase tracking-wider">Admin Panel</span>
          </div>
          <h1 className="text-4xl font-bold">Staff Approvals</h1>
          <p className="text-amber-100/80 mt-2">Manage staff access to the system</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-8 -mt-8 relative z-10 pb-16">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-5 mb-10">
          <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-6 flex items-center gap-5">
            <div className="bg-amber-100 w-14 h-14 rounded-2xl flex items-center justify-center">
              <Clock className="w-7 h-7 text-amber-600" />
            </div>
            <div>
              <p className="text-stone-500 text-sm">Pending Approval</p>
              <p className="text-3xl font-bold text-amber-700">{pending.length}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-emerald-200 shadow-sm p-6 flex items-center gap-5">
            <div className="bg-emerald-100 w-14 h-14 rounded-2xl flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <p className="text-stone-500 text-sm">Approved Staff</p>
              <p className="text-3xl font-bold text-emerald-700">{approved.length}</p>
            </div>
          </div>
        </div>

        {/* Pending Section */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-amber-100 w-10 h-10 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-700" />
            </div>
            <h2 className="text-xl font-bold text-stone-800">Pending Approval</h2>
            <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-medium">{pending.length}</span>
          </div>

          {pending.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-stone-700 mb-1">All Caught Up!</h3>
              <p className="text-stone-400">No staff members waiting for approval.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pending.map(s => (
                <div key={s.id} className="bg-white border border-amber-200 rounded-2xl p-5 hover:shadow-md transition-all duration-300 hover:border-amber-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-lg font-bold text-amber-700">{s.username.substring(0, 2).toUpperCase()}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-stone-800 text-lg">{s.username}</h3>
                        <p className="text-stone-500 text-sm">{s.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleApprove(s.id)}
                      className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-emerald-700 transition flex items-center gap-2 shadow-lg shadow-emerald-200"
                    >
                      <UserCheck className="w-4 h-4" /> Approve Staff
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Approved Section */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-emerald-100 w-10 h-10 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-700" />
            </div>
            <h2 className="text-xl font-bold text-stone-800">Approved Staff</h2>
            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium">{approved.length}</span>
          </div>

          {approved.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
              <div className="bg-stone-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-stone-400" />
              </div>
              <h3 className="text-lg font-semibold text-stone-700 mb-1">No Approved Staff</h3>
              <p className="text-stone-400">Approve staff members to grant them access.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {approved.map(s => (
                <div key={s.id} className="bg-white border border-stone-200 rounded-2xl p-5 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-lg font-bold text-emerald-700">{s.username.substring(0, 2).toUpperCase()}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-stone-800 text-lg">{s.username}</h3>
                          <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-medium">Active</span>
                        </div>
                        <p className="text-stone-500 text-sm">{s.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleUnapprove(s.id)}
                      className="bg-amber-50 text-amber-700 px-5 py-2.5 rounded-xl font-medium hover:bg-amber-100 transition flex items-center gap-2 border border-amber-200"
                    >
                      <UserX className="w-4 h-4" /> Revoke Access
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminApprovals;