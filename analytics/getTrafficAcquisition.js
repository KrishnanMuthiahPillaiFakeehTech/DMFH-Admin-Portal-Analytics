const { runReportWithThrottle } = require('../client/gaClient');

async function getTrafficAcquisition(dimName, metricName, startDate, endDate) {
  const [response] = await runReportWithThrottle({
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: dimName }],
    metrics: [{ name: metricName }],
    orderBys: [{ metric: { metricName }, desc: true }],
  });

  return response.rows?.map(row => ({
    label: row.dimensionValues[0]?.value || 'Unknown',
    [metricName]: parseInt(row.metricValues[0]?.value || '0', 10),
  })) || [];
}

module.exports = { getTrafficAcquisition };