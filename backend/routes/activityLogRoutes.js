const express = require('express');
const router = express.Router();
const activityLogController = require('../controllers/activityLogController');

router.get('/export', activityLogController.exportActivityLogs);
router.get('/activity-logs', activityLogController.getActivityLogs);

module.exports = router;

