import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { UtensilsCrossed, Users, MapPin, Search } from 'lucide-react';
import API from '../services/api';
import GuestNavbar from '../components/GuestNavbar';

const GuestTables = () => {
  const navigate = useNavigate();
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchDate, setSearchDate] = useState(new Date().toISOString().split('T')[0]);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };
  const today = new Date().toISOString().split('T')[0];

  const fetchTables = useCallback(async (d) => {
    setLoading(true);
    const dt = d || today;
    try {
      const [tablesRes, availableRes] = await Promise.all([
        API.get('/tables/', { headers }),
        API.get(`/tables/available/?date=${dt}&start_time=00:00&end_time=23:59&guests=1`, { headers }),
      ]);
      const allTables = Array.isArray(tablesRes.data) ? tablesRes.data : [];
      const availableTables = availableRes.data.available_tables || [];
      const availableIds = new Set(availableTables.map(t => t.id));
      const marked = allTables.map(t => ({ ...t, available: availableIds.has(t.id) }));
      setTables(marked);
    } catch { setTables([]); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchTables(searchDate); }, [searchDate]);

  return (
    <div className="min-h-screen bg-stone-50">
      <GuestNavbar />
      <section className="relative bg-stone-900 text-white py-16 px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/90 to-transparent" />
        <div className="relative max-w-7xl mx-auto">
          <h1 className="text-5xl font-serif font-bold mb-3">Fine Dining</h1>
          <p className="text-stone-300 text-lg">Reserve your table for an unforgettable experience.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-8 py-10">
        <div className="bg-white rounded-2xl border p-5 -mt-16 relative z-10 shadow-lg mb-10">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-stone-700">Date:</label>
            <input type="date" value={searchDate} min={today} onChange={e => setSearchDate(e.target.value)} className="px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500" />
            <button onClick={() => fetchTables(searchDate)} className="bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-800 flex items-center gap-1">
              <Search className="w-4 h-4" /> Search
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16"><div className="animate-spin w-10 h-10 border-4 border-amber-700 border-t-transparent rounded-full mx-auto" /></div>
        ) : tables.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border"><UtensilsCrossed className="w-16 h-16 text-stone-200 mx-auto mb-4" /><p className="text-stone-500">No tables available for {searchDate}.</p></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tables.map(table => (
              <div key={table.id} className="group bg-white rounded-2xl border overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="h-56 bg-stone-100 relative overflow-hidden">
                  {table.image ? <img src={table.image} loading="lazy" alt={`Table ${table.table_number}`} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" /> : <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100"><UtensilsCrossed className="w-16 h-16 text-amber-300" /></div>}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <span className="text-white font-bold text-lg leading-tight">Table {table.table_number}</span>
                    <span className={`px-3 py-1 rounded-full text-xs flex-shrink-0 ml-2 font-medium ${table.available ? 'bg-amber-500 text-white' : 'bg-red-500 text-white'}`}>
                      {table.available ? `${table.capacity} pax` : 'Booked'}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-4 mb-4 text-sm text-stone-500">
                    <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {table.capacity} guests</span>
                    {table.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {table.location}</span>}
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t">
                    <span className="text-xl font-bold">KES {parseFloat(table.price_per_slot).toLocaleString()}</span>
                    {table.available ? (
                      <button onClick={() => navigate(`/guest/tables/book/${table.id}?date=${searchDate}`)} className="bg-amber-700 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-amber-800 shadow-md">Reserve</button>
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

export default GuestTables;