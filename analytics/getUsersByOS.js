const { runReportWithThrottle } = require('../client/gaClient');

async function getUsersByOS(metricName = 'activeUsers', startDateStr, endDateStr) {
  const [response] = await runReportWithThrottle({
    dateRanges: [{ startDate: startDateStr, endDate: endDateStr }],
    dimensions: [{ name: 'operatingSystem' }],
    metrics: [{ name: metricName }],
    orderBys: [{
      metric: { metricName },
      desc: true,
    }],
  });

  return (response.rows || []).map(row => ({
    os: row.dimensionValues?.[0]?.value || '(not set)',
    [metricName]: parseInt(row.metricValues?.[0]?.value || '0', 10),
  }));
}

module.exports = { getUsersByOS };
