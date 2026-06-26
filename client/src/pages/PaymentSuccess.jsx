import { Link } from 'react-router-dom';
import PageContainer from '../components/PageContainer';

const PaymentSuccess = () => {
  return (
    <PageContainer
      title="Payment Successful"
      subtitle="Your transaction was completed successfully."
    >
      <div className="w-full rounded-xl border border-emerald-200 bg-emerald-50 p-6 sm:p-8 lg:max-w-3xl">
        <p className="text-base text-emerald-800">
          Payment confirmation details will appear here.
        </p>
        <Link
          to="/dashboard"
          className="mt-6 inline-flex rounded-md bg-emerald-700 px-5 py-2.5 text-base font-medium text-white hover:bg-emerald-800"
        >
          Go to Dashboard
        </Link>
      </div>
    </PageContainer>
  );
};

export default PaymentSuccess;
