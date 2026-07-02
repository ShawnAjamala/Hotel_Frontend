import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BedDouble, UtensilsCrossed, Presentation, PartyPopper, CheckCircle, LogOut, Trash2, Filter } from 'lucide-react';
import API from '../services/api';
import StaffNavbar from '../components/StaffNavbar';
import Footer from '../components/Footer';

const StaffBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const perPage = 6;

  const [popup, setPopup] = useState({ show: false, type: '', message: '', onConfirm: null });

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => { fetchAllBookings(); }, []);

  const fetchAllBookings = async () => {
    setLoading(true);
    try {
      const [rooms, tables, conf, venues] = await Promise.all([
        API.get('/rooms/all-bookings/', { headers }),
        API.get('/tables/all-bookings/', { headers }),
        API.get('/conference/all-bookings/', { headers }),
        API.get('/venues/all-bookings/', { headers }),
      ]);
      const all = [
        ...(rooms.data.bookings || []).map(b => ({ ...b, type: 'room' })),
        ...(tables.data.bookings || []).map(b => ({ ...b, type: 'table' })),
        ...(conf.data.bookings || []).map(b => ({ ...b, type: 'conference' })),
        ...(venues.data.bookings || []).map(b => ({ ...b, type: 'venue' })),
      ];
      setBookings(all);
      setFilteredBookings(all);
    } catch (err) { console.log('Error:', err); }
    setLoading(false);
  };

  useEffect(() => {
    let result = bookings;
    if (filter !== 'all') result = result.filter(b => b.type === filter);
    if (statusFilter !== 'all') result = result.filter(b => b.status === statusFilter);
    setFilteredBookings(result);
  }, [filter, statusFilter, bookings]);

  const showPopup = (type, message, onConfirm) => setPopup({ show: true, type, message, onConfirm });
  const closePopup = () => setPopup({ show: false, type: '', message: '', onConfirm: null });
  const handleConfirm = () => { if (popup.onConfirm) popup.onConfirm(); closePopup(); };

  const handleCheckIn = (booking) => {
    showPopup('success', `Check in guest for ${typeLabels[booking.type]}: ${booking.room || booking.table || booking.venue || `#${booking.id}`}?`, async () => {
      const endpoints = { room: `/rooms/${booking.id}/check-in/`, table: `/tables/${booking.id}/complete/`, conference: `/conference/${booking.id}/complete/`, venue: `/venues/${booking.id}/complete/` };
      try { await API.post(endpoints[booking.type], {}, { headers }); fetchAllBookings(); } catch (err) { alert(err.response?.data?.error || 'Failed'); }
    });
  };

  const handleCheckOut = (booking) => {
    showPopup('success', `Check out guest from ${typeLabels[booking.type]}: ${booking.room || booking.table || booking.venue || `#${booking.id}`}?`, async () => {
      const endpoints = { room: `/rooms/${booking.id}/check-out/`, table: `/tables/${booking.id}/complete/`, conference: `/conference/${booking.id}/complete/`, venue: `/venues/${booking.id}/complete/` };
      try { await API.post(endpoints[booking.type], {}, { headers }); fetchAllBookings(); } catch (err) { alert(err.response?.data?.error || 'Failed'); }
    });
  };

  const handleDelete = (booking) => {
    showPopup('danger', `Permanently delete this ${typeLabels[booking.type]} booking?`, async () => {
      const endpoints = { room: `/rooms/booking/${booking.id}/delete/`, table: `/tables/booking/${booking.id}/delete/`, conference: `/conference/booking/${booking.id}/delete/`, venue: `/venues/booking/${booking.id}/delete/` };
      try { await API.delete(endpoints[booking.type], { headers }); fetchAllBookings(); } catch (err) { alert(err.response?.data?.error || 'Failed'); }
    });
  };

  const canCheckIn = (status) => status === 'confirmed';
  const canCheckOut = (status) => status === 'checked_in';
  const canDelete = (status) => ['checked_out', 'completed', 'cancelled'].includes(status);

  const typeIcons = { room: BedDouble, table: UtensilsCrossed, conference: Presentation, venue: PartyPopper };
  const typeLabels = { room: 'Room', table: 'Table', conference: 'Conference', venue: 'Venue' };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-700';
      case 'checked_in': return 'bg-emerald-100 text-emerald-700';
      case 'checked_out': case 'completed': return 'bg-stone-100 text-stone-600';
      case 'cancelled': return 'bg-red-100 text-red-600';
      case 'pending': return 'bg-amber-100 text-amber-700';
      default: return 'bg-stone-100 text-stone-600';
    }
  };

  const totalPages = Math.ceil(filteredBookings.length / perPage);
  const paginatedBookings = filteredBookings.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <StaffNavbar />

      {popup.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closePopup} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${popup.type === 'danger' ? 'bg-red-100' : 'bg-amber-100'}`}>
              {popup.type === 'danger' ? <Trash2 className="w-8 h-8 text-red-500" /> : <CheckCircle className="w-8 h-8 text-amber-600" />}
            </div>
            <h3 className="text-lg font-bold text-stone-800 mb-2">{popup.type === 'danger' ? 'Are you sure?' : 'Confirm Action'}</h3>
            <p className="text-stone-500 mb-6">{popup.message}</p>
            <div className="flex gap-3">
              <button onClick={closePopup} className="flex-1 py-3 border border-stone-200 rounded-xl text-stone-600 font-medium hover:bg-stone-50">Cancel</button>
              <button onClick={handleConfirm} className={`flex-1 py-3 rounded-xl font-medium text-white ${popup.type === 'danger' ? 'bg-red-500 hover:bg-red-600' : 'bg-amber-700 hover:bg-amber-800'}`}>{popup.type === 'danger' ? 'Delete' : 'Confirm'}</button>
            </div>
          </div>
        </div>
      )}

      <section className="bg-gradient-to-br from-amber-900 to-amber-800 text-white py-14 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <BedDouble className="w-5 h-5 text-amber-300" />
            <span className="text-amber-200 text-sm font-medium uppercase">Staff Management</span>
          </div>
          <h1 className="text-4xl font-bold">All Bookings</h1>
          <p className="text-amber-100/80 mt-2">{bookings.length} total booking{bookings.length !== 1 ? 's' : ''}</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-8 -mt-6 relative z-10 pb-16">
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-5 mb-8">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-stone-400" />
              <span className="text-sm font-medium text-stone-600">Type:</span>
              <div className="flex gap-1.5">
                {['all', 'room', 'table', 'conference', 'venue'].map(opt => (
                  <button key={opt} onClick={() => { setFilter(opt); setPage(1); }} className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${filter === opt ? 'bg-amber-700 text-white' : 'bg-stone-100 text-stone-600 hover:bg-amber-100'}`}>
                    {opt === 'all' ? 'All' : opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-stone-600">Status:</span>
              <div className="flex gap-1.5">
                {['all', 'pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'].map(opt => (
                  <button key={opt} onClick={() => { setStatusFilter(opt); setPage(1); }} className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${statusFilter === opt ? 'bg-amber-700 text-white' : 'bg-stone-100 text-stone-600 hover:bg-amber-100'}`}>
                    {opt === 'all' ? 'All' : opt.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20"><div className="animate-spin w-10 h-10 border-4 border-amber-700 border-t-transparent rounded-full mx-auto mb-4" /><p className="text-stone-500">Loading...</p></div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-stone-200"><p className="text-stone-400">No bookings found.</p></div>
        ) : (
          <>
            <div className="space-y-3">
              {paginatedBookings.map((booking, i) => {
                const Icon = typeIcons[booking.type];
                return (
                  <div key={i} className="bg-white border border-stone-200 rounded-2xl p-5 hover:shadow-md transition">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4 min-w-[200px]">
                        <div className="bg-amber-100 w-10 h-10 rounded-lg flex items-center justify-center"><Icon className="w-5 h-5 text-amber-700" /></div>
                        <div>
                          <p className="font-semibold text-stone-800 capitalize">{typeLabels[booking.type]}: {booking.room || booking.table || booking.venue || `#${booking.id}`}</p>
                          <p className="text-stone-500 text-sm">{booking.guest || 'Guest'}</p>
                        </div>
                      </div>
                      <div className="text-sm text-stone-500">
                        {booking.check_in ? <span>{booking.check_in} → {booking.check_out}</span> : booking.date ? <span>{booking.date} • {booking.time}</span> : <span>{booking.booking_date || ''}</span>}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-stone-800">KES {parseFloat(booking.total_price || 0).toLocaleString()}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>{booking.status.replace('_', ' ')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {canCheckIn(booking.status) && (
                          <button onClick={() => handleCheckIn(booking)} className="flex items-center gap-1.5 bg-emerald-600 text-white px-4 py-2 rounded-full text-xs font-medium hover:bg-emerald-700 transition"><CheckCircle className="w-3.5 h-3.5" /> Check In</button>
                        )}
                        {canCheckOut(booking.status) && (
                          <button onClick={() => handleCheckOut(booking)} className="flex items-center gap-1.5 bg-amber-600 text-white px-4 py-2 rounded-full text-xs font-medium hover:bg-amber-700 transition"><LogOut className="w-3.5 h-3.5" /> Check Out</button>
                        )}
                        {canDelete(booking.status) && (
                          <button onClick={() => handleDelete(booking)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition"><Trash2 className="w-4 h-4" /></button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-10">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 bg-white border border-stone-200 rounded-xl text-sm hover:border-amber-400 disabled:opacity-40">← Prev</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)} className={`w-9 h-9 rounded-xl text-sm font-medium transition ${page === p ? 'bg-amber-700 text-white' : 'bg-white border border-stone-200 text-stone-600 hover:border-amber-400'}`}>{p}</button>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 bg-white border border-stone-200 rounded-xl text-sm hover:border-amber-400 disabled:opacity-40">Next →</button>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default StaffBookings;