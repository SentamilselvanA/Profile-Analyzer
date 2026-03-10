/**
 * Final Analysis Service
 * Combines all individual analyses into comprehensive insights
 */

import { analyzeLeetCodeProfile } from './analyzeLeetCode.js';
import { analyzeCodeforcesProfile } from './analyzeCodeforces.js';
import { analyzeGitHubProfile } from './analyzeGitHub.js';
import { calculateConsistencyScore } from './scoreCalculator.js';
import { generateUserClassification } from './classificationService.js';
import { generateSuggestions } from './suggestionService.js';

export const generateComprehensiveAnalysis = (profiles) => {
  // Individual platform analyses
  const leetcodeAnalysis = analyzeLeetCodeProfile(profiles.find(p => p.platform === 'leetcode'));
  const codeforcesAnalysis = analyzeCodeforcesProfile(profiles.find(p => p.platform === 'codeforces'));
  const githubAnalysis = analyzeGitHubProfile(profiles.find(p => p.platform === 'github'));

  // Combine individual scores
  const individualScores = {
    leetcode: leetcodeAnalysis.score,
    codeforces: codeforcesAnalysis.score,
    github: githubAnalysis.score
  };

  // Calculate overall consistency score
  const consistencyData = calculateConsistencyScore(profiles, individualScores);

  // Combine all insights
  const allStrengths = [
    ...leetcodeAnalysis.strengths,
    ...codeforcesAnalysis.strengths,
    ...githubAnalysis.strengths
  ].filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates

  const allWeaknesses = [
    ...leetcodeAnalysis.weaknesses,
    ...codeforcesAnalysis.weaknesses,
    ...githubAnalysis.weaknesses
  ].filter((value, index, self) => self.indexOf(value) === index);

  // Generate user classification
  const classification = generateUserClassification(profiles, { consistencyScore: consistencyData.score });

  // Generate personalized suggestions
  const suggestions = generateSuggestions(profiles, { consistencyScore: consistencyData.score });

  // Platform balance analysis
  const platformBalanceInsight = analyzePlatformBalance(profiles);

  // Growth readiness assessment
  const growthReadiness = assessGrowthReadiness(profiles, consistencyData.score, allStrengths.length, allWeaknesses.length);

  return {
    // Core analysis
    strengths: allStrengths.length > 0 ? allStrengths : ["You're building a solid coding foundation"],
    weaknesses: allWeaknesses.length > 0 ? allWeaknesses : ["Keep pushing forward with consistent practice"],
    suggestions,

    // Advanced insights
    consistencyScore: consistencyData.score,
    consistencyLevel: consistencyData.level,
    classification,
    platformBalance,
    growthReadiness,

    // Platform-specific insights
    difficultyInsight: leetcodeAnalysis.difficultyInsight,
    contestInsight: codeforcesAnalysis.contestInsight,
    githubInsight: githubAnalysis.githubInsight,

    // Metadata
    analyzedAt: new Date(),
    platformsAnalyzed: profiles.length,
    dataCompleteness: calculateDataCompleteness(profiles)
  };
};

const analyzePlatformBalance = (profiles) => {
  const connectedPlatforms = profiles.length;

  if (connectedPlatforms === 1) {
    return "Single-platform focus - consider expanding to multiple coding platforms for well-rounded development";
  }

  if (connectedPlatforms === 2) {
    const hasProblemSolving = profiles.some(p => p.platform === 'leetcode');
    const hasCompetitive = profiles.some(p => p.platform === 'codeforces');
    const hasDevelopment = profiles.some(p => p.platform === 'github');

    if (hasProblemSolving && hasCompetitive) {
      return "Strong focus on problem-solving and contests - add development projects for balance";
    } else if (hasProblemSolving && hasDevelopment) {
      return "Good balance between practice and projects - consider adding competitive programming";
    } else if (hasCompetitive && hasDevelopment) {
      return "Contest and development focus - add structured problem-solving practice";
    }
  }

  if (connectedPlatforms === 3) {
    // Check activity balance
    const leetcode = profiles.find(p => p.platform === 'leetcode');
    const codeforces = profiles.find(p => p.platform === 'codeforces');
    const github = profiles.find(p => p.platform === 'github');

    const problemSolvingActive = leetcode && leetcode.totalSolved >= 100;
    const competitiveActive = codeforces && (codeforces.rating >= 1200 || codeforces.totalSolved >= 100);
    const developmentActive = github && github.repos >= 5;

    const activePlatforms = [problemSolvingActive, competitiveActive, developmentActive].filter(Boolean).length;

    if (activePlatforms === 3) {
      return "Excellent balance across problem-solving, competitive programming, and development";
    } else if (activePlatforms === 2) {
      return "Good balance in most areas - focus on strengthening the remaining activity type";
    } else {
      return "Platform balance needs improvement - increase activity across all connected platforms";
    }
  }

  return "Connect multiple platforms to get personalized balance insights";
};

