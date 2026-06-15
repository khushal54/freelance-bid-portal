import { useEffect, useState } from "react";
import api from "../services/api";
import ProjectCard from "../components/ProjectCard";

const Home = () => {
  const [projects, setProjects] = useState([]);

  const fetchProjects = async () => {
    try {
      const res = await api.get("/api/projects");
      setProjects(res.data);
    } catch {
      alert("Failed to fetch projects");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="container">
      <h1>Available Projects</h1>

      <div className="grid">
        {projects.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default Home;