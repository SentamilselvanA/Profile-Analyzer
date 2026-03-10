import { fetchLeetCodeProfile } from "./leetcodeService.js";
import { fetchCodeforcesProfile } from "./codeforcesService.js";
import { fetchGitHubProfile } from "./githubService.js";

export const compareTwoProfiles = async (userAData, userBData) => {
  const fetchProfile = async (platform, username) => {
    if (!username) return null;
    try {
      if (platform === "leetcode") return await fetchLeetCodeProfile(username);
      if (platform === "codeforces") return await fetchCodeforcesProfile(username);
      if (platform === "github") return await fetchGitHubProfile(username);
    } catch (error) {
      console.error(`Failed to fetch ${platform} for ${username}:`, error.message);
      return null;
    }
    return null;
  };

  const getProfilePair = async (platform, userAName, userBName) => {
    const [pA, pB] = await Promise.all([
      fetchProfile(platform, userAName),
      fetchProfile(platform, userBName)
    ]);
    return { platform, userA: pA, userB: pB };
  };

  const comparisons = await Promise.all([
    getProfilePair("leetcode", userAData.leetcode, userBData.leetcode),
    getProfilePair("codeforces", userAData.codeforces, userBData.codeforces),
    getProfilePair("github", userAData.github, userBData.github)
  ]);

  const results = {
    platforms: {},
    overall: {
      winner: null,
      winnerName: null,
      insights: []
    }
  };

  let scoreA = 0;
  let scoreB = 0;

  comparisons.forEach(({ platform, userA, userB }) => {
    if (!userA || !userB) {
      results.platforms[platform] = { available: false };
      return;
    }

    const comparison = {
      available: true,
      userA: { username: userA.username },
      userB: { username: userB.username },
      metrics: [],
      winner: null
    };

    let pA = 0;
    let pB = 0;

    if (platform === "leetcode") {
      const metrics = [
        { label: "Total Solved", valA: userA.totalSolved, valB: userB.totalSolved },
        { label: "Easy Solved", valA: userA.easySolved, valB: userB.easySolved },
        { label: "Medium Solved", valA: userA.mediumSolved, valB: userB.mediumSolved },
        { label: "Hard Solved", valA: userA.hardSolved, valB: userB.hardSolved }
      ];
      comparison.metrics = metrics;
      metrics.forEach(m => {
        if (m.valA > m.valB) pA++;
        else if (m.valB > m.valA) pB++;
      });
    } else if (platform === "codeforces") {
      const metrics = [
        { label: "Rating", valA: userA.rating, valB: userB.rating },
        { label: "Total Solved", valA: userA.totalSolved, valB: userB.totalSolved }
      ];
      comparison.metrics = metrics;
      metrics.forEach(m => {
        if (m.valA > m.valB) pA++;
        else if (m.valB > m.valA) pB++;
      });
    } else if (platform === "github") {
      const metrics = [
        { label: "Repositories", valA: userA.repos, valB: userB.repos },
        { label: "Followers", valA: userA.followers, valB: userB.followers }
      ];
      comparison.metrics = metrics;
      metrics.forEach(m => {
        if (m.valA > m.valB) pA++;
        else if (m.valB > m.valA) pB++;
      });
    }

    if (pA > pB) {
      comparison.winner = "userA";
      scoreA++;
    } else if (pB > pA) {
      comparison.winner = "userB";
      scoreB++;
    } else {
      comparison.winner = "draw";
    }

    results.platforms[platform] = comparison;
  });

  if (scoreA > scoreB) {
    results.overall.winner = "userA";
    results.overall.winnerName = userAData.name || "User A";
  } else if (scoreB > scoreA) {
    results.overall.winner = "userB";
    results.overall.winnerName = userBData.name || "User B";
  } else {
    results.overall.winner = "draw";
  }

  // Generate rule-based insights
  if (results.platforms.leetcode.available) {
    const lc = results.platforms.leetcode;
    if (lc.winner === "userA") results.overall.insights.push(`${userAData.name || "User A"} is stronger in LeetCode problem solving.`);
    else if (lc.winner === "userB") results.overall.insights.push(`${userBData.name || "User B"} leads in LeetCode algorithmic practice.`);
  }

  if (results.platforms.codeforces.available) {
    const cf = results.platforms.codeforces;
    if (cf.winner === "userA") results.overall.insights.push(`${userAData.name || "User A"} has a higher competitive programming edge.`);
    else if (cf.winner === "userB") results.overall.insights.push(`${userBData.name || "User B"} shows stronger contest performance.`);
  }

  if (results.platforms.github.available) {
    const gh = results.platforms.github;
    if (gh.winner === "userA") results.overall.insights.push(`${userAData.name || "User A"} has a more active development profile.`);
    else if (gh.winner === "userB") results.overall.insights.push(`${userBData.name || "User B"} leads in open-source presence.`);
  }

  return results;
};
