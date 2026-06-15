import { useEffect, useState } from "react";
import api from "../services/api";

const Dashboard = () => {
  const [data, setData] = useState(null);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/api/dashboard");
      setData(res.data);
    } catch {
      alert("Failed to load dashboard");
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const acceptBid = async (bidId) => {
    try {
      await api.put(`/api/bids/${bidId}/accept`);
      alert("Bid accepted");
      fetchDashboard();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to accept bid");
    }
  };

  const rejectBid = async (bidId) => {
    try {
      await api.put(`/api/bids/${bidId}/reject`);
      alert("Bid rejected");
      fetchDashboard();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to reject bid");
    }
  };

  const negotiateBid = async (bidId) => {
    const message = prompt("Enter negotiation message:");

    if (!message) return;

    try {
      await api.put(`/api/bids/${bidId}/negotiate`, {
        negotiationMessage: message,
      });

      alert("Negotiation sent");
      fetchDashboard();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to negotiate bid");
    }
  };

  const showActionButtons = (bid) => {
    return bid.status !== "accepted" && bid.status !== "rejected";
  };

  if (!data) {
    return <h2 className="container">Loading...</h2>;
  }

  return (
    <div className="container">
      <h1>Dashboard</h1>

      <h2>My Posted Projects</h2>

      {data.myProjects.length === 0 ? (
        <p>No projects posted yet.</p>
      ) : (
        data.myProjects.map((project) => (
          <div className="card" key={project._id}>
            <h3>{project.title}</h3>
            <p>Budget: ₹{project.budget}</p>
            <p>Status: {project.status}</p>
            <p>Deadline: {project.deadline}</p>

            <h4>Bids Received</h4>

            {project.bids.length === 0 ? (
              <p>No bids received yet.</p>
            ) : (
              project.bids.map((bid) => (
                <div className="bid-box" key={bid._id}>
                  <p>
                    <b>Student:</b> {bid.bidder?.name}
                  </p>

                  <p>
                    <b>Email:</b> {bid.bidder?.email}
                  </p>

                  <p>
                    <b>College:</b> {bid.bidder?.college}
                  </p>

                  <p>
                    <b>Skills:</b> {bid.bidder?.skills}
                  </p>

                  <p>
                    <b>Bid Amount:</b> ₹{bid.amount}
                  </p>

                  <p>
                    <b>Message:</b> {bid.message}
                  </p>

                  <p>
                    <b>Status:</b> {bid.status}
                  </p>

                  {bid.negotiationMessage && (
                    <p>
                      <b>Negotiation Message:</b> {bid.negotiationMessage}
                    </p>
                  )}

                  {showActionButtons(bid) && (
                    <div className="bid-actions">
                      <button onClick={() => acceptBid(bid._id)}>
                        Accept
                      </button>

                      <button
                        className="reject-btn"
                        onClick={() => rejectBid(bid._id)}
                      >
                        Reject
                      </button>

                      <button
                        className="negotiate-btn"
                        onClick={() => negotiateBid(bid._id)}
                      >
                        Negotiate
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        ))
      )}

      <h2>My Bids</h2>

      {data.myBids.length === 0 ? (
        <p>No bids placed yet.</p>
      ) : (
        data.myBids.map((bid) => (
          <div className="card" key={bid._id}>
            <h3>{bid.project?.title}</h3>

            <p>
              <b>Bid Amount:</b> ₹{bid.amount}
            </p>

            <p>
              <b>Message:</b> {bid.message}
            </p>

            <p>
              <b>Status:</b> {bid.status}
            </p>

            {bid.negotiationMessage && (
              <p>
                <b>Negotiation Message:</b> {bid.negotiationMessage}
              </p>
            )}

            {showActionButtons(bid) && (
              <div className="bid-actions">
                <button onClick={() => acceptBid(bid._id)}>Accept</button>

                <button
                  className="reject-btn"
                  onClick={() => rejectBid(bid._id)}
                >
                  Reject
                </button>

                <button
                  className="negotiate-btn"
                  onClick={() => negotiateBid(bid._id)}
                >
                  Negotiate
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Dashboard;