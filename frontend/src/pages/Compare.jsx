import { useState, useEffect } from "react";
import axios from "axios";
import { 
  UsersIcon, 
  ArrowPathIcon, 
  TrophyIcon,
  UserCircleIcon,
  ChartPieIcon,
  BoltIcon
} from "@heroicons/react/24/outline";
import { exportToPdf } from "../utils/exportPdf";

const Compare = () => {
  const [userA, setUserA] = useState({ name: "You", leetcode: "", codeforces: "", github: "" });
  const [userB, setUserB] = useState({ name: "Competitor", leetcode: "", codeforces: "", github: "" });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    // Optionally pre-fill userA with own data
    const fetchMyData = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${API_URL}/api/profile/dashboard`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const profiles = res.data.profiles || [];
            const lc = profiles.find(p => p.platform === "leetcode")?.username || "";
            const cf = profiles.find(p => p.platform === "codeforces")?.username || "";
            const gh = profiles.find(p => p.platform === "github")?.username || "";
            setUserA(prev => ({ ...prev, leetcode: lc, codeforces: cf, github: gh }));
        } catch (err) {
            console.error("Failed to fetch own profiles for comparison pre-fill");
        }
    };
    fetchMyData();
  }, []);

  const handleCompare = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${API_URL}/api/profile/compare`, 
        { userA, userB },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResults(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Comparison failed. Please check the usernames.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-4 lg:p-8 pt-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600 mb-2">
            Compare Coding Profiles
          </h1>
          <p className="text-slate-400">Benchmarking performance across LeetCode, Codeforces, and GitHub</p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleCompare} className="bg-slate-800/50 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-xl mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* User A Column */}
            <div className="space-y-4">
              <h3 className="flex items-center text-lg font-bold text-blue-400 mb-4">
                <UserCircleIcon className="w-6 h-6 mr-2" /> User A (Main)
              </h3>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Display Name</label>
                <input 
                  type="text" value={userA.name} 
                  onChange={e => setUserA({...userA, name: e.target.value})}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <input placeholder="LeetCode" type="text" value={userA.leetcode} onChange={e => setUserA({...userA, leetcode: e.target.value})} className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs" />
                <input placeholder="Codeforces" type="text" value={userA.codeforces} onChange={e => setUserA({...userA, codeforces: e.target.value})} className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs" />
                <input placeholder="GitHub" type="text" value={userA.github} onChange={e => setUserA({...userA, github: e.target.value})} className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs" />
              </div>
            </div>

            {/* User B Column */}
            <div className="space-y-4">
              <h3 className="flex items-center text-lg font-bold text-rose-400 mb-4">
                <UsersIcon className="w-6 h-6 mr-2" /> User B (Competitor)
              </h3>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Display Name</label>
                <input 
                  type="text" value={userB.name} 
                  onChange={e => setUserB({...userB, name: e.target.value})}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-rose-500 outline-none"
                />
              </div>
               <div className="grid grid-cols-3 gap-2">
                <input placeholder="LeetCode" type="text" value={userB.leetcode} onChange={e => setUserB({...userB, leetcode: e.target.value})} className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs" />
                <input placeholder="Codeforces" type="text" value={userB.codeforces} onChange={e => setUserB({...userB, codeforces: e.target.value})} className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs" />
                <input placeholder="GitHub" type="text" value={userB.github} onChange={e => setUserB({...userB, github: e.target.value})} className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs" />
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button 
              disabled={loading}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center"
            >
              {loading ? (
                <><ArrowPathIcon className="w-5 h-5 mr-2 animate-spin" /> Comparing...</>
              ) : (
                <><BoltIcon className="w-5 h-5 mr-2" /> Run Comparison</>
              )}
            </button>
          </div>
        </form>

        {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl text-rose-400 text-center mb-8">
                {error}
            </div>
        )}

        {/* Results Section */}
        {results && (
          <div className="space-y-8 animate-in fade-in duration-700" id="comparison-results">
            {/* Overall Summary Card */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <TrophyIcon className="w-32 h-32 text-amber-400" />
                </div>
                <div className="relative z-10">
                    <h2 className="text-2xl font-bold text-white mb-4">Overall Verdict</h2>
                    <div className="flex items-center mb-6">
                        {results.overall.winner === 'draw' ? (
                            <span className="text-3xl font-black text-amber-400">It's a Balanced Tie!</span>
                        ) : (
                            <>
                                <span className="text-3xl font-black text-emerald-400 mr-4">{results.overall.winnerName} Leads!</span>
                                <div className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-xs font-bold text-emerald-400 uppercase tracking-widest">🏆 Global Winner</div>
                            </>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {results.overall.insights.map((insight, i) => (
                            <div key={i} className="flex items-start bg-white/5 p-4 rounded-xl border border-white/5">
                                < BoltIcon className="w-5 h-5 text-indigo-400 mr-3 mt-1" />
                                <p className="text-slate-300">{insight}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Platform Comparison Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {Object.entries(results.platforms).map(([platform, data]) => {
                if (!data.available) return null;
                return (
                  <div key={platform} className="bg-slate-800/50 p-6 rounded-2xl border border-white/5 shadow-xl">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-white capitalize">{platform}</h3>
                        {data.winner !== 'draw' && (
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter ${data.winner === 'userA' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
                                {data.winner === 'userA' ? userA.name : userB.name} Edge
                            </span>
                        )}
                    </div>
                    <div className="space-y-6">
                        {data.metrics.map((m, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-xs text-slate-400 mb-2">
                                    <span>{m.label}</span>
                                    <span className="font-mono">{m.valA} vs {m.valB}</span>
                                </div>
                                <div className="flex h-2 bg-slate-900 rounded-full overflow-hidden">
                                    <div 
                                        style={{ width: `${(m.valA / (m.valA + m.valB || 1)) * 100}%` }}
                                        className="bg-blue-500 transition-all duration-1000"
                                    ></div>
                                    <div 
                                        style={{ width: `${(m.valB / (m.valA + m.valB || 1)) * 100}%` }}
                                        className="bg-rose-500 transition-all duration-1000"
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Action Section */}
             <div className="bg-indigo-600/10 border border-indigo-500/20 p-8 rounded-3xl text-center">
                <h3 className="text-xl font-bold text-white mb-2">Ready to improve your edge?</h3>
                <p className="text-slate-400 mb-6 font-medium">Use the Topic Analysis section to find where you can bridge the gap.</p>
                <div className="flex justify-center gap-4">
                    <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-500">Go to Analysis</button>
                    <button 
                        onClick={() => exportToPdf('comparison-results', 'comparison-report.pdf')}
                        className="px-6 py-2 bg-slate-800 text-slate-300 rounded-lg border border-white/10 hover:bg-slate-700"
                    >
                        Download Comparison PDF
                    </button>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Compare;
