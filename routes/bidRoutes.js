import express from "express";
import Bid from "../models/Bid.js";
import Project from "../models/Project.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.put("/:id/accept", auth, async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.id);

    if (!bid) {
      return res.status(404).json({ message: "Bid not found" });
    }

    const project = await Project.findById(bid.project);

    if (project.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only project owner can accept bid" });
    }

    bid.status = "accepted";
    await bid.save();

    await Bid.updateMany(
      { project: project._id, _id: { $ne: bid._id } },
      { status: "rejected" }
    );

    project.status = "assigned";
    project.acceptedBid = bid._id;
    await project.save();

    res.json({ message: "Bid accepted", bid });
  } catch {
    res.status(500).json({ message: "Failed to accept bid" });
  }
});

export default router;