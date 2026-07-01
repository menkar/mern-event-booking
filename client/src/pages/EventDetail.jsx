import { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/axios';
import { AuthContext } from '../context/AuthContext';
import PageContainer from '../components/PageContainer';
import LoadingState from '../components/ui/LoadingState';
import Alert from '../components/ui/Alert';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import EventImage from '../components/EventImage';
import ResendOtpButton from '../components/ui/ResendOtpButton';
import StatusBadge from '../components/ui/StatusBadge';
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaChair,
  FaMoneyBillWave,
  FaArrowLeft,
  FaCheckCircle,
  FaClock,
} from 'react-icons/fa';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [event, setEvent] = useState(null);
  const [existingBooking, setExistingBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchExistingBooking = useCallback(async () => {
    if (!user) {
      setExistingBooking(null);
      return;
    }

    try {
      const { data } = await api.get(`/bookings/event/${id}/status`);
      setExistingBooking(data.hasBooking ? data.booking : null);
    } catch {
      setExistingBooking(null);
    }
  }, [id, user]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await api.get(`/events/${id}`);
        setEvent(data);
      } catch {
        setError('Failed to load event details.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  useEffect(() => {
    fetchExistingBooking();
  }, [fetchExistingBooking]);

  const hasActiveBooking = Boolean(existingBooking);
  const isConfirmed = existingBooking?.status === 'confirmed';

  const handleBooking = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (hasActiveBooking) return;

    setBookingLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      if (!showOTP) {
        await api.post('/bookings/send-otp', { eventId: event._id });
        setShowOTP(true);
        setSuccessMsg('OTP sent to your email. Enter it below to confirm booking.');
      } else {
        const { data } = await api.post('/bookings', {
          eventId: event._id,
          otp: otp.replace(/\D/g, '').trim(),
        });
        setSuccessMsg('Booking request submitted! Awaiting admin confirmation.');
        setShowOTP(false);
        setOtp('');
        setExistingBooking(data.booking || { status: 'pending', paymentStatus: 'not_paid' });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setResendLoading(true);
    try {
      await api.post('/bookings/send-otp', { eventId: event._id });
      setSuccessMsg('A new OTP has been sent to your email.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
      throw err;
    } finally {
      setResendLoading(false);
    }
  };

  if (loading) {
    return (
      <PageContainer hideHeader>
        <LoadingState message="Loading event details..." />
      </PageContainer>
    );
  }

  if (!event) {
    return (
      <PageContainer title="Event Not Found" subtitle="This event may have been removed.">
        <Alert>{error || 'Event not found.'}</Alert>
        <Link to="/" className="mt-6 inline-block cursor-pointer">
          <Button variant="secondary">
            <FaArrowLeft /> Back to Events
          </Button>
        </Link>
      </PageContainer>
    );
  }

  const isSoldOut = event.availableSeats <= 0;
  const canRequestBooking = !hasActiveBooking && !isSoldOut;

  return (
    <PageContainer hideHeader>
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
        >
          <FaArrowLeft /> Back to Events
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
        <EventImage
          src={event.image}
          alt={event.title}
          category={event.category}
          className="h-56 w-full sm:h-72 lg:h-80"
          imageClassName="h-56 w-full object-cover sm:h-72 lg:h-80"
        />

        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-3 lg:p-10">
          <div className="lg:col-span-2">
            <span className="inline-flex rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold tracking-wide text-indigo-700 uppercase">
              {event.category}
            </span>
            <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
              {event.title}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
              {event.description}
            </p>
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-xl font-bold text-slate-900">Booking Details</h2>

            <div className="mt-6 space-y-4">
              {[
                {
                  icon: FaMoneyBillWave,
                  label: 'Ticket Price',
                  value: event.ticketPrice === 0 ? 'Free' : `₹${event.ticketPrice}`,
                },
                {
                  icon: FaChair,
                  label: 'Availability',
                  value: `${event.availableSeats} / ${event.totalSeats} seats`,
                },
                {
                  icon: FaCalendarAlt,
                  label: 'Date',
                  value: new Date(event.date).toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }),
                },
                {
                  icon: FaMapMarkerAlt,
                  label: 'Location',
                  value: event.location,
                },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-indigo-600 shadow-sm">
                    <Icon />
                  </div>
                  <div>
                    <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                      {label}
                    </p>
                    <p className="font-semibold text-slate-800">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {hasActiveBooking && (
              <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                      isConfirmed ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                    }`}
                  >
                    {isConfirmed ? <FaCheckCircle /> : <FaClock />}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">Your booking</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <StatusBadge status={existingBooking.status} />
                      <StatusBadge status={existingBooking.paymentStatus} />
                    </div>
                    <p className="mt-2 text-sm text-slate-600">
                      {isConfirmed
                        ? 'Your seat is confirmed for this event. No further action needed.'
                        : 'Your booking request is awaiting admin approval.'}
                    </p>
                  </div>
                </div>
                <Link to="/dashboard" className="mt-4 block cursor-pointer">
                  <Button variant="secondary" className="w-full">
                    View My Bookings
                  </Button>
                </Link>
              </div>
            )}

            {canRequestBooking && showOTP && (
              <div className="mt-6 space-y-3">
                <Input
                  label="Enter OTP to Confirm"
                  type="text"
                  required
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  maxLength={6}
                  inputMode="numeric"
                  className="text-center text-lg font-bold tracking-widest tabular-nums"
                />
                <div className="text-center">
                  <ResendOtpButton
                    onResend={handleResendOtp}
                    disabled={resendLoading || bookingLoading}
                  />
                </div>
              </div>
            )}

            {error && <Alert className="mt-4">{error}</Alert>}
            {successMsg && !hasActiveBooking && (
              <Alert type="success" className="mt-4">
                {successMsg}
              </Alert>
            )}

            {canRequestBooking ? (
              <Button
                onClick={handleBooking}
                disabled={bookingLoading || (showOTP && !otp)}
                className="mt-6 w-full"
              >
                {bookingLoading
                  ? 'Processing...'
                  : showOTP
                    ? 'Verify OTP & Confirm Booking'
                    : 'Request Booking'}
              </Button>
            ) : (
              !hasActiveBooking && (
                <Button disabled className="mt-6 w-full">
                  {isSoldOut ? 'Sold Out' : 'Unavailable'}
                </Button>
              )
            )}
          </aside>
        </div>
      </div>
    </PageContainer>
  );
};

export default EventDetail;
