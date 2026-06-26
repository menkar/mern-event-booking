import { Link } from 'react-router-dom';
import { CONTAINER_CLASS } from '../components/PageContainer';

const Home = () => {
  return (
    <>
      <section className="w-full border-b border-indigo-900/20 bg-gradient-to-br from-indigo-700 via-indigo-600 to-slate-900 text-white">
        <div className={`${CONTAINER_CLASS} py-14 sm:py-16 lg:py-20 xl:py-24`}>
          <div className="max-w-4xl">
            <p className="mb-4 text-sm font-semibold tracking-widest text-indigo-200 uppercase sm:text-base">
              Enterprise Event Management
            </p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl xl:text-6xl">
              Discover and book events with confidence
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-indigo-100 sm:text-lg lg:text-xl">
              Swap Events Hub Client helps users browse events, secure bookings,
              and manage reservations — with admin tools for full platform control.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-base font-semibold text-indigo-700 transition hover:bg-indigo-50"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-md border border-white/40 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/10"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-white">
        <div className={`${CONTAINER_CLASS} py-12 sm:py-14 lg:py-16`}>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {[
              {
                title: 'Browse Events',
                text: 'Explore curated events across categories with real-time seat availability.',
              },
              {
                title: 'Secure Booking',
                text: 'OTP-verified bookings and payment tracking for a trusted experience.',
              },
              {
                title: 'Admin Dashboard',
                text: 'Manage events, confirm bookings, and monitor platform activity at scale.',
              },
            ].map(({ title, text }) => (
              <article
                key={title}
                className="rounded-xl border border-slate-200 bg-slate-50 p-6 sm:p-8"
              >
                <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
                  {title}
                </h2>
                <p className="mt-3 text-base leading-relaxed text-slate-600">
                  {text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
