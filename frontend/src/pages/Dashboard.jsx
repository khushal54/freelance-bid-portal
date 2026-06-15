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
            <p>Bid Amount: ₹{bid.amount}</p>
            <p>Status: {bid.status}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Dashboard;