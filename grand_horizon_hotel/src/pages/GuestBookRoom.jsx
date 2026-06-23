import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BedDouble, Users, Calendar, CreditCard, CheckCircle, Clock } from 'lucide-react';
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
  const [step, setStep] = useState(1); // 1=dates, 2=confirm+pay, 3=waiting

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  // ==================== CONNECT TO BACKEND: Get Room Details ====================
  // GET /api/rooms/{id}/ — returns room object with image, price, capacity
  useEffect(() => {
    API.get(`/rooms/${roomId}/`, { headers })
      .then(res => setRoom(res.data))
      .catch(() => navigate('/guest/rooms'));
  }, [roomId]);

  // ==================== Calculate nights from dates ====================
  const nights = checkIn && checkOut 
    ? Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))) 
    : 0;
  const totalPrice = room ? nights * parseFloat(room.price_per_night) : 0;

  // Set minimum dates to today
  const today = new Date().toISOString().split('T')[0];

  // ==================== CONNECT TO BACKEND: Book Room ====================
  // POST /api/rooms/book/
  const handleBook = async () => {
    if (!checkIn || !checkOut) return alert('Please select check-in and check-out dates');
    if (nights <= 0) return alert('Check-out must be after check-in');

    try {
      const res = await API.post('/rooms/book/', {
        room_id: roomId,
        check_in: checkIn,
        check_out: checkOut,
        guests: guests
      }, { headers });
      setBooking(res.data.booking);
      setStep(2);
    } catch (err) {
      alert(err.response?.data?.error || 'Booking failed');
    }
  };

  // ==================== CONNECT TO BACKEND: M-Pesa Payment ====================
  // POST /api/mpesa/pay/
  const handlePay = async () => {
    if (!phoneNumber) return alert('Enter your M-Pesa phone number');

    const formattedPhone = phoneNumber.startsWith('254') 
      ? phoneNumber 
      : `254${phoneNumber.replace(/^0+/, '')}`;

    try {
      const res = await API.post('/mpesa/pay/', {
        phone_number: formattedPhone,
        amount: totalPrice,
        booking_id: `BK-${booking.id}`
      });
      setPaymentStatus({ checkout_id: res.data.checkout_request_id, status: 'pending' });
      setStep(3);
      pollPayment(res.data.checkout_request_id);
    } catch (err) {
      alert(err.response?.data?.error || 'Payment failed');
    }
  };

  // ==================== Poll Payment Status ====================
  const pollPayment = (checkoutId) => {
    const interval = setInterval(async () => {
      try {
        const res = await API.get(`/mpesa/status/${checkoutId}/`);
        if (res.data.status === 'Completed') {
          setPaymentStatus(prev => ({ ...prev, status: 'completed', receipt: res.data.mpesa_receipt }));
          clearInterval(interval);
        }
      } catch (e) {}
    }, 5000);
    setTimeout(() => clearInterval(interval), 120000);
  };

  if (!room) {
    return (
      <div className="min-h-screen bg-stone-50 font-sans">
        <GuestNavbar />
        <div className="flex items-center justify-center py-40">
          <div className="animate-spin w-10 h-10 border-4 border-amber-700 border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <GuestNavbar />

      <div className="max-w-4xl mx-auto px-8 py-10">
        {/* Back */}
        <button 
          onClick={() => navigate('/guest/rooms')} 
          className="flex items-center gap-2 text-stone-500 hover:text-amber-700 mb-8 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Rooms
        </button>

        {/* Room Summary Banner */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-8 flex items-center gap-6">
          <div className="w-24 h-24 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0">
            {room.image ? (
              <img src={room.image} alt={room.room_number} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <BedDouble className="w-8 h-8 text-stone-300" />
              </div>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-800">Room {room.room_number}</h2>
            <p className="text-stone-500 text-sm capitalize">{room.room_type} • Up to {room.max_guests} guests</p>
            <p className="text-amber-700 font-semibold mt-1">KES {parseFloat(room.price_per_night).toLocaleString()} / night</p>
          </div>
        </div>

        {/* ==================== STEP 1: Select Dates ==================== */}
        {step === 1 && (
          <div className="bg-white rounded-2xl border border-stone-200 p-8">
            <h2 className="text-xl font-bold text-stone-800 mb-6">Select Your Stay Dates</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Check-in */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" /> Check-in Date
                </label>
                <input
                  type="date"
                  value={checkIn}
                  min={today}
                  onChange={e => setCheckIn(e.target.value)}
                  className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-lg"
                />
              </div>

              {/* Check-out */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" /> Check-out Date
                </label>
                <input
                  type="date"
                  value={checkOut}
                  min={checkIn || today}
                  onChange={e => setCheckOut(e.target.value)}
                  className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-lg"
                />
              </div>
            </div>

            {/* Night Summary */}
            {checkIn && checkOut && nights > 0 && (
              <div className="bg-amber-50 rounded-xl p-5 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-stone-600">
                    <Clock className="w-5 h-5" />
                    <span>{nights} night{nights > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-600">
                    <Users className="w-5 h-5" />
                    <span>{guests} guest{guests > 1 ? 's' : ''}</span>
                  </div>
                </div>
                <div className="flex justify-between text-sm text-stone-500 mb-1">
                  <span>{checkIn}</span>
                  <span>→</span>
                  <span>{checkOut}</span>
                </div>
                <div className="border-t border-amber-200 mt-3 pt-3 flex justify-between">
                  <span className="text-stone-600">Total ({nights} night{nights > 1 ? 's' : ''} × KES {parseFloat(room.price_per_night).toLocaleString()})</span>
                  <span className="text-xl font-bold text-amber-800">KES {totalPrice.toLocaleString()}</span>
                </div>
              </div>
            )}

            {/* Number of Guests */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-stone-700 mb-2">
                <Users className="w-4 h-4 inline mr-1" /> Number of Guests
              </label>
              <input
                type="number"
                value={guests}
                min={1}
                max={room.max_guests}
                onChange={e => setGuests(Math.max(1, Math.min(room.max_guests, parseInt(e.target.value) || 1)))}
                className="w-32 px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-lg"
              />
              <span className="text-stone-400 text-sm ml-3">Max {room.max_guests}</span>
            </div>

            {/* Book Button */}
            <button
              onClick={handleBook}
              disabled={!checkIn || !checkOut || nights <= 0}
              className="w-full bg-amber-700 text-white py-4 rounded-xl font-semibold text-lg hover:bg-amber-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm Booking — KES {totalPrice.toLocaleString()}
            </button>
          </div>
        )}

        {/* ==================== STEP 2: Payment ==================== */}
        {step === 2 && booking && (
          <div className="bg-white rounded-2xl border border-stone-200 p-8">
            <h2 className="text-xl font-bold text-stone-800 mb-6">Pay via M-Pesa</h2>

            <div className="bg-amber-50 rounded-xl p-5 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-stone-600">Booking #{booking.id}</span>
                <span className="text-stone-600 capitalize">{room.room_type} Room</span>
              </div>
              <div className="flex justify-between mb-2 text-sm text-stone-500">
                <span>{checkIn} → {checkOut}</span>
                <span>{nights} night{nights > 1 ? 's' : ''}</span>
              </div>
              <div className="border-t border-amber-200 mt-3 pt-3">
                <span className="text-2xl font-bold text-amber-800">KES {totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-stone-700 mb-2">
                <CreditCard className="w-4 h-4 inline mr-1" /> M-Pesa Phone Number
              </label>
              <input
                type="text"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                placeholder="e.g. 0712345678"
                className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-lg"
              />
              <p className="text-stone-400 text-sm mt-1">Enter the phone number registered with M-Pesa</p>
            </div>

            <button
              onClick={handlePay}
              className="w-full bg-emerald-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-emerald-700 transition"
            >
              Pay KES {totalPrice.toLocaleString()} with M-Pesa
            </button>

            <button
              onClick={() => setStep(1)}
              className="w-full text-stone-500 py-3 mt-3 hover:text-stone-700 transition text-sm"
            >
              ← Change dates
            </button>
          </div>
        )}

        {/* ==================== STEP 3: Waiting / Confirmed ==================== */}
        {step === 3 && (
          <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center">
            {paymentStatus?.status === 'completed' ? (
              <>
                <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-stone-800 mb-2">Payment Successful!</h2>
                <p className="text-stone-500 mb-2">Receipt: <span className="font-semibold">{paymentStatus.receipt}</span></p>
                <p className="text-stone-500 mb-8">Your booking is confirmed. Room {room.room_number} is reserved for you.</p>
                <button
                  onClick={() => navigate('/guest/bookings')}
                  className="bg-amber-700 text-white px-8 py-3 rounded-full font-medium hover:bg-amber-800 transition"
                >
                  View My Bookings
                </button>
              </>
            ) : (
              <>
                <div className="animate-spin w-16 h-16 border-4 border-amber-700 border-t-transparent rounded-full mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-stone-800 mb-2">Waiting for Payment</h2>
                <p className="text-stone-500 mb-4">Check your phone and enter your M-Pesa PIN to complete payment.</p>
                <p className="text-stone-400 text-sm">Amount: KES {totalPrice.toLocaleString()}</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GuestBookRoom;