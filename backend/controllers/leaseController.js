const db = require("../config/db");


// Dashboard Summary
exports.getLeaseStats = async (req, res) => {
try {
const [[pending]] = await db.query(`SELECT COUNT(*) total FROM leases WHERE status='draft'`);
const [[active]] = await db.query(`SELECT COUNT(*) total FROM leases WHERE status='active'`);
const [[expiring]] = await db.query(`SELECT COUNT(*) total FROM leases WHERE lease_end <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)`);


res.json({
pending: pending.total,
active: active.total,
expiring: expiring.total,
});
} catch (err) {
console.error(err);
res.status(500).json({ message: "Server error" });
}
};


// Pending Approvals
exports.getPendingLeases = async (req, res) => {
try {
const [rows] = await db.query(`
SELECT l.id, t.company_name, l.monthly_rent, l.lease_start, l.lease_end
FROM leases l
JOIN tenants t ON t.id = l.tenant_id
WHERE l.status='draft'
ORDER BY l.created_at DESC
`);


res.json(rows);
} catch (err) {
console.error(err);
res.status(500).json({ message: "Server error" });
}
};


// Approve Lease
exports.approveLease = async (req, res) => {
try {
const { id } = req.params;
await db.query(`UPDATE leases SET status='approved' WHERE id=?`, [id]);
res.json({ message: "Lease approved" });
} catch (err) {
console.error(err);
res.status(500).json({ message: "Server error" });
}
};


// Expiring Leases
exports.getExpiringLeases = async (req, res) => {
try {
const [rows] = await db.query(`
SELECT l.id, t.company_name, l.monthly_rent, l.lease_end
FROM leases l
JOIN tenants t ON t.id = l.tenant_id
WHERE l.lease_end <= DATE_ADD(CURDATE(), INTERVAL 90 DAY)
`);


res.json(rows);
} catch (err) {
console.error(err);
res.status(500).json({ message: "Server error" });
}
};


// Notifications
exports.getLeaseNotifications = async (req, res) => {
try {
const [rows] = await db.query(`
SELECT id, title, message, created_at
FROM notifications
ORDER BY created_at DESC LIMIT 10
`);


res.json(rows);
} catch (err) {
console.error(err);
res.status(500).json({ message: "Server error" });
}
};
