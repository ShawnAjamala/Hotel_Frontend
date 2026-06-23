import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, UtensilsCrossed, X, ImagePlus, Users, MapPin } from 'lucide-react';
import API from '../services/api';
import StaffNavbar from '../components/StaffNavbar';

const StaffTables = () => {
  const navigate = useNavigate();
  const [tables, setTables] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({ show: false, type: '', message: '', onConfirm: null });

  const [form, setForm] = useState({
    table_number: '', capacity: '', price_per_slot: '', location: ''
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => { fetchTables(); }, []);

  const fetchTables = async () => {
    setLoading(true);
    try {
      const res = await API.get('/tables/', { headers });
      setTables(Array.isArray(res.data) ? res.data : []);
    } catch (err) { console.log('Error:', err); }
    setLoading(false);
  };

  // Styled Popup
  const showPopup = (type, message, onConfirm) => setPopup({ show: true, type, message, onConfirm });
  const closePopup = () => setPopup({ show: false, type: '', message: '', onConfirm: null });
  const handleConfirm = () => { if (popup.onConfirm) popup.onConfirm(); closePopup(); };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) { setImage(file); setImagePreview(URL.createObjectURL(file)); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));
    if (image) formData.append('image', image);
    try {
      await API.post('/tables/create/', formData, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } });
      resetForm(); fetchTables();
    } catch (err) { alert('Failed to create table.'); }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));
    if (image) formData.append('image', image);
    try {
      await API.put(`/tables/${editingTable.id}/update/`, formData, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } });
      resetForm(); fetchTables();
    } catch (err) { alert('Failed to update table.'); }
  };

  const handleDelete = (tableId) => {
    showPopup('danger', 'Deactivate this table? It will be hidden from guests.', async () => {
      try { await API.delete(`/tables/${tableId}/delete/`, { headers }); fetchTables(); } catch (err) { alert('Failed.'); }
    });
  };

  const openEdit = (table) => {
    setEditingTable(table);
    setForm({ table_number: table.table_number, capacity: table.capacity, price_per_slot: parseFloat(table.price_per_slot) || '', location: table.location || '' });
    setImagePreview(table.image || null);
    setImage(null);
    setShowForm(true);
  };

  const resetForm = () => {
    setForm({ table_number: '', capacity: '', price_per_slot: '', location: '' });
    setImage(null); setImagePreview(null); setEditingTable(null); setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <StaffNavbar />

      {/* Popup */}
      {popup.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closePopup} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${popup.type === 'danger' ? 'bg-red-100' : 'bg-amber-100'}`}>
              <Trash2 className={`w-8 h-8 ${popup.type === 'danger' ? 'text-red-500' : 'text-amber-600'}`} />
            </div>
            <h3 className="text-lg font-bold text-stone-800 mb-2">Confirm Action</h3>
            <p className="text-stone-500 mb-6">{popup.message}</p>
            <div className="flex gap-3">
              <button onClick={closePopup} className="flex-1 py-3 border border-stone-200 rounded-xl text-stone-600 font-medium hover:bg-stone-50">Cancel</button>
              <button onClick={handleConfirm} className={`flex-1 py-3 rounded-xl font-medium text-white transition ${popup.type === 'danger' ? 'bg-red-500 hover:bg-red-600' : 'bg-amber-600 hover:bg-amber-700'}`}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* Staff Hero — matches StaffRooms */}
      <section className="relative bg-gradient-to-br from-amber-900 to-amber-800 text-white py-14 px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/90 to-transparent" />
        <div className="relative max-w-7xl mx-auto">
          <button onClick={() => navigate('/staff/dashboard')} className="flex items-center gap-2 text-amber-200 hover:text-white transition mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <UtensilsCrossed className="w-5 h-5 text-amber-300" />
                <span className="text-amber-200 text-sm font-medium tracking-wider uppercase">Staff Management</span>
              </div>
              <h1 className="text-4xl font-bold">Restaurant Tables</h1>
              <p className="text-amber-100/80 mt-2">{tables.length} table{tables.length !== 1 ? 's' : ''} in the system</p>
            </div>
            <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="bg-white text-amber-900 px-6 py-3 rounded-xl font-semibold hover:bg-amber-50 transition flex items-center gap-2 shadow-lg">
              <Plus className="w-5 h-5" /> {showForm ? 'Close Form' : 'Add Table'}
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-8 -mt-6 relative z-10 pb-16">
        {/* Form — same layout as StaffRooms */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-xl border border-stone-100 overflow-hidden mb-10">
            <div className="bg-stone-50 px-8 py-5 border-b border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-amber-100 w-10 h-10 rounded-xl flex items-center justify-center">
                  <UtensilsCrossed className="w-5 h-5 text-amber-700" />
                </div>
                <h2 className="text-lg font-bold text-stone-800">{editingTable ? `Edit Table ${editingTable.table_number}` : 'Create New Table'}</h2>
              </div>
              <button onClick={resetForm} className="text-stone-400 hover:text-red-500 transition"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={editingTable ? handleUpdate : handleCreate} className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">Table Number *</label>
                      <input type="text" value={form.table_number} onChange={e => setForm({...form, table_number: e.target.value})} className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none" placeholder="e.g. T1" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">Capacity (pax) *</label>
                      <div className="relative">
                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                        <input type="number" value={form.capacity} onChange={e => setForm({...form, capacity: e.target.value})} className="w-full pl-11 pr-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none" placeholder="4" required />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">Price per Slot (KES) *</label>
                      <input type="number" value={form.price_per_slot} onChange={e => setForm({...form, price_per_slot: e.target.value})} className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none" placeholder="1000" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">Location</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                        <input type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="w-full pl-11 pr-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none" placeholder="Indoor, Terrace..." />
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Table Image</label>
                  <div className="border-2 border-dashed border-stone-300 rounded-2xl p-6 text-center hover:border-amber-400 transition cursor-pointer h-[220px] flex flex-col items-center justify-center bg-stone-50" onClick={() => document.getElementById('tableImgInput').click()}>
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="h-full object-cover rounded-xl" />
                    ) : (
                      <>
                        <ImagePlus className="w-10 h-10 text-stone-300 mb-3" />
                        <p className="text-stone-500 text-sm font-medium">Upload Image</p>
                        <p className="text-stone-400 text-xs mt-1">JPG, PNG or WebP</p>
                      </>
                    )}
                    <input id="tableImgInput" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-stone-100 flex items-center gap-4">
                <button type="submit" className="bg-amber-700 text-white px-8 py-3 rounded-xl font-medium hover:bg-amber-600 transition shadow-lg shadow-amber-200">
                  {editingTable ? 'Update Table' : 'Create Table'}
                </button>
                <button type="button" onClick={resetForm} className="text-stone-500 hover:text-stone-700 transition text-sm font-medium">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="text-center py-20"><div className="animate-spin w-10 h-10 border-4 border-amber-700 border-t-transparent rounded-full mx-auto mb-4" /><p className="text-stone-500">Loading...</p></div>
        ) : tables.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-stone-100 shadow-sm">
            <UtensilsCrossed className="w-16 h-16 text-stone-200 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-stone-600 mb-2">No Tables Yet</h3>
            <p className="text-stone-400 mb-6">Create your first table to start accepting reservations.</p>
            <button onClick={() => setShowForm(true)} className="bg-amber-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-amber-600 transition">Create First Table</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tables.map(table => (
              <div key={table.id} className="bg-white rounded-2xl border border-stone-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                <div className="h-48 bg-stone-100 overflow-hidden relative">
                  {table.image ? (
                    <img src={table.image} alt={table.table_number} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100"><UtensilsCrossed className="w-12 h-12 text-amber-300" /></div>
                  )}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold">#{table.table_number}</div>
                  <div className="absolute top-3 right-3 bg-amber-700 text-white px-3 py-1 rounded-full text-xs font-medium">{table.capacity} pax</div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-stone-800 text-lg">Table {table.table_number}</h3>
                    <span className="text-emerald-600 font-bold">KES {parseFloat(table.price_per_slot).toLocaleString()}</span>
                  </div>
                  {table.location && (
                    <div className="flex items-center gap-1 text-stone-400 text-sm mb-3"><MapPin className="w-3.5 h-3.5" /> {table.location}</div>
                  )}
                  <div className="flex gap-3 pt-4 border-t border-stone-100">
                    <button onClick={() => openEdit(table)} className="flex-1 flex items-center justify-center gap-2 text-sm bg-amber-50 text-amber-700 py-2.5 rounded-xl hover:bg-amber-100 transition font-medium"><Edit className="w-4 h-4" /> Edit</button>
                    <button onClick={() => handleDelete(table.id)} className="flex-1 flex items-center justify-center gap-2 text-sm bg-red-50 text-red-500 py-2.5 rounded-xl hover:bg-red-100 transition font-medium"><Trash2 className="w-4 h-4" /> Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffTables;