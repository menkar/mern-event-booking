import { useContext, useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CONTAINER_CLASS } from './PageContainer';
import {
  FaBars,
  FaSignInAlt,
  FaSignOutAlt,
  FaTicketAlt,
  FaTimes,
  FaUserCircle,
  FaUserPlus,
} from 'react-icons/fa';

const navLinkClass = ({ isActive }) =>
  [
    'rounded-md px-4 py-2 text-base font-medium transition-colors',
    isActive
      ? 'bg-indigo-50 text-indigo-700'
      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900',
  ].join(' ');

const mobileNavLinkClass = ({ isActive }) =>
  [
    'block rounded-md px-4 py-3 text-base font-medium transition-colors',
    isActive
      ? 'bg-indigo-50 text-indigo-700'
      : 'text-slate-800 hover:bg-slate-100',
  ].join(' ');

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/login');
  };

  const closeMobileMenu = () => setMobileOpen(false);

  const publicLinks = [{ label: 'Home', to: '/' }];

  const authLinks = user
    ? [
        { label: 'Dashboard', to: '/dashboard' },
        ...(user.role === 'admin' ? [{ label: 'Admin', to: '/admin' }] : []),
      ]
    : [
        { label: 'Login', to: '/login' },
        { label: 'Register', to: '/register' },
      ];

  const allLinks = [...publicLinks, ...authLinks];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white shadow-sm">
      <nav
        className={`${CONTAINER_CLASS} flex items-center justify-between gap-4 py-3 sm:py-4`}
        aria-label="Main navigation"
      >
        <Link
          to="/"
          className="group flex min-w-0 shrink items-center gap-3"
          onClick={closeMobileMenu}
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm transition group-hover:bg-indigo-700">
            <FaTicketAlt className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-lg font-bold text-slate-900 sm:text-xl">
              Swap Events Hub Client
            </span>
            <span className="hidden text-sm text-slate-500 sm:block">
              Book events with confidence
            </span>
          </span>
        </Link>

        <div className="hidden flex-1 items-center justify-end gap-1 lg:flex xl:gap-2">
          <div className="flex items-center gap-1 xl:gap-2">
            {allLinks.map(({ label, to }) => (
              <NavLink key={to} to={to} className={navLinkClass}>
                {label}
              </NavLink>
            ))}
          </div>

          {user ? (
            <div className="ml-4 flex items-center gap-4 border-l border-slate-200 pl-4 xl:ml-6 xl:pl-6">
              <div className="flex items-center gap-2 text-base text-slate-700">
                <FaUserCircle
                  className="h-5 w-5 shrink-0 text-indigo-600"
                  aria-hidden="true"
                />
                <span className="max-w-[180px] truncate font-medium">
                  {user.name || user.email}
                </span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2.5 text-base font-medium text-white transition hover:bg-slate-800"
              >
                <FaSignOutAlt aria-hidden="true" />
                Logout
              </button>
            </div>
          ) : (
            <div className="ml-4 flex items-center gap-3 border-l border-slate-200 pl-4 xl:ml-6 xl:pl-6">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-base font-medium text-slate-800 transition hover:bg-slate-50"
              >
                <FaSignInAlt aria-hidden="true" />
                Sign In
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2.5 text-base font-medium text-white transition hover:bg-indigo-700"
              >
                <FaUserPlus aria-hidden="true" />
                Get Started
              </Link>
            </div>
          )}
        </div>

        <button
          type="button"
          className="inline-flex shrink-0 items-center justify-center rounded-md p-2.5 text-slate-800 transition hover:bg-slate-100 lg:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? (
            <FaTimes className="h-6 w-6" />
          ) : (
            <FaBars className="h-6 w-6" />
          )}
        </button>
      </nav>

      {mobileOpen && (
        <div
          id="mobile-menu"
          className="w-full border-t border-slate-200 bg-white lg:hidden"
        >
          <div className={`${CONTAINER_CLASS} space-y-1 py-4`}>
            {allLinks.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                className={mobileNavLinkClass}
                onClick={closeMobileMenu}
              >
                {label}
              </NavLink>
            ))}

            {user ? (
              <div className="mt-4 space-y-3 border-t border-slate-200 pt-4">
                <div className="flex items-center gap-2 px-4 text-base text-slate-700">
                  <FaUserCircle
                    className="h-5 w-5 text-indigo-600"
                    aria-hidden="true"
                  />
                  <span className="font-medium">{user.name || user.email}</span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-slate-900 px-4 py-3 text-base font-medium text-white"
                >
                  <FaSignOutAlt aria-hidden="true" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="mt-4 grid gap-3 border-t border-slate-200 pt-4 sm:grid-cols-2">
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center gap-2 rounded-md border border-slate-300 px-4 py-3 text-base font-medium text-slate-800"
                >
                  <FaSignInAlt aria-hidden="true" />
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-3 text-base font-medium text-white"
                >
                  <FaUserPlus aria-hidden="true" />
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
