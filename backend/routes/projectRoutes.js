import express from "express";
import Project from "../models/Project.js";
import Bid from "../models/Bid.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const projects = await Project.find({ status: "open" })
      .populate("postedBy", "name email college")
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch {
    res.status(500).json({ message: "Failed to fetch projects" });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { title, description, budget, deadline, category } = req.body;

    const project = await Project.create({
      title,
      description,
      budget,
      deadline,
      category,
      postedBy: req.user.id,
    });

    res.status(201).json(project);
  } catch {
    res.status(500).json({ message: "Failed to create project" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      "postedBy",
      "name email college"
    );

    const bids = await Bid.find({ project: req.params.id })
      .populate("bidder", "name email skills college")
      .sort({ createdAt: -1 });

    res.json({ project, bids });
  } catch {
    res.status(500).json({ message: "Failed to fetch project" });
  }
});

router.post("/:id/bids", auth, async (req, res) => {
  try {
    const { amount, message } = req.body;

    const bid = await Bid.create({
      project: req.params.id,
      bidder: req.user.id,
      amount,
      message,
    });

    res.status(201).json(bid);
  } catch {
    res.status(500).json({ message: "Failed to place bid" });
  }
});

export default router;