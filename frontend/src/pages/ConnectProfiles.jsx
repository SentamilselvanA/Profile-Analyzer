import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from '../context/ThemeContext';
import api from "../api/axios";
import {
  CodeBracketIcon,
  CpuChipIcon,
  CommandLineIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const ConnectProfiles = () => {
  const [form, setForm] = useState({
    leetcodeUsername: "",
    codeforcesUsername: "",
    githubUsername: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [connected, setConnected] = useState({
    leetcode: false,
    codeforces: false,
    github: false
  });
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveAndAnalyze = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.put("/profile/usernames", form);
      await api.post("/profile/refresh");

      // Mark all as connected for visual feedback
      setConnected({
        leetcode: !!form.leetcodeUsername,
        codeforces: !!form.codeforcesUsername,
        github: !!form.githubUsername
      });

      // Navigate after a short delay to show success state
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save profiles");
    } finally {
      setIsLoading(false);
    }
  };

  const platforms = [
    {
      key: 'leetcode',
      name: 'LeetCode',
      icon: CodeBracketIcon,
      color: 'from-orange-500 to-red-500',
      field: 'leetcodeUsername',
      placeholder: 'Enter your LeetCode username',
      description: 'Algorithm and data structure problems'
    },
    {
      key: 'codeforces',
      name: 'Codeforces',
      icon: CpuChipIcon,
      color: 'from-blue-500 to-cyan-500',
      field: 'codeforcesUsername',
      placeholder: 'Enter your Codeforces handle',
      description: 'Competitive programming contests'
    },
    {
      key: 'github',
      name: 'GitHub',
      icon: CommandLineIcon,
      color: 'from-gray-700 to-gray-900',
      field: 'githubUsername',
      placeholder: 'Enter your GitHub username',
      description: 'Code repositories and contributions'
    }
  ];

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-violet-500 bg-clip-text text-transparent mb-4 hover:scale-105 transition-transform duration-200 cursor-pointer">
            Connect Your Profiles
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
            Link your coding platforms to unlock comprehensive analytics and insights into your programming journey
          </p>
        </div>

        {/* Platform Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {platforms.map((platform) => {
            const Icon = platform.icon;
            const isConnected = connected[platform.key];

            return (
              <div
                key={platform.key}
                className={`relative stat-card group ${isConnected ? 'ring-2 ring-green-500' : ''}`}
              >
                {/* Platform Icon */}
                <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${platform.color} rounded-xl mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Platform Info */}
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  {platform.name}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  {platform.description}
                </p>

                {/* Input Field */}
                <div className="relative">
                  <input
                    type="text"
                    name={platform.field}
                    value={form[platform.field]}
                    onChange={handleChange}
                    className="input-field"
                    placeholder={platform.placeholder}
                  />
                  {isConnected && (
                    <CheckCircleIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                  )}
                </div>

                {/* Connection Status */}
                {isConnected && (
                  <div className="mt-3 flex items-center text-green-500 text-sm font-medium">
                    <CheckCircleIcon className="w-4 h-4 mr-1" />
                    Connected
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="text-center">
          <button
            onClick={saveAndAnalyze}
            disabled={isLoading}
            className="btn-primary text-lg px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-3">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Analyzing Profiles...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-3">
                <span>Save and Analyze</span>
                <ArrowRightIcon className="w-5 h-5" />
              </div>
            )}
          </button>
        </div>

        {/* Footer Text */}
        <div className="text-center mt-8">
          <p className="text-slate-500 dark:text-slate-400">
            Your data is securely stored and analyzed to provide personalized insights
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConnectProfiles;