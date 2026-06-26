import { Link } from 'react-router-dom';
import PageContainer from '../components/PageContainer';

const PageNotFound = () => {
  return (
    <PageContainer
      title="Page Not Found"
      subtitle="The page you are looking for does not exist or has been moved."
    >
      <div className="w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:max-w-3xl">
        <p className="text-base text-slate-600">
          Return to the homepage to continue browsing events.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-md bg-indigo-600 px-5 py-2.5 text-base font-medium text-white hover:bg-indigo-700"
        >
          Back to Home
        </Link>
      </div>
    </PageContainer>
  );
};

export default PageNotFound;
