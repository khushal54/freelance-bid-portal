import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    budget: Number,
    deadline: String,

    category: {
      type: String,
      enum: [
        "Web Development",
        "Mobile App",
        "UI/UX Design",
        "Content Writing",
        "Video Editing",
        "AI/ML",
        "Other",
      ],
      default: "Other",
    },

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    status: {
      type: String,
      default: "open",
    },

    acceptedBid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bid",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);