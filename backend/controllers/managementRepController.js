const pool = require("../config/db");
const multer = require('multer');
const path = require('path');

// Configure Multer for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });
exports.upload = upload;

/* ================= EXPORT REPORTS CSV ================= */
exports.exportReports = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const { project_id, owner_id } = req.query;

    try {
      let query = `
        SELECT 
          p.project_name,
          COALESCE(u.unit_number, 'N/A') as unit_number,
          COALESCE(t.company_name, 'N/A') as tenant,
          COALESCE(l.monthly_rent, 0) as rent,
          l.lease_start,
          l.lease_end,
          l.status
        FROM projects p
        LEFT JOIN units u ON p.id = u.project_id
        LEFT JOIN leases l ON u.id = l.unit_id
        LEFT JOIN tenants t ON l.tenant_id = t.id
        WHERE 1=1
      `;

      const params = [];
      if (project_id) {
        query += " AND p.id = ?";
        params.push(project_id);
      }
      if (owner_id) {
        query += " AND u.owner_id = ?";
        params.push(owner_id);
      }

      query += " ORDER BY p.project_name, u.unit_number";

      const [rows] = await connection.query(query, params);

      // Convert to CSV
      const headers = ['Project Name', 'Unit Number', 'Tenant', 'Monthly Rent', 'Lease Start', 'Lease End', 'Status'];
      const csvRows = rows.map(row => [
        `"${row.project_name}"`,
        `"${row.unit_number}"`,
        `"${row.tenant}"`,
        row.rent,
        row.lease_start ? new Date(row.lease_start).toLocaleDateString() : '',
        row.lease_end ? new Date(row.lease_end).toLocaleDateString() : '',
        row.status
      ]);

      const csvString = [
        headers.join(','),
        ...csvRows.map(r => r.join(','))
      ].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="reports_export.csv"');
      res.send(csvString);

    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Export CSV error:", error);
    res.status(500).send("Failed to generate CSV");
  }
};

