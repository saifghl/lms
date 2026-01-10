const pool = require("../config/db");

/* ================= GET MANAGEMENT REP DASHBOARD STATS ================= */
exports.getRepDashboardStats = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    try {
      // Get total projects
      let totalProjects = 0;
      try {
        const [projects] = await connection.query("SELECT COUNT(*) as count FROM projects");
        totalProjects = projects[0]?.count || 0;
      } catch (e) {
        console.log("Projects table may not exist:", e.message);
      }

      // Get total units
      let totalUnits = 0;
      try {
        const [units] = await connection.query("SELECT COUNT(*) as count FROM units");
        totalUnits = units[0]?.count || 0;
      } catch (e) {
        console.log("Units table may not exist:", e.message);
      }

      // Get total owners
      let totalOwners = 0;
      try {
        const [owners] = await connection.query("SELECT COUNT(*) as count FROM owners");
        totalOwners = owners[0]?.count || 0;
      } catch (e) {
        console.log("Owners table may not exist:", e.message);
      }

      // Get total tenants
      let totalTenants = 0;
      try {
        const [tenants] = await connection.query("SELECT COUNT(*) as count FROM tenants");
        totalTenants = tenants[0]?.count || 0;
      } catch (e) {
        console.log("Tenants table may not exist:", e.message);
      }

      // Get total leases
      let totalLeases = 0;
      try {
        const [leases] = await connection.query("SELECT COUNT(*) as count FROM leases");
        totalLeases = leases[0]?.count || 0;
      } catch (e) {
        console.log("Leases table may not exist:", e.message);
      }

      // Get total revenue
      let totalRevenue = 0;
      try {
        const [revenue] = await connection.query(`
          SELECT COALESCE(SUM(monthly_rent), 0) as total_revenue 
          FROM leases 
          WHERE status = 'active'
        `);
        totalRevenue = revenue[0]?.total_revenue || 0;
      } catch (e) {
        console.log("Revenue calculation error:", e.message);
      }

      // Get upcoming renewals
      let renewals = [];
      try {
        const [renewalData] = await connection.query(`
          SELECT 
            l.id,
            l.lease_id,
            u.unit_number,
            t.name as tenant_name,
            l.term_end,
            DATEDIFF(l.term_end, CURDATE()) as days_remaining
          FROM leases l
          JOIN units u ON l.unit_id = u.id
          JOIN tenants t ON l.tenant_id = t.id
          WHERE l.status = 'active' 
            AND l.term_end BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 90 DAY)
          ORDER BY l.term_end ASC
          LIMIT 3
        `);
        renewals = renewalData;
      } catch (e) {
        console.log("Renewals query error:", e.message);
      }

      // Get upcoming expiries
      let expiries = [];
      try {
        const [expiryData] = await connection.query(`
          SELECT 
            l.id,
            l.lease_id,
            u.unit_number,
            t.name as tenant_name,
            l.term_end,
            DATEDIFF(l.term_end, CURDATE()) as days_remaining
          FROM leases l
          JOIN units u ON l.unit_id = u.id
          JOIN tenants t ON l.tenant_id = t.id
          WHERE l.status = 'active' 
            AND l.term_end BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 60 DAY)
          ORDER BY l.term_end ASC
          LIMIT 3
        `);
        expiries = expiryData;
      } catch (e) {
        console.log("Expiries query error:", e.message);
      }

      const stats = {
        metrics: {
          totalProjects: {
            value: totalProjects,
            change: "+2% vs last month",
            type: "positive"
          },
          totalUnits: {
            value: totalUnits,
            change: "+5% vs last month",
            type: "negative"
          },
          totalOwners: {
            value: totalOwners,
            change: "~ 0% change",
            type: "neutral"
          },
          totalTenants: {
            value: totalTenants,
            change: "+3% vs last month",
            type: "positive"
          },
          totalLeases: {
            value: totalLeases,
            change: "+4% vs last month",
            type: "positive"
          },
          totalRevenue: {
            value: totalRevenue > 0 ? `₹${(totalRevenue / 100000).toFixed(1)}M` : "₹0.0M",
            change: "+12% YTD",
            type: "negative"
          }
        },
        upcomingRenewals: renewals.map(r => ({
          id: r.id,
          leaseId: r.lease_id,
          unit: `Unit ${r.unit_number}`,
          tenant: r.tenant_name,
          date: r.term_end,
          daysRemaining: r.days_remaining,
          badge: `${r.days_remaining} Days`,
          badgeType: r.days_remaining < 30 ? 'warning' : 'success'
        })),
        upcomingExpiries: expiries.map(e => ({
          id: e.id,
          leaseId: e.lease_id,
          unit: `Unit ${e.unit_number}`,
          tenant: e.tenant_name,
          date: e.term_end,
          daysRemaining: e.days_remaining,
          badge: e.days_remaining < 30 ? 'HIGH RISK' : e.days_remaining < 60 ? 'MEDIUM' : 'LOW',
          badgeType: e.days_remaining < 30 ? 'danger' : e.days_remaining < 60 ? 'warning' : 'success'
        })),
        rentEscalations: []
      };

      res.json(stats);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Rep dashboard stats error:", error);
    // Return default stats on error
    res.json({
      metrics: {
        totalProjects: { value: 0, change: "0% change", type: "neutral" },
        totalUnits: { value: 0, change: "0% change", type: "neutral" },
        totalOwners: { value: 0, change: "0% change", type: "neutral" },
        totalTenants: { value: 0, change: "0% change", type: "neutral" },
        totalLeases: { value: 0, change: "0% change", type: "neutral" },
        totalRevenue: { value: "₹0.0M", change: "0% change", type: "neutral" }
      },
      upcomingRenewals: [],
      upcomingExpiries: [],
      rentEscalations: []
    });
  }
};

