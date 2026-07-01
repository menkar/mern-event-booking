const Alert = ({ type = 'error', children, className = '' }) => {
  const styles = {
    error: 'border-red-200 bg-red-50 text-red-700',
    success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    info: 'border-indigo-200 bg-indigo-50 text-indigo-800',
    warning: 'border-amber-200 bg-amber-50 text-amber-800',
  };

  return (
    <div
      role="alert"
      className={`rounded-lg border px-4 py-3 text-sm font-medium ${styles[type]} ${className}`}
    >
      {children}
    </div>
  );
};

export default Alert;
