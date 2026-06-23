import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Trash2, Shield, UserCheck, UserX } from 'lucide-react';
import API from '../services/api';
import AdminNavbar from '../components/AdminNavbar';

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('all'); // all, guests, staff, admins

  // ==================== CONNECT TO BACKEND: List All Users ====================
  // GET /api/admin/users/ — returns all users with roles and approval status
  useEffect(() => {
    const token = localStorage.getItem('token');
    API.get('/admin/users/', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setUsers(res.data.users || []))
      .catch(() => {});
  }, []);

  // ==================== CONNECT TO BACKEND: Delete User ====================
  // DELETE /api/admin/users/{id}/delete/
  const handleDelete = async (userId) => {
    if (!window.confirm('Delete this user permanently?')) return;
    const token = localStorage.getItem('token');
    await API.delete(`/admin/users/${userId}/delete/`, { headers: { Authorization: `Bearer ${token}` } });
    setUsers(users.filter(u => u.id !== userId));
  };

  const filteredUsers = users.filter(u => {
    if (filter === 'guests') return u.role === 'guest';
    if (filter === 'staff') return u.role === 'staff';
    if (filter === 'admins') return u.role === 'admin';
    return true;
  });

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto px-8 py-10">
        <button onClick={() => navigate('/admin/dashboard')} className="flex items-center gap-2 text-stone-500 hover:text-amber-700 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-stone-800">All Users</h1>
          <div className="flex gap-2">
            {['all', 'guests', 'staff', 'admins'].map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-full text-sm font-medium transition ${filter === f ? 'bg-amber-700 text-white' : 'bg-white text-stone-600 border border-stone-200 hover:border-amber-400'}`}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-stone-50 border-b">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-stone-500">User</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-stone-500">Email</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-stone-500">Role</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-stone-500">Status</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-stone-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => (
                <tr key={u.id} className="border-b hover:bg-stone-50">
                  <td className="px-6 py-4 font-medium text-stone-800">{u.username}</td>
                  <td className="px-6 py-4 text-stone-500">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : u.role === 'staff' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {u.role === 'staff' ? (
                      u.is_approved ? <span className="text-emerald-600 text-sm">Approved</span> : <span className="text-amber-600 text-sm">Pending</span>
                    ) : <span className="text-stone-400">—</span>}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(u.id)} className="text-red-400 hover:text-red-600 transition">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;