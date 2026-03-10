import { useState, useEffect } from "react";
import axios from "axios";
import { 
  AcademicCapIcon, 
  ArrowPathIcon, 
  LightBulbIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  ExclamationCircleIcon
} from "@heroicons/react/24/outline";
import { exportToPdf } from "../utils/exportPdf";

const TopicAnalysis = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/profile/topics`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load topic analysis.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-8">
        <ArrowPathIcon className="w-12 h-12 text-indigo-400 animate-spin mb-4" />
        <h2 className="text-xl font-bold text-slate-200">Analyzing Your Topics...</h2>
      </div>
    );
  }

  if (error) {
     return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-8">
            <div className="bg-rose-500/10 p-6 rounded-2xl border border-rose-500/20 max-w-md text-center">
                <ExclamationCircleIcon className="w-12 h-12 text-rose-400 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-rose-400 mb-2">Error</h2>
                <p className="text-slate-300">{error}</p>
            </div>
        </div>
     );
  }

  return (
    <div className="min-h-screen pt-32 pb-12 px-4 bg-slate-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-white mb-2 flex items-center">
                <AcademicCapIcon className="w-8 h-8 mr-3 text-indigo-400" />
                Intelligent Topic Analysis
            </h1>
            <p className="text-slate-400">Deep dive into your Data Structures and Algorithms proficiency.</p>
        </div>
        
        <div className="flex justify-end mb-4">
             <button 
                onClick={() => exportToPdf('topic-content', 'topic-analysis.pdf')}
                className="flex items-center px-4 py-2 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-lg transition-all text-xs"
            >
                <AcademicCapIcon className="w-4 h-4 mr-2" />
                Export as PDF
            </button>
        </div>

        {data && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="topic-content">
                {/* Left Column - Priority Insights */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Summary Card */}
                    <div className="bg-indigo-600/10 border border-indigo-500/20 p-6 rounded-2xl shadow-lg">
                        <div className="flex items-center mb-4">
                            <ShieldCheckIcon className="w-6 h-6 text-indigo-400 mr-2" />
                            <h3 className="text-lg font-bold text-white">Main Insight</h3>
                        </div>
                        <p className="text-slate-300 leading-relaxed font-medium">
                            {data.summaryInsight}
                        </p>
                    </div>

                    {/* Recommendations */}
                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5 shadow-xl">
                        <div className="flex items-center mb-6">
                            <LightBulbIcon className="w-6 h-6 text-amber-400 mr-2" />
                            <h3 className="text-lg font-bold text-white">Smart Recommendations</h3>
                        </div>
                        <div className="space-y-4">
                            {data.recommendations.map((rec, i) => (
                                <div key={i} className="flex items-start bg-slate-900/50 p-4 rounded-xl border-l-4 border-amber-500/50">
                                    <p className="text-sm text-slate-300">{rec}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Strengths & Weaknesses */}
                     <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5 shadow-xl">
                        <h3 className="text-lg font-bold text-white mb-6">Area Focus</h3>
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">Strong Points</h4>
                                <div className="flex flex-wrap gap-2">
                                    {data.strongTopics.map(t => (
                                        <span key={t.name} className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-bold">
                                            {t.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-3">Needs Attention</h4>
                                <div className="flex flex-wrap gap-2">
                                    {data.weakTopics.map(topic => (
                                        <span key={topic} className="px-3 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full text-xs font-bold">
                                            {topic}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Topic Breakdown */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-slate-800/50 p-8 rounded-3xl border border-white/5 shadow-2xl">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-white">Topic Breakdown</h2>
                                <p className="text-slate-400 text-sm mt-1">Based on problems solved across platforms</p>
                            </div>
                            <ChartBarIcon className="w-8 h-8 text-indigo-400" />
                        </div>

                        <div className="space-y-8">
                            {data.topicBreakdown.map(topic => (
                                <div key={topic.name}>
                                    <div className="flex justify-between items-end mb-2">
                                        <div>
                                            <span className="text-white font-bold block">{topic.name}</span>
                                            <span className={`text-[10px] uppercase font-black tracking-widest ${
                                                topic.level === 'Advanced' ? 'text-purple-400' :
                                                topic.level === 'Intermediate' ? 'text-blue-400' :
                                                topic.level === 'Improving' ? 'text-emerald-400' : 'text-slate-500'
                                            }`}>
                                                {topic.level}
                                            </span>
                                        </div>
                                        <span className="text-slate-400 font-mono text-sm">{topic.count} Problems</span>
                                    </div>
                                    <div className="h-3 bg-slate-900 rounded-full overflow-hidden flex shadow-inner border border-white/[0.02]">
                                        <div 
                                            style={{ width: `${topic.score}%` }}
                                            className={`h-full transition-all duration-1000 bg-gradient-to-r ${
                                                topic.level === 'Advanced' ? 'from-indigo-600 to-purple-600' :
                                                topic.level === 'Intermediate' ? 'from-blue-600 to-indigo-600' :
                                                topic.level === 'Improving' ? 'from-emerald-600 to-blue-600' : 'from-slate-700 to-slate-600'
                                            }`}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default TopicAnalysis;
