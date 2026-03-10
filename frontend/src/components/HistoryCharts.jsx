import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 p-3 rounded-lg shadow-xl">
        <p className="text-slate-300 mb-1">{label}</p>
        <p className="text-cyan-400 font-bold">
          {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

const HistoryCharts = ({ leetcode, codeforces, github }) => {
  // Format data for Recharts
  const formatData = (data, metricKey) => {
    return data.map(item => ({
      date: new Date(item.capturedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: item[metricKey]
    }));
  };

  const leetcodeData = formatData(leetcode, 'totalSolved');
  const codeforcesData = formatData(codeforces, 'rating');
  const githubData = formatData(github, 'repos');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* LeetCode Solved Chart */}
      <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-6">LeetCode Total Solved</h3>
        <div className="h-64">
          {leetcodeData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={leetcodeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#94a3b8" 
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  tickMargin={10}
                />
                <YAxis 
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  tickMargin={10}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#06b6d4" 
                  strokeWidth={3}
                  dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#fff', stroke: '#06b6d4' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">
              Not enough data to display chart
            </div>
          )}
        </div>
      </div>

      {/* Codeforces Rating Chart */}
      <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-6">Codeforces Rating Trend</h3>
        <div className="h-64">
          {codeforcesData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={codeforcesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  tickMargin={10}
                />
                <YAxis 
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  tickMargin={10}
                  domain={['auto', 'auto']}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#fff', stroke: '#8b5cf6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">
              Not enough data to display chart
            </div>
          )}
        </div>
      </div>

      {/* GitHub Repos Chart */}
      <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-xl lg:col-span-2">
        <h3 className="text-lg font-bold text-white mb-6">GitHub Repositories Over Time</h3>
        <div className="h-64">
          {githubData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={githubData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  tickMargin={10}
                />
                <YAxis 
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  tickMargin={10}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#fff', stroke: '#10b981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">
              Not enough data to display chart
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryCharts;
