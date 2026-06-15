import express from "express";
import Project from "../models/Project.js";
import Bid from "../models/Bid.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const myProjects = await Project.find({ postedBy: req.user.id })
      .sort({ createdAt: -1 });

    const projectsWithBids = await Promise.all(
      myProjects.map(async (project) => {
        const bids = await Bid.find({ project: project._id })
          .populate("bidder", "name email skills college")
          .sort({ createdAt: -1 });

        return {
          ...project.toObject(),
          bids,
        };
      })
    );

    const myBids = await Bid.find({ bidder: req.user.id })
      .populate("project")
      .sort({ createdAt: -1 });

    res.json({ myProjects: projectsWithBids, myBids });
  } catch {
    res.status(500).json({ message: "Dashboard failed" });
  }
});

export default router;