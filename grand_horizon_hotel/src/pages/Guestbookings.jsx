import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BedDouble, UtensilsCrossed, Presentation, PartyPopper, Calendar, XCircle, Trash2, Filter } from 'lucide-react';
import API from '../services/api';
import GuestNavbar from '../components/GuestNavbar';

const BOOKING_CONFIG = {
  room:       { icon: BedDouble,      label: 'Room',       fetchKey: 'bookings', mapFn: b => ({ ...b, resource: b.room,  date: `${b.check_in} → ${b.check_out}` }) },
  table:      { icon: UtensilsCrossed,label: 'Table',      fetchKey: 'bookings', mapFn: b => ({ ...b, resource: b.table, date: `${b.date} • ${b.time}` }) },
  conference: { icon: Presentation,   label: 'Conference', fetchKey: 'bookings', mapFn: b => ({ ...b, resource: b.room,  date: `${b.date} • ${b.time}` }) },
  venue:      { icon: PartyPopper,    label: 'Venue',      fetchKey: 'bookings', mapFn: b => ({ ...b, resource: b.venue, date: b.date }) },
};

const CANCEL_ENDPOINTS  = { room: id => `/rooms/${id}/cancel/`,              table: id => `/tables/${id}/cancel/`,              conference: id => `/conference/${id}/cancel/`,              venue: id => `/venues/${id}/cancel/`              };
const DELETE_ENDPOINTS  = { room: id => `/rooms/my-booking/${id}/delete/`,   table: id => `/tables/my-booking/${id}/delete/`,   conference: id => `/conference/my-booking/${id}/delete/`,  venue: id => `/venues/my-booking/${id}/delete/`  };

const getStatusColor  = s => ({ confirmed: 'bg-emerald-100 text-emerald-700', checked_in: 'bg-blue-100 text-blue-700', checked_out: 'bg-stone-100 text-stone-600', completed: 'bg-stone-100 text-stone-600', cancelled: 'bg-red-100 text-red-600', pending: 'bg-amber-100 text-amber-700' }[s] ?? 'bg-stone-100 text-stone-600');
const getPaymentColor = s => s === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700';

