import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/admin/dashboard";
import Projects from "./components/admin/Projects";
import DocRepo from "./components/management-rep/doc-repo";
import Login from "./components/Login/Login";
import Logout from "./components/Logout/Logout";
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route redirects to Login or Dashboard */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/projects" element={<Projects />} />

        {/* Management Rep Routes */}
        <Route path="/doc-repo" element={<DocRepo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
