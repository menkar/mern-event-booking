const CONTAINER_CLASS =
  'w-full px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24';

export { CONTAINER_CLASS };

const PageContainer = ({ title, subtitle, children, className = '' }) => {
  return (
    <section className={`w-full ${className}`}>
      <div className={`${CONTAINER_CLASS} py-8 sm:py-10 lg:py-12`}>
        {(title || subtitle) && (
          <header className="mb-8 border-b border-slate-200 pb-6 sm:mb-10">
            {title && (
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
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
