import PlatformSnapshot from "../models/PlatformSnapshot.js";

export const generateReports = async (userId) => {
  const snapshots = await PlatformSnapshot.find({ userId }).sort({ capturedAt: 1 });
  
  if (snapshots.length < 2) {
      return { 
          weekly: { available: false, message: "Not enough history to generate a weekly report." },
          monthly: { available: false, message: "Not enough history to generate a monthly report." }
      };
  }

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const latestSnapshots = {};
  const snapshots7dAgo = {};
  const snapshots30dAgo = {};

  // Group latest snapshots per platform
  snapshots.forEach(s => {
      latestSnapshots[s.platform] = s;
      if (s.capturedAt <= sevenDaysAgo) snapshots7dAgo[s.platform] = s;
      if (s.capturedAt <= thirtyDaysAgo) snapshots30dAgo[s.platform] = s;
  });

  const generatePeriodReport = (periodSnapshots, label) => {
    const changes = [];
    let growthScore = 0;

    Object.keys(latestSnapshots).forEach(platform => {
        const latest = latestSnapshots[platform];
        const old = periodSnapshots[platform];

        if (!old) return;

        if (platform === "leetcode") {
            const diff = latest.totalSolved - old.totalSolved;
            if (diff > 0) {
                changes.push(`${diff} new LeetCode problems solved`);
                growthScore += diff * 2;
            }
        } else if (platform === "codeforces") {
            const diff = latest.rating - old.rating;
            if (diff !== 0) {
                changes.push(`${diff > 0 ? '+' : ''}${diff} Codeforces rating change`);
                growthScore += diff;
            }
        } else if (platform === "github") {
            const diff = latest.repos - old.repos;
            if (diff > 0) {
                changes.push(`${diff} new GitHub repositories`);
                growthScore += diff * 5;
            }
        }
    });

    if (changes.length === 0) {
        return { 
            available: true, 
            status: "Stable", 
            changes: ["No significant changes in this period."],
            insight: "Your profile stats have remained consistent. Consider setting a new practice goal!",
            bestArea: "None",
            needsAttention: "Overall Activity"
        };
    }

    return {
        available: true,
        status: growthScore > 50 ? "High Momentum" : growthScore > 20 ? "Good Progress" : "Steady Growth",
        changes,
        insight: growthScore > 30 
                 ? "You've had a very productive period! Your consistency is paying off." 
                 : "You're making steady progress. Keep the momentum going!",
        bestArea: growthScore > 0 ? "Problem Solving" : "Consistent Practice",
        needsAttention: "Hard Difficulty Problems"
    };
  };

  return {
    weekly: generatePeriodReport(snapshots7dAgo, "Weekly"),
    monthly: generatePeriodReport(snapshots30dAgo, "Monthly"),
    metadata: {
        totalSnapshots: snapshots.length,
        firstSnapshotDate: snapshots[0].capturedAt,
        lastSnapshotDate: snapshots[snapshots.length - 1].capturedAt
    }
  };
};
