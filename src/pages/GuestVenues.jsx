import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PartyPopper, Users, Filter, Search, Grid3X3, List } from 'lucide-react';
import API from '../services/api';
import Navbar from '../components/Navbar';
import GuestNavbar from '../components/GuestNavbar';
import Footer from '../components/Footer';

const GuestVenues = () => {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [eventType, setEventType] = useState('all');
  const [searchDate, setSearchDate] = useState(new Date().toISOString().split('T')[0]);
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
    setPage(1); 
  }, [eventType, venues]);

  const totalPages = Math.ceil(filteredVenues.length / perPage);
  const paginated = filteredVenues.slice((page - 1) * perPage, page * perPage);

  useEffect(() => {
    setPage(current => Math.min(current, Math.max(1, totalPages || 1)));
  }, [totalPages]);

  // Handle Book Now click - redirect to login if not logged in
  const handleBookNow = (venueId) => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      navigate(`/guest/venues/book/${venueId}?date=${searchDate}`);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {isLoggedIn ? <GuestNavbar /> : <Navbar />}
      
      <section className="relative bg-stone-900 text-white py-12 sm:py-16 px-4 sm:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/90 to-transparent" />
        <div className="relative max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-serif font-bold mb-3">Event Venues</h1>
          <p className="text-stone-300 text-base sm:text-lg">Plan your perfect celebration.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="bg-white rounded-2xl border p-4 sm:p-5 -mt-12 sm:-mt-16 relative z-10 shadow-lg mb-8 sm:mb-10">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-3 sm:flex sm:flex-wrap sm:items-end">
              <label className="text-sm font-medium text-stone-700">Date:</label>
              <input type="date" value={searchDate} min={today} onChange={e => { setSearchDate(e.target.value); setPage(1); }} className="w-full min-w-0 px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500 sm:w-auto" />
              <button onClick={() => fetchVenues(searchDate)} className="w-full sm:w-auto bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-800 flex items-center justify-center gap-1">
                <Search className="w-4 h-4" /> Search
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2 lg:ml-4 lg:pl-4 lg:border-l">
              <Filter className="w-5 h-5 text-stone-400 shrink-0" />
              <div className="flex flex-wrap gap-2">
                {['all', 'wedding', 'birthday', 'other'].map(t => (
                  <button key={t} onClick={() => setEventType(t)} aria-pressed={eventType === t} className={`px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition ${eventType === t ? 'bg-amber-700 text-white shadow-md' : 'bg-stone-50 text-stone-600 hover:bg-amber-50'}`}>
                    {t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex bg-stone-100 rounded-lg p-1 self-end">
              <button aria-label="Grid view" aria-pressed={viewMode === 'grid'} onClick={() => setViewMode('grid')} className={`p-2 rounded-md transition ${viewMode === 'grid' ? 'bg-white text-amber-700 shadow-sm' : 'text-stone-500 hover:text-amber-700'}`}>
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button aria-label="List view" aria-pressed={viewMode === 'list'} onClick={() => setViewMode('list')} className={`p-2 rounded-md transition ${viewMode === 'list' ? 'bg-white text-amber-700 shadow-sm' : 'text-stone-500 hover:text-amber-700'}`}>
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin w-10 h-10 border-4 border-amber-700 border-t-transparent rounded-full mx-auto" />
          </div>
        ) : filteredVenues.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border">
            <PartyPopper className="w-16 h-16 text-stone-200 mx-auto mb-4" />
            <p className="text-stone-500">No venues for {searchDate}.</p>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginated.map(venue => (
                  <div key={venue.id} className="group bg-white rounded-2xl border overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="h-56 bg-stone-100 relative overflow-hidden">
                      {venue.image ? (
                        <img src={venue.image} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <PartyPopper className="w-16 h-16 text-stone-300" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                        <span className="text-white font-bold text-lg">{venue.name}</span>
                        <span className={`px-3 py-1 rounded-full text-xs capitalize font-medium ${venue.available ? 'bg-amber-500 text-white' : 'bg-red-500 text-white'}`}>
                          {venue.available ? venue.venue_type : 'Booked'}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <p className="text-stone-500 text-sm mb-3 line-clamp-2">{venue.description || 'Beautiful event space'}</p>
                      <div className="flex items-center gap-1 text-stone-400 text-sm mb-3">
                        <Users className="w-4 h-4" /> {venue.capacity} guests
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t">
                        <span className="text-xl font-bold">
                          KES {parseFloat(venue.price_per_day).toLocaleString()}
                          <span className="text-stone-400 text-sm font-normal">/day</span>
                        </span>
                        {venue.available ? (
                          <button onClick={() => handleBookNow(venue.id)} className="bg-amber-700 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-amber-800 shadow-md">
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
                {paginated.map(venue => (
                  <div key={venue.id} className="bg-white rounded-2xl border p-4 sm:p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between hover:shadow-md transition">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-16 h-16 rounded-xl bg-stone-100 overflow-hidden flex-shrink-0">
                        {venue.image ? (
                          <img src={venue.image} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <PartyPopper className="w-8 h-8 text-stone-300" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-stone-800">
                          {venue.name}{' '}
                          <span className={`text-xs px-2 py-0.5 rounded-full capitalize ml-2 ${venue.available ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-600'}`}>
                            {venue.available ? venue.venue_type : 'Booked'}
                          </span>
                        </h3>
                        <p className="text-stone-500 text-sm">
                          {venue.description || 'Beautiful event space'} • <Users className="w-3 h-3 inline" /> {venue.capacity} guests
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
                      <span className="font-bold text-stone-800">
                        KES {parseFloat(venue.price_per_day).toLocaleString()}
                        <span className="text-stone-400 text-xs font-normal">/day</span>
                      </span>
                      {venue.available ? (
                        <button onClick={() => handleBookNow(venue.id)} className="w-full sm:w-auto bg-amber-700 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-amber-800">
                          Book Now
                        </button>
                      ) : (
                        <button disabled className="w-full sm:w-auto bg-stone-200 text-stone-400 px-5 py-2 rounded-full text-sm cursor-not-allowed">
                          Unavailable
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {totalPages > 1 && (
              <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 mt-10">
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

export default GuestVenues;