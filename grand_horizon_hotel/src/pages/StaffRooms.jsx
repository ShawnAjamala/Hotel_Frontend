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
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ==================== Form State ====================
  const [form, setForm] = useState({
    room_number: '', room_type: 'single', price_per_night: '',
    max_guests: '', description: '', amenities: ''
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  // ==================== CONNECT TO BACKEND: Fetch All Rooms ====================
  // GET /api/rooms/ — returns array of room objects with Cloudinary image URLs
  const fetchRooms = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await API.get('/rooms/', { headers });
      const data = Array.isArray(res.data) ? res.data : (res.data.rooms || []);
      setRooms(data);
      setTotalPages(Math.ceil(data.length / 9));
    } catch (err) {
      setError('Failed to load rooms. Please try again.');
      setRooms([]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchRooms(); }, []);

  // ==================== Image Handler ====================
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // ==================== CONNECT TO BACKEND: Create Room with Image ====================
  // POST /api/rooms/create/ — accepts form-data with image file
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

  // ==================== CONNECT TO BACKEND: Update Room ====================
  // PUT /api/rooms/{id}/update/ — accepts form-data
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

  // ==================== CONNECT TO BACKEND: Delete Room (Soft Delete) ====================
  // DELETE /api/rooms/{id}/delete/
  const handleDelete = async (roomId) => {
    if (!window.confirm('Deactivate this room? It will be hidden from guests.')) return;
    try {
      await API.delete(`/rooms/${roomId}/delete/`, { headers });
      fetchRooms();
    } catch (err) {
      setError('Failed to delete room.');
    }
  };

  // ==================== Open Edit Form with Room Data ====================
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

  // ==================== Reset Form ====================
  const resetForm = () => {
    setForm({ room_number: '', room_type: 'single', price_per_night: '', max_guests: '', description: '', amenities: '' });
    setImage(null);
    setImagePreview(null);
    setEditingRoom(null);
    setShowForm(false);
    setError('');
  };

  // ==================== Pagination ====================
  const roomsPerPage = 9;
  const paginatedRooms = rooms.slice((page - 1) * roomsPerPage, page * roomsPerPage);
  const totalPagesCalc = Math.ceil(rooms.length / roomsPerPage) || 1;

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <StaffNavbar />
      <div className="max-w-7xl mx-auto px-8 py-10">
        {/* Back Button */}
        <button onClick={() => navigate('/staff/dashboard')} className="flex items-center gap-2 text-stone-500 hover:text-amber-700 mb-6 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-stone-800">Room Management</h1>
            <p className="text-stone-500 mt-1">{rooms.length} room{rooms.length !== 1 ? 's' : ''} total</p>
          </div>
          <button 
            onClick={() => { resetForm(); setShowForm(!showForm); }} 
            className="bg-amber-700 text-white px-6 py-3 rounded-full font-medium hover:bg-amber-800 transition flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> {showForm ? 'Close Form' : 'Add Room'}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm">{error}</div>
        )}

        {/* ==================== CREATE / EDIT FORM ==================== */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-stone-200 p-8 mb-10 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-stone-800">
                {editingRoom ? `Edit Room ${editingRoom.room_number}` : 'Create New Room'}
              </h2>
              <button onClick={resetForm} className="text-stone-400 hover:text-red-500 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={editingRoom ? handleUpdate : handleCreate}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Room Number */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Room Number *</label>
                  <input 
                    type="text" 
                    value={form.room_number} 
                    onChange={e => setForm({...form, room_number: e.target.value})} 
                    className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition" 
                    placeholder="e.g. 101"
                    required 
                  />
                </div>

                {/* Room Type */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Room Type *</label>
                  <select 
                    value={form.room_type} 
                    onChange={e => setForm({...form, room_type: e.target.value})} 
                    className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none bg-white"
                  >
                    <option value="single">Single</option>
                    <option value="double">Double</option>
                    <option value="suite">Suite</option>
                    <option value="family">Family</option>
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Price per Night (KES) *</label>
                  <input 
                    type="number" 
                    value={form.price_per_night} 
                    onChange={e => setForm({...form, price_per_night: e.target.value})} 
                    className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none" 
                    placeholder="e.g. 5000"
                    required 
                  />
                </div>

                {/* Max Guests */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Max Guests *</label>
                  <input 
                    type="number" 
                    value={form.max_guests} 
                    onChange={e => setForm({...form, max_guests: e.target.value})} 
                    className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none" 
                    placeholder="e.g. 2"
                    required 
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
                  <input 
                    type="text" 
                    value={form.description} 
                    onChange={e => setForm({...form, description: e.target.value})} 
                    className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none" 
                    placeholder="Cozy single room with city view"
                  />
                </div>

                {/* Amenities */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Amenities</label>
                  <input 
                    type="text" 
                    value={form.amenities} 
                    onChange={e => setForm({...form, amenities: e.target.value})} 
                    className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none" 
                    placeholder="WiFi, TV, AC"
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Room Image</label>
                  <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-stone-300 rounded-xl cursor-pointer hover:border-amber-400 transition">
                    <ImagePlus className="w-5 h-5 text-stone-400" />
                    <span className="text-stone-500 text-sm truncate">{image ? image.name : 'Upload image'}</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                </div>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-stone-500 mb-2">Preview</p>
                    <img src={imagePreview} alt="Preview" className="h-24 rounded-xl object-cover border border-stone-200" />
                  </div>
                )}
              </div>

              {/* Submit */}
              <button 
                type="submit" 
                className="mt-8 bg-amber-700 text-white px-8 py-3 rounded-full font-medium hover:bg-amber-800 transition"
              >
                {editingRoom ? 'Update Room' : 'Create Room'}
              </button>
            </form>
          </div>
        )}

        {/* ==================== ROOMS GRID ==================== */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-amber-700 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-stone-500">Loading rooms...</p>
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
            <BedDouble className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-stone-600 mb-2">No Rooms Yet</h3>
            <p className="text-stone-400 mb-6">Create your first room to get started.</p>
            <button onClick={() => setShowForm(true)} className="bg-amber-700 text-white px-6 py-3 rounded-full font-medium hover:bg-amber-800 transition">
              Add Your First Room
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedRooms.map(room => (
                <div key={room.id} className="bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
                  {/* Room Image */}
                  <div className="h-52 bg-stone-100 overflow-hidden relative">
                    {room.image ? (
                      <img 
                        src={room.image} 
                        alt={`Room ${room.room_number}`} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100">
                        <BedDouble className="w-16 h-16 text-stone-300" />
                        <span className="text-stone-400 text-sm mt-2">No image</span>
                      </div>
                    )}
                    {/* Room Number Badge */}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-stone-800">
                      #{room.room_number}
                    </div>
                    {/* Type Badge */}
                    <div className="absolute top-4 right-4 bg-amber-700/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-white capitalize">
                      {room.room_type}
                    </div>
                  </div>

                  {/* Room Details */}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-bold text-stone-800">Room {room.room_number}</h3>
                      <span className="text-emerald-600 font-bold text-lg">KES {parseFloat(room.price_per_night).toLocaleString()}<span className="text-stone-400 text-sm font-normal">/night</span></span>
                    </div>
                    
                    <p className="text-stone-500 text-sm mb-3 line-clamp-2">{room.description || 'No description provided'}</p>
                    
                    <div className="flex items-center gap-1 text-stone-400 text-sm mb-3">
                      <Users className="w-4 h-4" />
                      <span>Up to {room.max_guests} guest{room.max_guests > 1 ? 's' : ''}</span>
                    </div>

                    {room.amenities && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {room.amenities.split(',').slice(0, 3).map((a, i) => (
                          <span key={i} className="bg-stone-100 text-stone-600 text-xs px-2 py-1 rounded-full">{a.trim()}</span>
                        ))}
                        {room.amenities.split(',').length > 3 && (
                          <span className="bg-stone-100 text-stone-500 text-xs px-2 py-1 rounded-full">+{room.amenities.split(',').length - 3} more</span>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-stone-100">
                      <button 
                        onClick={() => openEdit(room)} 
                        className="flex-1 flex items-center justify-center gap-2 text-sm bg-amber-100 text-amber-700 py-2.5 rounded-full hover:bg-amber-200 transition font-medium"
                      >
                        <Edit className="w-4 h-4" /> Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(room.id)} 
                        className="flex-1 flex items-center justify-center gap-2 text-sm bg-red-50 text-red-600 py-2.5 rounded-full hover:bg-red-100 transition font-medium"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ==================== PAGINATION ==================== */}
            {totalPagesCalc > 1 && (
              <div className="flex justify-center items-center gap-4 mt-10">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))} 
                  disabled={page === 1} 
                  className="px-5 py-2.5 bg-white border border-stone-200 rounded-full hover:border-amber-400 disabled:opacity-40 transition font-medium text-stone-600"
                >
                  ← Previous
                </button>
                <div className="flex gap-2">
                  {Array.from({ length: totalPagesCalc }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-10 h-10 rounded-full text-sm font-medium transition ${
                        page === p ? 'bg-amber-700 text-white' : 'bg-white border border-stone-200 text-stone-600 hover:border-amber-400'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => setPage(p => Math.min(totalPagesCalc, p + 1))} 
                  disabled={page === totalPagesCalc} 
                  className="px-5 py-2.5 bg-white border border-stone-200 rounded-full hover:border-amber-400 disabled:opacity-40 transition font-medium text-stone-600"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StaffRooms;