import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import PageContainer from '../components/PageContainer';
import Button from '../components/ui/Button';

const PaymentSuccess = () => {
  return (
    <PageContainer hideHeader>
      <div className="flex min-h-[60vh] items-center justify-center py-8">
        <div className="w-full max-w-lg animate-fade-in rounded-2xl border border-emerald-200 bg-white p-8 text-center shadow-xl sm:p-10">
          <FaCheckCircle className="mx-auto mb-6 text-6xl text-emerald-500 sm:text-7xl" />
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Booking Confirmed!
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            Your ticket has been booked successfully. A confirmation email has
            been sent to your registered email address.
          </p>
          <div className="mt-8 space-y-3">
            <Link to="/dashboard" className="cursor-pointer">
              <Button variant="success" className="w-full">
                View My Tickets
              </Button>
            </Link>
            <Link to="/" className="cursor-pointer">
              <Button variant="secondary" className="w-full">
                Discover More Events
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default PaymentSuccess;
