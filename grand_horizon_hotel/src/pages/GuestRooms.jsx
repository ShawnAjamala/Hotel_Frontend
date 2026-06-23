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

  // ==================== CONNECT TO BACKEND: Fetch All Rooms ====================
  // GET /api/rooms/ — returns array of all active room objects with Cloudinary image URLs
  useEffect(() => {
    fetchAllRooms();
  }, []);

  const fetchAllRooms = async () => {
    setLoading(true);
    try {
      const res = await API.get('/rooms/', { headers });
      const data = Array.isArray(res.data) ? res.data : (res.data.rooms || res.data.results || []);
      setRooms(data);
      setFilteredRooms(data);
    } catch (err) {
      console.log('Error fetching rooms:', err);
    }
    setLoading(false);
  };

  // ==================== Filter by Room Type Only ====================
  // No date filter — date is chosen when booking a specific room
  useEffect(() => {
    if (roomType === 'all') {
      setFilteredRooms(rooms);
    } else {
      setFilteredRooms(rooms.filter(r => r.room_type === roomType));
    }
  }, [roomType, rooms]);

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <GuestNavbar />

      <div className="max-w-7xl mx-auto px-8 py-10">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/guest/dashboard')} 
          className="flex items-center gap-2 text-stone-500 hover:text-amber-700 mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-800 mb-2">Our Rooms</h1>
          <p className="text-stone-500">Choose your perfect stay from our luxurious rooms</p>
        </div>

        {/* ==================== ROOM TYPE FILTER ==================== */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 mb-8">
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
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    roomType === opt.value 
                      ? 'bg-amber-700 text-white' 
                      : 'bg-stone-100 text-stone-600 hover:bg-amber-100 hover:text-amber-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ==================== ROOMS GRID ==================== */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin w-10 h-10 border-4 border-amber-700 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-stone-500">Loading rooms...</p>
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
            <BedDouble className="w-20 h-20 text-stone-200 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-stone-600 mb-2">No Rooms Found</h3>
            <p className="text-stone-400">
              {roomType !== 'all' 
                ? `No ${roomType} rooms available. Try another type.` 
                : 'No rooms available at the moment. Please check back later.'}
            </p>
          </div>
        ) : (
          <>
            <p className="text-stone-500 mb-4">
              {filteredRooms.length} room{filteredRooms.length !== 1 ? 's' : ''} found
              {roomType !== 'all' && <span> in {roomType}</span>}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRooms.map(room => (
                <div 
                  key={room.id} 
                  className="bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-lg transition-all duration-300 group"
                >
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
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-bold text-stone-800 shadow-sm">
                      Room {room.room_number}
                    </div>
                    {/* Type Badge */}
                    <div className="absolute top-4 right-4 bg-amber-700 text-white px-3 py-1.5 rounded-full text-xs font-medium capitalize shadow-sm">
                      {room.room_type}
                    </div>
                  </div>

                  {/* Room Details */}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-bold text-stone-800">Room {room.room_number}</h3>
                      <span className="text-emerald-600 font-bold text-lg">
                        KES {parseFloat(room.price_per_night).toLocaleString()}
                        <span className="text-stone-400 text-sm font-normal">/night</span>
                      </span>
                    </div>

                    <p className="text-stone-500 text-sm mb-3 line-clamp-2">
                      {room.description || 'A comfortable stay awaits you.'}
                    </p>

                    <div className="flex items-center gap-1 text-stone-400 text-sm mb-3">
                      <Users className="w-4 h-4" />
                      <span>Up to {room.max_guests} guest{room.max_guests > 1 ? 's' : ''}</span>
                    </div>

                    {/* Amenities */}
                    {room.amenities && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {room.amenities.split(',').slice(0, 4).map((a, i) => (
                          <span key={i} className="bg-stone-100 text-stone-600 text-xs px-2 py-1 rounded-full">
                            {a.trim()}
                          </span>
                        ))}
                        {room.amenities.split(',').length > 4 && (
                          <span className="bg-stone-100 text-stone-500 text-xs px-2 py-1 rounded-full">
                            +{room.amenities.split(',').length - 4} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Book Button */}
                    <button 
                      onClick={() => navigate(`/guest/rooms/book/${room.id}`)}
                      className="w-full bg-amber-700 text-white py-3 rounded-xl font-medium hover:bg-amber-800 transition mt-2"
                    >
                      Book Now
                    </button>
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