const { runReportWithThrottle } = require('../client/gaClient');

async function getMetricByPlatform(startDateStr, endDateStr, metric = 'eventCount') {
  const [response] = await runReportWithThrottle({
    dateRanges: [{ startDate: startDateStr, endDate: endDateStr }],
    dimensions: [{ name: 'platform' }],
    metrics: [{ name: metric }],
    orderBys: [
      {
        metric: { metricName: metric },
        desc: true,
      },
    ],
  });

  const total = response.rows.reduce(
    (sum, row) => sum + parseFloat(row.metricValues[0].value || '0'),
    0
  );

  return (response.rows || []).map(row => {
    const platform = row.dimensionValues?.[0]?.value || '(not set)';
    const value = parseFloat(row.metricValues?.[0]?.value || '0');
    const percentage = total ? Math.round((value / total) * 1000) / 10 : 0;
    return { platform, value, percentage };
  });
}

module.exports = { getMetricByPlatform };