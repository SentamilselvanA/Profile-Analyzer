/**
 * Consistency Score Calculator
 * Calculates overall coding consistency score based on profile analysis
 */

export const calculateConsistencyScore = (profiles, individualScores) => {
  let totalScore = 0;
  let maxPossibleScore = 0;
  const connectedPlatforms = profiles.length;

  // Platform connection bonus
  if (connectedPlatforms >= 3) {
    totalScore += 15;
    maxPossibleScore += 15;
  } else if (connectedPlatforms === 2) {
    totalScore += 10;
    maxPossibleScore += 15;
  } else if (connectedPlatforms === 1) {
    totalScore += 5;
    maxPossibleScore += 15;
  }

  // Individual platform scores
  profiles.forEach(profile => {
    const platformScore = individualScores[profile.platform] || 0;
    totalScore += platformScore;

    // Max possible per platform
    if (profile.platform === 'leetcode') maxPossibleScore += 40;
    if (profile.platform === 'codeforces') maxPossibleScore += 40;
    if (profile.platform === 'github') maxPossibleScore += 40;
  });

  // Balance bonus (having activity across multiple platforms)
  const activePlatforms = profiles.filter(p => {
    if (p.platform === 'leetcode') return p.totalSolved >= 50;
    if (p.platform === 'codeforces') return p.totalSolved >= 30 || p.rating >= 1000;
    if (p.platform === 'github') return p.repos >= 3;
    return false;
  }).length;

  if (activePlatforms >= 3) {
    totalScore += 10;
    maxPossibleScore += 10;
  } else if (activePlatforms === 2) {
    totalScore += 5;
    maxPossibleScore += 10;
  }

  // Calculate percentage
  const percentage = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;

  // Ensure score is between 0-100
  const finalScore = Math.max(0, Math.min(100, percentage));

  return {
    score: finalScore,
    breakdown: {
      platformConnection: connectedPlatforms >= 2 ? 10 : 5,
      individualPerformance: totalScore - (connectedPlatforms >= 2 ? 10 : 5) - (activePlatforms >= 2 ? 5 : 0),
      balanceBonus: activePlatforms >= 2 ? 5 : 0
    },
    level: getConsistencyLevel(finalScore)
  };
};

const getConsistencyLevel = (score) => {
  if (score >= 85) return "Exceptional Consistency";
  if (score >= 75) return "Strong Consistency";
  if (score >= 65) return "Good Consistency";
  if (score >= 50) return "Developing Consistency";
  if (score >= 35) return "Building Consistency";
  if (score >= 20) return "Early Stage";
  return "Getting Started";
};