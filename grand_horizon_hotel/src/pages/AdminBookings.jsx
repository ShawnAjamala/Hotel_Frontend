import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BedDouble, UtensilsCrossed, Presentation, PartyPopper, Trash2, Search } from 'lucide-react';
import API from '../services/api';
import AdminNavbar from '../components/AdminNavbar';
import Footer from '../components/Footer';

const AdminBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [popup, setPopup] = useState({ show: false, booking: null });
  const perPage = 8;

  const fetchBookings = () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      API.get('/rooms/all-bookings/', { headers }),
      API.get('/tables/all-bookings/', { headers }),
      API.get('/conference/all-bookings/', { headers }),
      API.get('/venues/all-bookings/', { headers }),
    ]).then(([rooms, tables, conf, venues]) => {
      const all = [
        ...(rooms.data.bookings || []).map(b => ({ ...b, type: 'room' })),
        ...(tables.data.bookings || []).map(b => ({ ...b, type: 'table' })),
        ...(conf.data.bookings || []).map(b => ({ ...b, type: 'conference' })),
        ...(venues.data.bookings || []).map(b => ({ ...b, type: 'venue' })),
      ];
      setBookings(all);
    });
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const endpoints = { room: `/rooms/booking/${popup.booking.id}/delete/`, table: `/tables/booking/${popup.booking.id}/delete/`, conference: `/conference/booking/${popup.booking.id}/delete/`, venue: `/venues/booking/${popup.booking.id}/delete/` };
    await API.delete(endpoints[popup.booking.type], { headers });
    fetchBookings();
    setPopup({ show: false, booking: null });
  };

  const typeIcons = { room: BedDouble, table: UtensilsCrossed, conference: Presentation, venue: PartyPopper };
  const typeLabels = { room: 'Room', table: 'Table', conference: 'Conference', venue: 'Venue' };

  let filtered = filter === 'all' ? bookings : bookings.filter(b => b.type === filter);
  if (search) filtered = filtered.filter(b => (b.guest || '').toLowerCase().includes(search.toLowerCase()) || (b.room || b.table || b.venue || '').toLowerCase().includes(search.toLowerCase()));

  const canDelete = (status) => ['checked_out', 'completed', 'cancelled'].includes(status);
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': case 'checked_in': return 'bg-emerald-100 text-emerald-700';
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'checked_out': case 'completed': return 'bg-stone-100 text-stone-600';
      case 'cancelled': return 'bg-red-100 text-red-600';
      default: return 'bg-stone-100 text-stone-600';
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <AdminNavbar />

      {popup.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setPopup({ show: false, booking: null })} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 className="w-8 h-8 text-red-500" /></div>
            <h3 className="text-lg font-bold text-stone-800 mb-2">Delete Booking</h3>
            <p className="text-stone-500 mb-6">Permanently delete this {popup.booking?.type} booking?</p>
            <div className="flex gap-3"><button onClick={() => setPopup({ show: false, booking: null })} className="flex-1 py-3 border border-stone-200 rounded-xl text-stone-600 font-medium hover:bg-stone-50">Cancel</button><button onClick={handleDelete} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600">Delete</button></div>
          </div>
        </div>
      )}

      <section className="bg-gradient-to-br from-amber-900 to-amber-800 text-white py-14 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-2"><BedDouble className="w-5 h-5 text-amber-300" /><span className="text-amber-200 text-sm font-medium uppercase">Admin Panel</span></div>
          <h1 className="text-4xl font-bold">All Bookings</h1>
          <p className="text-amber-100/80 mt-2">{bookings.length} total bookings</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-8 -mt-6 relative z-10 pb-16">
        <div className="bg-white rounded-2xl shadow-sm border p-5 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex gap-2">
              {['all', 'room', 'table', 'conference', 'venue'].map(f => (
                <button key={f} onClick={() => { setFilter(f); setPage(1); }} className={`px-4 py-2 rounded-full text-sm font-medium transition ${filter === f ? 'bg-amber-700 text-white shadow-md' : 'bg-stone-100 text-stone-600 hover:bg-amber-100'}`}>{f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}</button>
              ))}
            </div>
            <div className="relative ml-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search bookings..." className="pl-10 pr-4 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-500 w-56" />
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border"><p className="text-stone-400">No bookings found.</p></div>
        ) : (
          <>
            <div className="space-y-3">
              {paginated.map((b, i) => {
                const Icon = typeIcons[b.type];
                return (
                  <div key={i} className="bg-white border border-stone-200 rounded-2xl p-5 hover:shadow-md transition">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4 min-w-[200px]">
                        <div className="bg-amber-100 w-10 h-10 rounded-lg flex items-center justify-center"><Icon className="w-5 h-5 text-amber-700" /></div>
                        <div>
                          <p className="font-semibold text-stone-800 capitalize">{typeLabels[b.type]}: {b.room || b.table || b.venue || `#${b.id}`}</p>
                          <p className="text-stone-500 text-sm">{b.guest || 'Guest'}</p>
                        </div>
                      </div>
                      <div className="text-sm text-stone-500">{b.check_in ? <span>{b.check_in} → {b.check_out}</span> : b.date ? <span>{b.date} • {b.time}</span> : <span>{b.booking_date || ''}</span>}</div>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-stone-800">KES {parseFloat(b.total_price || 0).toLocaleString()}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(b.status)}`}>{b.status.replace('_', ' ')}</span>
                        {canDelete(b.status) && (<button onClick={() => setPopup({ show: true, booking: b })} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition"><Trash2 className="w-4 h-4" /></button>)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-8">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 bg-white border rounded-xl text-sm hover:border-amber-400 disabled:opacity-40">← Prev</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (<button key={p} onClick={() => setPage(p)} className={`w-9 h-9 rounded-xl text-sm font-medium transition ${page === p ? 'bg-amber-700 text-white' : 'bg-white border text-stone-600 hover:border-amber-400'}`}>{p}</button>))}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 bg-white border rounded-xl text-sm hover:border-amber-400 disabled:opacity-40">Next →</button>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AdminBookings;