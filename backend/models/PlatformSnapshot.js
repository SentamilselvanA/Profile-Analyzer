import mongoose from "mongoose";

const platformSnapshotSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    platform: {
      type: String,
      enum: ["leetcode", "codeforces", "github"],
      required: true
    },
    username: {
      type: String,
      required: true
    },
    totalSolved: {
      type: Number,
      default: 0
    },
    easySolved: {
      type: Number,
      default: 0
    },
    mediumSolved: {
      type: Number,
      default: 0
    },
    hardSolved: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 0
    },
    rank: {
      type: String,
      default: ""
    },
    streak: {
      type: Number,
      default: 0
    },
    repos: {
      type: Number,
      default: 0
    },
    followers: {
      type: Number,
      default: 0
    },
    contributions: {
      type: Number,
      default: 0
    },
    capturedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

export default mongoose.model("PlatformSnapshot", platformSnapshotSchema);