const GuestBookings = () => {
  const navigate = useNavigate();
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');
  const [popup, setPopup] = useState({ show: false, type: '', message: '', onConfirm: null });
  const [actionLoading, setActionLoading] = useState(null); // tracks which booking id is in-flight

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchAllBookings = useCallback(async () => {
    setLoading(true);
    try {
      // All 4 endpoints fire simultaneously
      const results = await Promise.allSettled([
        API.get('/rooms/my-bookings/',      { headers }),
        API.get('/tables/my-bookings/',     { headers }),
        API.get('/conference/my-bookings/', { headers }),
        API.get('/venues/my-bookings/',     { headers }),
      ]);

      const types = ['room', 'table', 'conference', 'venue'];
      const all = [];

      results.forEach((result, i) => {
        if (result.status !== 'fulfilled') return; // skip failed endpoints silently
        const type = types[i];
        const { icon, label, fetchKey, mapFn } = BOOKING_CONFIG[type];
        const bookings = result.value.data[fetchKey] || result.value.data || [];
        (Array.isArray(bookings) ? bookings : []).forEach(b => {
          all.push({ ...mapFn(b), type, icon, label });
        });
      });

      all.sort((a, b) => b.id - a.id);
      setAllBookings(all);
    } catch { /* silently fail */ }
    setLoading(false);
  }, []);

  useEffect(() => { fetchAllBookings(); }, [fetchAllBookings]);

  const filteredBookings = typeFilter === 'all' ? allBookings : allBookings.filter(b => b.type === typeFilter);

  // Popup helpers
  const showPopup  = (type, message, onConfirm) => setPopup({ show: true, type, message, onConfirm });
  const closePopup = () => setPopup({ show: false, type: '', message: '', onConfirm: null });
  const handleConfirm = () => { if (popup.onConfirm) popup.onConfirm(); closePopup(); };

  // Optimistic cancel — update status in UI immediately, revert on failure
  const handleCancel = (booking) => {
    showPopup('warning', `Cancel this ${booking.label.toLowerCase()} booking?`, async () => {
      setActionLoading(`cancel-${booking.type}-${booking.id}`);
      // Optimistic update
      setAllBookings(prev => prev.map(b =>
        b.type === booking.type && b.id === booking.id ? { ...b, status: 'cancelled' } : b
      ));
      try {
        await API.post(CANCEL_ENDPOINTS[booking.type](booking.id), {}, { headers });
      } catch {
        // Revert on failure
        setAllBookings(prev => prev.map(b =>
          b.type === booking.type && b.id === booking.id ? { ...b, status: booking.status } : b
        ));
      }
      setActionLoading(null);
    });
  };

  // Optimistic delete — remove from UI immediately, revert on failure
  const handleDelete = (booking) => {
    showPopup('danger', `Permanently delete this ${booking.label.toLowerCase()} booking?`, async () => {
      setActionLoading(`delete-${booking.type}-${booking.id}`);
      // Optimistic remove
      setAllBookings(prev => prev.filter(b => !(b.type === booking.type && b.id === booking.id)));
      try {
        await API.delete(DELETE_ENDPOINTS[booking.type](booking.id), { headers });
      } catch {
        // Revert — re-fetch to restore accurate state
        fetchAllBookings();
      }
      setActionLoading(null);
    });
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <GuestNavbar />

      {/* Popup */}
      {popup.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closePopup} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${popup.type === 'danger' ? 'bg-red-100' : 'bg-amber-100'}`}>
              {popup.type === 'danger' ? <Trash2 className="w-8 h-8 text-red-500" /> : <XCircle className="w-8 h-8 text-amber-600" />}
            </div>
            <h3 className="text-lg font-bold text-stone-800 mb-2">{popup.type === 'danger' ? 'Delete?' : 'Cancel?'}</h3>
            <p className="text-stone-500 mb-6">{popup.message}</p>
            <div className="flex gap-3">
              <button onClick={closePopup} className="flex-1 py-3 border border-stone-200 rounded-xl text-stone-600 font-medium hover:bg-stone-50">Keep</button>
              <button onClick={handleConfirm} className={`flex-1 py-3 rounded-xl font-medium text-white ${popup.type === 'danger' ? 'bg-red-500 hover:bg-red-600' : 'bg-amber-700 hover:bg-amber-800'}`}>
                {popup.type === 'danger' ? 'Delete' : 'Cancel Booking'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="relative bg-stone-900 text-white py-16 px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/90 to-transparent" />
        <div className="relative max-w-6xl mx-auto">
          <button onClick={() => navigate('/guest/dashboard')} className="flex items-center gap-2 text-amber-300 hover:text-amber-200 transition mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          <h1 className="text-4xl font-serif font-bold mb-2">My Bookings</h1>
          <p className="text-stone-300">{allBookings.length} booking{allBookings.length !== 1 ? 's' : ''} across all services</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-8 py-10">
        {/* Filter Bar */}
        <div className="bg-white rounded-2xl border border-stone-200 p-4 -mt-12 relative z-10 shadow-lg mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <Filter className="w-5 h-5 text-stone-400 flex-shrink-0" />
            <span className="text-sm font-medium text-stone-700">Filter:</span>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'all',        label: 'All',        icon: Calendar        },
                { value: 'room',       label: 'Rooms',      icon: BedDouble       },
                { value: 'table',      label: 'Tables',     icon: UtensilsCrossed },
                { value: 'conference', label: 'Conference', icon: Presentation    },
                { value: 'venue',      label: 'Venues',     icon: PartyPopper     },
              ].map(opt => (
                <button key={opt.value} onClick={() => setTypeFilter(opt.value)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition ${typeFilter === opt.value ? 'bg-amber-700 text-white shadow-md' : 'bg-stone-50 text-stone-600 hover:bg-amber-50'}`}>
                  <opt.icon className="w-4 h-4" /> {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bookings list */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin w-10 h-10 border-4 border-amber-700 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-stone-500">Loading your bookings...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
            <Calendar className="w-16 h-16 text-stone-200 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-stone-600 mb-2">No Bookings Found</h3>
            <p className="text-stone-400">{typeFilter !== 'all' ? `No ${typeFilter} bookings yet.` : 'Browse our services to make your first reservation.'}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map(booking => {
              const Icon = booking.icon;
              const key = `${booking.type}-${booking.id}`;
              const isActioning = actionLoading === `cancel-${key}` || actionLoading === `delete-${key}`;
              return (
                <div key={key} className={`bg-white rounded-2xl border border-stone-200 p-6 hover:shadow-md transition ${isActioning ? 'opacity-50 pointer-events-none' : ''}`}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left */}
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <div className="bg-amber-100 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-amber-700" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-stone-800 text-lg truncate">{booking.label}: {booking.resource}</h3>
                        <p className="text-stone-500 text-sm">{booking.date}</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right md:text-center flex-shrink-0">
                      <p className="font-bold text-stone-800">KES {parseFloat(booking.total_price || 0).toLocaleString()}</p>
                    </div>

                    {/* Status + Actions */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status.replace('_', ' ')}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentColor(booking.payment_status)}`}>
                          {booking.payment_status}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        {(booking.status === 'pending' || booking.status === 'confirmed') && (
                          <button onClick={() => handleCancel(booking)} className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition" title="Cancel">
                            <XCircle className="w-5 h-5" />
                          </button>
                        )}
                        {(booking.status === 'checked_out' || booking.status === 'completed' || booking.status === 'cancelled') && (
                          <button onClick={() => handleDelete(booking)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition" title="Delete">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default GuestBookings;