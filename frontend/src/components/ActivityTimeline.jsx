import { ClockIcon } from '@heroicons/react/24/outline';

const ActivityTimeline = ({ timeline }) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-xl w-full">
      <div className="flex items-center mb-6">
        <div className="p-3 bg-amber-500/20 rounded-xl mr-4 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
          <ClockIcon className="w-6 h-6 text-amber-400" />
        </div>
        <h2 className="text-xl font-bold text-white">Recent Activity Timeline</h2>
      </div>

      <div className="relative border-l border-slate-700 ml-3 md:ml-6 mt-6 pb-4">
        {timeline && timeline.length > 0 ? (
          timeline.map((item, index) => (
            <div key={item.id || index} className="mb-8 ml-6 relative">
              <span className="absolute -left-8 top-1 flex h-4 w-4 rounded-full bg-cyan-500 ring-4 ring-slate-900"></span>
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <span className="text-sm font-semibold tracking-wide text-cyan-400 uppercase">
                  {item.date}
                </span>
              </div>
              <p className="mt-2 text-slate-300">
                {item.title}
              </p>
            </div>
          ))
        ) : (
          <div className="ml-6 text-slate-400 italic">No activity timeline available. Please refresh profiles to see updates.</div>
        )}
      </div>
    </div>
  );
};

export default ActivityTimeline;
