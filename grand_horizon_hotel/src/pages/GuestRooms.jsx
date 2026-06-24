import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { BedDouble, Users, Filter, Search } from 'lucide-react';
import API from '../services/api';
import GuestNavbar from '../components/GuestNavbar';

const GuestRooms = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [roomType, setRoomType] = useState('all');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };
  const today = new Date().toISOString().split('T')[0];

  const fetchRooms = useCallback(async (ci, co) => {
    setLoading(true);
    const inDate = ci || '2020-01-01';
    const outDate = co || '2099-12-31';
    try {
      const [allRes, availableRes] = await Promise.all([
        API.get('/rooms/', { headers }),
        API.get(`/rooms/available/?check_in=${inDate}&check_out=${outDate}`, { headers }),
      ]);
      const allRooms = Array.isArray(allRes.data) ? allRes.data : (allRes.data.rooms || []);
      const availableRooms = availableRes.data.available_rooms || [];
      const availableIds = new Set(availableRooms.map(r => r.id));
      const marked = allRooms.map(r => ({ ...r, available: availableIds.has(r.id) }));
      setRooms(marked);
      setFilteredRooms(marked);
    } catch {
      try {
        const fallback = await API.get('/rooms/', { headers });
        const data = Array.isArray(fallback.data) ? fallback.data : (fallback.data.rooms || []);
        setRooms(data.map(r => ({ ...r, available: true })));
        setFilteredRooms(data.map(r => ({ ...r, available: true })));
      } catch (e) {}
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchRooms(); }, [fetchRooms]);
  useEffect(() => {
    setFilteredRooms(roomType === 'all' ? rooms : rooms.filter(r => r.room_type === roomType));
  }, [roomType, rooms]);

  const handleSearch = () => { fetchRooms(checkIn, checkOut); };

  return (
    <div className="min-h-screen bg-stone-50">
      <GuestNavbar />
      <section className="relative bg-stone-900 text-white py-16 px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/90 to-transparent" />
        <div className="relative max-w-7xl mx-auto">
          <h1 className="text-5xl font-serif font-bold mb-3">Our Rooms & Suites</h1>
          <p className="text-stone-300 text-lg">Discover the perfect space for your stay.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-8 py-10">
        <div className="bg-white rounded-2xl border p-5 -mt-16 relative z-10 shadow-lg mb-10">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <div>
                <label className="block text-xs text-stone-500 mb-1">Check-in</label>
                <input type="date" value={checkIn} min={today} onChange={e => setCheckIn(e.target.value)} className="px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
              <div>
                <label className="block text-xs text-stone-500 mb-1">Check-out</label>
                <input type="date" value={checkOut} min={checkIn || today} onChange={e => setCheckOut(e.target.value)} className="px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
              <button onClick={handleSearch} className="bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-800 mt-5 flex items-center gap-1">
                <Search className="w-4 h-4" /> Search
              </button>
            </div>
            <div className="flex items-center gap-2 ml-4 pl-4 border-l">
              <Filter className="w-5 h-5 text-stone-400" />
              {['all','single','double','suite','family'].map(t => (
                <button key={t} onClick={() => setRoomType(t)} className={`px-4 py-2 rounded-full text-sm font-medium transition ${roomType===t?'bg-amber-700 text-white shadow-md':'bg-stone-50 text-stone-600 hover:bg-amber-50'}`}>{t==='all'?'All':t.charAt(0).toUpperCase()+t.slice(1)}</button>
              ))}
            </div>
          </div>
        </div>

        {loading ? <div className="text-center py-16"><div className="animate-spin w-10 h-10 border-4 border-amber-700 border-t-transparent rounded-full mx-auto" /></div> : filteredRooms.length===0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border"><BedDouble className="w-16 h-16 text-stone-200 mx-auto mb-4" /><p className="text-stone-500">No rooms available for these dates.</p></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredRooms.map(room => (
              <div key={room.id} className="group bg-white rounded-2xl border overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="h-56 bg-stone-100 relative overflow-hidden">
                  {room.image ? <img src={room.image} loading="lazy" alt={`Room ${room.room_number}`} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" /> : <div className="w-full h-full flex items-center justify-center"><BedDouble className="w-16 h-16 text-stone-300" /></div>}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                    <span className="text-white font-bold text-lg">Room {room.room_number}</span>
                    <span className={`px-3 py-1 rounded-full text-xs capitalize font-medium ${room.available ? 'bg-amber-500 text-white' : 'bg-red-500 text-white'}`}>
                      {room.available ? room.room_type : 'Booked'}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-stone-500 text-sm mb-3 line-clamp-2">{room.description || 'A comfortable stay awaits.'}</p>
                  <div className="flex items-center gap-1 text-stone-400 text-sm mb-3"><Users className="w-4 h-4" /> {room.max_guests} guests</div>
                  <div className="flex justify-between items-center pt-4 border-t">
                    <span className="text-xl font-bold">KES {parseFloat(room.price_per_night).toLocaleString()}<span className="text-stone-400 text-sm font-normal">/night</span></span>
                    {room.available ? (
                      <button onClick={() => navigate(`/guest/rooms/book/${room.id}?check_in=${checkIn}&check_out=${checkOut}`)} className="bg-amber-700 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-amber-800 transition shadow-md">Book Now</button>
                    ) : (
                      <button disabled className="bg-stone-200 text-stone-400 px-6 py-2.5 rounded-full text-sm font-medium cursor-not-allowed">Unavailable</button>
                    )}
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

export default GuestRooms;