import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, BedDouble, X, ImagePlus, Users, Building } from 'lucide-react';
import API from '../services/api';
import StaffNavbar from '../components/StaffNavbar';

const StaffRooms = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    room_number: '', room_type: 'single', price_per_night: '', max_guests: '', description: '', amenities: ''
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => { fetchRooms(); }, []);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await API.get('/rooms/', { headers });
      setRooms(Array.isArray(res.data) ? res.data : (res.data.rooms || []));
    } catch (err) { console.log('Error:', err); }
    setLoading(false);
  };

  const handleImageChange = (e) => { const file = e.target.files[0]; if (file) { setImage(file); setImagePreview(URL.createObjectURL(file)); } };

  const handleCreate = async (e) => {
    e.preventDefault();
    const formData = new FormData(); Object.entries(form).forEach(([k, v]) => formData.append(k, v)); if (image) formData.append('image', image);
    try { await API.post('/rooms/create/', formData, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }); resetForm(); fetchRooms(); } catch (err) { alert('Failed.'); }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData(); Object.entries(form).forEach(([k, v]) => formData.append(k, v)); if (image) formData.append('image', image);
    try { await API.put(`/rooms/${editingRoom.id}/update/`, formData, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }); resetForm(); fetchRooms(); } catch (err) { alert('Failed.'); }
  };

  const handleDelete = async (id) => { if (!window.confirm('Deactivate?')) return; try { await API.delete(`/rooms/${id}/delete/`, { headers }); fetchRooms(); } catch (err) { alert('Failed.'); } };

  const openEdit = (room) => {
    setEditingRoom(room);
    setForm({ room_number: room.room_number, room_type: room.room_type, price_per_night: parseFloat(room.price_per_night) || '', max_guests: room.max_guests, description: room.description || '', amenities: room.amenities || '' });
    setImagePreview(room.image || null); setImage(null); setShowForm(true);
  };

  const resetForm = () => { setForm({ room_number: '', room_type: 'single', price_per_night: '', max_guests: '', description: '', amenities: '' }); setImage(null); setImagePreview(null); setEditingRoom(null); setShowForm(false); };

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <StaffNavbar />
      <section className="bg-gradient-to-br from-amber-900 to-amber-800 text-white py-14 px-8">
        <div className="max-w-7xl mx-auto">
          <button onClick={() => navigate('/staff/dashboard')} className="flex items-center gap-2 text-amber-200 hover:text-white transition mb-4"><ArrowLeft className="w-4 h-4" /> Back to Dashboard</button>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2"><Building className="w-5 h-5 text-amber-300" /><span className="text-amber-200 text-sm font-medium uppercase">Staff Management</span></div>
              <h1 className="text-4xl font-bold">Room Management</h1>
              <p className="text-amber-100/80 mt-2">{rooms.length} room{rooms.length !== 1 ? 's' : ''}</p>
            </div>
            <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="bg-white text-amber-900 px-6 py-3 rounded-xl font-semibold hover:bg-amber-50 transition flex items-center gap-2 shadow-lg"><Plus className="w-5 h-5" /> {showForm ? 'Close' : 'Add Room'}</button>
          </div>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-8 -mt-6 relative z-10 pb-16">
        {showForm && (
          <div className="bg-white rounded-2xl shadow-xl border border-stone-100 overflow-hidden mb-10">
            <div className="bg-stone-50 px-8 py-5 border-b border-stone-100 flex items-center justify-between"><div className="flex items-center gap-3"><div className="bg-amber-100 w-10 h-10 rounded-xl flex items-center justify-center"><BedDouble className="w-5 h-5 text-amber-700" /></div><h2 className="text-lg font-bold text-stone-800">{editingRoom ? 'Edit Room' : 'Create Room'}</h2></div><button onClick={resetForm} className="text-stone-400 hover:text-red-500"><X className="w-5 h-5" /></button></div>
            <form onSubmit={editingRoom ? handleUpdate : handleCreate} className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-5">
                  <div className="grid grid-cols-3 gap-4">
                    <div><label className="block text-sm font-medium text-stone-700 mb-2">Room Number *</label><input type="text" value={form.room_number} onChange={e => setForm({...form, room_number: e.target.value})} className="w-full px-4 py-3 border border-stone-200 rounded-xl outline-none" placeholder="101" required /></div>
                    <div><label className="block text-sm font-medium text-stone-700 mb-2">Type *</label><select value={form.room_type} onChange={e => setForm({...form, room_type: e.target.value})} className="w-full px-4 py-3 border border-stone-200 rounded-xl outline-none bg-white"><option value="single">Single</option><option value="double">Double</option><option value="suite">Suite</option><option value="family">Family</option></select></div>
                    <div><label className="block text-sm font-medium text-stone-700 mb-2">Price/Night *</label><input type="number" value={form.price_per_night} onChange={e => setForm({...form, price_per_night: e.target.value})} className="w-full px-4 py-3 border border-stone-200 rounded-xl outline-none" placeholder="5000" required /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-stone-700 mb-2">Max Guests *</label><input type="number" value={form.max_guests} onChange={e => setForm({...form, max_guests: e.target.value})} className="w-full px-4 py-3 border border-stone-200 rounded-xl outline-none" placeholder="2" required /></div>
                    <div><label className="block text-sm font-medium text-stone-700 mb-2">Amenities</label><input type="text" value={form.amenities} onChange={e => setForm({...form, amenities: e.target.value})} className="w-full px-4 py-3 border border-stone-200 rounded-xl outline-none" placeholder="WiFi, TV, AC" /></div>
                  </div>
                  <div><label className="block text-sm font-medium text-stone-700 mb-2">Description</label><input type="text" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full px-4 py-3 border border-stone-200 rounded-xl outline-none" placeholder="Cozy room" /></div>
                </div>
                <div><label className="block text-sm font-medium text-stone-700 mb-2">Room Image</label><div className="border-2 border-dashed border-stone-300 rounded-2xl p-6 text-center hover:border-amber-400 cursor-pointer h-[220px] flex flex-col items-center justify-center bg-stone-50" onClick={() => document.getElementById('rimg').click()}>{imagePreview ? <img src={imagePreview} alt="Preview" className="h-full object-cover rounded-xl" /> : <><ImagePlus className="w-10 h-10 text-stone-300 mb-3" /><p className="text-stone-500 text-sm">Upload Image</p></>}<input id="rimg" type="file" accept="image/*" onChange={handleImageChange} className="hidden" /></div></div>
              </div>
              <div className="mt-8 pt-6 border-t flex items-center gap-4"><button type="submit" className="bg-amber-700 text-white px-8 py-3 rounded-xl font-medium hover:bg-amber-600 shadow-lg shadow-amber-200">{editingRoom ? 'Update' : 'Create'}</button><button type="button" onClick={resetForm} className="text-stone-500 hover:text-stone-700 text-sm">Cancel</button></div>
            </form>
          </div>
        )}
        {loading ? <div className="text-center py-20"><div className="animate-spin w-10 h-10 border-4 border-amber-700 border-t-transparent rounded-full mx-auto mb-4" /></div> : rooms.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border"><BedDouble className="w-16 h-16 text-stone-200 mx-auto mb-4" /><h3 className="text-xl font-semibold text-stone-600">No Rooms</h3><button onClick={() => setShowForm(true)} className="bg-amber-700 text-white px-6 py-3 rounded-xl mt-4">Create First Room</button></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {rooms.slice(0, 9).map(room => (
              <div key={room.id} className="bg-white rounded-2xl border overflow-hidden hover:shadow-lg transition group">
                <div className="h-48 bg-stone-100 relative">{room.image ? <img src={room.image} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" /> : <div className="w-full h-full flex items-center justify-center"><BedDouble className="w-12 h-12 text-stone-300" /></div>}<div className="absolute top-3 left-3 bg-white/90 px-3 py-1 rounded-full text-sm font-bold">#{room.room_number}</div><div className="absolute top-3 right-3 bg-amber-700 text-white px-3 py-1 rounded-full text-xs capitalize">{room.room_type}</div></div>
                <div className="p-5">
                  <div className="flex justify-between mb-2"><h3 className="font-bold">Room {room.room_number}</h3><span className="text-emerald-600 font-bold">KES {parseFloat(room.price_per_night).toLocaleString()}<span className="text-stone-400 text-xs font-normal">/night</span></span></div>
                  <p className="text-stone-500 text-sm mb-3 line-clamp-2">{room.description || 'No description'}</p>
                  <div className="flex items-center gap-1 text-stone-400 text-xs mb-3"><Users className="w-3 h-3" /> {room.max_guests} guests</div>
                  <div className="flex gap-3 pt-4 border-t"><button onClick={() => openEdit(room)} className="flex-1 flex items-center justify-center gap-2 text-sm bg-amber-50 text-amber-700 py-2.5 rounded-xl hover:bg-amber-100"><Edit className="w-4 h-4" /> Edit</button><button onClick={() => handleDelete(room.id)} className="flex-1 flex items-center justify-center gap-2 text-sm bg-red-50 text-red-500 py-2.5 rounded-xl hover:bg-red-100"><Trash2 className="w-4 h-4" /> Delete</button></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffRooms;