const { runReportWithThrottle } = require('../client/gaClient');

async function getNewUsersByAttribution(dimName, startDate, endDate) {
  const [response] = await runReportWithThrottle({
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: dimName }],
    metrics: [{ name: 'newUsers' }],
    orderBys: [{ metric: { metricName: 'newUsers' }, desc: true }],
  });

  return response.rows?.map(row => ({
    label: row.dimensionValues[0]?.value || 'Unknown',
    newUsers: parseInt(row.metricValues[0]?.value || '0', 10),
  })) || [];
}

module.exports = { getNewUsersByAttribution };