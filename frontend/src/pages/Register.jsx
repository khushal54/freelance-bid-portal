import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    skills: "",
    college: "",
    bio: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const registerUser = async (e) => {
    e.preventDefault();

    try {
      await api.post("/api/auth/register", form);
      alert("Registration successful");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="container small">
      <h1>Register</h1>

      <form onSubmit={registerUser} className="form">
        <input name="name" placeholder="Name" onChange={handleChange} required />
        <input name="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <input name="skills" placeholder="Skills" onChange={handleChange} />
        <input name="college" placeholder="College" onChange={handleChange} />
        <textarea name="bio" placeholder="Bio" onChange={handleChange}></textarea>

        <button>Register</button>
      </form>

      <p>
        Already have account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;