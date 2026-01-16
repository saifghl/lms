const pool = require("../config/db");

/* ================= GET DASHBOARD STATS ================= */
const getDashboardStats = async (req, res) => {
  try {
    // Get total projects
    const [projectsCount] = await pool.execute("SELECT COUNT(*) as count FROM projects WHERE status = 'active'");

    // Get total units
    const [unitsCount] = await pool.execute("SELECT COUNT(*) as count FROM units");

    // Get total owners
    const [ownersCount] = await pool.execute("SELECT COUNT(*) as count FROM owners");

    // Get total tenants
    const [tenantsCount] = await pool.execute("SELECT COUNT(*) as count FROM tenants");

    // Get total leases
    const [leasesCount] = await pool.execute("SELECT COUNT(*) as count FROM leases WHERE status = 'active'");

    // Get total revenue (sum of all active lease rents)
    const [revenue] = await pool.execute(`
      SELECT COALESCE(SUM(monthly_rent), 0) as total_revenue 
      FROM leases 
      WHERE status = 'active'
    `);

    // Get area occupied
    const [areaOccupied] = await pool.execute(`
      SELECT COALESCE(SUM(u.super_area), 0) as occupied_area,
      COALESCE(AVG(l.monthly_rent / NULLIF(u.super_area, 0)), 0) as avg_rent_per_sqft
      FROM units u
      INNER JOIN leases l ON u.id = l.unit_id
      WHERE l.status = 'active' AND u.super_area > 0
    `);

    // Get area vacant
    const [areaVacant] = await pool.execute(`
      SELECT 
        COALESCE(SUM(super_area), 0) as vacant_area,
        COALESCE(AVG(projected_rent / NULLIF(super_area, 0)), 0) as avg_rent_per_sqft
      FROM units
      WHERE status = 'vacant'
    `);

    // Get upcoming renewals (within 90 days)
    const [renewals] = await pool.execute(`
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
    const [expiries] = await pool.execute(`
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
    const [escalations] = await pool.execute(`
      SELECT re.effective_from as effective_date, re.escalation_type as increase_type, re.escalation_value as value, 
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

    // Get Revenue Trends (Last 12 months) - Mocked for now as we might not have payment history
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const finalTrends = [];

    // Generate data for the last 12 months
    for (let i = 0; i < 12; i++) {
      const monthIndex = (currentMonth + i + 1) % 12;
      // Mocking revenue fluctuation around the current total revenue
      // In a real scenario, this would come from a 'payments' table aggregation
      const baseRevenue = parseFloat(revenue[0].total_revenue) || 0;
      const randomFactor = 0.8 + Math.random() * 0.4; // 0.8 to 1.2

      finalTrends.push({
        month: months[monthIndex],
        revenue: Math.round(baseRevenue * randomFactor)
      });
    }

    res.json({
      stats: {
        totalProjects: projectsCount[0].count,
        totalUnits: unitsCount[0].count,
        totalOwners: ownersCount[0].count,
        totalTenants: tenantsCount[0].count,
        totalLeases: leasesCount[0].count,
        totalRevenue: revenue[0].total_revenue
      },
      areaStats: {
        occupied: {
          area: areaOccupied[0].occupied_area,
          avgRentPerSqft: areaOccupied[0].avg_rent_per_sqft
        },
        vacant: {
          area: areaVacant[0].vacant_area,
          avgRentPerSqft: areaVacant[0].avg_rent_per_sqft
        }
      },
      upcomingRenewals: renewals,
      upcomingExpiries: expiries,
      rentEscalations: escalations,
      revenueTrends: finalTrends
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getDashboardStats
};
