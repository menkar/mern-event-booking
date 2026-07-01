import { Link, useLocation } from 'react-router-dom';
import { FaEnvelope, FaPhone, FaTicketAlt } from 'react-icons/fa';
import { CONTAINER_CLASS } from './PageContainer';

const COMPACT_ROUTES = ['/admin', '/dashboard'];

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { pathname } = useLocation();
  const compact = COMPACT_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  const quickLinks = [
    { label: 'Home', to: '/' },
    { label: 'Login', to: '/login' },
    { label: 'Register', to: '/register' },
    { label: 'Dashboard', to: '/dashboard' },
  ];

  if (compact) {
    return (
      <footer className="mt-auto w-full border-t border-slate-800 bg-slate-950 text-slate-400">
        <div className={`${CONTAINER_CLASS} py-3 sm:py-4`}>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <Link
                to="/"
                className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-white hover:text-indigo-300"
              >
                <FaTicketAlt className="h-4 w-4 text-indigo-400" aria-hidden="true" />
                Swap Events Hub Client
              </Link>
              <span className="hidden h-4 w-px bg-slate-700 sm:block" aria-hidden="true" />
              <nav
                className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm"
                aria-label="Footer quick links"
              >
                {quickLinks.map(({ label, to }) => (
                  <Link
                    key={to}
                    to={to}
                    className="cursor-pointer transition-colors hover:text-indigo-400"
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex flex-col gap-2 text-xs sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:text-sm">
              <span className="inline-flex items-center gap-1.5">
                <FaEnvelope className="h-3.5 w-3.5 text-indigo-400" aria-hidden="true" />
                Swapnil Menkar
              </span>
              <a
                href="tel:+918149005578"
                className="inline-flex cursor-pointer items-center gap-1.5 transition-colors hover:text-indigo-400"
              >
                <FaPhone className="h-3.5 w-3.5 text-indigo-400" aria-hidden="true" />
                8149005578
              </a>
              <span className="hidden h-4 w-px bg-slate-700 md:block" aria-hidden="true" />
              <p className="text-slate-500">
                &copy; {currentYear} Swap Events Hub Client
              </p>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="mt-auto w-full border-t border-slate-800 bg-slate-950 text-slate-300">
      <div className={`${CONTAINER_CLASS} py-8 sm:py-10`}>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="mb-3 flex items-center gap-2.5 text-white">
              <FaTicketAlt className="h-6 w-6 text-indigo-400" aria-hidden="true" />
              <span className="text-lg font-semibold tracking-tight sm:text-xl">
                Swap Events Hub Client
              </span>
            </div>
            <p className="max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
              Discover, book, and manage events with a secure, scalable platform
              built for users and administrators.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-semibold tracking-wider text-white uppercase">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              {quickLinks.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="cursor-pointer text-slate-400 transition-colors hover:text-indigo-400"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-semibold tracking-wider text-white uppercase">
              Contact
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-slate-400">
                <FaEnvelope
                  className="h-4 w-4 shrink-0 text-indigo-400"
                  aria-hidden="true"
                />
                <span>Swapnil Menkar</span>
              </li>
              <li className="flex items-center gap-2">
                <FaPhone
                  className="h-4 w-4 shrink-0 text-indigo-400"
                  aria-hidden="true"
                />
                <a
                  href="tel:+918149005578"
                  className="cursor-pointer text-slate-400 transition-colors hover:text-indigo-400"
                >
                  Mobile: 8149005578
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-start justify-between gap-2 border-t border-slate-800 pt-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:text-sm">
          <p>&copy; {currentYear} Swap Events Hub Client. All rights reserved.</p>
          <p>Designed &amp; developed by Swapnil Menkar</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
