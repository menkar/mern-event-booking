import { Link } from 'react-router-dom';
import { FaEnvelope, FaPhone, FaTicketAlt } from 'react-icons/fa';
import { CONTAINER_CLASS } from './PageContainer';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'Home', to: '/' },
    { label: 'Login', to: '/login' },
    { label: 'Register', to: '/register' },
    { label: 'Dashboard', to: '/dashboard' },
  ];

  return (
    <footer className="mt-auto w-full border-t border-slate-800 bg-slate-950 text-slate-300">
      <div className={`${CONTAINER_CLASS} py-12 sm:py-14 lg:py-16`}>
        <div className="grid gap-10 sm:grid-cols-2 xl:grid-cols-4 xl:gap-12">
          <div className="sm:col-span-2 xl:col-span-2">
            <div className="mb-5 flex items-center gap-3 text-white">
              <FaTicketAlt className="h-7 w-7 text-indigo-400" aria-hidden="true" />
              <span className="text-xl font-semibold tracking-tight sm:text-2xl">
                Swap Events Hub Client
              </span>
            </div>
            <p className="max-w-2xl text-base leading-relaxed text-slate-400">
              Discover, book, and manage events with a secure, scalable platform
              built for users and administrators. Designed for reliability at
              enterprise scale.
            </p>
          </div>

          <div>
            <h3 className="mb-5 text-sm font-semibold tracking-wider text-white uppercase">
              Quick Links
            </h3>
            <ul className="space-y-3 text-base">
              {quickLinks.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-slate-400 transition-colors hover:text-indigo-400"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-sm font-semibold tracking-wider text-white uppercase">
              Contact
            </h3>
            <ul className="space-y-4 text-base">
              <li className="flex items-center gap-3 text-slate-400">
                <FaEnvelope
                  className="h-5 w-5 shrink-0 text-indigo-400"
                  aria-hidden="true"
                />
                <span>Swapnil Menkar</span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhone
                  className="h-5 w-5 shrink-0 text-indigo-400"
                  aria-hidden="true"
                />
                <a
                  href="tel:+918149005578"
                  className="text-slate-400 transition-colors hover:text-indigo-400"
                >
                  Mobile: 8149005578
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-slate-800 pt-8 text-sm text-slate-500 sm:flex-row sm:items-center">
          <p className="text-base sm:text-sm">
            &copy; {currentYear} Swap Events Hub Client. All rights reserved.
          </p>
          <p>Designed &amp; developed by Swapnil Menkar</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
