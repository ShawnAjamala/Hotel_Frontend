import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, PartyPopper, Users, Filter } from 'lucide-react';
import API from '../services/api';
import GuestNavbar from '../components/GuestNavbar';

const GuestVenues = () => {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [eventType, setEventType] = useState('all');

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => { fetchVenues(); }, []);

  const fetchVenues = async () => {
    setLoading(true);
    try {
      const res = await API.get('/venues/', { headers });
      const data = Array.isArray(res.data) ? res.data : [];
      setVenues(data);
      setFilteredVenues(data);
    } catch (err) { console.log('Error:', err); }
    setLoading(false);
  };

  useEffect(() => {
    if (eventType === 'all') setFilteredVenues(venues);
    else setFilteredVenues(venues.filter(v => v.venue_type === eventType));
  }, [eventType, venues]);

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <GuestNavbar />
      <section className="relative bg-stone-900 text-white py-20 px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/90 to-transparent" />
        <div className="relative max-w-7xl mx-auto">
          <button onClick={() => navigate('/guest/dashboard')} className="flex items-center gap-2 text-amber-300 hover:text-amber-200 transition mb-6"><ArrowLeft className="w-4 h-4" /> Back to Dashboard</button>
          <h1 className="text-5xl font-serif font-bold mb-3">Event Venues</h1>
          <p className="text-stone-300 text-lg max-w-lg">Plan your perfect celebration in our stunning spaces.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-8 py-10">
        <div className="bg-white rounded-2xl border p-5 -mt-16 relative z-10 shadow-lg mb-10">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-stone-400" />
            <span className="text-sm font-medium">Filter:</span>
            {['all','wedding','birthday','other'].map(t => (
              <button key={t} onClick={() => setEventType(t)} className={`px-5 py-2.5 rounded-full text-sm font-medium transition ${eventType===t?'bg-amber-700 text-white shadow-md':'bg-stone-50 text-stone-600 hover:bg-amber-50'}`}>{t==='all'?'All':t.charAt(0).toUpperCase()+t.slice(1)}</button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16"><div className="animate-spin w-10 h-10 border-4 border-amber-700 border-t-transparent rounded-full mx-auto mb-4" /></div>
        ) : filteredVenues.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border"><PartyPopper className="w-16 h-16 text-stone-200 mx-auto mb-4" /><h3 className="text-xl font-semibold text-stone-600">No Venues Available</h3></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVenues.map(venue => (
              <div key={venue.id} className="group bg-white rounded-2xl border overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="h-56 bg-stone-100 overflow-hidden relative">
                  {venue.image ? <img src={venue.image} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" /> : <div className="w-full h-full flex items-center justify-center"><PartyPopper className="w-16 h-16 text-stone-300" /></div>}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between"><span className="text-white font-bold text-lg">{venue.name}</span><span className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs capitalize">{venue.venue_type}</span></div>
                </div>
                <div className="p-5">
                  <p className="text-stone-500 text-sm mb-4 line-clamp-2">{venue.description || 'Beautiful event space'}</p>
                  <div className="flex items-center gap-1 text-stone-500 text-sm mb-3"><Users className="w-4 h-4" /> {venue.capacity} guests</div>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-xl font-bold text-stone-800">KES {parseFloat(venue.price_per_day).toLocaleString()}<span className="text-stone-400 text-sm">/day</span></span>
                    <button onClick={() => navigate(`/guest/venues/book/${venue.id}`)} className="bg-amber-700 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-amber-800 transition shadow-md">Book Now</button>
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

export default GuestVenues;