import PageContainer from '../components/PageContainer';

const Register = () => {
  return (
    <PageContainer
      title="Create Account"
      subtitle="Register to browse events, manage bookings, and access your personal dashboard."
    >
      <div className="w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:max-w-2xl">
        <p className="text-base text-slate-600">
          Registration form will be available here. Your account workflow remains
          unchanged.
        </p>
      </div>
    </PageContainer>
  );
};

export default Register;
