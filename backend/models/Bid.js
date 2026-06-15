import mongoose from "mongoose";

const bidSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project"
    },
    bidder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    amount: Number,
    message: String,
    status: {
      type: String,
      default: "pending"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Bid", bidSchema);