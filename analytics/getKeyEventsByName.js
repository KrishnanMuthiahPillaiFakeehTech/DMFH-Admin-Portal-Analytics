const { runReportWithThrottle } = require('../client/gaClient');

async function getKeyEventsByName(startDateStr, endDateStr, limit = 10) {
  const [response] = await runReportWithThrottle({
    dateRanges: [{ startDate: startDateStr, endDate: endDateStr }],
    dimensions: [{ name: 'eventName' }],
    metrics: [{ name: 'keyEvents' }],
    orderBys: [{
      metric: { metricName: 'keyEvents' },
      desc: true,
    }],
    limit: parseInt(limit, 10) || 10,
  });

  return (response.rows || []).map(row => ({
    eventName: row.dimensionValues?.[0]?.value || '(not set)',
    keyEvents: parseInt(row.metricValues?.[0]?.value || '0', 10),
  }));
}

module.exports = { getKeyEventsByName };