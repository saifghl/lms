import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/admin/dashboard";
import Projects from "./components/admin/Projects";
import ProjectDetails from "./components/admin/ProjectDetails";
import Settings from "./components/admin/Settings";
import RoleManagement from "./components/admin/RoleManagement";
import TenantList from "./components/admin/TenantList"; // Updated import
import AddTenant from "./components/admin/AddTenant";
import TenantDetails from "./components/admin/TenantDetails";
import OwnerList from "./components/admin/OwnerList";
import AddOwner from "./components/admin/AddOwner";
import OwnerDetails from "./components/admin/OwnerDetails";
import ActivityLogs from "./components/admin/ActivityLogs";
import AddProject from "./components/admin/AddProject";
import EditProject from "./components/admin/EditProject";
import Units from "./components/admin/Units";
import AddUnit from "./components/admin/AddUnit";
import EditUnit from "./components/admin/EditUnit";
import UnitDetails from "./components/admin/UnitDetails";
import LeaseDashboard from "./components/lease-management/LeaseDashboard";
import LeaseReports from "./components/lease-management/LeaseReports";
import ReviewCenter from "./components/lease-management/ReviewCenter";
import LeaseNotifications from "./components/lease-management/LeaseNotifications";
import LeaseTracker from "./components/lease-management/LeaseTracker";
import RepDashboard from "./components/management-rep/RepDashboard";
import Reports from "./components/management-rep/Reports";
import SearchFilters from "./components/management-rep/SearchFilters";
import Notifications from "./components/management-rep/Notifications";
import RepSettings from "./components/management-rep/RepSettings";
import Leases from "./components/admin/Leases";
import AddLease from "./components/admin/AddLease";
import EditLease from "./components/admin/EditLease";
import LeaseDetails from "./components/admin/LeaseDetails";
import LeaseValidation from "./components/lease-management/LeaseValidation";
import LeaseLifecycle from "./components/lease-management/LeaseLifecycle";
import LeaseReminders from "./components/lease-management/LeaseReminders";
import KycPage from "./components/admin/KycPage";
import DocRepo from "./components/management-rep/doc-repo";
import Login from "./components/Login/Login";
import Logout from "./components/Logout/Logout";
import './App.css';

// Force Rebuild
import CreateUser from './components/admin/CreateUser';
import EditTenant from './components/admin/EditTenant';
import EditOwner from './components/admin/EditOwner';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route redirects to Login or Dashboard */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/create-user" element={<CreateUser />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/projects" element={<Projects />} />
        <Route path="/admin/projects/:id" element={<ProjectDetails />} />
        <Route path="/admin/add-project" element={<AddProject />} />
        <Route path="/admin/edit-project/:id" element={<EditProject />} />

        {/* Unit Management */}
        <Route path="/admin/units" element={<Units />} />
        <Route path="/admin/add-unit" element={<AddUnit />} />
        <Route path="/admin/edit-unit/:id" element={<EditUnit />} />
        <Route path="/admin/view-unit/:id" element={<UnitDetails />} />
        <Route path="/admin/leases" element={<Leases />} />
        <Route path="/admin/add-lease" element={<AddLease />} />
        <Route path="/admin/edit-lease/:id" element={<EditLease />} />
        <Route path="/admin/view-lease/:id" element={<LeaseDetails />} />

        {/* Other Admin Modules */}
        <Route path="/admin/settings" element={<Settings />} />
        <Route path="/admin/role-management" element={<RoleManagement />} />
        <Route path="/admin/create-user" element={<CreateUser />} />

        {/* Tenant Routes */}
        <Route path="/admin/tenants" element={<TenantList />} />
        <Route path="/admin/tenant" element={<Navigate to="/admin/tenants" replace />} />
        <Route path="/admin/tenant/add" element={<AddTenant />} />
        <Route path="/admin/add-tenant" element={<AddTenant />} />
        <Route path="/admin/tenant/edit/:id" element={<EditTenant />} />
        <Route path="/admin/tenant/:id" element={<TenantDetails />} />

        {/* Owner Routes */}
        <Route path="/admin/owner" element={<OwnerList />} />
        <Route path="/admin/owners" element={<OwnerList />} />
        <Route path="/admin/owner/add" element={<AddOwner />} />
        <Route path="/admin/owners/add" element={<AddOwner />} />
        <Route path="/admin/owner/edit/:id" element={<EditOwner />} />
        <Route path="/admin/owner/:id" element={<OwnerDetails />} />

        <Route path="/admin/activity-logs" element={<ActivityLogs />} />
        <Route path="/admin/kyc" element={<KycPage />} />

        {/* Management Rep Routes */}
        <Route path="/doc-repo" element={<DocRepo />} />
        {/* Lease Management Suite */}
        <Route path="/lease/dashboard" element={<LeaseDashboard />} />
        <Route path="/lease/reports" element={<LeaseReports />} />
        {/* <Route path="/admin/notifications" element={<LeaseNotifications />} />  -- Kept locally or removed if unused */}

        {/* Legacy/Other Routes */}
        <Route path="/lease/validation" element={<LeaseValidation />} />
        <Route path="/lease/lifecycle" element={<LeaseLifecycle />} />
        <Route path="/lease/reminders" element={<LeaseReminders />} />
        <Route path="/management/dashboard" element={<RepDashboard />} />
        <Route path="/management/reports" element={<Reports />} />
        <Route path="/management/search" element={<SearchFilters />} />
        <Route path="/management/notifications" element={<Notifications />} />
        <Route path="/management/review-center" element={<ReviewCenter />} />
        <Route path="/management/lease-tracker" element={<LeaseTracker />} />
        <Route path="/management/settings" element={<RepSettings />} />

      </Routes >
    </BrowserRouter >
  );
}

export default App;
