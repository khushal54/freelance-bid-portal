import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/protectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PostProject from "./pages/PostProject";
import ProjectDetails from "./pages/projectDetails";
import Dashboard from "./pages/Dashboard";

import "./App.css";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />

     <Routes>
  <Route path="/" element={<Login />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />

  <Route
    path="/projects"
    element={
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    }
  />

  <Route
    path="/projects/:id"
    element={
      <ProtectedRoute>
        <ProjectDetails />
      </ProtectedRoute>
    }
  />

  <Route
    path="/post-project"
    element={
      <ProtectedRoute>
        <PostProject />
      </ProtectedRoute>
    }
  />

  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />
</Routes>
    </BrowserRouter>
  );
};

export default App;