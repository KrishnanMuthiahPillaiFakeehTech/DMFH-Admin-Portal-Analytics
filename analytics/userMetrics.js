
const { formatDate, formatDuration } = require('../utils/utils');
const { runReportWithThrottle } = require('../client/gaClient');

async function getUserMetrics(startDate, endDate) {
  const [response] = await runReportWithThrottle({
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: 'date' }],
    metrics: [
      { name: 'totalUsers' },
      { name: 'newUsers' },
      { name: 'activeUsers' },
      { name: 'averageSessionDuration' },
      { name: 'purchaseRevenue' },
    ],
    orderBys: [{ dimension: { dimensionName: 'date' }, desc: false }],
  });

  const rows = response.rows || [];

  let maxTotalUsers = 0;
  let maxNewUsers = 0;
  let maxActiveUsers = 0;
  let maxDurationSeconds = 0;
  let maxRevenue = 0;

  const data = rows.map(row => {
    const rawDate = row.dimensionValues[0]?.value;
    const totalUsers = parseInt(row.metricValues[0]?.value || '0');
    const newUsers = parseInt(row.metricValues[1]?.value || '0');
    const activeUsers = parseInt(row.metricValues[2]?.value || '0');
    const sessionDurationSec = parseFloat(row.metricValues[3]?.value || '0');
    const revenue = parseFloat(row.metricValues[4]?.value || '0');

    // Track max values
    if (totalUsers > maxTotalUsers) maxTotalUsers = totalUsers;
    if (newUsers > maxNewUsers) maxNewUsers = newUsers;
    if (activeUsers > maxActiveUsers) maxActiveUsers = activeUsers;
    if (sessionDurationSec > maxDurationSeconds) maxDurationSeconds = sessionDurationSec;
    if (revenue > maxRevenue) maxRevenue = revenue;

    return {
      date: formatDate(rawDate), // Convert YYYYMMDD → DD-MM-YYYY
      totalUsers: totalUsers.toString(),
      newUsers: newUsers.toString(),
      activeUsers: activeUsers.toString(),
      avgSessionDuration: formatDuration(sessionDurationSec),
      revenue: revenue.toString(),
    };
  });

  return {
    from: startDate,
    to: endDate,
    totalUsersHighestMetrics: maxTotalUsers,
    newUsersHighestMetrics: maxNewUsers,
    activeUsersHighestMetrics: maxActiveUsers,
    avgSessionDurationHighestMetrics: formatDuration(maxDurationSeconds),
    revenueHighestMetrics: maxRevenue.toString(),
    data
  };
}

module.exports = { getUserMetrics };
