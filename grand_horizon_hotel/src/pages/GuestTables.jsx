import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UtensilsCrossed, Users, MapPin, Filter } from 'lucide-react';
import API from '../services/api';
import GuestNavbar from '../components/GuestNavbar';

const GuestTables = () => {
  const navigate = useNavigate();
  const [tables, setTables] = useState([]);
  const [filteredTables, setFilteredTables] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => { fetchTables(); }, []);

  const fetchTables = async () => {
    setLoading(true);
    try {
      const res = await API.get('/tables/', { headers });
      const data = Array.isArray(res.data) ? res.data : (res.data.tables || []);
      setTables(data);
      setFilteredTables(data);
    } catch (err) {
      console.log('Error:', err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <GuestNavbar />

      {/* Hero */}
      <section className="relative bg-stone-900 text-white py-20 px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/90 to-transparent" />
        <div className="relative max-w-7xl mx-auto">
          <button onClick={() => navigate('/guest/dashboard')} className="flex items-center gap-2 text-amber-300 hover:text-amber-200 transition mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          <h1 className="text-5xl font-serif font-bold mb-3">Fine Dining</h1>
          <p className="text-stone-300 text-lg max-w-lg">Reserve your table for an unforgettable culinary experience.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-8 py-10">
        {loading ? (
          <div className="text-center py-16"><div className="animate-spin w-10 h-10 border-4 border-amber-700 border-t-transparent rounded-full mx-auto mb-4" /><p className="text-stone-500">Loading tables...</p></div>
        ) : filteredTables.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
            <UtensilsCrossed className="w-16 h-16 text-stone-200 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-stone-600 mb-2">No Tables Available</h3>
            <p className="text-stone-400">Check back later for reservations.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTables.map(table => (
              <div key={table.id} className="group bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="h-48 bg-stone-100 overflow-hidden relative">
                  {table.image ? (
                    <img src={table.image} alt={`Table ${table.table_number}`} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100">
                      <UtensilsCrossed className="w-16 h-16 text-amber-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <span className="text-white font-bold text-lg">Table {table.table_number}</span>
                    <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-medium">{table.capacity} pax</span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-1 text-stone-500"><Users className="w-4 h-4" /> {table.capacity} guests</div>
                    {table.location && <div className="flex items-center gap-1 text-stone-500"><MapPin className="w-4 h-4" /> {table.location}</div>}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                    <span className="text-xl font-bold text-stone-800">KES {parseFloat(table.price_per_slot).toLocaleString()}</span>
                    <button onClick={() => navigate(`/guest/tables/book/${table.id}`)} className="bg-amber-700 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-amber-800 transition shadow-md">
                      Reserve
                    </button>
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