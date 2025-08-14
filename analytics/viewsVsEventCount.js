const { runReportWithThrottle } = require('../client/gaClient');
const { formatDate } = require('../utils/utils');

async function getViewsVsEventCountTrend(startDateStr, endDateStr) {
  const [response] = await runReportWithThrottle({
    dateRanges: [{ startDate: startDateStr, endDate: endDateStr }],
    dimensions: [{ name: 'date' }],
    metrics: [
      { name: 'eventCount' },
      { name: 'screenPageViews' }
    ],
    orderBys: [{ dimension: { dimensionName: 'date' } }]
  });

  let totalEventCount = 0;
  let totalViews = 0;

  const data = (response.rows || []).map(row => {
    const rawDate = row.dimensionValues?.[0]?.value || '';
    const eventCount = parseInt(row.metricValues?.[0]?.value || '0', 10);
    const views = parseInt(row.metricValues?.[1]?.value || '0', 10);

    totalEventCount += eventCount;
    totalViews += views;

    return {
      date: formatDate(rawDate),
      eventCount,
      views
    };
  });

  return {
    from: startDateStr,
    to: endDateStr,
    totalEventCount,
    totalViews,
    data
  };
}

module.exports = { getViewsVsEventCountTrend };
