import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, CheckCircle, XCircle, AlertCircle, 
  User, Calendar, DollarSign, MessageSquare, RefreshCw,
  Filter, Eye, Check, X, Edit3
} from 'lucide-react';
import API from '../services/api';
import StaffNavbar from '../components/StaffNavbar';
import Footer from '../components/Footer';

const StaffCancellationRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [requestType, setRequestType] = useState('all'); // 'all', 'cancellation', 'edit'
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [staffNotes, setStaffNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      // Fetch both cancellation and edit requests
      const [cancellationRes, editRes] = await Promise.all([
        API.get(`/cancellation/requests/?status=${filter}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        API.get(`/booking/edit/requests/?status=${filter}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      let allRequests = [];
      
      // Add cancellation requests with type marker
      if (cancellationRes.data.requests) {
        allRequests = allRequests.concat(
          cancellationRes.data.requests.map(r => ({ ...r, request_type: 'cancellation' }))
        );
      }
      
      // Add edit requests with type marker
      if (editRes.data.requests) {
        allRequests = allRequests.concat(
          editRes.data.requests.map(r => ({ ...r, request_type: 'edit' }))
        );
      }
      
      // Filter by request type if specified
      if (requestType !== 'all') {
        allRequests = allRequests.filter(r => r.request_type === requestType);
      }
      
      // Sort by created_at (newest first)
      allRequests.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      
      setRequests(allRequests);
    } catch (err) {
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [filter, requestType]);

  const handleApprove = async (requestId, requestType) => {
    setActionLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const endpoint = requestType === 'cancellation' 
        ? `/cancellation/${requestId}/approve/`
        : `/booking/edit/${requestId}/approve/`;
      
      await API.post(endpoint, 
        { staff_notes: staffNotes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowModal(false);
      setStaffNotes('');
      fetchRequests();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to approve request');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (requestId, requestType) => {
    setActionLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const endpoint = requestType === 'cancellation' 
        ? `/cancellation/${requestId}/reject/`
        : `/booking/edit/${requestId}/reject/`;
      
      await API.post(endpoint, 
        { staff_notes: staffNotes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowModal(false);
      setStaffNotes('');
      fetchRequests();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reject request');
    } finally {
      setActionLoading(false);
    }
  };

  const openModal = (request) => {
    setSelectedRequest(request);
    setStaffNotes('');
    setShowModal(true);
    setError('');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full text-xs font-medium">Pending</span>;
      case 'approved':
        return <span className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-medium">Approved</span>;
      case 'rejected':
        return <span className="bg-red-100 text-red-600 px-2.5 py-1 rounded-full text-xs font-medium">Rejected</span>;
      default:
        return <span className="bg-stone-100 text-stone-600 px-2.5 py-1 rounded-full text-xs font-medium">{status}</span>;
    }
  };

  const getRequestTypeBadge = (type) => {
    if (type === 'cancellation') {
      return <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full text-xs font-medium">Cancellation</span>;
    } else {
      return <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">Edit</span>;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <StaffNavbar />

      <section className="relative bg-gradient-to-br from-amber-900 to-amber-800 text-white py-14 px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/90 to-transparent" />
        <div className="relative max-w-7xl mx-auto">
          <div>
            <h1 className="text-4xl font-bold">Booking Requests</h1>
            <p className="text-amber-100/80 mt-2 text-lg">Manage cancellation and edit requests from guests</p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-8 -mt-6 relative z-10 pb-16">
        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-stone-400" />
              <span className="text-sm font-medium text-stone-700">Status:</span>
              {['pending', 'approved', 'rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    filter === status
                      ? 'bg-amber-700 text-white shadow-md'
                      : 'bg-stone-100 text-stone-600 hover:bg-amber-100'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 border-l border-stone-200 pl-4">
              <span className="text-sm font-medium text-stone-700">Type:</span>
              {['all', 'cancellation', 'edit'].map((type) => (
                <button
                  key={type}
                  onClick={() => setRequestType(type)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    requestType === type
                      ? 'bg-amber-700 text-white shadow-md'
                      : 'bg-stone-100 text-stone-600 hover:bg-amber-100'
                  }`}
                >
                  {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
            <button
              onClick={fetchRequests}
              className="ml-auto flex items-center gap-2 text-stone-500 hover:text-amber-700 text-sm transition"
            >
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
          </div>
        </div>

        {/* Requests List */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin w-10 h-10 border-4 border-amber-700 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-stone-500">Loading requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
            <AlertCircle className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-stone-600 mb-2">No {filter} requests</h3>
            <p className="text-stone-400">There are no {filter} cancellation or edit requests at this time.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request.id}
                className={`bg-white border rounded-2xl p-6 hover:shadow-md transition ${
                  request.status === 'pending'
                    ? 'border-amber-200 border-l-4 border-l-amber-500'
                    : request.status === 'approved'
                    ? 'border-emerald-200 border-l-4 border-l-emerald-500'
                    : 'border-red-200 border-l-4 border-l-red-500'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-amber-100 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                      {request.request_type === 'cancellation' ? (
                        <XCircle className="w-6 h-6 text-amber-700" />
                      ) : (
                        <Edit3 className="w-6 h-6 text-amber-700" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-stone-800">{request.guest}</h3>
                        {getRequestTypeBadge(request.request_type)}
                      </div>
                      <p className="text-stone-500 text-sm">{request.guest_email}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-stone-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {new Date(request.created_at).toLocaleDateString()}
                        </span>
                        <span className="text-xs text-stone-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {request.booking_type} #{request.booking_id}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      {request.request_type === 'cancellation' && request.refund_amount && (
                        <p className="text-sm text-stone-500">Refund</p>
                      )}
                      <p className="font-bold text-stone-800">
                        {request.request_type === 'cancellation' && request.refund_amount 
                          ? `KES ${parseFloat(request.refund_amount).toLocaleString()}` 
                          : request.request_type === 'edit' 
                          ? 'Date Change' 
                          : '-'}
                      </p>
                      {request.request_type === 'edit' && request.booking_details && (
                        <p className="text-xs text-stone-400">
                          {request.booking_details.current_check_in} → {request.booking_details.requested_check_in}
                        </p>
                      )}
                    </div>
                    {getStatusBadge(request.status)}
                    {request.status === 'pending' && (
                      <button
                        onClick={() => openModal(request)}
                        className="bg-amber-700 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-amber-800 transition flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" /> Review
                      </button>
                    )}
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-stone-100">
                  <p className="text-sm text-stone-600">
                    <span className="font-medium">Reason:</span> {request.reason}
                  </p>
                  {request.staff_notes && (
                    <p className="text-sm text-stone-500 mt-1">
                      <span className="font-medium">Staff Notes:</span> {request.staff_notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-stone-800">Review Request</h2>
                {getRequestTypeBadge(selectedRequest.request_type)}
              </div>
              <button onClick={() => setShowModal(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2.5 rounded-xl mb-4 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div className="bg-stone-50 rounded-xl p-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-stone-500">Guest</p>
                    <p className="font-medium text-stone-800">{selectedRequest.guest}</p>
                  </div>
                  <div>
                    <p className="text-stone-500">Email</p>
                    <p className="font-medium text-stone-800">{selectedRequest.guest_email}</p>
                  </div>
                  <div>
                    <p className="text-stone-500">Booking Type</p>
                    <p className="font-medium text-stone-800">{selectedRequest.booking_type} #{selectedRequest.booking_id}</p>
                  </div>
                  <div>
                    <p className="text-stone-500">Status</p>
                    {getStatusBadge(selectedRequest.status)}
                  </div>
                  {selectedRequest.request_type === 'edit' && selectedRequest.booking_details && (
                    <>
                      <div className="col-span-1">
                        <p className="text-stone-500">Current Dates</p>
                        <p className="font-medium text-stone-800">
                          {selectedRequest.booking_details.current_check_in} → {selectedRequest.booking_details.current_check_out}
                        </p>
                      </div>
                      <div className="col-span-1">
                        <p className="text-stone-500">Requested Dates</p>
                        <p className="font-medium text-stone-800">
                          {selectedRequest.booking_details.requested_check_in} → {selectedRequest.booking_details.requested_check_out}
                        </p>
                      </div>
                    </>
                  )}
                  <div className="col-span-2">
                    <p className="text-stone-500">Reason</p>
                    <p className="font-medium text-stone-800">{selectedRequest.reason}</p>
                  </div>
                  {selectedRequest.booking_details && selectedRequest.request_type === 'cancellation' && (
                    <div className="col-span-2">
                      <p className="text-stone-500">Booking Details</p>
                      <p className="font-medium text-stone-800">
                        Total: KES {parseFloat(selectedRequest.booking_details.total_price || 0).toLocaleString()}
                        {' · '}
                        Status: {selectedRequest.booking_details.status}
                        {' · '}
                        Payment: {selectedRequest.booking_details.payment_status}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Staff Notes</label>
                <textarea
                  value={staffNotes}
                  onChange={(e) => setStaffNotes(e.target.value)}
                  className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm resize-none"
                  rows="3"
                  placeholder="Add notes about this request..."
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleReject(selectedRequest.id, selectedRequest.request_type)}
                disabled={actionLoading}
                className="flex-1 py-3 border border-red-200 text-red-600 rounded-xl font-medium hover:bg-red-50 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <XCircle className="w-4 h-4" /> Reject
              </button>
              <button
                onClick={() => handleApprove(selectedRequest.id, selectedRequest.request_type)}
                disabled={actionLoading}
                className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {actionLoading ? 'Processing...' : <><CheckCircle className="w-4 h-4" /> Approve</>}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default StaffCancellationRequests;