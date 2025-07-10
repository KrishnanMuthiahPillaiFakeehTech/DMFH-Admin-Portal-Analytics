const { analyticsDataClient, PROPERTY_ID } = require('./client');

async function getUsersByOS(metricName = 'activeUsers', startDateStr, endDateStr) {
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${PROPERTY_ID}`,
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
  } catch (error) {
    console.error(`Users by OS error for metric ${metricName}:`, error.message);
    throw new Error(`Failed to fetch ${metricName} by OS`);
  }
}

module.exports = { getUsersByOS };
