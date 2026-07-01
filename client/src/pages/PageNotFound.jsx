import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';
import PageContainer from '../components/PageContainer';
import Button from '../components/ui/Button';

const PageNotFound = () => {
  return (
    <PageContainer hideHeader>
      <div className="flex min-h-[60vh] items-center justify-center py-8">
        <div className="w-full max-w-lg animate-fade-in rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-lg sm:p-10">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
            <FaExclamationTriangle className="text-4xl text-amber-600" />
          </div>
          <p className="text-sm font-bold tracking-widest text-indigo-600 uppercase">
            404 Error
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            Page Not Found
          </h1>
          <p className="mt-4 text-base text-slate-600">
            The page you are looking for does not exist or may have been moved.
          </p>
          <Link to="/" className="mt-8 inline-block w-full cursor-pointer sm:w-auto">
            <Button className="w-full">Back to Home</Button>
          </Link>
        </div>
      </div>
    </PageContainer>
  );
};

export default PageNotFound;
