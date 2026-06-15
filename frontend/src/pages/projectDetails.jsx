import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import BidCard from "../components/BidCard";

const ProjectDetails = () => {
  const { id } = useParams();

  const [data, setData] = useState(null);
  const [bidForm, setBidForm] = useState({
    amount: "",
    message: "",
  });

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchProjectDetails = async () => {
    try {
      const res = await api.get(`/api/projects/${id}`);
      setData(res.data);
    } catch {
      alert("Failed to fetch project details");
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const handleChange = (e) => {
    setBidForm({ ...bidForm, [e.target.name]: e.target.value });
  };

  const placeBid = async (e) => {
    e.preventDefault();

    try {
      await api.post(`/api/projects/${id}/bids`, bidForm);
      alert("Bid placed successfully");
      setBidForm({ amount: "", message: "" });
      fetchProjectDetails();
    } catch (error) {
      alert(error.response?.data?.message || "Bid failed");
    }
  };

  const acceptBid = async (bidId) => {
    try {
      await api.put(`/api/bids/${bidId}/accept`);
      alert("Bid accepted");
      fetchProjectDetails();
    } catch (error) {
      alert(error.response?.data?.message || "Accept bid failed");
    }
  };

  if (!data) {
    return <h2 className="container">Loading...</h2>;
  }

  const project = data.project;
  const bids = data.bids;

  const isOwner = user && project.postedBy?._id === user.id;

  return (
    <div className="container">
      <div className="details-card">
        <h1>{project.title}</h1>
        <p>{project.description}</p>
        <h3>Budget: ₹{project.budget}</h3>
        <p>Deadline: {project.deadline}</p>
        <p>Status: {project.status}</p>
        <p>
          Posted By: <b>{project.postedBy?.name}</b>
        </p>
      </div>

      {!isOwner && token && project.status === "open" && (
        <>
          <h2>Place Your Bid</h2>

          <form onSubmit={placeBid} className="form">
            <input
              name="amount"
              type="number"
              placeholder="Bid Amount"
              value={bidForm.amount}
              onChange={handleChange}
              required
            />

            <textarea
              name="message"
              placeholder="Why should you be selected?"
              value={bidForm.message}
              onChange={handleChange}
              required
            ></textarea>

            <button>Submit Bid</button>
          </form>
        </>
      )}

      {!token && <p>Please login to place a bid.</p>}

      {isOwner && <p>You are the owner of this project.</p>}

      <h2>All Bids</h2>

      {bids.length === 0 ? (
        <p>No bids yet.</p>
      ) : (
        bids.map((bid) => (
          <BidCard
            key={bid._id}
            bid={bid}
            isOwner={isOwner}
            projectStatus={project.status}
            onAccept={acceptBid}
          />
        ))
      )}
    </div>
  );
};

export default ProjectDetails;