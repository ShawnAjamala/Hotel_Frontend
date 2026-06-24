import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PartyPopper, Users, Filter, Search } from 'lucide-react';
import API from '../services/api';
import GuestNavbar from '../components/GuestNavbar';

const GuestVenues = () => {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [eventType, setEventType] = useState('all');
  const [searchDate, setSearchDate] = useState(new Date().toISOString().split('T')[0]);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };
  const today = new Date().toISOString().split('T')[0];

  const fetchVenues = useCallback(async (d) => {
    setLoading(true);
    const dt = d || today;
    try {
      const [allRes, availableRes] = await Promise.all([
        API.get('/venues/', { headers }),
        API.get(`/venues/available/?date=${dt}`, { headers }),
      ]);
      const allVenues = Array.isArray(allRes.data) ? allRes.data : [];
      const availableVenues = availableRes.data.available_venues || [];
      const availableIds = new Set(availableVenues.map(v => v.id));
      const marked = allVenues.map(v => ({ ...v, available: availableIds.has(v.id) }));
      setVenues(marked);
      setFilteredVenues(marked);
    } catch { setVenues([]); setFilteredVenues([]); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchVenues(searchDate); }, [searchDate]);
  useEffect(() => {
    setFilteredVenues(eventType === 'all' ? venues : venues.filter(v => v.venue_type === eventType));
  }, [eventType, venues]);

  return (
    <div className="min-h-screen bg-stone-50">
      <GuestNavbar />
      <section className="relative bg-stone-900 text-white py-16 px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/90 to-transparent" />
        <div className="relative max-w-7xl mx-auto">
          <h1 className="text-5xl font-serif font-bold mb-3">Event Venues</h1>
          <p className="text-stone-300 text-lg">Plan your perfect celebration.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-8 py-10">
        <div className="bg-white rounded-2xl border p-5 -mt-16 relative z-10 shadow-lg mb-10">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-stone-700">Date:</label>
              <input type="date" value={searchDate} min={today} onChange={e => setSearchDate(e.target.value)} className="px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500" />
              <button onClick={() => fetchVenues(searchDate)} className="bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-800 flex items-center gap-1">
                <Search className="w-4 h-4" /> Search
              </button>
            </div>
            <div className="flex items-center gap-2 ml-4 pl-4 border-l">
              <Filter className="w-5 h-5 text-stone-400" />
              {['all', 'wedding', 'birthday', 'other'].map(t => (
                <button key={t} onClick={() => setEventType(t)} className={`px-5 py-2.5 rounded-full text-sm font-medium transition ${eventType===t?'bg-amber-700 text-white shadow-md':'bg-stone-50 text-stone-600 hover:bg-amber-50'}`}>{t==='all'?'All':t.charAt(0).toUpperCase()+t.slice(1)}</button>
              ))}
            </div>
          </div>
        </div>

        {loading ? <div className="text-center py-16"><div className="animate-spin w-10 h-10 border-4 border-amber-700 border-t-transparent rounded-full mx-auto" /></div> : filteredVenues.length===0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border"><PartyPopper className="w-16 h-16 text-stone-200 mx-auto mb-4" /><p className="text-stone-500">No venues available for {searchDate}.</p></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredVenues.map(venue => (
              <div key={venue.id} className="group bg-white rounded-2xl border overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="h-56 bg-stone-100 relative overflow-hidden">
                  {venue.image ? <img src={venue.image} loading="lazy" alt={venue.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" /> : <div className="w-full h-full flex items-center justify-center"><PartyPopper className="w-16 h-16 text-stone-300" /></div>}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <span className="text-white font-bold text-lg leading-tight">{venue.name}</span>
                    <span className={`px-3 py-1 rounded-full text-xs capitalize flex-shrink-0 ml-2 font-medium ${venue.available ? 'bg-amber-500 text-white' : 'bg-red-500 text-white'}`}>
                      {venue.available ? venue.venue_type : 'Booked'}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-stone-500 text-sm mb-3 line-clamp-2">{venue.description || 'Beautiful event space'}</p>
                  <div className="flex items-center gap-1 text-stone-400 text-sm mb-3"><Users className="w-4 h-4" /> {venue.capacity} guests</div>
                  <div className="flex justify-between items-center pt-4 border-t">
                    <span className="text-xl font-bold">KES {parseFloat(venue.price_per_day).toLocaleString()}<span className="text-stone-400 text-sm font-normal">/day</span></span>
                    {venue.available ? (
                      <button onClick={() => navigate(`/guest/venues/book/${venue.id}?date=${searchDate}`)} className="bg-amber-700 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-amber-800 shadow-md">Book Now</button>
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

export default GuestVenues;