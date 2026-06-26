import PageContainer from '../components/PageContainer';

const UserDashboard = () => {
  return (
    <PageContainer
      title="User Dashboard"
      subtitle="View and manage your event bookings in one place."
    >
      <div className="w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-base text-slate-600">
          Dashboard content will be displayed here.
        </p>
      </div>
    </PageContainer>
  );
};

export default UserDashboard;
