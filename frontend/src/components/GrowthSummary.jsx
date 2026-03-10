import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ExclamationCircleIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';

const GrowthSummary = ({ summary, labels }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Performance Summary */}
      <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-xl">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-cyan-500/20 rounded-xl mr-4 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <ChartBarIcon className="w-6 h-6 text-cyan-400" />
          </div>
          <h2 className="text-xl font-bold text-white">Performance Change Summary</h2>
        </div>
        
        <div className="space-y-4">
          {summary && summary.length > 0 ? (
            summary.map((item, index) => (
              <div key={index} className="flex items-center bg-slate-700/30 p-4 rounded-xl border border-white/5 transition-colors hover:bg-slate-700/50">
                <ArrowTrendingUpIcon className="w-5 h-5 text-emerald-400 mr-3" />
                <span className="text-slate-200">{item}</span>
              </div>
            ))
          ) : (
            <div className="text-slate-400 italic">No recent performance changes. Refresh your profile to build history.</div>
          )}
        </div>
      </div>

      {/* Trend Insights */}
      <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-xl">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-purple-500/20 rounded-xl mr-4 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
            <CheckBadgeIcon className="w-6 h-6 text-purple-400" />
          </div>
          <h2 className="text-xl font-bold text-white">Improvement Trend Detection</h2>
        </div>

        <div className="space-y-4 flex flex-wrap gap-3">
            {labels && labels.length > 0 ? (
                labels.map((label, index) => {
                    const colorClasses = {
                        success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                        warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
                        danger: "bg-rose-500/10 text-rose-400 border-rose-500/20",
                        info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
                    };
                    return (
                        <span 
                            key={index} 
                            className={`px-4 py-2 rounded-full border text-sm font-semibold flex items-center ${colorClasses[label.type] || colorClasses.info}`}
                        >
                            {label.type === 'danger' && <ExclamationCircleIcon className="w-4 h-4 mr-2" />}
                            {label.type === 'success' && <ArrowTrendingUpIcon className="w-4 h-4 mr-2" />}
                            {label.text}
                        </span>
                    )
                })
            ) : (
                <div className="text-slate-400 italic">No trend insights available yet. Please keep practicing!</div>
            )}
        </div>
      </div>
    </div>
  );
};

export default GrowthSummary;
