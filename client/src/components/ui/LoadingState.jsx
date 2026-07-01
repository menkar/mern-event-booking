const LoadingState = ({ message = 'Loading...' }) => {
  return (
    <div className="flex min-h-[320px] w-full flex-col items-center justify-center gap-4 py-16">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      <p className="text-base font-medium text-slate-600">{message}</p>
    </div>
  );
};

export default LoadingState;
