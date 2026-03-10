import { useState, useEffect } from "react";
import axios from "axios";
import { 
  DocumentChartBarIcon, 
  ArrowPathIcon, 
  CalendarIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  ArrowRightIcon,
  ExclamationCircleIcon
} from "@heroicons/react/24/outline";
import { exportToPdf } from "../utils/exportPdf";

const Reports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("weekly");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/profile/reports`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load reports.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-8">
        <ArrowPathIcon className="w-12 h-12 text-emerald-400 animate-spin mb-4" />
        <h2 className="text-xl font-bold text-slate-200">Generating Your Reports...</h2>
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

  const report = data ? data[activeTab] : null;

  return (
    <div className="min-h-screen pt-32 pb-12 px-4 bg-slate-900">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-extrabold text-white mb-2 flex items-center">
                    <DocumentChartBarIcon className="w-8 h-8 mr-3 text-emerald-400" />
                    Progress Reports
                </h1>
                <p className="text-slate-400">Summarizing your growth milestones over time.</p>
            </div>
            
            {/* Tab Switcher */}
            <div className="flex bg-slate-800 p-1 rounded-xl border border-white/5">
                <button 
                    onClick={() => setActiveTab("weekly")}
                    className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'weekly' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                >
                    Weekly
                </button>
                <button 
                    onClick={() => setActiveTab("monthly")}
                    className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'monthly' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                >
                    Monthly
                </button>
            </div>
        </div>

        {report && (
            <div className="space-y-8" id="report-content">
                {/* Main Highlight Card */}
                <div className={`p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden bg-gradient-to-br ${activeTab === 'weekly' ? 'from-emerald-900/40 to-slate-900' : 'from-indigo-900/40 to-slate-900'}`}>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-6">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${activeTab === 'weekly' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
                                {activeTab} Performance
                            </span>
                            <span className="text-slate-500 text-xs flex items-center">
                                <CalendarIcon className="w-3 h-3 mr-1" />
                                {activeTab === 'weekly' ? 'Last 7 Days' : 'Last 30 Days'}
                            </span>
                        </div>
                        
                        {!report.available ? (
                            <div className="text-center py-12">
                                <SparklesIcon className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold text-slate-300 mb-2">{report.message}</h2>
                                <p className="text-slate-500">Keep using the app to build your snapshot history.</p>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-4xl font-black text-white mb-4 leading-tight">
                                    {report.status}!
                                </h2>
                                <p className="text-xl text-slate-300 mb-8 max-w-2xl">{report.insight}</p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Key Changes</h3>
                                        {report.changes.map((change, i) => (
                                            <div key={i} className="flex items-center text-emerald-400 font-bold">
                                                <ArrowTrendingUpIcon className="w-5 h-5 mr-3" />
                                                {change}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                            <span className="text-[10px] text-slate-500 uppercase font-black block mb-1">Best Area</span>
                                            <span className="text-white font-bold">{report.bestArea}</span>
                                        </div>
                                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                            <span className="text-[10px] text-slate-500 uppercase font-black block mb-1">Needs Attention</span>
                                            <span className="text-white font-bold">{report.needsAttention}</span>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Suggestions Section */}
                {report.available && (
                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5 shadow-xl">
                        <div className="flex items-center mb-6">
                            <SparklesIcon className="w-6 h-6 text-amber-400 mr-2" />
                            <h3 className="text-lg font-bold text-white">Next Step Suggestions</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center p-4 bg-slate-900/50 rounded-xl group cursor-pointer hover:bg-emerald-900/20 transition-all border border-transparent hover:border-emerald-500/30">
                                <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center mr-4">
                                    <ArrowRightIcon className="w-5 h-5 text-emerald-400" />
                                </div>
                                <span className="text-slate-300 group-hover:text-white transition-colors">Start a new Hard problem in DP</span>
                            </div>
                            <div className="flex items-center p-4 bg-slate-900/50 rounded-xl group cursor-pointer hover:bg-indigo-900/20 transition-all border border-transparent hover:border-indigo-500/30">
                                <div className="w-10 h-10 bg-indigo-500/10 rounded-full flex items-center justify-center mr-4">
                                    <ArrowRightIcon className="w-5 h-5 text-indigo-400" />
                                </div>
                                <span className="text-slate-300 group-hover:text-white transition-colors">Schedule a mock contest this weekend</span>
                            </div>
                        </div>
                    </div>
                )}

                 {/* Export Section */}
                <div className="flex justify-between items-center py-8 border-t border-white/5">
                    <p className="text-slate-500 text-sm italic">Report generated based on {data.metadata?.totalSnapshots} historical snapshots.</p>
                    <button 
                        onClick={() => exportToPdf('report-content', `${activeTab}-progress-report.pdf`)}
                        className="flex items-center px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-xl transition-all shadow-xl"
                    >
                        <DocumentChartBarIcon className="w-5 h-5 mr-2" />
                        Export Report as PDF
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
