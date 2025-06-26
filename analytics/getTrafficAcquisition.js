const { analyticsDataClient, PROPERTY_ID } = require('./client');

async function getTrafficAcquisition(dimName, metricName, startDate, endDate) {
  const [response] = await analyticsDataClient.runReport({
    property: `properties/${PROPERTY_ID}`,
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