const { runReportWithThrottle } = require('../client/gaClient');

async function getUsersByCountry(metricName, startDate, endDate) {
  if (!['activeUsers', 'newUsers'].includes(metricName)) {
    throw new Error(`Unsupported metric: ${metricName}`);
  }

  const [response] = await runReportWithThrottle({
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: 'country' }],
    metrics: [{ name: metricName }],
    orderBys: [{
      metric: { metricName },
      desc: true
    }]
  });

  return response.rows?.map(row => ({
    label: row.dimensionValues[0]?.value || 'Unknown',
    [metricName]: parseInt(row.metricValues[0]?.value || '0', 10)
  })) || [];
}

module.exports = { getUsersByCountry };