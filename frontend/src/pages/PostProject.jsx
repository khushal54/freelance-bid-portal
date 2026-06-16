import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const PostProject = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    budget: "",
    deadline: "",
    category: "Web Development",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const postProject = async (e) => {
    e.preventDefault();

    try {
      await api.post("/api/projects", form);
      alert("Project posted successfully");
      navigate("/projects");
    } catch (error) {
      alert(error.response?.data?.message || "Project posting failed");
    }
  };

  return (
    <div className="container small">
      <h1>Post Project</h1>

      <form onSubmit={postProject} className="form">
        <input name="title" placeholder="Project Title" onChange={handleChange} required />

        <textarea name="description" placeholder="Project Description" onChange={handleChange} required />

        <select name="category" value={form.category} onChange={handleChange}>
          <option>Web Development</option>
          <option>Mobile App</option>
          <option>UI/UX Design</option>
          <option>Content Writing</option>
          <option>Video Editing</option>
          <option>AI/ML</option>
          <option>Other</option>
        </select>

        <input name="budget" type="number" placeholder="Budget" onChange={handleChange} required />

        <input name="deadline" type="date" onChange={handleChange} required />

        <button>Post Project</button>
      </form>
    </div>
  );
};

export default PostProject;