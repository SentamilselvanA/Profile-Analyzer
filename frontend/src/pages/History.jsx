import { useState, useEffect } from "react";
import axios from "axios";
import { ArrowPathIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import GrowthSummary from "../components/GrowthSummary";
import HistoryCharts from "../components/HistoryCharts";
import ActivityTimeline from "../components/ActivityTimeline";

const History = () => {
  const [historyData, setHistoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

      const res = await axios.get(`${API_URL}/api/profile/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setHistoryData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load history.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-8">
        <ArrowPathIcon className="w-12 h-12 text-cyan-400 animate-spin mb-4" />
        <h2 className="text-xl font-bold text-slate-200">Loading History Data...</h2>
        <p className="text-slate-400 mt-2">Analyzing your coding journey...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-8">
        <div className="bg-rose-500/10 p-6 rounded-2xl border border-rose-500/20 max-w-md text-center backdrop-blur-md">
          <ExclamationTriangleIcon className="w-12 h-12 text-rose-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-rose-400 mb-2">Error Loading History</h2>
          <p className="text-slate-300 mb-6">{error}</p>
          <button
            onClick={fetchHistory}
            className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-white/10"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-4 lg:p-8 pt-32">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-lg mb-2">
          Your Coding Journey
        </h1>
        <p className="text-slate-400 text-lg">
          Track your progress, identify trends, and analyze your historic growth over time.
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        {historyData && (
          <>
            {/* Summary Cards */}
            <GrowthSummary summary={historyData.summary} labels={historyData.labels} />

            {/* Line Charts */}
            <HistoryCharts 
              leetcode={historyData.leetcode} 
              codeforces={historyData.codeforces} 
              github={historyData.github} 
            />

            {/* Timeline Row */}
            <div className="flex justify-center w-full max-w-4xl mx-auto">
                <ActivityTimeline timeline={historyData.timeline} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default History;
