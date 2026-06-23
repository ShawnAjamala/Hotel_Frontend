import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, PartyPopper, X, ImagePlus, Users } from 'lucide-react';
import API from '../services/api';
import StaffNavbar from '../components/StaffNavbar';

const StaffVenues = () => {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingVenue, setEditingVenue] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({ name: '', venue_type: 'wedding', capacity: '', price_per_day: '', description: '', additional_packages: '' });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => { fetchVenues(); }, []);
  const fetchVenues = async () => { setLoading(true); try { const res = await API.get('/venues/', { headers }); setVenues(Array.isArray(res.data) ? res.data : []); } catch (err) {} setLoading(false); };

  const handleImageChange = (e) => { const file = e.target.files[0]; if (file) { setImage(file); setImagePreview(URL.createObjectURL(file)); } };

  const handleCreate = async (e) => { e.preventDefault(); const fd = new FormData(); Object.entries(form).forEach(([k,v]) => fd.append(k,v)); if(image) fd.append('image',image); try { await API.post('/venues/create/', fd, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }); resetForm(); fetchVenues(); } catch (err) {} };
  const handleUpdate = async (e) => { e.preventDefault(); const fd = new FormData(); Object.entries(form).forEach(([k,v]) => fd.append(k,v)); if(image) fd.append('image',image); try { await API.put(`/venues/${editingVenue.id}/update/`, fd, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }); resetForm(); fetchVenues(); } catch (err) {} };
  const handleDelete = async (id) => { if (!window.confirm('Deactivate?')) return; try { await API.delete(`/venues/${id}/delete/`, { headers }); fetchVenues(); } catch (err) {} };

  const openEdit = (v) => { setEditingVenue(v); setForm({ name: v.name, venue_type: v.venue_type, capacity: v.capacity, price_per_day: parseFloat(v.price_per_day)||'', description: v.description||'', additional_packages: v.additional_packages||'' }); setImagePreview(v.image||null); setImage(null); setShowForm(true); };
  const resetForm = () => { setForm({ name:'', venue_type:'wedding', capacity:'', price_per_day:'', description:'', additional_packages:'' }); setImage(null); setImagePreview(null); setEditingVenue(null); setShowForm(false); };

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <StaffNavbar />
      <section className="bg-gradient-to-br from-amber-900 to-amber-800 text-white py-14 px-8">
        <div className="max-w-7xl mx-auto">
          <button onClick={() => navigate('/staff/dashboard')} className="flex items-center gap-2 text-amber-200 hover:text-white mb-4"><ArrowLeft className="w-4 h-4" /> Back</button>
          <div className="flex items-center justify-between"><div><div className="flex items-center gap-2 mb-2"><PartyPopper className="w-5 h-5 text-amber-300" /><span className="text-amber-200 text-sm uppercase">Staff Management</span></div><h1 className="text-4xl font-bold">Event Venues</h1><p className="text-amber-100/80 mt-2">{venues.length} venue{venues.length!==1?'s':''}</p></div><button onClick={()=>{resetForm();setShowForm(!showForm)}} className="bg-white text-amber-900 px-6 py-3 rounded-xl font-semibold hover:bg-amber-50 flex items-center gap-2 shadow-lg"><Plus className="w-5 h-5" /> {showForm?'Close':'Add Venue'}</button></div>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-8 -mt-6 z-10 pb-16">
        {showForm && (
          <div className="bg-white rounded-2xl shadow-xl border overflow-hidden mb-10">
            <div className="bg-stone-50 px-8 py-5 border-b flex justify-between"><div className="flex items-center gap-3"><div className="bg-amber-100 w-10 h-10 rounded-xl flex items-center justify-center"><PartyPopper className="w-5 h-5 text-amber-700" /></div><h2 className="text-lg font-bold">{editingVenue?'Edit Venue':'Create Venue'}</h2></div><button onClick={resetForm} className="text-stone-400 hover:text-red-500"><X className="w-5 h-5" /></button></div>
            <form onSubmit={editingVenue?handleUpdate:handleCreate} className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-5">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2"><label className="block text-sm font-medium text-stone-700 mb-2">Name *</label><input type="text" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full px-4 py-3 border rounded-xl outline-none" placeholder="Grand Ballroom" required /></div>
                    <div><label className="block text-sm font-medium text-stone-700 mb-2">Type *</label><select value={form.venue_type} onChange={e=>setForm({...form,venue_type:e.target.value})} className="w-full px-4 py-3 border rounded-xl outline-none bg-white"><option value="wedding">Wedding</option><option value="birthday">Birthday</option><option value="other">Other</option></select></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-stone-700 mb-2">Capacity *</label><input type="number" value={form.capacity} onChange={e=>setForm({...form,capacity:e.target.value})} className="w-full px-4 py-3 border rounded-xl outline-none" placeholder="200" required /></div>
                    <div><label className="block text-sm font-medium text-stone-700 mb-2">Price/Day (KES) *</label><input type="number" value={form.price_per_day} onChange={e=>setForm({...form,price_per_day:e.target.value})} className="w-full px-4 py-3 border rounded-xl outline-none" placeholder="50000" required /></div>
                  </div>
                  <div><label className="block text-sm font-medium text-stone-700 mb-2">Description</label><input type="text" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="w-full px-4 py-3 border rounded-xl outline-none" placeholder="Elegant ballroom" /></div>
                  <div><label className="block text-sm font-medium text-stone-700 mb-2">Packages</label><input type="text" value={form.additional_packages} onChange={e=>setForm({...form,additional_packages:e.target.value})} className="w-full px-4 py-3 border rounded-xl outline-none" placeholder="Wedding Decor: 5000 | Birthday: 2000" /></div>
                </div>
                <div><label className="block text-sm font-medium text-stone-700 mb-2">Image</label><div className="border-2 border-dashed rounded-2xl p-6 text-center hover:border-amber-400 cursor-pointer h-[220px] flex flex-col items-center justify-center bg-stone-50" onClick={()=>document.getElementById('vimg').click()}>{imagePreview?<img src={imagePreview} className="h-full object-cover rounded-xl" />:<><ImagePlus className="w-10 h-10 text-stone-300 mb-3" /><p className="text-stone-500 text-sm">Upload</p></>}<input id="vimg" type="file" accept="image/*" onChange={handleImageChange} className="hidden" /></div></div>
              </div>
              <div className="mt-8 pt-6 border-t flex gap-4"><button type="submit" className="bg-amber-700 text-white px-8 py-3 rounded-xl font-medium hover:bg-amber-600 shadow-lg">{editingVenue?'Update':'Create'}</button><button type="button" onClick={resetForm} className="text-stone-500 text-sm">Cancel</button></div>
            </form>
          </div>
        )}
        {loading?<div className="text-center py-20"><div className="animate-spin w-10 h-10 border-4 border-amber-700 border-t-transparent rounded-full mx-auto" /></div>:venues.length===0?(
          <div className="text-center py-20 bg-white rounded-2xl border"><PartyPopper className="w-16 h-16 text-stone-200 mx-auto mb-4" /><h3 className="text-xl font-semibold text-stone-600">No Venues</h3><button onClick={()=>setShowForm(true)} className="bg-amber-700 text-white px-6 py-3 rounded-xl mt-4">Create First Venue</button></div>
        ):(
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {venues.map(v => (
              <div key={v.id} className="bg-white rounded-2xl border overflow-hidden hover:shadow-lg transition group">
                <div className="h-48 bg-stone-100 relative">{v.image?<img src={v.image} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />:<div className="w-full h-full flex items-center justify-center"><PartyPopper className="w-12 h-12 text-stone-300" /></div>}<div className="absolute top-3 left-3 bg-white/90 px-3 py-1 rounded-full text-sm font-bold">{v.name}</div><div className="absolute top-3 right-3 bg-amber-700 text-white px-3 py-1 rounded-full text-xs capitalize">{v.venue_type}</div></div>
                <div className="p-5">
                  <div className="flex justify-between mb-2"><h3 className="font-bold">{v.name}</h3><span className="text-emerald-600 font-bold">KES {parseFloat(v.price_per_day).toLocaleString()}<span className="text-stone-400 text-xs">/day</span></span></div>
                  <div className="flex items-center gap-1 text-stone-400 text-xs mb-3"><Users className="w-3 h-3" /> {v.capacity} guests</div>
                  <div className="flex gap-3 pt-4 border-t"><button onClick={()=>openEdit(v)} className="flex-1 flex items-center justify-center gap-2 text-sm bg-amber-50 text-amber-700 py-2.5 rounded-xl hover:bg-amber-100"><Edit className="w-4 h-4" /> Edit</button><button onClick={()=>handleDelete(v.id)} className="flex-1 flex items-center justify-center gap-2 text-sm bg-red-50 text-red-500 py-2.5 rounded-xl hover:bg-red-100"><Trash2 className="w-4 h-4" /> Delete</button></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffVenues;