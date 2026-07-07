import { useState } from 'react';
import { AlertCircle, X, Send, Calendar, DollarSign, User, BedDouble, UtensilsCrossed, Presentation, PartyPopper } from 'lucide-react';
import API from '../services/api';

const GuestCancellationForm = ({ booking, onClose, onSuccess }) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const Icon = getBookingIcon(booking.type);
  const label = getBookingLabel(booking.type);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Please provide a reason for cancellation');
      return;
    }

    setLoading(true);
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

      onSuccess && onSuccess();
      onClose && onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit cancellation request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-amber-100 w-10 h-10 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <h2 className="text-xl font-bold text-stone-800">Request Cancellation</h2>
          </div>
          <button 
            onClick={onClose} 
            className="text-stone-400 hover:text-stone-600 transition p-1 hover:bg-stone-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-stone-50 rounded-xl p-4 mb-4 space-y-2">
          <div className="flex items-center gap-2 pb-2 border-b border-stone-200">
            <Icon className="w-4 h-4 text-amber-600" />
            <span className="font-medium text-stone-800 capitalize">{label} Booking</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-stone-500">Booking ID:</span>
            <span className="font-medium text-stone-800">#{booking.id}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-stone-500">Resource:</span>
            <span className="font-medium text-stone-800">{booking.resource || 'N/A'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-stone-500">Guest:</span>
            <span className="font-medium text-stone-800">{booking.guest || 'You'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-stone-500">Amount:</span>
            <span className="font-medium text-stone-800">KES {parseFloat(booking.total_price || 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-stone-500">Date:</span>
            <span className="font-medium text-stone-800">{booking.date || 'N/A'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-stone-500">Status:</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
              booking.status === 'pending' ? 'bg-amber-100 text-amber-700' :
              booking.status === 'cancellation_requested' ? 'bg-orange-100 text-orange-700' :
              'bg-stone-100 text-stone-600'
            }`}>
              {booking.status?.replace('_', ' ') || 'N/A'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2.5 rounded-xl mb-4 text-sm">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              Reason for Cancellation
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
            />
            <p className="text-xs text-stone-400 mt-1.5">
              Your request will be reviewed by our staff. You'll receive a notification once it's processed.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-stone-200 rounded-xl text-stone-600 font-medium hover:bg-stone-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-amber-700 text-white rounded-xl font-medium hover:bg-amber-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                'Submitting...'
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Request
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GuestCancellationForm;