import PlatformSnapshot from "../models/PlatformSnapshot.js";

export const getHistoryData = async (userId) => {
  const snapshots = await PlatformSnapshot.find({ userId }).sort({ capturedAt: 1 });
  
  // Group by platform
  const leetcode = snapshots.filter(s => s.platform === "leetcode");
  const codeforces = snapshots.filter(s => s.platform === "codeforces");
  const github = snapshots.filter(s => s.platform === "github");
  
  // Calculate summary and trends
  const summary = calculateSummary(leetcode, codeforces, github);
  
  // Create timeline
  const timeline = createTimeline(snapshots);
  
  const labels = detectTrendsLabels(leetcode, codeforces, github);
  
  return {
    leetcode,
    codeforces,
    github,
    summary,
    timeline,
    labels,
  };
};

const calculateSummary = (leetcode, codeforces, github) => {
  const summary = [];
  
  if (leetcode.length >= 2) {
    const latest = leetcode[leetcode.length - 1];
    const prev = leetcode[leetcode.length - 2];
    const diff = latest.totalSolved - prev.totalSolved;
    if (diff > 0) summary.push(`+${diff} LeetCode problems solved since last update`);
  }
  
  if (codeforces.length >= 2) {
    const latest = codeforces[codeforces.length - 1];
    const prev = codeforces[codeforces.length - 2];
    const diff = latest.rating - prev.rating;
    if (diff > 0) summary.push(`+${diff} Codeforces rating`);
    else if (diff < 0) summary.push(`${diff} Codeforces rating`);
  }
  
  if (github.length >= 2) {
    const latest = github[github.length - 1];
    const prev = github[github.length - 2];
    const diff = latest.repos - prev.repos;
    if (diff > 0) summary.push(`+${diff} GitHub repositories added`);
    
    const contribDiff = latest.contributions - prev.contributions;
    if (contribDiff > 0) summary.push(`+${contribDiff} GitHub contributions`);
  }

  if (summary.length === 0) {
     summary.push("No recent changes detected.");
  }
  
  return summary;
};

const createTimeline = (snapshots) => {
  const timeline = [];
  // Sort descending for timeline
  const sorted = [...snapshots].sort((a, b) => b.capturedAt - a.capturedAt);
  
  for (let i = 0; i < sorted.length; i++) {
    const s = sorted[i];
    const date = new Date(s.capturedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    // We only want to add to timeline if it changed from previous snapshot of same platform
    let changed = true;
    // Find the previous snapshot of the same platform
    const previousOfPlatform = sorted.slice(i + 1).find(prev => prev.platform === s.platform);
    
    if (previousOfPlatform) {
       if (s.platform === "leetcode" && s.totalSolved === previousOfPlatform.totalSolved) changed = false;
       if (s.platform === "codeforces" && s.rating === previousOfPlatform.rating) changed = false;
       if (s.platform === "github" && s.repos === previousOfPlatform.repos) changed = false;
    }

    if (changed) {
        if (s.platform === "leetcode") {
        timeline.push({ id: s._id, date, title: `LeetCode solved count reached ${s.totalSolved}` });
        } else if (s.platform === "codeforces") {
        timeline.push({ id: s._id, date, title: `Codeforces rating updated to ${s.rating || 0}` });
        } else if (s.platform === "github") {
        timeline.push({ id: s._id, date, title: `GitHub repositories count at ${s.repos}` });
        }
    }
  }
  
  // Return top unique activity
  return timeline.slice(0, 15);
};

const detectTrendsLabels = (leetcode, codeforces, github) => {
  const labels = [];

  // LeetCode Trend
  if (leetcode.length >= 3) {
    const last3 = leetcode.slice(-3);
    const growth = (last3[2].totalSolved - last3[0].totalSolved);
    if (growth > 10) labels.push({ text: "Improving Steadily", type: "success" });
    else if (growth === 0) labels.push({ text: "Inactive recently", type: "warning" });
  } else if (leetcode.length > 0) {
      labels.push({ text: "Started Tracking", type: "info" });
  }
  
  // Codeforces Trend
  if (codeforces.length >= 2) {
    const last2 = codeforces.slice(-2);
    const growth = (last2[1].rating - last2[0].rating);
    if (growth > 20) labels.push({ text: "Strong Momentum", type: "success" });
    else if (growth < 0) labels.push({ text: "Needs Attention", type: "danger" });
    else if (growth === 0) labels.push({ text: "Stable", type: "info" });
  }
  
  return labels;
};
