const pool = require("../config/db");

const getDashboardStats = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const projectId = req.query.project_id || null;

    // Filters for dynamic queries
    const pFilter = projectId ? "WHERE id = ?" : "";
    const pFilterAnd = projectId ? "AND id = ?" : "";
    const uFilter = projectId ? "WHERE project_id = ?" : "";
    const uFilterAnd = projectId ? "AND project_id = ?" : "";
    const uAliasFilter = projectId ? "WHERE u.project_id = ?" : "";
    const uAliasFilterAnd = projectId ? "AND u.project_id = ?" : "";
    const lFilterAnd = projectId ? "AND project_id = ?" : "";
    
    const params = projectId ? [projectId] : [];

    // Default response structure with safe defaults
    const response = {
      topRow: {
        totalProjects: { value: 0, label: "Total Projects" },
        totalUnits: { value: 0, label: "Total Units" },
        totalProjectArea: { value: 0, label: "Total Project Area", unit: "sq ft" }
      },
      secondRow: {
        unitsSold: { value: 0, label: "Units Sold" },
        unitsUnsold: { value: 0, label: "Units Unsold" },
        areaSold: { value: 0, label: "Area Sold", unit: "sq ft" },
        areaUnsold: { value: 0, label: "Area Unsold", unit: "sq ft" },
        unitOwnership: { value: 0, label: "Unit Ownerships" }
      },
      thirdRow: {
        unitsLeased: { value: 0, label: "Units Leased" },
        unitsVacant: { value: 0, label: "Units Vacant" },
        areaLeased: { value: 0, label: "Area Leased", unit: "sq ft" },
        areaVacant: { value: 0, label: "Area Vacant", unit: "sq ft" },
        totalLessees: { value: 0, label: "Total Lessees" }
      },
      financials: {
        rentMonth: { value: 0, label: "Rent (Month)" },
        rentYear: { value: 0, label: "Rent (Year)" },
        opportunityLoss: { value: 0, label: "Opportunity Loss (Vacancy)" },
        avgActualRent: { value: "0.00", label: "Avg Actual Rent / Sqft" },
        avgProjectedRent: { value: "0.00", label: "Avg Projected Rent / Sqft" },
        deviation: { value: "0.00", percent: "0%", label: "Deviation" }
      },
      graphs: {
        revenueTrends: []
      }
    };

    try {
      // --- 1. Top Row: Projects, Units, Total Area ---
      let totalProjects = 0;
      try {
        const [projRows] = await connection.query(`SELECT COUNT(*) as count FROM projects ${pFilter}`, params);
        totalProjects = projRows[0]?.count || 0;
        response.topRow.totalProjects.value = totalProjects;
      } catch (e) { console.error("Error fetching projects:", e.message); }

      let totalUnits = 0;
      let totalProjectArea = 0;
      let globalProjectedRentTotal = 0;
      try {
        const [unitRows] = await connection.query(`SELECT COUNT(*) as count, COALESCE(SUM(chargeable_area), 0) as total_area, COALESCE(SUM(projected_rent * COALESCE(chargeable_area, 0)), 0) as total_projected_rent FROM units ${uFilter}`, params);
        totalUnits = unitRows[0]?.count || 0;
        totalProjectArea = parseFloat(unitRows[0]?.total_area || 0);
        globalProjectedRentTotal = parseFloat(unitRows[0]?.total_projected_rent || 0);

        response.topRow.totalUnits.value = totalUnits;
        response.topRow.totalProjectArea.value = totalProjectArea;
      } catch (e) { console.error("Error fetching units:", e.message); }

      // --- 2. Second Row: Sold vs Unsold (Based on Ownership) ---
      let unitsSold = 0;
      let areaSold = 0;
      try {
        const [soldRows] = await connection.query(`
            SELECT COUNT(DISTINCT u.id) as count, COALESCE(SUM(u.chargeable_area), 0) as area
            FROM units u
            JOIN unit_ownerships uo ON u.id = uo.unit_id
            WHERE uo.ownership_status = 'Active' ${uAliasFilterAnd}
          `, params);
        unitsSold = soldRows[0]?.count || 0;
        areaSold = parseFloat(soldRows[0]?.area || 0);

        response.secondRow.unitsSold.value = unitsSold;
        response.secondRow.areaSold.value = areaSold;
        response.secondRow.unitsUnsold.value = totalUnits - unitsSold;
        response.secondRow.areaUnsold.value = totalProjectArea - areaSold;
      } catch (e) { console.error("Error fetching sales:", e.message); }

      try {
        const [ownershipRows] = await connection.query(`
            SELECT COUNT(DISTINCT uo.party_id) as count 
            FROM unit_ownerships uo
            JOIN units u ON u.id = uo.unit_id
            WHERE uo.ownership_status = 'Active' ${uAliasFilterAnd}
          `, params);
        response.secondRow.unitOwnership.value = ownershipRows[0]?.count || 0;
      } catch (e) { console.error("Error fetching ownership:", e.message); }

      // --- 3. Third Row: Leased vs Vacant (Based on Leases) ---
      let unitsLeased = 0;
      let areaLeased = 0;
      let totalActualRentMonthly = 0;
      try {
        // Need to pass params multiple times if used multiple times in the query
        // The safest way is to inject the ID if it's a number, or just pass the array 3 times
        const pArr = projectId ? [projectId, projectId, projectId] : [];
        const [leasedRows] = await connection.query(`
            SELECT 
                (SELECT COUNT(DISTINCT unit_id) FROM leases WHERE status = 'active' AND CURDATE() >= lease_start AND (CURDATE() <= lease_end OR lease_end IS NULL) ${lFilterAnd}) as count,
                (SELECT COALESCE(SUM(chargeable_area), 0) FROM units WHERE id IN (SELECT unit_id FROM leases WHERE status = 'active' AND CURDATE() >= lease_start AND (CURDATE() <= lease_end OR lease_end IS NULL) ${lFilterAnd}) ${uFilterAnd}) as area,
                (SELECT COALESCE(SUM(monthly_rent), 0) FROM leases WHERE status = 'active' AND CURDATE() >= lease_start AND (CURDATE() <= lease_end OR lease_end IS NULL) ${lFilterAnd}) as total_rent
          `, pArr);
        unitsLeased = leasedRows[0]?.count || 0;
        areaLeased = parseFloat(leasedRows[0]?.area || 0);
        totalActualRentMonthly = parseFloat(leasedRows[0]?.total_rent || 0);

        response.thirdRow.unitsLeased.value = unitsLeased;
        response.thirdRow.areaLeased.value = areaLeased;
        response.thirdRow.unitsVacant.value = totalUnits - unitsLeased;
        response.thirdRow.areaVacant.value = totalProjectArea - areaLeased;
      } catch (e) { console.error("Error fetching leases:", e.message); }

      try {
        const [lesseeRows] = await connection.query(`SELECT COUNT(DISTINCT party_tenant_id) as count FROM leases WHERE status = 'active' AND CURDATE() >= lease_start AND (CURDATE() <= lease_end OR lease_end IS NULL) ${lFilterAnd}`, params);
        response.thirdRow.totalLessees.value = lesseeRows[0]?.count || 0;
      } catch (e) { console.error("Error fetching lessees:", e.message); }

      // --- 4. Financial Dashboard ---
      const rentForMonth = totalActualRentMonthly;
      const rentForYear = rentForMonth * 12;

      response.financials.rentMonth.value = rentForMonth;
      response.financials.rentYear.value = rentForYear;

      try {
        const [vacantProjRows] = await connection.query(`
            SELECT COALESCE(SUM(projected_rent * COALESCE(chargeable_area, 0)), 0) as loss
            FROM units u
            WHERE u.id NOT IN (SELECT unit_id FROM leases WHERE status = 'active' AND CURDATE() >= lease_start AND (CURDATE() <= lease_end OR lease_end IS NULL) ${lFilterAnd})
            ${uAliasFilterAnd}
          `, projectId ? [projectId, projectId] : []);
        response.financials.opportunityLoss.value = parseFloat(vacantProjRows[0]?.loss || 0);
      } catch (e) { console.error("Error fetching vacancy loss:", e.message); }

      const avgActualRentPerSqft = areaLeased > 0 ? (rentForMonth / areaLeased) : 0;
      const avgProjectedRentPerSqft = totalProjectArea > 0 ? (globalProjectedRentTotal / totalProjectArea) : 0;
      const deviation = avgActualRentPerSqft - avgProjectedRentPerSqft;
      const deviationPercent = avgProjectedRentPerSqft > 0 ? ((deviation / avgProjectedRentPerSqft) * 100) : 0;

      response.financials.avgActualRent.value = avgActualRentPerSqft.toFixed(2);
      response.financials.avgProjectedRent.value = avgProjectedRentPerSqft.toFixed(2);
      response.financials.deviation.value = deviation.toFixed(2);
      response.financials.deviation.percent = deviationPercent.toFixed(1) + '%';

      // ii. Revenue Graph (Trends)
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const today = new Date();
      const revenueTrends = [];

      try {
        for (let i = 11; i >= 0; i--) {
          const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
          const monthName = months[d.getMonth()];
          const year = d.getFullYear();
          const startOfMonth = `${year}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
          const endOfMonth = new Date(year, d.getMonth() + 1, 0).toISOString().slice(0, 10);

          const trendParams = projectId ? [endOfMonth, startOfMonth, projectId] : [endOfMonth, startOfMonth];
          const [trendRes] = await connection.query(`
                SELECT COALESCE(SUM(monthly_rent), 0) as revenue 
                FROM leases 
                WHERE lease_start <= ? AND (lease_end >= ? OR lease_end IS NULL) ${lFilterAnd}
            `, trendParams);

          revenueTrends.push({
            month: monthName,
            revenue: parseFloat(trendRes[0]?.revenue || 0)
          });
        }
        response.graphs.revenueTrends = revenueTrends;
      } catch (e) { console.error("Error fetching trends:", e.message); }

      res.json(response);

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
