const { analyticsDataClient, PROPERTY_ID } = require('./client');

async function getUserActivityOverview(startDate, endDate) {
  const [response] = await analyticsDataClient.runReport({
    property: `properties/${PROPERTY_ID}`,
    dateRanges: [{ startDate, endDate }],
    metrics: [
      { name: 'active1DayUsers' },
      { name: 'active7DayUsers' },
      { name: 'active28DayUsers' }
    ]
  });

  const values = response.rows?.[0]?.metricValues || [];

  return {
    active1DayUsers: parseInt(values[0]?.value || '0', 10),
    active7DayUsers: parseInt(values[1]?.value || '0', 10),
    active28DayUsers: parseInt(values[2]?.value || '0', 10)
  };
}

module.exports = { getUserActivityOverview };