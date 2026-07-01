const AuthCard = ({ title, subtitle, children, footer }) => {
  return (
    <div className="mx-auto w-full max-w-md animate-fade-in">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
        <div className="border-b border-slate-100 bg-gradient-to-r from-indigo-600 to-slate-900 px-6 py-8 text-center text-white sm:px-8">
          <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
          {subtitle && (
            <p className="mt-2 text-sm text-indigo-100 sm:text-base">{subtitle}</p>
          )}
        </div>
        <div className="px-6 py-8 sm:px-8">{children}</div>
        {footer && (
          <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 text-center text-sm text-slate-600 sm:px-8">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCard;
