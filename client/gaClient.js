const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const key = require('../service-account.json');
const config = require('../config.json');
const gaApiLimiter = require('../utils/throttle');

// 🟢 Initialize Analytics Data API client
const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: key,
});

const PROPERTY_ID = config.GA4_PROPERTY_ID;

// ✅ Throttled GA4 runReport wrapper
const RETRY_LIMIT = 3;

async function runReportWithThrottle(request, attempt = 1) {
  try {
    return await gaApiLimiter(() =>
      analyticsDataClient.runReport({
        property: `properties/${PROPERTY_ID}`,
        ...request
      })
    );
  } catch (error) {
    const isRetryable =
      error.code === 8 || // RESOURCE_EXHAUSTED
      error.code === 429 || // Too many requests
      error.message?.includes('rate');

    if (isRetryable && attempt <= RETRY_LIMIT) {
      const delay = 500 * attempt; // Backoff strategy
      console.warn(`Retrying GA request in ${delay}ms (attempt ${attempt})...`);
      await new Promise((r) => setTimeout(r, delay));
      return runReportWithThrottle(request, attempt + 1);
    }

    // Final failure
    console.error('GA runReport failed:', error.message);
    throw error;
  }
}

module.exports = {
  runReportWithThrottle,
  analyticsDataClient,
  PROPERTY_ID,
};
