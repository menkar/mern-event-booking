import { Link } from 'react-router-dom';
import PageContainer from '../components/PageContainer';

const PaymentFailed = () => {
  return (
    <PageContainer
      title="Payment Failed"
      subtitle="We could not process your payment. Please try again."
    >
      <div className="w-full rounded-xl border border-red-200 bg-red-50 p-6 sm:p-8 lg:max-w-3xl">
        <p className="text-base text-red-800">
          Payment failure details will appear here.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-md bg-red-700 px-5 py-2.5 text-base font-medium text-white hover:bg-red-800"
        >
          Back to Home
        </Link>
      </div>
    </PageContainer>
  );
};

export default PaymentFailed;
