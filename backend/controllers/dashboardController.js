const pool = require("../config/db");

const getDashboardStats = async (req, res) => {
  try {
    const connection = await pool.getConnection();

    try {
      // Helper to calculate percentage change
      const calculateChange = (current, previous) => {
        const curr = parseFloat(current) || 0;
        const prev = parseFloat(previous) || 0;

        if (prev === 0) return curr > 0 ? "+100%" : "0%";
        const change = ((curr - prev) / prev) * 100;
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

      // 3. Masters (Total Parties)
      const [partiesCurrent] = await connection.query("SELECT COUNT(*) as count FROM parties");
      const [partiesPrev] = await connection.query("SELECT COUNT(*) as count FROM parties WHERE created_at < DATE_SUB(NOW(), INTERVAL 1 MONTH)");
      const partiesCount = partiesCurrent[0]?.count || 0;
      const prevParties = partiesPrev[0]?.count || 0;

      // 4. Ownerships (Active Links)
      const [ownershipsCurrent] = await connection.query("SELECT COUNT(*) as count FROM unit_ownerships WHERE ownership_status = 'Active'");
      const [ownershipsPrev] = await connection.query("SELECT COUNT(*) as count FROM unit_ownerships WHERE created_at < DATE_SUB(NOW(), INTERVAL 1 MONTH) AND ownership_status = 'Active'");
      const ownershipsCount = ownershipsCurrent[0]?.count || 0;
      const prevOwnerships = ownershipsPrev[0]?.count || 0;

      // 5. Leases
      const [leasesCurrent] = await connection.query("SELECT COUNT(*) as count FROM leases WHERE status = 'active'");
      const [leasesPrev] = await connection.query("SELECT COUNT(*) as count FROM leases WHERE created_at < DATE_SUB(NOW(), INTERVAL 1 MONTH) AND status = 'active'");
      const leasesCount = leasesCurrent[0]?.count || 0;
      const prevLeases = leasesPrev[0]?.count || 0;

      // 6. Revenue (Monthly Run Rate from Active Leases)
      const [revenueCurrent] = await connection.query("SELECT COALESCE(SUM(monthly_rent), 0) as total_revenue FROM leases WHERE status = 'active'");
      // Simple prev calc: Revenue from leases active a month ago (approx by creation date for simplicity)
      const [revenuePrev] = await connection.query("SELECT COALESCE(SUM(monthly_rent), 0) as total_revenue FROM leases WHERE status = 'active' AND created_at < DATE_SUB(NOW(), INTERVAL 1 MONTH)");

      const totalRevenue = revenueCurrent[0]?.total_revenue || 0;
      const prevRevenue = revenuePrev[0]?.total_revenue || 0;

      // 7. Area Stats (Real Calculation)
      // Total Area
      const [totalAreaRes] = await connection.query("SELECT COALESCE(SUM(super_area), 0) as area FROM units");
      const totalArea = parseFloat(totalAreaRes[0]?.area || 0);

      // Occupied Area (Units linked to Active Leases - Distinct Units only)
      const [occupiedAreaRes] = await connection.query(`
        SELECT COALESCE(SUM(super_area), 0) as area
        FROM units
        WHERE id IN (SELECT unit_id FROM leases WHERE status = 'active')
      `);
      const occupiedArea = parseFloat(occupiedAreaRes[0]?.area || 0);

      // Calculate Weighted Average Rent (Total Revenue / Total Occupied Area)
      // If occupiedArea is 0, avoid division by zero
      const avgRentAchieved = occupiedArea > 0 ? (totalRevenue / occupiedArea) : 0;

      const vacantArea = totalArea - occupiedArea;
      // Avg Expected Rent for Vacant (avg of projected_rent from units table)
      const [vacantStats] = await connection.query(`
        SELECT COALESCE(AVG(projected_rent / NULLIF(super_area, 0)), 0) as avg_expected 
        FROM units 
        WHERE id NOT IN (SELECT unit_id FROM leases WHERE status = 'active')
      `);
      const avgExpectedRent = parseFloat(vacantStats[0]?.avg_expected || 0);

      const areaStats = {
        occupied: { area: occupiedArea, avgRentPerSqft: avgRentAchieved.toFixed(2) },
        vacant: { area: vacantArea, avgRentPerSqft: avgExpectedRent.toFixed(2) }
      };

      // 8. Upcoming Renewals (Leases ending in next 90 days)
      const [renewals] = await connection.query(`
        SELECT l.lease_end as lease_end_date, l.id as lease_id, p.project_name, u.unit_number, 
        COALESCE(pt.company_name, CONCAT(pt.first_name, ' ', pt.last_name)) as tenant_name,
        DATEDIFF(l.lease_end, CURDATE()) as days_remaining
        FROM leases l
        LEFT JOIN projects p ON l.project_id = p.id
        LEFT JOIN units u ON l.unit_id = u.id
        LEFT JOIN parties pt ON l.party_tenant_id = pt.id
        WHERE l.status = 'active'
        AND l.lease_end BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 90 DAY)
        ORDER BY l.lease_end ASC
        LIMIT 5
      `);

      // 9. Upcoming Expiries (Leases ending in next 60 days - High Priority)
      const [expiries] = await connection.query(`
        SELECT l.lease_end as lease_end_date, l.id as lease_id, p.project_name, u.unit_number, 
        COALESCE(pt.company_name, CONCAT(pt.first_name, ' ', pt.last_name)) as tenant_name,
        DATEDIFF(l.lease_end, CURDATE()) as days_remaining
        FROM leases l
        LEFT JOIN projects p ON l.project_id = p.id
        LEFT JOIN units u ON l.unit_id = u.id
        LEFT JOIN parties pt ON l.party_tenant_id = pt.id
        WHERE l.status = 'active'
        AND l.lease_end BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 60 DAY)
        ORDER BY l.lease_end ASC
        LIMIT 5
      `);

      // 10. Rent Escalations
      let escalations = [];
      try {
        const [escRows] = await connection.query(`
          SELECT re.effective_from as effective_date, re.increase_type, re.value, 
          l.id as lease_id, p.project_name, u.unit_number,
          DATEDIFF(re.effective_from, CURDATE()) as days_until_escalation
          FROM lease_escalations re
          JOIN leases l ON re.lease_id = l.id
          LEFT JOIN projects p ON l.project_id = p.id
          LEFT JOIN units u ON l.unit_id = u.id
          WHERE re.effective_from BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 90 DAY)
          AND l.status = 'active'
          ORDER BY re.effective_from ASC
          LIMIT 5
        `);
        escalations = escRows;
      } catch (err) {
        console.warn("Escalations query failed", err);
      }

      // 11. Revenue Trends (Calculated from active leases over time)
      // Complexity: Snapshotting revenue for past months is hard without a ledger. 
      // Approximation: Calculate potential revenue for each month based on lease start/end dates.
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const today = new Date();
      const finalTrends = [];

      for (let i = 11; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthName = months[d.getMonth()];
        const year = d.getFullYear();

        // Query sum of rent for leases active in that month
        // Active means: lease_start <= EndOfMonth AND (lease_end >= StartOfMonth OR lease_end IS NULL)
        const startOfMonth = `${year}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
        const endOfMonth = new Date(year, d.getMonth() + 1, 0).toISOString().slice(0, 10);

        const [trendRes] = await connection.query(`
            SELECT COALESCE(SUM(monthly_rent), 0) as revenue 
            FROM leases 
            WHERE lease_start <= ? AND (lease_end >= ? OR lease_end IS NULL)
        `, [endOfMonth, startOfMonth]);

        finalTrends.push({
          month: monthName,
          revenue: parseFloat(trendRes[0]?.revenue || 0)
        });
      }

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
          totalMasters: {
            value: partiesCount,
            change: `${calculateChange(partiesCount, prevParties)} vs last month`,
            type: getChangeType(partiesCount, prevParties)
          },
          totalOwnerships: {
            value: ownershipsCount,
            change: `${calculateChange(ownershipsCount, prevOwnerships)} vs last month`,
            type: "neutral"
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
        areaStats: areaStats,
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
          effective_from: e.effective_date
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
