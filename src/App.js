import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/admin/dashboard";
import Projects from "./components/admin/Projects";
import Settings from "./components/admin/Settings";
import RoleManagement from "./components/admin/RoleManagement";
import Tenant from "./components/admin/Tenant";
import AddTenant from "./components/admin/AddTenant";
import TenantDetails from "./components/admin/TenantDetails";
import OwnerList from "./components/admin/OwnerList";
import AddOwner from "./components/admin/AddOwner";
import OwnerDetails from "./components/admin/OwnerDetails";
import ActivityLogs from "./components/admin/ActivityLogs";
import DocRepo from "./components/management-rep/doc-repo";
import Login from "./components/Login/Login";
import Logout from "./components/Logout/Logout";
import './App.css';

// Force Rebuild
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
        <Route path="/admin/settings" element={<Settings />} />
        <Route path="/admin/role-management" element={<RoleManagement />} />
        <Route path="/admin/tenant" element={<Tenant />} />
        <Route path="/admin/tenant/add" element={<AddTenant />} />
        <Route path="/admin/tenant/:id" element={<TenantDetails />} />
        <Route path="/admin/owner" element={<OwnerList />} />
        <Route path="/admin/owner/add" element={<AddOwner />} />
        <Route path="/admin/owner/:id" element={<OwnerDetails />} />
        <Route path="/admin/activity-logs" element={<ActivityLogs />} />

        {/* Management Rep Routes */}
        <Route path="/doc-repo" element={<DocRepo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
