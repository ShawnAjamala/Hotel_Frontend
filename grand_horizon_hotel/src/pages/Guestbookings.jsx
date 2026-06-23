import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BedDouble, Calendar, XCircle, Trash2, CheckCircle, AlertTriangle } from 'lucide-react';
import API from '../services/api';
import GuestNavbar from '../components/GuestNavbar';

const GuestBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState({ show: false, type: '', message: '', onConfirm: null });

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await API.get('/rooms/my-bookings/', { headers });
      setBookings(res.data.bookings || []);
    } catch (err) {
      console.log('Error:', err);
    }
    setLoading(false);
  };

  // ==================== Styled Popup ====================
  const showPopup = (type, message, onConfirm) => {
    setPopup({ show: true, type, message, onConfirm });
  };

  const closePopup = () => {
    setPopup({ show: false, type: '', message: '', onConfirm: null });
  };

  const handleConfirm = () => {
    if (popup.onConfirm) popup.onConfirm();
    closePopup();
  };

  // ==================== Actions ====================
  const handleCancel = (bookingId) => {
    showPopup('warning', 'Are you sure you want to cancel this booking? The room will become available for others.', async () => {
      try {
        await API.post(`/rooms/${bookingId}/cancel/`, {}, { headers });
        fetchBookings();
      } catch (err) {
        alert(err.response?.data?.error || 'Failed to cancel');
      }
    });
  };

  const handleDelete = (bookingId) => {
    showPopup('danger', 'Permanently delete this booking? This action cannot be undone.', async () => {
      try {
        await API.delete(`/rooms/my-booking/${bookingId}/delete/`, { headers });
        fetchBookings();
      } catch (err) {
        alert(err.response?.data?.error || 'Failed to delete');
      }
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-100 text-emerald-700';
      case 'checked_in': return 'bg-blue-100 text-blue-700';
      case 'checked_out': return 'bg-stone-100 text-stone-600';
      case 'cancelled': return 'bg-red-100 text-red-600';
      case 'pending': return 'bg-amber-100 text-amber-700';
      default: return 'bg-stone-100 text-stone-600';
    }
  };

  const getPaymentColor = (status) => {
    return status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700';
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <GuestNavbar />

      {/* ==================== STYLED POPUP ==================== */}
      {popup.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closePopup} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                popup.type === 'danger' ? 'bg-red-100' : 'bg-amber-100'
              }`}>
                {popup.type === 'danger' ? (
                  <Trash2 className="w-8 h-8 text-red-500" />
                ) : (
                  <AlertTriangle className="w-8 h-8 text-amber-600" />
                )}
              </div>
              <h3 className="text-lg font-bold text-stone-800 mb-2">
                {popup.type === 'danger' ? 'Delete Booking?' : 'Cancel Booking?'}
              </h3>
              <p className="text-stone-500 mb-6">{popup.message}</p>
              <div className="flex gap-3">
                <button onClick={closePopup} className="flex-1 px-4 py-2.5 border border-stone-200 rounded-xl text-stone-600 font-medium hover:bg-stone-50 transition">
                  Keep Booking
                </button>
                <button onClick={handleConfirm} className={`flex-1 px-4 py-2.5 rounded-xl font-medium text-white transition ${
                  popup.type === 'danger' ? 'bg-red-500 hover:bg-red-600' : 'bg-amber-700 hover:bg-amber-800'
                }`}>
                  {popup.type === 'danger' ? 'Delete' : 'Yes, Cancel'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="relative bg-stone-900 text-white py-12 px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200')] bg-cover bg-center opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/90 to-transparent" />
        <div className="relative max-w-6xl mx-auto">
          <button onClick={() => navigate('/guest/dashboard')} className="flex items-center gap-2 text-amber-300 hover:text-amber-200 transition mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          <h1 className="text-4xl font-serif font-bold mb-2">My Bookings</h1>
          <p className="text-stone-300">{bookings.length} booking{bookings.length !== 1 ? 's' : ''}</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-8 py-10">
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin w-10 h-10 border-4 border-amber-700 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-stone-500">Loading bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
            <Calendar className="w-16 h-16 text-stone-200 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-stone-600 mb-2">No Bookings Yet</h3>
            <p className="text-stone-400 mb-6">Browse our rooms and make your first reservation.</p>
            <button onClick={() => navigate('/guest/rooms')} className="bg-amber-700 text-white px-6 py-3 rounded-full font-medium hover:bg-amber-800 transition">Browse Rooms</button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map(booking => (
              <div key={booking.id} className="bg-white rounded-2xl border border-stone-200 p-6 hover:shadow-md transition">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-amber-100 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                      <BedDouble className="w-6 h-6 text-amber-700" />
                    </div>
                    <div>
                      <h3 className="font-bold text-stone-800 text-lg">Room {booking.room}</h3>
                      <p className="text-stone-500 text-sm capitalize">{booking.room_type} Room</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-xs text-stone-400 mb-1">Check-in</p>
                      <p className="font-semibold text-stone-700 text-sm">{booking.check_in}</p>
                    </div>
                    <div className="text-stone-300">→</div>
                    <div className="text-center">
                      <p className="text-xs text-stone-400 mb-1">Check-out</p>
                      <p className="font-semibold text-stone-700 text-sm">{booking.check_out}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-stone-800">KES {parseFloat(booking.total_price).toLocaleString()}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status.replace('_', ' ')}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentColor(booking.payment_status)}`}>
                          {booking.payment_status}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {(booking.status === 'pending' || booking.status === 'confirmed') && (
                        <button onClick={() => handleCancel(booking.id)} className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition" title="Cancel">
                          <XCircle className="w-5 h-5" />
                        </button>
                      )}
                      {(booking.status === 'checked_out' || booking.status === 'cancelled') && (
                        <button onClick={() => handleDelete(booking.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition" title="Delete">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
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

export default GuestBookings;