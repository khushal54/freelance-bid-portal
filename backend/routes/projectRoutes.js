import express from "express";
import Project from "../models/Project.js";
import Bid from "../models/Bid.js";
import auth from "../middleware/auth.js";

const router = express.Router();

//get projects
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


//post project
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


//get specific by id
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



//mark as complete
router.put("/:id/complete", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.postedBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Only project creator can mark project as completed",
      });
    }

    if (project.status !== "assigned") {
      return res.status(400).json({
        message: "Only assigned projects can be marked as completed",
      });
    }

    project.status = "completed";
    await project.save();

    res.json({ message: "Project marked as completed", project });
  } catch {
    res.status(500).json({ message: "Failed to complete project" });
  }
});

export default router;