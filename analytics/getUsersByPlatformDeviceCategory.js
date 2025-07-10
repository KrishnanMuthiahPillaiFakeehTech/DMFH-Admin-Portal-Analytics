const { analyticsDataClient, PROPERTY_ID } = require('./client');

/**
 * Get user counts (activeUsers or newUsers) by platform/deviceCategory.
 * @param {string} startDateStr - Start date in YYYY-MM-DD format
 * @param {string} endDateStr - End date in YYYY-MM-DD format
 * @param {string} metric - 'activeUsers' or 'newUsers'
 */
async function getUsersByPlatformDeviceCategory(startDateStr, endDateStr, metric = 'activeUsers') {
  const allowedMetrics = ['activeUsers', 'newUsers'];
  const selectedMetric = allowedMetrics.includes(metric) ? metric : 'activeUsers';

  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate: startDateStr, endDate: endDateStr }],
      dimensions: [
        { name: 'platform' },
        { name: 'deviceCategory' }
      ],
      metrics: [{ name: selectedMetric }],
      orderBys: [{
        metric: { metricName: selectedMetric },
        desc: true
      }]
    });

    return (response.rows || []).map(row => ({
      platform: row.dimensionValues?.[0]?.value || '(not set)',
      deviceCategory: row.dimensionValues?.[1]?.value || '(not set)',
      [selectedMetric]: parseInt(row.metricValues?.[0]?.value || '0', 10)
    }));
  } catch (error) {
    console.error('Error fetching users by platform/device:', error.message);
    throw new Error('Failed to fetch users by platform and device category');
  }
}

module.exports = { getUsersByPlatformDeviceCategory };
