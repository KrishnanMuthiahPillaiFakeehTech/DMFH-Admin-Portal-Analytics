const { analyticsDataClient, PROPERTY_ID } = require('./client');

async function getMetricByPlatform(startDateStr, endDateStr, metric = 'eventCount') {
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${PROPERTY_ID}`,
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

    // Total to calculate % share
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
  } catch (error) {
    console.error('GA API error:', JSON.stringify(error, null, 2));
    throw new Error(
      error?.response?.data?.error?.message || error.message || 'Unexpected GA API error'
    );
  }
}

module.exports = { getMetricByPlatform };
