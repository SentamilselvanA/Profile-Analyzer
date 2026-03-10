import { useEffect, useState } from "react";
import { useTheme } from '../context/ThemeContext';
import api from "../api/axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from "recharts";
import {
  ArrowPathIcon,
  CodeBracketIcon,
  CpuChipIcon,
  CommandLineIcon,
  ChartBarIcon,
  TrophyIcon,
  StarIcon,
  BoltIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

// Circular Progress Component
const CircularProgress = ({ value, size = 60, strokeWidth = 6 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  // Heatmap gradient: Red -> Yellow -> Green
  const getGradientColor = (percentage) => {
    if (percentage < 33) return '#ef4444'; // Red
    if (percentage < 66) return '#f59e0b'; // Yellow/Orange
    return '#10b981'; // Green
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-slate-700"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getGradientColor(value)}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-white">{value}%</span>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [profiles, setProfiles] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { isDark } = useTheme();

  const loadDashboard = async () => {
    try {
      const res = await api.get("/profile/dashboard");
      setProfiles(res.data.profiles || []);
      setAnalysis(res.data.analysis || null);
    } catch (error) {
      alert("Failed to load dashboard");
    }
  };

  const refreshProfiles = async () => {
    setIsRefreshing(true);
    try {
      await api.post("/profile/refresh");
      await loadDashboard();
    } catch (error) {
      alert("Refresh failed");
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // Calculate summary stats
  const totalSolved = profiles.reduce((sum, p) => sum + (p.totalSolved || 0), 0);
  const totalPlatforms = profiles.length;
  const highestRating = Math.max(...profiles.map(p => p.rating || 0));
  const totalRepos = profiles.find(p => p.platform === 'github')?.repos || 0;
  const consistencyScore = analysis?.consistencyScore || 0;

  // Chart data
  const platformData = profiles
    .filter(p => p.platform !== 'github') // Exclude GitHub from chart
    .map((p) => ({
      platform: p.platform.charAt(0).toUpperCase() + p.platform.slice(1),
      solved: p.totalSolved || 0,
      rating: p.rating || 0
    }));

  const difficultyData = profiles.flatMap(p => [
    { name: 'Easy', value: p.easySolved || 0, color: '#10b981' },
    { name: 'Medium', value: p.mediumSolved || 0, color: '#f59e0b' },
    { name: 'Hard', value: p.hardSolved || 0, color: '#ef4444' }
  ]).filter(item => item.value > 0);

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'leetcode': return CodeBracketIcon;
      case 'codeforces': return CpuChipIcon;
      case 'github': return CommandLineIcon;
      default: return CodeBracketIcon;
    }
  };

  const getPlatformColor = (platform) => {
    switch (platform) {
      case 'leetcode': return 'from-orange-400 to-pink-500'; // Vibrant orange gradient
      case 'codeforces': return 'from-blue-500 to-blue-800'; // Deep blue gradient
      case 'github': return 'from-slate-700 to-slate-900'; // Dark slate gradient
      default: return 'from-blue-500 to-violet-500';
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'primary', isCircular = false }) => (
    <div className="stat-card">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 bg-gradient-to-br from-${color}-500 to-${color}-600 rounded-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="text-right">
          {isCircular ? (
            <CircularProgress value={parseInt(value)} />
          ) : (
            <div className="text-2xl font-bold text-white">
              {value}
            </div>
          )}
          <div className="text-sm text-slate-300">
            {title}
          </div>
        </div>
      </div>
      {subtitle && (
        <div className="text-xs text-slate-400">
          {subtitle}
        </div>
      )}
    </div>
  );

  const PlatformCard = ({ profile }) => {
    const Icon = getPlatformIcon(profile.platform);
    const colorClass = getPlatformColor(profile.platform);
    const isGitHub = profile.platform === 'github';

    return (
      <div className="stat-card">
        <div className="flex items-center space-x-3 mb-4">
          <div className={`p-2 bg-gradient-to-br ${colorClass} rounded-lg`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-100 capitalize hover:text-cyan-300 transition-colors duration-200 cursor-pointer">
              {profile.platform}
            </h3>
            <p className="text-sm text-slate-400 hover:text-cyan-300 transition-colors duration-200 cursor-pointer">
              @{profile.username}
            </p>
          </div>
        </div>

        {!isGitHub && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-lg font-bold text-white">
                {profile.totalSolved || 0}
              </div>
              <div className="text-xs text-slate-400">
                Total Solved
              </div>
            </div>
            {profile.rating && (
              <div>
                <div className="text-lg font-bold text-white">
                  {profile.rating}
                </div>
                <div className="text-xs text-slate-400">
                  Rating
                </div>
              </div>
            )}
          </div>
        )}

        {(profile.easySolved || profile.mediumSolved || profile.hardSolved) && (
          <div className="flex space-x-2 mb-4">
            {profile.easySolved > 0 && (
              <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full border border-green-500/30">
                E: {profile.easySolved}
              </span>
            )}
            {profile.mediumSolved > 0 && (
              <span className="px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded-full border border-orange-500/30">
                M: {profile.mediumSolved}
              </span>
            )}
            {profile.hardSolved > 0 && (
              <span className="px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded-full border border-red-500/30">
                H: {profile.hardSolved}
              </span>
            )}
          </div>
        )}

        <div className="flex justify-between text-sm">
          {profile.rank && (
            <span className="text-slate-400">
              Rank: {profile.rank}
            </span>
          )}
          {profile.repos && (
            <span className="text-slate-400">
              Repos: {profile.repos}
            </span>
          )}
          {profile.followers && (
            <span className="text-slate-400">
              Followers: {profile.followers}
            </span>
          )}
        </div>
      </div>
    );
  };

  const AnalysisCard = ({ title, items, icon: Icon, colorClass, bgColor }) => (
    <div className={`stat-card ${bgColor}`}>
      <div className="flex items-center space-x-3 mb-4">
        <div className={`p-2 ${colorClass} rounded-lg`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-slate-100">
          {title}
        </h3>
      </div>
      <ul className="space-y-2">
        {items?.map((item, index) => (
          <li key={index} className="flex items-start space-x-2 text-sm text-slate-300">
            <div className="w-1.5 h-1.5 bg-current rounded-full mt-2 flex-shrink-0"></div>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  const InsightCard = ({ title, content, icon: Icon, colorClass }) => (
    <div className="stat-card">
      <div className="flex items-center space-x-3 mb-4">
        <div className={`p-2 ${colorClass} rounded-lg`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-slate-100">
          {title}
        </h3>
      </div>
      <p className="text-slate-300 text-sm leading-relaxed">
        {content}
      </p>
    </div>
  );

  const ClassificationCard = ({ classification }) => (
    <div className="stat-card bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg">
          <StarIcon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-100">
            {classification.type}
          </h3>
          <p className="text-sm text-cyan-300">
            {classification.focus}
          </p>
        </div>
      </div>
      <p className="text-slate-300 text-sm mb-4">
        {classification.description}
      </p>
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-slate-200">Next Steps:</h4>
        {classification.nextSteps?.map((step, index) => (
          <div key={index} className="flex items-start space-x-2 text-sm text-slate-300">
            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
            <span>{step}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const SuggestionsCard = ({ suggestions }) => (
    <div className="stat-card">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg">
          <LightBulbIcon className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-slate-100">
          Action Plan
        </h3>
      </div>

      {suggestions.immediate && suggestions.immediate.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-emerald-300 mb-2">Immediate (1-2 weeks):</h4>
          <ul className="space-y-1">
            {suggestions.immediate.map((suggestion, index) => (
              <li key={index} className="flex items-start space-x-2 text-sm text-slate-300">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {suggestions.shortTerm && suggestions.shortTerm.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-blue-300 mb-2">Short-term (1-2 months):</h4>
          <ul className="space-y-1">
            {suggestions.shortTerm.map((suggestion, index) => (
              <li key={index} className="flex items-start space-x-2 text-sm text-slate-300">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {suggestions.longTerm && suggestions.longTerm.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-purple-300 mb-2">Long-term (3-6 months):</h4>
          <ul className="space-y-1">
            {suggestions.longTerm.map((suggestion, index) => (
              <li key={index} className="flex items-start space-x-2 text-sm text-slate-300">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen pt-32 pb-12 px-4 bg-slate-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-2 hover:scale-105 transition-transform duration-200 cursor-pointer">
              Coding Dashboard
            </h1>
            <p className="text-lg text-slate-300 hover:text-cyan-300 transition-colors duration-200">
              Track your coding journey and analyze your performance
            </p>
          </div>
          <button
            onClick={refreshProfiles}
            disabled={isRefreshing}
            className="btn-secondary mt-4 sm:mt-0 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
          >
            {isRefreshing ? (
              <div className="flex items-center space-x-2">
                <ArrowPathIcon className="w-4 h-4 animate-spin" />
                <span>Refreshing...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <ArrowPathIcon className="w-4 h-4" />
                <span>Refresh</span>
              </div>
            )}
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={CodeBracketIcon}
            title="Total Solved"
            value={totalSolved}
            subtitle="Across all platforms"
            color="violet"
          />
          <StatCard
            icon={ChartBarIcon}
            title="Platforms"
            value={totalPlatforms}
            subtitle="Connected accounts"
            color="cyan"
          />
          <StatCard
            icon={TrophyIcon}
            title="Highest Rating"
            value={highestRating || 'N/A'}
            subtitle="Best performance"
            color="orange"
          />
          <StatCard
            icon={StarIcon}
            title="Consistency"
            value={`${consistencyScore}`}
            subtitle="Performance score"
            color="emerald"
            isCircular={true}
          />
        </div>

        {/* Platform Cards */}
        {profiles.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-100 mb-6 hover:text-cyan-300 transition-colors duration-200 cursor-pointer">
              Platform Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profiles.map((profile) => (
                <PlatformCard key={profile.platform} profile={profile} />
              ))}
            </div>
          </div>
        )}

        {/* Charts Section */}
        {platformData.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-100 mb-6 hover:text-cyan-300 transition-colors duration-200 cursor-pointer">
              Analytics
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Platform Comparison */}
              <div className="stat-card">
                <h3 className="text-lg font-semibold text-slate-100 mb-4 hover:text-cyan-300 transition-colors duration-200 cursor-pointer">
                  Problems Solved by Platform
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={platformData}>
                    <XAxis
                      dataKey="platform"
                      tick={{ fill: '#9ca3af' }}
                      axisLine={{ stroke: '#374151' }}
                    />
                    <YAxis
                      tick={{ fill: '#9ca3af' }}
                      axisLine={{ stroke: '#374151' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="solved" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Difficulty Distribution */}
              {difficultyData.length > 0 && (
                <div className="stat-card">
                  <h3 className="text-lg font-semibold text-slate-100 mb-4 hover:text-cyan-300 transition-colors duration-200 cursor-pointer">
                    Difficulty Distribution
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={difficultyData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {difficultyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: isDark ? '#1f2937' : '#ffffff',
                          border: `1px solid ${isDark ? '#374151' : '#d1d5db'}`,
                          borderRadius: '8px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Comprehensive Analysis Report */}
        {analysis && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-slate-100 mb-6 hover:text-blue-400 transition-colors duration-200 cursor-pointer">
              Performance Insights
            </h2>

            {/* Strengths and Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnalysisCard
                title="Strengths"
                items={analysis.strengths}
                icon={CheckCircleIcon}
                colorClass="bg-gradient-to-br from-emerald-500 to-green-500"
                bgColor="bg-gradient-to-br from-emerald-500/10 to-green-500/10 border-emerald-500/20"
              />
              <AnalysisCard
                title="Areas to Improve"
                items={analysis.weaknesses}
                icon={ExclamationTriangleIcon}
                colorClass="bg-gradient-to-br from-orange-500 to-red-500"
                bgColor="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20"
              />
            </div>

            {/* User Classification */}
            {analysis.classification && (
              <ClassificationCard classification={analysis.classification} />
            )}

            {/* Personalized Suggestions */}
            {analysis.suggestions && (
              <SuggestionsCard suggestions={analysis.suggestions} />
            )}

            {/* Platform Balance Analysis */}
            {analysis.platformBalance && (
              <InsightCard
                title="Platform Balance"
                content={analysis.platformBalance}
                icon={ChartBarIcon}
                colorClass="bg-gradient-to-br from-blue-500 to-cyan-500"
              />
            )}

            {/* Growth Readiness */}
            {analysis.growthReadiness && (
              <InsightCard
                title="Growth Readiness"
                content={analysis.growthReadiness}
                icon={BoltIcon}
                colorClass="bg-gradient-to-br from-purple-500 to-pink-500"
              />
            )}

            {/* Platform-Specific Insights */}
            {analysis.platformInsights && analysis.platformInsights.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-slate-100 mb-4">Platform-Specific Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {analysis.platformInsights.map((insight, index) => (
                    <InsightCard
                      key={index}
                      title={insight.platform}
                      content={insight.insight}
                      icon={CodeBracketIcon}
                      colorClass="bg-gradient-to-br from-indigo-500 to-purple-500"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;