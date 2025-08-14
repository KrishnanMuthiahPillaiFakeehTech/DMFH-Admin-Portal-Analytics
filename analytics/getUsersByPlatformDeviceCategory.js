const { runReportWithThrottle } = require('../client/gaClient');

async function getUsersByPlatformDeviceCategory(startDateStr, endDateStr, metric = 'activeUsers') {
  const [response] = await runReportWithThrottle({
    dateRanges: [{ startDate: startDateStr, endDate: endDateStr }],
    dimensions: [
      { name: 'platform' },
      { name: 'deviceCategory' }
    ],
    metrics: [{ name: metric }],
    orderBys: [{
      metric: { metricName: metric },
      desc: true
    }]
  });

  return (response.rows || []).map(row => ({
    platform: row.dimensionValues?.[0]?.value || '(not set)',
    deviceCategory: row.dimensionValues?.[1]?.value || '(not set)',
    [metric]: parseInt(row.metricValues?.[0]?.value || '0', 10)
  }));
}

module.exports = { getUsersByPlatformDeviceCategory };