import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { BedDouble, Users, Filter, Search, Grid3X3, List } from 'lucide-react';
import API from '../services/api';
import Navbar from '../components/Navbar';        // Public
import GuestNavbar from '../components/GuestNavbar'; // Logged in
import Footer from '../components/Footer';

const GuestRooms = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [roomType, setRoomType] = useState('all');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [page, setPage] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const perPage = 6;

  const token = localStorage.getItem('token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const today = new Date().toISOString().split('T')[0];

  // Check login status
  useEffect(() => {
    const checkAuth = () => {
      const t = localStorage.getItem('token');
      setIsLoggedIn(!!t);
    };
    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

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
        const marked = data.map(r => ({ ...r, available: true }));
        setRooms(marked); 
        setFilteredRooms(marked);
      } catch (e) {}
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchRooms(); }, [fetchRooms]);
  useEffect(() => { 
    setFilteredRooms(roomType === 'all' ? rooms : rooms.filter(r => r.room_type === roomType)); 
    setPage(1); 
  }, [roomType, rooms]);

  const handleSearch = () => fetchRooms(checkIn, checkOut);

  const totalPages = Math.ceil(filteredRooms.length / perPage);
  const paginated = filteredRooms.slice((page - 1) * perPage, page * perPage);

  // Handle Book Now click - redirect to login if not logged in
  const handleBookNow = (roomId) => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      navigate(`/guest/rooms/book/${roomId}?check_in=${checkIn}&check_out=${checkOut}`);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {isLoggedIn ? <GuestNavbar /> : <Navbar />}
      
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
                <button key={t} onClick={() => setRoomType(t)} className={`px-4 py-2 rounded-full text-sm font-medium transition ${roomType === t ? 'bg-amber-700 text-white shadow-md' : 'bg-stone-50 text-stone-600 hover:bg-amber-50'}`}>
                  {t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex bg-stone-100 rounded-lg p-1 ml-auto">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md transition ${viewMode === 'grid' ? 'bg-white text-amber-700 shadow-sm' : 'text-stone-500 hover:text-amber-700'}`}>
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded-md transition ${viewMode === 'list' ? 'bg-white text-amber-700 shadow-sm' : 'text-stone-500 hover:text-amber-700'}`}>
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin w-10 h-10 border-4 border-amber-700 border-t-transparent rounded-full mx-auto" />
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border">
            <BedDouble className="w-16 h-16 text-stone-200 mx-auto mb-4" />
            <p className="text-stone-500">No rooms available.</p>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginated.map(room => (
                  <div key={room.id} className="group bg-white rounded-2xl border overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="h-56 bg-stone-100 relative overflow-hidden">
                      {room.image ? (
                        <img src={room.image} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BedDouble className="w-16 h-16 text-stone-300" />
                        </div>
                      )}
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
                      <div className="flex items-center gap-1 text-stone-400 text-sm mb-3">
                        <Users className="w-4 h-4" /> {room.max_guests} guests
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t">
                        <span className="text-xl font-bold">
                          KES {parseFloat(room.price_per_night).toLocaleString()}
                          <span className="text-stone-400 text-sm font-normal">/night</span>
                        </span>
                        {room.available ? (
                          <button 
                            onClick={() => handleBookNow(room.id)} 
                            className="bg-amber-700 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-amber-800 shadow-md"
                          >
                            Book Now
                          </button>
                        ) : (
                          <button disabled className="bg-stone-200 text-stone-400 px-6 py-2.5 rounded-full text-sm font-medium cursor-not-allowed">
                            Unavailable
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {paginated.map(room => (
                  <div key={room.id} className="bg-white rounded-2xl border p-5 flex items-center justify-between hover:shadow-md transition">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-stone-100 overflow-hidden flex-shrink-0">
                        {room.image ? (
                          <img src={room.image} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BedDouble className="w-8 h-8 text-stone-300" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-stone-800">
                          Room {room.room_number}{' '}
                          <span className={`text-xs px-2 py-0.5 rounded-full capitalize ml-2 ${room.available ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-600'}`}>
                            {room.available ? room.room_type : 'Booked'}
                          </span>
                        </h3>
                        <p className="text-stone-500 text-sm">
                          {room.description || 'No description'} • <Users className="w-3 h-3 inline" /> {room.max_guests} guests
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="font-bold text-stone-800">
                        KES {parseFloat(room.price_per_night).toLocaleString()}
                        <span className="text-stone-400 text-xs font-normal">/night</span>
                      </span>
                      {room.available ? (
                        <button 
                          onClick={() => handleBookNow(room.id)} 
                          className="bg-amber-700 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-amber-800"
                        >
                          Book Now
                        </button>
                      ) : (
                        <button disabled className="bg-stone-200 text-stone-400 px-5 py-2 rounded-full text-sm cursor-not-allowed">
                          Unavailable
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-10">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 bg-white border rounded-xl text-sm hover:border-amber-400 disabled:opacity-40">
                  ← Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)} className={`w-9 h-9 rounded-xl text-sm font-medium transition ${page === p ? 'bg-amber-700 text-white' : 'bg-white border text-stone-600 hover:border-amber-400'}`}>
                    {p}
                  </button>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 bg-white border rounded-xl text-sm hover:border-amber-400 disabled:opacity-40">
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default GuestRooms;