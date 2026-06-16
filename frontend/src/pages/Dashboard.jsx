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

  const getDaysLeft = (deadline) => {
    if (!deadline) return "No deadline";

    const today = new Date();
    const endDate = new Date(deadline);

    today.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    const diffTime = endDate - today;
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (days < 0) return "Deadline passed";
    if (days === 0) return "Due today";
    if (days === 1) return "1 day left";

    return `${days} days left`;
  };

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

  const markAsComplete = async (projectId) => {
    const confirmComplete = confirm(
      "Are you sure you want to mark this project as completed?"
    );

    if (!confirmComplete) return;

    try {
      await api.put(`/api/projects/${projectId}/complete`);
      alert("Project marked as completed");
      fetchDashboard();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to complete project");
    }
  };

  const canShowBidActions = (bid) => {
    return bid.status !== "accepted" && bid.status !== "rejected";
  };

  const renderBids = (project) => {
    if (!project.bids || project.bids.length === 0) {
      return <p>No bids received yet.</p>;
    }

    return project.bids.map((bid) => (
      <div className="bid-box" key={bid._id}>
        <p><b>Student:</b> {bid.bidder?.name}</p>
        <p><b>Email:</b> {bid.bidder?.email}</p>
        <p><b>College:</b> {bid.bidder?.college}</p>
        <p><b>Skills:</b> {bid.bidder?.skills}</p>
        <p><b>Bid Amount:</b> ₹{bid.amount}</p>
        <p><b>Message:</b> {bid.message}</p>

        <p>
          <b>Status:</b>{" "}
          <span className={`status ${bid.status}`}>{bid.status}</span>
        </p>

        {bid.negotiationMessage && (
          <p><b>Negotiation Message:</b> {bid.negotiationMessage}</p>
        )}

        {canShowBidActions(bid) && (
          <div className="bid-actions">
            <button onClick={() => acceptBid(bid._id)}>Accept</button>

            <button className="reject-btn" onClick={() => rejectBid(bid._id)}>
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
    ));
  };

  const renderProjectCard = (project, showCompleteButton = false) => {
    return (
      <div className="card project-dashboard-card" key={project._id}>
        <div className="project-card-header">
          <h3>{project.title}</h3>
          <span className={`status ${project.status}`}>{project.status}</span>
        </div>

        <p><b>Category:</b> {project.category || "Other"}</p>
        <p><b>Budget:</b> ₹{project.budget}</p>
        <p><b>Deadline:</b> {project.deadline}</p>
        <p><b>Time Left:</b> {getDaysLeft(project.deadline)}</p>
        <p><b>Total Bids:</b> {project.bidCount || 0}</p>
        <p>{project.description}</p>

        {showCompleteButton && (
          <button
            className="complete-btn"
            onClick={() => markAsComplete(project._id)}
          >
            Mark as Complete
          </button>
        )}

        <h4>Bids Received</h4>
        {renderBids(project)}
      </div>
    );
  };

  if (!data) {
    return <h2 className="container">Loading...</h2>;
  }

  return (
    <div className="container">
      <h1>Dashboard</h1>

      <div className="user-dashboard-card">
        <h2>My Profile</h2>
        <p><b>Name:</b> {data.userDetails?.name}</p>
        <p><b>Email:</b> {data.userDetails?.email}</p>
        <p><b>College:</b> {data.userDetails?.college || "Not added"}</p>
        <p><b>Skills:</b> {data.userDetails?.skills || "Not added"}</p>
        <p><b>Bio:</b> {data.userDetails?.bio || "Not added"}</p>
      </div>

      <div className="dashboard-stats">
        <div>
          <h3>{data.myPostedProjects?.length || 0}</h3>
          <p>Posted</p>
        </div>
        <div>
          <h3>{data.myActiveProjects?.length || 0}</h3>
          <p>Active</p>
        </div>
        <div>
          <h3>{data.myCompletedProjects?.length || 0}</h3>
          <p>Completed</p>
        </div>
        <div>
          <h3>{data.myBids?.length || 0}</h3>
          <p>My Bids</p>
        </div>
      </div>

      <h2>My Posted Projects</h2>
      {data.myPostedProjects.length === 0 ? (
        <p>No open projects posted yet.</p>
      ) : (
        data.myPostedProjects.map((project) => renderProjectCard(project))
      )}

      <h2>My Active Projects</h2>
      {data.myActiveProjects.length === 0 ? (
        <p>No active projects yet.</p>
      ) : (
        data.myActiveProjects.map((project) =>
          renderProjectCard(project, true)
        )
      )}

      <h2>My Completed Projects</h2>
      {data.myCompletedProjects.length === 0 ? (
        <p>No completed projects yet.</p>
      ) : (
        data.myCompletedProjects.map((project) => renderProjectCard(project))
      )}

      <h2>My Bids</h2>
      {data.myBids.length === 0 ? (
        <p>No bids placed yet.</p>
      ) : (
        data.myBids.map((bid) => (
          <div className="card" key={bid._id}>
            <h3>{bid.project?.title}</h3>

            <p><b>Category:</b> {bid.project?.category || "Other"}</p>

            <p>
              <b>Project Status:</b>{" "}
              <span className={`status ${bid.project?.status}`}>
                {bid.project?.status}
              </span>
            </p>

            <p><b>Deadline:</b> {bid.project?.deadline}</p>
            <p><b>Time Left:</b> {getDaysLeft(bid.project?.deadline)}</p>
            <p><b>Bid Amount:</b> ₹{bid.amount}</p>
            <p><b>Message:</b> {bid.message}</p>

            <p>
              <b>Bid Status:</b>{" "}
              <span className={`status ${bid.status}`}>{bid.status}</span>
            </p>

            {bid.negotiationMessage && (
              <p><b>Negotiation Message:</b> {bid.negotiationMessage}</p>
            )}

            {canShowBidActions(bid) && (
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