/* ================= GET REPORTS ================= */
exports.getRepReports = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const { project_id, owner_id, tenant_id, page = 1, limit = 10 } = req.query;
    
    try {
      let query = `
        SELECT 
          p.id as project_id,
          p.project_name,
          p.project_image,
          COUNT(DISTINCT l.id) as lease_count,
          MAX(l.created_at) as last_report_date
        FROM projects p
        LEFT JOIN units u ON p.id = u.project_id
        LEFT JOIN leases l ON u.id = l.unit_id
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
      
      query += " GROUP BY p.id, p.project_name, p.project_image";
      query += " ORDER BY last_report_date DESC";
      
      const [reports] = await connection.query(query, params);
      
      res.json({
        data: reports.map(report => ({
          id: `P-${report.project_id}`,
          name: report.project_name,
          image: report.project_image ? `/uploads/${report.project_image}` : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=50&h=50&fit=crop',
          date: report.last_report_date ? new Date(report.last_report_date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A',
          type: 'Monthly lease',
          status: report.lease_count > 0 ? 'Ready' : 'Planning'
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
    // Return empty array on error
    res.json({
      data: [],
      pagination: {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        total: 0,
        totalPages: 0
      }
    });
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
    // Return empty array on error
    res.json({
      data: [],
      pagination: {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        total: 0,
        totalPages: 0
      }
    });
  }
};

/* ================= GET DOCUMENTS ================= */
exports.getDocuments = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const { category, page = 1, limit = 10 } = req.query;
    
    try {
      let query = `
        SELECT 
          d.*,
          p.project_name,
          p.project_image,
          u.name as uploaded_by_name
        FROM documents d
        LEFT JOIN projects p ON d.project_id = p.id
        LEFT JOIN users u ON d.uploaded_by = u.id
        WHERE 1=1
      `;
      
      const params = [];
      
      if (category) {
        query += " AND d.category = ?";
        params.push(category);
      }
      
      query += " ORDER BY d.created_at DESC";
      
      const [documents] = await connection.query(query, params);
      
      res.json({
        data: documents.map(doc => ({
          id: `P-${doc.project_id}`,
          projectName: doc.project_name || 'Unknown Project',
          image: doc.file_path || (doc.project_image ? `/uploads/${doc.project_image}` : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=50&h=50&fit=crop'),
          date: doc.created_at ? new Date(doc.created_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A',
          uploadedBy: doc.uploaded_by_name || 'Unknown User',
          category: doc.category || 'General'
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
    // Return empty array on error
    res.json({
      data: [],
      pagination: {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        total: 0,
        totalPages: 0
      }
    });
  }
};

/* ================= UPLOAD DOCUMENT ================= */
exports.uploadDocument = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const {
      project_id,
      category,
      file_path,
      uploaded_by
    } = req.body;
    
    try {
      const [result] = await connection.query(`
        INSERT INTO documents 
        (project_id, category, file_path, uploaded_by)
        VALUES (?, ?, ?, ?)
      `, [project_id, category, file_path, uploaded_by]);
      
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

