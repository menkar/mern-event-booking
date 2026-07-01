const StatusBadge = ({ status, type = 'booking' }) => {
  const bookingStyles = {
    confirmed: 'bg-emerald-100 text-emerald-800',
    pending: 'bg-amber-100 text-amber-800',
    cancelled: 'bg-red-100 text-red-800',
    paid: 'bg-blue-100 text-blue-800',
    not_paid: 'bg-slate-200 text-slate-700',
  };

  const label = String(status || '').replace(/_/g, ' ');
  const style =
    bookingStyles[status] || 'bg-slate-100 text-slate-700';

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${style}`}
    >
      {label}
    </span>
  );
};

export default StatusBadge;
