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

    const isCreator = project.postedBy.toString() === req.user.id;
    const isBidder = bid.bidder.toString() === req.user.id;

    if (!isCreator && !isBidder) {
      return res.status(403).json({ message: "Not allowed" });
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

router.put("/:id/reject", auth, async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.id);

    if (!bid) {
      return res.status(404).json({ message: "Bid not found" });
    }

    const project = await Project.findById(bid.project);

    const isCreator = project.postedBy.toString() === req.user.id;
    const isBidder = bid.bidder.toString() === req.user.id;

    if (!isCreator && !isBidder) {
      return res.status(403).json({ message: "Not allowed" });
    }

    bid.status = "rejected";
    await bid.save();

    res.json({ message: "Bid rejected", bid });
  } catch {
    res.status(500).json({ message: "Failed to reject bid" });
  }
});

router.put("/:id/negotiate", auth, async (req, res) => {
  try {
    const { negotiationMessage } = req.body;

    const bid = await Bid.findById(req.params.id);

    if (!bid) {
      return res.status(404).json({ message: "Bid not found" });
    }

    const project = await Project.findById(bid.project);

    const isCreator = project.postedBy.toString() === req.user.id;
    const isBidder = bid.bidder.toString() === req.user.id;

    if (!isCreator && !isBidder) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (isCreator) {
      bid.status = "creator_negotiation";
    }

    if (isBidder) {
      bid.status = "bidder_negotiation";
    }

    bid.negotiationMessage = negotiationMessage;
    bid.lastNegotiatedBy = req.user.id;

    await bid.save();

    res.json({ message: "Negotiation sent", bid });
  } catch {
    res.status(500).json({ message: "Failed to negotiate bid" });
  }
});

export default router;