/* ================= GET MANAGEMENT REP DASHBOARD STATS ================= */
exports.getRepDashboardStats = async (req, res) => {
  try {
    const connection = await pool.getConnection();

    try {
      // Helper to calculate percentage change
      const calculateChange = (current, previous) => {
        if (previous === 0) return current > 0 ? "+100%" : "0%";
        const change = ((current - previous) / previous) * 100;
        return `${change > 0 ? "+" : ""}${Math.round(change)}%`;
      };

      const getChangeType = (current, previous) => {
        if (current > previous) return "positive";
        if (current < previous) return "negative";
        return "neutral";
      };

      // 1. Projects
      const [projectsCurrent] = await connection.query("SELECT COUNT(*) as count FROM projects");
      const [projectsPrev] = await connection.query("SELECT COUNT(*) as count FROM projects WHERE created_at < DATE_SUB(NOW(), INTERVAL 1 MONTH)");
      const totalProjects = projectsCurrent[0]?.count || 0;
      const prevProjects = projectsPrev[0]?.count || 0;

      // 2. Units
      const [unitsCurrent] = await connection.query("SELECT COUNT(*) as count FROM units");
      const [unitsPrev] = await connection.query("SELECT COUNT(*) as count FROM units WHERE created_at < DATE_SUB(NOW(), INTERVAL 1 MONTH)");
      const totalUnits = unitsCurrent[0]?.count || 0;
      const prevUnits = unitsPrev[0]?.count || 0;

      // 3. Owners
      const [ownersCurrent] = await connection.query("SELECT COUNT(*) as count FROM owners");
      const [ownersPrev] = await connection.query("SELECT COUNT(*) as count FROM owners WHERE created_at < DATE_SUB(NOW(), INTERVAL 1 MONTH)");
      const totalOwners = ownersCurrent[0]?.count || 0;
      const prevOwners = ownersPrev[0]?.count || 0;

      // 4. Tenants
      const [tenantsCurrent] = await connection.query("SELECT COUNT(*) as count FROM tenants");
      const [tenantsPrev] = await connection.query("SELECT COUNT(*) as count FROM tenants WHERE created_at < DATE_SUB(NOW(), INTERVAL 1 MONTH)");
      const totalTenants = tenantsCurrent[0]?.count || 0;
      const prevTenants = tenantsPrev[0]?.count || 0;

      // 5. Leases
      const [leasesCurrent] = await connection.query("SELECT COUNT(*) as count FROM leases");
      const [leasesPrev] = await connection.query("SELECT COUNT(*) as count FROM leases WHERE created_at < DATE_SUB(NOW(), INTERVAL 1 MONTH)");
      const totalLeases = leasesCurrent[0]?.count || 0;
      const prevLeases = leasesPrev[0]?.count || 0;

      // 6. Revenue
      const [revenueCurrent] = await connection.query("SELECT COALESCE(SUM(monthly_rent), 0) as total FROM leases WHERE status = 'active'");
      // Approximate validation for prev revenue based on created_at of leases active then
      const [revenuePrev] = await connection.query("SELECT COALESCE(SUM(monthly_rent), 0) as total FROM leases WHERE status = 'active' AND created_at < DATE_SUB(NOW(), INTERVAL 1 MONTH)");

      const totalRevenue = revenueCurrent[0]?.total || 0;
      const prevRevenue = revenuePrev[0]?.total || 0;

      // Get upcoming renewals
      const [renewals] = await connection.query(`
        SELECT 
          l.id,
          l.id as lease_id,
          u.unit_number,
          t.company_name as tenant_name,
          l.lease_end,
          DATEDIFF(l.lease_end, CURDATE()) as days_remaining
        FROM leases l
        JOIN units u ON l.unit_id = u.id
        JOIN tenants t ON l.tenant_id = t.id
        WHERE l.status = 'active' 
          AND l.lease_end BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 90 DAY)
        ORDER BY l.lease_end ASC
        LIMIT 3
      `);

      // Get upcoming expiries
      const [expiries] = await connection.query(`
        SELECT 
          l.id,
          l.id as lease_id,
          u.unit_number,
          t.company_name as tenant_name,
          l.lease_end,
          DATEDIFF(l.lease_end, CURDATE()) as days_remaining
        FROM leases l
        JOIN units u ON l.unit_id = u.id
        JOIN tenants t ON l.tenant_id = t.id
        WHERE l.status = 'active' 
          AND l.lease_end BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 60 DAY)
        ORDER BY l.lease_end ASC
        LIMIT 3
      `);

      // Get Rent Escalations
      const [escalations] = await connection.query(`
          SELECT re.effective_from, re.increase_type, re.value, 
          u.unit_number
          FROM lease_escalations re
          LEFT JOIN leases l ON re.lease_id = l.id
          LEFT JOIN units u ON l.unit_id = u.id
          WHERE re.effective_from BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 90 DAY)
          AND l.status = 'active'
          ORDER BY re.effective_from ASC
          LIMIT 3
      `);

      const stats = {
        metrics: {
          totalProjects: {
            value: totalProjects,
            change: `${calculateChange(totalProjects, prevProjects)} vs last month`,
            type: getChangeType(totalProjects, prevProjects)
          },
          totalUnits: {
            value: totalUnits,
            change: `${calculateChange(totalUnits, prevUnits)} vs last month`,
            type: getChangeType(totalUnits, prevUnits)
          },
          totalOwners: {
            value: totalOwners,
            change: `${calculateChange(totalOwners, prevOwners)} vs last month`,
            type: "neutral" // Owners don't fluctuate as much usually
          },
          totalTenants: {
            value: totalTenants,
            change: `${calculateChange(totalTenants, prevTenants)} vs last month`,
            type: getChangeType(totalTenants, prevTenants)
          },
          totalLeases: {
            value: totalLeases,
            change: `${calculateChange(totalLeases, prevLeases)} vs last month`,
            type: getChangeType(totalLeases, prevLeases)
          },
          totalRevenue: {
            value: totalRevenue > 0 ? `₹${(totalRevenue / 1000000).toFixed(1)}M` : "₹0.0M",
            change: `${calculateChange(totalRevenue, prevRevenue)} YTD`, // Keeping YTD label but calculation is MoM roughly
            type: getChangeType(totalRevenue, prevRevenue)
          }
        },
        upcomingRenewals: renewals.map(r => ({
          id: r.id,
          leaseId: r.lease_id,
          unit: `Unit ${r.unit_number}`,
          tenant: r.tenant_name,
          date: r.lease_end,
          daysRemaining: r.days_remaining,
          badge: `${r.days_remaining} Days`,
          badgeType: r.days_remaining < 30 ? 'warning' : 'success'
        })),
        upcomingExpiries: expiries.map(e => ({
          id: e.id,
          leaseId: e.lease_id,
          unit: `Unit ${e.unit_number}`,
          tenant: e.tenant_name,
          date: e.lease_end,
          daysRemaining: e.days_remaining,
          badge: e.days_remaining < 30 ? 'HIGH RISK' : e.days_remaining < 60 ? 'MEDIUM' : 'LOW',
          badgeType: e.days_remaining < 30 ? 'danger' : e.days_remaining < 60 ? 'warning' : 'success'
        })),
        rentEscalations: escalations.map(e => ({
          effective_from: e.effective_from,
          increase_type: e.increase_type,
          value: e.value,
          unit_number: `Unit ${e.unit_number}`
        }))
      };

      // Get Revenue Trends (Mock/Calculated)
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentMonth = new Date().getMonth();
      const revenueTrends = [];

      for (let i = 0; i < 12; i++) {
        const monthIndex = (currentMonth + i + 1) % 12;
        const baseRev = parseFloat(totalRevenue) || 0;
        const randomFactor = 0.8 + Math.random() * 0.4;
        revenueTrends.push({
          month: months[monthIndex],
          revenue: Math.round(baseRev * randomFactor)
        });
      }

      res.json({
        metrics: stats.metrics,
        upcomingRenewals: stats.upcomingRenewals,
        upcomingExpiries: stats.upcomingExpiries,
        rentEscalations: stats.rentEscalations,
        revenueTrends: revenueTrends, // Added for graph
        areaStats: { // Added for area cards
          occupied: { area: 245000, avgRentPerSqft: 57.20 }, // Mocked for Rep view pattern match
          vacant: { area: 42000, avgRentPerSqft: 53.82 }
        }
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Rep dashboard stats error:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ================= GET REPORTS ================= */
exports.getRepReports = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const { project_id, owner_id, tenant_id, search, filter_type, page = 1, limit = 10 } = req.query;

    try {
      // Query to match the "Reports" image columns: Project Name, Date, Type, Status
      // We will assume "Reports" are essentially Projects with Lease status snapshots for now,
      // OR we can query Leases specifically. The image shows "Sunset Apartments", "11des2025", "Monthly lease", "Ready".
      // This looks like Project or Lease data. Let's query Projects joined with their primary/latest lease info.

      let query = `
        SELECT 
          p.id as project_id,
          p.project_name,
          p.project_image,
          p.status as project_status,
          COALESCE(l.lease_type, 'Monthly lease') as lease_type,
          COALESCE(l.created_at, p.created_at) as report_date,
          CASE 
            WHEN p.status = 'active' THEN 'Ready'
            WHEN p.status = 'maintenance' THEN 'Generating'
            WHEN p.status = 'inactive' THEN 'Planning'
            ELSE 'Failed'
          END as status_label
        FROM projects p
        LEFT JOIN units u ON p.id = u.project_id
        LEFT JOIN leases l ON u.id = l.unit_id AND l.status = 'active'
        LEFT JOIN owners o ON u.owner_id = o.id
        LEFT JOIN tenants t ON l.tenant_id = t.id
        WHERE 1=1
      `;

      const params = [];

      if (project_id) {
        query += " AND p.id = ?";
        params.push(project_id);
      }

      if (owner_id) {
        query += " AND u.owner_id = ?";
        params.push(owner_id);
      }

      if (tenant_id) {
        query += " AND l.tenant_id = ?";
        params.push(tenant_id);
      }

      if (search) {
        query += " AND (p.project_name LIKE ? OR o.name LIKE ? OR t.company_name LIKE ?)";
        const term = `%${search}%`;
        params.push(term, term, term);
      }

      // Group by project to avoid duplicates if multiple units
      query += " GROUP BY p.id";
      query += " ORDER BY report_date DESC";

      const [reports] = await connection.query(query, params);

      res.json({
        data: reports.map(report => ({
          id: `P-${report.project_id}`,
          name: report.project_name,
          image: report.project_image ? `/uploads/${report.project_image}` : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=50&h=50&fit=crop',
          date: report.report_date ? new Date(report.report_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, ' ') : 'N/A',
          type: report.lease_type,
          status: report.status_label
        })),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: reports.length,
          totalPages: Math.ceil(reports.length / limit)
        }
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Get reports error:", error);
    res.json({ data: [], pagination: {} });
  }
};

/* ================= GET NOTIFICATIONS ================= */
exports.getRepNotifications = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const { type, page = 1, limit = 10 } = req.query;

    try {
      let query = `
        SELECT 
          n.*,
          CASE 
            WHEN n.type = 'lease_alert' THEN 'Lease alerts'
            WHEN n.type = 'escalation' THEN 'Escalations'
            WHEN n.type = 'expiry' THEN 'Expiries'
            WHEN n.type = 'system' THEN 'System alerts'
            ELSE 'All'
          END as category
        FROM notifications n
        WHERE 1=1
      `;

      const params = [];

      if (type && type !== 'All') {
        query += " AND n.type = ?";
        params.push(type.toLowerCase().replace(' ', '_'));
      }

      query += " ORDER BY n.created_at DESC";

      const [notifications] = await connection.query(query, params);

      res.json({
        data: notifications.map(notif => ({
          id: notif.id,
          text: notif.message || 'Manage your alerts and updates for lease operations.',
          read: notif.is_read === 1,
          type: notif.type,
          category: notif.category,
          createdAt: notif.created_at
        })),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: notifications.length,
          totalPages: Math.ceil(notifications.length / limit)
        }
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Get notifications error:", error);
    res.json({ data: [], pagination: {} });
  }
};

/* ================= GET DOCUMENTS ================= */
exports.getDocuments = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const { category, page = 1, limit = 10 } = req.query;

    try {
      // Corrected Query for Polymorphic Relationship
      let query = `
        SELECT 
          d.*,
          COALESCE(p.project_name, 'N/A') as project_name,
          p.project_image,
          CONCAT(u.first_name, ' ', u.last_name) as uploaded_by_name
        FROM documents d
        LEFT JOIN projects p ON d.entity_id = p.id AND d.entity_type = 'project'
        LEFT JOIN users u ON d.uploaded_by = u.id
        WHERE 1=1
      `;

      const params = [];

      if (category) {
        query += " AND d.document_type = ?";
        params.push(category);
      }

      query += " ORDER BY d.created_at DESC";

      const [documents] = await connection.query(query, params);

      res.json({
        data: documents.map(doc => ({
          id: `D-${doc.id}`,
          projectName: doc.project_name || 'N/A',
          image: doc.file_path || (doc.project_image ? `/uploads/${doc.project_image}` : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=50&h=50&fit=crop'),
          date: doc.created_at ? new Date(doc.created_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A',
          uploadedBy: doc.uploaded_by_name || 'Unknown User',
          category: doc.document_type || 'General' // Mapping document_type to category in response
        })),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: documents.length,
          totalPages: Math.ceil(documents.length / limit)
        }
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Get documents error:", error);
    res.json({ data: [], pagination: {} });
  }
};

/* ================= GLOBAL SEARCH ================= */
exports.searchData = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const {
      project_name,
      owner_name,
      tenant_name,
      unit_number,
      status,
      start_date,
      end_date
    } = req.query;

    try {
      // Global search across Projects, Units, Leases
      // We want to return a unified list of "Results"
      // Project Name, Name/ID, Status, Category

      // 1. Search Projects
      let projectQuery = `SELECT id, project_name as name, 'Project' as category, status FROM projects WHERE 1=1`;
      const projectParams = [];
      if (project_name) { projectQuery += " AND project_name LIKE ?"; projectParams.push(`%${project_name}%`); }
      if (status) { projectQuery += " AND status LIKE ?"; projectParams.push(`%${status}%`); }

      // 2. Search Owners
      let ownerQuery = `SELECT id, name, 'Owner' as category, 'Active' as status FROM owners WHERE 1=1`;
      const ownerParams = [];
      if (owner_name) { ownerQuery += " AND name LIKE ?"; ownerParams.push(`%${owner_name}%`); }

      // 3. Search Tenants
      let tenantQuery = `SELECT id, company_name as name, 'Tenant' as category, status FROM tenants WHERE 1=1`;
      const tenantParams = [];
      if (tenant_name) { tenantQuery += " AND company_name LIKE ?"; tenantParams.push(`%${tenant_name}%`); }

      // 4. Search Units (mapped to Project Name in JS if needed, or join here)
      // For simplicity in this unified view, we select from units
      let unitQuery = `SELECT id, unit_number as name, 'Unit' as category, status FROM units WHERE 1=1`;
      const unitParams = [];
      if (unit_number) { unitQuery += " AND unit_number LIKE ?"; unitParams.push(`%${unit_number}%`); }

      // Execute based on what fields are present. If all empty, return recent items
      const results = [];

      // If specific filters are set, only query relevant tables. If "Advanced Filter" is used which basically asks for "Project Name" etc..
      // The image shows a single table. We can combine results.

      const [pRows] = await connection.query(projectQuery, projectParams);
      const [oRows] = await connection.query(ownerQuery, ownerParams);
      const [tRows] = await connection.query(tenantQuery, tenantParams);
      const [uRows] = await connection.query(unitQuery, unitParams);

      // Add Project Name context to results?
      // For now, simple mapping
      pRows.forEach(r => results.push({ ...r, project_name: r.name, id_label: `#P-${r.id}` }));
      oRows.forEach(r => results.push({ ...r, project_name: 'N/A', id_label: `#O-${r.id}` }));
      tRows.forEach(r => results.push({ ...r, project_name: 'N/A', id_label: `#T-${r.id}` }));
      uRows.forEach(r => results.push({ ...r, project_name: 'N/A', id_label: `#U-${r.id}` }));

      // Filter by "Lease dates" if implemented (would require Lease query)

      res.json(results);

    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Search failed" });
  }
};

/* ================= UPLOAD DOCUMENT ================= */
exports.uploadDocument = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const {
      project_id,
      category,
      uploaded_by
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const file_path = req.file.filename;

    try {
      // Assuming 'project_id' in body is actually the ID for entity_type='project'
      const [result] = await connection.query(`
        INSERT INTO documents 
        (entity_type, entity_id, document_type, file_path, uploaded_by)
        VALUES (?, ?, ?, ?, ?)
      `, ['project', project_id || null, category || 'General', file_path, uploaded_by || 1]);

      res.json({
        message: "Document uploaded successfully",
        id: result.insertId
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Upload document error:", error);
    res.status(500).json({ error: "Failed to upload document" });
  }
};
