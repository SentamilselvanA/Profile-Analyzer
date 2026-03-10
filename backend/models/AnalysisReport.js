import mongoose from "mongoose";

const analysisReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    strengths: {
      type: [String],
      default: []
    },
    weaknesses: {
      type: [String],
      default: []
    },
    suggestions: {
      type: [String],
      default: []
    },
    consistencyScore: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

export default mongoose.model("AnalysisReport", analysisReportSchema);