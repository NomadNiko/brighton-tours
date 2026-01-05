'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UsersIcon, CalendarIcon, BarChart3Icon, LogOutIcon, CheckIcon, XIcon, ClockIcon, PlusIcon, TrashIcon, ChevronDownIcon, ChevronUpIcon, MailIcon, AlertTriangleIcon } from 'lucide-react';

// Cancellation Modal Component
function CancelModal({ isOpen, onClose, onConfirm, title, description, defaultMessage }) {
  const [message, setMessage] = useState(defaultMessage);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) setMessage(defaultMessage);
  }, [isOpen, defaultMessage]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm(message);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full shadow-2xl">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangleIcon className="size-5 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          </div>
          <p className="text-slate-600 mb-4">{description}</p>
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">Cancellation Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
              placeholder="Enter message to send to customer(s)..."
            />
            <p className="text-xs text-slate-500 mt-1">This message will be included in the cancellation email.</p>
          </div>
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 font-medium"
            >
              Go Back
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading || !message.trim()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:bg-slate-300"
            >
              {loading ? 'Cancelling...' : 'Yes, Cancel'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [admin, setAdmin] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [slots, setSlots] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [expandedSlot, setExpandedSlot] = useState(null);
  const [slotBookings, setSlotBookings] = useState({});
  
  // Cancellation modal state
  const [cancelModal, setCancelModal] = useState({ isOpen: false, type: null, data: null });
  
  const router = useRouter();

  // New slot form
  const [newSlotDate, setNewSlotDate] = useState('');
  const [newSlotTime, setNewSlotTime] = useState('10:00');
  const [newSlotCapacity, setNewSlotCapacity] = useState(20);

  useEffect(() => { checkAuth(); }, []);

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
  });

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/admin/me', { headers: getAuthHeaders() });
      const data = await res.json();
      if (data.success) {
        setAdmin(data.admin);
        loadData();
      } else {
        router.push('/admin');
      }
    } catch {
      router.push('/admin');
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, bookingsRes, slotsRes] = await Promise.all([
        fetch('/api/admin/analytics', { headers: getAuthHeaders() }),
        fetch('/api/admin/bookings', { headers: getAuthHeaders() }),
        fetch('/api/admin/slots', { headers: getAuthHeaders() }),
      ]);
      const [analyticsData, bookingsData, slotsData] = await Promise.all([
        analyticsRes.json(), bookingsRes.json(), slotsRes.json(),
      ]);
      setAnalytics(analyticsData.data);
      setBookings(bookingsData.data || []);
      setSlots(slotsData.data || []);
    } catch (e) {
      console.error('Failed to load data:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST', headers: getAuthHeaders() });
    localStorage.removeItem('adminToken');
    router.push('/admin');
  };

  const updateBookingStatus = async (id, status) => {
    await fetch(`/api/admin/bookings/${id}`, {
      method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify({ status }),
    });
    loadData();
  };

  const openCancelBookingFromList = (booking) => {
    setCancelModal({
      isOpen: true,
      type: 'booking-list',
      data: { booking },
    });
  };

  const handleCancelBookingFromList = async (message) => {
    const { booking } = cancelModal.data;
    await fetch(`/api/admin/bookings/${booking._id}/cancel`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ message }),
    });
    loadData();
  };

  const handleReinstateBooking = async (bookingId) => {
    if (!confirm('Reinstate this booking? The guest will receive a new confirmation email.')) return;
    await fetch(`/api/admin/bookings/${bookingId}/reinstate`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    setSlotBookings({});
    loadData();
  };

  const createSlot = async (e) => {
    e.preventDefault();
    if (!newSlotDate || !newSlotTime) return;
    
    await fetch('/api/admin/slots', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ date: newSlotDate, startTime: newSlotTime, totalSpots: newSlotCapacity, isActive: true }),
    });
    setNewSlotDate('');
    loadData();
  };

  const deleteSlot = async (slotId) => {
    if (!confirm('Delete this tour slot?')) return;
    await fetch(`/api/admin/slots?id=${slotId}`, { method: 'DELETE', headers: getAuthHeaders() });
    loadData();
  };

  const toggleSlotActive = async (slot) => {
    await fetch('/api/admin/slots', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ date: slot.date, startTime: slot.startTime, totalSpots: slot.totalSpots, isActive: !slot.isActive }),
    });
    loadData();
  };

  const toggleSlotExpand = async (slotId) => {
    if (expandedSlot === slotId) {
      setExpandedSlot(null);
    } else {
      setExpandedSlot(slotId);
      if (!slotBookings[slotId]) {
        const res = await fetch(`/api/admin/slots/${slotId}/bookings`, { headers: getAuthHeaders() });
        const data = await res.json();
        setSlotBookings(prev => ({ ...prev, [slotId]: data.data || [] }));
      }
    }
  };

  const openCancelBookingModal = (booking, slot) => {
    setCancelModal({
      isOpen: true,
      type: 'booking',
      data: { booking, slot },
    });
  };

  const openCancelSlotModal = (slot) => {
    setCancelModal({
      isOpen: true,
      type: 'slot',
      data: { slot },
    });
  };

  const handleCancelBooking = async (message) => {
    const { booking, slot } = cancelModal.data;
    await fetch(`/api/admin/bookings/${booking._id}/cancel`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ message }),
    });
    // Refresh slot bookings
    setSlotBookings(prev => ({ ...prev, [slot._id]: undefined }));
    setExpandedSlot(null);
    loadData();
  };

  const handleCancelSlot = async (message) => {
    const { slot } = cancelModal.data;
    await fetch(`/api/admin/slots/${slot._id}/cancel`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ message }),
    });
    setSlotBookings(prev => ({ ...prev, [slot._id]: undefined }));
    setExpandedSlot(null);
    loadData();
  };

  const formatTime = (time) => {
    if (!time) return 'N/A';
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    return `${h % 12 || 12}:${minutes} ${h >= 12 ? 'PM' : 'AM'}`;
  };

  // Group slots by date for display
  const slotsByDate = slots.reduce((acc, slot) => {
    const dateKey = new Date(slot.date).toISOString().split('T')[0];
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(slot);
    return acc;
  }, {});

  if (loading && !admin) {
    return <div className="min-h-screen bg-slate-100 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-slate-900">Brighton Tours Admin</h1>
          <div className="flex items-center gap-4">
            <span className="text-slate-600">Welcome, {admin?.username}</span>
            <button onClick={handleLogout} className="text-slate-500 hover:text-slate-700"><LogOutIcon className="size-5" /></button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex gap-2 mb-6">
          {['overview', 'bookings', 'tour slots'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium capitalize ${activeTab === tab ? 'bg-sky-500 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
            >{tab}</button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === 'overview' && analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-2"><UsersIcon className="size-5 text-sky-500" /><span className="text-slate-600 text-sm">Total Unique Visitors</span></div>
              <p className="text-3xl font-bold text-slate-900">{analytics.totalUniqueVisitors}</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-2"><BarChart3Icon className="size-5 text-green-500" /><span className="text-slate-600 text-sm">Last 30 Days</span></div>
              <p className="text-3xl font-bold text-slate-900">{analytics.recentVisitors30Days}</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-2"><CalendarIcon className="size-5 text-amber-500" /><span className="text-slate-600 text-sm">Total Bookings</span></div>
              <p className="text-3xl font-bold text-slate-900">{analytics.totalBookings}</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-2"><ClockIcon className="size-5 text-red-500" /><span className="text-slate-600 text-sm">Pending Bookings</span></div>
              <p className="text-3xl font-bold text-slate-900">{analytics.pendingBookings}</p>
            </div>
          </div>
        )}

        {/* Bookings */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Date & Time</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Tourists</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">No bookings yet</td></tr>
                ) : bookings.map((booking) => (
                  <tr key={booking._id} className={booking.status === 'cancelled' ? 'opacity-50' : ''}>
                    <td className="px-4 py-3 text-sm">
                      {new Date(booking.tourDate).toLocaleDateString()}<br/>
                      <span className="text-slate-500">{formatTime(booking.startTime)}</span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <a href={`mailto:${booking.contactEmail}`} className="text-sky-600 hover:underline">{booking.contactEmail}</a>
                    </td>
                    <td className="px-4 py-3 text-sm">{booking.numberOfTourists}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        booking.status === 'contacted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>{booking.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      {booking.status !== 'cancelled' ? (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => updateBookingStatus(booking._id, 'contacted')} 
                            className="px-2 py-1 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded" 
                            title="Mark as Contacted"
                          >
                            Contacted
                          </button>
                          <button 
                            onClick={() => openCancelBookingFromList(booking)} 
                            className="px-2 py-1 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded" 
                            title="Cancel & Notify"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleReinstateBooking(booking._id)} 
                          className="px-2 py-1 text-xs font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 rounded" 
                          title="Reinstate booking"
                        >
                          Reinstate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tour Slots */}
        {activeTab === 'tour slots' && (
          <div className="space-y-6">
            {/* Add New Slot Form */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2"><PlusIcon className="size-5" /> Add Tour Slot</h3>
              <form onSubmit={createSlot} className="flex flex-wrap gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={newSlotDate}
                    onChange={(e) => setNewSlotDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Start Time</label>
                  <select
                    value={newSlotTime}
                    onChange={(e) => setNewSlotTime(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                  >
                    {['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00'].map(t => (
                      <option key={t} value={t}>{formatTime(t)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Capacity</label>
                  <input
                    type="number"
                    value={newSlotCapacity}
                    onChange={(e) => setNewSlotCapacity(parseInt(e.target.value) || 20)}
                    min="1" max="100"
                    className="w-20 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <button type="submit" className="px-4 py-2 bg-sky-500 text-white rounded-lg font-medium hover:bg-sky-600">
                  Add Slot
                </button>
              </form>
            </div>

            {/* Existing Slots */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Scheduled Tour Slots</h3>
              {Object.keys(slotsByDate).length === 0 ? (
                <p className="text-slate-500 text-center py-8">No tour slots created yet. Add your first slot above.</p>
              ) : (
                <div className="space-y-4">
                  {Object.entries(slotsByDate).sort(([a], [b]) => a.localeCompare(b)).map(([date, dateSlots]) => (
                    <div key={date} className="border border-slate-200 rounded-lg overflow-hidden">
                      <div className="bg-slate-50 px-4 py-2 font-medium text-slate-900">
                        {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="divide-y divide-slate-100">
                        {dateSlots.sort((a, b) => a.startTime.localeCompare(b.startTime)).map((slot) => (
                          <div key={slot._id} className={`${!slot.isActive ? 'bg-slate-50 opacity-60' : ''}`}>
                            <div className="px-4 py-3 flex items-center justify-between">
                              <div 
                                className="flex items-center gap-4 cursor-pointer flex-1"
                                onClick={() => toggleSlotExpand(slot._id)}
                              >
                                {expandedSlot === slot._id ? <ChevronUpIcon className="size-4 text-slate-400" /> : <ChevronDownIcon className="size-4 text-slate-400" />}
                                <div className="flex items-center gap-2">
                                  <ClockIcon className="size-4 text-slate-400" />
                                  <span className="font-medium">{formatTime(slot.startTime)}</span>
                                </div>
                                <div className="text-sm">
                                  <span className={slot.bookedSpots >= slot.totalSpots ? 'text-red-600 font-medium' : 'text-slate-600'}>
                                    {slot.bookedSpots}/{slot.totalSpots} booked
                                  </span>
                                  {slot.bookedSpots >= slot.totalSpots && <span className="ml-2 text-red-600">(FULL)</span>}
                                </div>
                                {!slot.isActive && <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded">Inactive</span>}
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={(e) => { e.stopPropagation(); toggleSlotActive(slot); }}
                                  className={`px-3 py-1 rounded text-sm font-medium ${slot.isActive ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                                >
                                  {slot.isActive ? 'Deactivate' : 'Activate'}
                                </button>
                                {slot.bookedSpots > 0 && slot.isActive && (
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); openCancelSlotModal(slot); }}
                                    className="px-3 py-1 rounded text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200"
                                  >
                                    Cancel All
                                  </button>
                                )}
                                <button onClick={(e) => { e.stopPropagation(); deleteSlot(slot._id); }} className="p-1 text-red-600 hover:bg-red-50 rounded">
                                  <TrashIcon className="size-4" />
                                </button>
                              </div>
                            </div>
                            {expandedSlot === slot._id && (
                              <div className="px-4 pb-4 bg-slate-50 border-t border-slate-100">
                                <div className="mt-3">
                                  <h4 className="text-sm font-medium text-slate-700 mb-2">Bookings ({slotBookings[slot._id]?.length || 0})</h4>
                                  {!slotBookings[slot._id] ? (
                                    <p className="text-sm text-slate-500">Loading...</p>
                                  ) : slotBookings[slot._id].length === 0 ? (
                                    <p className="text-sm text-slate-500">No bookings for this slot yet.</p>
                                  ) : (
                                    <div className="space-y-2">
                                      {slotBookings[slot._id].map((booking, idx) => (
                                        <div key={booking._id} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 text-sm">
                                          <div className="flex items-center gap-4">
                                            <span className="text-slate-400 w-6">#{idx + 1}</span>
                                            <div className="flex items-center gap-1">
                                              <UsersIcon className="size-4 text-slate-400" />
                                              <span className="font-medium">{booking.numberOfTourists}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                              <MailIcon className="size-4 text-slate-400" />
                                              <a href={`mailto:${booking.contactEmail}`} className="text-sky-600 hover:underline">{booking.contactEmail}</a>
                                            </div>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                              booking.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                              booking.status === 'contacted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>{booking.status}</span>
                                            {booking.status !== 'cancelled' ? (
                                              <button
                                                onClick={() => openCancelBookingModal(booking, slot)}
                                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                title="Cancel booking"
                                              >
                                                <XIcon className="size-4" />
                                              </button>
                                            ) : (
                                              <button
                                                onClick={() => handleReinstateBooking(booking._id)}
                                                className="px-2 py-0.5 text-xs font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 rounded"
                                                title="Reinstate booking"
                                              >
                                                Reinstate
                                              </button>
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Cancellation Modal */}
      <CancelModal
        isOpen={cancelModal.isOpen}
        onClose={() => setCancelModal({ isOpen: false, type: null, data: null })}
        onConfirm={
          cancelModal.type === 'slot' 
            ? handleCancelSlot 
            : cancelModal.type === 'booking-list'
              ? handleCancelBookingFromList
              : handleCancelBooking
        }
        title={cancelModal.type === 'slot' ? 'Cancel Entire Time Slot?' : 'Cancel This Booking?'}
        description={
          cancelModal.type === 'slot'
            ? `This will cancel all ${cancelModal.data?.slot?.bookedSpots || 0} bookings for this time slot and send a cancellation email to all guests.`
            : `This will cancel the booking for ${cancelModal.data?.booking?.numberOfTourists || 0} guest(s), release the spots back to availability, and send a cancellation email to ${cancelModal.data?.booking?.contactEmail || 'the guest'}.`
        }
        defaultMessage="We apologize, but due to unforeseen circumstances, we must cancel your tour booking. We hope to welcome you on a future tour. Please contact us if you have any questions."
      />
    </div>
  );
}
