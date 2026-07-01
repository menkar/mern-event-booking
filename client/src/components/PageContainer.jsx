const CONTAINER_CLASS =
  'w-full px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24';

export { CONTAINER_CLASS };

const PageContainer = ({
  title,
  subtitle,
  children,
  className = '',
  hideHeader = false,
  fullWidth = false,
  compact = false,
}) => {
  const paddingClass = compact
    ? 'py-5 sm:py-6 lg:py-7'
    : 'py-8 sm:py-10 lg:py-12';

  return (
    <section className={`w-full ${className}`}>
      <div
        className={`${fullWidth ? 'w-full' : CONTAINER_CLASS} ${paddingClass}`}
      >
        {!hideHeader && (title || subtitle) && (
          <header
            className={`border-b border-slate-200 pb-4 ${compact ? 'mb-5 sm:mb-6' : 'mb-8 pb-6 sm:mb-10'}`}
          >
            {title && (
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="mt-2 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
                {subtitle}
              </p>
            )}
          </header>
        )}
        {children}
      </div>
    </section>
  );
};

export default PageContainer;
