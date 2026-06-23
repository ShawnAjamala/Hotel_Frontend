import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, BedDouble, X, ImagePlus, Users } from 'lucide-react';
import API from '../services/api';
import StaffNavbar from '../components/StaffNavbar';

const StaffRooms = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    room_number: '', room_type: 'single', price_per_night: '',
    max_guests: '', description: '', amenities: ''
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  // ==================== Fetch Rooms ====================
  const fetchRooms = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await API.get('/rooms/', { headers });
      const data = Array.isArray(res.data) ? res.data : (res.data.rooms || []);
      setRooms(data);
    } catch (err) {
      setError('Failed to load rooms.');
      setRooms([]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchRooms(); }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // ==================== Create Room ====================
  const handleCreate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('room_number', form.room_number);
    formData.append('room_type', form.room_type);
    formData.append('price_per_night', form.price_per_night);
    formData.append('max_guests', form.max_guests);
    formData.append('description', form.description);
    formData.append('amenities', form.amenities);
    if (image) formData.append('image', image);

    try {
      await API.post('/rooms/create/', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      resetForm();
      fetchRooms();
    } catch (err) {
      setError('Failed to create room.');
    }
  };

  // ==================== Update Room ====================
  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('room_number', form.room_number);
    formData.append('room_type', form.room_type);
    formData.append('price_per_night', form.price_per_night);
    formData.append('max_guests', form.max_guests);
    formData.append('description', form.description);
    formData.append('amenities', form.amenities);
    if (image) formData.append('image', image);

    try {
      await API.put(`/rooms/${editingRoom.id}/update/`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      resetForm();
      fetchRooms();
    } catch (err) {
      setError('Failed to update room.');
    }
  };

  // ==================== Delete Room ====================
  const handleDelete = async (roomId) => {
    if (!window.confirm('Deactivate this room?')) return;
    try {
      await API.delete(`/rooms/${roomId}/delete/`, { headers });
      fetchRooms();
    } catch (err) {
      setError('Failed to delete room.');
    }
  };

  const openEdit = (room) => {
    setEditingRoom(room);
    setForm({
      room_number: room.room_number,
      room_type: room.room_type,
      price_per_night: parseFloat(room.price_per_night) || '',
      max_guests: room.max_guests,
      description: room.description || '',
      amenities: room.amenities || '',
    });
    setImagePreview(room.image || null);
    setImage(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setForm({ room_number: '', room_type: 'single', price_per_night: '', max_guests: '', description: '', amenities: '' });
    setImage(null);
    setImagePreview(null);
    setEditingRoom(null);
    setShowForm(false);
    setError('');
  };

  const roomsPerPage = 9;
  const paginatedRooms = rooms.slice((page - 1) * roomsPerPage, page * roomsPerPage);
  const totalPages = Math.ceil(rooms.length / roomsPerPage) || 1;

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <StaffNavbar />
      <div className="max-w-7xl mx-auto px-8 py-10">
        <button onClick={() => navigate('/staff/dashboard')} className="flex items-center gap-2 text-stone-500 hover:text-amber-700 mb-6 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-stone-800">Room Management</h1>
            <p className="text-stone-500 mt-1">{rooms.length} room{rooms.length !== 1 ? 's' : ''} total</p>
          </div>
          <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="bg-amber-700 text-white px-6 py-3 rounded-full font-medium hover:bg-amber-800 transition flex items-center gap-2">
            <Plus className="w-5 h-5" /> {showForm ? 'Close Form' : 'Add Room'}
          </button>
        </div>

        {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm">{error}</div>}

        {/* ==================== COMPACT CREATE/EDIT FORM ==================== */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-10 shadow-sm max-w-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-stone-800">
                {editingRoom ? `Edit Room ${editingRoom.room_number}` : 'Create New Room'}
              </h2>
              <button onClick={resetForm} className="text-stone-400 hover:text-red-500 transition"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={editingRoom ? handleUpdate : handleCreate}>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Room Number *</label>
                  <input type="text" value={form.room_number} onChange={e => setForm({...form, room_number: e.target.value})} className="w-full px-3 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm" placeholder="101" required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Type *</label>
                  <select value={form.room_type} onChange={e => setForm({...form, room_type: e.target.value})} className="w-full px-3 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm bg-white">
                    <option value="single">Single</option><option value="double">Double</option><option value="suite">Suite</option><option value="family">Family</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Price/Night (KES) *</label>
                  <input type="number" value={form.price_per_night} onChange={e => setForm({...form, price_per_night: e.target.value})} className="w-full px-3 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm" placeholder="5000" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Max Guests *</label>
                  <input type="number" value={form.max_guests} onChange={e => setForm({...form, max_guests: e.target.value})} className="w-full px-3 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm" placeholder="2" required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Amenities</label>
                  <input type="text" value={form.amenities} onChange={e => setForm({...form, amenities: e.target.value})} className="w-full px-3 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm" placeholder="WiFi, TV, AC" />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-medium text-stone-600 mb-1">Description</label>
                <input type="text" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full px-3 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm" placeholder="Cozy room with city view" />
              </div>

              <div className="flex items-center gap-4 mb-5">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-stone-600 mb-1">Room Image</label>
                  <label className="flex items-center gap-2 px-3 py-2.5 border-2 border-dashed border-stone-300 rounded-lg cursor-pointer hover:border-amber-400 transition">
                    <ImagePlus className="w-4 h-4 text-stone-400" />
                    <span className="text-stone-500 text-xs truncate">{image ? image.name : 'Upload image'}</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                </div>
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="h-16 w-20 rounded-lg object-cover border border-stone-200" />
                )}
              </div>

              <button type="submit" className="bg-amber-700 text-white px-8 py-2.5 rounded-full text-sm font-medium hover:bg-amber-800 transition">
                {editingRoom ? 'Update Room' : 'Create Room'}
              </button>
            </form>
          </div>
        )}

        {/* ==================== ROOMS GRID ==================== */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-amber-700 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-stone-500">Loading rooms...</p>
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
            <BedDouble className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-stone-600 mb-2">No Rooms Yet</h3>
            <p className="text-stone-400 mb-6">Create your first room to get started.</p>
            <button onClick={() => setShowForm(true)} className="bg-amber-700 text-white px-6 py-3 rounded-full font-medium hover:bg-amber-800 transition">Add Your First Room</button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedRooms.map(room => (
                <div key={room.id} className="bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-lg transition group">
                  <div className="h-48 bg-stone-100 overflow-hidden relative">
                    {room.image ? (
                      <img src={room.image} alt={`Room ${room.room_number}`} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><BedDouble className="w-12 h-12 text-stone-300" /></div>
                    )}
                    <div className="absolute top-3 left-3 bg-white/90 px-2 py-1 rounded-full text-xs font-bold">#{room.room_number}</div>
                    <div className="absolute top-3 right-3 bg-amber-700 text-white px-2 py-1 rounded-full text-xs font-medium capitalize">{room.room_type}</div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-stone-800">Room {room.room_number}</h3>
                      <span className="text-emerald-600 font-bold">KES {parseFloat(room.price_per_night).toLocaleString()}<span className="text-stone-400 text-xs font-normal">/night</span></span>
                    </div>
                    <p className="text-stone-500 text-sm mb-2 line-clamp-2">{room.description || 'No description'}</p>
                    <div className="flex items-center gap-1 text-stone-400 text-xs mb-3"><Users className="w-3 h-3" /> Up to {room.max_guests} guests</div>
                    {room.amenities && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {room.amenities.split(',').slice(0, 3).map((a, i) => (
                          <span key={i} className="bg-stone-100 text-stone-500 text-xs px-2 py-0.5 rounded-full">{a.trim()}</span>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2 pt-3 border-t border-stone-100">
                      <button onClick={() => openEdit(room)} className="flex-1 flex items-center justify-center gap-1 text-xs bg-amber-100 text-amber-700 py-2 rounded-full hover:bg-amber-200 transition font-medium"><Edit className="w-3 h-3" /> Edit</button>
                      <button onClick={() => handleDelete(room.id)} className="flex-1 flex items-center justify-center gap-1 text-xs bg-red-50 text-red-600 py-2 rounded-full hover:bg-red-100 transition font-medium"><Trash2 className="w-3 h-3" /> Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-10">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 bg-white border border-stone-200 rounded-full text-sm hover:border-amber-400 disabled:opacity-40">← Prev</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-full text-sm font-medium transition ${page === p ? 'bg-amber-700 text-white' : 'bg-white border border-stone-200 text-stone-600 hover:border-amber-400'}`}>{p}</button>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 bg-white border border-stone-200 rounded-full text-sm hover:border-amber-400 disabled:opacity-40">Next →</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StaffRooms;