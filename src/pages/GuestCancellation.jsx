import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  AlertCircle, Send, Calendar, Users,
  BedDouble, UtensilsCrossed, Presentation, PartyPopper,
  CheckCircle, Save, Edit3
} from 'lucide-react';
import API from '../services/api';
import GuestNavbar from '../components/GuestNavbar';
import Footer from '../components/Footer';

const GuestCancellation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [booking, setBooking] = useState(null);
  const [action, setAction] = useState(''); // 'edit' or 'cancel'
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    check_in: '',
    check_out: '',
    guests: 1
  });

  useEffect(() => {
    const bookingData = location.state?.booking;
    const actionType = location.state?.action || 'cancel';
    
    if (bookingData) {
      setBooking(bookingData);
      setAction(actionType);
      setFormData({
        check_in: bookingData.check_in || '',
        check_out: bookingData.check_out || '',
        guests: bookingData.guests || 1
      });
    } else {
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    if (!formData.check_in || !formData.check_out) {
      setError('Please select check-in and check-out dates');
      setSubmitting(false);
      return;
    }

    if (new Date(formData.check_in) >= new Date(formData.check_out)) {
      setError('Check-out date must be after check-in date');
      setSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      // Send edit request to staff for approval
      await API.post('/booking/edit/request/', {
        booking_id: booking.id,
        booking_type: booking.type,
        check_in: formData.check_in,
        check_out: formData.check_out,
        guests: parseInt(formData.guests)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccessMessage('Your edit request has been submitted for approval!');
      setSuccess(true);
      setTimeout(() => {
        navigate('/guest/bookings');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit edit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelSubmit = async (e) => {
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

      setSuccessMessage('Your cancellation request has been submitted successfully!');
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

  const handleSubmit = (e) => {
    if (action === 'edit') {
      handleEditSubmit(e);
    } else {
      handleCancelSubmit(e);
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
  const today = new Date().toISOString().split('T')[0];
  const isEdit = action === 'edit';

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <GuestNavbar />

      <section className="relative bg-gradient-to-br from-amber-900 to-amber-800 text-white py-14 px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/90 to-transparent" />
        <div className="relative max-w-4xl mx-auto">
          <h1 className="text-4xl font-serif font-bold">
            {isEdit ? 'Edit Booking' : 'Request Cancellation'}
          </h1>
          <p className="text-amber-100/80 mt-2">
            {isEdit ? 'Request to update your booking dates' : 'Submit a cancellation request for your booking'}
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-8 -mt-6 relative z-10 pb-16">
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 md:p-8">
          
          {success ? (
            <div className="text-center py-8">
              <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-stone-800 mb-2">
                {isEdit ? 'Edit Request Submitted!' : 'Request Submitted!'}
              </h2>
              <p className="text-stone-500 mb-4">{successMessage}</p>
              <p className="text-sm text-stone-400">Redirecting to bookings...</p>
            </div>
          ) : (
            <>
              {/* Booking Details */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-stone-800 mb-4 flex items-center gap-2">
                  <Icon className="w-5 h-5 text-amber-600" />
                  {label} Booking #{booking.id}
                </h2>
                <div className="bg-stone-50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-500">Resource:</span>
                    <span className="font-medium text-stone-800">{booking.resource || 'N/A'}</span>
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
                  {isEdit && (
                    <div className="flex justify-between text-sm">
                      <span className="text-stone-500">Current Dates:</span>
                      <span className="font-medium text-stone-800">
                        {formData.check_in ? `${formData.check_in} → ${formData.check_out}` : 'N/A'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">
                    {error}
                  </div>
                )}

                {isEdit ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1.5">
                          New Check-in Date
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                          <input
                            type="date"
                            name="check_in"
                            value={formData.check_in}
                            onChange={handleChange}
                            min={today}
                            className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1.5">
                          New Check-out Date
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                          <input
                            type="date"
                            name="check_out"
                            value={formData.check_out}
                            onChange={handleChange}
                            min={formData.check_in || today}
                            className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-stone-700 mb-1.5">
                        Number of Guests
                      </label>
                      <div className="relative">
                        <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                        <input
                          type="number"
                          name="guests"
                          value={formData.guests}
                          onChange={handleChange}
                          min="1"
                          max="10"
                          className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm"
                          required
                        />
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                      <div className="flex items-start gap-3">
                        <Edit3 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-blue-800">Important</p>
                          <ul className="text-xs text-blue-700 mt-1 space-y-1">
                            <li>• Your edit request will be reviewed by staff</li>
                            <li>• Staff will check availability for new dates</li>
                            <li>• You'll receive a confirmation once approved</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
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
                  </>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => navigate('/guest/bookings')}
                    className="flex-1 py-3 border border-stone-200 rounded-xl text-stone-600 font-medium hover:bg-stone-50 transition"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 bg-amber-700 text-white rounded-xl font-medium hover:bg-amber-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        {isEdit ? 'Submitting...' : 'Submitting...'}
                      </>
                    ) : (
                      <>
                        {isEdit ? <Save className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                        {isEdit ? 'Submit Edit Request' : 'Submit Request'}
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