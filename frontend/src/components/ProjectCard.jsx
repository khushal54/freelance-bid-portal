import { Link } from "react-router-dom";

const ProjectCard = ({ project }) => {
  return (
    <div className="card">
      <h2>{project.title}</h2>

      <p className="category-badge">{project.category || "Other"}</p>

      <p>{project.description}</p>

      <h3>₹{project.budget}</h3>
      <p>Deadline: {project.deadline}</p>
      <p>Status: {project.status}</p>

      <p>
        Posted by: <b>{project.postedBy?.name}</b>
      </p>

      <Link to={`/projects/${project._id}`}>View Details</Link>
    </div>
  );
};

export default ProjectCard;