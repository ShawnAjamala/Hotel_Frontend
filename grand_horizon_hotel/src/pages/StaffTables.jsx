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

  const [form, setForm] = useState({ table_number: '', capacity: '', price_per_slot: '', location: '' });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => { fetchTables(); }, []);
  const fetchTables = async () => { setLoading(true); try { const res = await API.get('/tables/', { headers }); setTables(Array.isArray(res.data) ? res.data : []); } catch (err) {} setLoading(false); };

  const showPopup = (type, message, onConfirm) => setPopup({ show: true, type, message, onConfirm });
  const closePopup = () => setPopup({ show: false, type: '', message: '', onConfirm: null });
  const handleConfirm = () => { if (popup.onConfirm) popup.onConfirm(); closePopup(); };

  const handleImageChange = (e) => { const file = e.target.files[0]; if (file) { setImage(file); setImagePreview(URL.createObjectURL(file)); } };

  const handleCreate = async (e) => { e.preventDefault(); const fd = new FormData(); Object.entries(form).forEach(([k,v]) => fd.append(k,v)); if(image) fd.append('image',image); try { await API.post('/tables/create/', fd, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }); resetForm(); fetchTables(); } catch (err) { alert('Failed.'); } };
  const handleUpdate = async (e) => { e.preventDefault(); const fd = new FormData(); Object.entries(form).forEach(([k,v]) => fd.append(k,v)); if(image) fd.append('image',image); try { await API.put(`/tables/${editingTable.id}/update/`, fd, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }); resetForm(); fetchTables(); } catch (err) { alert('Failed.'); } };
  const handleDelete = (id) => { showPopup('danger', 'Deactivate this table?', async () => { try { await API.delete(`/tables/${id}/delete/`, { headers }); fetchTables(); } catch (err) {} }); };
  const openEdit = (t) => { setEditingTable(t); setForm({ table_number: t.table_number, capacity: t.capacity, price_per_slot: parseFloat(t.price_per_slot)||'', location: t.location||'' }); setImagePreview(t.image||null); setImage(null); setShowForm(true); };
  const resetForm = () => { setForm({ table_number:'', capacity:'', price_per_slot:'', location:'' }); setImage(null); setImagePreview(null); setEditingTable(null); setShowForm(false); };

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <StaffNavbar />
      {popup.show && (<div className="fixed inset-0 z-50 flex items-center justify-center"><div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closePopup} /><div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center"><div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${popup.type==='danger'?'bg-red-100':'bg-amber-100'}`}><Trash2 className={`w-8 h-8 ${popup.type==='danger'?'text-red-500':'text-amber-600'}`} /></div><h3 className="text-lg font-bold mb-2">Confirm</h3><p className="text-stone-500 mb-6">{popup.message}</p><div className="flex gap-3"><button onClick={closePopup} className="flex-1 py-3 border rounded-xl">Cancel</button><button onClick={handleConfirm} className={`flex-1 py-3 rounded-xl text-white ${popup.type==='danger'?'bg-red-500':'bg-amber-600'}`}>Confirm</button></div></div></div>)}
      <section className="bg-gradient-to-br from-amber-900 to-amber-800 text-white py-14 px-8">
        <div className="max-w-7xl mx-auto">
          <button onClick={() => navigate('/staff/dashboard')} className="flex items-center gap-2 text-amber-200 hover:text-white transition mb-4"><ArrowLeft className="w-4 h-4" /> Back</button>
          <div className="flex items-center justify-between"><div><div className="flex items-center gap-2 mb-2"><UtensilsCrossed className="w-5 h-5 text-amber-300" /><span className="text-amber-200 text-sm uppercase">Staff Management</span></div><h1 className="text-4xl font-bold">Restaurant Tables</h1><p className="text-amber-100/80 mt-2">{tables.length} table{tables.length!==1?'s':''}</p></div><button onClick={()=>{resetForm();setShowForm(!showForm)}} className="bg-white text-amber-900 px-6 py-3 rounded-xl font-semibold hover:bg-amber-50 flex items-center gap-2 shadow-lg"><Plus className="w-5 h-5" /> {showForm?'Close':'Add Table'}</button></div>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-8 -mt-6 relative z-10 pb-16">
        {showForm && (
          <div className="bg-white rounded-2xl shadow-xl border overflow-hidden mb-10">
            <div className="bg-stone-50 px-8 py-5 border-b flex items-center justify-between"><div className="flex items-center gap-3"><div className="bg-amber-100 w-10 h-10 rounded-xl flex items-center justify-center"><UtensilsCrossed className="w-5 h-5 text-amber-700" /></div><h2 className="text-lg font-bold">{editingTable?'Edit Table':'Create Table'}</h2></div><button onClick={resetForm} className="text-stone-400 hover:text-red-500"><X className="w-5 h-5" /></button></div>
            <form onSubmit={editingTable?handleUpdate:handleCreate} className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-stone-700 mb-2">Table Number *</label><input type="text" value={form.table_number} onChange={e=>setForm({...form,table_number:e.target.value})} className="w-full px-4 py-3 border rounded-xl outline-none" placeholder="T1" required /></div>
                    <div><label className="block text-sm font-medium text-stone-700 mb-2">Capacity *</label><div className="relative"><Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" /><input type="number" value={form.capacity} onChange={e=>setForm({...form,capacity:e.target.value})} className="w-full pl-11 pr-4 py-3 border rounded-xl outline-none" placeholder="4" required /></div></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-stone-700 mb-2">Price (KES) *</label><input type="number" value={form.price_per_slot} onChange={e=>setForm({...form,price_per_slot:e.target.value})} className="w-full px-4 py-3 border rounded-xl outline-none" placeholder="1000" required /></div>
                    <div><label className="block text-sm font-medium text-stone-700 mb-2">Location</label><div className="relative"><MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" /><input type="text" value={form.location} onChange={e=>setForm({...form,location:e.target.value})} className="w-full pl-11 pr-4 py-3 border rounded-xl outline-none" placeholder="Indoor" /></div></div>
                  </div>
                </div>
                <div><label className="block text-sm font-medium text-stone-700 mb-2">Image</label><div className="border-2 border-dashed rounded-2xl p-6 text-center hover:border-amber-400 cursor-pointer h-[220px] flex flex-col items-center justify-center bg-stone-50" onClick={()=>document.getElementById('timg').click()}>{imagePreview?<img src={imagePreview} className="h-full object-cover rounded-xl" />:<><ImagePlus className="w-10 h-10 text-stone-300 mb-3" /><p className="text-stone-500 text-sm">Upload</p></>}<input id="timg" type="file" accept="image/*" onChange={handleImageChange} className="hidden" /></div></div>
              </div>
              <div className="mt-8 pt-6 border-t flex gap-4"><button type="submit" className="bg-amber-700 text-white px-8 py-3 rounded-xl font-medium hover:bg-amber-600 shadow-lg">{editingTable?'Update':'Create'}</button><button type="button" onClick={resetForm} className="text-stone-500 text-sm">Cancel</button></div>
            </form>
          </div>
        )}
        {loading?<div className="text-center py-20"><div className="animate-spin w-10 h-10 border-4 border-amber-700 border-t-transparent rounded-full mx-auto" /></div>:tables.length===0?(
          <div className="text-center py-20 bg-white rounded-2xl border"><UtensilsCrossed className="w-16 h-16 text-stone-200 mx-auto mb-4" /><h3 className="text-xl font-semibold text-stone-600">No Tables</h3><button onClick={()=>setShowForm(true)} className="bg-amber-700 text-white px-6 py-3 rounded-xl mt-4">Create First Table</button></div>
        ):(
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tables.map(t => (
              <div key={t.id} className="bg-white rounded-2xl border overflow-hidden hover:shadow-lg transition group">
                <div className="h-48 bg-stone-100 relative">{t.image?<img src={t.image} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />:<div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100"><UtensilsCrossed className="w-12 h-12 text-amber-300" /></div>}<div className="absolute top-3 left-3 bg-white/90 px-3 py-1 rounded-full text-sm font-bold">#{t.table_number}</div><div className="absolute top-3 right-3 bg-amber-700 text-white px-3 py-1 rounded-full text-xs">{t.capacity} pax</div></div>
                <div className="p-5">
                  <div className="flex justify-between mb-2"><h3 className="font-bold">Table {t.table_number}</h3><span className="text-emerald-600 font-bold">KES {parseFloat(t.price_per_slot).toLocaleString()}</span></div>
                  {t.location && <div className="flex items-center gap-1 text-stone-400 text-sm mb-3"><MapPin className="w-3.5 h-3.5" /> {t.location}</div>}
                  <div className="flex gap-3 pt-4 border-t"><button onClick={()=>openEdit(t)} className="flex-1 flex items-center justify-center gap-2 text-sm bg-amber-50 text-amber-700 py-2.5 rounded-xl hover:bg-amber-100"><Edit className="w-4 h-4" /> Edit</button><button onClick={()=>handleDelete(t.id)} className="flex-1 flex items-center justify-center gap-2 text-sm bg-red-50 text-red-500 py-2.5 rounded-xl hover:bg-red-100"><Trash2 className="w-4 h-4" /> Delete</button></div>
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