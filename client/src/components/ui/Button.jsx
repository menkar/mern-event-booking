const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  className = '',
  disabled = false,
  ...props
}) => {
  const variants = {
    primary:
      'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-200 disabled:bg-indigo-300',
    secondary:
      'border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 focus:ring-slate-200',
    dark:
      'bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-300 disabled:bg-slate-400',
    danger:
      'bg-red-600 text-white hover:bg-red-700 focus:ring-red-200 disabled:bg-red-300',
    success:
      'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-200 disabled:bg-emerald-300',
    ghost:
      'bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-slate-200',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-4 disabled:cursor-not-allowed sm:text-base sm:px-5 sm:py-3 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
