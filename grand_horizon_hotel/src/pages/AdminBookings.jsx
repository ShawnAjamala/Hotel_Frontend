import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BedDouble, UtensilsCrossed, Presentation, PartyPopper, Trash2 } from 'lucide-react';
import API from '../services/api';
import AdminNavbar from '../components/AdminNavbar';

const AdminBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all');

  const fetchBookings = () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    // ==================== CONNECT TO BACKEND: All 4 booking types ====================
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

  // ==================== CONNECT TO BACKEND: Delete Booking ====================
  const handleDelete = async (booking) => {
    if (!window.confirm(`Delete this ${booking.type} booking permanently?`)) return;
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const endpoints = {
      room: `/rooms/booking/${booking.id}/delete/`,
      table: `/tables/booking/${booking.id}/delete/`,
      conference: `/conference/booking/${booking.id}/delete/`,
      venue: `/venues/booking/${booking.id}/delete/`,
    };
    await API.delete(endpoints[booking.type], { headers });
    fetchBookings(); // Refresh list
  };

  const typeIcons = { room: BedDouble, table: UtensilsCrossed, conference: Presentation, venue: PartyPopper };

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.type === filter);

  const canDelete = (status) => ['checked_out', 'completed', 'cancelled'].includes(status);

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto px-8 py-10">
        <button onClick={() => navigate('/admin/dashboard')} className="flex items-center gap-2 text-stone-500 hover:text-amber-700 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-stone-800">All Bookings</h1>
          <div className="flex gap-2">
            {['all', 'room', 'table', 'conference', 'venue'].map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-full text-sm font-medium transition ${filter === f ? 'bg-amber-700 text-white' : 'bg-white text-stone-600 border border-stone-200'}`}>
                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-4">
          {filtered.map((b, i) => {
            const Icon = typeIcons[b.type];
            return (
              <div key={i} className="bg-white border border-stone-200 rounded-2xl p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-amber-100 w-10 h-10 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-amber-700" />
                  </div>
                  <div>
                    <p className="font-semibold text-stone-800 capitalize">{b.type}: {b.room || b.table || b.venue || b.guest}</p>
                    <p className="text-stone-500 text-sm">{b.date || b.check_in} • {b.guest || b.guests} guest(s)</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    b.status === 'confirmed' || b.status === 'checked_in' ? 'bg-emerald-100 text-emerald-700' : 
                    b.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-stone-100 text-stone-600'
                  }`}>
                    {b.status}
                  </span>
                  {canDelete(b.status) && (
                    <button onClick={() => handleDelete(b)} className="text-red-400 hover:text-red-600 transition">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;