const assessGrowthReadiness = (profiles, consistencyScore, strengthCount, weaknessCount) => {
  let readinessScore = 0;
  let level = '';
  let factors = [];

  // Consistency factor (40% weight)
  if (consistencyScore >= 80) {
    readinessScore += 40;
    factors.push("Exceptional consistency foundation");
  } else if (consistencyScore >= 60) {
    readinessScore += 30;
    factors.push("Strong consistency patterns");
  } else if (consistencyScore >= 40) {
    readinessScore += 20;
    factors.push("Developing consistency");
  } else {
    readinessScore += 10;
    factors.push("Building consistency habits");
  }

  // Platform diversity (30% weight)
  const platforms = profiles.length;
  if (platforms >= 3) {
    readinessScore += 30;
    factors.push("Multi-platform experience");
  } else if (platforms === 2) {
    readinessScore += 20;
    factors.push("Dual-platform foundation");
  } else {
    readinessScore += 10;
    factors.push("Single-platform focus");
  }

  // Skill balance (30% weight)
  const balanceRatio = strengthCount / (strengthCount + weaknessCount || 1);
  if (balanceRatio >= 0.7) {
    readinessScore += 30;
    factors.push("Strong skill balance");
  } else if (balanceRatio >= 0.5) {
    readinessScore += 20;
    factors.push("Balanced skill development");
  } else {
    readinessScore += 10;
    factors.push("Areas for improvement identified");
  }

  // Determine level
  if (readinessScore >= 85) {
    level = "High Growth Potential";
  } else if (readinessScore >= 70) {
    level = "Strong Momentum";
  } else if (readinessScore >= 55) {
    level = "Developing";
  } else if (readinessScore >= 40) {
    level = "Early Stage";
  } else {
    level = "Getting Started";
  }

  return {
    level,
    score: readinessScore,
    factors,
    nextMilestone: getNextMilestone(readinessScore, platforms)
  };
};

const getNextMilestone = (score, platforms) => {
  if (score < 40) {
    return "Establish daily coding routine and connect 2+ platforms";
  } else if (score < 55) {
    return "Reach 60+ consistency score and balance platform activities";
  } else if (score < 70) {
    return "Achieve 70+ consistency and connect all major platforms";
  } else if (score < 85) {
    return "Maintain high consistency and develop specialized skills";
  } else {
    return "Continue excellence and consider mentoring others";
  }
};

const calculateDataCompleteness = (profiles) => {
  let completeness = 0;
  const maxCompleteness = 100;

  // Platform connection (30%)
  completeness += (profiles.length / 3) * 30;

  // Data quality per platform (70%)
  profiles.forEach(profile => {
    let platformCompleteness = 0;

    if (profile.platform === 'leetcode') {
      if (profile.totalSolved > 0) platformCompleteness += 20;
      if (profile.easySolved !== undefined) platformCompleteness += 10;
      if (profile.mediumSolved !== undefined) platformCompleteness += 10;
      if (profile.hardSolved !== undefined) platformCompleteness += 10;
    } else if (profile.platform === 'codeforces') {
      if (profile.totalSolved > 0) platformCompleteness += 20;
      if (profile.rating) platformCompleteness += 20;
      if (profile.rank) platformCompleteness += 10;
    } else if (profile.platform === 'github') {
      if (profile.repos > 0) platformCompleteness += 20;
      if (profile.followers !== undefined) platformCompleteness += 10;
      if (profile.stars !== undefined) platformCompleteness += 10;
    }

    completeness += (platformCompleteness / 70) * (70 / profiles.length);
  });

  return Math.round(Math.min(100, completeness));
};