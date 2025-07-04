const { analyticsDataClient, PROPERTY_ID } = require('./client');

async function getKeyEventsByName(startDateStr, endDateStr, limit = 10) {
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${PROPERTY_ID}`,
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
  } catch (error) {
    console.error('GA Key Event API error:', JSON.stringify(error, null, 2));
    throw new Error(
      error?.response?.data?.error?.message || error.message || 'Unexpected Analytics API error'
    );
  }
}

module.exports = { getKeyEventsByName };