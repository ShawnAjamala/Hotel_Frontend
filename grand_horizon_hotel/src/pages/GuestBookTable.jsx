import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Users, Clock, CheckCircle, XCircle, UtensilsCrossed, AlertTriangle } from 'lucide-react';
import API from '../services/api';
import GuestNavbar from '../components/GuestNavbar';

const GuestBookTable = () => {
  const navigate = useNavigate();
  const { tableId } = useParams();

  const [table, setTable] = useState(null);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [guests, setGuests] = useState(2);
  const [booking, setBooking] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [step, setStep] = useState(1);
  const [popup, setPopup] = useState({ show: false, message: '' });

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const showPopup = (message) => {
    setPopup({ show: true, message });
    setTimeout(() => setPopup({ show: false, message: '' }), 3000);
  };

  useEffect(() => {
    API.get(`/tables/`, { headers }).then(res => {
      const data = Array.isArray(res.data) ? res.data : [];
      const found = data.find(t => t.id === parseInt(tableId));
      setTable(found);
    }).catch(() => navigate('/guest/tables'));
  }, [tableId]);

  const totalPrice = table ? parseFloat(table.price_per_slot) : 0;
  const today = new Date().toISOString().split('T')[0];

  const handleBook = async () => {
    if (!date || !startTime || !endTime) return showPopup('Please select date, start time and end time.');
    try {
      const res = await API.post('/tables/reserve/', {
        table_id: tableId, date, start_time: startTime, end_time: endTime, guests
      }, { headers });
      setBooking(res.data.booking);
      setStep(2);
    } catch (err) {
      showPopup(err.response?.data?.error || 'Booking failed.');
    }
  };

  const handlePay = async () => {
    if (!phoneNumber) return showPopup('Enter your M-Pesa phone number.');
    const phone = phoneNumber.startsWith('254') ? phoneNumber : `254${phoneNumber.replace(/^0+/, '')}`;
    try {
      const res = await API.post('/mpesa/pay/', { phone_number: phone, amount: totalPrice, booking_id: `TBL-${booking.id}` });
      setPaymentStatus({ checkout_id: res.data.checkout_request_id, status: 'pending' });
      setStep(3);
      pollPayment(res.data.checkout_request_id);
    } catch (err) {
      showPopup(err.response?.data?.error || 'Payment failed.');
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
          setPaymentStatus(prev => ({ ...prev, status: 'failed', message: res.data.result_desc || 'Payment failed.' }));
          clearInterval(interval);
        }
      } catch (e) {}
    }, 5000);
    setTimeout(() => {
      clearInterval(interval);
      setPaymentStatus(prev => prev?.status === 'pending' ? { ...prev, status: 'timeout', message: 'Payment timed out.' } : prev);
    }, 120000);
  };

  if (!table) return (
    <div className="min-h-screen bg-stone-50"><GuestNavbar /><div className="flex justify-center py-40"><div className="animate-spin w-10 h-10 border-4 border-amber-700 border-t-transparent rounded-full" /></div></div>
  );

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <GuestNavbar />

      {popup.show && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-stone-100 px-6 py-4 flex items-center gap-4 max-w-md">
            <div className="bg-amber-100 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"><AlertTriangle className="w-5 h-5 text-amber-600" /></div>
            <p className="text-stone-700 font-medium text-sm">{popup.message}</p>
          </div>
        </div>
      )}

      <section className="relative bg-stone-900 text-white py-10 px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200')] bg-cover bg-center opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/90 to-transparent" />
        <div className="relative max-w-4xl mx-auto">
          <button onClick={() => navigate('/guest/tables')} className="flex items-center gap-2 text-amber-300 hover:text-amber-200 transition mb-3">
            <ArrowLeft className="w-4 h-4" /> Back to Tables
          </button>
          <h1 className="text-3xl font-serif font-bold">Reserve Your Table</h1>
        </div>
      </section>

      <div className="max-w-xl mx-auto px-8 -mt-6 relative z-10 pb-16">

        {/* Step 1: Select Date & Time */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-xl border border-stone-100 p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-amber-100 w-12 h-12 rounded-xl flex items-center justify-center"><UtensilsCrossed className="w-6 h-6 text-amber-700" /></div>
              <div>
                <h2 className="text-lg font-bold text-stone-800">Table {table.table_number}</h2>
                <p className="text-stone-500 text-sm">{table.capacity} guests • {table.location || 'Main Dining'} • KES {parseFloat(table.price_per_slot).toLocaleString()}</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1">Date</label>
                <input type="date" value={date} min={today} onChange={e => setDate(e.target.value)} className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-500 mb-1">Start Time</label>
                  <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-500 mb-1">End Time</label>
                  <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1">Guests</label>
                <input type="number" value={guests} min={1} max={table.capacity} onChange={e => setGuests(Math.max(1, Math.min(table.capacity, parseInt(e.target.value) || 1)))} className="w-24 px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none" />
                <span className="text-stone-400 text-xs ml-3">Max {table.capacity}</span>
              </div>
            </div>

            {date && startTime && endTime && (
              <div className="bg-amber-50 rounded-xl p-4 mb-6">
                <div className="flex justify-between text-sm text-stone-600 mb-1"><span><Clock className="w-3 h-3 inline mr-1" />{startTime} - {endTime}</span><span><Users className="w-3 h-3 inline mr-1" />{guests} guests</span></div>
                <div className="text-xs text-stone-400 mb-2">{date}</div>
                <div className="border-t border-amber-200 pt-2 flex justify-between"><span className="text-stone-600 text-sm">Total</span><span className="font-bold text-amber-800">KES {totalPrice.toLocaleString()}</span></div>
              </div>
            )}

            <button onClick={handleBook} disabled={!date || !startTime || !endTime} className="w-full bg-amber-700 text-white py-3 rounded-xl font-semibold hover:bg-amber-800 transition disabled:opacity-50">
              Confirm Reservation • KES {totalPrice.toLocaleString()}
            </button>
          </div>
        )}

        {/* Step 2: Payment */}
        {step === 2 && booking && (
          <div className="bg-white rounded-2xl shadow-xl border border-stone-100 p-6">
            <h2 className="text-lg font-bold text-stone-800 mb-4">Pay with M-Pesa</h2>
            <div className="bg-amber-50 rounded-lg p-3 mb-4">
              <div className="flex justify-between text-sm mb-1"><span>Booking #{booking.id}</span><span>Table {table.table_number}</span></div>
              <div className="text-xs text-stone-400 mb-1">{date} • {startTime} - {endTime}</div>
              <div className="border-t border-amber-200 pt-2"><span className="font-bold text-amber-800">KES {totalPrice.toLocaleString()}</span></div>
            </div>
            <div className="mb-4">
              <label className="block text-xs font-medium text-stone-500 mb-1">M-Pesa Number</label>
              <input type="text" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="0712345678" className="w-full px-4 py-3 border border-stone-200 rounded-xl outline-none" />
            </div>
            <button onClick={handlePay} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition">Pay KES {totalPrice.toLocaleString()}</button>
            <button onClick={() => setStep(1)} className="w-full text-stone-400 py-2 mt-1 hover:text-stone-600 text-sm">← Change</button>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <div className="bg-white rounded-2xl shadow-xl border border-stone-100 p-6 text-center">
            {paymentStatus?.status === 'completed' ? (
              <>
                <div className="bg-emerald-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3"><CheckCircle className="w-7 h-7 text-emerald-600" /></div>
                <h2 className="text-lg font-bold text-stone-800 mb-1">Reservation Confirmed!</h2>
                <p className="text-stone-500 text-sm mb-4">Receipt: {paymentStatus.receipt}</p>
                <button onClick={() => navigate('/guest/bookings')} className="bg-amber-700 text-white px-6 py-2 rounded-full font-medium text-sm hover:bg-amber-800 transition">View My Bookings</button>
              </>
            ) : paymentStatus?.status === 'failed' || paymentStatus?.status === 'timeout' ? (
              <>
                <div className="bg-red-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3"><XCircle className="w-7 h-7 text-red-500" /></div>
                <h2 className="text-lg font-bold text-stone-800 mb-1">Payment Failed</h2>
                <p className="text-stone-500 text-sm mb-4">{paymentStatus.message}</p>
                <button onClick={() => { setStep(2); setPaymentStatus(null); }} className="bg-amber-700 text-white px-6 py-2 rounded-full font-medium text-sm hover:bg-amber-800 transition">Try Again</button>
              </>
            ) : (
              <>
                <div className="animate-spin w-12 h-12 border-4 border-amber-700 border-t-transparent rounded-full mx-auto mb-3" />
                <h2 className="text-lg font-bold text-stone-800 mb-1">Waiting for Payment</h2>
                <p className="text-stone-500 text-sm">Check your phone for M-Pesa prompt.</p>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default GuestBookTable;