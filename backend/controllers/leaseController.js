const pool = require("../config/db");

// Dashboard Summary
const getLeaseDashboardStats = async (req, res) => {
    try {
        const [pending] = await pool.query(`SELECT COUNT(*) as total FROM leases WHERE status='draft'`);
        const [active] = await pool.query(`SELECT COUNT(*) as total FROM leases WHERE status='active'`);
        const [expiring] = await pool.query(`SELECT COUNT(*) as total FROM leases WHERE lease_end <= DATE_ADD(CURDATE(), INTERVAL 30 DAY) AND status='active'`);
        const [renewals] = await pool.query(`SELECT COUNT(*) as total FROM leases WHERE lease_end BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY) AND status='active'`);

        // Mocking escalations count for now as it requires complex join logic or a status flag in escalations table
        // Assuming leases with escalations due this month
        const [escalations] = await pool.query(`
            SELECT COUNT(DISTINCT l.id) as total 
            FROM leases l 
            JOIN lease_escalations le ON l.id = le.lease_id 
            WHERE le.effective_from <= DATE_ADD(CURDATE(), INTERVAL 30 DAY) 
            AND le.effective_from >= CURDATE()
        `);

        res.json({
            pending_approvals: pending[0].total,
            active_leases: active[0].total,
            lease_expiries: expiring[0].total,
            renewals_due: renewals[0].total,
            rental_escalation: escalations[0].total || 0,
            growth: "5% vs last month" // Placeholder for now or calculate real growth
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Need Attention List
const getNeedAttentionLeases = async (req, res) => {
    try {
        // Fetch Drafts, Disputes (mock status), and Escalations
        const [rows] = await pool.query(`
            SELECT 
                l.id, 
                t.company_name as tenant_name, 
                l.status, 
                l.lease_end as date,
                CASE 
                    WHEN l.status = 'draft' THEN 'New Lease'
                    WHEN l.status = 'dispute' THEN 'Dispute'
                    ELSE 'Escalation'
                END as type
            FROM leases l
            JOIN tenants t ON l.tenant_id = t.id
            WHERE l.status IN ('draft', 'dispute') 
            OR (l.status = 'active' AND l.lease_end <= DATE_ADD(CURDATE(), INTERVAL 30 DAY))
            ORDER BY l.created_at DESC
            LIMIT 5
        `);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};


// Pending Approvals
const getPendingLeases = async (req, res) => {
    try {
        const [rows] = await pool.query(`
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
const approveLease = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query(`UPDATE leases SET status='approved' WHERE id=?`, [id]);
        res.json({ message: "Lease approved" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};


// Expiring Leases (Kept for compatibility)
const getExpiringLeases = async (req, res) => {
    try {
        const [rows] = await pool.query(`
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

// Lease Report Stats
const getLeaseReportStats = async (req, res) => {
    try {
        const [exp30] = await pool.query(`SELECT COUNT(*) as total FROM leases WHERE lease_end <= DATE_ADD(CURDATE(), INTERVAL 30 DAY) AND status='active'`);
        const [exp60] = await pool.query(`SELECT COUNT(*) as total FROM leases WHERE lease_end <= DATE_ADD(CURDATE(), INTERVAL 60 DAY) AND status='active'`);
        const [riskValue] = await pool.query(`SELECT SUM(monthly_rent) as total FROM leases WHERE lease_end <= DATE_ADD(CURDATE(), INTERVAL 60 DAY) AND status='active'`);
        const [notice] = await pool.query(`SELECT COUNT(*) as total FROM leases WHERE notice_period_months > 0 AND status='active'`); // Simplified logic for notice pending

        res.json({
            expiring_30_days: exp30[0].total,
            expiring_60_days: exp60[0].total,
            total_value_risk: riskValue[0].total || 0,
            notice_pending: notice[0].total
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};


// Notifications
const getLeaseNotifications = async (req, res) => {
    try {
        // Check if notifications table exists first, if not return empty
        const [rows] = await pool.query(`
            SELECT id, title, message, created_at
            FROM notifications
            ORDER BY created_at DESC LIMIT 10
        `);
        res.json(rows);
    } catch (err) {
        console.error("Notifications error (table might be missing):", err.message);
        res.json([]);
    }
};

// Lease Tracker Stats
const getLeaseTrackerStats = async (req, res) => {
    try {
        const [exp90] = await pool.query(`SELECT COUNT(*) as total FROM leases WHERE lease_end <= DATE_ADD(CURDATE(), INTERVAL 90 DAY) AND status='active'`);
        const [renewals] = await pool.query(`SELECT COUNT(*) as total FROM leases WHERE lease_end BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 60 DAY) AND status='active'`); // Slightly broader for renewals pending
        const [escalations] = await pool.query(`
            SELECT COUNT(DISTINCT l.id) as total 
            FROM leases l 
            JOIN lease_escalations le ON l.id = le.lease_id 
            WHERE le.effective_from <= DATE_ADD(CURDATE(), INTERVAL 30 DAY) 
            AND le.effective_from >= CURDATE()
        `);
        const [lockIn] = await pool.query(`SELECT COUNT(*) as total FROM leases WHERE DATE_ADD(lease_start, INTERVAL lockin_period_months MONTH) <= DATE_ADD(CURDATE(), INTERVAL 30 DAY) AND DATE_ADD(lease_start, INTERVAL lockin_period_months MONTH) >= CURDATE()`);

        res.json({
            expiring_90_days: exp90[0].total,
            renewals_pending: renewals[0].total,
            escalation_due: escalations[0].total || 0,
            lock_in_ending: lockIn[0].total
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};


// Create Lease
const createLease = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const {
            project_id,
            unit_id,
            owner_id,
            tenant_id,
            sub_tenant_id,
            lease_type,
            rent_model,
            sub_lease_area_sqft,
            lease_start,
            lease_end,
            rent_commencement_date,
            fitout_period_end,
            tenure_months,
            lockin_period_months,
            notice_period_months,
            monthly_rent,
            cam_charges,
            billing_frequency,
            payment_due_day,
            currency_code,
            security_deposit,
            utility_deposit,
            deposit_type,
            revenue_share_percentage,
            revenue_share_applicable_on,
            escalations
        } = req.body;

        // Validate required fields
        if (!project_id || !unit_id || !tenant_id || !lease_start || !lease_end || !rent_commencement_date) {
            await connection.rollback();
            return res.status(400).json({ message: 'Required fields missing: project_id, unit_id, tenant_id, lease_start, lease_end, rent_commencement_date' });
        }

        // For Direct lease, owner_id is required
        if (lease_type === 'Direct lease' && !owner_id) {
            await connection.rollback();
            return res.status(400).json({ message: 'owner_id is required for Direct lease' });
        }

        // For Sub lease, sub_tenant_id and sub_lease_area_sqft are required
        if (lease_type === 'Subtenant lease' && (!sub_tenant_id || !sub_lease_area_sqft)) {
            await connection.rollback();
            return res.status(400).json({ message: 'sub_tenant_id and sub_lease_area_sqft are required for Sub lease' });
        }

        // Validate Unit belongs to Project
        const [unitCheck] = await connection.query("SELECT project_id FROM units WHERE id = ?", [unit_id]);
        if (unitCheck.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: "Unit not found" });
        }
        if (unitCheck[0].project_id != project_id) {
            await connection.rollback();
            return res.status(400).json({ message: "Selected unit does not belong to the selected project" });
        }

        // Calculate tenure_months if not provided
        const startDate = new Date(lease_start);
        const endDate = new Date(lease_end);
        const calculatedTenure = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24 * 30));

        // Insert lease
        const [leaseResult] = await connection.query(
            `INSERT INTO leases (
                project_id, unit_id, owner_id, tenant_id, sub_tenant_id,
                lease_type, rent_model, sub_lease_area_sqft,
                lease_start, lease_end, rent_commencement_date, fitout_period_end,
                tenure_months, lockin_period_months, notice_period_months,
                monthly_rent, cam_charges, billing_frequency, payment_due_day,
                currency_code, security_deposit, utility_deposit, deposit_type,
                revenue_share_percentage, revenue_share_applicable_on, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                project_id,
                unit_id,
                owner_id || null,
                tenant_id,
                sub_tenant_id || null,
                lease_type || 'Direct lease',
                rent_model || 'Fixed',
                sub_lease_area_sqft || null,
                lease_start,
                lease_end,
                rent_commencement_date,
                fitout_period_end || null,
                tenure_months || (isNaN(calculatedTenure) ? 0 : calculatedTenure),
                lockin_period_months || 12,
                notice_period_months || 3,
                monthly_rent || 0,
                cam_charges || 0,
                billing_frequency || 'Monthly',
                payment_due_day || '1st of Month',
                currency_code || 'INR',
                security_deposit || 0,
                utility_deposit || 0,
                deposit_type || 'Cash',
                revenue_share_percentage || null,
                revenue_share_applicable_on || null,
                'draft'
            ]
        );

        const leaseId = leaseResult.insertId;

        // Insert escalations if provided
        if (Array.isArray(escalations) && escalations.length > 0) {
            for (let i = 0; i < escalations.length; i++) {
                const esc = escalations[i];
                await connection.query(
                    `INSERT INTO lease_escalations (lease_id, sequence_no, effective_from, increase_type, value)
                     VALUES (?, ?, ?, ?, ?)`,
                    [
                        leaseId,
                        i + 1,
                        esc.effective_from,
                        esc.increase_type || 'Percentage',
                        esc.value
                    ]
                );
            }
        }

        // Update unit status to occupied
        await connection.query(
            `UPDATE units SET status = 'occupied' WHERE id = ?`,
            [unit_id]
        );

        await connection.commit();
        res.status(201).json({
            message: 'Lease created successfully',
            lease_id: leaseId
        });

    } catch (err) {
        await connection.rollback();
        console.error('CREATE LEASE ERROR:', err);
        res.status(500).json({
            message: 'Failed to create lease',
            error: err.message
        });
    } finally {
        connection.release();
    }
};

// Get All Leases
const getAllLeases = async (req, res) => {
    try {
        const { status, project_id, location, search } = req.query;

        let query = `
            SELECT 
                l.id,
                l.lease_type,
                l.rent_model,
                l.lease_start,
                l.lease_end,
                l.monthly_rent,
                l.security_deposit,
                l.status,
                p.project_name,
                u.unit_number,
                t.company_name AS tenant_name,
                o.name AS owner_name,
                st.company_name AS sub_tenant_name
            FROM leases l
            LEFT JOIN projects p ON l.project_id = p.id
            LEFT JOIN units u ON l.unit_id = u.id
            LEFT JOIN tenants t ON l.tenant_id = t.id
            LEFT JOIN owners o ON l.owner_id = o.id
            LEFT JOIN sub_tenants st ON l.sub_tenant_id = st.id
            WHERE 1=1
        `;

        const params = [];

        if (status) {
            query += ` AND l.status = ?`;
            params.push(status);
        }

        if (project_id) {
            query += ` AND l.project_id = ?`;
            params.push(project_id);
        }

        if (location) {
            query += ` AND p.location = ?`;
            params.push(location);
        }

        if (req.query.expires_in) {
            query += ` AND l.lease_end <= DATE_ADD(CURDATE(), INTERVAL ? DAY) AND l.lease_end >= CURDATE()`;
            params.push(req.query.expires_in);
        }

        if (search) {
            query += ` AND (t.company_name LIKE ? OR u.unit_number LIKE ? OR p.project_name LIKE ? OR CAST(l.id AS CHAR) LIKE ?)`;
            params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
        }

        query += ` ORDER BY l.created_at DESC`;

        const [rows] = await pool.query(query, params);
        res.json(rows);

    } catch (err) {
        console.error('GET ALL LEASES ERROR:', err);
        res.status(500).json({
            message: 'Failed to fetch leases',
            error: err.message
        });
    }
};

// Get Lease By ID
const getLeaseById = async (req, res) => {
    try {
        const leaseId = req.params.id;

        // Get lease details
        const [leaseRows] = await pool.query(
            `SELECT l.*, 
                    p.project_name, p.location as project_location,
                    u.unit_number, u.floor_number, u.super_area, u.carpet_area, u.unit_condition,
                    t.company_name AS tenant_name, t.contact_person_name, t.contact_person_email, t.contact_person_phone, t.industry,
                    o.name AS owner_name,
                    st.company_name AS sub_tenant_name
             FROM leases l
             LEFT JOIN projects p ON l.project_id = p.id
             LEFT JOIN units u ON l.unit_id = u.id
             LEFT JOIN tenants t ON l.tenant_id = t.id
             LEFT JOIN owners o ON l.owner_id = o.id
             LEFT JOIN sub_tenants st ON l.sub_tenant_id = st.id
             WHERE l.id = ?`,
            [leaseId]
        );

        if (leaseRows.length === 0) {
            return res.status(404).json({ message: 'Lease not found' });
        }

        const lease = leaseRows[0];

        // Get escalations
        const [escalations] = await pool.query(
            `SELECT * FROM lease_escalations 
             WHERE lease_id = ? 
             ORDER BY sequence_no ASC`,
            [leaseId]
        );

        // Calculate days remaining
        const endDate = new Date(lease.lease_end);
        const today = new Date();
        const daysRemaining = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

        res.json({
            ...lease,
            escalations: escalations || [],
            days_remaining: daysRemaining
        });

    } catch (err) {
        console.error('GET LEASE BY ID ERROR:', err);
        res.status(500).json({
            message: 'Failed to fetch lease details',
            error: err.message
        });
    }
};

// Update Lease
const updateLease = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const leaseId = req.params.id;
        const {
            project_id,
            unit_id,
            owner_id,
            tenant_id,
            sub_tenant_id,
            lease_type,
            rent_model,
            sub_lease_area_sqft,
            lease_start,
            lease_end,
            rent_commencement_date,
            fitout_period_end,
            tenure_months,
            lockin_period_months,
            notice_period_months,
            monthly_rent,
            cam_charges,
            billing_frequency,
            payment_due_day,
            currency_code,
            security_deposit,
            utility_deposit,
            deposit_type,
            revenue_share_percentage,
            revenue_share_applicable_on,
            status,
            escalations
        } = req.body;

        // Check if lease exists
        const [existing] = await connection.query(
            `SELECT id FROM leases WHERE id = ?`,
            [leaseId]
        );

        if (existing.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Lease not found' });
        }

        // Build update query
        const updateFields = [];
        const updateValues = [];

        if (project_id !== undefined) updateFields.push('project_id = ?'), updateValues.push(project_id);
        if (unit_id !== undefined) updateFields.push('unit_id = ?'), updateValues.push(unit_id);
        if (owner_id !== undefined) updateFields.push('owner_id = ?'), updateValues.push(owner_id);
        if (tenant_id !== undefined) updateFields.push('tenant_id = ?'), updateValues.push(tenant_id);
        if (sub_tenant_id !== undefined) updateFields.push('sub_tenant_id = ?'), updateValues.push(sub_tenant_id);
        if (lease_type !== undefined) updateFields.push('lease_type = ?'), updateValues.push(lease_type);
        if (rent_model !== undefined) updateFields.push('rent_model = ?'), updateValues.push(rent_model);
        if (sub_lease_area_sqft !== undefined) updateFields.push('sub_lease_area_sqft = ?'), updateValues.push(sub_lease_area_sqft);
        if (lease_start !== undefined) updateFields.push('lease_start = ?'), updateValues.push(lease_start);
        if (lease_end !== undefined) updateFields.push('lease_end = ?'), updateValues.push(lease_end);
        if (rent_commencement_date !== undefined) updateFields.push('rent_commencement_date = ?'), updateValues.push(rent_commencement_date);
        if (fitout_period_end !== undefined) updateFields.push('fitout_period_end = ?'), updateValues.push(fitout_period_end);
        if (tenure_months !== undefined) updateFields.push('tenure_months = ?'), updateValues.push(tenure_months);
        if (lockin_period_months !== undefined) updateFields.push('lockin_period_months = ?'), updateValues.push(lockin_period_months);
        if (notice_period_months !== undefined) updateFields.push('notice_period_months = ?'), updateValues.push(notice_period_months);
        if (monthly_rent !== undefined) updateFields.push('monthly_rent = ?'), updateValues.push(monthly_rent);
        if (cam_charges !== undefined) updateFields.push('cam_charges = ?'), updateValues.push(cam_charges);
        if (billing_frequency !== undefined) updateFields.push('billing_frequency = ?'), updateValues.push(billing_frequency);
        if (payment_due_day !== undefined) updateFields.push('payment_due_day = ?'), updateValues.push(payment_due_day);
        if (currency_code !== undefined) updateFields.push('currency_code = ?'), updateValues.push(currency_code);
        if (security_deposit !== undefined) updateFields.push('security_deposit = ?'), updateValues.push(security_deposit);
        if (utility_deposit !== undefined) updateFields.push('utility_deposit = ?'), updateValues.push(utility_deposit);
        if (deposit_type !== undefined) updateFields.push('deposit_type = ?'), updateValues.push(deposit_type);
        if (revenue_share_percentage !== undefined) updateFields.push('revenue_share_percentage = ?'), updateValues.push(revenue_share_percentage);
        if (revenue_share_applicable_on !== undefined) updateFields.push('revenue_share_applicable_on = ?'), updateValues.push(revenue_share_applicable_on);
        if (status !== undefined) updateFields.push('status = ?'), updateValues.push(status);

        // Update lease if there are fields to update
        if (updateFields.length > 0) {
            updateValues.push(leaseId);
            await connection.query(
                `UPDATE leases SET ${updateFields.join(', ')} WHERE id = ?`,
                updateValues
            );
        }

        // Handle escalations - remove old and insert new
        if (escalations !== undefined) {
            // Delete old escalations
            await connection.query(
                `DELETE FROM lease_escalations WHERE lease_id = ?`,
                [leaseId]
            );

            // Insert new escalations
            if (Array.isArray(escalations) && escalations.length > 0) {
                for (let i = 0; i < escalations.length; i++) {
                    const esc = escalations[i];
                    await connection.query(
                        `INSERT INTO lease_escalations (lease_id, sequence_no, effective_from, increase_type, value)
                         VALUES (?, ?, ?, ?, ?)`,
                        [
                            leaseId,
                            i + 1,
                            esc.effective_from,
                            esc.increase_type || 'Percentage',
                            esc.value
                        ]
                    );
                }
            }
        }

        await connection.commit();
        res.json({ message: 'Lease updated successfully' });

    } catch (err) {
        await connection.rollback();
        console.error('UPDATE LEASE ERROR:', err);
        res.status(500).json({
            message: 'Failed to update lease',
            error: err.message
        });
    } finally {
        connection.release();
    }
};

module.exports = {
    getLeaseDashboardStats,
    getNeedAttentionLeases,
    getExpiringLeases, // Kept for compatibility if used elsewhere
    getPendingLeases,
    getLeaseNotifications,
    getLeaseReportStats,
    getLeaseTrackerStats,
    createLease,
    getAllLeases,
    getLeaseById,
    updateLease,
    approveLease
};
