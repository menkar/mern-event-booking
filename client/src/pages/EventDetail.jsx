import PageContainer from '../components/PageContainer';

const EventDetail = () => {
  return (
    <PageContainer
      title="Event Details"
      subtitle="View event information and proceed with booking."
    >
      <div className="w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-base text-slate-600">
          Event details will be displayed here.
        </p>
      </div>
    </PageContainer>
  );
};

export default EventDetail;
