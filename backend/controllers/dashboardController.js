const pool = require("../config/db");

const getDashboardStats = async (req, res) => {
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
      const projectsCount = projectsCurrent[0]?.count || 0;
      const prevProjects = projectsPrev[0]?.count || 0;

      // 2. Units
      const [unitsCurrent] = await connection.query("SELECT COUNT(*) as count FROM units");
      const [unitsPrev] = await connection.query("SELECT COUNT(*) as count FROM units WHERE created_at < DATE_SUB(NOW(), INTERVAL 1 MONTH)");
      const unitsCount = unitsCurrent[0]?.count || 0;
      const prevUnits = unitsPrev[0]?.count || 0;

      // 3. Owners
      const [ownersCurrent] = await connection.query("SELECT COUNT(*) as count FROM owners");
      const [ownersPrev] = await connection.query("SELECT COUNT(*) as count FROM owners WHERE created_at < DATE_SUB(NOW(), INTERVAL 1 MONTH)");
      const ownersCount = ownersCurrent[0]?.count || 0;
      const prevOwners = ownersPrev[0]?.count || 0;

      // 4. Tenants
      const [tenantsCurrent] = await connection.query("SELECT COUNT(*) as count FROM tenants");
      const [tenantsPrev] = await connection.query("SELECT COUNT(*) as count FROM tenants WHERE created_at < DATE_SUB(NOW(), INTERVAL 1 MONTH)");
      const tenantsCount = tenantsCurrent[0]?.count || 0;
      const prevTenants = tenantsPrev[0]?.count || 0;

      // 5. Leases
      const [leasesCurrent] = await connection.query("SELECT COUNT(*) as count FROM leases");
      const [leasesPrev] = await connection.query("SELECT COUNT(*) as count FROM leases WHERE created_at < DATE_SUB(NOW(), INTERVAL 1 MONTH)");
      const leasesCount = leasesCurrent[0]?.count || 0;
      const prevLeases = leasesPrev[0]?.count || 0;

      // 6. Revenue
      const [revenueCurrent] = await connection.query("SELECT COALESCE(SUM(monthly_rent), 0) as total_revenue FROM leases WHERE status = 'active'");
      const [revenuePrev] = await connection.query("SELECT COALESCE(SUM(monthly_rent), 0) as total_revenue FROM leases WHERE status = 'active' AND created_at < DATE_SUB(NOW(), INTERVAL 1 MONTH)");

      const totalRevenue = revenueCurrent[0]?.total_revenue || 0;
      const prevRevenue = revenuePrev[0]?.total_revenue || 0;

      // NOTE: Area stats are currently mocked to match Management Rep dashboard as per user request
      const areaStatsMock = {
        occupied: { area: 245000, avgRentPerSqft: 57.20 },
        vacant: { area: 42000, avgRentPerSqft: 53.82 }
      };

      // Get upcoming renewals (within 90 days)
      const [renewals] = await connection.query(`
      SELECT l.lease_end as lease_end_date, l.id as lease_id, p.project_name, u.unit_number, t.company_name as tenant_name,
      DATEDIFF(l.lease_end, CURDATE()) as days_remaining
      FROM leases l
      LEFT JOIN projects p ON l.project_id = p.id
      LEFT JOIN units u ON l.unit_id = u.id
      LEFT JOIN tenants t ON l.tenant_id = t.id
      WHERE l.status = 'active'
      AND l.lease_end BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 90 DAY)
      ORDER BY l.lease_end ASC
      LIMIT 5
    `);

      // Get upcoming expiries
      const [expiries] = await connection.query(`
      SELECT l.lease_end as lease_end_date, l.id as lease_id, p.project_name, u.unit_number, t.company_name as tenant_name,
      DATEDIFF(l.lease_end, CURDATE()) as days_remaining
      FROM leases l
      LEFT JOIN projects p ON l.project_id = p.id
      LEFT JOIN units u ON l.unit_id = u.id
      LEFT JOIN tenants t ON l.tenant_id = t.id
      WHERE l.status = 'active'
      AND l.lease_end BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 60 DAY)
      ORDER BY l.lease_end ASC
      LIMIT 5
    `);

      // Get rent escalations (within next 3 months)
      let escalations = [];
      try {
        const [escRows] = await connection.query(`
          SELECT re.effective_from as effective_date, re.increase_type, re.value, 
          l.id as lease_id, p.project_name, u.unit_number,
          DATEDIFF(re.effective_from, CURDATE()) as days_until_escalation
          FROM lease_escalations re
          LEFT JOIN leases l ON re.lease_id = l.id
          LEFT JOIN projects p ON l.project_id = p.id
          LEFT JOIN units u ON l.unit_id = u.id
          WHERE re.effective_from BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 90 DAY)
          AND l.status = 'active'
          ORDER BY re.effective_from ASC
          LIMIT 5
        `);
        escalations = escRows;
      } catch (err) {
        console.warn("Lease escalations fetch failed (table might be missing), returning empty.", err.message);
        escalations = [];
      }

      // Get Revenue Trends (Last 12 months) - Mocked for now as we might not have payment history
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentMonth = new Date().getMonth();
      const finalTrends = [];

      // Generate data for the last 12 months
      for (let i = 0; i < 12; i++) {
        const monthIndex = (currentMonth + i + 1) % 12;
        const baseRevenue = parseFloat(totalRevenue) || 0;
        const randomFactor = 0.8 + Math.random() * 0.4; // 0.8 to 1.2

        finalTrends.push({
          month: months[monthIndex],
          revenue: Math.round(baseRevenue * randomFactor)
        });
      }

      // 4. Construct response similar to rep dashboard
      res.json({
        metrics: {
          totalProjects: {
            value: projectsCount,
            change: `${calculateChange(projectsCount, prevProjects)} vs last month`,
            type: getChangeType(projectsCount, prevProjects)
          },
          totalUnits: {
            value: unitsCount,
            change: `${calculateChange(unitsCount, prevUnits)} vs last month`,
            type: getChangeType(unitsCount, prevUnits)
          },
          totalOwners: {
            value: ownersCount,
            change: `${calculateChange(ownersCount, prevOwners)} vs last month`,
            type: "neutral"
          },
          totalTenants: {
            value: tenantsCount,
            change: `${calculateChange(tenantsCount, prevTenants)} vs last month`,
            type: getChangeType(tenantsCount, prevTenants)
          },
          totalLeases: {
            value: leasesCount,
            change: `${calculateChange(leasesCount, prevLeases)} vs last month`,
            type: getChangeType(leasesCount, prevLeases)
          },
          totalRevenue: {
            value: totalRevenue,
            change: `${calculateChange(totalRevenue, prevRevenue)} YTD`,
            type: getChangeType(totalRevenue, prevRevenue)
          }
        },
        areaStats: areaStatsMock,
        upcomingRenewals: renewals.map(r => ({
          ...r,
          badge: `${r.days_remaining} Days`,
          badgeType: r.days_remaining < 30 ? 'warning' : 'success'
        })),
        upcomingExpiries: expiries.map(e => ({
          ...e,
          badge: e.days_remaining < 30 ? 'HIGH RISK' : 'MEDIUM',
          badgeType: e.days_remaining < 30 ? 'danger' : 'warning'
        })),
        rentEscalations: escalations.map(e => ({
          ...e,
          effective_from: e.effective_date // alias for frontend compatibility if needed
        })),
        revenueTrends: finalTrends
      });

    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getDashboardStats
};
