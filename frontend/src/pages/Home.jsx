import { useEffect, useState } from "react";
import api from "../services/api";
import ProjectCard from "../components/ProjectCard";

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");

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

  const filteredProjects = projects.filter((project) => {
    const searchText = search.toLowerCase();

    return (
      project.title?.toLowerCase().includes(searchText) ||
      project.description?.toLowerCase().includes(searchText) ||
      project.status?.toLowerCase().includes(searchText) ||
      project.postedBy?.name?.toLowerCase().includes(searchText)
    );
  });

  return (
    <div className="container">
      <h1>Available Projects</h1>

      <input
        className="search-input"
        type="text"
        placeholder="Search projects by title, description, status, or owner..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <p>{filteredProjects.length} project(s) found</p>

      <div className="grid">
        {filteredProjects.length === 0 ? (
          <p>No matching projects found.</p>
        ) : (
          filteredProjects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))
        )}
      </div>
    </div>
  );
};

export default Home;