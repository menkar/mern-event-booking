import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import LoadingState from '../components/ui/LoadingState';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import StatusBadge from '../components/ui/StatusBadge';
import ConfirmModal from '../components/ui/ConfirmModal';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEventForm, setShowEventForm] = useState(false);
  const [deleteEventTarget, setDeleteEventTarget] = useState(null);
  const [rejectBookingTarget, setRejectBookingTarget] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    category: '',
    totalSeats: '',
    ticketPrice: '',
    image: '',
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const [eventsRes, bookingRes] = await Promise.all([
        api.get('/events'),
        api.get('/bookings/my'),
      ]);
      setEvents(eventsRes.data || []);
      setBookings(bookingRes.data?.bookings || []);
    } catch (error) {
      console.error('Error fetching admin data ', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      await api.post('/events', {
        ...formData,
        totalSeats: Number(formData.totalSeats),
        ticketPrice: Number(formData.ticketPrice),
      });
      setShowEventForm(false);
      setFormData({
        title: '',
        description: '',
        date: '',
        location: '',
        category: '',
        totalSeats: '',
        ticketPrice: '',
        image: '',
      });
      fetchData();
    } catch (error) {
      console.error('Error while creating event', error?.response?.data?.message);
    }
  };

  const handleDeleteEvent = (event) => {
    setDeleteEventTarget(event);
  };

  const confirmDeleteEvent = async () => {
    if (!deleteEventTarget) return;
    setModalLoading(true);
    try {
      await api.delete(`/events/${deleteEventTarget._id}`);
      setDeleteEventTarget(null);
      fetchData();
    } catch (error) {
      console.error('Error while deleting event ', error?.response?.data?.message);
    } finally {
      setModalLoading(false);
    }
  };

  const handleConfirmBooking = async (id, paymentStatus) => {
    try {
      await api.put(`/bookings/${id}/confirm`, { paymentStatus });
      fetchData();
    } catch (error) {
      console.error('Error while confirming booking ', error?.response?.data?.message);
    }
  };

  const handleCancelBooking = (booking) => {
    setRejectBookingTarget(booking);
  };

  const confirmRejectBooking = async () => {
    if (!rejectBookingTarget) return;
    setModalLoading(true);
    try {
      await api.delete(`/bookings/${rejectBookingTarget._id}`);
      setRejectBookingTarget(null);
      fetchData();
    } catch (error) {
      console.error('Error while cancelling booking ', error?.response?.data?.message);
    } finally {
      setModalLoading(false);
    }
  };

  const paidRevenue = bookings.reduce(
    (sum, b) =>
      b.paymentStatus === 'paid' && b.status === 'confirmed' ? sum + b.amount : sum,
    0
  );

  const paidClients = new Set(
    bookings
      .filter((b) => b.paymentStatus === 'paid' && b.status === 'confirmed')
      .map((b) => b.userId?._id)
  ).size;

  const pendingCount = bookings.filter((b) => b.status === 'pending').length;

  if (loading) {
    return (
      <PageContainer hideHeader>
        <LoadingState message="Loading admin panel..." />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      compact
      title="Admin Dashboard"
      subtitle="Manage events, confirm bookings, and oversee platform operations."
    >
      <div className="mb-8 flex flex-col gap-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-900 p-6 text-white shadow-lg sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <h2 className="text-2xl font-bold sm:text-3xl">Platform Control Center</h2>
          <p className="mt-2 text-slate-300">
            Manage events and manually confirm booking requests.
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={() => setShowEventForm(!showEventForm)}
          className="w-full sm:w-auto"
        >
          {showEventForm ? 'Cancel Creation' : '+ Create New Event'}
        </Button>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: 'Total Revenue', value: `₹${paidRevenue}`, color: 'text-emerald-600' },
          { label: 'Paid Clients', value: paidClients, color: 'text-blue-600' },
          { label: 'Pending Requests', value: pendingCount, color: 'text-amber-600' },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <p className="text-xs font-bold tracking-wider text-slate-500 uppercase">
              {label}
            </p>
            <p className={`mt-2 text-3xl font-black ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {showEventForm && (
        <div className="mb-8 animate-fade-in rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h3 className="mb-6 text-xl font-bold text-slate-900">Create New Event</h3>
          <form onSubmit={handleCreateEvent} className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Input
              label="Event Title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <Input
              label="Category"
              required
              placeholder="Tech, Music, Sports..."
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
            <Input
              label="Event Date"
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
            <Input
              label="Location"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
            <Input
              label="Total Seats"
              type="number"
              required
              min="1"
              value={formData.totalSeats}
              onChange={(e) => setFormData({ ...formData, totalSeats: e.target.value })}
            />
            <Input
              label="Ticket Price (0 for free)"
              type="number"
              required
              min="0"
              value={formData.ticketPrice}
              onChange={(e) => setFormData({ ...formData, ticketPrice: e.target.value })}
            />
            <Input
              label="Image URL"
              type="url"
              containerClassName="md:col-span-2"
              placeholder="https://example.com/image.jpg"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            />
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Event Description
              </label>
              <textarea
                required
                rows={4}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-base focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <Button type="submit" className="md:col-span-2">
              Publish Event
            </Button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
        <section>
          <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm text-indigo-700">
              {events.length}
            </span>
            All Events
          </h3>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <ul className="max-h-[420px] divide-y divide-slate-100 overflow-y-auto lg:max-h-[calc(100vh-20rem)]">
              {events.length === 0 ? (
                <li className="p-8 text-center text-slate-500">No events created yet.</li>
              ) : (
                events.map((event) => (
                  <li
                    key={event._id}
                    className="flex flex-col gap-4 p-5 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-slate-900">{event.title}</h4>
                      <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-500">
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                        <span
                          className={
                            event.availableSeats > 0
                              ? 'text-emerald-600'
                              : 'text-red-600'
                          }
                        >
                          {event.availableSeats}/{event.totalSeats} seats
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteEvent(event)}
                      className="w-full sm:w-auto"
                    >
                      Delete
                    </Button>
                  </li>
                ))
              )}
            </ul>
          </div>
        </section>

        <section>
          <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-sm text-amber-700">
              {bookings.length}
            </span>
            Booking Requests
          </h3>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <ul className="max-h-[420px] divide-y divide-slate-100 overflow-y-auto lg:max-h-[calc(100vh-20rem)]">
              {bookings.length === 0 ? (
                <li className="p-8 text-center text-slate-500">No bookings yet.</li>
              ) : (
                bookings.map((booking) => (
                  <li
                    key={booking._id}
                    className={`border-l-4 p-5 ${
                      booking.status === 'pending'
                        ? 'border-l-amber-400'
                        : booking.status === 'confirmed'
                          ? 'border-l-emerald-400'
                          : 'border-l-red-400'
                    }`}
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <h4 className="font-bold text-slate-900">
                        {booking.eventId?.title || 'Deleted Event'}
                      </h4>
                      <div className="flex flex-col items-end gap-1">
                        <StatusBadge status={booking.status} />
                        {booking.status !== 'cancelled' && (
                          <StatusBadge status={booking.paymentStatus} />
                        )}
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700">
                      <p>
                        <span className="font-semibold text-slate-500">User:</span>{' '}
                        {booking.userId?.name}{' '}
                        <span className="text-slate-400">({booking.userId?.email})</span>
                      </p>
                      <p className="mt-1">
                        <span className="font-semibold text-slate-500">Amount:</span>{' '}
                        {booking.amount === 0 ? 'Free' : `₹${booking.amount}`}
                      </p>
                      <p className="mt-1">
                        <span className="font-semibold text-slate-500">Requested:</span>{' '}
                        {new Date(booking.bookedAt).toLocaleString()}
                      </p>
                    </div>

                    {booking.status === 'pending' && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button
                          variant="success"
                          className="flex-1 min-w-[140px] text-xs sm:text-sm"
                          onClick={() => handleConfirmBooking(booking._id, 'paid')}
                        >
                          Approve as Paid
                        </Button>
                        <Button
                          variant="secondary"
                          className="flex-1 min-w-[140px] text-xs sm:text-sm"
                          onClick={() =>
                            handleConfirmBooking(booking._id, 'not_paid')
                          }
                        >
                          Approve Unpaid
                        </Button>
                        <Button
                          variant="danger"
                          className="min-w-[100px] text-xs sm:text-sm"
                          onClick={() => handleCancelBooking(booking)}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </li>
                ))
              )}
            </ul>
          </div>
        </section>
      </div>

      <ConfirmModal
        isOpen={Boolean(deleteEventTarget)}
        title="Delete Event"
        message="Are you sure you want to delete this event?"
        description={
          deleteEventTarget
            ? `"${deleteEventTarget.title}" will be permanently removed. This action cannot be undone.`
            : undefined
        }
        confirmLabel="Yes, Delete Event"
        cancelLabel="Keep Event"
        variant="danger"
        loading={modalLoading}
        onConfirm={confirmDeleteEvent}
        onCancel={() => !modalLoading && setDeleteEventTarget(null)}
      />

      <ConfirmModal
        isOpen={Boolean(rejectBookingTarget)}
        title="Reject Booking"
        message="Cancel this user's booking request?"
        description={
          rejectBookingTarget
            ? `User: ${rejectBookingTarget.userId?.name || 'Unknown'} — Event: ${rejectBookingTarget.eventId?.title || 'Deleted Event'}`
            : undefined
        }
        confirmLabel="Yes, Reject Booking"
        cancelLabel="Go Back"
        variant="danger"
        loading={modalLoading}
        onConfirm={confirmRejectBooking}
        onCancel={() => !modalLoading && setRejectBookingTarget(null)}
      />
    </PageContainer>
  );
};

export default AdminDashboard;
