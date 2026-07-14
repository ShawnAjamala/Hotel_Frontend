import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, CheckCircle, XCircle, AlertCircle, 
  User, Calendar, RefreshCw,
  Filter, Eye, X, Trash2, CreditCard, Check
} from 'lucide-react';
import API from '../services/api';
import StaffNavbar from '../components/StaffNavbar';
import Footer from '../components/Footer';

const StaffCancellationRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteRequestId, setDeleteRequestId] = useState(null);
  const [staffNotes, setStaffNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [refundStatuses, setRefundStatuses] = useState({});

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await API.get(`/cancellation/requests/?status=${filter}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const requestsData = res.data.requests || [];
      
      // Fetch refund status for each request that is approved
      const statuses = {};
      for (const req of requestsData) {
        if (req.status === 'approved') {
          try {
            const refundRes = await API.get(`/refund/by-request/${req.id}/`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            statuses[req.id] = refundRes.data.status;
          } catch {
            statuses[req.id] = 'pending';
          }
        }
      }
      setRefundStatuses(statuses);
      setRequests(requestsData);
    } catch (err) {
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const handleApprove = async (requestId) => {
    setActionLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      await API.post(`/cancellation/${requestId}/approve/`, 
        { staff_notes: staffNotes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowModal(false);
      setStaffNotes('');
      fetchRequests();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to approve cancellation');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (requestId) => {
    setActionLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      await API.post(`/cancellation/${requestId}/reject/`, 
        { staff_notes: staffNotes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowModal(false);
      setStaffNotes('');
      fetchRequests();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reject cancellation');
    } finally {
      setActionLoading(false);
    }
  };

  const handleProcessRefund = async (requestId) => {
    setActionLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const refundRes = await API.get(`/refund/by-request/${requestId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const refundId = refundRes.data.id;
      
      await API.post(`/refund/${refundId}/process/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setRefundStatuses(prev => ({
        ...prev,
        [requestId]: 'completed'
      }));
      
      fetchRequests();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to process refund');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (requestId) => {
    setActionLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      await API.delete(`/cancellation/${requestId}/delete/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowDeleteModal(false);
      setDeleteRequestId(null);
      fetchRequests();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete request');
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

  const openDeleteModal = (requestId) => {
    setDeleteRequestId(requestId);
    setShowDeleteModal(true);
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

  const isRefundCompleted = (requestId) => {
    return refundStatuses[requestId] === 'completed';
  };

  const isRefundPending = (requestId) => {
    const status = refundStatuses[requestId];
    return status === 'pending' || status === 'processing' || !status;
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <StaffNavbar />

      <section className="relative bg-gradient-to-br from-amber-900 to-amber-800 text-white py-14 px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/90 to-transparent" />
        <div className="relative max-w-7xl mx-auto">
          <div>
            <h1 className="text-4xl font-bold">Cancellation Requests</h1>
            <p className="text-amber-100/80 mt-2 text-lg">Manage guest cancellation and refund requests</p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-8 -mt-6 relative z-10 pb-16">
        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4 mb-8">
          <div className="flex flex-wrap items-center gap-3">
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
            <p className="text-stone-400">There are no {filter} cancellation requests at this time.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => {
              const isApproved = request.status === 'approved';
              const refundCompleted = isRefundCompleted(request.id);
              const refundPending = isRefundPending(request.id);
              
              return (
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
                        <User className="w-6 h-6 text-amber-700" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-stone-800">{request.guest}</h3>
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
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="text-right">
                        {request.refund_amount && (
                          <p className="text-sm text-stone-500">Refund</p>
                        )}
                        <p className="font-bold text-stone-800">
                          {request.refund_amount ? `KES ${parseFloat(request.refund_amount).toLocaleString()}` : '-'}
                        </p>
                      </div>
                      {getStatusBadge(request.status)}
                      {refundCompleted && (
                        <span className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                          <Check className="w-3 h-3" /> Refunded
                        </span>
                      )}
                      <div className="flex gap-2">
                        {request.status === 'pending' && (
                          <button
                            onClick={() => openModal(request)}
                            className="bg-amber-700 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-amber-800 transition flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" /> Review
                          </button>
                        )}
                        {isApproved && refundPending && (
                          <button
                            onClick={() => handleProcessRefund(request.id)}
                            disabled={actionLoading}
                            className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-emerald-700 transition flex items-center gap-1"
                          >
                            <CreditCard className="w-4 h-4" /> Process Refund
                          </button>
                        )}
                        {(request.status === 'approved' || request.status === 'rejected') && (
                          <button
                            onClick={() => openDeleteModal(request.id)}
                            className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition"
                            title="Delete Request"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
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
              );
            })}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-stone-800">Review Cancellation</h2>
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
                  <div className="col-span-2">
                    <p className="text-stone-500">Reason</p>
                    <p className="font-medium text-stone-800">{selectedRequest.reason}</p>
                  </div>
                  {selectedRequest.booking_details && (
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
                onClick={() => handleReject(selectedRequest.id)}
                disabled={actionLoading}
                className="flex-1 py-3 border border-red-200 text-red-600 rounded-xl font-medium hover:bg-red-50 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <XCircle className="w-4 h-4" /> Reject
              </button>
              <button
                onClick={() => handleApprove(selectedRequest.id)}
                disabled={actionLoading}
                className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {actionLoading ? 'Processing...' : <><CheckCircle className="w-4 h-4" /> Approve & Refund</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 text-center">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-stone-800 mb-2">Delete Request</h3>
            <p className="text-stone-500 mb-6">
              Are you sure you want to permanently delete this cancellation request?
              <br />
              <span className="text-xs text-stone-400">This action cannot be undone.</span>
            </p>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2.5 rounded-xl mb-4 text-sm">
                {error}
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 border border-stone-200 rounded-xl text-stone-600 font-medium hover:bg-stone-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteRequestId)}
                disabled={actionLoading}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {actionLoading ? 'Deleting...' : <><Trash2 className="w-4 h-4" /> Delete</>}
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