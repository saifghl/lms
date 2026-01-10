const express = require("express");
const router = express.Router();

/* Dashboard */
router.get("/dashboard", (req, res) => {
  res.json({
    totalProjects: 12,
    totalUnits: 148,
    totalOwners: 45,
    totalTenants: 142,
    totalLeases: 138,
    totalRevenue: "₹1.2M",
  });
});

/* Reports */
router.get("/reports", (req, res) => {
  res.json([
    { id: 1, name: "Sunset Apartments", type: "Monthly lease", date: "11-12-2025" },
    { id: 2, name: "Lakeside Commercial", type: "Occupancy", date: "11-12-2025" },
  ]);
});

/* Documents */
router.get("/documents", (req, res) => {
  res.json([
    {
      id: "P-1024",
      projectName: "Sunset Apartments",
      date: "11-12-2025",
      uploadedBy: "Ketki Shah",
      category: "Lease",
    },
  ]);
});

/* Notifications */
router.get("/notifications", (req, res) => {
  res.json([
    { id: 1, text: "Lease expiring soon", read: false },
    { id: 2, text: "New document uploaded", read: true },
  ]);
});

/* Search */
router.get("/search", (req, res) => {
  res.json([
    { id: "P-1024", name: "Sunset Apartments", category: "Lease" },
  ]);
});

/* Profile */
router.get("/profile", (req, res) => {
  res.json({
    firstName: "Arjun",
    lastName: "Kapoor",
    email: "arjun.kapoor@cusec.com",
    phone: "+91 9876543210",
  });
});

router.put("/profile", (req, res) => {
  res.json({ message: "Profile updated successfully" });
});

module.exports = router;
