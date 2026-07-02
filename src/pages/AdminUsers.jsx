import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Trash2, Search } from 'lucide-react';
import API from '../services/api';
import AdminNavbar from '../components/AdminNavbar';
import Footer from '../components/Footer';

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [popup, setPopup] = useState({ show: false, userId: null, username: '' });
  const perPage = 8;

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    API.get('/admin/users/', { headers }).then(res => setUsers(res.data.users || [])).catch(() => {});
  }, []);

  const handleDelete = async () => {
    await API.delete(`/admin/users/${popup.userId}/delete/`, { headers });
    setUsers(users.filter(u => u.id !== popup.userId));
    setPopup({ show: false, userId: null, username: '' });
  };

  const filteredUsers = users.filter(u => {
    if (filter === 'guests') return u.role === 'guest';
    if (filter === 'staff') return u.role === 'staff';
    if (filter === 'admins') return u.role === 'admin';
    return true;
  }).filter(u => u.username.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  const totalPages = Math.ceil(filteredUsers.length / perPage);
  const paginated = filteredUsers.slice((page - 1) * perPage, page * perPage);

  const roleBadge = (role) => {
    const config = { admin: 'bg-purple-100 text-purple-700', staff: 'bg-blue-100 text-blue-700', guest: 'bg-emerald-100 text-emerald-700' };
    return config[role] || 'bg-stone-100 text-stone-600';
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <AdminNavbar />

      {popup.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setPopup({ show: false, userId: null, username: '' })} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 className="w-8 h-8 text-red-500" /></div>
            <h3 className="text-lg font-bold text-stone-800 mb-2">Delete User</h3>
            <p className="text-stone-500 mb-6">Permanently delete <strong>{popup.username}</strong>? This cannot be undone.</p>
            <div className="flex gap-3"><button onClick={() => setPopup({ show: false, userId: null, username: '' })} className="flex-1 py-3 border border-stone-200 rounded-xl text-stone-600 font-medium hover:bg-stone-50">Cancel</button><button onClick={handleDelete} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600">Delete</button></div>
          </div>
        </div>
      )}

      <section className="bg-gradient-to-br from-amber-900 to-amber-800 text-white py-14 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-2"><Users className="w-5 h-5 text-amber-300" /><span className="text-amber-200 text-sm font-medium uppercase">Admin Panel</span></div>
          <h1 className="text-4xl font-bold">User Management</h1>
          <p className="text-amber-100/80 mt-2">{users.length} total users</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-8 -mt-6 relative z-10 pb-16">
        <div className="bg-white rounded-2xl shadow-sm border p-5 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex gap-2">
              {['all', 'guests', 'staff', 'admins'].map(f => (
                <button key={f} onClick={() => { setFilter(f); setPage(1); }} className={`px-4 py-2 rounded-full text-sm font-medium transition ${filter === f ? 'bg-amber-700 text-white shadow-md' : 'bg-stone-100 text-stone-600 hover:bg-amber-100'}`}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
              ))}
            </div>
            <div className="relative ml-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search users..." className="pl-10 pr-4 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-500 w-56" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border overflow-hidden">
          <table className="w-full">
            <thead className="bg-stone-50 border-b"><tr><th className="text-left px-6 py-4 text-sm font-medium text-stone-500">User</th><th className="text-left px-6 py-4 text-sm font-medium text-stone-500">Email</th><th className="text-left px-6 py-4 text-sm font-medium text-stone-500">Role</th><th className="text-left px-6 py-4 text-sm font-medium text-stone-500">Status</th><th className="text-right px-6 py-4 text-sm font-medium text-stone-500">Actions</th></tr></thead>
            <tbody>
              {paginated.map(u => (
                <tr key={u.id} className="border-b hover:bg-stone-50 transition">
                  <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center"><span className="text-sm font-bold text-amber-700">{u.username.substring(0, 2).toUpperCase()}</span></div><span className="font-medium text-stone-800">{u.username}</span></div></td>
                  <td className="px-6 py-4 text-stone-500 text-sm">{u.email}</td>
                  <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs font-medium ${roleBadge(u.role)}`}>{u.role}</span></td>
                  <td className="px-6 py-4">{u.role === 'staff' ? (u.is_approved ? <span className="text-emerald-600 text-sm">Approved</span> : <span className="text-amber-600 text-sm">Pending</span>) : <span className="text-stone-400">—</span>}</td>
                  <td className="px-6 py-4 text-right"><button onClick={() => setPopup({ show: true, userId: u.id, username: u.username })} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition"><Trash2 className="w-4 h-4" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-8">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 bg-white border rounded-xl text-sm hover:border-amber-400 disabled:opacity-40">← Prev</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (<button key={p} onClick={() => setPage(p)} className={`w-9 h-9 rounded-xl text-sm font-medium transition ${page === p ? 'bg-amber-700 text-white' : 'bg-white border text-stone-600 hover:border-amber-400'}`}>{p}</button>))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 bg-white border rounded-xl text-sm hover:border-amber-400 disabled:opacity-40">Next →</button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AdminUsers;