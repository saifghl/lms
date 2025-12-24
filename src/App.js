import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/admin/dashboard";
import Projects from "./components/admin/Projects";
import AddProject from "./components/admin/AddProject";
import EditProject from "./components/admin/EditProject";
import Units from "./components/admin/Units";
import AddUnit from "./components/admin/AddUnit";
import EditUnit from "./components/admin/EditUnit";
import UnitDetails from "./components/admin/UnitDetails";
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
        <Route path="/admin/add-project" element={<AddProject />} />
        <Route path="/admin/edit-project/:id" element={<EditProject />} />
        <Route path="/admin/units" element={<Units />} />
        <Route path="/admin/add-unit" element={<AddUnit />} />
        <Route path="/admin/edit-unit/:id" element={<EditUnit />} />
        <Route path="/admin/view-unit/:id" element={<UnitDetails />} />

        {/* Management Rep Routes */}
        <Route path="/doc-repo" element={<DocRepo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
