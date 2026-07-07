import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, AlertCircle, Send, Calendar, DollarSign, 
  BedDouble, UtensilsCrossed, Presentation, PartyPopper,
  CheckCircle
} from 'lucide-react';
import API from '../services/api';
import GuestNavbar from '../components/GuestNavbar';
import Footer from '../components/Footer';

const GuestCancellation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [booking, setBooking] = useState(null);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const bookingData = location.state?.booking;
    if (bookingData) {
      console.log(' Booking data received:', bookingData);
      setBooking(bookingData);
    } else {
      console.log('No booking data, redirecting...');
      navigate('/guest/bookings');
    }
  }, [location, navigate]);

  const getBookingIcon = (type) => {
    switch (type) {
      case 'room': return BedDouble;
      case 'table': return UtensilsCrossed;
      case 'conference': return Presentation;
      case 'venue': return PartyPopper;
      default: return Calendar;
    }
  };

  const getBookingLabel = (type) => {
    switch (type) {
      case 'room': return 'Room';
      case 'table': return 'Table';
      case 'conference': return 'Conference';
      case 'venue': return 'Venue';
      default: return 'Booking';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-100 text-emerald-700';
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'cancellation_requested': return 'bg-orange-100 text-orange-700';
      case 'cancelled': return 'bg-red-100 text-red-600';
      default: return 'bg-stone-100 text-stone-600';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Please provide a reason for cancellation');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      await API.post('/cancellation/request/', {
        booking_id: booking.id,
        booking_type: booking.type,
        reason: reason.trim()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/guest/bookings');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit cancellation request');
    } finally {
      setSubmitting(false);
    }
  };

  if (!booking) {
    return (
      <div className="min-h-screen bg-stone-50">
        <GuestNavbar />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin w-10 h-10 border-4 border-amber-700 border-t-transparent rounded-full" />
        </div>
        <Footer />
      </div>
    );
  }

  const Icon = getBookingIcon(booking.type);
  const label = getBookingLabel(booking.type);

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <GuestNavbar />

      <section className="relative bg-gradient-to-br from-amber-900 to-amber-800 text-white py-14 px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/90 to-transparent" />
        <div className="relative max-w-4xl mx-auto">
          <button 
            onClick={() => navigate('/guest/bookings')} 
            className="flex items-center gap-2 text-amber-200 hover:text-white transition mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Bookings
          </button>
          <h1 className="text-4xl font-serif font-bold">Request Cancellation</h1>
          <p className="text-amber-100/80 mt-2">Submit a cancellation request for your booking</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-8 -mt-6 relative z-10 pb-16">
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 md:p-8">
          
          {success ? (
            <div className="text-center py-8">
              <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-stone-800 mb-2">Request Submitted!</h2>
              <p className="text-stone-500 mb-4">
                Your cancellation request has been submitted successfully. 
                Our staff will review it and get back to you shortly.
              </p>
              <p className="text-sm text-stone-400">Redirecting to bookings...</p>
            </div>
          ) : (
            <>
              {/* Booking Details */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-stone-800 mb-4 flex items-center gap-2">
                  <Icon className="w-5 h-5 text-amber-600" />
                  {label} Booking Details
                </h2>
                <div className="bg-stone-50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-500">Booking ID:</span>
                    <span className="font-medium text-stone-800">#{booking.id}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-500">Resource:</span>
                    <span className="font-medium text-stone-800">{booking.resource || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-500">Date:</span>
                    <span className="font-medium text-stone-800">{booking.date || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-500">Total Amount:</span>
                    <span className="font-bold text-stone-800">KES {parseFloat(booking.total_price || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-500">Status:</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(booking.status)}`}>
                      {booking.status?.replace('_', ' ') || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-500">Payment:</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      booking.payment_status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {booking.payment_status || 'unpaid'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Cancellation Form */}
              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">
                    {error}
                  </div>
                )}

                <div className="mb-6">
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    Reason for Cancellation <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => {
                      setReason(e.target.value);
                      setError('');
                    }}
                    className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm resize-none"
                    rows="4"
                    placeholder="Please explain why you need to cancel this booking..."
                    required
                    disabled={submitting}
                  />
                  <p className="text-xs text-stone-400 mt-1.5">
                    Your request will be reviewed by our staff. You'll receive a notification once it's processed.
                  </p>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">Important Information</p>
                      <ul className="text-xs text-amber-700 mt-1 space-y-1">
                        <li>• Cancellation requests are reviewed within 24-48 hours</li>
                        <li>• Refunds will be processed if approved</li>
                        <li>• You'll receive email confirmation once processed</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => navigate('/guest/bookings')}
                    className="flex-1 py-3 border border-stone-200 rounded-xl text-stone-600 font-medium hover:bg-stone-50 transition"
                    disabled={submitting}
                  >
                    Go Back
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 bg-amber-700 text-white rounded-xl font-medium hover:bg-amber-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Submit Request
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default GuestCancellation;