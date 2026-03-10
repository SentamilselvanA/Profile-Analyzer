/**
 * Suggestion Service
 * Generates personalized, actionable suggestions based on profile analysis
 */

export const generateSuggestions = (profiles, analysis) => {
  const suggestions = {
    immediate: [], // High priority, actionable within 1-2 weeks
    shortTerm: [], // Medium priority, actionable within 1-2 months
    longTerm: []   // Strategic goals, 3-6 months
  };

  const leetcode = profiles.find(p => p.platform === 'leetcode');
  const codeforces = profiles.find(p => p.platform === 'codeforces');
  const github = profiles.find(p => p.platform === 'github');

  const connectedPlatforms = profiles.length;
  const totalSolved = profiles.reduce((sum, p) => sum + (p.totalSolved || 0), 0);

  // Platform Connection Suggestions
  if (connectedPlatforms < 3) {
    suggestions.immediate.push("Connect all three major platforms (LeetCode, Codeforces, GitHub) for comprehensive analysis");

    if (!leetcode) {
      suggestions.immediate.push("Create LeetCode account and start with easy problems");
    }
    if (!codeforces) {
      suggestions.immediate.push("Set up Codeforces profile for competitive programming practice");
    }
    if (!github) {
      suggestions.immediate.push("Create GitHub account and push your first project");
    }
  }

  // LeetCode-specific suggestions
  if (leetcode) {
    const { totalSolved: lcSolved, easySolved, mediumSolved, hardSolved } = leetcode;

    if (lcSolved < 100) {
      suggestions.immediate.push("Solve 5 LeetCode problems daily for the next 2 weeks");
      suggestions.shortTerm.push("Reach 100 total solved problems within 1 month");
    } else if (lcSolved < 300) {
      suggestions.immediate.push("Maintain 3-4 problems per day solving streak");
      suggestions.shortTerm.push("Focus on medium difficulty problems (aim for 40% of practice)");
    }

    if (hardSolved < 10 && lcSolved > 50) {
      suggestions.immediate.push("Solve 1 hard problem per week to build advanced skills");
    }

    if (mediumSolved < lcSolved * 0.3) {
      suggestions.shortTerm.push("Increase medium problem ratio to 30-40% of your practice");
    }

    suggestions.longTerm.push("Master one algorithm category per month (Arrays, DP, Graphs, etc.)");
  }

  // Codeforces-specific suggestions
  if (codeforces) {
    const { rating, totalSolved: cfSolved } = codeforces;

    if (!rating || rating < 1000) {
      suggestions.immediate.push("Participate in Div. 4 contests every weekend");
      suggestions.shortTerm.push("Reach 1000+ rating within 2-3 months of consistent practice");
    } else if (rating < 1200) {
      suggestions.immediate.push("Join Div. 3 contests regularly (2-3 per month)");
      suggestions.shortTerm.push("Focus on implementation speed and basic algorithms");
    } else if (rating < 1500) {
      suggestions.immediate.push("Try Div. 2 contests and study advanced topics");
      suggestions.shortTerm.push("Practice binary search, greedy, and graph algorithms");
    }

    if (cfSolved < 50) {
      suggestions.immediate.push("Solve 20+ Codeforces problems per week");
    }

    suggestions.longTerm.push("Achieve Specialist rating (1400+) through consistent contest participation");
  }

  // GitHub-specific suggestions
  if (github) {
    const { repos, followers } = github;

    if (repos < 3) {
      suggestions.immediate.push("Complete and push 2 personal projects in the next month");
      suggestions.shortTerm.push("Build projects in different technologies (Web, Mobile, Data Science)");
    } else if (repos < 10) {
      suggestions.immediate.push("Add comprehensive README files to existing projects");
      suggestions.shortTerm.push("Pin your 3 best projects on your GitHub profile");
    }

    if (followers < 10 && repos >= 3) {
      suggestions.immediate.push("Share your projects on LinkedIn and developer communities");
      suggestions.shortTerm.push("Contribute to 2-3 open source projects");
    }

    suggestions.longTerm.push("Build a portfolio website showcasing your best projects");
  }

  // Cross-platform suggestions
  if (connectedPlatforms >= 2) {
    if (totalSolved < 200) {
      suggestions.immediate.push("Maintain daily coding practice across all connected platforms");
    }

    suggestions.shortTerm.push("Balance your time: 60% problem solving, 30% projects, 10% contests");
    suggestions.longTerm.push("Develop expertise in one area while maintaining broad skills");
  }

  // Consistency-based suggestions
  const consistencyScore = analysis.consistencyScore || 0;

  if (consistencyScore < 50) {
    suggestions.immediate.push("Establish a daily coding routine (minimum 1 hour per day)");
    suggestions.shortTerm.push("Track your coding activity and set weekly goals");
  } else if (consistencyScore < 70) {
    suggestions.immediate.push("Increase coding frequency to 5-6 days per week");
    suggestions.shortTerm.push("Set specific, measurable weekly targets");
  }

  // Remove duplicates and limit suggestions
  Object.keys(suggestions).forEach(key => {
    suggestions[key] = [...new Set(suggestions[key])].slice(0, 3);
  });

  return suggestions;
};