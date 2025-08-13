const { formatDate } = require('../utils/utils');
const { runReportWithThrottle } = require('../client/gaClient');


// 🔄 Helper to fetch active30DayUsers for a specific date, throttled
async function getActive30DayUsersOnDate(endDate) {
  const end = new Date(
    `${endDate.slice(0, 4)}-${endDate.slice(4, 6)}-${endDate.slice(6, 8)}`
  );

  const start = new Date(end);
  start.setDate(end.getDate() - 29);

  const startDate = start.toISOString().slice(0, 10);
  const endDateStr = end.toISOString().slice(0, 10);

  const [response] = await runReportWithThrottle({
    dateRanges: [{ startDate, endDate: endDateStr }],
    metrics: [{ name: 'activeUsers' }]
  });

  return parseInt(response.rows?.[0]?.metricValues?.[0]?.value || '0', 10);
}

// 📊 Main function to build trend with 1d, 7d, 30d active users
async function getActiveUsersTrend(startDate, endDate) {
  const [response] = await runReportWithThrottle({
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: 'date' }],
    metrics: [
      { name: 'active1DayUsers' },
      { name: 'active7DayUsers' }
    ],
    orderBys: [{ dimension: { dimensionName: 'date' }, desc: false }]
  });

  if (!response.rows) return [];

  const trend = await Promise.all(
    response.rows.map(async (row) => {
      const rawDate = row.dimensionValues[0]?.value;
      const formattedDate = formatDate(rawDate);

      const active1DayUsers = parseInt(row.metricValues?.[0]?.value || '0', 10);
      const active7DayUsers = parseInt(row.metricValues?.[1]?.value || '0', 10);

      const active30DayUsers = await getActive30DayUsersOnDate(rawDate); // ✅ throttled

      return {
        date: formattedDate,
        active1DayUsers,
        active7DayUsers,
        active30DayUsers
      };
    })
  );

  return {
    from: startDate,
    to: endDate,
    trend
  };
}

module.exports = { getActiveUsersTrend };
