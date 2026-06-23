import { useState, useEffect } from 'react';
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
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [step, setStep] = useState(1);
  const [popup, setPopup] = useState({ show: false, message: '' });

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  // Popup helper
  const showPopup = (message) => {
    setPopup({ show: true, message });
    setTimeout(() => setPopup({ show: false, message: '' }), 3000);
  };

  useEffect(() => {
    API.get(`/rooms/${roomId}/`, { headers })
      .then(res => setRoom(res.data))
      .catch(() => navigate('/guest/rooms'));
  }, [roomId]);

  const nights = checkIn && checkOut 
    ? Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))) 
    : 0;
  const totalPrice = room ? nights * parseFloat(room.price_per_night) : 0;
  const today = new Date().toISOString().split('T')[0];

  const handleBook = async () => {
    if (!checkIn || !checkOut) return showPopup('Please select check-in and check-out dates.');
    try {
      const res = await API.post('/rooms/book/', { room_id: roomId, check_in: checkIn, check_out: checkOut, guests }, { headers });
      setBooking(res.data.booking);
      setStep(2);
    } catch (err) {
      showPopup(err.response?.data?.error || 'Booking failed. Please try again.');
    }
  };

  const handlePay = async () => {
    if (!phoneNumber) return showPopup('Please enter your M-Pesa phone number.');
    const phone = phoneNumber.startsWith('254') ? phoneNumber : `254${phoneNumber.replace(/^0+/, '')}`;
    try {
      const res = await API.post('/mpesa/pay/', { phone_number: phone, amount: totalPrice, booking_id: `BK-${booking.id}` });
      setPaymentStatus({ checkout_id: res.data.checkout_request_id, status: 'pending' });
      setStep(3);
      pollPayment(res.data.checkout_request_id);
    } catch (err) {
      showPopup(err.response?.data?.error || 'Payment failed. Please try again.');
    }
  };

  const pollPayment = (checkoutId) => {
    const interval = setInterval(async () => {
      try {
        const res = await API.get(`/mpesa/status/${checkoutId}/`);
        if (res.data.status === 'Completed') {
          setPaymentStatus(prev => ({ ...prev, status: 'completed', receipt: res.data.mpesa_receipt }));
          clearInterval(interval);
        } else if (res.data.status === 'Failed' || res.data.status === 'Cancelled') {
          setPaymentStatus(prev => ({ ...prev, status: 'failed', message: res.data.result_desc || 'Payment was cancelled or failed.' }));
          clearInterval(interval);
        }
      } catch (e) {}
    }, 5000);
    setTimeout(() => {
      clearInterval(interval);
      setPaymentStatus(prev => prev?.status === 'pending' ? { ...prev, status: 'timeout', message: 'Payment timed out. Please try again.' } : prev);
    }, 120000);
  };

  if (!room) return (
    <div className="min-h-screen bg-stone-50"><GuestNavbar /><div className="flex justify-center py-40"><div className="animate-spin w-10 h-10 border-4 border-amber-700 border-t-transparent rounded-full" /></div></div>
  );

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <GuestNavbar />

      {/* ==================== STYLED POPUP ==================== */}
      {popup.show && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-stone-100 px-6 py-4 flex items-center gap-4 max-w-md">
            <div className="bg-amber-100 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-stone-700 font-medium text-sm">{popup.message}</p>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="relative bg-stone-900 text-white py-10 px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200')] bg-cover bg-center opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/90 to-transparent" />
        <div className="relative max-w-4xl mx-auto">
          <button onClick={() => navigate('/guest/rooms')} className="flex items-center gap-2 text-amber-300 hover:text-amber-200 transition mb-3">
            <ArrowLeft className="w-4 h-4" /> Back to Rooms
          </button>
          <h1 className="text-3xl font-serif font-bold">Complete Your Booking</h1>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-8 -mt-6 relative z-10 pb-16">

        {/* STEP 1 */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-xl border border-stone-100 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-5">
              <div className="md:col-span-2 h-48 md:h-full bg-stone-100">
                {room.image ? (
                  <img src={room.image} alt={room.room_number} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-300">No image</div>
                )}
              </div>
              <div className="md:col-span-3 p-6 md:p-8">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-lg font-bold text-stone-800">Room {room.room_number}</h2>
                    <p className="text-stone-500 text-sm capitalize">{room.room_type} • Up to {room.max_guests} guests • KES {parseFloat(room.price_per_night).toLocaleString()}/night</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-500 mb-1">Check-in</label>
                    <input type="date" value={checkIn} min={today} onChange={e => setCheckIn(e.target.value)} className="w-full px-3 py-2.5 border border-stone-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-500 mb-1">Check-out</label>
                    <input type="date" value={checkOut} min={checkIn || today} onChange={e => setCheckOut(e.target.value)} className="w-full px-3 py-2.5 border border-stone-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm" />
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-500 mb-1">Guests</label>
                    <input type="number" value={guests} min={1} max={room.max_guests} onChange={e => setGuests(Math.max(1, Math.min(room.max_guests, parseInt(e.target.value) || 1)))} className="w-16 px-3 py-2.5 border border-stone-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm" />
                  </div>
                  <span className="text-stone-400 text-xs mt-5">Max {room.max_guests}</span>
                </div>

                {checkIn && checkOut && nights > 0 && (
                  <div className="bg-amber-50 rounded-lg p-3 mb-4">
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2 text-stone-600"><Clock className="w-3 h-3" /> {nights} night{nights > 1 ? 's' : ''}</div>
                      <div className="flex items-center gap-2 text-stone-600"><Users className="w-3 h-3" /> {guests} guest{guests > 1 ? 's' : ''}</div>
                    </div>
                    <div className="text-xs text-stone-400 my-1">{checkIn} → {checkOut}</div>
                    <div className="border-t border-amber-200 pt-1 flex justify-between items-center">
                      <span className="text-stone-600 text-xs">Total</span>
                      <span className="font-bold text-amber-800">KES {totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                )}

                <button onClick={handleBook} disabled={!checkIn || !checkOut || nights <= 0} className="w-full bg-amber-700 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-amber-800 transition disabled:opacity-50">
                  Confirm Booking • KES {totalPrice.toLocaleString()}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && booking && (
          <div className="bg-white rounded-2xl shadow-xl border border-stone-100 p-6">
            <h2 className="text-lg font-bold text-stone-800 mb-4">Pay with M-Pesa</h2>
            <div className="bg-amber-50 rounded-lg p-3 mb-4">
              <div className="flex justify-between text-sm mb-1"><span className="text-stone-600">Booking #{booking.id}</span><span className="capitalize text-stone-600">{room.room_type}</span></div>
              <div className="text-xs text-stone-400 mb-1">{checkIn} → {checkOut} • {nights} night{nights > 1 ? 's' : ''}</div>
              <div className="border-t border-amber-200 pt-1"><span className="font-bold text-amber-800">KES {totalPrice.toLocaleString()}</span></div>
            </div>
            <div className="mb-4">
              <label className="block text-xs font-medium text-stone-500 mb-1">M-Pesa Number</label>
              <input type="text" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="0712345678" className="w-full px-3 py-2.5 border border-stone-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm" />
            </div>
            <button onClick={handlePay} className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-emerald-700 transition">Pay KES {totalPrice.toLocaleString()}</button>
            <button onClick={() => setStep(1)} className="w-full text-stone-400 py-2 mt-1 hover:text-stone-600 transition text-xs">← Change dates</button>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="bg-white rounded-2xl shadow-xl border border-stone-100 p-6 text-center">
            {paymentStatus?.status === 'completed' ? (
              <>
                <div className="bg-emerald-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-7 h-7 text-emerald-600" />
                </div>
                <h2 className="text-lg font-bold text-stone-800 mb-1">Payment Successful!</h2>
                <p className="text-stone-500 text-sm mb-1">Receipt: {paymentStatus.receipt}</p>
                <p className="text-stone-500 text-sm mb-4">Room {room.room_number} is reserved.</p>
                <button onClick={() => navigate('/guest/bookings')} className="bg-amber-700 text-white px-6 py-2 rounded-full font-medium text-sm hover:bg-amber-800 transition">View My Bookings</button>
              </>
            ) : paymentStatus?.status === 'failed' || paymentStatus?.status === 'timeout' ? (
              <>
                <div className="bg-red-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
                  <XCircle className="w-7 h-7 text-red-500" />
                </div>
                <h2 className="text-lg font-bold text-stone-800 mb-1">Payment Failed</h2>
                <p className="text-stone-500 text-sm mb-4">{paymentStatus.message || 'Payment was not completed.'}</p>
                <button onClick={() => { setStep(2); setPaymentStatus(null); }} className="bg-amber-700 text-white px-6 py-2 rounded-full font-medium text-sm hover:bg-amber-800 transition">Try Again</button>
              </>
            ) : (
              <>
                <div className="animate-spin w-12 h-12 border-4 border-amber-700 border-t-transparent rounded-full mx-auto mb-3" />
                <h2 className="text-lg font-bold text-stone-800 mb-1">Waiting for Payment</h2>
                <p className="text-stone-500 text-sm">Check your phone for M-Pesa prompt.</p>
                <p className="text-stone-400 text-xs mt-1">KES {totalPrice.toLocaleString()}</p>
                <button onClick={() => { setStep(2); setPaymentStatus(null); }} className="text-stone-400 text-xs mt-4 hover:text-red-500 transition">Cancel Payment</button>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default GuestBookRoom;