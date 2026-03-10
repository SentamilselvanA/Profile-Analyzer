export const analyzeTopics = (profiles) => {
  const leetcode = profiles.find(p => p.platform === "leetcode");
  const codeforces = profiles.find(p => p.platform === "codeforces");

  const topics = {};

  // Process LeetCode tagProblemCounts
  if (leetcode && leetcode.rawData?.tagProblemCounts) {
    const { advanced, intermediate, fundamental } = leetcode.rawData.tagProblemCounts;
    [...advanced, ...intermediate, ...fundamental].forEach(tag => {
      topics[tag.tagName] = (topics[tag.tagName] || 0) + tag.problemsSolved;
    });
  }

  // Process Codeforces tags
  if (codeforces && codeforces.tags) {
    Object.entries(codeforces.tags).forEach(([tag, count]) => {
      // Normalize CF tags to LC names where obvious
      let name = tag;
      if (tag === "data structures") name = "Data Structure";
      if (tag === "dp") name = "Dynamic Programming";
      if (tag === "math") name = "Math";
      if (tag === "greedy") name = "Greedy";
      if (tag === "brute force") name = "Brute Force";
      if (tag === "graphs") name = "Graph";

      topics[name] = (topics[name] || 0) + count;
    });
  }

  // Final topic list
  const topicList = Object.entries(topics)
    .map(([name, count]) => ({
      name,
      count,
      level: count > 30 ? "Advanced" : count > 15 ? "Intermediate" : count > 5 ? "Improving" : "Beginner",
      score: Math.min(count * 5, 100)
    }))
    .sort((a, b) => b.count - a.count);

  const strongTopics = topicList.slice(0, 3).filter(t => t.count > 10);
  const weakTopics = ["Recursion", "Dynamic Programming", "Graphs", "Trees", "Sliding Window"]
    .filter(name => !topics[name] || topics[name] < 5)
    .slice(0, 3);

  const recommendations = [];
  if (weakTopics.length > 0) {
    weakTopics.forEach(topic => {
      recommendations.push(`Your ${topic} exposure is low. Focus on medium-level ${topic} problems this week.`);
    });
  } else {
    recommendations.push("Your topic coverage is balanced. Try tackling some Hard problems in your top categories.");
  }

  return {
    topicBreakdown: topicList.slice(0, 15),
    strongTopics,
    weakTopics,
    recommendations,
    summaryInsight: strongTopics.length > 0 
      ? `You are performing well in ${strongTopics.map(t => t.name).join(", ")}. Keep it up!`
      : "Start focusing on core Data Structures like Arrays and Strings to build a foundation."
  };
};
