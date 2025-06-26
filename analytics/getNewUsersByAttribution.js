const { analyticsDataClient, PROPERTY_ID } = require('./client');

async function getNewUsersByAttribution(dimName, startDate, endDate) {
  const [response] = await analyticsDataClient.runReport({
    property: `properties/${PROPERTY_ID}`,
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