import { Link } from 'react-router-dom';
import { FaTimesCircle } from 'react-icons/fa';
import PageContainer from '../components/PageContainer';
import Button from '../components/ui/Button';

const PaymentFailed = () => {
  return (
    <PageContainer hideHeader>
      <div className="flex min-h-[60vh] items-center justify-center py-8">
        <div className="w-full max-w-lg animate-fade-in rounded-2xl border border-red-200 bg-white p-8 text-center shadow-xl sm:p-10">
          <FaTimesCircle className="mx-auto mb-6 text-6xl text-red-500 sm:text-7xl" />
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Booking Failed
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            We couldn&apos;t process your payment. Please verify your details and
            try again, or contact support if the issue persists.
          </p>
          <div className="mt-8 space-y-3">
            <Link to="/" className="cursor-pointer">
              <Button variant="danger" className="w-full">
                Return to Events
              </Button>
            </Link>
            <Link to="/dashboard" className="cursor-pointer">
              <Button variant="secondary" className="w-full">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default PaymentFailed;
