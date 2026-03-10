import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  saveUsernames,
  fetchAndAnalyzeProfiles,
  getDashboard,
  getHistory,
  compareProfiles,
  getTopicAnalysis,
  getReports
} from "../controllers/profileController.js";

const router = express.Router();

router.put("/usernames", authMiddleware, saveUsernames);
router.post("/refresh", authMiddleware, fetchAndAnalyzeProfiles);
router.get("/dashboard", authMiddleware, getDashboard);
router.get("/history", authMiddleware, getHistory);
router.post("/compare", authMiddleware, compareProfiles);
router.get("/topics", authMiddleware, getTopicAnalysis);
router.get("/reports", authMiddleware, getReports);

export default router;