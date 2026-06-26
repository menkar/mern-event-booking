import { CONTAINER_CLASS } from './PageContainer';

const Header = () => {
  return (
    <div className="w-full border-b border-slate-800 bg-slate-950 text-slate-300">
      <div
        className={`${CONTAINER_CLASS} flex flex-col items-start justify-between gap-2 py-2.5 sm:flex-row sm:items-center`}
      >
        <p className="text-sm font-medium tracking-wide text-slate-200 sm:text-base">
          Swap Events Hub Client — Enterprise Event Booking Platform
        </p>
        <p className="text-sm text-slate-400">
          Secure bookings · Real-time availability · Admin controls
        </p>
      </div>
    </div>
  );
};

export default Header;
