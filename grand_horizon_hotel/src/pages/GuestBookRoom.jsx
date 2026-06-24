import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Users, CheckCircle, Clock, XCircle, AlertTriangle } from 'lucide-react';
import API from '../services/api';
import GuestNavbar from '../components/GuestNavbar';

const GuestBookRoom = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [booking, setBooking] = useState(null);
  const [phone, setPhone] = useState('');
  const [payStatus, setPayStatus] = useState(null);
  const [step, setStep] = useState(1);
  const [popup, setPopup] = useState({ show: false, message: '' });

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };
  const today = new Date().toISOString().split('T')[0];

  const showPopup = useCallback((msg) => {
    setPopup({ show: true, message: msg });
    setTimeout(() => setPopup({ show: false, message: '' }), 3000);
  }, []);

  useEffect(() => {
    let m = true;
    API.get(`/rooms/${roomId}/`, { headers })
      .then(r => { if (m) setRoom(r.data); })
      .catch(() => navigate('/guest/rooms'));
    return () => { m = false; };
  }, [roomId]);

  const nights = checkIn && checkOut
    ? Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000))
    : 0;
  const total = room ? nights * parseFloat(room.price_per_night) : 0;

  const book = async () => {
    if (!checkIn || !checkOut) return showPopup('Please select both check-in and check-out dates.');
    try {
      const r = await API.post('/rooms/book/', {
        room_id: roomId, check_in: checkIn, check_out: checkOut, guests
      }, { headers });
      setBooking(r.data.booking);
      setStep(2);
    } catch (e) {
      showPopup(e.response?.data?.error || 'Booking failed. Please try again.');
    }
  };

  const pay = async () => {
    if (!phone) return showPopup('Please enter your M-Pesa phone number.');
    const p = phone.startsWith('254') ? phone : `254${phone.replace(/^0+/, '')}`;
    try {
      const r = await API.post('/mpesa/pay/', {
        phone_number: p, amount: total, booking_id: `BK-${booking.id}`
      });
      setPayStatus({ cid: r.data.checkout_request_id, status: 'pending' });
      setStep(3);
      poll(r.data.checkout_request_id);
    } catch (e) {
      showPopup(e.response?.data?.error || 'Payment failed.');
    }
  };

  const poll = (cid) => {
    let a = 0;
    const ch = async () => {
      if (a++ >= 24) {
        setPayStatus(p => p?.status === 'pending' ? { ...p, status: 'timeout', message: 'Payment timed out.' } : p);
        return;
      }
      try {
        const r = await API.get(`/mpesa/status/${cid}/`);
        if (r.data.status === 'Completed') {
          setPayStatus(p => ({ ...p, status: 'completed', receipt: r.data.mpesa_receipt }));
          return;
        }
        if (r.data.status === 'Failed' || r.data.status === 'Cancelled') {
          setPayStatus(p => ({ ...p, status: 'failed', message: r.data.result_desc || 'Payment failed.' }));
          return;
        }
      } catch (e) {}
      setTimeout(ch, 5000);
    };
    ch();
  };

  if (!room) return (
    <div className="min-h-screen bg-stone-50">
      <GuestNavbar />
      <div className="flex justify-center py-40">
        <div className="animate-spin w-10 h-10 border-4 border-amber-700 border-t-transparent rounded-full" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <GuestNavbar />

      {/* Toast Popup */}
      {popup.show && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-stone-100 px-6 py-4 flex items-center gap-4">
            <div className="bg-amber-100 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-stone-700 font-medium text-sm">{popup.message}</p>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="relative bg-stone-900 text-white py-12 px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200')] bg-cover bg-center opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/90 to-transparent" />
        <div className="relative max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/guest/rooms')}
            className="flex items-center gap-2 text-amber-300 hover:text-amber-200 transition mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Rooms</span>
          </button>
          <div className="flex items-center gap-4 mt-4">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white/10 flex-shrink-0">
              {room.image ? (
                <img src={room.image} loading="lazy" alt={room.room_number} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/50 text-xs">No image</div>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold">Room {room.room_number}</h1>
              <p className="text-stone-300 text-sm mt-1 capitalize">{room.room_type} • Up to {room.max_guests} guests • KES {parseFloat(room.price_per_night).toLocaleString()}/night</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-8 -mt-8 relative z-10 pb-16">
        {/* STEP 1: Booking Form */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-xl border border-stone-100 p-8">
            <h2 className="text-xl font-bold text-stone-800 mb-6">Select Your Stay Dates</h2>

            <div className="space-y-5">
              {/* Dates Row */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-1 text-amber-600" /> Check-in Date
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    min={today}
                    onChange={e => setCheckIn(e.target.value)}
                    className="w-full px-4 py-3.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition text-stone-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-1 text-amber-600" /> Check-out Date
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    min={checkIn || today}
                    onChange={e => setCheckOut(e.target.value)}
                    className="w-full px-4 py-3.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition text-stone-700"
                  />
                </div>
              </div>

              {/* Guests Row */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  <Users className="w-4 h-4 inline mr-1 text-amber-600" /> Number of Guests
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={guests}
                    min={1}
                    max={room.max_guests}
                    onChange={e => setGuests(Math.max(1, Math.min(room.max_guests, parseInt(e.target.value) || 1)))}
                    className="w-28 px-4 py-3.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-stone-700"
                  />
                  <span className="text-stone-400 text-sm">Maximum {room.max_guests} guests</span>
                </div>
              </div>
            </div>

            {/* Price Summary */}
            {checkIn && checkOut && nights > 0 && (
              <div className="mt-6 bg-amber-50 rounded-2xl p-5 border border-amber-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-stone-600 text-sm">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span className="font-medium">{nights} night{nights > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-600 text-sm">
                    <Users className="w-4 h-4 text-amber-600" />
                    <span className="font-medium">{guests} guest{guests > 1 ? 's' : ''}</span>
                  </div>
                </div>
                <div className="text-sm text-stone-500 mb-3">
                  {checkIn} <span className="mx-2">→</span> {checkOut}
                </div>
                <div className="border-t border-amber-200 pt-3 flex items-center justify-between">
                  <span className="text-stone-600 font-medium">
                    {nights} night{nights > 1 ? 's' : ''} × KES {parseFloat(room.price_per_night).toLocaleString()}
                  </span>
                  <span className="text-xl font-bold text-amber-800">KES {total.toLocaleString()}</span>
                </div>
              </div>
            )}

            <button
              onClick={book}
              disabled={!checkIn || !checkOut || nights <= 0}
              className="mt-6 w-full bg-amber-700 text-white py-4 rounded-xl font-semibold text-lg hover:bg-amber-800 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-200"
            >
              Confirm Booking • KES {total.toLocaleString()}
            </button>
          </div>
        )}

        {/* STEP 2: Payment Form */}
        {step === 2 && booking && (
          <div className="bg-white rounded-2xl shadow-xl border border-stone-100 p-8">
            <h2 className="text-xl font-bold text-stone-800 mb-6">Pay with M-Pesa</h2>

            <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-stone-600 font-medium">Booking #{booking.id}</span>
                <span className="bg-amber-200 text-amber-800 px-3 py-1 rounded-full text-xs font-medium capitalize">{room.room_type}</span>
              </div>
              <div className="text-sm text-stone-500 mb-2">
                {checkIn} → {checkOut} • {nights} night{nights > 1 ? 's' : ''} • {guests} guest{guests > 1 ? 's' : ''}
              </div>
              <div className="border-t border-amber-200 pt-3">
                <span className="text-2xl font-bold text-amber-800">KES {total.toLocaleString()}</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-stone-700 mb-2">
                M-Pesa Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="e.g. 0712345678"
                className="w-full px-4 py-3.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-stone-700 text-lg"
              />
              <p className="text-stone-400 text-xs mt-2">Enter the phone number registered with M-Pesa</p>
            </div>

            <button
              onClick={pay}
              className="w-full bg-emerald-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-emerald-700 transition shadow-lg shadow-emerald-200"
            >
              Pay KES {total.toLocaleString()} with M-Pesa
            </button>

            <button
              onClick={() => setStep(1)}
              className="w-full text-stone-400 py-3 mt-2 hover:text-stone-600 transition text-sm font-medium"
            >
              ← Change booking details
            </button>
          </div>
        )}

        {/* STEP 3: Result */}
        {step === 3 && (
          <div className="bg-white rounded-2xl shadow-xl border border-stone-100 p-8 text-center">
            {payStatus?.status === 'completed' ? (
              <>
                <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-emerald-600" />
                </div>
                <h2 className="text-xl font-bold text-stone-800 mb-2">Payment Successful!</h2>
                <p className="text-stone-500 mb-1">Receipt: <span className="font-semibold text-stone-700">{payStatus.receipt}</span></p>
                <p className="text-stone-500 mb-6">Room {room.room_number} is now reserved for you.</p>
                <button
                  onClick={() => navigate('/guest/bookings')}
                  className="bg-amber-700 text-white px-8 py-3 rounded-full font-medium hover:bg-amber-800 transition shadow-lg"
                >
                  View My Bookings
                </button>
              </>
            ) : payStatus?.status === 'failed' || payStatus?.status === 'timeout' ? (
              <>
                <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-10 h-10 text-red-500" />
                </div>
                <h2 className="text-xl font-bold text-stone-800 mb-2">Payment Failed</h2>
                <p className="text-stone-500 mb-6">{payStatus.message || 'Payment was not completed.'}</p>
                <button
                  onClick={() => { setStep(2); setPayStatus(null); }}
                  className="bg-amber-700 text-white px-8 py-3 rounded-full font-medium hover:bg-amber-800 transition shadow-lg"
                >
                  Try Again
                </button>
              </>
            ) : (
              <>
                <div className="animate-spin w-16 h-16 border-4 border-amber-700 border-t-transparent rounded-full mx-auto mb-4" />
                <h2 className="text-xl font-bold text-stone-800 mb-2">Waiting for Payment</h2>
                <p className="text-stone-500 mb-2">Check your phone and enter your M-Pesa PIN.</p>
                <p className="text-stone-400 text-sm">Amount: KES {total.toLocaleString()}</p>
                <button
                  onClick={() => { setStep(2); setPayStatus(null); }}
                  className="text-stone-400 text-sm mt-6 hover:text-red-500 transition"
                >
                  Cancel Payment
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GuestBookRoom;