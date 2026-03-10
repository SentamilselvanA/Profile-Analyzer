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
      immediate: [String],
      shortTerm: [String],
      longTerm: [String]
    },
    consistencyScore: {
      type: Number,
      default: 0
    },
    classification: {
      type: Object,
      default: null
    },
    platformBalance: {
      type: String,
      default: ""
    },
    growthReadiness: {
      type: Object,
      default: null
    }
  },
  { timestamps: true }
);

export default mongoose.model("AnalysisReport", analysisReportSchema);