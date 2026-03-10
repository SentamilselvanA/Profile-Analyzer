import User from "../models/User.js";
import CodingProfile from "../models/CodingProfile.js";
import AnalysisReport from "../models/AnalysisReport.js";
import { fetchLeetCodeProfile } from "../services/leetcodeService.js";
import { fetchCodeforcesProfile } from "../services/codeforcesService.js";
import { fetchGitHubProfile } from "../services/githubService.js";
import { generateAnalysis } from "../services/analyzeService.js";
import { generateComprehensiveAnalysis } from "../services/finalAnalysisService.js";
import { getHistoryData } from "../services/historyService.js";
import { compareTwoProfiles } from "../services/compareService.js";
import { analyzeTopics } from "../services/topicAnalysisService.js";
import { generateReports } from "../services/reportService.js";
import PlatformSnapshot from "../models/PlatformSnapshot.js";

export const saveUsernames = async (req, res) => {
  try {
    const { leetcodeUsername, codeforcesUsername, githubUsername } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { leetcodeUsername, codeforcesUsername, githubUsername },
      { new: true }
    );

    res.json({
      message: "Usernames saved successfully",
      user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const fetchAndAnalyzeProfiles = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const profiles = [];

    if (user.leetcodeUsername) {
      try {
        const leetcodeData = await fetchLeetCodeProfile(user.leetcodeUsername);

        await CodingProfile.findOneAndUpdate(
          { userId: user._id, platform: "leetcode" },
          { ...leetcodeData, userId: user._id, fetchedAt: new Date() },
          { upsert: true, new: true }
        );

        await PlatformSnapshot.create({
          userId: user._id,
          platform: "leetcode",
          username: user.leetcodeUsername,
          totalSolved: leetcodeData.totalSolved,
          easySolved: leetcodeData.easySolved,
          mediumSolved: leetcodeData.mediumSolved,
          hardSolved: leetcodeData.hardSolved,
          streak: leetcodeData.streak,
          capturedAt: new Date(),
        });

        profiles.push({ ...leetcodeData });
      } catch (error) {
        console.log("LeetCode fetch failed:", error.message);
      }
    }

    if (user.codeforcesUsername) {
      try {
        const codeforcesData = await fetchCodeforcesProfile(user.codeforcesUsername);

        await CodingProfile.findOneAndUpdate(
          { userId: user._id, platform: "codeforces" },
          { ...codeforcesData, userId: user._id, fetchedAt: new Date() },
          { upsert: true, new: true }
        );

        await PlatformSnapshot.create({
          userId: user._id,
          platform: "codeforces",
          username: user.codeforcesUsername,
          rating: codeforcesData.rating,
          rank: codeforcesData.rank,
          capturedAt: new Date(),
        });

        profiles.push({ ...codeforcesData });
      } catch (error) {
        console.log("Codeforces fetch failed:", error.message);
      }
    }

    if (user.githubUsername) {
      try {
        const githubData = await fetchGitHubProfile(user.githubUsername);

        await CodingProfile.findOneAndUpdate(
          { userId: user._id, platform: "github" },
          { ...githubData, userId: user._id, fetchedAt: new Date() },
          { upsert: true, new: true }
        );

        await PlatformSnapshot.create({
          userId: user._id,
          platform: "github",
          username: user.githubUsername,
          repos: githubData.repos,
          followers: githubData.followers,
          contributions: githubData.contributions,
          capturedAt: new Date(),
        });

        profiles.push({ ...githubData });
      } catch (error) {
        console.log("GitHub fetch failed:", error.message);
      }
    }

    const analysis = generateComprehensiveAnalysis(profiles);

    await AnalysisReport.findOneAndUpdate(
      { userId: user._id },
      { ...analysis, userId: user._id },
      { upsert: true, new: true }
    );

    res.json({
      profiles,
      analysis
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDashboard = async (req, res) => {
  try {
    const profiles = await CodingProfile.find({ userId: req.user.id });
    const analysis = await AnalysisReport.findOne({ userId: req.user.id });

    res.json({
      profiles,
      analysis
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getHistory = async (req, res) => {
  try {
    const historyData = await getHistoryData(req.user.id);
    res.json(historyData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const compareProfiles = async (req, res) => {
  try {
    const { userA, userB } = req.body;
    const comparisonResults = await compareTwoProfiles(userA, userB);
    res.json(comparisonResults);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTopicAnalysis = async (req, res) => {
  try {
    const profiles = await CodingProfile.find({ userId: req.user.id });
    const topicData = analyzeTopics(profiles);
    res.json(topicData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getReports = async (req, res) => {
  try {
    const reportData = await generateReports(req.user.id);
    res.json(reportData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};