const express = require("express");
const router = express.Router();
const controller = require("../controllers/managementRepController");

router.get("/dashboard", controller.getRepDashboardStats); // updated to match controller
router.get("/reports", controller.getRepReports); // updated
router.get("/documents", controller.getDocuments);
router.get("/notifications", controller.getRepNotifications); // updated
// router.get("/search", controller.searchData); // searchData not in RepController, can be omitted or kept if needed/impl later
// router.get("/profile", controller.getProfile); // profile not in RepController yet, omitted for now
// router.put("/profile", controller.updateProfile);

module.exports = router;
