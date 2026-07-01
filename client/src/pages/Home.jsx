import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import { CONTAINER_CLASS } from '../components/PageContainer';
import LoadingState from '../components/ui/LoadingState';
import Button from '../components/ui/Button';
import EventImage from '../components/EventImage';
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaSearch,
  FaRegClock,
  FaTicketAlt,
  FaShieldAlt,
} from 'react-icons/fa';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchEvents();
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [search]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/events?search=${search}`);
      setEvents(data);
    } catch (error) {
      console.error('Error while fetching events ', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="w-full bg-gradient-to-br from-indigo-700 via-indigo-600 to-slate-900 text-white">
        <div className={`${CONTAINER_CLASS} py-14 sm:py-16 lg:py-20`}>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="mb-4 text-sm font-semibold tracking-widest text-indigo-200 uppercase">
                Swap Events Hub Client
              </p>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Discover and book unforgettable events
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-indigo-100 sm:text-lg">
                Browse conferences, concerts, workshops, and more. Secure OTP
                verification keeps every booking safe and reliable.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/register" className="cursor-pointer">
                  <Button className="w-full sm:w-auto">Get Started</Button>
                </Link>
                <Link to="/login" className="cursor-pointer">
                  <Button variant="secondary" className="w-full sm:w-auto">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-2xl border border-white/20 bg-white/10 p-2 backdrop-blur-sm">
                <div className="relative flex items-center">
                  <FaSearch className="absolute left-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search events by title..."
                    className="w-full rounded-xl border-0 bg-white py-4 pr-5 pl-12 text-base text-slate-900 shadow-lg focus:ring-4 focus:ring-indigo-300 focus:outline-none"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full border-b border-slate-200 bg-white">
        <div className={`${CONTAINER_CLASS} py-10 sm:py-12`}>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: FaRegClock,
                title: 'Fast Booking',
                text: 'Reserve seats quickly with a streamlined OTP-verified booking flow.',
              },
              {
                icon: FaTicketAlt,
                title: 'Seamless Access',
                text: 'Track all bookings from your personal dashboard in one place.',
              },
              {
                icon: FaShieldAlt,
                title: 'Secure Platform',
                text: 'Enterprise-grade authentication and verification for every transaction.',
              },
            ].map(({ icon: Icon, title, text }) => (
              <article
                key={title}
                className="rounded-xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-0.5 hover:shadow-md sm:p-8"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-lg text-white">
                  <Icon />
                </div>
                <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
                  {text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-slate-50">
        <div className={`${CONTAINER_CLASS} py-10 sm:py-12 lg:py-14`}>
          <div className="mb-8 flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Upcoming Events
            </h2>
            <p className="text-sm font-medium text-slate-500 sm:text-base">
              {events.length} event{events.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {loading ? (
            <LoadingState message="Loading events..." />
          ) : events.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
              <FaTicketAlt className="mx-auto mb-4 text-4xl text-slate-300" />
              <p className="text-lg font-medium text-slate-600">
                No events found matching your search.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {events.map((event) => (
                <article
                  key={event._id}
                  className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg"
                >
                  <div className="relative h-48 overflow-hidden bg-slate-200 sm:h-52">
                    <EventImage
                      src={event.image}
                      alt={event.title}
                      category={event.category}
                      className="h-full w-full"
                    />
                    <span className="absolute top-4 right-4 rounded-full bg-white/95 px-3 py-1 text-sm font-bold shadow">
                      {event.ticketPrice === 0 ? (
                        <span className="text-emerald-600">FREE</span>
                      ) : (
                        <span className="text-slate-900">₹{event.ticketPrice}</span>
                      )}
                    </span>
                  </div>

                  <div className="flex flex-grow flex-col p-5 sm:p-6">
                    <span className="text-xs font-bold tracking-wider text-indigo-600 uppercase">
                      {event.category}
                    </span>
                    <h3 className="mt-2 text-xl font-bold text-slate-900">
                      {event.title}
                    </h3>
                    <div className="mt-4 space-y-2 text-sm text-slate-600">
                      <p className="flex items-center gap-2">
                        <FaCalendarAlt className="text-slate-400" />
                        {new Date(event.date).toLocaleDateString(undefined, {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-slate-400" />
                        {event.location}
                      </p>
                    </div>

                    <div className="mt-5">
                      <div className="mb-2 h-2 w-full rounded-full bg-slate-200">
                        <div
                          className="h-2 rounded-full bg-indigo-600 transition-all"
                          style={{
                            width: `${Math.max(
                              0,
                              (event.availableSeats / event.totalSeats) * 100
                            )}%`,
                          }}
                        />
                      </div>
                      <p className="mb-4 text-xs text-slate-500">
                        {event.availableSeats} of {event.totalSeats} seats remaining
                      </p>
                      <Link to={`/events/${event._id}`} className="cursor-pointer">
                        <Button variant="secondary" className="w-full">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Home;
