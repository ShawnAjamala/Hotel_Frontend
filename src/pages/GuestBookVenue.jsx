import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Users, CheckCircle, XCircle, PartyPopper, AlertTriangle } from 'lucide-react';
import API from '../services/api';
import GuestNavbar from '../components/GuestNavbar';

const GuestBookVenue = () => {
  const navigate = useNavigate();
  const { venueId } = useParams();
  const [venue, setVenue] = useState(null);
  const [evType, setEvType] = useState('wedding');
  const [date, setDate] = useState('');
  const [guests, setGuests] = useState(50);
  const [pkg, setPkg] = useState([]);
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
    let mounted = true;
    API.get('/venues/', { headers })
      .then(r => {
        if (!mounted) return;
        const d = Array.isArray(r.data) ? r.data : [];
        const found = d.find(v => v.id === parseInt(venueId));
        if (found) setVenue(found);
        else navigate('/guest/events');
      })
      .catch(() => navigate('/guest/events'));
    return () => { mounted = false; };
  }, [venueId]);

  const base = venue ? parseFloat(venue.price_per_day) : 0;

  const getList = () => {
    if (!venue?.additional_packages) return [];
    const sections = venue.additional_packages.split('|');
    for (const x of sections) {
      if (x.trim().toLowerCase().startsWith(evType.toLowerCase())) {
        const pkgStr = x.split(' ').slice(1).join(' ');
        return pkgStr.split(',').map(y => y.trim()).filter(y => y.includes(':'));
      }
    }
    return [];
  };
  const list = getList();
  const extra = pkg.reduce((s, p) => { const f = list.find(x => x.startsWith(p)); return f ? s + parseFloat(f.split(':')[1]) : s; }, 0);
  const total = base + extra;

  const toggle = useCallback((p) => {
    setPkg(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  }, []);

  const book = async () => {
    if (!date) return showPopup('Please select an event date.');
    try {
      const r = await API.post('/venues/book/', {
        venue_id: venueId, event_type: evType, date, guests, selected_packages: pkg
      }, { headers });
      setBooking(r.data.booking);
      setStep(2);
    } catch (e) {
      showPopup(e.response?.data?.error || 'Booking failed. Please try again.');
    }
  };

  const pay = async () => {
    if (!phone) return showPopup('Enter your M-Pesa phone number.');
    const p = phone.startsWith('254') ? phone : `254${phone.replace(/^0+/, '')}`;
    try {
      const r = await API.post('/mpesa/pay/', {
        phone_number: p, amount: total, booking_id: `VEN-${booking.id}`
      });
      setPayStatus({ cid: r.data.checkout_request_id, status: 'pending' });
      setStep(3);
      poll(r.data.checkout_request_id);
    } catch (e) {
      showPopup(e.response?.data?.error || 'Payment initiation failed.');
    }
  };

  const poll = (cid) => {
    let attempts = 0;
    const check = async () => {
      if (attempts++ >= 24) {
        setPayStatus(p => p?.status === 'pending' ? { ...p, status: 'timeout', message: 'Payment timed out. Please try again.' } : p);
        return;
      }
      try {
        const r = await API.get(`/mpesa/status/${cid}/`);
        if (r.data.status === 'Completed') { setPayStatus(p => ({ ...p, status: 'completed', receipt: r.data.mpesa_receipt })); return; }
        if (r.data.status === 'Failed' || r.data.status === 'Cancelled') { setPayStatus(p => ({ ...p, status: 'failed', message: r.data.result_desc || 'Payment failed.' })); return; }
      } catch { /* keep polling */ }
      setTimeout(check, 5000);
    };
    check();
  };

  if (!venue) return (
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

      {/* Toast */}
      {popup.show && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl px-5 py-4 flex items-center gap-3">
            <div className="bg-amber-100 w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-stone-700 text-sm leading-snug">{popup.message}</p>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="relative bg-stone-900 text-white py-12 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200')] bg-cover bg-center opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/90 to-transparent" />
        <div className="relative max-w-2xl mx-auto">
          <button onClick={() => navigate('/guest/events')} className="flex items-center gap-2 text-amber-300 hover:text-amber-200 mb-4">
            <ArrowLeft className="w-4 h-4" /><span className="text-sm"></span>
          </button>
          <div className="flex items-center gap-4 mt-2">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/10 flex-shrink-0">
              {venue.image
                ? <img src={venue.image} loading="lazy" alt={venue.name} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center"><PartyPopper className="w-8 h-8 text-white/50" /></div>
              }
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-serif font-bold truncate">{venue.name}</h1>
              <p className="text-stone-300 text-sm mt-1">
                {venue.capacity} guests &bull; KES {parseFloat(venue.price_per_day).toLocaleString()}/day
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 pb-16">

        {/* Step 1 — Booking form */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-xl border p-6 sm:p-8">
            <h2 className="text-xl font-bold text-stone-800 mb-6">Book Venue</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Event Type</label>
                <select value={evType} onChange={e => { setEvType(e.target.value); setPkg([]); }}
                  className="w-full px-4 py-3 border border-stone-200 rounded-xl outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 bg-white text-stone-800">
                  <option value="wedding">Wedding</option>
                  <option value="birthday">Birthday</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Event Date</label>
                <input type="date" value={date} min={today} onChange={e => setDate(e.target.value)}
                  className="w-full px-4 py-3 border border-stone-200 rounded-xl outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 text-stone-800" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  <Users className="w-4 h-4 inline mr-1 text-amber-600" /> Number of Guests
                </label>
                <div className="flex items-center gap-3">
                  <input type="number" value={guests} min={1} max={venue.capacity}
                    onChange={e => setGuests(Math.max(1, Math.min(venue.capacity, parseInt(e.target.value) || 1)))}
                    className="w-28 px-4 py-3 border border-stone-200 rounded-xl outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 text-stone-800" />
                  <span className="text-stone-400 text-sm">Max: {venue.capacity}</span>
                </div>
              </div>
            </div>

            {/* Packages */}
            {list.length > 0 && (
              <div className="mt-5">
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Packages for {evType.charAt(0).toUpperCase() + evType.slice(1)}
                </label>
                <div className="flex flex-wrap gap-2">
                  {list.map(p => {
                    const [n, pr] = p.split(':');
                    const name = n.trim();
                    return (
                      <button key={name} onClick={() => toggle(name)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          pkg.includes(name) ? 'bg-amber-700 text-white' : 'bg-stone-100 text-stone-600 hover:bg-amber-100'
                        }`}>
                        {name} <span className="opacity-75">(+KES {pr})</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Summary */}
            {date && (
              <div className="mt-5 bg-amber-50 rounded-2xl p-4 border border-amber-100">
                <div className="flex items-center justify-between text-sm text-stone-500 mb-2">
                  <span>{date}</span>
                  <span className="flex items-center gap-1"><Users className="w-4 h-4 text-amber-600" />{guests} guests</span>
                </div>
                {extra > 0 && (
                  <p className="text-sm text-stone-500 mb-1">
                    Base: KES {base.toLocaleString()} + Packages: KES {extra.toLocaleString()}
                  </p>
                )}
                <div className="border-t border-amber-200 pt-3 flex justify-between items-center">
                  <span className="font-medium text-stone-700">Total</span>
                  <span className="text-2xl font-bold text-amber-800">KES {total.toLocaleString()}</span>
                </div>
              </div>
            )}

            <button onClick={book} disabled={!date}
              className="mt-5 w-full bg-amber-700 text-white py-3.5 rounded-xl font-semibold text-base hover:bg-amber-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-100 transition-colors">
              {date ? `Confirm Booking · KES ${total.toLocaleString()}` : 'Select a Date to Continue'}
            </button>
          </div>
        )}

        {/* Step 2 — M-Pesa */}
        {step === 2 && booking && (
          <div className="bg-white rounded-2xl shadow-xl border p-6 sm:p-8">
            <h2 className="text-xl font-bold text-stone-800 mb-5">Pay with M-Pesa</h2>
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-stone-700">#{booking.id}</span>
                <span className="bg-amber-200 text-amber-800 px-3 py-1 rounded-full text-xs font-medium">{venue.name}</span>
              </div>
              <p className="text-sm text-stone-500 mb-3">{date} &bull; {guests} guests</p>
              <div className="border-t border-amber-200 pt-3">
                <span className="text-2xl font-bold text-amber-800">KES {total.toLocaleString()}</span>
              </div>
            </div>
            <div className="mb-5">
              <label className="block text-sm font-medium text-stone-700 mb-1.5">M-Pesa Phone Number</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="0712 345 678"
                className="w-full px-4 py-3 border border-stone-200 rounded-xl outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 text-stone-800 text-lg" />
            </div>
            <button onClick={pay}
              className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-semibold text-base hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-colors">
              Pay KES {total.toLocaleString()}
            </button>
            <button onClick={() => setStep(1)} className="w-full text-stone-400 py-3 mt-2 hover:text-stone-600 text-sm font-medium transition-colors">
              ← Change booking details
            </button>
          </div>
        )}

        {/* Step 3 — Status */}
        {step === 3 && (
          <div className="bg-white rounded-2xl shadow-xl border p-8 text-center">
            {payStatus?.status === 'completed' ? (
              <>
                <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-10 h-10 text-emerald-600" /></div>
                <h2 className="text-xl font-bold text-stone-800 mb-2">Payment Confirmed!</h2>
                <p className="text-stone-500 mb-6">Receipt: <span className="font-mono font-medium">{payStatus.receipt}</span></p>
                <button onClick={() => navigate('/guest/bookings')} className="bg-amber-700 text-white px-8 py-3 rounded-full font-medium hover:bg-amber-800 shadow-lg transition-colors">View My Bookings</button>
              </>
            ) : payStatus?.status === 'failed' || payStatus?.status === 'timeout' ? (
              <>
                <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"><XCircle className="w-10 h-10 text-red-500" /></div>
                <h2 className="text-xl font-bold text-stone-800 mb-2">Payment Failed</h2>
                <p className="text-stone-500 mb-6">{payStatus.message}</p>
                <button onClick={() => { setStep(2); setPayStatus(null); }} className="bg-amber-700 text-white px-8 py-3 rounded-full font-medium hover:bg-amber-800 shadow-lg transition-colors">Try Again</button>
              </>
            ) : (
              <>
                <div className="animate-spin w-16 h-16 border-4 border-amber-700 border-t-transparent rounded-full mx-auto mb-4" />
                <h2 className="text-xl font-bold text-stone-800 mb-2">Waiting for Payment</h2>
                <p className="text-stone-500">Check your phone and enter your M-Pesa PIN.</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GuestBookVenue;