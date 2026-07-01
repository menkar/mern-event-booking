import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaTicketAlt, FaTimesCircle, FaUserCircle } from 'react-icons/fa';
import PageContainer from '../components/PageContainer';
import LoadingState from '../components/ui/LoadingState';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';
import ConfirmModal from '../components/ui/ConfirmModal';
import Alert from '../components/ui/Alert';

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchBookings();
  }, [user, navigate]);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get('/bookings/my');
      setBookings(data.bookings || []);
    } catch (err) {
      console.error('Error while fetching bookings', err);
    } finally {
      setLoading(false);
    }
  };

  const openCancelModal = (booking) => {
    setError('');
    setCancelTarget(booking);
  };

  const closeCancelModal = () => {
    if (!cancelling) setCancelTarget(null);
  };

  const confirmCancelBooking = async () => {
    if (!cancelTarget) return;

    setCancelling(true);
    setError('');

    try {
      await api.delete(`/bookings/${cancelTarget._id}`);
      setCancelTarget(null);
      await fetchBookings();
    } catch (err) {
      setError(err.response?.data?.message || 'Error while cancelling booking');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <PageContainer hideHeader>
        <LoadingState message="Loading your dashboard..." />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="User Dashboard"
      subtitle="View and manage your event bookings in one place."
    >
      {error && <Alert className="mb-6">{error}</Alert>}

      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-2xl font-bold text-indigo-700 uppercase">
            {user?.name?.charAt(0) || <FaUserCircle />}
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Welcome, {user?.name}
            </h2>
            <p className="mt-1 text-slate-500">{user?.email}</p>
            <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Active User Account
            </span>
          </div>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900 sm:text-2xl">
          <FaTicketAlt className="text-indigo-600" />
          My Bookings
        </h3>
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <FaTicketAlt className="mx-auto mb-4 text-5xl text-slate-300" />
          <p className="text-lg font-medium text-slate-600">
            You haven&apos;t booked any events yet.
          </p>
          <Link to="/" className="mt-6 inline-block cursor-pointer">
            <Button>Browse Events</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {bookings.map((booking) => (
            <article
              key={booking._id}
              className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="flex-grow p-6">
                {booking.eventId ? (
                  <>
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <h4 className="text-lg font-bold text-slate-900">
                        {booking.eventId.title}
                      </h4>
                      <div className="flex flex-col items-end gap-1">
                        <StatusBadge status={booking.status} />
                        {booking.status !== 'cancelled' && (
                          <StatusBadge status={booking.paymentStatus} />
                        )}
                      </div>
                    </div>
                    <dl className="space-y-2 text-sm text-slate-600">
                      <div className="flex justify-between gap-4">
                        <dt className="font-medium text-slate-500">Date</dt>
                        <dd>{new Date(booking.eventId.date).toLocaleDateString()}</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="font-medium text-slate-500">Amount</dt>
                        <dd>
                          {booking.amount === 0 ? 'Free' : `₹${booking.amount}`}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="font-medium text-slate-500">Requested</dt>
                        <dd>{new Date(booking.bookedAt).toLocaleDateString()}</dd>
                      </div>
                    </dl>
                  </>
                ) : (
                  <p className="text-sm italic text-red-600">
                    Event details unavailable (may have been deleted)
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-5 py-4">
                {booking.eventId && booking.status !== 'cancelled' ? (
                  <>
                    <Link
                      to={`/events/${booking.eventId._id}`}
                      className="cursor-pointer text-sm font-semibold text-indigo-600 hover:underline"
                    >
                      View Event
                    </Link>
                    <button
                      type="button"
                      onClick={() => openCancelModal(booking)}
                      className="inline-flex cursor-pointer items-center gap-1 text-sm font-semibold text-red-600 hover:text-red-700"
                    >
                      <FaTimesCircle /> Cancel
                    </button>
                  </>
                ) : (
                  <span className="w-full text-center text-sm italic text-slate-500">
                    Booking Cancelled
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(cancelTarget)}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking?"
        description={
          cancelTarget?.eventId
            ? `Event: ${cancelTarget.eventId.title}${cancelTarget.status === 'confirmed' ? ' — Your confirmed seat will be released.' : ''}`
            : undefined
        }
        confirmLabel="Yes, Cancel Booking"
        cancelLabel="Keep Booking"
        variant="danger"
        loading={cancelling}
        onConfirm={confirmCancelBooking}
        onCancel={closeCancelModal}
      />
    </PageContainer>
  );
};

export default UserDashboard;
