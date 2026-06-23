import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserCheck, UserX } from 'lucide-react';
import API from '../services/api';
import AdminNavbar from '../components/AdminNavbar';

const AdminApprovals = () => {
  const navigate = useNavigate();
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);

  // ==================== CONNECT TO BACKEND: List All Staff ====================
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

  // ==================== CONNECT TO BACKEND: Approve Staff ====================
  // POST /api/admin/staff/approve/
  const handleApprove = async (userId) => {
    const token = localStorage.getItem('token');
    await API.post('/admin/staff/approve/', { user_id: userId }, { headers: { Authorization: `Bearer ${token}` } });
    fetchStaff();
  };

  // ==================== CONNECT TO BACKEND: Unapprove Staff ====================
  // POST /api/admin/staff/unapprove/
  const handleUnapprove = async (userId) => {
    const token = localStorage.getItem('token');
    await API.post('/admin/staff/unapprove/', { user_id: userId }, { headers: { Authorization: `Bearer ${token}` } });
    fetchStaff();
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto px-8 py-10">
        <button onClick={() => navigate('/admin/dashboard')} className="flex items-center gap-2 text-stone-500 hover:text-amber-700 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-stone-800 mb-8">Staff Approvals</h1>

        {/* Pending */}
        <h2 className="text-lg font-semibold text-amber-700 mb-4">Pending Approval ({pending.length})</h2>
        <div className="grid gap-4 mb-10">
          {pending.map(s => (
            <div key={s.id} className="bg-white border border-amber-200 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <p className="font-semibold text-stone-800">{s.username}</p>
                <p className="text-stone-500 text-sm">{s.email}</p>
              </div>
              <button onClick={() => handleApprove(s.id)} className="bg-emerald-600 text-white px-5 py-2 rounded-full font-medium hover:bg-emerald-700 transition flex items-center gap-2">
                <UserCheck className="w-4 h-4" /> Approve
              </button>
            </div>
          ))}
          {pending.length === 0 && <p className="text-stone-400 text-center py-8">No pending approvals</p>}
        </div>

        {/* Approved */}
        <h2 className="text-lg font-semibold text-emerald-700 mb-4">Approved Staff ({approved.length})</h2>
        <div className="grid gap-4">
          {approved.map(s => (
            <div key={s.id} className="bg-white border border-stone-200 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <p className="font-semibold text-stone-800">{s.username}</p>
                <p className="text-stone-500 text-sm">{s.email}</p>
              </div>
              <button onClick={() => handleUnapprove(s.id)} className="bg-amber-100 text-amber-700 px-5 py-2 rounded-full font-medium hover:bg-amber-200 transition flex items-center gap-2">
                <UserX className="w-4 h-4" /> Unapprove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminApprovals;