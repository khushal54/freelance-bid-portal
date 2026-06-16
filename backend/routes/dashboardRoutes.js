import express from "express";
import Project from "../models/Project.js";
import Bid from "../models/Bid.js";
import User from "../models/User.js";
import auth from "../middleware/auth.js";

const router = express.Router();


//get user data
router.get("/", auth, async (req, res) => {
  try {
    const userDetails = await User.findById(req.user.id).select(
      "name email skills college bio createdAt"
    );

    const allMyProjects = await Project.find({ postedBy: req.user.id }).sort({
      createdAt: -1,
    });

    const addBidsToProjects = async (projects) => {
      return Promise.all(
        projects.map(async (project) => {
          const bids = await Bid.find({ project: project._id })
            .populate("bidder", "name email skills college")
            .sort({ createdAt: -1 });

          return {
            ...project.toObject(),
            bidCount: bids.length,
            bids,
          };
        })
      );
    };
  //my projects
    const myPostedProjects = await addBidsToProjects(
      allMyProjects.filter((project) => project.status === "open")
    );


    //my active projects
    const myActiveProjects = await addBidsToProjects(
      allMyProjects.filter((project) => project.status === "assigned")
    );
//completed projects
    const myCompletedProjects = await addBidsToProjects(
      allMyProjects.filter((project) => project.status === "completed")
    );


    //bids
    const myBids = await Bid.find({ bidder: req.user.id })
      .populate("project")
      .sort({ createdAt: -1 });

    res.json({
      userDetails,
      myPostedProjects,
      myActiveProjects,
      myCompletedProjects,
      myBids,
    });
  } catch {
    res.status(500).json({ message: "Dashboard failed" });
  }
});

export default router;