const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const key = require('../service-account.json');
const config = require('../config.json');

const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: key,
});

const PROPERTY_ID = config.GA4_PROPERTY_ID;
module.exports = {
  analyticsDataClient,
  PROPERTY_ID,
};