import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BedDouble, Users, ArrowLeft, Filter } from 'lucide-react';
import API from '../services/api';
import GuestNavbar from '../components/GuestNavbar';

const GuestRooms = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [roomType, setRoomType] = useState('all');

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => { fetchAvailableRooms(); }, []);

  // ==================== CONNECT TO BACKEND: Get Available Rooms Only ====================
  // GET /api/rooms/available/ — excludes rooms with confirmed/checked_in bookings
  // Uses wide date range to show all available rooms
  const fetchAvailableRooms = async () => {
    setLoading(true);
    try {
      const res = await API.get('/rooms/available/?check_in=2020-01-01&check_out=2099-12-31', { headers });
      const data = res.data.available_rooms || [];
      setRooms(data);
      setFilteredRooms(data);
    } catch (err) {
      // Fallback to all rooms if available endpoint fails
      try {
        const res = await API.get('/rooms/', { headers });
        const data = Array.isArray(res.data) ? res.data : (res.data.rooms || []);
        setRooms(data);
        setFilteredRooms(data);
      } catch (e) {
        console.log('Error fetching rooms:', e);
      }
    }
    setLoading(false);
  };

  // ==================== Filter by Room Type ====================
  useEffect(() => {
    if (roomType === 'all') setFilteredRooms(rooms);
    else setFilteredRooms(rooms.filter(r => r.room_type === roomType));
  }, [roomType, rooms]);

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <GuestNavbar />

      {/* Classy Hero Header */}
      <section className="relative bg-stone-900 text-white py-20 px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/90 to-transparent" />
        <div className="relative max-w-7xl mx-auto">
          <button onClick={() => navigate('/guest/dashboard')} className="flex items-center gap-2 text-amber-300 hover:text-amber-200 transition mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          <h1 className="text-5xl font-serif font-bold mb-3 tracking-tight">Our Rooms & Suites</h1>
          <p className="text-stone-300 text-lg max-w-lg">Discover the perfect space for your stay. Every room tells a story of comfort and elegance.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-8 py-10">
        {/* Filter Bar */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 -mt-16 relative z-10 shadow-lg mb-10">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-stone-400" />
            <span className="text-sm font-medium text-stone-700">Filter by type:</span>
            <div className="flex gap-2">
              {[
                { value: 'all', label: 'All Rooms' },
                { value: 'single', label: 'Single' },
                { value: 'double', label: 'Double' },
                { value: 'suite', label: 'Suite' },
                { value: 'family', label: 'Family' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setRoomType(opt.value)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition ${
                    roomType === opt.value 
                      ? 'bg-amber-700 text-white shadow-md' 
                      : 'bg-stone-50 text-stone-600 hover:bg-amber-50 hover:text-amber-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Rooms Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin w-10 h-10 border-4 border-amber-700 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-stone-500">Loading available rooms...</p>
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
            <BedDouble className="w-20 h-20 text-stone-200 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-stone-600 mb-2">No Rooms Available</h3>
            <p className="text-stone-400">{roomType !== 'all' ? `No ${roomType} rooms available right now.` : 'All rooms are currently booked. Please check back later.'}</p>
          </div>
        ) : (
          <>
            <p className="text-stone-500 mb-6">{filteredRooms.length} room{filteredRooms.length !== 1 ? 's' : ''} available{roomType !== 'all' && ` in ${roomType}`}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRooms.map(room => (
                <div key={room.id} className="group bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  {/* Image */}
                  <div className="h-56 bg-stone-100 overflow-hidden relative">
                    {room.image ? (
                      <img src={room.image} alt={`Room ${room.room_number}`} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200">
                        <BedDouble className="w-16 h-16 text-stone-300" />
                        <span className="text-stone-400 text-sm mt-2">No image</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                      <span className="text-white font-bold text-lg">Room {room.room_number}</span>
                      <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-medium capitalize">{room.room_type}</span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-5">
                    <p className="text-stone-500 text-sm mb-4 line-clamp-2 leading-relaxed">{room.description || 'A comfortable stay awaits you at Grand Horizon Hotel.'}</p>
                    
                    <div className="flex items-center gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-1 text-stone-500"><Users className="w-4 h-4" /> {room.max_guests} guests</div>
                    </div>

                    {room.amenities && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {room.amenities.split(',').slice(0, 4).map((a, i) => (
                          <span key={i} className="bg-stone-100 text-stone-500 text-xs px-2.5 py-1 rounded-full">{a.trim()}</span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                      <div>
                        <span className="text-xl font-bold text-stone-800">KES {parseFloat(room.price_per_night).toLocaleString()}</span>
                        <span className="text-stone-400 text-sm"> /night</span>
                      </div>
                      <button 
                        onClick={() => navigate(`/guest/rooms/book/${room.id}`)}
                        className="bg-amber-700 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-amber-800 transition shadow-md hover:shadow-lg"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GuestRooms;