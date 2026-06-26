import PageContainer from '../components/PageContainer';

const AdminDashboard = () => {
  return (
    <PageContainer
      title="Admin Dashboard"
      subtitle="Manage events, confirm bookings, and oversee platform operations."
    >
      <div className="w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-base text-slate-600">
          Admin dashboard content will be displayed here.
        </p>
      </div>
    </PageContainer>
  );
};

export default AdminDashboard;
