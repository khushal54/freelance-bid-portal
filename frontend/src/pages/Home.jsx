import { useEffect, useState } from "react";
import api from "../services/api";
import ProjectCard from "../components/ProjectCard";

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

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

  const filteredProjects = projects
    .filter((project) => project.status === "open")
    .filter((project) => {
      if (category === "All") return true;
      return project.category === category;
    })
    .filter((project) => {
      const searchText = search.toLowerCase();

      return (
        project.title?.toLowerCase().includes(searchText) ||
        project.description?.toLowerCase().includes(searchText) ||
        project.status?.toLowerCase().includes(searchText) ||
        project.category?.toLowerCase().includes(searchText) ||
        project.postedBy?.name?.toLowerCase().includes(searchText)
      );
    });

  return (
    <div className="container">
      <h1>Available Projects</h1>

      <input
        className="search-input"
        type="text"
        placeholder="Search by title, description, category, status, or owner..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        className="category-filter"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option>All</option>
        <option>Web Development</option>
        <option>Mobile App</option>
        <option>UI/UX Design</option>
        <option>Content Writing</option>
        <option>Video Editing</option>
        <option>AI/ML</option>
        <option>Other</option>
      </select>

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