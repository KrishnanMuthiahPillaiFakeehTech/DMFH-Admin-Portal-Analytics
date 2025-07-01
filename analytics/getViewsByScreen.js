const { analyticsDataClient, PROPERTY_ID } = require('./client');

async function getViewsByScreen(startDateStr, endDateStr) {
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate: startDateStr, endDate: endDateStr }],
      dimensions: [{ name: 'screenName' }],
      metrics: [{ name: 'screenPageViews' }],
      orderBys: [{
        metric: { metricName: 'screenPageViews' },
        desc: true,
      }],
      limit: 20,
    });

    return (response.rows || []).map(row => ({
      screenName: row.dimensionValues?.[0]?.value || '(not set)',
      views: parseInt(row.metricValues?.[0]?.value || '0', 10),
    }));
  } catch (error) {
    console.error('GA API error details:', error?.response?.data || error.message || error);
    throw new Error(
      error?.response?.data?.error?.message || 'Unexpected error from Analytics API'
    );
  }
}


module.exports = { getViewsByScreen };
