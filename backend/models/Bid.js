import mongoose from "mongoose";

const bidSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    bidder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    amount: Number,
    message: String,
    status: {
      type: String,
      enum: [
        "pending",
        "creator_negotiation",
        "bidder_negotiation",
        "accepted",
        "rejected",
      ],
      default: "pending",
    },
    negotiationMessage: {
      type: String,
      default: "",
    },
    lastNegotiatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Bid", bidSchema);