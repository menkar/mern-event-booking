import PageContainer from '../components/PageContainer';

const Login = () => {
  return (
    <PageContainer
      title="Sign In"
      subtitle="Access your dashboard, bookings, and event management tools."
    >
      <div className="w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:max-w-2xl">
        <p className="text-base text-slate-600">
          Login form will be available here. Authentication logic remains
          unchanged.
        </p>
      </div>
    </PageContainer>
  );
};

export default Login;
