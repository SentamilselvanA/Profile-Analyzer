import React, { useState, useEffect } from "react";
import api from "../api/axios";
import ThemeToggle from "../components/ThemeToggle";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  BoltIcon,
  CpuChipIcon,
  CodeBracketIcon,
  CommandLineIcon,
  ArrowPathIcon,
  TrophyIcon,
  StarIcon
} from "@heroicons/react/24/outline";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Analysis = () => {
  const [analysis, setAnalysis] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadAnalysis = async () => {
    try {
      setLoading(true);
      const res = await api.get("/profile/dashboard");
      setProfiles(res.data.profiles || []);
      setAnalysis(res.data.analysis || null);
    } catch (error) {
      setError("Failed to load analysis data");
      console.error("Analysis load error:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshAnalysis = async () => {
    setIsRefreshing(true);
    try {
      await api.post("/profile/refresh");
      await loadAnalysis();
    } catch (error) {
      setError("Failed to refresh analysis");
      console.error("Refresh error:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadAnalysis();
  }, []);

  // Calculate stats
  const totalSolved = profiles.reduce((sum, p) => sum + (p.totalSolved || 0), 0);
  const totalPlatforms = profiles.length;
  const highestRating = Math.max(...profiles.map(p => p.rating || 0));
  const totalRepos = profiles.find(p => p.platform === 'github')?.repos || 0;
  const consistencyScore = analysis?.consistencyScore || 0;

  // Prepare chart data
  const difficultyData = profiles.flatMap(p => [
    { name: 'Easy', value: p.easySolved || 0, color: '#10b981' },
    { name: 'Medium', value: p.mediumSolved || 0, color: '#f59e0b' },
    { name: 'Hard', value: p.hardSolved || 0, color: '#ef4444' }
  ]).filter(item => item.value > 0);

  const platformComparisonData = profiles
    .filter(p => p.platform !== 'github')
    .map(p => ({
      name: p.platform.charAt(0).toUpperCase() + p.platform.slice(1),
      solved: p.totalSolved || 0
    }))
    .concat({
      name: 'GitHub',
      solved: totalRepos
    });

  const getConsistencyStatus = (score) => {
    if (score >= 80) return "Excellent Consistency";
    if (score >= 60) return "Good Consistency";
    if (score >= 40) return "Fair Consistency";
    return "Needs Improvement";
  };

  const getConsistencyColor = (score) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-blue-400";
    if (score >= 40) return "text-yellow-400";
    return "text-red-400";
  };

  const PlatformInsightCard = ({ platform, stats, insight, icon, colorClass }) => (
    <div className="p-6 rounded-xl border bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-white/10 backdrop-blur-sm hover:border-white/20 transition-all duration-300">
      <div className="flex items-center mb-4">
        <div className={`p-3 rounded-lg ${colorClass} mr-4`}>
          {React.createElement(icon, { className: "w-6 h-6 text-white" })}
        </div>
        <h3 className="text-xl font-semibold text-slate-100">{platform} Insight</h3>
      </div>
      <div className="space-y-3 mb-4">
        {stats.map((stat, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-slate-400">{stat.label}:</span>
            <span className="text-slate-100 font-semibold">{stat.value}</span>
          </div>
        ))}
      </div>
      <p className="text-cyan-300 text-sm leading-relaxed font-medium">{insight}</p>
    </div>
  );

  const DifficultyBar = ({ label, value, maxValue, color }) => {
    const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
    return (
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-300">{label}</span>
          <span className="text-slate-400">{value}</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-3">
          <div
            className="h-3 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%`, backgroundColor: color }}
          ></div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <ArrowPathIcon className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-300">Loading analysis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={loadAnalysis}
            className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <ChartBarIcon className="w-16 h-16 text-slate-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-slate-100 mb-4">No Analysis Available Yet</h2>
          <p className="text-slate-400 mb-6">
            Connect your coding profiles and run analysis to see detailed insights about your performance.
          </p>
          <div className="space-y-2 text-sm text-slate-500">
            <p>• Link your LeetCode, Codeforces, and GitHub accounts</p>
            <p>• Ensure your profiles are public and accessible</p>
            <p>• Click "Refresh Profiles" to update and analyze your data</p>
          </div>
        </div>
      </div>
    );
  }

  const maxDifficulty = Math.max(...difficultyData.map(d => d.value));

  return (
    <div className="min-h-screen bg-slate-900 pt-16">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-white/10 pb-8">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-3">
                Coding Performance Analysis
              </h1>
              <p className="text-slate-200 text-lg leading-relaxed">
                Understand your strengths, weaknesses, and improvement areas.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={refreshAnalysis}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowPathIcon className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh Analysis
              </button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Consistency Score Section */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10 rounded-xl p-8 backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                  <defs>
                    <linearGradient id="consistencyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#0891b2" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="url(#consistencyGradient)"
                    strokeWidth="3"
                    strokeDasharray={`${consistencyScore}, 100`}
                    className="text-slate-600"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray="100, 100"
                    className="text-slate-700"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className={`text-4xl font-black ${getConsistencyColor(consistencyScore)}`}>
                      {consistencyScore}
                    </div>
                    <div className="text-sm text-slate-400 font-medium">/100</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-2xl font-bold text-slate-100 mb-2">Consistency Score</h2>
              <p className={`text-lg font-semibold mb-4 ${getConsistencyColor(consistencyScore)}`}>
                {getConsistencyStatus(consistencyScore)}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-cyan-400">{totalPlatforms}</div>
                  <div className="text-sm text-slate-400">Platforms Connected</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-400">{totalSolved}</div>
                  <div className="text-sm text-slate-400">Total Solved</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-yellow-400">{highestRating}</div>
                  <div className="text-sm text-slate-400">Highest Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Insight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {profiles.map((profile) => {
            let stats = [];
            let insight = "";
            let icon = CodeBracketIcon;
            let colorClass = "bg-gradient-to-br from-blue-500 to-violet-500";

            switch (profile.platform) {
              case 'leetcode':
                stats = [
                  { label: 'Total solved', value: profile.totalSolved || 0 },
                  { label: 'Easy', value: profile.easySolved || 0 },
                  { label: 'Medium', value: profile.mediumSolved || 0 },
                  { label: 'Hard', value: profile.hardSolved || 0 }
                ];
                insight = "Good medium practice but hard exposure can improve.";
                icon = CodeBracketIcon;
                colorClass = "bg-gradient-to-br from-orange-400 to-pink-500";
                break;
              case 'codeforces':
                stats = [
                  { label: 'Rating', value: profile.rating || 0 },
                  { label: 'Solved', value: profile.totalSolved || 0 }
                ];
                insight = "Beginner contest profile. Participate in more contests.";
                icon = CpuChipIcon;
                colorClass = "bg-gradient-to-br from-blue-500 to-blue-800";
                break;
              case 'github':
                stats = [
                  { label: 'Repositories', value: profile.repos || 0 },
                  { label: 'Followers', value: profile.followers || 0 }
                ];
                insight = "Good start but project portfolio can grow.";
                icon = CommandLineIcon;
                colorClass = "bg-gradient-to-br from-slate-700 to-slate-900";
                break;
            }

            return (
              <PlatformInsightCard
                key={profile.platform}
                platform={profile.platform.charAt(0).toUpperCase() + profile.platform.slice(1)}
                stats={stats}
                insight={insight}
                icon={icon}
                colorClass={colorClass}
              />
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Difficulty Distribution */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="text-xl font-semibold text-slate-100 mb-6 flex items-center">
              <ChartBarIcon className="w-6 h-6 mr-3 text-cyan-400" />
              Difficulty Distribution
            </h3>
            <div className="space-y-4">
              {difficultyData.map((item, index) => (
                <DifficultyBar
                  key={index}
                  label={item.name}
                  value={item.value}
                  maxValue={maxDifficulty}
                  color={item.color}
                />
              ))}
            </div>
          </div>

          {/* Platform Comparison */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="text-xl font-semibold text-slate-100 mb-6 flex items-center">
              <TrophyIcon className="w-6 h-6 mr-3 text-cyan-400" />
              Platform Comparison
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={platformComparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="solved" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Strengths and Weaknesses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl border bg-gradient-to-br from-emerald-500/10 to-green-500/10 border-emerald-500/20 backdrop-blur-sm">
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 mr-4">
                <CheckCircleIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-100">Strengths</h3>
            </div>
            <ul className="space-y-3">
              {analysis.strengths?.map((strength, index) => (
                <li key={index} className="flex items-start text-slate-300">
                  <span className="text-emerald-400 mr-2 mt-1">✔</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 rounded-xl border bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20 backdrop-blur-sm">
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 mr-4">
                <ExclamationTriangleIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-100">Weak Areas</h3>
            </div>
            <ul className="space-y-3">
              {analysis.weaknesses?.map((weakness, index) => (
                <li key={index} className="flex items-start text-slate-300">
                  <span className="text-orange-400 mr-2 mt-1">⚠</span>
                  <span>{weakness}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Suggestions */}
        <div className="p-6 rounded-xl border bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20 backdrop-blur-sm">
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 mr-4">
              <BoltIcon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-slate-100">Recommended Actions</h3>
          </div>
          <ul className="space-y-3">
            {analysis.suggestions?.map((suggestion, index) => (
              <li key={index} className="flex items-start text-slate-300">
                <span className="text-blue-400 mr-2 mt-1 font-bold">{index + 1}.</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Coding Persona and Growth Readiness */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl border bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20 backdrop-blur-sm">
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 mr-4">
                <StarIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-100">Your Coding Persona</h3>
            </div>
            {analysis.classification && (
              <div className="space-y-3">
                <div className="text-2xl font-bold text-purple-400">{analysis.classification.level}</div>
                <p className="text-slate-300">{analysis.classification.description}</p>
              </div>
            )}
          </div>

          <div className="p-6 rounded-xl border bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20 backdrop-blur-sm">
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 mr-4">
                <TrophyIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-100">Growth Readiness</h3>
            </div>
            <div className="space-y-3">
              <div className="text-lg font-semibold text-cyan-400">High Potential</div>
              {analysis.growthReadiness && (
                <p className="text-slate-300">{analysis.growthReadiness}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;