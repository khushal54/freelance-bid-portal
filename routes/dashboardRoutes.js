import express from "express";
import Project from "../models/Project.js";
import Bid from "../models/Bid.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const myProjects = await Project.find({ postedBy: req.user.id })
      .sort({ createdAt: -1 });

    const myBids = await Bid.find({ bidder: req.user.id })
      .populate("project")
      .sort({ createdAt: -1 });

    res.json({ myProjects, myBids });
  } catch {
    res.status(500).json({ message: "Dashboard failed" });
  }
});

export default router;